// src/pages/batches/batchStore.ts

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
  createdAt: string;
  completedAt?: string;
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
