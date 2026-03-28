// src/pages/admin/Users/Student/StudentRegistration.tsx

import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Stepper, Button, Group, Paper, Title, Text,
  ActionIcon, Box, Alert, Badge,
} from "@mantine/core";
import {
  IconArrowLeft, IconClipboardList, IconUser, IconUsers,
  IconCurrencyRupee, IconAlertCircle, IconDeviceFloppy,
  IconArrowRight, IconCreditCard, IconX,
} from "@tabler/icons-react";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import Swal from "sweetalert2";

import type { GuardianDetails, Installment, StudentRegistrationData, ValidationErrors } from "./types";
import { validateField, validateStep, applyFieldError } from "./validation";
import { getStudentById, updateStudent } from "./studentStore";
import EnrollmentContent     from "./components/EnrollmentContent";
import StudentDetailsContent from "./components/StudentDetailsContent";
import GuardianContent       from "./components/GuardianContent";
import FeesContent           from "./components/FeesContent";
import { useTheme }          from "../../../../context/ThemeContext";

// ── Initial state ─────────────────────────────────────────────────────────────

const initialFormData: StudentRegistrationData = {
  photo: null,
  registrationDate: new Date().toISOString().split("T")[0],
  subject: "", branch: "", courseType: "", reference: "",
  surname: "", firstName: "", middleName: "", gender: "",
  email: "", contactNo: "", address: "", schoolCollegeName: "", standard: "",
  guardians: [{ id: "1", name: "", email: "", contact: "", relation: "" }],
  paymentType: "full",
  totalFees: "", discountAmount: "",
  fullPayment: { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
  installments: [
    { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
    { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
    { amount: "", date: null, mode: "", bankName: "", paidTo: "" },
  ],
};

// ── Component ─────────────────────────────────────────────────────────────────

const StudentRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { isDark } = useTheme();

  const isEditMode    = Boolean(id);
  const isPaymentMode = searchParams.get("tab") === "fees";

  const pageTitle = isEditMode
    ? isPaymentMode ? "Update Payment" : "Edit Student"
    : "Student Registration";

  const pageSubtitle = isEditMode
    ? isPaymentMode
      ? "Update payment details for this student"
      : "Edit student information — all steps available"
    : "Complete all steps to register a new student";

  const [active,    setActive]    = useState(isPaymentMode ? 3 : 0);
  const [errors,    setErrors]    = useState<ValidationErrors>({});
  const [formData,  setFormData]  = useState<StudentRegistrationData>(initialFormData);
  const [isLoading, setIsLoading] = useState(isEditMode);

  // ── Prefill on edit ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!isEditMode || !id) return;
    const data = getStudentById(id);
    if (data) {
      setFormData(data);
    } else {
      Swal.fire({
        title: "Student not found",
        text: "The student you're trying to edit doesn't exist.",
        icon: "error",
        background: isDark ? "#1e293b" : "#ffffff",
        color: isDark ? "#f8fafc" : "#0f172a",
        confirmButtonColor: "#7c3aed",
      }).then(() => navigate("/Users"));
    }
    setIsLoading(false);
  }, [id, isEditMode, navigate, isDark]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "paymentType") { setErrors({}); return updated; }
      setErrors((prevErr) => {
        let next = applyFieldError(prevErr, field, value);
        if (field === "totalFees" || field === "discountAmount") {
          const total    = parseFloat(field === "totalFees"    ? value : prev.totalFees)    || 0;
          const discount = parseFloat(field === "discountAmount" ? value : prev.discountAmount) || 0;
          if (discount > total) {
            next = { ...next, discountAmount: "Discount amount cannot be greater than total fees." };
          } else {
            const cleaned = { ...next }; delete cleaned["discountAmount"]; next = cleaned;
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
    reader.onloadend = () => setFormData((prev) => ({ ...prev, photo: reader.result as string }));
    reader.readAsDataURL(file);
  }, []);

  const handleGuardianChange = useCallback((id: string, field: keyof GuardianDetails, value: string) => {
    setFormData((prev) => {
      const guardianIndex  = prev.guardians.findIndex((g) => g.id === id);
      const updatedGuardians = prev.guardians.map((g) => g.id === id ? { ...g, [field]: value } : g);
      if (guardianIndex === 0) {
        setErrors((prevErr) => applyFieldError(prevErr, `guardian_0_${field}`, value));
      } else if (guardianIndex === 1) {
        const updatedGuardian = updatedGuardians[guardianIndex];
        const isPartiallyFilled = updatedGuardian.name || updatedGuardian.email || updatedGuardian.contact || updatedGuardian.relation;
        setErrors((prevErr) => {
          const next = { ...prevErr };
          if (isPartiallyFilled) {
            const err = validateField(`guardian_0_${field}`, value);
            if (err) next[`guardian_1_${field}`] = err; else delete next[`guardian_1_${field}`];
          } else {
            delete next["guardian_1_name"]; delete next["guardian_1_relation"];
            delete next["guardian_1_contact"]; delete next["guardian_1_email"];
          }
          return next;
        });
      }
      return { ...prev, guardians: updatedGuardians };
    });
  }, []);

  const addGuardian = useCallback(() => {
    setFormData((prev) => {
      if (prev.guardians.length >= 2) return prev;
      return { ...prev, guardians: [...prev.guardians, { id: Date.now().toString(), name: "", email: "", contact: "", relation: "" }] };
    });
  }, []);

  const removeGuardian = useCallback((id: string) => {
    setFormData((prev) => ({ ...prev, guardians: prev.guardians.filter((g) => g.id !== id) }));
  }, []);

  const handleFullPaymentChange = useCallback((field: string, value: string | Date | null) => {
    setFormData((prev) => ({ ...prev, fullPayment: { ...prev.fullPayment, [field]: value } }));
    if (field !== "bankName") setErrors((prev) => applyFieldError(prev, `full_${field}`, value));
  }, []);

  const handleInstallmentChange = useCallback((index: number, field: keyof Installment, value: string | Date | null) => {
    setFormData((prev) => ({
      ...prev,
      installments: prev.installments.map((inst, i) => i === index ? { ...inst, [field]: value } : inst),
    }));
    if (field === "bankName") return;
    if (index === 0) { setErrors((prev) => applyFieldError(prev, `inst_0_${field}`, value)); return; }
    setFormData((prev) => {
      const inst = { ...prev.installments[index], [field]: value };
      const isPartial = inst.amount || inst.date || inst.mode || inst.paidTo;
      setErrors((prevErr) =>
        isPartial
          ? applyFieldError(prevErr, `inst_${index}_${field}`, value)
          : (() => { const next = { ...prevErr }; delete next[`inst_${index}_${field}`]; return next; })()
      );
      return prev;
    });
  }, []);

  // ── Calculators ───────────────────────────────────────────────────────────
  const calculateDiscountPercentage = useCallback(() => {
    const total    = parseFloat(formData.totalFees)    || 0;
    const discount = parseFloat(formData.discountAmount) || 0;
    if (total === 0) return 0;
    return ((discount / total) * 100).toFixed(2);
  }, [formData.totalFees, formData.discountAmount]);

  const calculateFinalAmount = useCallback(() => {
    const total    = parseFloat(formData.totalFees)    || 0;
    const discount = parseFloat(formData.discountAmount) || 0;
    return (total - discount).toFixed(2);
  }, [formData.totalFees, formData.discountAmount]);

  const calculateInstallmentTotal = useCallback(() =>
    formData.installments.reduce((sum, inst) => sum + (parseFloat(inst.amount) || 0), 0).toFixed(2),
  [formData.installments]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const nextStep = useCallback(() => {
    const stepErrors = validateStep(active, formData);
    if (Object.keys(stepErrors).length > 0) { setErrors(stepErrors); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setErrors({});
    setActive((c) => Math.min(c + 1, 3));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [active, formData]);

  const prevStep = useCallback(() => {
    setErrors({});
    setActive((c) => Math.max(c - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(() => {
    const stepErrors = validateStep(3, formData);
    if (Object.keys(stepErrors).length > 0) { setErrors(stepErrors); return; }
    if (isEditMode && id) updateStudent(id, formData);

    const title = isPaymentMode ? "Payment Updated! ✅" : isEditMode ? "Student Updated! ✅" : "Registration Successful! 🎉";
    const html  = isPaymentMode
      ? `<span style="color:var(--text-secondary)">Payment for <strong style="color:#a78bfa">${formData.firstName} ${formData.surname}</strong> updated.</span>`
      : isEditMode
        ? `<span style="color:var(--text-secondary)"><strong style="color:#a78bfa">${formData.firstName} ${formData.surname}</strong>'s details updated.</span>`
        : `<span style="color:var(--text-secondary)">Student <strong style="color:#a78bfa">${formData.firstName} ${formData.surname}</strong> registered.</span>`;

    Swal.fire({
      title, html, icon: "success",
      confirmButtonText: "Go to Users",
      background: isDark ? "#1e293b" : "#ffffff",
      color:      isDark ? "#f8fafc" : "#0f172a",
      iconColor: "#4ade80",
      confirmButtonColor: "#7c3aed",
      customClass: {
        popup: "rounded-xl border border-purple-500/30",
        confirmButton: "rounded-lg px-6 py-2 font-medium",
      },
    }).then(() => navigate("/Users"));
  }, [formData, navigate, isEditMode, isPaymentMode, id, isDark]);

  const handleNavigateBack = useCallback(() => navigate("/Users"), [navigate]);

  const errorCount = Object.keys(errors).length;
  const stepProps  = { formData, handleInputChange, errors };

  // ── Loading guard ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Box className="flex items-center justify-center min-h-64">
        <Text style={{ color: "var(--text-secondary)", fontSize: 18 }}>Loading student data…</Text>
      </Box>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Box>
      <div className="max-w-7xl mx-auto">

        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <Group gap="sm" mb="sm">
            <ActionIcon size="lg" variant="subtle" color="violet" onClick={handleNavigateBack} className="flex-shrink-0">
              <IconArrowLeft size={24} />
            </ActionIcon>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Title order={2} className="text-xl sm:text-2xl md:text-3xl" style={{ color: "var(--text-primary)" }}>
                  {pageTitle}
                </Title>
                {isEditMode && (
                  <Badge color={isPaymentMode ? "green" : "violet"} variant="light" size="sm">
                    {isPaymentMode ? "Payment Mode" : "Edit Mode"}
                  </Badge>
                )}
              </div>
              <Text className="text-xs sm:text-sm truncate" style={{ color: "var(--text-secondary)" }}>
                {pageSubtitle}
              </Text>
            </div>
          </Group>

          {/* Payment-mode info banner */}
          {isEditMode && isPaymentMode && (
            <Alert color="green" variant="light" mb="md" icon={<IconCurrencyRupee size={18} />} title="Payment Update Mode"
            styles={{
              message: { color: "var(--text-primary)" },
            }}
            >
              You are updating payment details only. Steps 1–3 are locked. To change personal or enrollment info,{" "}
              <button
                onClick={() => navigate(`/Users/edit-student/${id}`)}
                className="underline text-green-400 hover:text-green-300 font-medium"
              >
                open the full edit form
              </button>.
            </Alert>
          )}
        </div>

        {/* ── Error banner ─────────────────────────────────────────── */}
        {errorCount > 0 && (
          <Alert
            icon={<IconAlertCircle size={18} />}
            title="Please fix the errors below before continuing"
            color="red" variant="light" mb="md"
            classNames={{ title: "font-semibold" }}
            styles={{
                message: { color: "var(--text-primary)" },
              }}
          >
            {errorCount === 1 ? "1 required field is missing or invalid." : `${errorCount} required fields are missing or invalid.`}
          </Alert>
        )}

        {/* ── Mobile progress bar ──────────────────────────────────── */}
        <div className="sm:hidden mb-6">
          <div className="flex justify-between items-center mb-2">
            <Text className="text-sm font-medium" style={{ color: "var(--text-accent)" }}>
              Step {active + 1} of 4
            </Text>
            <Text className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {["Enrollment", "Student", "Guardian", "Fees"][active]}
            </Text>
          </div>
          <div className="w-full rounded-full h-2" style={{ background: "var(--bg-tertiary)" }}>
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: `${((active + 1) / 4) * 100}%`, background: "var(--accent-purple)" }}
            />
          </div>
        </div>

        {/* ── Desktop Stepper ──────────────────────────────────────── */}
        <Stepper
          active={active}
          onStepClick={isPaymentMode ? undefined : setActive}
          mb="xl"
          allowNextStepsSelect={false}
          color="violet"
          size="sm"
          className="hidden sm:block"
          classNames={{
            step:            "p-2 sm:p-3",
            stepIcon:        "border-2",
            stepDescription: "text-xs sm:text-sm",
            stepLabel:       "text-sm sm:text-base",
          }}
          styles={{
            stepIcon:        { backgroundColor: "var(--bg-tertiary)", color: "var(--text-primary)" },
            stepLabel:       { color: "var(--text-accent)"    },
            stepDescription: { color: "var(--text-secondary)" },
          }}
        >
          <Stepper.Step label="Enrollment" description="Course details"  icon={<IconClipboardList size={18} />}>
            <div className="mt-4"><EnrollmentContent {...stepProps} /></div>
          </Stepper.Step>

          <Stepper.Step label="Student"    description="Personal details" icon={<IconUser size={18} />}>
            <div className="mt-4">
              <StudentDetailsContent {...stepProps} handleImageUpload={handleImageUpload} setFormData={setFormData} />
            </div>
          </Stepper.Step>

          <Stepper.Step label="Guardian"   description="Parent details"   icon={<IconUsers size={18} />}>
            <div className="mt-4">
              <GuardianContent
                formData={formData} handleGuardianChange={handleGuardianChange}
                addGuardian={addGuardian} removeGuardian={removeGuardian} errors={errors}
              />
            </div>
          </Stepper.Step>

          <Stepper.Step label="Fees"       description="Payment details"  icon={<IconCurrencyRupee size={18} />}>
            <div className="mt-4">
              <FeesContent
                formData={formData} handleInputChange={handleInputChange}
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
            <Paper
              className="p-6 sm:p-8 text-center mt-4"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)" }}
            >
              <Title order={3} mb="md" className="text-xl sm:text-2xl" style={{ color: "var(--text-accent)" }}>
                {isEditMode ? "Changes Ready to Save! ✅" : "Registration Complete! 🎉"}
              </Title>
              <Text mb="lg" style={{ color: "var(--text-secondary)", fontSize: "clamp(14px,2vw,18px)" }}>
                {isEditMode ? "All steps reviewed. Click below to save." : "All information has been filled successfully."}
              </Text>
              <Button onClick={handleSubmit} size="lg" color="green" variant="filled" fullWidth className="sm:w-auto">
                {isEditMode ? "Save Changes" : "Complete Registration"}
              </Button>
            </Paper>
          </Stepper.Completed>
        </Stepper>

        {/* ── Mobile content ───────────────────────────────────────── */}
        <div className="sm:hidden">
          {active === 0 && <EnrollmentContent {...stepProps} />}
          {active === 1 && <StudentDetailsContent {...stepProps} handleImageUpload={handleImageUpload} setFormData={setFormData} />}
          {active === 2 && (
            <GuardianContent
              formData={formData} handleGuardianChange={handleGuardianChange}
              addGuardian={addGuardian} removeGuardian={removeGuardian} errors={errors}
            />
          )}
          {active === 3 && (
            <FeesContent
              formData={formData} handleInputChange={handleInputChange}
              handleFullPaymentChange={handleFullPaymentChange}
              handleInstallmentChange={handleInstallmentChange}
              calculateDiscountPercentage={calculateDiscountPercentage}
              calculateFinalAmount={calculateFinalAmount}
              calculateInstallmentTotal={calculateInstallmentTotal}
              errors={errors}
            />
          )}
        </div>

        {/* ── Navigation buttons ───────────────────────────────────── */}
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-3">
          <Button
            variant="default" onClick={prevStep}
            disabled={active === 0 || isPaymentMode}
            size="md" fullWidth className="sm:w-auto order-2 sm:order-1"
            leftSection={<IconArrowLeft size={16} />}
            styles={{
              root: {
                backgroundColor: "var(--btn-tertiary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-default)",
                "&:disabled": { opacity: 0.5 },
              },
            }}
          >
            Previous
          </Button>

          <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
            <Button
              variant="subtle" onClick={handleNavigateBack}
              size="md" fullWidth className="sm:w-auto"
              leftSection={<IconX size={16} />}
              styles={{
                root: {
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-default)",
                  "&:hover": { backgroundColor: "var(--bg-tertiary)" },
                },
              }}
            >
              Cancel
            </Button>

            {isPaymentMode ? (
              <Button onClick={handleSubmit} color="green" size="md" fullWidth className="sm:w-auto" leftSection={<IconCreditCard size={16} />}>
                Save Payment
              </Button>
            ) : active < 3 ? (
              <Button onClick={nextStep} color="orange" size="md" fullWidth className="sm:w-auto" leftSection={<IconArrowRight size={16} />}>
                Next Step
              </Button>
            ) : (
              <Button onClick={handleSubmit} color="green" size="md" fullWidth className="sm:w-auto" leftSection={<IconDeviceFloppy size={16} />}>
                {isEditMode ? "Save Changes" : "Complete Registration"}
              </Button>
            )}
          </div>
        </div>

      </div>
    </Box>
  );
};

export default StudentRegistration;