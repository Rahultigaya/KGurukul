// src/pages/batches/dummyBatch.ts

import type { Batch } from "./batchStore";

export const DUMMY_BATCH: Batch = {
  id: "dummy-batch-1",
  name: "THN-REG-CS-10TH-A",
  type: "Regular",
  status: "Active",
  area: "Thane",
  branch: "Khopat",
  day: "Monday",
  timeSlot: "04:00 PM - 06:00 PM",
  subject: "Computer Science",
  standard: "10th",
  teacherId: "dummy-teacher-1",
  teacherName: "Dummy Prof Teacher",
  capacity: 30,
  studentIds: ["dummy-1"],
  createdAt: "2025-01-01",
};
