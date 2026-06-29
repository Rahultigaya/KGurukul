// src/pages/admin/Master/masterStore.ts

import { fetchWithAuth } from "../../../api/common";

const API_BASE_URL = "http://127.0.0.1:8000"; // Update this to match your backend URL

export interface Area {
  id: string | number;
  name: string;
  is_active: number; // Changed from isActive to is_active (number)
  created_at?: string; // Changed from createdAt to created_at
}

export interface Branch {
  id: string | number;
  name: string;
  area_id: string | number; // Changed from areaId to area_id
  area_name?: string; // For display purposes
  is_active: number;
  created_at?: string;
}

export interface Standard {
  id: string | number;
  name: string;
  is_active: number;
  created_at?: string;
}

export interface Subject {
  id: string | number;
  name: string;
  is_active: number;
  created_at?: string;
}

export interface Teacher {
  id: string | number;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  joining_date: string;
  status: "Active" | "Inactive";
}

export interface TeacherFormData {
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  joining_date: string;
}

// API Response types
interface AreaResponse {
  id: number;
  name: string;
  is_active: number;
  created_at: string;
}

interface BranchResponse {
  id: number;
  name: string;
  area_id: number;
  is_active: number;
  created_at: string;
}

interface StandardResponse {
  id: number;
  name: string;
  is_active: number;
  created_at: string;
}

interface SubjectResponse {
  id: number;
  name: string;
  is_active: number;
  created_at: string;
}

interface TeacherResponse {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  joining_date: string;
  status: "Active" | "Inactive";
}

// ==================== AREA FUNCTIONS ====================

export const getAllAreas = async (): Promise<Area[]> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/areas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.map((area: AreaResponse) => ({
      id: area.id,
      name: area.name,
      is_active: area.is_active,
      created_at: area.created_at,
    }));
  } catch (error) {
    console.error("Error fetching areas:", error);
    throw error;
  }
};

export const getAreaById = async (id: string | number): Promise<Area | null> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/area/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AreaResponse = await response.json();
    return {
      id: data.id,
      name: data.name,
      is_active: data.is_active,
      created_at: data.created_at,
    };
  } catch (error) {
    console.error("Error fetching area:", error);
    throw error;
  }
};

export const createArea = async (area: Omit<Area, "id" | "created_at">): Promise<Area> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/area`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: area.name,
        is_active: area.is_active,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AreaResponse = await response.json();
    return {
      id: data.id,
      name: data.name,
      is_active: data.is_active,
      created_at: data.created_at,
    };
  } catch (error) {
    console.error("Error creating area:", error);
    throw error;
  }
};

export const updateArea = async (id: string | number, updates: Partial<Omit<Area, "id" | "created_at">>): Promise<Area | null> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/area/${id}`, {
      method: "PUT", // or PATCH depending on your API
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AreaResponse = await response.json();
    return {
      id: data.id,
      name: data.name,
      is_active: data.is_active,
      created_at: data.created_at,
    };
  } catch (error) {
    console.error("Error updating area:", error);
    throw error;
  }
};

export const deleteArea = async (id: string | number): Promise<boolean> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/area/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) return false;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting area:", error);
    throw error;
  }
};

export const toggleAreaActive = async (id: string | number): Promise<Area | null> => {
  try {
    // First get current area
    const area = await getAreaById(id);
    if (!area) return null;

    // Then toggle the is_active status
    return await updateArea(id, { is_active: area.is_active === 1 ? 0 : 1 });
  } catch (error) {
    console.error("Error toggling area active status:", error);
    throw error;
  }
};

// ==================== BRANCH FUNCTIONS ====================

