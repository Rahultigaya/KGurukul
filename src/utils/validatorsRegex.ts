// src/utils/validators.ts

/** Only alphabets and spaces */
export const isValidAlpha = (val: string): boolean => /^[A-Za-z\s]+$/.test(val);

/** Only alphabets and spaces */
export const isValidNum = (val: string): boolean => /^[0-9]+$/.test(val);
/** Alphanumeric with spaces */
export const isValidAlphanumeric = (val: string): boolean =>
  /^[A-Za-z0-9\s]+$/.test(val);

/** Standard email validation */
export const isValidEmail = (val: string): boolean =>
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(val);

/** School/College name — alphanumeric + common punctuation */
export const isValidSchoolName = (val: string): boolean =>
  /^[A-Za-z0-9\s.,'\-()&]+$/.test(val);

/** Address name — alphanumeric + common punctuation */
export const isValidAddress = (val: string): boolean =>
  /^(?=.*[A-Za-z0-9])[A-Za-z0-9\s,.\-/&()]+$/.test(val.trim());