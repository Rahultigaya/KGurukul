import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stepper,
  Button,
  Group,
  TextInput,
  Textarea,
  Select,
  Radio,
  FileInput,
  NumberInput,
  Stack,
  Paper,
  Title,
  Text,
  Grid,
  Avatar,
  Divider,
  Badge,
  ActionIcon,
  Card,
  Box,
  Alert,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconUpload,
  IconX,
  IconPlus,
  IconTrash,
  IconClipboardList,
  IconUser,
  IconUsers,
  IconCurrencyRupee,
  IconAlertCircle,
} from "@tabler/icons-react";
import "@mantine/core/styles.css";
import { DateInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
import Swal from "sweetalert2";
import {
  isValidAddress,
  isValidAlpha,
  isValidAlphanumeric,
  isValidEmail,
  isValidNum,
} from "../../../utils/validatorsRegex";

// ── Interfaces ────────────────────────────────────────────────────────────────

interface GuardianDetails {
  id: string;
  name: string;
  email: string;
  contact: string;
  relation: string;
}

interface Installment {
  amount: string;
  date: Date | null; // 👈 was string
  mode: string;
  bankName: string;
  paidTo: string;
}

interface StudentRegistrationData {
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
    date: Date | null; // 👈 was string
    mode: string;
    bankName: string;
    paidTo: string;
  };
  installments: Installment[];
}

type ValidationErrors = Record<string, string>;

