// src/pages/profile/StudentProfile.tsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IconUser,
  IconBook,
  IconUsers,
  IconCurrencyRupee,
  IconClockHour4,
  IconBuildingBank,
} from "@tabler/icons-react";
import ProfileHeader from "./components/ProfileHeader";
import PersonalInfo, { SectionCard, InfoRow } from "./components/PersonalInfo";
import {
  getStudentById,
  updateStudent,
} from "../admin/Users/Student/studentStore";
import type { StudentRegistrationData } from "../admin/Users/Student/types";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const fmt = (val: string) => {
  const n = parseFloat(val);
  return isNaN(n) ? "—" : `₹${n.toLocaleString("en-IN")}`;
};

const fmtDate = (date: Date | string | null) => {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getPaymentStatus = (s: StudentRegistrationData) => {
  if (s.paymentType === "later")
    return {
      label: "Pending",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500/25",
    };
  const paid = s.installments.reduce(
    (acc, i) => acc + (parseFloat(i.amount) || 0),
    parseFloat(s.fullPayment.amount) || 0,
  );
  const net =
    (parseFloat(s.totalFees) || 0) - (parseFloat(s.discountAmount) || 0);
  if (paid >= net)
    return {
      label: "Paid",
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500/25",
    };
  if (paid > 0)
    return {
      label: "Partial",
      color: "text-blue-400",
      bg: "bg-blue-500/10  border-blue-500/25",
    };
  return {
    label: "Unpaid",
    color: "text-red-400",
    bg: "bg-red-500/10   border-red-500/25",
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// StudentProfile
// ─────────────────────────────────────────────────────────────────────────────

const StudentProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<StudentRegistrationData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      return;
    }
    const data = getStudentById(id);
    if (!data) {
      setNotFound(true);
      return;
    }
    setStudent(data);
  }, [id]);

  const handlePhotoSave = (dataUrl: string) => {
    if (!student || !id) return;
    const updated = { ...student, photo: dataUrl };
    setStudent(updated);
    updateStudent(id, updated);
  };

  if (notFound) return <p className="text-slate-400 p-8">Student not found.</p>;
  if (!student) return <p className="text-slate-400 p-8">Loading...</p>;

  // Derived
  const fullName =
    `${student.firstName} ${student.middleName} ${student.surname}`.trim();
  const net =
    (parseFloat(student.totalFees) || 0) -
    (parseFloat(student.discountAmount) || 0);
  const paid = student.installments.reduce(
    (acc, i) => acc + (parseFloat(i.amount) || 0),
    parseFloat(student.fullPayment.amount) || 0,
  );
  const due = Math.max(net - paid, 0);
  const paidPct = net > 0 ? Math.min((paid / net) * 100, 100) : 0;
  const status = getPaymentStatus(student);
  const filledInst = student.installments.filter((i) => i.amount);

  return (
    <div className="space-y-6">
      <ProfileHeader
        id={id ?? "0"}
        name={fullName}
        role="student"
        subtitle={`${student.courseType} · ${student.subject} · Std ${student.standard} · ${student.branch}`}
        photo={student.photo}
        onPhotoSave={handlePhotoSave}
      >
        {/* Fee summary strip */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Total Fees",
                value: fmt(student.totalFees),
                color: "text-white",
              },
              {
                label: "Discount",
                value: fmt(student.discountAmount),
                color: "text-green-400",
              },
              {
                label: "Paid",
                value: fmt(String(paid)),
                color: "text-blue-400",
              },
              {
                label: "Balance Due",
                value: fmt(String(due)),
                color: due > 0 ? "text-red-400" : "text-green-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl bg-slate-700/30 border border-slate-700/50 p-3 text-center"
              >
                <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Payment status badge + progress */}
          {student.paymentType !== "later" && net > 0 && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${status.bg} ${status.color}`}
                >
                  {status.label}
                </span>
                <span className="text-slate-400 text-xs">
                  {paidPct.toFixed(0)}% paid
                </span>
              </div>
              <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-violet-500 transition-all duration-700"
                  style={{ width: `${paidPct}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </ProfileHeader>

      {/* Detail grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Info */}
        <PersonalInfo
          icon={<IconUser size={16} />}
          title="Personal Information"
          iconColor="text-orange-400"
          fields={[
            { label: "Full Name", value: fullName },
            {
              label: "Gender",
              value:
                student.gender.charAt(0).toUpperCase() +
                student.gender.slice(1),
            },
            { label: "Email", value: student.email },
            { label: "Contact", value: student.contactNo },
            { label: "Address", value: student.address },
          ]}
        />

        {/* Academic Info */}
        <PersonalInfo
          icon={<IconBook size={16} />}
          title="Academic Details"
          iconColor="text-violet-400"
          fields={[
            { label: "Subject", value: student.subject },
            { label: "Course Type", value: student.courseType },
            { label: "Standard", value: `Std ${student.standard}` },
            { label: "Branch", value: student.branch },
            { label: "School / College", value: student.schoolCollegeName },
            ...(student.reference
              ? [{ label: "Reference", value: student.reference }]
              : []),
            { label: "Registered", value: fmtDate(student.registrationDate) },
          ]}
        />

        {/* Guardian Info */}
        <SectionCard
          icon={<IconUsers size={16} />}
          title="Guardian Details"
          iconColor="text-blue-400"
        >
          {student.guardians.length === 0 ? (
            <p className="text-slate-500 text-sm">
              No guardian information added.
            </p>
          ) : (
            student.guardians.map((g, i) => (
              <div
                key={g.id}
                className={
                  i > 0 ? "mt-4 pt-4 border-t border-slate-700/40" : ""
                }
              >
                {student.guardians.length > 1 && (
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
                    Guardian {i + 1}
                  </p>
                )}
                <InfoRow label="Name" value={g.name} />
                <InfoRow label="Relation" value={g.relation} />
                <InfoRow label="Contact" value={g.contact} />
                <InfoRow label="Email" value={g.email} />
              </div>
            ))
          )}
        </SectionCard>

        {/* Payment Info */}
        <SectionCard
          icon={<IconCurrencyRupee size={16} />}
          title="Payment Details"
          iconColor="text-green-400"
        >
          <InfoRow
            label="Payment Type"
            value={
              student.paymentType === "full"
                ? "Full Payment"
                : student.paymentType === "installment"
                  ? "Installment"
                  : "Pay Later"
            }
          />
          <InfoRow label="Total Fees" value={fmt(student.totalFees)} />
          <InfoRow label="Discount" value={fmt(student.discountAmount)} />
          <InfoRow
            label="Net Payable"
            value={fmt(String(net))}
            valueClass="text-white font-bold"
          />

          {/* Full payment receipt */}
          {student.paymentType === "full" && student.fullPayment.amount && (
            <div className="mt-3 pt-3 border-t border-slate-700/40">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
                Receipt
              </p>
              <InfoRow
                label="Amount Paid"
                value={fmt(student.fullPayment.amount)}
                valueClass="text-green-400"
              />
              <InfoRow label="Date" value={fmtDate(student.fullPayment.date)} />
              <InfoRow label="Mode" value={student.fullPayment.mode} />
              {student.fullPayment.bankName && (
                <InfoRow label="Bank" value={student.fullPayment.bankName} />
              )}
              <InfoRow label="Paid To" value={student.fullPayment.paidTo} />
            </div>
          )}

          {/* Installments */}
          {student.paymentType === "installment" && filledInst.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-700/40 space-y-3">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Installments
              </p>
              {filledInst.map((inst, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-slate-700/30 border border-slate-700/50 p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-semibold">
                      Installment {idx + 1}
                    </span>
                    <span className="text-sm font-bold text-green-400">
                      {fmt(inst.amount)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <div>
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="text-xs text-slate-300">
                        {fmtDate(inst.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Mode</p>
                      <p className="text-xs text-slate-300">
                        {inst.mode || "—"}
                      </p>
                    </div>
                    {inst.bankName && (
                      <div>
                        <p className="text-xs text-slate-500">Bank</p>
                        <p className="text-xs text-slate-300">
                          {inst.bankName}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-slate-500">Paid To</p>
                      <p className="text-xs text-slate-300">
                        {inst.paidTo || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {student.installments.filter((i) => !i.amount).length > 0 && (
                <div className="rounded-xl bg-slate-700/20 border border-dashed border-slate-600/50 p-3 flex items-center gap-2">
                  <IconClockHour4
                    size={14}
                    className="text-slate-500 shrink-0"
                  />
                  <p className="text-xs text-slate-500">
                    {student.installments.filter((i) => !i.amount).length}{" "}
                    installment(s) pending
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Pay later notice */}
          {student.paymentType === "later" && (
            <div className="mt-3 pt-3 border-t border-slate-700/40">
              <div className="flex items-center gap-2 text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                <IconBuildingBank size={16} className="shrink-0" />
                <p className="text-xs font-medium">
                  Payment will be collected later as per agreement.
                </p>
              </div>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default StudentProfile;
