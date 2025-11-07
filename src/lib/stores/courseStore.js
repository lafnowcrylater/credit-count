// src/lib/stores/courseStore.js
import { writable } from 'svelte/store';

// Mock course data
const mockCourseGroups = [
	{
		id: 'gen-ed',
		name: 'หมวดศึกษาทั่วไป',
		required: 30,
		completed: 2,
		courses: [
			{ code: '90641001', name: 'โรงเรียนสร้างเสน่ห์', credits: 2, completed: true, grade: 'A', semester: '1/2023' },
			{ code: '90641002', name: 'ความฉลาดทางดิจิทัล', credits: 2, completed: false },
			{ code: '90641003', name: 'กีฬาและนันทนาการ', credits: 2, completed: false },
			{ code: '90644007', name: 'ภาษาอังกฤษพื้นฐาน 1', credits: 3, completed: false },
			{ code: '90644008 ', name: 'ภาษาอังกฤษพื้นฐาน 2', credits: 3, completed: false },
			{ code: '9064xxxx', name: 'วิชาเลือกหมวดภาษา', credits: 3, completed: false },
			{ code: '9064xxxx ', name: 'วิชาเลือกหมวดวิชาศึกษาทั่วไป', credits: 3, completed: false },
			{ code: 'PHY101', name: 'ฟิสิกส์พื้นฐาน', credits: 3, completed: false },
			{ code: 'CHE101', name: 'เคมีพื้นฐาน', credits: 3, completed: false },
			{ code: 'BIO101', name: 'ชีววิทยาพื้นฐาน', credits: 3, completed: false }
		]
	},
	{
		id: 'major',
		name: 'หมวดวิชาเฉพาะ',
		required: 99,
		completed: 9,
		courses: [
			{ code: '05506232', name: 'คณิตศาสตร์สำหรับวิทยาการคอมพิวเตอร์', credits: 3, completed: true, grade: 'A', semester: '1/2023' },
			{ code: '05506231', name: 'สถิติและความน่าจะเป็น', credits: 3, completed: true, grade: 'B+', semester: '1/2023' },
			{ code: '05506005', name: 'วิทยาการคอมพิวเตอร์', credits: 3, completed: true, grade: 'A', semester: '1/2023' },
			{ code: 'CS202', name: 'Algorithm Design', credits: 3, completed: false },
			{ code: 'CS301', name: 'Database Systems', credits: 3, completed: false },
			{ code: 'CS302', name: 'Software Engineering', credits: 3, completed: false },
			{ code: 'CS401', name: 'Artificial Intelligence', credits: 3, completed: false }
		]
	},
	{
		id: 'elective',
		name: 'หมวดวิชาเลือกเสรี',
		required: 6,
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