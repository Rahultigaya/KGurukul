// src/pages/admin/Users/Student/StudentRegistration.tsx

import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Stepper,
  Button,
  Group,
  Paper,
  Title,
  Text,
  ActionIcon,
  Box,
  Alert,
  Badge,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconClipboardList,
  IconUser,
  IconUsers,
  IconCurrencyRupee,
  IconAlertCircle,
} from "@tabler/icons-react";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import Swal from "sweetalert2";

import type {
  GuardianDetails,
  Installment,
  StudentRegistrationData,
  ValidationErrors,
} from "./types";
import { validateField, validateStep, applyFieldError } from "./validation";
import { getStudentById, updateStudent } from "./studentStore";
import EnrollmentContent from "./components/EnrollmentContent";
import StudentDetailsContent from "./components/StudentDetailsContent";
import GuardianContent from "./components/GuardianContent";
import FeesContent from "./components/FeesContent";

// ── Initial State (blank — used for new registration only) ────────────────────

const initialFormData: StudentRegistrationData = {
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
};

// ── Main Component ────────────────────────────────────────────────────────────

const StudentRegistration: React.FC = () => {
  const navigate = useNavigate();

  // ── URL params ─────────────────────────────────────────────────────────────
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  // ── Mode flags ─────────────────────────────────────────────────────────────
  // isEditMode    → URL has :id         e.g. /Users/edit-student/3
  // isPaymentMode → URL has ?tab=fees   e.g. /Users/edit-student/3?tab=fees
  const isEditMode = Boolean(id);
  const isPaymentMode = searchParams.get("tab") === "fees";

  // ── Dynamic labels ─────────────────────────────────────────────────────────
  const pageTitle = isEditMode
    ? isPaymentMode
      ? "Update Payment"
      : "Edit Student"
    : "Student Registration";

  const pageSubtitle = isEditMode
    ? isPaymentMode
      ? "Update payment details for this student"
      : "Edit student information — all steps available"
    : "Complete all steps to register a new student";

  // ── State ──────────────────────────────────────────────────────────────────
  const [active, setActive] = useState(isPaymentMode ? 3 : 0);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] =
    useState<StudentRegistrationData>(initialFormData);
  const [isLoading, setIsLoading] = useState(isEditMode);

  // ── Prefill form when editing ──────────────────────────────────────────────
  useEffect(() => {
    if (!isEditMode || !id) return;

    // Replace getStudentById with your real API call later:
    // const res = await fetch(`/api/students/${id}`);
    // const data = await res.json();
    const data = getStudentById(id);

    if (data) {
      setFormData(data);
    } else {
      Swal.fire({
        title: "Student not found",
        text: "The student you're trying to edit doesn't exist.",
        icon: "error",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#7c3aed",
      }).then(() => navigate("/Users"));
    }

    setIsLoading(false);
  }, [id, isEditMode, navigate]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "paymentType") {
        setErrors({});
        return updated;
      }
      setErrors((prevErr) => {
        let next = applyFieldError(prevErr, field, value);
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
              const err = validateField(`guardian_0_${field}`, value);
              if (err) next[`guardian_1_${field}`] = err;
              else delete next[`guardian_1_${field}`];
            } else {
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
      if (field === "bankName") return;
      if (index === 0) {
        setErrors((prev) => applyFieldError(prev, `inst_0_${field}`, value));
        return;
      }
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

  // ── Calculators ────────────────────────────────────────────────────────────

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

  // ── Navigation ─────────────────────────────────────────────────────────────

  const nextStep = useCallback(() => {
    const stepErrors = validateStep(active, formData);
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

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = useCallback(() => {
    const stepErrors = validateStep(3, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    if (isEditMode && id) {
      // Replace with real API call:
      // await fetch(`/api/students/${id}`, { method: "PUT", body: JSON.stringify(formData) });
      updateStudent(id, formData);
    }

    const title = isPaymentMode
      ? "Payment Updated! ✅"
      : isEditMode
        ? "Student Updated! ✅"
        : "Registration Successful! 🎉";

    const html = isPaymentMode
      ? `<span style="color:#cbd5e1">Payment for <strong style="color:#a78bfa">${formData.firstName} ${formData.surname}</strong> updated.</span>`
      : isEditMode
        ? `<span style="color:#cbd5e1"><strong style="color:#a78bfa">${formData.firstName} ${formData.surname}</strong>'s details updated.</span>`
        : `<span style="color:#cbd5e1">Student <strong style="color:#a78bfa">${formData.firstName} ${formData.surname}</strong> registered.</span>`;

    Swal.fire({
      title,
      html,
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
  }, [formData, navigate, isEditMode, isPaymentMode, id]);

  const handleNavigateBack = useCallback(() => navigate("/Users"), [navigate]);

  const errorCount = Object.keys(errors).length;
  const stepProps = { formData, handleInputChange, errors };

  // ── Loading guard ──────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center min-h-64">
        <Text className="text-slate-400 text-lg">Loading student data...</Text>
      </Box>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

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
              <div className="flex items-center gap-2 flex-wrap">
                <Title
                  order={2}
                  className="text-white text-xl sm:text-2xl md:text-3xl"
                >
                  {pageTitle}
                </Title>
                {isEditMode && (
                  <Badge
                    color={isPaymentMode ? "green" : "violet"}
                    variant="light"
                    size="sm"
                  >
                    {isPaymentMode ? "Payment Mode" : "Edit Mode"}
                  </Badge>
                )}
              </div>
              <Text className="text-slate-400 text-xs sm:text-sm truncate">
                {pageSubtitle}
              </Text>
            </div>
          </Group>

          {/* Payment-mode info banner */}
          {isEditMode && isPaymentMode && (
            <Alert
              color="green"
              variant="light"
              mb="md"
              icon={<IconCurrencyRupee size={18} />}
              title="Payment Update Mode"
            >
              You are updating payment details only. Steps 1–3 are locked. To
              change personal or enrollment info,{" "}
              <button
                onClick={() => navigate(`/Users/edit-student/${id}`)}
                className="underline text-green-300 hover:text-green-200 font-medium"
              >
                open the full edit form
              </button>
              .
            </Alert>
          )}
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
          onStepClick={isPaymentMode ? undefined : setActive}
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
              <EnrollmentContent {...stepProps} />
            </div>
          </Stepper.Step>

          <Stepper.Step
            label="Student"
            description="Personal details"
            icon={<IconUser size={18} />}
          >
            <div className="mt-4">
              <StudentDetailsContent
                {...stepProps}
                handleImageUpload={handleImageUpload}
                setFormData={setFormData}
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
                {isEditMode
                  ? "Changes Ready to Save! ✅"
                  : "Registration Complete! 🎉"}
              </Title>
              <Text className="text-slate-400 mb-6 sm:mb-8 text-base sm:text-lg">
                {isEditMode
                  ? "All steps reviewed. Click below to save."
                  : "All information has been filled successfully."}
              </Text>
              <Button
                onClick={handleSubmit}
                size="lg"
                color="green"
                variant="filled"
                fullWidth
                className="sm:w-auto"
              >
                {isEditMode ? "Save Changes" : "Complete Registration"}
              </Button>
            </Paper>
          </Stepper.Completed>
        </Stepper>

        {/* Mobile Content */}
        <div className="sm:hidden">
          {active === 0 && <EnrollmentContent {...stepProps} />}
          {active === 1 && (
            <StudentDetailsContent
              {...stepProps}
              handleImageUpload={handleImageUpload}
              setFormData={setFormData}
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

        {/* Navigation Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-3">
          <Button
            variant="default"
            onClick={prevStep}
            disabled={active === 0 || isPaymentMode}
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

            {isPaymentMode ? (
              // Payment mode: only show "Save Payment"
              <Button
                onClick={handleSubmit}
                color="green"
                size="md"
                fullWidth
                className="sm:w-auto"
              >
                Save Payment
              </Button>
            ) : active < 3 ? (
              // Normal mode, steps 0–2: show "Next Step"
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
              // Normal mode, step 3: show Save/Complete
              <Button
                onClick={handleSubmit}
                color="green"
                size="md"
                fullWidth
                className="sm:w-auto"
              >
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
