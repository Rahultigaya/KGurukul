// src/pages/batches/batchStore.ts

export type Area = "Thane" | "Mulund";

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


export interface Batch {
  id: string;
  name: string; // auto-generated: "Thane – Khopat – Monday – 3:30 PM"
  area: Area;
  branch: string;
  day: string;
  timeSlot: string;
  subject: string;
  standard: string;
  teacherId: string;
  teacherName: string;
  capacity: number;
  studentIds: string[]; // studentStore keys
  isActive: boolean;
  createdAt: string;
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

// ── Mock data ──────────────────────────────────────────────────────────────

export const batchStore: Record<string, Batch> = {
  B001: {
    id: "B001",
    name: "Thane – Khopat – Monday – 3:30 PM",
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
    isActive: true,
    createdAt: "2024-06-01",
  },
  B002: {
    id: "B002",
    name: "Thane – Khopat – Wednesday – 3:30 PM",
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
    isActive: true,
    createdAt: "2024-06-01",
  },
  B003: {
    id: "B003",
    name: "Thane – Hariniwas – Tuesday – 5:00 PM",
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
    isActive: true,
    createdAt: "2024-06-05",
  },
  B004: {
    id: "B004",
    name: "Thane – Lokpuram – Thursday – 9:00 AM",
    area: "Thane",
    branch: "Lokpuram",
    day: "Thursday",
    timeSlot: "9:00 AM – 11:00 AM",
    subject: "English",
    standard: "8th",
    teacherId: "T003",
    teacherName: "Anita Ma'am",
    capacity: 20,
    studentIds: ["1", "3"],
    isActive: true,
    createdAt: "2024-06-10",
  },
  B005: {
    id: "B005",
    name: "Thane – Hiranandani Estate – Saturday – 9:00 AM",
    area: "Thane",
    branch: "Hiranandani Estate",
    day: "Saturday",
    timeSlot: "9:00 AM – 11:00 AM",
    subject: "Mathematics",
    standard: "12th",
    teacherId: "T001",
    teacherName: "Rahul Sir",
    capacity: 35,
    studentIds: ["2", "4", "5", "6"],
    isActive: false,
    createdAt: "2024-07-01",
  },
  B006: {
    id: "B006",
    name: "Mulund – Konark Darshan – Friday – 3:30 PM",
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
    isActive: true,
    createdAt: "2024-07-05",
  },
  B007: {
    id: "B007",
    name: "Mulund – Jay Commercial Plaza – Monday – 5:00 PM",
    area: "Mulund",
    branch: "Jay Commercial Plaza",
    day: "Monday",
    timeSlot: "5:00 PM – 7:00 PM",
    subject: "English",
    standard: "11th",
    teacherId: "T003",
    teacherName: "Anita Ma'am",
    capacity: 20,
    studentIds: ["1", "2"],
    isActive: true,
    createdAt: "2024-07-10",
  },
  B008: {
    id: "B007",
    name: "Mulund – Jay Commercial Plaza – Wednesday – 5:00 PM",
    area: "Mulund",
    branch: "Jay Commercial Plaza",
    day: "Wednesday",
    timeSlot: "5:00 PM – 7:00 PM",
    subject: "English",
    standard: "11th",
    teacherId: "T003",
    teacherName: "Anita Ma'am",
    capacity: 20,
    studentIds: ["1", "2"],
    isActive: true,
    createdAt: "2024-07-10",
  },
  B009: {
    id: "B007",
    name: "Mulund – Jay Commercial Plaza – Friday – 5:00 PM",
    area: "Mulund",
    branch: "Jay Commercial Plaza",
    day: "Friday",
    timeSlot: "5:00 PM – 7:00 PM",
    subject: "English",
    standard: "11th",
    teacherId: "T003",
    teacherName: "Anita Ma'am",
    capacity: 20,
    studentIds: ["1", "2"],
    isActive: true,
    createdAt: "2024-07-10",
  },
  B010: {
    id: "B007",
    name: "Mulund – Jay Commercial Plaza – Saturday – 5:00 PM",
    area: "Mulund",
    branch: "Jay Commercial Plaza",
    day: "Saturday",
    timeSlot: "5:00 PM – 7:00 PM",
    subject: "English",
    standard: "11th",
    teacherId: "T003",
    teacherName: "Anita Ma'am",
    capacity: 20,
    studentIds: ["1", "2"],
    isActive: true,
    createdAt: "2024-07-10",
  },
  B011: {
    id: "B007",
    name: "Mulund – Jay Commercial Plaza – Tuesday – 5:00 PM",
    area: "Mulund",
    branch: "Jay Commercial Plaza",
    day: "Tuesday",
    timeSlot: "5:00 PM – 7:00 PM",
    subject: "English",
    standard: "11th",
    teacherId: "T003",
    teacherName: "Anita Ma'am",
    capacity: 20,
    studentIds: ["1", "2"],
    isActive: true,
    createdAt: "2024-07-10",
  },
  B012: {
    id: "B007",
    name: "Mulund – Jay Commercial Plaza – Thursday – 5:00 PM",
    area: "Mulund",
    branch: "Jay Commercial Plaza",
    day: "Thursday",
    timeSlot: "5:00 PM – 7:00 PM",
    subject: "English",
    standard: "11th",
    teacherId: "T003",
    teacherName: "Anita Ma'am",
    capacity: 20,
    studentIds: ["1", "2"],
    isActive: true,
    createdAt: "2024-07-10",
  },
  B013: {
    id: "B007",
    name: "Mulund – Jay Commercial Plaza – Sunday – 5:00 PM",
    area: "Mulund",
    branch: "Jay Commercial Plaza",
    day: "Sunday",
    timeSlot: "5:00 PM – 7:00 PM",
    subject: "English",
    standard: "11th",
    teacherId: "T003",
    teacherName: "Anita Ma'am",
    capacity: 20,
    studentIds: ["1", "2"],
    isActive: true,
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