export const getAllBranches = async (): Promise<Branch[]> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/branches`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.map((branch: BranchResponse) => ({
      id: branch.id,
      name: branch.name,
      area_id: branch.area_id,
      is_active: branch.is_active,
      created_at: branch.created_at,
    }));
  } catch (error) {
    console.error("Error fetching branches:", error);
    throw error;
  }
};

export const getBranchesByArea = async (areaId: string | number): Promise<Branch[]> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/branch/area/${areaId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.map((branch: BranchResponse) => ({
      id: branch.id,
      name: branch.name,
      area_id: branch.area_id,
      is_active: branch.is_active,
      created_at: branch.created_at,
    }));
  } catch (error) {
    console.error("Error fetching branches by area:", error);
    throw error;
  }
};

export const getBranchById = async (id: string | number): Promise<Branch | null> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/branch/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BranchResponse = await response.json();
    return {
      id: data.id,
      name: data.name,
      area_id: data.area_id,
      is_active: data.is_active,
      created_at: data.created_at,
    };
  } catch (error) {
    console.error("Error fetching branch:", error);
    throw error;
  }
};

export const createBranch = async (branch: Omit<Branch, "id" | "created_at" | "area_name">): Promise<Branch> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/branch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: branch.name,
        area_id: branch.area_id,
        is_active: branch.is_active,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BranchResponse = await response.json();
    return {
      id: data.id,
      name: data.name,
      area_id: data.area_id,
      is_active: data.is_active,
      created_at: data.created_at,
    };
  } catch (error) {
    console.error("Error creating branch:", error);
    throw error;
  }
};

export const updateBranch = async (id: string | number, updates: Partial<Omit<Branch, "id" | "created_at" | "area_name">>): Promise<Branch | null> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/branch/${id}`, {
      method: "PUT", // or PATCH depending on your API
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BranchResponse = await response.json();
    return {
      id: data.id,
      name: data.name,
      area_id: data.area_id,
      is_active: data.is_active,
      created_at: data.created_at,
    };
  } catch (error) {
    console.error("Error updating branch:", error);
    throw error;
  }
};

export const deleteBranch = async (id: string | number): Promise<boolean> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/branch/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) return false;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting branch:", error);
    throw error;
  }
};

export const toggleBranchActive = async (id: string | number): Promise<Branch | null> => {
  try {
    // First get current branch
    const branch = await getBranchById(id);
    if (!branch) return null;

    // Then toggle the is_active status
    return await updateBranch(id, { is_active: branch.is_active === 1 ? 0 : 1 });
  } catch (error) {
    console.error("Error toggling branch active status:", error);
    throw error;
  }
};

// ==================== STANDARD FUNCTIONS ====================

export const getAllStandards = async (): Promise<Standard[]> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/standard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.map((standard: StandardResponse) => ({
      id: standard.id,
      name: standard.name,
      is_active: standard.is_active,
      created_at: standard.created_at,
    }));
  } catch (error) {
    console.error("Error fetching standards:", error);
    throw error;
  }
};

export const getStandardById = async (id: string | number): Promise<Standard | null> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/standard/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: StandardResponse = await response.json();
    return {
      id: data.id,
      name: data.name,
      is_active: data.is_active,
      created_at: data.created_at,
    };
  } catch (error) {
    console.error("Error fetching standard:", error);
    throw error;
  }
};

export const createStandard = async (standard: Omit<Standard, "id" | "created_at">): Promise<Standard> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/standards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: standard.name,
        is_active: standard.is_active,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: StandardResponse = await response.json();
    return {
      id: data.id,
      name: data.name,
      is_active: data.is_active,
      created_at: data.created_at,
    };
  } catch (error) {
    console.error("Error creating standard:", error);
    throw error;
  }
};

