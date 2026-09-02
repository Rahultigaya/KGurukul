// src/pages/admin/Users/Student/StudentRegistration.tsx

import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Typography,
  IconButton,
  Alert,
  Chip,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  IconArrowLeft,
  IconCurrencyRupee,
  IconAlertCircle,
  IconDeviceFloppy,
  IconArrowRight,
  IconCreditCard,
  IconX,
  IconClipboardList,
  IconUser,
  IconUsers,
  IconCheck,
  IconUserOff,
  IconUserCheck,
} from "@tabler/icons-react";

const stepItems = [
  { label: "Enrollment", description: "Course details", icon: IconClipboardList },
  { label: "Student", description: "Personal details", icon: IconUser },
  { label: "Guardian", description: "Parent details", icon: IconUsers },
  { label: "Fees", description: "Payment details", icon: IconCurrencyRupee },
];
import Swal from "sweetalert2";

import type { GuardianDetails, Installment, StudentRegistrationData, ValidationErrors } from "./types";
import { validateField, validateStep, applyFieldError } from "./validation";
import { getStudentById } from "./studentStore";
import { createStudent, updateStudent as updateStudentApi } from "../../../../api/api";
import EnrollmentContent from "./components/EnrollmentContent";
import StudentDetailsContent from "./components/StudentDetailsContent";
import GuardianContent from "./components/GuardianContent";
import FeesContent from "./components/FeesContent";

