// src/pages/batches/batchStore.ts

import { fetchWithAuth } from "../../api/common";
import {
  getAllAreas,
  getAllBranches,
  getAllStandards,
  getAllSubjects,
  getAllTeachers,
  getTeacherFullName,
} from "../admin/Master/masterStore";

const API_BASE_URL = "http://127.0.0.1:8000";

export type Area = "Thane" | "Mulund";
export type BatchType = "Regular" | "Backlog" | "Recovery";
export type BatchStatus = "Active" | "Inactive" | "Completed";

export const AREAS: Area[] = ["Thane", "Mulund"];

export const BRANCHES: Record<Area, string[]> = {
  Thane: [
    "Khopat",
    "Hariniwas",
    "Lokpuram",
    "Hiranandani Estate",
    "Kolshet Road",
  ],
  Mulund: ["Konark Darshan", "Jay Commercial Plaza"],
};

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const BATCH_TYPES: BatchType[] = ["Regular", "Backlog", "Recovery"];
export const BATCH_STATUSES: BatchStatus[] = [
  "Active",
  "Inactive",
  "Completed",
];

export const BATCH_TYPE_META: Record<
  BatchType,
  { color: string; description: string }
> = {
  Regular: {
    color: "blue",
    description: "Main batch — 1 per student per subject",
  },
  Backlog: { color: "orange", description: "Previous standard revision batch" },
  Recovery: {
    color: "violet",
    description: "Catch-up batch for missed lectures",
  },
};

export const BATCH_STATUS_META: Record<BatchStatus, { color: string }> = {
  Active: { color: "green" },
  Inactive: { color: "yellow" },
  Completed: { color: "gray" },
};

export interface AssignedStudent {
  id: string;
  name: string;
  firstName?: string;
  surname?: string;
  email?: string;
  contactNo?: string;
  rollNo?: string;
  standard?: string;
  photo?: string | null;
}

export interface Batch {
  id: string;
  name: string;
  type: BatchType;
  status: BatchStatus;
  area: Area;
  branch: string;
  day: string;
  timeSlot: string;
  subject: string;
  standard: string;
  teacherId: string;
  teacherName: string;
  capacity: number;
  studentIds: string[];
  students?: AssignedStudent[];
  createdAt: string;
  completedAt?: string;
  area_id?: number;
  branch_id?: number;
  subject_id?: number;
  standard_id?: number;
  teacher_id?: number;
  start_time?: string;
  end_time?: string;
}

// ── Assignment rules ──────────────────────────────────────────────────────────
// Regular  → student can have only 1 regular batch per subject
// Backlog  → student can have multiple, but not same subject+standard combo twice
// Recovery → always allowed, just check capacity

export type AssignResult = { ok: true } | { ok: false; reason: string };

export function canAssignStudent(
  studentId: string,
  targetBatch: Batch,
  allBatches: Batch[],
): AssignResult {
  // Already in this batch
  if (targetBatch.studentIds.includes(studentId))
    return { ok: false, reason: "Student is already assigned to this batch." };

  // Batch full
  if (targetBatch.studentIds.length >= targetBatch.capacity)
    return { ok: false, reason: "Batch is at full capacity." };

  // Batch not active
  if (targetBatch.status !== "Active")
    return {
      ok: false,
      reason: "Cannot assign to an inactive or completed batch.",
    };

  const studentBatches = allBatches.filter((b) =>
    b.studentIds.includes(studentId),
  );

  if (targetBatch.type === "Regular") {
    // Block if already has a Regular batch for same subject
    const conflict = studentBatches.find(
      (b) =>
        b.type === "Regular" &&
        b.subject === targetBatch.subject &&
        b.status === "Active",
    );
    if (conflict)
      return {
        ok: false,
        reason: `Student already has a Regular batch for ${targetBatch.subject}: "${conflict.name}". Remove them from that batch first.`,
      };
  }

  if (targetBatch.type === "Backlog") {
    // Block same subject + standard backlog
    const conflict = studentBatches.find(
      (b) =>
        b.type === "Backlog" &&
        b.subject === targetBatch.subject &&
        b.standard === targetBatch.standard &&
        b.status === "Active",
    );
    if (conflict)
      return {
        ok: false,
        reason: `Student already has a Backlog batch for ${targetBatch.subject} – ${targetBatch.standard}: "${conflict.name}".`,
      };
  }

  // Recovery → always allow (capacity already checked above)
  return { ok: true };
}

