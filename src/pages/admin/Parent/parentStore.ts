// src/pages/admin/Users/Parent/parentStore.ts

export interface ParentData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  photo: string | null;
  relation: string;
  occupation: string;
  childrenIds: string[];
}

export const parentStore: Record<string, ParentData> = {
  // ── Single child ──────────────────────────────────────────────────────────

  P001: {
    id: "P001",
    name: "Rajesh Sharma",
    email: "rajesh@email.com",
    phone: "9876543200",
    address: "123, MG Road, Pune",
    photo: null,
    relation: "Father",
    occupation: "Business",
    childrenIds: ["1"], // Rahul Sharma
  },
  P002: {
    id: "P002",
    name: "Anand Patel",
    email: "anand@email.com",
    phone: "8765432100",
    address: "45, Baner Road, Pune",
    photo: null,
    relation: "Father",
    occupation: "Engineer",
    childrenIds: ["4"], // Sneha Deshmukh
  },
  P003: {
    id: "P003",
    name: "Kiran Yadav",
    email: "kiran@email.com",
    phone: "9871234500",
    address: "Hadapsar, Pune",
    photo: null,
    relation: "Father",
    occupation: "Govt. Employee",
    childrenIds: ["6"], // Rohit Yadav
  },

  // ── Two children ──────────────────────────────────────────────────────────

  P004: {
    id: "P004",
    name: "Mahesh Patil",
    email: "mahesh.patil@email.com",
    phone: "9999988800",
    address: "Baner, Pune",
    photo: null,
    relation: "Father",
    occupation: "Architect",
    childrenIds: ["2", "5"], // Priya Patel + Aditya Kulkarni
  },
  P005: {
    id: "P005",
    name: "Sunita Verma",
    email: "sunita.verma@email.com",
    phone: "9812345670",
    address: "78, Kothrud, Pune",
    photo: null,
    relation: "Mother",
    occupation: "Doctor",
    childrenIds: ["3", "7"], // Amit Verma + Neha Jain
  },

  // ── Three children ────────────────────────────────────────────────────────

  P006: {
    id: "P006",
    name: "Ramesh Kadam",
    email: "ramesh.kadam@email.com",
    phone: "9456781200",
    address: "Viman Nagar, Pune",
    photo: null,
    relation: "Father",
    occupation: "Lawyer",
    childrenIds: ["8", "9", "1"], // Akash More + Pooja Kadam + Rahul Sharma
  },
};

export function getParentById(id: string): ParentData | null {
  return parentStore[id] ?? null;
}

export function updateParent(id: string, data: ParentData): void {
  parentStore[id] = { ...data };
}
