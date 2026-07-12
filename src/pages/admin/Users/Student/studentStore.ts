// src/pages/admin/Users/Student/studentStore.ts

import type { StudentRegistrationData } from "./types";
import { getStudents as apiGetStudents, getStudentById as apiGetStudentById, updateStudent as apiUpdateStudent } from "../../../../api/api";

// ── In-memory cache for synchronous access (used by MarkAttendance, BatchAssign) ──
export const studentCache: Record<string, StudentRegistrationData & { id: string }> = {};

let cacheLoaded = false;

export async function loadStudentCache(): Promise<void> {
  if (cacheLoaded) return;
  try {
    const res = await apiGetStudents();
    res.data.forEach((s: any) => {
      studentCache[String(s.id)] = { ...transformApiToFormData(s), id: String(s.id) };
    });
    cacheLoaded = true;
  } catch (e) {
    console.error("Failed to load student cache", e);
  }
}

// ── Legacy synchronous studentStore (for backward compat with MarkAttendance, BatchAssign) ──
// Deprecated: use loadStudentCache() + studentCache instead
export const studentStore = studentCache as Record<string, StudentRegistrationData>;

/** Fetch one student by id from the API. Returns null if not found. */
export async function getStudentById(id: string): Promise<StudentRegistrationData | null> {
  try {
    const res = await apiGetStudentById(Number(id));
    return transformApiToFormData(res.data);
  } catch {
    return null;
  }
}

/** Update student via API. */
export async function updateStudent(id: string, data: StudentRegistrationData): Promise<void> {
  const payload = transformFormDataToPayload(data);
  await apiUpdateStudent(Number(id), payload);
}

// ─── Transform helpers ──────────────────────────────────────────────────────────

function formatDate(d: string | Date | null): string | null {
  if (!d) return null;
  if (typeof d === "string") return d.split("T")[0];
  return d.toISOString().split("T")[0];
}

export function transformApiToFormData(raw: any): StudentRegistrationData {
  return {
    photo: raw.photo ?? null,
    academicYear: raw.academic_year ?? "",
    registrationDate: raw.registration_date ?? "",
    subject: String(raw.subject_id ?? raw.subject?.id ?? ""),
    branch: String(raw.branch_id ?? raw.branch?.id ?? ""),
    standard: String(raw.standard_id ?? raw.standard?.id ?? ""),
    courseType: raw.course_type ?? "",
    reference: raw.reference ?? "",
    surname: raw.surname ?? "",
    firstName: raw.first_name ?? "",
    middleName: raw.middle_name ?? "",
    gender: raw.gender ?? "",
    email: raw.email ?? "",
    contactNo: raw.contact_no ?? "",
    address: raw.address ?? "",
    schoolCollegeName: raw.school_college_name ?? "",
    paymentType: raw.payment_type ?? "full",
    totalFees: raw.total_fees ?? "",
    discountAmount: raw.discount_amount ?? "0",
    guardians: (raw.guardians ?? []).map((g: any, i: number) => ({
      id: String(g.id ?? i + 1),
      name: g.name ?? "",
      email: g.email ?? "",
      contact: g.contact ?? "",
      relation: g.relation ?? "",
    })),
    fullPayment: raw.full_payment
      ? {
          amount: raw.full_payment.amount ?? "",
          date: formatDate(raw.full_payment.date),
          mode: raw.full_payment.mode ?? "",
          bankName: raw.full_payment.bank_name ?? "",
          paidTo: raw.full_payment.paid_to ?? "",
        }
      : { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
    installments: (raw.installments ?? []).map((inst: any) => ({
      amount: inst.amount ?? "",
      date: formatDate(inst.date),
      mode: inst.mode ?? "",
      bankName: inst.bank_name ?? "",
      paidTo: inst.paid_to ?? "",
    })),
  };
}

function transformFormDataToPayload(data: StudentRegistrationData) {
  return {
    photo: data.photo,
    academic_year: data.academicYear,
    registration_date: formatDate(
      data.registrationDate instanceof Date
        ? data.registrationDate.toISOString().split("T")[0]
        : data.registrationDate
    ),
    subject_id: Number(data.subject) || 0,
    branch_id: Number(data.branch) || 0,
    standard_id: Number(data.standard) || 0,
    course_type: data.courseType,
    reference: data.reference,
    surname: data.surname,
    first_name: data.firstName,
    middle_name: data.middleName,
    gender: data.gender,
    email: data.email,
    contact_no: data.contactNo,
    address: data.address,
    school_college_name: data.schoolCollegeName,
    payment_type: data.paymentType,
    total_fees: data.totalFees,
    discount_amount: data.discountAmount,
    guardians: data.guardians.map((g) => ({
      name: g.name,
      email: g.email,
      contact: g.contact,
      relation: g.relation,
    })),
    full_payment:
      data.paymentType === "full" && data.fullPayment?.amount
        ? {
            amount: data.fullPayment.amount,
            date: formatDate(data.fullPayment.date),
            mode: data.fullPayment.mode,
            bank_name: data.fullPayment.bankName,
            paid_to: data.fullPayment.paidTo,
          }
        : null,
    installments: data.installments
      .filter((i) => i.amount && Number(i.amount) > 0)
      .map((i) => ({
        amount: i.amount,
        date: formatDate(i.date),
        mode: i.mode,
        bank_name: i.bankName,
        paid_to: i.paidTo,
      })),
  };
}