export function generateBatchName(
  area: string,
  branch: string,
  day: string,
  timeSlot: string,
): string {
  const startTime = timeSlot.split("–")[0].trim();
  return `${area} – ${branch} – ${day} – ${startTime}`;
}

// ── Mock data ──────────────────────────────────────────────────────────────────

export const batchStore: Record<string, Batch> = {
  B001: {
    id: "B001",
    name: "Thane – Khopat – Monday – 3:30 PM",
    type: "Regular",
    status: "Active",
    area: "Thane",
    branch: "Khopat",
    day: "Monday",
    timeSlot: "3:30 PM – 6:30 PM",
    subject: "Mathematics",
    standard: "10th",
    teacherId: "T001",
    teacherName: "Rahul Sir",
    capacity: 30,
    studentIds: ["1", "2", "3"],
    createdAt: "2024-06-01",
  },
  B002: {
    id: "B002",
    name: "Thane – Khopat – Wednesday – 3:30 PM",
    type: "Regular",
    status: "Active",
    area: "Thane",
    branch: "Khopat",
    day: "Wednesday",
    timeSlot: "3:30 PM – 6:30 PM",
    subject: "Mathematics",
    standard: "10th",
    teacherId: "T001",
    teacherName: "Rahul Sir",
    capacity: 30,
    studentIds: ["4", "5"],
    createdAt: "2024-06-01",
  },
  B003: {
    id: "B003",
    name: "Thane – Hariniwas – Tuesday – 5:00 PM",
    type: "Regular",
    status: "Active",
    area: "Thane",
    branch: "Hariniwas",
    day: "Tuesday",
    timeSlot: "5:00 PM – 7:00 PM",
    subject: "Science",
    standard: "9th",
    teacherId: "T002",
    teacherName: "Priya Ma'am",
    capacity: 25,
    studentIds: ["6", "7", "8", "9"],
    createdAt: "2024-06-05",
  },
  B004: {
    id: "B004",
    name: "Thane – Khopat – Friday – 3:30 PM",
    type: "Backlog",
    status: "Active",
    area: "Thane",
    branch: "Khopat",
    day: "Friday",
    timeSlot: "3:30 PM – 5:30 PM",
    subject: "Mathematics",
    standard: "9th",
    teacherId: "T001",
    teacherName: "Rahul Sir",
    capacity: 15,
    studentIds: ["1", "3"],
    createdAt: "2024-06-10",
  },
  B005: {
    id: "B005",
    name: "Thane – Hariniwas – Saturday – 9:00 AM",
    type: "Backlog",
    status: "Completed",
    area: "Thane",
    branch: "Hariniwas",
    day: "Saturday",
    timeSlot: "9:00 AM – 11:00 AM",
    subject: "Science",
    standard: "8th",
    teacherId: "T002",
    teacherName: "Priya Ma'am",
    capacity: 15,
    studentIds: ["2", "4", "5", "6"],
    createdAt: "2024-07-01",
    completedAt: "2024-09-01",
  },
  B006: {
    id: "B006",
    name: "Mulund – Konark Darshan – Friday – 3:30 PM",
    type: "Regular",
    status: "Active",
    area: "Mulund",
    branch: "Konark Darshan",
    day: "Friday",
    timeSlot: "3:30 PM – 6:30 PM",
    subject: "Science",
    standard: "10th",
    teacherId: "T002",
    teacherName: "Priya Ma'am",
    capacity: 25,
    studentIds: ["7", "8", "9"],
    createdAt: "2024-07-05",
  },
  // ── DEMO batch — used to showcase all assignment rule errors ──────────────
  // Student "1" is already here       → "Already assigned" error
  // Student "2" is already here       → "Already assigned" error
  // Capacity = 2, both slots taken    → "Full capacity" error for any new student
  // type = Regular, subject = Mathematics, standard = 10th
  //   Student "1" is ALSO in B001 (Regular, Mathematics, 10th) → "Regular conflict" error
  B008: {
    id: "B008",
    name: "Thane – Khopat – Saturday – 3:30 PM",
    type: "Regular",
    status: "Active",
    area: "Thane",
    branch: "Khopat",
    day: "Saturday",
    timeSlot: "3:30 PM – 5:30 PM",
    subject: "Mathematics",
    standard: "10th",
    teacherId: "T001",
    teacherName: "Rahul Sir",
    capacity: 2,
    studentIds: ["4", "5"],
    createdAt: "2024-08-01",
  },
  // ── DEMO backlog batch — duplicate subject+standard as B004 ───────────────
  // Student "1" is in B004 (Backlog, Mathematics, 9th) → "Backlog conflict" error
  B009: {
    id: "B009",
    name: "Thane – Hariniwas – Sunday – 9:00 AM",
    type: "Backlog",
    status: "Active",
    area: "Thane",
    branch: "Hariniwas",
    day: "Sunday",
    timeSlot: "9:00 AM – 11:00 AM",
    subject: "Mathematics",
    standard: "9th",
    teacherId: "T001",
    teacherName: "Rahul Sir",
    capacity: 15,
    studentIds: [],
    createdAt: "2024-08-05",
  },
  B007: {
    id: "B007",
    name: "Mulund – Jay Commercial Plaza – Monday – 5:00 PM",
    type: "Recovery",
    status: "Active",
    area: "Mulund",
    branch: "Jay Commercial Plaza",
    day: "Monday",
    timeSlot: "5:00 PM – 7:00 PM",
    subject: "Mathematics",
    standard: "10th",
    teacherId: "T003",
    teacherName: "Anita Ma'am",
    capacity: 10,
    studentIds: ["1", "2"],
    createdAt: "2024-07-10",
  },
};

