// src/pages/admin/Users/Student/studentStore.ts

import type { StudentRegistrationData } from "./types";

export const studentStore: Record<string, StudentRegistrationData> = {
  "1": {
    photo: null,
    registrationDate: "2026-02-24",
    subject: "Mathematics",
    branch: "Pune Main",
    courseType: "Crash (Backlog)",
    reference: "",
    surname: "Sharma",
    firstName: "Rahul",
    middleName: "Kumar",
    gender: "male",
    email: "rahul.sharma@email.com",
    contactNo: "9876543210",
    address: "123, MG Road, Pune",
    schoolCollegeName: "Fergusson College",
    standard: "12",
    guardians: [
      {
        id: "1",
        name: "Rajesh Sharma",
        email: "rajesh@email.com",
        contact: "9876543200",
        relation: "Father",
      },
    ],
    paymentType: "installment",
    totalFees: "45000",
    discountAmount: "5000",
    fullPayment: { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
    installments: [
      {
        amount: "20000",
        date: new Date("2026-02-18"),
        mode: "Online", // ✅ was "UPI"
        bankName: "",
        paidTo: "Sir Account", // ✅ was "Admin"
      },
      { amount: "15000", date: null, mode: "", bankName: "", paidTo: "" },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
    ],
  },

  "2": {
    photo: null,
    registrationDate: "2026-02-20",
    subject: "Physics",
    branch: "Pune West",
    courseType: "Regular",
    reference: "Online Ad",
    surname: "Patel",
    firstName: "Priya",
    middleName: "Anand",
    gender: "female",
    email: "priya.patel@email.com",
    contactNo: "8765432109",
    address: "45, Baner Road, Pune",
    schoolCollegeName: "SP College",
    standard: "11",
    guardians: [
      {
        id: "1",
        name: "Anand Patel",
        email: "anand@email.com",
        contact: "8765432100",
        relation: "Father",
      },
    ],
    paymentType: "full",
    totalFees: "38000",
    discountAmount: "3000",
    fullPayment: {
      amount: "35000",
      date: new Date("2026-02-20"),
      mode: "Cheque", // ✅ was "NEFT"
      bankName: "HDFC",
      paidTo: "Sir Account", // ✅ was "Admin"
    },
    installments: [
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
    ],
  },

  "3": {
    photo: null,
    registrationDate: "2026-02-15",
    subject: "Chemistry",
    branch: "Pune East",
    courseType: "Crash (Backlog)",
    reference: "Friend",
    surname: "Verma",
    firstName: "Amit",
    middleName: "Raj",
    gender: "male",
    email: "amit.verma@email.com",
    contactNo: "7654321098",
    address: "78, Kothrud, Pune",
    schoolCollegeName: "COEP",
    standard: "12",
    guardians: [
      {
        id: "1",
        name: "Raj Verma",
        email: "raj@email.com",
        contact: "7654321000",
        relation: "Father",
      },
    ],
    paymentType: "later",
    totalFees: "50000",
    discountAmount: "0",
    fullPayment: { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
    installments: [
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
    ],
  },

  "4": {
    photo: null,
    registrationDate: "2026-02-10",
    subject: "Biology",
    branch: "Pune Main",
    courseType: "Regular",
    reference: "Friend",
    surname: "Deshmukh",
    firstName: "Sneha",
    middleName: "Vilas",
    gender: "female",
    email: "sneha.deshmukh@email.com",
    contactNo: "9123456780",
    address: "Karve Nagar, Pune",
    schoolCollegeName: "Modern College",
    standard: "12",
    guardians: [
      {
        id: "1",
        name: "Vilas Deshmukh",
        email: "vilas@email.com",
        contact: "9123456700",
        relation: "Father",
      },
    ],
    paymentType: "full",
    totalFees: "42000",
    discountAmount: "2000",
    fullPayment: {
      amount: "40000",
      date: new Date("2026-02-10"),
      mode: "Cash", // ✅ already correct
      bankName: "",
      paidTo: "Ma'am Account", // ✅ was "Admin"
    },
    installments: [
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
    ],
  },

  "5": {
    photo: null,
    registrationDate: "2026-02-12",
    subject: "Mathematics",
    branch: "Pune West",
    courseType: "Crash (Backlog)",
    reference: "Instagram",
    surname: "Kulkarni",
    firstName: "Aditya",
    middleName: "Suresh",
    gender: "male",
    email: "aditya.k@email.com",
    contactNo: "9988776655",
    address: "Aundh, Pune",
    schoolCollegeName: "MIT College",
    standard: "11",
    guardians: [
      {
        id: "1",
        name: "Suresh Kulkarni",
        email: "suresh@email.com",
        contact: "9988776600",
        relation: "Father",
      },
    ],
    paymentType: "installment",
    totalFees: "45000",
    discountAmount: "5000",
    fullPayment: { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
    installments: [
      {
        amount: "20000",
        date: new Date("2026-02-12"),
        mode: "Online", // ✅ was "UPI"
        bankName: "",
        paidTo: "Sir Account", // ✅ was "Admin"
      },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
    ],
  },

  "6": {
    photo: null,
    registrationDate: "2026-02-08",
    subject: "Physics",
    branch: "Pune East",
    courseType: "Regular",
    reference: "",
    surname: "Yadav",
    firstName: "Rohit",
    middleName: "Kiran",
    gender: "male",
    email: "rohit.y@email.com",
    contactNo: "9871234560",
    address: "Hadapsar, Pune",
    schoolCollegeName: "DY Patil College",
    standard: "12",
    guardians: [
      {
        id: "1",
        name: "Kiran Yadav",
        email: "kiran@email.com",
        contact: "9871234500",
        relation: "Father",
      },
    ],
    paymentType: "later",
    totalFees: "48000",
    discountAmount: "3000",
    fullPayment: { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
    installments: [
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
    ],
  },

  "7": {
    photo: null,
    registrationDate: "2026-02-05",
    subject: "Chemistry",
    branch: "Pune Main",
    courseType: "Regular",
    reference: "Website",
    surname: "Jain",
    firstName: "Neha",
    middleName: "Raj",
    gender: "female",
    email: "neha.j@email.com",
    contactNo: "9090909090",
    address: "Shivajinagar, Pune",
    schoolCollegeName: "BMCC",
    standard: "11",
    guardians: [
      {
        id: "1",
        name: "Raj Jain",
        email: "raj@email.com",
        contact: "9090909000",
        relation: "Father",
      },
    ],
    paymentType: "full",
    totalFees: "39000",
    discountAmount: "1000",
    fullPayment: {
      amount: "38000",
      date: new Date("2026-02-05"),
      mode: "Cheque", // ✅ was "NEFT"
      bankName: "ICICI",
      paidTo: "Ma'am Account", // ✅ was "Admin"
    },
    installments: [
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
    ],
  },

  "8": {
    photo: null,
    registrationDate: "2026-02-14",
    subject: "Mathematics",
    branch: "Pune West",
    courseType: "Crash (Backlog)",
    reference: "Friend",
    surname: "More",
    firstName: "Akash",
    middleName: "Sunil",
    gender: "male",
    email: "akash.more@email.com",
    contactNo: "9345678901",
    address: "Wakad, Pune",
    schoolCollegeName: "Indira College",
    standard: "12",
    guardians: [
      {
        id: "1",
        name: "Sunil More",
        email: "sunil@email.com",
        contact: "9345678900",
        relation: "Father",
      },
    ],
    paymentType: "installment",
    totalFees: "47000",
    discountAmount: "2000",
    fullPayment: { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
    installments: [
      {
        amount: "25000",
        date: new Date("2026-02-14"),
        mode: "Cash", // ✅ already correct
        bankName: "",
        paidTo: "Sir Account", // ✅ was "Admin"
      },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
    ],
  },

  "9": {
    photo: null,
    registrationDate: "2026-02-16",
    subject: "Biology",
    branch: "Pune East",
    courseType: "Regular",
    reference: "Online Ad",
    surname: "Kadam",
    firstName: "Pooja",
    middleName: "Ramesh",
    gender: "female",
    email: "pooja.k@email.com",
    contactNo: "9456781230",
    address: "Viman Nagar, Pune",
    schoolCollegeName: "Symbiosis College",
    standard: "11",
    guardians: [
      {
        id: "1",
        name: "Ramesh Kadam",
        email: "ramesh@email.com",
        contact: "9456781200",
        relation: "Father",
      },
    ],
    paymentType: "full",
    totalFees: "41000",
    discountAmount: "1000",
    fullPayment: {
      amount: "40000",
      date: new Date("2026-02-16"),
      mode: "Online", // ✅ was "UPI"
      bankName: "",
      paidTo: "Sir Account", // ✅ was "Admin"
    },
    installments: [
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
    ],
  },

  "10": {
    photo: null,
    registrationDate: "2026-02-16",
    subject: "Biology",
    branch: "Pune East",
    courseType: "Regular",
    reference: "Online Ad",
    surname: "Kadam",
    firstName: "Pooja",
    middleName: "Ramesh",
    gender: "female",
    email: "pooja.k@email.com",
    contactNo: "9456781230",
    address: "Viman Nagar, Pune",
    schoolCollegeName: "Symbiosis College",
    standard: "11",
    guardians: [
      {
        id: "1",
        name: "Ramesh Kadam",
        email: "ramesh@email.com",
        contact: "9456781200",
        relation: "Father",
      },
    ],
    paymentType: "full",
    totalFees: "41000",
    discountAmount: "1000",
    fullPayment: {
      amount: "40000",
      date: new Date("2026-02-16"),
      mode: "Online", // ✅ was "UPI"
      bankName: "",
      paidTo: "Sir Account", // ✅ was "Admin"
    },
    installments: [
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
    ],
  },

  "11": {
    photo: null,
    registrationDate: "2026-02-16",
    subject: "Biology",
    branch: "Pune East",
    courseType: "Regular",
    reference: "Online Ad",
    surname: "Kadam",
    firstName: "Pooja",
    middleName: "Ramesh",
    gender: "female",
    email: "pooja.k@email.com",
    contactNo: "9456781230",
    address: "Viman Nagar, Pune",
    schoolCollegeName: "Symbiosis College",
    standard: "11",
    guardians: [
      {
        id: "1",
        name: "Ramesh Kadam",
        email: "ramesh@email.com",
        contact: "9456781200",
        relation: "Father",
      },
    ],
    paymentType: "full",
    totalFees: "41000",
    discountAmount: "1000",
    fullPayment: {
      amount: "40000",
      date: new Date("2026-02-16"),
      mode: "Online", // ✅ was "UPI"
      bankName: "",
      paidTo: "Sir Account", // ✅ was "Admin"
    },
    installments: [
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
    ],
  },
};

/** Read one student by id. Returns null if not found. */
export function getStudentById(id: string): StudentRegistrationData | null {
  return studentStore[id] ?? null;
}

/** Save updated student back to the store (in-memory).
 *  Replace with your API call when ready:
 *  await fetch(`/api/students/${id}`, { method: "PUT", body: JSON.stringify(data) })
 */
export function updateStudent(id: string, data: StudentRegistrationData): void {
  studentStore[id] = { ...data };
}
