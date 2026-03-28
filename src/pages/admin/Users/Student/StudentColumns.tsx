// src/pages/admin/Users/Student/StudentColumns.tsx

import { type TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { IconPencil, IconPhone, IconCurrencyRupee } from "@tabler/icons-react";
import type { StudentRegistrationData } from "../Student/types";

export type Student = StudentRegistrationData & { id: string };

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const avatarColors = [
  "bg-orange-500", "bg-purple-500", "bg-blue-500",   "bg-green-500",
  "bg-pink-500",   "bg-teal-500",   "bg-yellow-500", "bg-red-500",
];

const getInitials    = (first: string, last: string) => `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
const getAvatarColor = (id: string) => avatarColors[Number(id) % avatarColors.length];
const formatCurrency = (val: string) => { const n = parseFloat(val); return isNaN(n) ? "—" : `₹${n.toLocaleString("en-IN")}`; };
const computeNetFees = (s: Student) => (parseFloat(s.totalFees) || 0) - (parseFloat(s.discountAmount) || 0);
const computePaidAmount = (s: Student) =>
  s.installments.reduce((acc, i) => acc + (parseFloat(i.amount) || 0), parseFloat(s.fullPayment.amount) || 0);

const computePaymentStatus = (s: Student) => {
  if (s.paymentType === "later") return { label: "Pending", color: "text-yellow-500 bg-yellow-500/10" };
  const paid = computePaidAmount(s);
  const net  = computeNetFees(s);
  if (paid >= net) return { label: "Paid",    color: "text-green-500 bg-green-500/10" };
  if (paid > 0)    return { label: "Partial", color: "text-blue-500 bg-blue-500/10"  };
  return               { label: "Unpaid",  color: "text-red-500 bg-red-500/10"    };
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useStudentColumns(): TableColumn<Student>[] {
  const navigate = useNavigate();

  return [
    {
      name: "Student",
      sortable: true,
      selector: (row) => row.firstName,
      width: "280px",
      cell: (row) => {
        const fullName = `${row.firstName} ${row.middleName} ${row.surname}`.trim();
        return (
          <div className="flex items-center gap-3 py-1">
            {row.photo ? (
              <img src={row.photo} alt={fullName} className="w-9 h-9 rounded-full object-cover shrink-0" />
            ) : (
              <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-xs ${getAvatarColor(row.id)}`}>
                {getInitials(row.firstName, row.surname)}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{fullName}</p>
              <p className="text-xs"             style={{ color: "var(--text-muted)"  }}>{row.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      name: "Course / Subject",
      sortable: true,
      selector: (row) => row.courseType,
      width: "180px",
      cell: (row) => (
        <div>
          <p className="text-sm" style={{ color: "var(--text-primary)"   }}>{row.courseType}</p>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{row.subject}</p>
        </div>
      ),
    },
    {
      name: "Std",
      sortable: true,
      selector: (row) => row.standard,
      width: "100px",
      cell: (row) => (
        <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          Std {row.standard}
        </span>
      ),
    },
    {
      name: "Contact",
      width: "200px",
      cell: (row) => (
        <div>
          <p className="text-sm flex items-center gap-1" style={{ color: "var(--text-primary)" }}>
            <IconPhone size={12} style={{ color: "var(--text-muted)" }} /> {row.contactNo}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{row.branch}</p>
        </div>
      ),
    },
    {
      name: "Payment",
      sortable: true,
      selector: (row) => computePaymentStatus(row).label,
      cell: (row) => {
        const s = computePaymentStatus(row);
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.color}`}>
            {s.label}
          </span>
        );
      },
    },
    {
      name: "Fees (Net)",
      sortable: true,
      selector: (row) => computeNetFees(row),
      cell: (row) => {
        const net = computeNetFees(row);
        return (
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {formatCurrency(String(net))}
            </p>
            {parseFloat(row.discountAmount) > 0 && (
              <p className="text-green-500 text-xs">-{formatCurrency(row.discountAmount)} off</p>
            )}
          </div>
        );
      },
    },
    {
      name: "Actions",
      width: "100px",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/Users/edit-student/${row.id}`)}
            className="p-2 rounded-lg transition-colors"
            title="Edit student"
            style={{ background: "var(--bg-tertiary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-tertiary)"  )}
          >
            <IconPencil size={15} style={{ color: "var(--text-secondary)" }} />
          </button>
          <button
            onClick={() => navigate(`/Users/edit-student/${row.id}?tab=fees`)}
            className="p-2 rounded-lg transition-colors"
            title="Update payment"
            style={{ background: "var(--bg-tertiary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-tertiary)"  )}
          >
            <IconCurrencyRupee size={15} style={{ color: "var(--text-secondary)" }} />
          </button>
        </div>
      ),
    },
  ];
}