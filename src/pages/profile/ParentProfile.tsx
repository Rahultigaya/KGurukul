// src/pages/profile/ParentProfile.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  IconUser,
  IconPhone,
  IconMail,
  IconMapPin,
  IconCurrencyRupee,
  IconCircleCheck,
  IconClockHour4,
  IconAlertCircle,
  IconUsers,
  IconChevronRight,
} from "@tabler/icons-react";
import ProfileHeader from "./components/ProfileHeader";
import PersonalInfo, { SectionCard } from "./components/PersonalInfo";
import {
  getParentById,
  updateParent,
  type ParentData,
} from "../admin/Parent/parentStore";
import { getStudentById } from "../admin/Users/Student/studentStore";
import type { LinkedStudent } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const fmt = (val: string | number) => {
  const n = typeof val === "number" ? val : parseFloat(val);
  return isNaN(n) ? "—" : `₹${n.toLocaleString("en-IN")}`;
};

type PaymentStatus = LinkedStudent["paymentStatus"];

const getStatus = (
  paymentType: string,
  totalFees: string,
  discountAmount: string,
  fullAmount: string,
  installments: { amount: string }[],
): PaymentStatus => {
  if (paymentType === "later") return "Pending";
  const net = (parseFloat(totalFees) || 0) - (parseFloat(discountAmount) || 0);
  const paid = installments.reduce(
    (a, i) => a + (parseFloat(i.amount) || 0),
    parseFloat(fullAmount) || 0,
  );
  if (paid >= net) return "Paid";
  if (paid > 0) return "Partial";
  return "Unpaid";
};

