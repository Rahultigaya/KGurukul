// src/pages/admin/Users/Student/dummyStudent.ts

import type { Student } from "./StudentColumns";

export const DUMMY_STUDENT: Student = {
  id: "dummy-1",
  photo: null,
  academicYear: "2025-2026",
  registrationDate: "2025-06-01",
  subject: "Computer Science",
  branch: "Main Branch",
  standard: "10th",
  courseType: "ICSE Computer Applications",
  reference: "Social Media",
  surname: "Student",
  firstName: "Dummy",
  middleName: "User",
  gender: "Male",
  email: "dummy.student@example.com",
  contactNo: "9876543210",
  address: "123, Sample Street, Main City",
  schoolCollegeName: "St. Xavier's High School",
  paymentType: "installment",
  totalFees: "25000",
  discountAmount: "2000",
  guardians: [
    {
      id: "1",
      name: "Dummy Gardian",
      email: "dummy.gardian@example.com",
      contact: "9876543211",
      relation: "Father",
    },
  ],
  fullPayment: {
    amount: "",
    date: null,
    mode: "",
    bankName: "",
    paidTo: "",
  },
  installments: [
    {
      amount: "10000",
      date: new Date("2025-06-05"),
      mode: "UPI",
      bankName: "HDFC Bank",
      paidTo: "Admin",
    },
    {
      amount: "13000",
      date: null,
      mode: "",
      bankName: "",
      paidTo: "",
    },
  ],
};
