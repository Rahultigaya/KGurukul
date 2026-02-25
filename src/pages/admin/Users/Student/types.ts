// src\pages\admin\Users\Student\types.ts

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface GuardianDetails {
  id: string;
  name: string;
  email: string;
  contact: string;
  relation: string;
}

export interface Installment {
  amount: string;
  date: Date | null;
  mode: string;
  bankName: string;
  paidTo: string;
}

export interface StudentRegistrationData {
  photo: string | null;
  registrationDate: string;
  subject: string;
  branch: string;
  courseType: string;
  reference: string;
  surname: string;
  firstName: string;
  middleName: string;
  gender: string;
  email: string;
  contactNo: string;
  address: string;
  schoolCollegeName: string;
  standard: string;
  guardians: GuardianDetails[];
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
  installments: Installment[];
}

export type ValidationErrors = Record<string, string>;