const statusConfig: Record<
  PaymentStatus,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  Paid: {
    icon: <IconCircleCheck size={14} />,
    color: "text-green-400",
    bg: "bg-green-500/10  border-green-500/25",
  },
  Partial: {
    icon: <IconClockHour4 size={14} />,
    color: "text-blue-400",
    bg: "bg-blue-500/10   border-blue-500/25",
  },
  Unpaid: {
    icon: <IconAlertCircle size={14} />,
    color: "text-red-400",
    bg: "bg-red-500/10    border-red-500/25",
  },
  Pending: {
    icon: <IconClockHour4 size={14} />,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/25",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Build LinkedStudent list from parentStore.childrenIds + studentStore
// ─────────────────────────────────────────────────────────────────────────────

function buildLinkedStudents(childrenIds: string[]): LinkedStudent[] {
  return childrenIds.reduce<LinkedStudent[]>((acc, studentId) => {
    const student = getStudentById(studentId);
    if (!student) return acc; // skip if id not found in studentStore

    const net =
      (parseFloat(student.totalFees) || 0) -
      (parseFloat(student.discountAmount) || 0);
    const paid = student.installments.reduce(
      (a, i) => a + (parseFloat(i.amount) || 0),
      parseFloat(student.fullPayment.amount) || 0,
    );
    const due = Math.max(net - paid, 0);
    const status = getStatus(
      student.paymentType,
      student.totalFees,
      student.discountAmount,
      student.fullPayment.amount,
      student.installments,
    );

    acc.push({
      id: studentId,
      name: `${student.firstName} ${student.middleName} ${student.surname}`.trim(),
      standard: student.standard,
      subject: student.subject,
      branch: student.branch,
      courseType: student.courseType,
      paymentStatus: status,
      totalFees: student.totalFees,
      discountAmount: student.discountAmount,
      paidAmount: String(paid),
      dueAmount: String(due),
      paymentType: student.paymentType,
    });

    return acc;
  }, []);
}

// ─────────────────────────────────────────────────────────────────────────────
// ChildCard
// ─────────────────────────────────────────────────────────────────────────────

const ChildCard: React.FC<{
  student: LinkedStudent;
  onView: (id: string) => void;
}> = ({ student, onView }) => {
  const cfg = statusConfig[student.paymentStatus];
  const net =
    (parseFloat(student.totalFees) || 0) -
    (parseFloat(student.discountAmount) || 0);
  const paid = parseFloat(student.paidAmount) || 0;
  const pctPaid = net > 0 ? Math.min((paid / net) * 100, 100) : 0;

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-700/20 p-4 hover:bg-slate-700/30 transition-colors">
      {/* Name row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm truncate">
            {student.name}
          </p>
          <p className="text-slate-400 text-xs mt-0.5">
            Std {student.standard} · {student.subject} · {student.branch}
          </p>
          <p className="text-slate-500 text-xs">{student.courseType}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color}`}
          >
            {cfg.icon}
            {student.paymentStatus}
          </span>
          <button
            onClick={() => onView(student.id)}
            className="p-1.5 rounded-lg bg-slate-600/50 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors"
            title="View student profile"
          >
            <IconChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Fee summary */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          {
            label: "Total",
            value: fmt(student.totalFees),
            color: "text-white",
          },
          {
            label: "Paid",
            value: fmt(student.paidAmount),
            color: "text-green-400",
          },
          {
            label: "Due",
            value: fmt(student.dueAmount),
            color:
              parseFloat(student.dueAmount) > 0
                ? "text-red-400"
                : "text-green-400",
          },
        ].map((f) => (
          <div
            key={f.label}
            className="rounded-lg bg-slate-800/50 p-2 text-center"
          >
            <p className={`text-xs font-bold ${f.color}`}>{f.value}</p>
            <p className="text-slate-500 text-[10px] mt-0.5">{f.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {student.paymentType !== "later" && net > 0 && (
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-slate-500 text-[10px]">Payment progress</span>
            <span className="text-slate-500 text-[10px]">
              {pctPaid.toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-violet-500 transition-all duration-700"
              style={{ width: `${pctPaid}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ParentProfile
// ─────────────────────────────────────────────────────────────────────────────

const ParentProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // parentStore key e.g. "P001"
  const navigate = useNavigate();

  const [parent, setParent] = useState<ParentData | null>(null);
  const [children, setChildren] = useState<LinkedStudent[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      return;
    }

    const data = getParentById(id);
    if (!data) {
      setNotFound(true);
      return;
    }

    setParent(data);
    setChildren(buildLinkedStudents(data.childrenIds));
  }, [id]);

  const handlePhotoSave = (dataUrl: string) => {
    if (!parent || !id) return;
    const updated = { ...parent, photo: dataUrl };
    setParent(updated);
    updateParent(id, updated);
  };

  // ── Guards ────────────────────────────────────────────────────────────────
  if (notFound)
    return (
      <p className="text-slate-400 p-8">
        Parent profile not found. Check the ID in the URL.
      </p>
    );
  if (!parent) return <p className="text-slate-400 p-8">Loading...</p>;

  // ── Summary totals ────────────────────────────────────────────────────────
  const totalFees = children.reduce(
    (a, c) => a + (parseFloat(c.totalFees) || 0),
    0,
  );
  const totalPaid = children.reduce(
    (a, c) => a + (parseFloat(c.paidAmount) || 0),
    0,
  );
  const totalDue = children.reduce(
    (a, c) => a + (parseFloat(c.dueAmount) || 0),
    0,
  );

  return (
    <div className="space-y-6">
      {/* ── Header card ──────────────────────────────────────────────────── */}
      <ProfileHeader
        id={parent.id}
        name={parent.name}
        role="parent"
        subtitle={`${parent.relation} · ${children.length} child${children.length !== 1 ? "ren" : ""} enrolled`}
        photo={parent.photo}
        onPhotoSave={handlePhotoSave}
      >
        {/* Fee summary strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Children",
              value: String(children.length),
              color: "text-violet-400",
              bg: "bg-violet-500/10 border-violet-500/20",
            },
            {
              label: "Total Fees",
              value: fmt(totalFees),
              color: "text-white",
              bg: "bg-slate-700/30  border-slate-600/30",
            },
            {
              label: "Total Paid",
              value: fmt(totalPaid),
              color: "text-green-400",
              bg: "bg-green-500/10  border-green-500/20",
            },
            {
              label: "Balance Due",
              value: fmt(totalDue),
              color: totalDue > 0 ? "text-red-400" : "text-green-400",
              bg:
                totalDue > 0
                  ? "bg-red-500/10 border-red-500/20"
                  : "bg-green-500/10 border-green-500/20",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`rounded-xl border p-3 text-center ${s.bg}`}
            >
              <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
              <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </ProfileHeader>

      {/* ── Two column layout ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — personal details + payment overview */}
        <div className="lg:col-span-1 space-y-4">
          <PersonalInfo
            icon={<IconUser size={16} />}
            title="Personal Details"
            iconColor="text-orange-400"
            fields={[
              { label: "Full Name", value: parent.name },
              { label: "Relation", value: parent.relation },
              { label: "Occupation", value: parent.occupation },
            ]}
          >
            {/* Extra rows with icons */}
            <div className="pt-2.5 space-y-2.5">
              {[
                { icon: <IconPhone size={13} />, label: parent.phone },
                { icon: <IconMail size={13} />, label: parent.email },
                { icon: <IconMapPin size={13} />, label: parent.address },
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-slate-300 text-sm"
                >
                  <span className="text-slate-500 shrink-0">{row.icon}</span>
                  <span className="truncate">{row.label || "—"}</span>
                </div>
              ))}
            </div>
          </PersonalInfo>

          {/* Payment overview by status */}
          <SectionCard
            icon={<IconCurrencyRupee size={16} />}
            title="Payment Overview"
            iconColor="text-green-400"
          >
            {children.length === 0 ? (
              <p className="text-slate-500 text-sm">No children linked.</p>
            ) : (
              (["Paid", "Partial", "Unpaid", "Pending"] as const).map((s) => {
                const count = children.filter(
                  (c) => c.paymentStatus === s,
                ).length;
                if (count === 0) return null;
                const cfg = statusConfig[s];
                return (
                  <div
                    key={s}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg border mb-2 last:mb-0 ${cfg.bg}`}
                  >
                    <span
                      className={`flex items-center gap-1.5 text-xs font-medium ${cfg.color}`}
                    >
                      {cfg.icon} {s}
                    </span>
                    <span className={`text-xs font-bold ${cfg.color}`}>
                      {count} child{count !== 1 ? "ren" : ""}
                    </span>
                  </div>
                );
              })
            )}
          </SectionCard>
        </div>

        {/* Right — children list */}
        <div className="lg:col-span-2">
          <SectionCard
            icon={<IconUsers size={16} />}
            title={`Children (${children.length})`}
            iconColor="text-violet-400"
          >
            {children.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">
                No enrolled children found in the store.
              </p>
            ) : (
              <div className="space-y-3">
                {children.map((child) => (
                  <ChildCard
                    key={child.id}
                    student={child}
                    onView={(studentId) =>
                      navigate(`/profile/student/${studentId}`)
                    }
                  />
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default ParentProfile;