export function getBatchById(id: string): Batch | null {
  return batchStore[id] ?? null;
}
export function getAllBatches(): Batch[] {
  return Object.values(batchStore);
}
export function addBatch(batch: Batch): void {
  batchStore[batch.id] = batch;
}
export function updateBatch(id: string, data: Batch): void {
  batchStore[id] = { ...data };
}
export function deleteBatch(id: string): void {
  delete batchStore[id];
}

export function assignStudentToBatch(
  studentId: string,
  batchId: string,
): AssignResult {
  const batch = getBatchById(batchId);
  const allBatches = getAllBatches();
  if (!batch) return { ok: false, reason: "Batch not found." };
  const result = canAssignStudent(studentId, batch, allBatches);
  if (result.ok) {
    batchStore[batchId].studentIds.push(studentId);
  }
  return result;
}

export function removeStudentFromBatch(
  studentId: string,
  batchId: string,
): void {
  const batch = getBatchById(batchId);
  if (!batch) return;
  batchStore[batchId].studentIds = batch.studentIds.filter(
    (id) => id !== studentId,
  );
}
     
export function completeBatch(batchId: string): void {
  const batch = getBatchById(batchId);
  if (!batch) return;
  batchStore[batchId].status = "Completed";
  batchStore[batchId].completedAt = new Date().toISOString().split("T")[0];
}

export function getStudentBatches(studentId: string): Batch[] {
  return getAllBatches().filter((b) => b.studentIds.includes(studentId));
}

// ── API Functions ──────────────────────────────────────────────────────────────

export interface CreateBatchPayload {
  area_id: number;
  branch_id: number;
  day: string;
  start_time: string;
  end_time: string;
  time_slot: string;
  subject_id: number;
  standard_id: number;
  teacher_id: number;
  capacity: number;
  type: BatchType;
  status: BatchStatus;
}

