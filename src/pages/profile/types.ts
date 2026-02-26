// src/pages/profile/types.ts
//
// Shared types used across all profile pages.

export type UserRole = "admin" | "student" | "teacher";

export interface BaseProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  photo: string | null;
  role: UserRole;
}

export interface AdminProfileData extends BaseProfile {
  role: "admin";
  department: string;
  joined: string;
  bio: string;
}

export interface StudentProfileData extends BaseProfile {
  role: "student";
  surname: string;
  firstName: string;
  middleName: string;
  gender: string;
  subject: string;
  branch: string;
  courseType: string;
  standard: string;
  schoolCollegeName: string;
  registrationDate: string;
  reference: string;
  guardians: {
    id: string;
    name: string;
    relation: string;
    contact: string;
    email: string;
  }[];
  paymentType: "full" | "installment" | "later";
  totalFees: string;
  discountAmount: string;
  fullPayment: {
    amount: string;
    date: Date | null;
    mode: string;
    bankName: string;
    paidTo: string;
  };
  installments: {
    amount: string;
    date: Date | null;
    mode: string;
    bankName: string;
    paidTo: string;
  }[];
}

export interface TeacherProfileData extends BaseProfile {
  role: "teacher";
  subject: string;
  status: string;
  joined: string;
  totalStudents: number;
}