export const updateStandard = async (id: string | number, updates: Partial<Omit<Standard, "id" | "created_at">>): Promise<Standard | null> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/standard/${id}`, {
      method: "PUT", // or PATCH depending on your API
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: StandardResponse = await response.json();
    return {
      id: data.id,
      name: data.name,
      is_active: data.is_active,
      created_at: data.created_at,
    };
  } catch (error) {
    console.error("Error updating standard:", error);
    throw error;
  }
};

export const deleteStandard = async (id: string | number): Promise<boolean> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/standard/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) return false;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting standard:", error);
    throw error;
  }
};

export const toggleStandardActive = async (id: string | number): Promise<Standard | null> => {
  try {
    // First get current standard
    const standard = await getStandardById(id);
    if (!standard) return null;

    // Then toggle the is_active status
    return await updateStandard(id, { is_active: standard.is_active === 1 ? 0 : 1 });
  } catch (error) {
    console.error("Error toggling standard active status:", error);
    throw error;
  }
};

// ==================== SUBJECT FUNCTIONS ====================

export const getAllSubjects = async (): Promise<Subject[]> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/subjects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.map((subject: SubjectResponse) => ({
      id: subject.id,
      name: subject.name,
      is_active: subject.is_active,
      created_at: subject.created_at,
    }));
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

export const getSubjectById = async (id: string | number): Promise<Subject | null> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/subject/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SubjectResponse = await response.json();
    return {
      id: data.id,
      name: data.name,
      is_active: data.is_active,
      created_at: data.created_at,
    };
  } catch (error) {
    console.error("Error fetching subject:", error);
    throw error;
  }
};

export const createSubject = async (subject: Omit<Subject, "id" | "created_at">): Promise<Subject> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/subject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: subject.name,
        is_active: subject.is_active,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SubjectResponse = await response.json();
    return {
      id: data.id,
      name: data.name,
      is_active: data.is_active,
      created_at: data.created_at,
    };
  } catch (error) {
    console.error("Error creating subject:", error);
    throw error;
  }
};

export const updateSubject = async (id: string | number, updates: Partial<Omit<Subject, "id" | "created_at">>): Promise<Subject | null> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/subject/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SubjectResponse = await response.json();
    return {
      id: data.id,
      name: data.name,
      is_active: data.is_active,
      created_at: data.created_at,
    };
  } catch (error) {
    console.error("Error updating subject:", error);
    throw error;
  }
};

export const deleteSubject = async (id: string | number): Promise<boolean> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/subject/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) return false;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting subject:", error);
    throw error;
  }
};

export const toggleSubjectActive = async (id: string | number): Promise<Subject | null> => {
  try {
    const subject = await getSubjectById(id);
    if (!subject) return null;

    return await updateSubject(id, { is_active: subject.is_active === 1 ? 0 : 1 });
  } catch (error) {
    console.error("Error toggling subject active status:", error);
    throw error;
  }
};

// ==================== TEACHER FUNCTIONS ====================

export const getAllTeachers = async (): Promise<Teacher[]> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/teachers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.map((teacher: TeacherResponse) => ({
      id: teacher.id,
      first_name: teacher.first_name,
      middle_name: teacher.middle_name,
      last_name: teacher.last_name,
      email: teacher.email,
      joining_date: teacher.joining_date,
      status: teacher.status,
    }));
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

export const getTeacherById = async (id: string | number): Promise<Teacher | null> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/teacher/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TeacherResponse = await response.json();
    return {
      id: data.id,
      first_name: data.first_name,
      middle_name: data.middle_name,
      last_name: data.last_name,
      email: data.email,
      joining_date: data.joining_date,
      status: data.status,
    };
  } catch (error) {
    console.error("Error fetching teacher:", error);
    throw error;
  }
};

export const createTeacher = async (teacher: TeacherFormData): Promise<Teacher> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/teacher`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teacher),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TeacherResponse = await response.json();
    return {
      id: data.id,
      first_name: data.first_name,
      middle_name: data.middle_name,
      last_name: data.last_name,
      email: data.email,
      joining_date: data.joining_date,
      status: data.status,
    };
  } catch (error) {
    console.error("Error creating teacher:", error);
    throw error;
  }
};

export const updateTeacher = async (id: string | number, updates: Partial<TeacherFormData>): Promise<Teacher | null> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/teacher/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TeacherResponse = await response.json();
    return {
      id: data.id,
      first_name: data.first_name,
      middle_name: data.middle_name,
      last_name: data.last_name,
      email: data.email,
      joining_date: data.joining_date,
      status: data.status,
    };
  } catch (error) {
    console.error("Error updating teacher:", error);
    throw error;
  }
};

export const deleteTeacher = async (id: string | number): Promise<boolean> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/teacher/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) return false;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting teacher:", error);
    throw error;
  }
};

// Helper function to get full name
export const getTeacherFullName = (teacher: Teacher): string => {
  const parts = [teacher.first_name];
  if (teacher.middle_name) parts.push(teacher.middle_name);
  parts.push(teacher.last_name);
  return parts.join(" ");
};
