// src/pages/admin/Users/Teacher/teacherStore.ts

export interface TeacherData {
  id: number;
  name: string;
  avatar: string;
  subject: string;
  status: string;
  joined: string;
  students: number;
}

export const teacherStore: Record<string, TeacherData> = {
  "1": {
    id: 1,
    name: "Dr. Emily Brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    subject: "Mathematics",
    status: "Active",
    joined: "12 Jan, 2015",
    students: 45,
  },
  "2": {
    id: 2,
    name: "Prof. David Lee",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    subject: "Science",
    status: "Active",
    joined: "05 Mar, 2016",
    students: 38,
  },
  "3": {
    id: 3,
    name: "Ms. Rachel Green",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel",
    subject: "English",
    status: "Active",
    joined: "20 Sep, 2015",
    students: 52,
  },
};

/** Read one teacher by id. Returns null if not found. */
export function getTeacherById(id: string): TeacherData | null {
  return teacherStore[id] ?? null;
}

/** Save updated teacher back to the store (in-memory).
 *  Replace with your API call when ready:
 *  await fetch(`/api/teachers/${id}`, { method: "PUT", body: JSON.stringify(data) })
 */
export function updateTeacher(id: string, data: TeacherData): void {
  teacherStore[id] = { ...data };
}
