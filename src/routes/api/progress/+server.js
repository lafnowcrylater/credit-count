import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { students, curriculums, enrollments, courseCatalog, curriculumCourses } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET({ locals }) {
  const user = locals.user;
  
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get student data
    const [studentData] = await db
      .select()
      .from(students)
      .where(eq(students.id, user.id));

    if (!studentData) {
      return json({ error: 'Student not found' }, { status: 404 });
    }

    // Get curriculum data
    const [curriculum] = await db
      .select()
      .from(curriculums)
      .where(eq(curriculums.id, studentData.curriculumId));

    // Get all enrollments
    const enrollmentRecords = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.studentId, user.id));

    // Get course details for enrollments
    const courseCodes = enrollmentRecords.map(e => e.courseCode);
    const courseDetails = await db
      .select()
      .from(courseCatalog)
      .where(eq(courseCatalog.code, courseCodes[0])); // Get all at once
    
    const courseMap = {};
    for (const code of courseCodes) {
      const [course] = await db
        .select()
        .from(courseCatalog)
        .where(eq(courseCatalog.code, code));
      if (course) courseMap[code] = course;
    }

    const studentEnrollments = enrollmentRecords.map(enrollment => ({
      enrollment,
      course: courseMap[enrollment.courseCode]
    }));

    // Get curriculum requirements
    const requirementRecords = await db
      .select()
      .from(curriculumCourses)
      .where(eq(curriculumCourses.curriculumId, curriculum.id));

    const requirements = [];
    for (const req of requirementRecords) {
      const [course] = await db
        .select()
        .from(courseCatalog)
        .where(eq(courseCatalog.code, req.courseCode));
      
      requirements.push({
        curriculum_courses: req,
        course_catalog: course
      });
    }

    // Calculate progress for each group
    const genEdCourses = [];
    const coreCourses = [];
    const freeElectiveCourses = [];

    let genEdCredits = 0;
    let coreCredits = 0;
    let freeElectiveCredits = 0;

    // Process enrollments
    for (const enrollment of studentEnrollments) {
      const course = enrollment.course;
      const enrollmentData = enrollment.enrollment;

      // Only count completed courses with passing grades
      if (!isPassingGrade(enrollmentData.grade)) continue;

      const courseInfo = {
        code: course.code,
        name: course.name,
        nameEn: course.nameEn,
        credits: course.credits,
        grade: enrollmentData.grade,
        semester: enrollmentData.semester
      };

      // Determine which group this course belongs to
      const group = enrollmentData.countedInGroup || determineGroup(course.code, requirements);

      if (group === 'gen_ed') {
        genEdCourses.push(courseInfo);
        genEdCredits += course.credits;
      } else if (group === 'core') {
        coreCourses.push(courseInfo);
        coreCredits += course.credits;
      } else if (group === 'free_elective') {
        freeElectiveCourses.push(courseInfo);
        freeElectiveCredits += course.credits;
      }
    }

    // Calculate overflow (when core/gen_ed exceeds requirement, overflow to free elective)
    if (genEdCredits > curriculum.genEdCreditsRequired) {
      const overflow = genEdCredits - curriculum.genEdCreditsRequired;
      freeElectiveCredits += overflow;
    }
    if (coreCredits > curriculum.coreCreditsRequired) {
      const overflow = coreCredits - curriculum.coreCreditsRequired;
      freeElectiveCredits += overflow;
    }

    return json({
      student: {
        id: studentData.id,
        fname: studentData.fname,
        lname: studentData.lname,
        degree: studentData.degree,
        faculty: studentData.faculty,
        major: studentData.major,
        yearEnrolled: studentData.yearEnrolled
      },
      curriculum: {
        id: curriculum.id,
        name: curriculum.name,
        totalCredits: curriculum.totalCreditsRequired,
        genEdRequired: curriculum.genEdCreditsRequired,
        coreRequired: curriculum.coreCreditsRequired,
        freeElectiveRequired: curriculum.freeElectiveCreditsRequired
      },
      progress: {
        genEd: {
          completed: Math.min(genEdCredits, curriculum.genEdCreditsRequired),
          required: curriculum.genEdCreditsRequired,
          courses: genEdCourses
        },
        core: {
          completed: Math.min(coreCredits, curriculum.coreCreditsRequired),
          required: curriculum.coreCreditsRequired,
          courses: coreCourses
        },
        freeElective: {
          completed: freeElectiveCredits,
          required: curriculum.freeElectiveCreditsRequired,
          courses: freeElectiveCourses
        },
        total: {
          completed: genEdCredits + coreCredits + freeElectiveCredits,
          required: curriculum.totalCreditsRequired
        }
      }
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

// Helper function to check if grade is passing
function isPassingGrade(grade) {
  const passingGrades = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'S'];
  return passingGrades.includes(grade);
}

// Helper function to determine course group from requirements
function determineGroup(courseCode, requirements) {
  const requirement = requirements.find(r => r.curriculum_courses.courseCode === courseCode);
  return requirement?.curriculum_courses.courseGroup || 'free_elective';
}