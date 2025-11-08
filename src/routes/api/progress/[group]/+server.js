import { json } from '@sveltejs/kit';
// import { db } from '$lib/server/db';
import { getDb } from '$lib/server/db';
import { students, curriculums, enrollments, courseCatalog, curriculumCourses } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

const db = await getDb();

export async function GET({ params, locals }) {
  const { group } = params; // 'gen_ed', 'core', or 'free_elective'
  const user = locals.user;
  
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get student
    const [studentData] = await db
      .select()
      .from(students)
      .where(eq(students.id, user.id));

    if (!studentData) {
      return json({ error: 'Student not found' }, { status: 404 });
    }

    // Get curriculum
    const [curriculum] = await db
      .select()
      .from(curriculums)
      .where(eq(curriculums.id, studentData.curriculumId));

    // Get curriculum requirements for this group
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

    const requiredCourses = requirements
      .filter(r => r.curriculum_courses.courseGroup === group)
      .map(r => ({
        code: r.course_catalog.code,
        name: r.course_catalog.name,
        nameEn: r.course_catalog.nameEn,
        credits: r.course_catalog.credits,
        isRequired: r.curriculum_courses.isRequired,
        category: r.curriculum_courses.category
      }));

    // Get student's enrollments
    const enrollmentRecords = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.studentId, user.id));

    const studentEnrollments = [];
    for (const enrollment of enrollmentRecords) {
      const [course] = await db
        .select()
        .from(courseCatalog)
        .where(eq(courseCatalog.code, enrollment.courseCode));
      
      studentEnrollments.push({
        enrollment,
        course
      });
    }

    const completedCourses = studentEnrollments
      .filter(e => {
        const enrollmentGroup = e.enrollment.countedInGroup || determineGroup(e.course.code, requirements);
        return enrollmentGroup === group && isPassingGrade(e.enrollment.grade);
      })
      .map(e => ({
        code: e.course.code,
        name: e.course.name,
        nameEn: e.course.nameEn,
        credits: e.course.credits,
        grade: e.enrollment.grade,
        semester: e.enrollment.semester,
        gradePoint: e.enrollment.gradePoint
      }));

    // Calculate credits
    const completedCredits = completedCourses.reduce((sum, c) => sum + c.credits, 0);
    
    let requiredCredits;
    let groupName;
    
    switch (group) {
      case 'gen_ed':
        requiredCredits = curriculum.genEdCreditsRequired;
        groupName = 'หมวดวิชาศึกษาทั่วไป';
        break;
      case 'core':
        requiredCredits = curriculum.coreCreditsRequired;
        groupName = 'หมวดวิชาเฉพาะสาขา';
        break;
      case 'free_elective':
        requiredCredits = curriculum.freeElectiveCreditsRequired;
        groupName = 'หมวดวิชาเลือกเสรี';
        break;
      default:
        return json({ error: 'Invalid group' }, { status: 400 });
    }

    // Group by category
    const coursesByCategory = {};
    
    for (const course of requiredCourses) {
      const category = course.category || 'อื่นๆ';
      if (!coursesByCategory[category]) {
        coursesByCategory[category] = {
          required: [],
          completed: []
        };
      }
      coursesByCategory[category].required.push(course);
    }

    for (const course of completedCourses) {
      // Find which category this course belongs to
      const reqCourse = requiredCourses.find(r => r.code === course.code);
      const category = reqCourse?.category || 'อื่นๆ';
      
      if (!coursesByCategory[category]) {
        coursesByCategory[category] = {
          required: [],
          completed: []
        };
      }
      coursesByCategory[category].completed.push(course);
    }

    return json({
      group: {
        id: group,
        name: groupName,
        completedCredits: Math.min(completedCredits, requiredCredits),
        requiredCredits,
        totalCompleted: completedCredits // including overflow
      },
      completedCourses,
      requiredCourses,
      coursesByCategory,
      statistics: {
        totalCourses: requiredCourses.length,
        completedCount: completedCourses.length,
        requiredCount: requiredCourses.filter(c => c.isRequired).length,
        electiveCount: requiredCourses.filter(c => !c.isRequired).length
      }
    });
  } catch (error) {
    console.error('Error fetching group details:', error);
    return json({ error: 'Failed to fetch group details' }, { status: 500 });
  }
}

function isPassingGrade(grade) {
  const passingGrades = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'S'];
  return passingGrades.includes(grade);
}

function determineGroup(courseCode, requirements) {
  const requirement = requirements.find(r => r.curriculum_courses.courseCode === courseCode);
  return requirement?.curriculum_courses.courseGroup || 'free_elective';
}