export const createBatchAPI = async (payload: CreateBatchPayload): Promise<any> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/add-batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating batch:", error);
    throw error;
  }
};

export const getAllBatchesAPI = async (): Promise<Batch[]> => {
  try {
    const [batchesResponse, areas, branches, standards, subjects, teachers] = await Promise.all([
      fetchWithAuth(`${API_BASE_URL}/batches`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      getAllAreas(),
      getAllBranches(),
      getAllStandards(),
      getAllSubjects(),
      getAllTeachers(),
    ]);

    if (!batchesResponse.ok) {
      throw new Error(`HTTP error! status: ${batchesResponse.status}`);
    }

    const data = await batchesResponse.json();

    // Transform API response to Batch format with names
    const transformed = data.map((batch: any) => {
      const area = areas.find((a) => a.id === batch.area_id);
      const branch = branches.find((b) => b.id === batch.branch_id);
      const subject = subjects.find((s) => s.id === batch.subject_id);
      const standard = standards.find((s) => s.id === batch.standard_id);
      const teacher = teachers.find((t) => t.id === batch.teacher_id);

      return {
        id: String(batch.id),
        name: batch.name || `${area?.name || ""} – ${branch?.name || ""} – ${batch.day || ""} – ${batch.time_slot || ""}`,
        type: batch.type as BatchType,
        status: batch.status as BatchStatus,
        area: (area?.name as Area) || ("Thane" as Area),
        branch: branch?.name || "",
        day: batch.day || "",
        timeSlot: batch.time_slot || "",
        subject: subject?.name || "",
        standard: standard?.name || "",
        teacherId: String(batch.teacher_id || ""),
        teacherName: teacher ? getTeacherFullName(teacher) : "",
        capacity: batch.capacity || 0,
        studentIds: batch.student_ids || [],
        createdAt: batch.created_at || "",
        completedAt: batch.completed_at,
      };
    });

    transformed.forEach((b: Batch) => {
      batchStore[b.id] = b;
    });

    return transformed;
  } catch (error) {
    console.error("Error fetching batches:", error);
    throw error;
  }
};

/**
 * Fetch ONLY batches from /batches without calling areas, branches, standards, subjects, or teachers APIs.
 */
export const getBatchesOnlyAPI = async (): Promise<Batch[]> => {
  try {
    const batchesResponse = await fetchWithAuth(`${API_BASE_URL}/batches`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!batchesResponse.ok) {
      throw new Error(`HTTP error! status: ${batchesResponse.status}`);
    }

    const data = await batchesResponse.json();

    const transformed: Batch[] = data.map((batch: any) => {
      const parts = [
        batch.area_name || batch.area,
        batch.branch_name || batch.branch,
        batch.day,
        batch.time_slot || batch.timeSlot,
      ].filter((p) => Boolean(p) && String(p).trim() !== "" && String(p).trim() !== "–" && String(p).trim() !== "-");

      const hasValidName = batch.name && !batch.name.trim().startsWith("–") && !batch.name.trim().startsWith("-");
      const computedName = hasValidName
        ? batch.name
        : parts.length > 0
        ? parts.join(" – ")
        : `Batch #${batch.id} (${batch.day || ""})`;

      return {
        id: String(batch.id),
        name: computedName,
        type: (batch.type as BatchType) || "Regular",
        status: (batch.status as BatchStatus) || "Active",
        area: (batch.area_name || batch.area || "Thane") as Area,
        branch: batch.branch_name || batch.branch || "",
        day: batch.day || "",
        timeSlot: batch.time_slot || batch.timeSlot || "",
        subject: batch.subject_name || batch.subject || "",
        standard: batch.standard_name || batch.standard || "",
        teacherId: String(batch.teacher_id || ""),
        teacherName: batch.teacher_name || "",
        capacity: batch.capacity || 0,
        studentIds: (batch.student_ids || batch.studentIds || []).map((s: any) => String(s?.id ?? s)),
        createdAt: batch.created_at || "",
        completedAt: batch.completed_at,
        area_id: batch.area_id != null ? Number(batch.area_id) : undefined,
        branch_id: batch.branch_id != null ? Number(batch.branch_id) : undefined,
        subject_id: batch.subject_id != null ? Number(batch.subject_id) : undefined,
        standard_id: batch.standard_id != null ? Number(batch.standard_id) : undefined,
        teacher_id: batch.teacher_id != null ? Number(batch.teacher_id) : undefined,
      };
    });

    transformed.forEach((b: Batch) => {
      if (!batchStore[b.id]) {
        batchStore[b.id] = b;
      } else {
        Object.assign(batchStore[b.id], b);
      }
    });

    return transformed;
  } catch (error) {
    console.error("Error fetching batches:", error);
    throw error;
  }
};

import { DUMMY_BATCH } from "./dummyBatch";

// In-flight request deduplication map and short-term cache to prevent duplicate calls
const inFlightBatchRequests = new Map<string, Promise<Batch | null>>();
const batchFetchCache = new Map<string, { data: Batch | null; timestamp: number }>();

export const getBatchByIdAPI = async (id: string): Promise<Batch | null> => {
  if (id === DUMMY_BATCH.id || id === "dummy-batch-1") {
    batchStore[DUMMY_BATCH.id] = DUMMY_BATCH;
    return DUMMY_BATCH;
  }

  // 1. Return recent cached result (within 3 seconds) to prevent multiple rapid calls
  const cached = batchFetchCache.get(id);
  if (cached && Date.now() - cached.timestamp < 3000) {
    return cached.data;
  }

  // 2. If a request for this ID is already in progress, return the existing promise
  if (inFlightBatchRequests.has(id)) {
    return inFlightBatchRequests.get(id)!;
  }

  const fetchPromise = (async () => {
    try {
      const batchResponse = await fetchWithAuth(`${API_BASE_URL}/batch/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!batchResponse.ok) {
        if (batchResponse.status === 404) {
          batchFetchCache.set(id, { data: null, timestamp: Date.now() });
          return null;
        }
        throw new Error(`HTTP error! status: ${batchResponse.status}`);
      }

      const batch = await batchResponse.json();

      const rawStudents: any[] = Array.isArray(batch.students)
        ? batch.students
        : Array.isArray(batch.assigned_students)
          ? batch.assigned_students
          : [];

      const parsedStudents: AssignedStudent[] = rawStudents.map((s: any) => {
        const sId = String(s.id);
        const sName = `${s.first_name || ""} ${s.surname || ""}`.trim() || `Student #${sId}`;
        const stdName = s.standard?.name || s.standard || "";

        return {
          id: sId,
          name: sName,
          firstName: s.first_name || "",
          surname: s.surname || "",
          email: s.email || "",
          contactNo: s.contact_no || "",
          rollNo: s.roll_no || "",
          standard: stdName,
          photo: s.photo || null,
        };
      });

      const studentIds: string[] =
        parsedStudents.length > 0
          ? parsedStudents.map((s) => s.id)
          : (batch.student_ids || batch.studentIds || []).map((s: any) => String(s?.id ?? s));

      const transformed: Batch = {
        id: String(batch.id),
        name:
          batch.name ||
          `${batch.area_name || batch.area || ""} – ${batch.branch_name || batch.branch || ""} – ${batch.day || ""} – ${batch.time_slot || batch.timeSlot || ""}`,
        type: (batch.type as BatchType) || "Regular",
        status: (batch.status as BatchStatus) || "Active",
        area: (batch.area_name || batch.area || "Thane") as Area,
        branch: batch.branch_name || batch.branch || "",
        day: batch.day || "",
        timeSlot: batch.time_slot || batch.timeSlot || "",
        subject: batch.subject_name || batch.subject || "",
        standard: batch.standard_name || batch.standard || "",
        teacherId: String(batch.teacher_id || batch.teacherId || ""),
        teacherName:
          batch.teacher_name ||
          batch.teacherName ||
          (batch.teacher
            ? `${batch.teacher.first_name || ""} ${batch.teacher.last_name || ""}`.trim()
            : ""),
        capacity: Number(batch.capacity) || 0,
        studentIds,
        students: parsedStudents.length > 0 ? parsedStudents : undefined,
        createdAt: batch.created_at || batch.createdAt || "",
        completedAt: batch.completed_at || batch.completedAt,
        area_id: batch.area_id != null ? Number(batch.area_id) : undefined,
        branch_id: batch.branch_id != null ? Number(batch.branch_id) : undefined,
        subject_id: batch.subject_id != null ? Number(batch.subject_id) : undefined,
        standard_id: batch.standard_id != null ? Number(batch.standard_id) : undefined,
        teacher_id: batch.teacher_id != null ? Number(batch.teacher_id) : undefined,
        start_time: batch.start_time || undefined,
        end_time: batch.end_time || undefined,
      };

      batchStore[transformed.id] = transformed;
      batchFetchCache.set(id, { data: transformed, timestamp: Date.now() });
      return transformed;
    } catch (error) {
      console.error("Error fetching batch:", error);
      if (id === DUMMY_BATCH.id || id === "dummy-batch-1") {
        batchStore[DUMMY_BATCH.id] = DUMMY_BATCH;
        return DUMMY_BATCH;
      }
      throw error;
    } finally {
      inFlightBatchRequests.delete(id);
    }
  })();

  inFlightBatchRequests.set(id, fetchPromise);
  return fetchPromise;
};

