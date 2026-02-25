// src\pages\admin\Users\Student\validation.ts

import {
  isValidAddress,
  isValidAlpha,
  isValidAlphanumeric,
  isValidEmail,
  isValidNum,
} from "../../../../utils/validatorsRegex";
import type { StudentRegistrationData, ValidationErrors } from "./types";

// ── validateField ─────────────────────────────────────────────────────────────

export function validateField(key: string, value: any): string | null {
  const str = value != null ? String(value) : "";

  switch (key) {
    // ── Step 0 ──
    case "registrationDate":
      return !value ? "Registration date is required." : null;
    case "subject":
      if (!str.trim()) return "Subject is required.";
      if (!isValidAlphanumeric(str))
        return "Subject must not contain special characters.";
      return null;
    case "branch":
      if (!str.trim()) return "Branch is required.";
      if (!isValidAlphanumeric(str))
        return "Branch must not contain special characters.";
      return null;
    case "courseType":
      return !value ? "Course type is required." : null;

    // ── Step 1 ──
    case "firstName":
      if (!str.trim()) return "First name is required.";
      if (!isValidAlpha(str)) return "First name must contain letters only ";
      return null;
    case "middleName":
      if (str.trim() && !isValidAlpha(str))
        return "Middle name must contain letters only ";
      return null;
    case "surname":
      if (!str.trim()) return "Surname is required.";
      if (!isValidAlpha(str)) return "Surname must contain letters only ";
      return null;
    case "gender":
      return !value ? "Gender is required." : null;
    case "contactNo":
      if (!str.trim()) return "Mobile number is required.";
      if (!isValidNum(str)) return "Mobile number must contain digits only.";
      return null;
    case "email":
      if (!str.trim()) return "Email is required.";
      if (!isValidEmail(str)) return "Enter a valid email address.";
      return null;
    case "address":
      if (!str.trim()) return "Address is required.";
      if (!isValidAddress(str))
        return "Address contains invalid characters. Only letters, numbers, spaces, comma (,), dot (.), hyphen (-), slash (/), ampersand (&) and parentheses () are allowed.";
      return null;
    case "schoolCollegeName":
      if (!str.trim()) return "School/College name is required.";
      if (!isValidAddress(str))
        return "School/College name contains invalid characters. Only letters, numbers, spaces, comma (,), dot (.), hyphen (-), slash (/), ampersand (&) and parentheses () are allowed.";
      return null;
    case "standard":
      if (!str.trim()) return "Standard is required.";
      if (!isValidNum(str)) return "Standard must contain digits only.";
      return null;

    // ── Step 2 (guardian 0) ──
    case "guardian_0_name":
      if (!str.trim()) return "Guardian name is required.";
      if (!isValidAlpha(str)) return "Guardian name must contain letters only ";
      return null;
    case "guardian_0_relation":
      if (!str.trim()) return "Relation is required.";
      if (!isValidAlpha(str)) return "Relation must contain letters only ";
      return null;
    case "guardian_0_contact":
      if (!str.trim()) return "Mobile number is required.";
      if (!isValidNum(str)) return "Mobile number must contain digits only.";
      return null;
    case "guardian_0_email":
      if (!str.trim()) return "Email is required.";
      if (!/\S+@\S+\.\S+/.test(str)) return "Enter a valid email.";
      return null;

    // ── Step 3 – fees ──
    case "totalFees":
      return !value ? "Total fees is required." : null;
    case "full_amount":
      return !str || str === "" ? "Amount is required." : null;
    case "full_date":
      return !value ? "Payment date is required." : null;
    case "full_mode":
      return !str.trim() ? "Payment mode is required." : null;
    case "full_paidTo":
      return !str.trim() ? "Paid to is required." : null;

    default: {
      const instMatch = key.match(/^inst_(\d+)_(amount|date|mode|paidTo)$/);
      if (instMatch) {
        const idx = Number(instMatch[1]);
        const field = instMatch[2];
        const label = `Installment ${idx + 1}`;
        if (!str || str === "") {
          if (field === "amount") return `${label} amount is required.`;
          if (field === "date" && !value) return `${label} date is required.`;
          if (field === "mode") return `${label} mode is required.`;
          if (field === "paidTo") return `${label} paid-to is required.`;
        }
      }
      return null;
    }
  }
}

// ── validateStep ──────────────────────────────────────────────────────────────

export function validateStep(
  step: number,
  formData: StudentRegistrationData,
): ValidationErrors {
  const errors: ValidationErrors = {};

  const check = (key: string, value: any) => {
    const err = validateField(key, value);
    if (err) errors[key] = err;
  };

  if (step === 0) {
    check("registrationDate", formData.registrationDate);
    check("subject", formData.subject);
    check("branch", formData.branch);
    check("courseType", formData.courseType);
  }

  if (step === 1) {
    check("firstName", formData.firstName);
    check("middleName", formData.middleName);
    check("surname", formData.surname);
    check("gender", formData.gender);
    check("contactNo", formData.contactNo);
    check("email", formData.email);
    check("address", formData.address);
    check("schoolCollegeName", formData.schoolCollegeName);
    check("standard", formData.standard);
  }

  if (step === 2) {
    const g0 = formData.guardians[0];
    check("guardian_0_name", g0.name);
    check("guardian_0_relation", g0.relation);
    check("guardian_0_contact", g0.contact);
    check("guardian_0_email", g0.email);

    if (formData.guardians.length > 1) {
      const g1 = formData.guardians[1];
      const isPartial = g1.name || g1.email || g1.contact || g1.relation;
      if (isPartial) {
        const err = (f: string, v: string) => {
          const e = validateField(`guardian_0_${f}`, v);
          if (e) errors[`guardian_1_${f}`] = e;
        };
        err("name", g1.name);
        err("relation", g1.relation);
        err("contact", g1.contact);
        err("email", g1.email);
      }
    }
  }

  if (step === 3) {
    check("totalFees", formData.totalFees);

    const total = parseFloat(formData.totalFees) || 0;
    const discount = parseFloat(formData.discountAmount) || 0;
    if (discount > total) {
      errors["discountAmount"] =
        "Discount amount cannot be greater than total fees.";
    }

    if (formData.paymentType === "full") {
      check("full_amount", formData.fullPayment.amount);
      check("full_date", formData.fullPayment.date);
      check("full_mode", formData.fullPayment.mode);
      check("full_paidTo", formData.fullPayment.paidTo);
    }

    if (formData.paymentType === "installment") {
      const filled = formData.installments.filter(
        (i) => i.amount || i.date || i.mode || i.paidTo,
      );

      if (filled.length === 0) {
        ["amount", "date", "mode", "paidTo"].forEach((f) =>
          check(`inst_0_${f}`, ""),
        );
      } else {
        formData.installments.forEach((inst, idx) => {
          const hasAny = inst.amount || inst.date || inst.mode || inst.paidTo;
          if (hasAny) {
            check(`inst_${idx}_amount`, inst.amount);
            check(`inst_${idx}_date`, inst.date);
            check(`inst_${idx}_mode`, inst.mode);
            check(`inst_${idx}_paidTo`, inst.paidTo);
          }
        });
      }
    }
  }

  return errors;
}

// ── applyFieldError ───────────────────────────────────────────────────────────

export function applyFieldError(
  prev: ValidationErrors,
  key: string,
  value: any,
): ValidationErrors {
  const err = validateField(key, value);
  if (!err) {
    if (!prev[key]) return prev;
    const next = { ...prev };
    delete next[key];
    return next;
  }
  if (prev[key] === err) return prev;
  return { ...prev, [key]: err };
}
