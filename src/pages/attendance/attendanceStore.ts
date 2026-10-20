// src/pages/attendance/attendanceStore.ts

import { fetchWithAuth } from "../../api/common";

const API_BASE_URL = "http://127.0.0.1:8000";

export type AttendanceStatus = "Present" | "Absent" | "Recovery";

export interface RecoveryInfo {
  fromBatchId:   string;
  fromBatchName: string;
  missedDate:    string; // YYYY-MM-DD
}

export interface StudentAttendance {
  studentId:     string;
  status:        AttendanceStatus;
  remark:        string;
  recoveryInfo?: RecoveryInfo;
}

export interface AttendanceSession {
  id:          string; // `${batchId}_${date}`
  batchId:     string;
  batchName:   string;
  date:        string; // YYYY-MM-DD
  markedBy:    string;
  markedAt:    string;
  records:     StudentAttendance[];
  isSubmitted: boolean;
}

export interface AttendanceRecordPayload {
  student_id: number | string;
  status: AttendanceStatus;
  remark?: string;
  from_batch_id?: number | string | null;
  from_batch_name?: string | null;
  missed_date?: string | null;
}

export interface SaveAttendancePayload {
  batch_id: number | string;
  date: string; // YYYY-MM-DD
  marked_by: string;
  is_submitted: boolean;
  status: "draft" | "submitted";
  records: AttendanceRecordPayload[];
}

export const attendanceStore: Record<string, AttendanceSession> = {
  "B001_2026-03-25": {
    id: "B001_2026-03-25", batchId: "B001",
    batchName: "Thane – Khopat – Monday – 3:30 PM",
    date: "2026-03-25", markedBy: "Rahul Sir",
    markedAt: "2026-03-25T16:00:00", isSubmitted: true,
    records: [
      { studentId: "1", status: "Present",  remark: "" },
      { studentId: "2", status: "Absent",   remark: "Sick" },
      { studentId: "3", status: "Present",  remark: "" },
    ],
  },
  "B003_2026-03-25": {
    id: "B003_2026-03-25", batchId: "B003",
    batchName: "Thane – Hariniwas – Tuesday – 5:00 PM",
    date: "2026-03-25", markedBy: "Priya Ma'am",
    markedAt: "2026-03-25T17:30:00", isSubmitted: true,
    records: [
      { studentId: "6", status: "Present", remark: "" },
      { studentId: "7", status: "Absent",  remark: "" },
      { studentId: "8", status: "Present", remark: "" },
      { studentId: "9", status: "Absent",  remark: "Out of town" },
    ],
  },
};

export function getSessionId(batchId: string, date: string): string {
  return `${batchId}_${date}`;
}

export function getSession(batchId: string, date: string): AttendanceSession | null {
  return attendanceStore[getSessionId(batchId, date)] ?? null;
}

export function saveSession(session: AttendanceSession): void {
  attendanceStore[session.id] = { ...session };
}

export function getBatchSessions(batchId: string): AttendanceSession[] {
  return Object.values(attendanceStore)
    .filter((s) => s.batchId === batchId && s.isSubmitted)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getAbsentStudents(batchId: string, date: string): string[] {
  const session = getSession(batchId, date);
  if (!session) return [];
  return session.records.filter((r) => r.status === "Absent").map((r) => r.studentId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Backend API Integration
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Save draft or submit attendance to backend:
 * POST http://127.0.0.1:8000/attendance
 */
export async function saveAttendanceAPI(payload: SaveAttendancePayload): Promise<any> {
  console.log(`[Attendance API] Saving attendance: POST ${API_BASE_URL}/attendance`, payload);
  const res = await fetchWithAuth(`${API_BASE_URL}/attendance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => null);
    throw new Error(errData?.detail || errData?.message || `Failed to save attendance (Status: ${res.status})`);
  }

  return await res.json().catch(() => ({ success: true }));
}

/**
 * Load saved attendance for a batch on a specific date:
 * GET http://127.0.0.1:8000/attendance?batch_id={batchId}&date={date}
 */
export async function getAttendanceByBatchAndDateAPI(
  batchId: string | number,
  date: string
): Promise<AttendanceSession | null> {
  const bId = String(batchId);
  console.log(`[Attendance API] Loading attendance: GET ${API_BASE_URL}/attendance?batch_id=${bId}&date=${date}`);
  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/attendance?batch_id=${bId}&date=${date}`);
    if (res.ok) {
      const data = await res.json();
      if (data && (Array.isArray(data.records) || Array.isArray(data))) {
        const rawRecords = Array.isArray(data.records) ? data.records : data;
        return {
          id: `${bId}_${date}`,
          batchId: bId,
          batchName: data.batch_name || data.batchName || "",
          date,
          markedBy: data.marked_by || data.markedBy || "Admin",
          markedAt: data.marked_at || data.markedAt || new Date().toISOString(),
          isSubmitted: Boolean(data.is_submitted ?? (data.status === "submitted")),
          records: rawRecords.map((r: any) => ({
            studentId: String(r.student_id ?? r.studentId ?? r.id),
            status: (r.status as AttendanceStatus) || "Present",
            remark: r.remark || "",
            recoveryInfo: (r.from_batch_id || r.fromBatchId) ? {
              fromBatchId: String(r.from_batch_id || r.fromBatchId),
              fromBatchName: r.from_batch_name || r.fromBatchName || "",
              missedDate: r.missed_date || r.missedDate || "",
            } : undefined,
          })),
        };
      }
    }
  } catch (err) {
    console.warn(`[Attendance API] GET /attendance?batch_id=${bId}&date=${date} failed:`, err);
  }
  return null;
}

/**
 * Fetch dates that have marked attendance for a batch:
 * GET http://127.0.0.1:8000/batches/{batchId}/attendance-dates
 */
export async function getBatchAttendanceDatesAPI(batchId: string | number): Promise<string[]> {
  const bId = String(batchId);
  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/batches/${bId}/attendance-dates`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.dates)) return data.dates;
    }
  } catch (err) {
    console.warn(`[Attendance API] GET /batches/${bId}/attendance-dates failed:`, err);
  }
  return [];
}