const initialFormData: StudentRegistrationData = {
  photo: null,
  academicYear: "",
  registrationDate: new Date().toISOString().split("T")[0],
  subject: "",
  branch: "",
  courseType: "Regular",
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

const StudentRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const isEditMode = Boolean(id);
  const isPaymentMode = searchParams.get("tab") === "fees";

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

  const [active, setActive] = useState(isPaymentMode ? 3 : 0);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState<StudentRegistrationData>(initialFormData);
  const [isLoading, setIsLoading] = useState(isEditMode);

  // Prefill on edit
  useEffect(() => {
    if (!isEditMode || !id) return;
    (async () => {
      try {
        const data = await getStudentById(id);
        if (data) {
          setFormData(data);
        } else {
          Swal.fire({
            title: "Student not found",
            text: "The student you're trying to edit doesn't exist.",
            icon: "error",
            confirmButtonColor: "#2563eb",
          }).then(() => navigate("/Users"));
        }
      } catch {
        Swal.fire({
          title: "Error",
          text: "Failed to load student data.",
          icon: "error",
          confirmButtonColor: "#2563eb",
        }).then(() => navigate("/Users"));
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id, isEditMode, navigate]);

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
          const total = parseFloat(field === "totalFees" ? value : prev.totalFees) || 0;
          const discount =
            parseFloat(field === "discountAmount" ? value : prev.discountAmount) || 0;
          if (discount > total) {
            next = {
              ...next,
              discountAmount: "Discount amount cannot be greater than total fees.",
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
          g.id === id ? { ...g, [field]: value } : g
        );
        if (guardianIndex === 0) {
          setErrors((prevErr) => applyFieldError(prevErr, `guardian_0_${field}`, value));
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
    []
  );

  const addGuardian = useCallback(() => {
    setFormData((prev) => {
      if (prev.guardians.length >= 2) return prev;
      return {
        ...prev,
        guardians: [
          ...prev.guardians,
          { id: Date.now().toString(), name: "", email: "", contact: "", relation: "" },
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
      if (field !== "bankName") setErrors((prev) => applyFieldError(prev, `full_${field}`, value));
    },
    []
  );

  const handleInstallmentChange = useCallback(
    (index: number, field: keyof Installment, value: string | Date | null) => {
      setFormData((prev) => ({
        ...prev,
        installments: prev.installments.map((inst, i) =>
          i === index ? { ...inst, [field]: value } : inst
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
              })()
        );
        return prev;
      });
    },
    []
  );

  const calculateDiscountPercentage = useCallback(() => {
    const total = parseFloat(formData.totalFees) || 0;
    const discount = parseFloat(formData.discountAmount) || 0;
    if (total === 0) return 0;
    const pct = (discount / total) * 100;
    return parseFloat(pct.toFixed(2));
  }, [formData.totalFees, formData.discountAmount]);

  const calculateFinalAmount = useCallback(() => {
    const total = parseFloat(formData.totalFees) || 0;
    const discount = parseFloat(formData.discountAmount) || 0;
    return (total - discount).toFixed(2);
  }, [formData.totalFees, formData.discountAmount]);

  const calculateInstallmentTotal = useCallback(
    () =>
      formData.installments
        .reduce((sum, inst) => sum + (parseFloat(inst.amount) || 0), 0)
        .toFixed(2),
    [formData.installments]
  );

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

  const handleSubmit = useCallback(async () => {
    const stepErrors = validateStep(3, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    const formatDate = (d: Date | string | null) => {
      if (!d) return null;
      if (typeof d === "string") return d;
      return d.toISOString().split("T")[0];
    };

    const payload = {
      photo: formData.photo,
      academic_year: formData.academicYear,
      registration_date: formatDate(formData.registrationDate),
      subject_id: Number(formData.subject) || 0,
      branch_id: Number(formData.branch) || 0,
      standard_id: Number(formData.standard) || 0,
      course_type: formData.courseType,
      reference: formData.reference,
      surname: formData.surname,
      first_name: formData.firstName,
      middle_name: formData.middleName,
      gender: formData.gender,
      email: formData.email,
      contact_no: formData.contactNo,
      address: formData.address,
      school_college_name: formData.schoolCollegeName,
      payment_type: formData.paymentType,
      total_fees: formData.totalFees,
      discount_amount: formData.discountAmount,
      guardians: formData.guardians.map((g) => ({
        name: g.name,
        email: g.email,
        contact: g.contact,
        relation: g.relation,
      })),
      full_payment:
        formData.paymentType === "full" && formData.fullPayment?.amount
          ? {
              amount: formData.fullPayment.amount,
              date: formatDate(formData.fullPayment.date),
              mode: formData.fullPayment.mode,
              bank_name: formData.fullPayment.bankName,
              paid_to: formData.fullPayment.paidTo,
            }
          : null,
      installments: formData.installments
        .filter((i) => i.amount && Number(i.amount) > 0)
        .map((i) => ({
          amount: i.amount,
          date: formatDate(i.date),
          mode: i.mode,
          bank_name: i.bankName,
          paid_to: i.paidTo,
        })),
    };

    try {
      if (isEditMode && id) {
        await updateStudentApi(Number(id), payload);
      } else {
        await createStudent(payload);
      }

      const title = isPaymentMode
        ? "Payment Updated!"
        : isEditMode
        ? "Student Updated!"
        : "Registration Successful! ";

      Swal.fire({
        title,
        text: `Student ${formData.firstName} ${formData.surname} record saved successfully.`,
        icon: "success",
        confirmButtonText: "Go to Users",
        confirmButtonColor: "#2563eb",
      }).then(() => navigate("/Users"));
    } catch (err: any) {
      console.error("Student registration error:", err?.response?.data || err.message || err);
      const msg =
        err?.response?.data?.detail || err.message || "Something went wrong. Please try again.";
      Swal.fire({
        title: "Error ❌",
        text: msg,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#2563eb",
      });
    }
  }, [formData, navigate, isEditMode, isPaymentMode, id]);

  const handleToggleStatus = useCallback(async () => {
    const isCurrentlyActive = formData.isActive ?? true;
    const newIsActive = !isCurrentlyActive;
    const actionText = isCurrentlyActive ? "deactivate" : "activate";
    const fullName = `${formData.firstName} ${formData.surname}`.trim();

    const result = await Swal.fire({
      title: `${isCurrentlyActive ? "Deactivate" : "Activate"} Student?`,
      text: `Are you sure you want to ${actionText} ${fullName || "this student"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isCurrentlyActive ? "#ef4444" : "#10b981",
      cancelButtonColor: "#64748b",
      confirmButtonText: `Yes, ${actionText}!`,
    });

    if (result.isConfirmed) {
      setFormData((prev) => ({ ...prev, isActive: newIsActive }));
      if (isEditMode && id) {
        try {
          await updateStudentApi(Number(id), { ...formData, is_active: newIsActive } as any);
        } catch (err: any) {
          console.error("Error toggling student status:", err);
        }
        Swal.fire({
          title: "Status Updated!",
          text: `Student has been ${newIsActive ? "activated" : "deactivated"}.`,
          icon: "success",
          confirmButtonColor: "#2563eb",
        });
      }
    }
  }, [formData, isEditMode, id]);

  const handleNavigateBack = useCallback(() => navigate("/Users"), [navigate]);
  const errorCount = Object.keys(errors).length;
  const stepProps = { formData, handleInputChange, errors };

  if (isLoading) {
    return (
      <Box className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <CircularProgress color="primary" />
        <Typography className="text-slate-600 font-medium">Loading student data…</Typography>
      </Box>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconButton onClick={handleNavigateBack} color="primary">
            <IconArrowLeft size={30} />
          </IconButton>
          <div>
            <div className="flex items-center gap-2">
              <Typography variant="h5" className="!font-bold text-slate-800">
                {pageTitle}
              </Typography>
              {isEditMode && (
                <Chip
                  label={isPaymentMode ? "Payment Mode" : "Edit Mode"}
                  color={isPaymentMode ? "success" : "primary"}
                  size="small"
                />
              )}
            </div>
            <Typography variant="body2" className="text-slate-500">
              {pageSubtitle}
            </Typography>
          </div>
        </div>

        {isEditMode && (
          <button
            type="button"
            onClick={handleToggleStatus}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
              (formData.isActive ?? true)
                ? "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"
                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200"
            }`}
          >
            {(formData.isActive ?? true) ? (
              <>
                <IconUserOff size={16} />
                <span>Deactivate Student</span>
              </>
            ) : (
              <>
                <IconUserCheck size={16} />
                <span>Activate Student</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Error alert */}
      {errorCount > 0 && (
        <Alert severity="error" icon={<IconAlertCircle size={20} />} className="rounded-xl">
          {errorCount === 1
            ? "1 required field is missing or invalid."
            : `${errorCount} required fields are missing or invalid.`}
        </Alert>
      )}

      {/* Responsive Stepper — High Contrast against Light Blue Background */}
      <div className="py-2">
        {/* ── Mobile Layout (< 640px) ─────────────────────────────────── */}
        <div className="sm:hidden space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                {active + 1}
              </span>
              <span className="text-sm font-bold text-blue-700">
                {stepItems[active].label}
              </span>
              <span className="text-xs text-slate-600 font-medium">
                ({stepItems[active].description})
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-700">
              Step {active + 1} of {stepItems.length}
            </span>
          </div>

          {/* 4 Icon circles connected evenly across mobile screen */}
          <div className="flex items-center justify-between px-1">
            {stepItems.map((step, idx) => {
              const Icon = step.icon;
              const isActive = active === idx;
              const isCompleted = active > idx;

              return (
                <React.Fragment key={step.label}>
                  <div
                    onClick={() => !isPaymentMode && setActive(idx)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isPaymentMode ? "cursor-not-allowed" : "cursor-pointer"
                    } ${
                      isCompleted
                        ? "bg-blue-600 text-white shadow-md"
                        : isActive
                        ? "border-2 border-blue-600 bg-white text-blue-600 shadow-md ring-2 ring-blue-100"
                        : "border-2 border-slate-300 bg-white text-slate-700 shadow-sm"
                    }`}
                  >
                    {isCompleted ? <IconCheck size={16} /> : <Icon size={16} />}
                  </div>

                  {idx < stepItems.length - 1 && (
                    <div
                      className={`flex-1 h-[2px] mx-1.5 transition-colors ${
                        active > idx ? "bg-blue-600" : "bg-slate-400"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ── Tablet & Desktop Layout (>= 640px) ─────────────────────── */}
        <div className="hidden sm:flex items-center justify-between gap-2">
          {stepItems.map((step, idx) => {
            const Icon = step.icon;
            const isActive = active === idx;
            const isCompleted = active > idx;

            return (
              <React.Fragment key={step.label}>
                <div
                  onClick={() => !isPaymentMode && setActive(idx)}
                  className={`flex items-center gap-2.5 shrink-0 py-1.5 px-2.5 rounded-xl transition-all ${
                    isPaymentMode ? "cursor-not-allowed" : "cursor-pointer hover:bg-white/60"
                  }`}
                >
                  {/* Circular Icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isCompleted
                        ? "bg-blue-600 text-white shadow-md"
                        : isActive
                        ? "border-2 border-blue-600 bg-white text-blue-600 shadow-md ring-4 ring-blue-100"
                        : "border-2 border-slate-300 bg-white text-slate-700 shadow-sm"
                    }`}
                  >
                    {isCompleted ? <IconCheck size={18} /> : <Icon size={18} />}
                  </div>

                  {/* Title & Subtitle */}
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-bold leading-tight ${
                        isActive || isCompleted ? "text-blue-700" : "text-slate-800"
                      }`}
                    >
                      {step.label}
                    </span>
                    <span
                      className={`text-xs font-medium mt-0.5 hidden lg:block ${
                        isActive || isCompleted ? "text-blue-600/90" : "text-slate-600"
                      }`}
                    >
                      {step.description}
                    </span>
                  </div>
                </div>

                {/* Connecting Line between steps */}
                {idx < stepItems.length - 1 && (
                  <div
                    className={`flex-1 min-w-[20px] lg:min-w-[40px] h-[2px] mx-1.5 transition-colors ${
                      active > idx ? "bg-blue-600" : "bg-slate-400"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="mt-4">
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

      {/* Navigation Action Bar — Premium Custom Button UI */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-center pt-4 border-t border-slate-200 mt-6">
        <button
          onClick={prevStep}
          disabled={active === 0 || isPaymentMode}
          className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all duration-200 hover:scale-[1.02] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:border-slate-300 w-full sm:w-auto"
        >
          <IconArrowLeft size={18} />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handleNavigateBack}
            className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all duration-200 hover:scale-[1.02] cursor-pointer w-full sm:w-auto"
          >
            <IconX size={18} />
            <span>Cancel</span>
          </button>

          {isPaymentMode ? (
            <button
              onClick={handleSubmit}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer w-full sm:w-auto"
            >
              <IconCreditCard size={18} />
              <span>Save Payment</span>
            </button>
          ) : active < 3 ? (
            <button
              onClick={nextStep}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer w-full sm:w-auto"
            >
              <span>Next Step</span>
              <IconArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer w-full sm:w-auto"
            >
              <IconDeviceFloppy size={18} />
              <span>{isEditMode ? "Save Changes" : "Complete Registration"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;