export const updateBatchAPI = async (id: string, payload: CreateBatchPayload): Promise<any> => {
  if (id === DUMMY_BATCH.id || id === "dummy-batch-1") {
    return { message: "Dummy batch updated successfully" };
  }
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/batch/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating batch:", error);
    throw error;
  }
};

export interface AssignStudentsPayload {
  batch_id: number;
  student_ids: number[];
}

let isAssigningInProgress = false;

export const assignStudentsToBatchAPI = async (
  batchId: string | number,
  studentIds: (string | number)[],
): Promise<any> => {
  if (isAssigningInProgress) {
    console.warn("Assignment request already in progress, skipping duplicate call.");
    return { success: true };
  }
  isAssigningInProgress = true;

  const numericBatchId = Number(batchId);
  const numericStudentIds = studentIds
    .map((id) => Number(id))
    .filter((n) => !isNaN(n));

  const payload: AssignStudentsPayload = {
    batch_id: numericBatchId,
    student_ids: numericStudentIds,
  };

  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/assign-students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      throw new Error(errData?.detail || errData?.message || `Failed to save assignments (Status: ${response.status})`);
    }

    const data = await response.json().catch(() => ({ success: true }));

    // Invalidate batch cache so subsequent views fetch updated students
    batchFetchCache.delete(String(batchId));

    return data;
  } catch (error) {
    console.error("Error assigning students to batch:", error);
    throw error;
  } finally {
    isAssigningInProgress = false;
  }
};

let isTogglingInProgress = false;

export const toggleBatchStatusAPI = async (
  id: string | number,
  currentStatus?: BatchStatus,
): Promise<any> => {
  if (isTogglingInProgress) {
    console.warn("Toggle request already in progress, skipping duplicate call.");
    return { success: true };
  }
  isTogglingInProgress = true;

  const numericId = Number(id);
  const nextStatus: BatchStatus = currentStatus === "Active" ? "Inactive" : "Active";

  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/batch/${numericId}/toggle-status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      throw new Error(errData?.detail || errData?.message || `Failed to update batch status (Status: ${response.status})`);
    }

    const data = await response.json().catch(() => ({ success: true, status: nextStatus }));

    // Update in-memory store and clear cache
    if (batchStore[String(id)]) {
      batchStore[String(id)].status = nextStatus;
    }
    batchFetchCache.delete(String(id));

    return data;
  } catch (error) {
    console.error("Error toggling batch status:", error);
    throw error;
  } finally {
    isTogglingInProgress = false;
  }
};

export const deleteBatchAPI = toggleBatchStatusAPI;


