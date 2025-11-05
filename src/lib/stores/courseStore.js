// src/lib/stores/courseStore.js
import { writable } from 'svelte/store';

// Mock course data
const mockCourseGroups = [
	{
		id: 'gen-ed',
		name: 'กลุ่มศึกษาทั่วไป',
		required: 10,
		completed: 1,
		courses: [
			{ code: 'GEN101', name: 'ความเป็นพลเมืองไทยและพลเมืองโลก', credits: 3, completed: true, grade: 'A', semester: '1/2023' },
			{ code: 'GEN102', name: 'ศาสตร์แห่งความสุข', credits: 3, completed: false },
			{ code: 'GEN201', name: 'การคิดเชิงออกแบบ', credits: 2, completed: false },
			{ code: 'GEN202', name: 'ศิลปะการใช้ชีวิต', credits: 2, completed: false },
			{ code: 'ENG101', name: 'English for Communication I', credits: 3, completed: false },
			{ code: 'ENG102', name: 'English for Communication II', credits: 3, completed: false },
			{ code: 'MTH101', name: 'แคลคูลัส I', credits: 3, completed: false },
			{ code: 'PHY101', name: 'ฟิสิกส์พื้นฐาน', credits: 3, completed: false },
			{ code: 'CHE101', name: 'เคมีพื้นฐาน', credits: 3, completed: false },
			{ code: 'BIO101', name: 'ชีววิทยาพื้นฐาน', credits: 3, completed: false }
		]
	},
	{
		id: 'major',
		name: 'กลุ่มวิชาหลัก',
		required: 7,
		completed: 2,
		courses: [
			{ code: 'CS101', name: 'Introduction to Computer Science', credits: 3, completed: true, grade: 'A', semester: '1/2023' },
			{ code: 'CS102', name: 'Programming Fundamentals', credits: 3, completed: true, grade: 'B+', semester: '2/2023' },
			{ code: 'CS201', name: 'Data Structures', credits: 3, completed: false },
			{ code: 'CS202', name: 'Algorithm Design', credits: 3, completed: false },
			{ code: 'CS301', name: 'Database Systems', credits: 3, completed: false },
			{ code: 'CS302', name: 'Software Engineering', credits: 3, completed: false },
			{ code: 'CS401', name: 'Artificial Intelligence', credits: 3, completed: false }
		]
	},
	{
		id: 'elective',
		name: 'กลุ่มวิชาเลือก',
		required: 5,
		completed: 0,
		courses: [
			{ code: 'CS311', name: 'Web Development', credits: 3, completed: false },
			{ code: 'CS312', name: 'Mobile App Development', credits: 3, completed: false },
			{ code: 'CS313', name: 'Machine Learning', credits: 3, completed: false },
			{ code: 'CS314', name: 'Computer Networks', credits: 3, completed: false },
			{ code: 'CS315', name: 'Cybersecurity', credits: 3, completed: false }
		]
	}
];

// Create a writable store
export const courseGroups = writable(mockCourseGroups);

// Helper function to get a specific course group by ID
export function getCourseGroupById(id) {
	let group = null;
	courseGroups.subscribe(groups => {
		group = groups.find(g => g.id === id);
	})();
	return group;
}