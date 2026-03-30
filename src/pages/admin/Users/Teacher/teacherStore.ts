// src/pages/admin/Users/Teacher/teacherStore.ts

import { createTeacher, getTeachers, type TeacherResponse } from "../../../../api/api";

// ✅ Strict status type
export type Status = "Active" | "Inactive";

// ✅ Main Teacher model (clean — no derived fields)
export interface TeacherData {
  id: string | number;
  photo?: string | null;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  joiningDate: string; // ISO format (YYYY-MM-DD)
  status: Status;
}

// ✅ Form data type
export type TeacherFormData = Pick<
  TeacherData,
  "photo" | "firstName" | "middleName" | "lastName" | "email" | "joiningDate"
>;

// ✅ Empty form default
export const emptyTeacherForm: TeacherFormData = {
  photo: null,
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  joiningDate: new Date().toISOString().split("T")[0],
};

// 🔧 Helper: Build full name
function buildName(f: string, m: string, l: string): string {
  return [f, m, l].filter(Boolean).join(" ");
}

// 🔧 Helper: Format joining date
function formatJoined(date: string): string {
  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// 🔧 Helper: Transform API response to UI model (derived fields)
export function mapTeacher(data: TeacherResponse): TeacherData {
  return {
    id: data.id,
    photo: null,
    firstName: data.first_name,
    middleName: data.middle_name,
    lastName: data.last_name,
    email: data.email,
    joiningDate: data.joining_date,
    status: data.status,
  };
}

// 🔧 Helper: Transform for UI display (with derived fields)
export function formatTeacherForUI(data: TeacherData) {
  return {
    ...data,
    name: buildName(data.firstName, data.middleName, data.lastName),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.firstName}`,
    joined: formatJoined(data.joiningDate),
  };
}

// 🗄️ In-memory cache (updated from API)
export const teacherStore: Record<string, TeacherData> = {};

// 📥 Get all teachers from API
export async function getAllTeachers(): Promise<TeacherData[]> {
  try {
    const response = await getTeachers();
    const teachers = response.data;

    // Update cache
    teachers.forEach((teacher) => {
      teacherStore[String(teacher.id)] = mapTeacher(teacher);
    });

    // Return formatted teachers
    return teachers.map((t) => formatTeacherForUI(mapTeacher(t)));
  } catch (error: any) {
    console.error("Error fetching teachers:", error);

    // Extract error message
    if (error.response?.data?.detail) {
      if (typeof error.response.data.detail === 'string') {
        throw new Error(error.response.data.detail);
      } else if (Array.isArray(error.response.data.detail)) {
        throw new Error(error.response.data.detail.map((e: any) => e.msg || e.message).join(', '));
      }
    }

    throw error;
  }
}

// 📥 Get one teacher (from cache or API)
export async function getTeacherById(id: string): Promise<TeacherData | null> {
  try {
    // First try cache
    if (teacherStore[id]) {
      return formatTeacherForUI(teacherStore[id]);
    }

    // If not in cache, fetch all teachers
    await getAllTeachers();

    // Try cache again
    if (teacherStore[id]) {
      return formatTeacherForUI(teacherStore[id]);
    }

    return null;
  } catch (error) {
    console.error("Error fetching teacher:", error);
    return null;
  }
}

// ➕ Add teacher (API-based)
export async function addTeacher(data: TeacherFormData): Promise<string> {
  try {
    const response = await createTeacher({
      email: data.email,
      first_name: data.firstName,
      middle_name: data.middleName || "",
      last_name: data.lastName,
      joining_date: data.joiningDate,
    });

    // The response contains the message "Teacher created successfully"
    // Return a generated ID based on timestamp
    const id = `T${String(Date.now()).slice(-4)}`;

    // Store in local cache for immediate display
    teacherStore[id] = {
      id,
      photo: data.photo,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      email: data.email,
      joiningDate: data.joiningDate,
      status: "Active",
    };

    return id;
  } catch (error: any) {
    console.error("Error creating teacher:", error);

    // Extract error message from response
    if (error.response?.data?.detail) {
      if (typeof error.response.data.detail === 'string') {
        throw new Error(error.response.data.detail);
      } else if (Array.isArray(error.response.data.detail)) {
        throw new Error(error.response.data.detail.map((e: any) => e.msg || e.message).join(', '));
      }
    }

    throw error;
  }
}

// ✏️ Update teacher (local only - add API endpoint when available)
export async function updateTeacher(id: string, data: TeacherFormData): Promise<void> {
  const existing = teacherStore[id];
  if (!existing) return;

  // TODO: Add API call when update endpoint is available
  // await updateTeacherAPI(id, data);

  teacherStore[id] = {
    ...existing,
    ...data,
  };
}