function validateField(key: string, value: any): string | null {
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
      if (!isValidNum(str)) return "Mobile number must contain digits only.";
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

    default:
      // Installment fields: inst_0_amount, inst_1_date, etc.
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

// ── validateStep: reuses validateField — no rules duplicated ─────────────────

function validateStep(
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

    // Guardian 2 — only validate if any field is filled
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

    // ✅ Cross-field check
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
        // Nothing filled at all — flag first installment
        ["amount", "date", "mode", "paidTo"].forEach((f) =>
          check(`inst_0_${f}`, ""),
        );
      } else {
        // Validate any partially-filled installment
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

// ── Helper: update a single error key via validateField ───────────────────────

function applyFieldError(
  prev: ValidationErrors,
  key: string,
  value: any,
): ValidationErrors {
  const err = validateField(key, value);
  if (!err) {
    if (!prev[key]) return prev; // nothing to change
    const next = { ...prev };
    delete next[key];
    return next;
  }
  if (prev[key] === err) return prev; // no change
  return { ...prev, [key]: err };
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface EnrollmentProps {
  formData: StudentRegistrationData;
  handleInputChange: (field: string, value: any) => void;
  errors: ValidationErrors;
}

const EnrollmentContent = React.memo<EnrollmentProps>(
  ({ formData, handleInputChange, errors }) => (
    <Stack gap="md">
      <Paper className="p-4 sm:p-6 border border-purple-500/30 bg-slate-700/50">
        <Title
          order={5}
          mb="md"
          className="text-purple-400 text-base sm:text-lg"
        >
          Enrollment Information
        </Title>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <DateInput
              label="Registration Date"
              value={formData.registrationDate}
              onChange={(value) => handleInputChange("registrationDate", value)}
              required
              withAsterisk
              error={errors.registrationDate}
              onKeyDown={(e) => e.preventDefault()}
              size="md"
              classNames={{ label: "text-white mb-2" }}
              popoverProps={{
                styles: { dropdown: { backgroundColor: "#30345c" } },
              }}
              styles={{
                calendarHeader: { color: "white", backgroundColor: "#30345c" },
                calendarHeaderLevel: { color: "white" },
                calendarHeaderControl: { color: "white" },
                weekday: { color: "#cbd5e1" },
                day: { color: "white" },
              }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <TextInput
              label="Subject"
              placeholder="Enter subject"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              required
              withAsterisk
              size="md"
              error={errors.subject}
              classNames={{ label: "text-white mb-2" }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <TextInput
              label="Branch"
              placeholder="Enter branch"
              value={formData.branch}
              onChange={(e) => handleInputChange("branch", e.target.value)}
              required
              withAsterisk
              size="md"
              error={errors.branch}
              classNames={{ label: "text-white mb-2" }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <label className="text-white text-sm font-medium block mb-2">
              Course Type <span className="text-red-500">*</span>
            </label>
            <Radio.Group
              value={formData.courseType}
              onChange={(value) => handleInputChange("courseType", value)}
              required
              size="md"
            >
              <Stack gap="xs" className="sm:hidden">
                <Radio
                  value="Regular"
                  label="Regular"
                  color="violet"
                  classNames={{ label: "text-white" }}
                />
                <Radio
                  value="Crash (Backlog)"
                  label="Crash (Backlog)"
                  color="violet"
                  classNames={{ label: "text-white" }}
                />
              </Stack>
              <Group className="hidden sm:flex">
                <Radio
                  value="Regular"
                  label="Regular"
                  color="violet"
                  classNames={{ label: "text-white" }}
                />
                <Radio
                  value="Crash (Backlog)"
                  label="Crash (Backlog)"
                  color="violet"
                  classNames={{ label: "text-white" }}
                />
              </Group>
            </Radio.Group>
            {errors.courseType && (
              <Text size="xs" c="red" mt={4}>
                {errors.courseType}
              </Text>
            )}
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Reference"
              placeholder="Enter reference (optional)"
              value={formData.reference}
              onChange={(e) => handleInputChange("reference", e.target.value)}
              size="md"
              classNames={{ label: "text-white mb-2" }}
            />
          </Grid.Col>
        </Grid>
      </Paper>
    </Stack>
  ),
);

interface StudentDetailsProps {
  formData: StudentRegistrationData;
  handleInputChange: (field: string, value: any) => void;
  handleImageUpload: (file: File | null) => void;
  setFormData: React.Dispatch<React.SetStateAction<StudentRegistrationData>>;
  errors: ValidationErrors;
}

const StudentDetailsContent = React.memo<StudentDetailsProps>(
  ({ formData, handleInputChange, handleImageUpload, setFormData, errors }) => (
    <Stack gap="md">
      <Paper className="p-4 sm:p-6 border border-purple-500/30 bg-slate-700/50">
        <Title
          order={5}
          mb="md"
          className="text-purple-400 text-base sm:text-lg"
        >
          Personal Information
        </Title>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 3 }}>
            <div className="flex flex-col items-center gap-3">
              {formData.photo ? (
                <>
                  <Avatar src={formData.photo} size={100} radius="md" />
                  <ActionIcon
                    color="red"
                    variant="light"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, photo: null }))
                    }
                  >
                    <IconX size={16} />
                  </ActionIcon>
                </>
              ) : (
                <Avatar size={100} radius="md" className="bg-slate-600">
                  <IconUser size={40} className="text-slate-400" />
                </Avatar>
              )}
              <div className="w-full max-w-[160px]">
                <FileInput
                  label="Photo"
                  placeholder="Upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  leftSection={<IconUpload size={14} />}
                  size="md"
                  classNames={{
                    label: "text-white mb-2",
                    input:
                      "truncate overflow-hidden whitespace-nowrap text-ellipsis",
                  }}
                />
              </div>
              <Text size="xs" className="text-slate-400 text-center">
                Upload student passport size photo
              </Text>
            </div>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 9 }}>
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput
                  label="First Name"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  required
                  withAsterisk
                  size="md"
                  error={errors.firstName}
                  classNames={{ label: "text-white mb-2" }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput
                  label="Middle Name"
                  placeholder="Enter middle name"
                  value={formData.middleName}
                  onChange={(e) =>
                    handleInputChange("middleName", e.target.value)
                  }
                  size="md"
                  error={errors.middleName}
                  classNames={{ label: "text-white mb-2" }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput
                  label="Surname"
                  placeholder="Enter surname"
                  value={formData.surname}
                  onChange={(e) => handleInputChange("surname", e.target.value)}
                  required
                  withAsterisk
                  size="md"
                  error={errors.surname}
                  classNames={{ label: "text-white mb-2" }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <label className="text-white text-sm font-medium block mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <Radio.Group
                  value={formData.gender}
                  onChange={(value) => handleInputChange("gender", value)}
                  required
                  size="md"
                  error={errors.gender}
                >
                  <Group gap="md">
                    <Radio
                      value="male"
                      label="Male"
                      color="violet"
                      classNames={{ label: "text-white" }}
                    />
                    <Radio
                      value="female"
                      label="Female"
                      color="violet"
                      classNames={{ label: "text-white" }}
                    />
                    <Radio
                      value="other"
                      label="Other"
                      color="violet"
                      classNames={{ label: "text-white" }}
                    />
                  </Group>
                </Radio.Group>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput
                  label="Mobile No"
                  type="text"
                  placeholder="Enter mobile number"
                  value={formData.contactNo}
                  maxLength={10}
                  onChange={(e) =>
                    handleInputChange("contactNo", e.target.value)
                  }
                  required
                  withAsterisk
                  size="md"
                  error={errors.contactNo}
                  classNames={{ label: "text-white mb-2" }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput
                  label="Email"
                  type="email"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  withAsterisk
                  size="md"
                  error={errors.email}
                  classNames={{ label: "text-white mb-2" }}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  label="Address"
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  minRows={4}
                  required
                  withAsterisk
                  size="md"
                  error={errors.address}
                  classNames={{ label: "text-white mb-2" }}
                />
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
      </Paper>

      <Paper className="p-4 sm:p-6 border border-purple-500/30 bg-slate-700/50">
        <Title
          order={5}
          mb="md"
          className="text-purple-400 text-base sm:text-lg"
        >
          Academic Background
        </Title>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="School / College Name"
              placeholder="Enter school/college name"
              value={formData.schoolCollegeName}
              onChange={(e) =>
                handleInputChange("schoolCollegeName", e.target.value)
              }
              required
              withAsterisk
              size="md"
              error={errors.schoolCollegeName}
              classNames={{ label: "text-white mb-2" }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Standard"
              placeholder="e.g., 10th, 12th, BCA"
              value={formData.standard}
              onChange={(e) => handleInputChange("standard", e.target.value)}
              required
              withAsterisk
              size="md"
              error={errors.standard}
              classNames={{ label: "text-white mb-2" }}
            />
          </Grid.Col>
        </Grid>
      </Paper>
    </Stack>
  ),
);

interface GuardianProps {
  formData: StudentRegistrationData;
  handleGuardianChange: (
    id: string,
    field: keyof GuardianDetails,
    value: string,
  ) => void;
  addGuardian: () => void;
  removeGuardian: (id: string) => void;
  errors: ValidationErrors;
}

const GuardianContent = React.memo<GuardianProps>(
  ({ formData, handleGuardianChange, addGuardian, removeGuardian, errors }) => (
    <Stack gap="md">
      <Paper className="p-4 sm:p-6 border border-purple-500/30 bg-slate-700/50">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <Title order={5} className="text-purple-400 text-base sm:text-lg">
            Parent / Guardian Details
          </Title>
          {formData.guardians.length < 2 && (
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={addGuardian}
              color="green"
              variant="light"
              size="sm"
              fullWidth
              className="sm:w-auto"
            >
              Add Guardian
            </Button>
          )}
        </div>
        <Stack gap="md">
          {formData.guardians.map((guardian, index) => (
            <Card
              key={guardian.id}
              className="p-4 sm:p-6 border border-purple-500/30 bg-slate-700/30"
            >
              <div className="flex justify-between items-start mb-4 gap-2">
                <Badge
                  color={index === 0 ? "violet" : "gray"}
                  size="lg"
                  variant="light"
                  className="text-xs sm:text-sm"
                >
                  {index === 0
                    ? "Guardian 1 (Required)"
                    : "Guardian 2 (Optional)"}
                </Badge>
                {index > 0 && (
                  <ActionIcon
                    color="red"
                    variant="light"
                    size="lg"
                    onClick={() => removeGuardian(guardian.id)}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                )}
              </div>
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Guardian Name"
                    placeholder="Enter name"
                    value={guardian.name}
                    onChange={(e) =>
                      handleGuardianChange(guardian.id, "name", e.target.value)
                    }
                    required={index === 0}
                    withAsterisk={index === 0}
                    size="md"
                    error={
                      index === 0
                        ? errors[`guardian_0_name`]
                        : errors[`guardian_1_name`]
                    }
                    classNames={{ label: "text-white mb-2" }}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Relation"
                    placeholder="Enter relation"
                    value={guardian.relation}
                    onChange={(e) =>
                      handleGuardianChange(
                        guardian.id,
                        "relation",
                        e.target.value,
                      )
                    }
                    required={index === 0}
                    withAsterisk={index === 0}
                    size="md"
                    error={
                      index === 0
                        ? errors[`guardian_0_relation`]
                        : errors[`guardian_1_relation`]
                    }
                    classNames={{ label: "text-white mb-2" }}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Mobile No"
                    type="text"
                    placeholder="Enter mobile number"
                    value={guardian.contact}
                    onChange={(e) =>
                      handleGuardianChange(
                        guardian.id,
                        "contact",
                        e.target.value,
                      )
                    }
                    required={index === 0}
                    withAsterisk={index === 0}
                    size="md"
                    maxLength={10}
                    error={
                      index === 0
                        ? errors[`guardian_0_contact`]
                        : errors[`guardian_1_contact`]
                    }
                    classNames={{ label: "text-white mb-2" }}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Email"
                    type="email"
                    placeholder="parent@example.com"
                    value={guardian.email}
                    onChange={(e) =>
                      handleGuardianChange(guardian.id, "email", e.target.value)
                    }
                    required={index === 0}
                    withAsterisk={index === 0}
                    size="md"
                    error={
                      index === 0
                        ? errors[`guardian_0_email`]
                        : errors[`guardian_1_email`]
                    }
                    classNames={{ label: "text-white mb-2" }}
                  />
                </Grid.Col>
              </Grid>
            </Card>
          ))}
        </Stack>
      </Paper>
    </Stack>
  ),
);

interface FeesProps {
  formData: StudentRegistrationData;
  handleInputChange: (field: string, value: any) => void;
  handleFullPaymentChange: (field: string, value: string | Date | null) => void;
  handleInstallmentChange: (
    index: number,
    field: keyof Installment,
    value: string | Date | null, 
  ) => void;
  calculateDiscountPercentage: () => string | number;
  calculateFinalAmount: () => string;
  calculateInstallmentTotal: () => string;
  errors: ValidationErrors;
}

const FeesContent = React.memo<FeesProps>(
  ({
    formData,
    handleInputChange,
    handleFullPaymentChange,
    handleInstallmentChange,
    calculateDiscountPercentage,
    calculateFinalAmount,
    calculateInstallmentTotal,
    errors,
  }) => (
    <Stack gap="md">
      <Paper className="p-4 sm:p-6 border border-purple-500/30 bg-slate-700/50">
        <Title
          order={5}
          mb="md"
          className="text-purple-400 text-base sm:text-lg"
        >
          Fees Structure
        </Title>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <NumberInput
              label="Total Fees"
              placeholder="Enter total fees"
              value={formData.totalFees}
              onChange={(value) =>
                handleInputChange("totalFees", value.toString())
              }
              leftSection={<IconCurrencyRupee size={16} />}
              min={0}
              required
              withAsterisk
              size="md"
              thousandSeparator=","
              error={errors.totalFees}
              classNames={{ label: "text-white mb-2" }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <NumberInput
              label="Discount Amount"
              placeholder="Enter discount"
              value={formData.discountAmount}
              onChange={(value) =>
                handleInputChange("discountAmount", value.toString())
              }
              leftSection={<IconCurrencyRupee size={16} />}
              min={0}
              size="md"
              error={errors.discountAmount} // 👈 add this
              thousandSeparator=","
              classNames={{ label: "text-white mb-2" }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              label="Discount Percentage"
              value={`${calculateDiscountPercentage()}%`}
              readOnly
              size="md"
              classNames={{
                label: "text-white mb-2",
                input:
                  "bg-purple-500/10 border-purple-500/50 font-bold text-purple-300",
              }}
            />
          </Grid.Col>
        </Grid>

        {formData.totalFees && (
          <Paper className="p-4 mt-4 border border-green-500/50 bg-green-500/10">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <Text className="font-medium text-base sm:text-lg text-white">
                Final Amount to Pay:
              </Text>
              <Text className="text-lg sm:text-xl font-bold text-green-400">
                ₹{calculateFinalAmount()}
              </Text>
            </div>
          </Paper>
        )}

        <Divider my="lg" color="violet" />

        <div className="mb-3">
          <label className="text-white text-sm font-medium">
            Payment Type <span className="text-red-500">*</span>
          </label>
        </div>
        <Radio.Group
          value={formData.paymentType}
          onChange={(value) =>
            handleInputChange(
              "paymentType",
              value as "full" | "installment" | "later",
            )
          }
          required
          size="md"
        >
          <Stack gap="xs" className="sm:hidden">
            <Radio
              value="full"
              label="Full Payment"
              color="violet"
              classNames={{ label: "text-white" }}
            />
            <Radio
              value="installment"
              label="3 Installments"
              color="violet"
              classNames={{ label: "text-white" }}
            />
            <Radio
              value="later"
              label="Pay Later"
              color="violet"
              classNames={{ label: "text-white" }}
            />
          </Stack>
          <Group className="hidden sm:flex">
            <Radio
              value="full"
              label="Full Payment"
              color="violet"
              classNames={{ label: "text-white" }}
            />
            <Radio
              value="installment"
              label="3 Installments"
              color="violet"
              classNames={{ label: "text-white" }}
            />
            <Radio
              value="later"
              label="Pay Later"
              color="violet"
              classNames={{ label: "text-white" }}
            />
          </Group>
        </Radio.Group>

        {formData.paymentType === "later" && (
          <Paper className="p-4 mt-4 border border-yellow-500/50 bg-yellow-500/10">
            <Text className="text-yellow-300 text-sm">
              ⏳ Payment details can be added later. You can proceed with
              registration now.
            </Text>
          </Paper>
        )}
      </Paper>

      {/* Full Payment */}
      {formData.paymentType === "full" && (
        <Paper className="p-4 sm:p-6 border border-purple-500/30 bg-slate-700/50">
          <Title
            order={5}
            mb="md"
            className="text-purple-400 text-base sm:text-lg"
          >
            Payment Details
          </Title>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Amount"
                placeholder="Enter amount"
                value={formData.fullPayment.amount}
                onChange={(value) =>
                  handleFullPaymentChange("amount", value.toString())
                }
                leftSection={<IconCurrencyRupee size={16} />}
                required
                withAsterisk
                size="md"
                thousandSeparator=","
                error={errors["full_amount"]}
                classNames={{ label: "text-white mb-2" }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <DateInput
                label="Payment Date"
                placeholder="Select date"
                value={formData.fullPayment.date}
                onChange={(value) => handleFullPaymentChange("date", value)}
                required
                withAsterisk
                size="md"
                error={errors["full_date"]}
                onKeyDown={(e) => e.preventDefault()}
                classNames={{ label: "text-white mb-2" }}
                popoverProps={{
                  styles: { dropdown: { backgroundColor: "#30345c" } },
                }}
                styles={{
                  calendarHeader: {
                    color: "white",
                    backgroundColor: "#30345c",
                  },
                  calendarHeaderLevel: { color: "white" },
                  calendarHeaderControl: { color: "white" },
                  weekday: { color: "#cbd5e1" },
                  day: { color: "white" },
                }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Payment Mode"
                placeholder="Select Mode"
                value={formData.fullPayment.mode}
                onChange={(value) =>
                  handleFullPaymentChange("mode", value || "")
                }
                data={[
                  { value: "Cash", label: "Cash" },
                  { value: "Cheque", label: "Cheque" },
                  { value: "Online", label: "Online" },
                ]}
                required
                withAsterisk
                size="md"
                error={errors["full_mode"]}
                classNames={{ label: "text-white mb-2" }}
                comboboxProps={{
                  styles: {
                    dropdown: {
                      background: "#1c2739",
                      border: "1px solid rgba(139,92,246,0.3)",
                      color: "white",
                    },
                  },
                }}
                styles={{
                  option: { color: "white", backgroundColor: "#1c2739" },
                }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Bank Name"
                placeholder="Enter bank name (if applicable)"
                value={formData.fullPayment.bankName}
                onChange={(e) =>
                  handleFullPaymentChange("bankName", e.target.value)
                }
                size="md"
                classNames={{ label: "text-white mb-2" }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Paid To"
                placeholder="Select Account"
                value={formData.fullPayment.paidTo}
                onChange={(value) =>
                  handleFullPaymentChange("paidTo", value || "")
                }
                data={[
                  { value: "Sir Account", label: "Sir Account" },
                  { value: "Ma'am Account", label: "Ma'am Account" },
                ]}
                required
                withAsterisk
                size="md"
                error={errors["full_paidTo"]}
                classNames={{ label: "text-white mb-2" }}
                comboboxProps={{
                  styles: {
                    dropdown: {
                      background: "#1c2739",
                      border: "1px solid rgba(139,92,246,0.3)",
                      color: "white",
                    },
                  },
                }}
                styles={{
                  option: { color: "white", backgroundColor: "#1c2739" },
                }}
              />
            </Grid.Col>
          </Grid>
        </Paper>
      )}

      {/* Installments */}
      {formData.paymentType === "installment" && (
        <Stack gap="md">
          <Paper className="p-3 border border-blue-500/30 bg-blue-500/10">
            <Text size="sm" className="text-blue-300">
              💡 At least 1 installment is required. Installments 2 and 3 are
              optional — only fill them if payment has been made.
            </Text>
          </Paper>

          {formData.installments.map((installment, index) => (
            <Paper
              key={index}
              className="p-4 sm:p-6 border border-purple-500/30 bg-slate-700/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Title
                  order={5}
                  className="text-purple-400 text-base sm:text-lg"
                >
                  Installment {index + 1}
                </Title>
                {index === 0 ? (
                  <Badge color="red" size="sm" variant="light">
                    Required
                  </Badge>
                ) : (
                  <Badge color="gray" size="sm" variant="light">
                    Optional
                  </Badge>
                )}
              </div>
              <Grid gutter="md" mt="xs">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Amount"
                    placeholder="Enter amount"
                    value={installment.amount}
                    onChange={(value) =>
                      handleInstallmentChange(index, "amount", value.toString())
                    }
                    leftSection={<IconCurrencyRupee size={16} />}
                    required={index === 0}
                    withAsterisk={index === 0}
                    size="md"
                    thousandSeparator=","
                    error={errors[`inst_${index}_amount`]}
                    classNames={{ label: "text-white mb-2" }}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <DateInput
                    label="Payment Date"
                    placeholder="Select date"
                    value={installment.date}
                    onChange={(value) =>
                      handleInstallmentChange(index, "date", value)
                    }
                    required={index === 0}
                    withAsterisk={index === 0}
                    size="md"
                    error={errors[`inst_${index}_date`]}
                    onKeyDown={(e) => e.preventDefault()}
                    classNames={{ label: "text-white mb-2" }}
                    popoverProps={{
                      styles: { dropdown: { backgroundColor: "#30345c" } },
                    }}
                    styles={{
                      calendarHeader: {
                        color: "white",
                        backgroundColor: "#30345c",
                      },
                      calendarHeaderLevel: { color: "white" },
                      calendarHeaderControl: { color: "white" },
                      weekday: { color: "#cbd5e1" },
                      day: { color: "white" },
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Select
                    label="Payment Mode"
                    placeholder="Select Mode"
                    value={installment.mode}
                    onChange={(value) =>
                      handleInstallmentChange(index, "mode", value || "")
                    }
                    data={[
                      { value: "Cash", label: "Cash" },
                      { value: "Cheque", label: "Cheque" },
                      { value: "Online", label: "Online" },
                    ]}
                    required={index === 0}
                    withAsterisk={index === 0}
                    size="md"
                    error={errors[`inst_${index}_mode`]}
                    classNames={{ label: "text-white mb-2" }}
                    comboboxProps={{
                      styles: {
                        dropdown: {
                          background: "#1c2739",
                          border: "1px solid rgba(139,92,246,0.3)",
                          color: "white",
                        },
                      },
                    }}
                    styles={{
                      option: { color: "white", backgroundColor: "#1c2739" },
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Bank Name"
                    placeholder="Bank name (if applicable)"
                    value={installment.bankName}
                    onChange={(e) =>
                      handleInstallmentChange(index, "bankName", e.target.value)
                    }
                    size="md"
                    classNames={{ label: "text-white mb-2" }}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Select
                    label="Paid To"
                    placeholder="Select Account"
                    value={installment.paidTo}
                    onChange={(value) =>
                      handleInstallmentChange(index, "paidTo", value || "")
                    }
                    data={[
                      { value: "Sir Account", label: "Sir Account" },
                      { value: "Ma'am Account", label: "Ma'am Account" },
                    ]}
                    required={index === 0}
                    withAsterisk={index === 0}
                    size="md"
                    error={errors[`inst_${index}_paidTo`]}
                    classNames={{ label: "text-white mb-2" }}
                  />
                </Grid.Col>
              </Grid>
            </Paper>
          ))}

          <Paper className="p-4 border border-blue-500/50 bg-blue-500/10">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <Text className="font-medium text-white text-base sm:text-lg">
                Total from Installments:
              </Text>
              <Text className="text-lg sm:text-xl font-bold text-blue-400">
                ₹{calculateInstallmentTotal()}
              </Text>
            </div>
          </Paper>
        </Stack>
      )}
    </Stack>
  ),
);

// ── Main Component ────────────────────────────────────────────────────────────

const StudentRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const [formData, setFormData] = useState<StudentRegistrationData>({
    photo: null,
    registrationDate: new Date().toISOString().split("T")[0],
    subject: "",
    branch: "",
    courseType: "",
    reference: "",
    surname: "",
    firstName: "",
    middleName: "",
    gender: "",
    email: "",
    contactNo: "",
    address: "",
    schoolCollegeName: "",
    standard: "",
    guardians: [{ id: "1", name: "", email: "", contact: "", relation: "" }],
    paymentType: "full",
    totalFees: "",
    discountAmount: "",
    fullPayment: { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
    installments: [
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
      { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
    ],
  });

  // ── onChange: update state + run validateField (single source of truth) ───
  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "paymentType") {
        setErrors({});
        return updated;
      }

      setErrors((prevErr) => {
        let next = applyFieldError(prevErr, field, value);

        // ✅ Cross-validate totalFees vs discountAmount
        if (field === "totalFees" || field === "discountAmount") {
          const total =
            parseFloat(field === "totalFees" ? value : prev.totalFees) || 0;
          const discount =
            parseFloat(
              field === "discountAmount" ? value : prev.discountAmount,
            ) || 0;

          if (discount > total) {
            next = {
              ...next,
              discountAmount:
                "Discount amount cannot be greater than total fees.",
            };
          } else {
            const cleaned = { ...next };
            delete cleaned["discountAmount"];
            next = cleaned;
          }
        }

        return next;
      });

      return updated;
    });
  }, []);

  const handleImageUpload = useCallback((file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData((prev) => ({ ...prev, photo: reader.result as string }));
    reader.readAsDataURL(file);
  }, []);

  const handleGuardianChange = useCallback(
    (id: string, field: keyof GuardianDetails, value: string) => {
      setFormData((prev) => {
        const guardianIndex = prev.guardians.findIndex((g) => g.id === id);
        const updatedGuardians = prev.guardians.map((g) =>
          g.id === id ? { ...g, [field]: value } : g,
        );

        if (guardianIndex === 0) {
          // Guardian 1 — always validate the field being typed
          setErrors((prevErr) =>
            applyFieldError(prevErr, `guardian_0_${field}`, value),
          );
        } else if (guardianIndex === 1) {
          const updatedGuardian = updatedGuardians[guardianIndex];
          const isPartiallyFilled =
            updatedGuardian.name ||
            updatedGuardian.email ||
            updatedGuardian.contact ||
            updatedGuardian.relation;

          setErrors((prevErr) => {
            const next = { ...prevErr };

            if (isPartiallyFilled) {
              // ✅ Only validate the field currently being typed
              const errKey = `guardian_1_${field}`;
              const err = validateField(`guardian_0_${field}`, value);
              if (err) {
                next[errKey] = err;
              } else {
                delete next[errKey];
              }
            } else {
              // All fields empty — clear all guardian 2 errors
              delete next["guardian_1_name"];
              delete next["guardian_1_relation"];
              delete next["guardian_1_contact"];
              delete next["guardian_1_email"];
            }

            return next;
          });
        }

        return { ...prev, guardians: updatedGuardians };
      });
    },
    [],
  );

  const addGuardian = useCallback(() => {
    setFormData((prev) => {
      if (prev.guardians.length >= 2) return prev;
      return {
        ...prev,
        guardians: [
          ...prev.guardians,
          {
            id: Date.now().toString(),
            name: "",
            email: "",
            contact: "",
            relation: "",
          },
        ],
      };
    });
  }, []);

  const removeGuardian = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      guardians: prev.guardians.filter((g) => g.id !== id),
    }));
  }, []);

  const handleFullPaymentChange = useCallback(
    (field: string, value: string | Date | null) => {
      setFormData((prev) => ({
        ...prev,
        fullPayment: { ...prev.fullPayment, [field]: value },
      }));
      if (field === "bankName") return;
      setErrors((prev) => applyFieldError(prev, `full_${field}`, value));
    },
    [],
  );
  const handleInstallmentChange = useCallback(
    (index: number, field: keyof Installment, value: string | Date | null) => {
      setFormData((prev) => ({
        ...prev,
        installments: prev.installments.map((inst, i) =>
          i === index ? { ...inst, [field]: value } : inst,
        ),
      }));

      if (field === "bankName") return; // optional

      // For installment 0 — always validate required fields
      if (index === 0) {
        setErrors((prev) => applyFieldError(prev, `inst_0_${field}`, value));
        return;
      }

      // For optional installments — validate only if they are partially filled
      setFormData((prev) => {
        const inst = { ...prev.installments[index], [field]: value };
        const isPartial = inst.amount || inst.date || inst.mode || inst.paidTo;
        setErrors((prevErr) =>
          isPartial
            ? applyFieldError(prevErr, `inst_${index}_${field}`, value)
            : (() => {
                const next = { ...prevErr };
                delete next[`inst_${index}_${field}`];
                return next;
              })(),
        );
        return prev;
      });
    },
    [],
  );

  const calculateDiscountPercentage = useCallback(() => {
    const total = parseFloat(formData.totalFees) || 0;
    const discount = parseFloat(formData.discountAmount) || 0;
    if (total === 0) return 0;
    return ((discount / total) * 100).toFixed(2);
  }, [formData.totalFees, formData.discountAmount]);

  const calculateFinalAmount = useCallback(() => {
    const total = parseFloat(formData.totalFees) || 0;
    const discount = parseFloat(formData.discountAmount) || 0;
    return (total - discount).toFixed(2);
  }, [formData.totalFees, formData.discountAmount]);

  const calculateInstallmentTotal = useCallback(() => {
    return formData.installments
      .reduce((sum, inst) => sum + (parseFloat(inst.amount) || 0), 0)
      .toFixed(2);
  }, [formData.installments]);

  const nextStep = useCallback(() => {
    const stepErrors = validateStep(active, formData); // reuses validateField internally
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setErrors({});
    setActive((c) => Math.min(c + 1, 3));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [active, formData]);

  const prevStep = useCallback(() => {
    setErrors({});
    setActive((c) => Math.max(c - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = useCallback(() => {
    const stepErrors = validateStep(3, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    console.log("Registration Data:", formData);
    Swal.fire({
      title: "Registration Successful! 🎉",
      html: `<span style="color:#cbd5e1">Student <strong style="color:#a78bfa">${formData.firstName} ${formData.surname}</strong> has been registered successfully.</span>`,
      icon: "success",
      confirmButtonText: "Go to Users",
      background: "#1e293b",
      color: "#f8fafc",
      iconColor: "#4ade80",
      confirmButtonColor: "#7c3aed",
      customClass: {
        popup: "rounded-xl border border-purple-500/30",
        confirmButton: "rounded-lg px-6 py-2 font-medium",
      },
    }).then(() => navigate("/Users"));
  }, [formData, navigate]);

  const handleNavigateBack = useCallback(() => navigate("/Users"), [navigate]);
  const errorCount = Object.keys(errors).length;

  return (
    <Box>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <Group gap="sm" mb="sm">
            <ActionIcon
              size="lg"
              variant="subtle"
              color="violet"
              onClick={handleNavigateBack}
              className="flex-shrink-0"
            >
              <IconArrowLeft size={24} />
            </ActionIcon>
            <div className="min-w-0">
              <Title
                order={2}
                className="text-white text-xl sm:text-2xl md:text-3xl"
              >
                Student Registration old
              </Title>
              <Text className="text-slate-400 text-xs sm:text-sm truncate">
                Complete all steps to register a new student
              </Text>
            </div>
          </Group>
        </div>

        {/* Error Banner */}
        {errorCount > 0 && (
          <Alert
            icon={<IconAlertCircle size={18} />}
            title="Please fix the errors below before continuing"
            color="red"
            variant="light"
            mb="md"
            classNames={{ title: "font-semibold" }}
          >
            {errorCount === 1
              ? "1 required field is missing or invalid."
              : `${errorCount} required fields are missing or invalid.`}
          </Alert>
        )}

        {/* Mobile Progress */}
        <div className="sm:hidden mb-6">
          <div className="flex justify-between items-center mb-2">
            <Text className="text-sm text-purple-400 font-medium">
              Step {active + 1} of 4
            </Text>
            <Text className="text-xs text-slate-400">
              {["Enrollment", "Student", "Guardian", "Fees"][active]}
            </Text>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((active + 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Desktop Stepper */}
        <Stepper
          active={active}
          onStepClick={setActive}
          mb="xl"
          allowNextStepsSelect={false}
          color="violet"
          size="sm"
          className="hidden sm:block"
          classNames={{
            step: "p-2 sm:p-3",
            stepIcon: "bg-slate-700 border-2 text-white",
            stepDescription: "text-slate-400 text-xs sm:text-sm",
            stepLabel: "text-purple-500 text-sm sm:text-base",
          }}
        >
          <Stepper.Step
            label="Enrollment"
            description="Course details"
            icon={<IconClipboardList size={18} />}
          >
            <div className="mt-4">
              <EnrollmentContent
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
              />
            </div>
          </Stepper.Step>
          <Stepper.Step
            label="Student"
            description="Personal details"
            icon={<IconUser size={18} />}
          >
            <div className="mt-4">
              <StudentDetailsContent
                formData={formData}
                handleInputChange={handleInputChange}
                handleImageUpload={handleImageUpload}
                setFormData={setFormData}
                errors={errors}
              />
            </div>
          </Stepper.Step>
          <Stepper.Step
            label="Guardian"
            description="Parent details"
            icon={<IconUsers size={18} />}
          >
            <div className="mt-4">
              <GuardianContent
                formData={formData}
                handleGuardianChange={handleGuardianChange}
                addGuardian={addGuardian}
                removeGuardian={removeGuardian}
                errors={errors}
              />
            </div>
          </Stepper.Step>
          <Stepper.Step
            label="Fees"
            description="Payment details"
            icon={<IconCurrencyRupee size={18} />}
          >
            <div className="mt-4">
              <FeesContent
                formData={formData}
                handleInputChange={handleInputChange}
                handleFullPaymentChange={handleFullPaymentChange}
                handleInstallmentChange={handleInstallmentChange}
                calculateDiscountPercentage={calculateDiscountPercentage}
                calculateFinalAmount={calculateFinalAmount}
                calculateInstallmentTotal={calculateInstallmentTotal}
                errors={errors}
              />
            </div>
          </Stepper.Step>
          <Stepper.Completed>
            <Paper className="p-6 sm:p-8 border border-purple-500/50 text-center mt-4">
              <Title
                order={3}
                mb="md"
                className="text-purple-400 text-xl sm:text-2xl"
              >
                Registration Complete! 🎉
              </Title>
              <Text className="text-slate-400 mb-6 sm:mb-8 text-base sm:text-lg">
                All information has been submitted successfully.
              </Text>
              <Button
                onClick={handleSubmit}
                size="lg"
                color="green"
                variant="filled"
                fullWidth
                className="sm:w-auto"
              >
                Complete Registration
              </Button>
            </Paper>
          </Stepper.Completed>
        </Stepper>

        {/* Mobile Content */}
        <div className="sm:hidden">
          {active === 0 && (
            <EnrollmentContent
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
            />
          )}
          {active === 1 && (
            <StudentDetailsContent
              formData={formData}
              handleInputChange={handleInputChange}
              handleImageUpload={handleImageUpload}
              setFormData={setFormData}
              errors={errors}
            />
          )}
          {active === 2 && (
            <GuardianContent
              formData={formData}
              handleGuardianChange={handleGuardianChange}
              addGuardian={addGuardian}
              removeGuardian={removeGuardian}
              errors={errors}
            />
          )}
          {active === 3 && (
            <FeesContent
              formData={formData}
              handleInputChange={handleInputChange}
              handleFullPaymentChange={handleFullPaymentChange}
              handleInstallmentChange={handleInstallmentChange}
              calculateDiscountPercentage={calculateDiscountPercentage}
              calculateFinalAmount={calculateFinalAmount}
              calculateInstallmentTotal={calculateInstallmentTotal}
              errors={errors}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-3">
          <Button
            variant="default"
            onClick={prevStep}
            disabled={active === 0}
            size="md"
            fullWidth
            className="sm:w-auto order-2 sm:order-1 !bg-slate-600 hover:!bg-slate-500 !text-white !border-slate-500 disabled:!bg-slate-700 disabled:!text-slate-500 disabled:!opacity-60"
          >
            Previous
          </Button>
          <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
            <Button
              variant="subtle"
              onClick={handleNavigateBack}
              size="md"
              fullWidth
              className="sm:w-auto !text-white hover:!bg-slate-600/50 !border !border-slate-500"
            >
              Cancel
            </Button>
            {active < 3 ? (
              <Button
                onClick={nextStep}
                color="violet"
                size="md"
                fullWidth
                className="sm:w-auto"
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                color="green"
                size="md"
                fullWidth
                className="sm:w-auto"
              >
                Complete Registration
              </Button>
            )}
          </div>
        </div>
      </div>
    </Box>
  );
};

export default StudentRegistration;
