// src/pages/attendance/attendanceStore.ts

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
