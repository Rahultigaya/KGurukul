// src/pages/admin/Users/columns/StudentColumns.tsx

import { type TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { IconPencil, IconPhone, IconCurrencyRupee } from "@tabler/icons-react";
import type { StudentRegistrationData } from "../Student/types";

// id is the store key (string "1","2"...) attached in UserList before passing to DataTable
export type Student = StudentRegistrationData & { id: string };

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const avatarColors = [
  "bg-orange-500",
  "bg-purple-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-yellow-500",
  "bg-red-500",
];

const getInitials = (first: string, last: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

// Use numeric id for color so "1" → index 1, "2" → index 2 etc.
const getAvatarColor = (id: string) =>
  avatarColors[Number(id) % avatarColors.length];

const formatCurrency = (val: string) => {
  const n = parseFloat(val);
  return isNaN(n) ? "—" : `₹${n.toLocaleString("en-IN")}`;
};

const computeNetFees = (s: Student) =>
  (parseFloat(s.totalFees) || 0) - (parseFloat(s.discountAmount) || 0);

const computePaidAmount = (s: Student) =>
  s.installments.reduce(
    (acc, i) => acc + (parseFloat(i.amount) || 0),
    parseFloat(s.fullPayment.amount) || 0,
  );

const computePaymentStatus = (s: Student) => {
  if (s.paymentType === "later")
    return { label: "Pending", color: "text-yellow-400 bg-yellow-500/10" };
  const paid = computePaidAmount(s);
  const net = computeNetFees(s);
  if (paid >= net)
    return { label: "Paid", color: "text-green-400 bg-green-500/10" };
  if (paid > 0)
    return { label: "Partial", color: "text-blue-400 bg-blue-500/10" };
  return { label: "Unpaid", color: "text-red-400 bg-red-500/10" };
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
        const fullName =
          `${row.firstName} ${row.middleName} ${row.surname}`.trim();
        return (
          <div className="flex items-center gap-3 py-1">
            {row.photo ? (
              <img
                src={row.photo}
                alt={fullName}
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
            ) : (
              // Avatar with initials — now gets correct color because id is defined
              <div
                className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-xs ${getAvatarColor(row.id)}`}
              >
                {getInitials(row.firstName, row.surname)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-white font-medium text-sm">{fullName}</p>
              <p className="text-slate-400 text-xs">{row.email}</p>
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
          <p className="text-slate-200 text-sm">{row.courseType}</p>
          <p className="text-slate-400 text-xs">{row.subject}</p>
        </div>
      ),
    },
    {
      name: "Std",
      sortable: true,
      selector: (row) => row.standard,
      width: "100px",
      cell: (row) => (
        <span className="text-slate-200 text-sm font-medium">
          Std {row.standard}
        </span>
      ),
    },
    {
      name: "Contact",
      width: "200px",
      cell: (row) => (
        <div>
          <p className="text-slate-200 text-sm flex items-center gap-1">
            <IconPhone size={12} className="text-slate-400" /> {row.contactNo}
          </p>
          <p className="text-slate-400 text-xs mt-0.5">{row.branch}</p>
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
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.color}`}
          >
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
            <p className="text-white text-sm font-semibold">
              {formatCurrency(String(net))}
            </p>
            {parseFloat(row.discountAmount) > 0 && (
              <p className="text-green-400 text-xs">
                -{formatCurrency(row.discountAmount)} off
              </p>
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
            className="p-2 bg-slate-700/40 hover:bg-slate-600/60 rounded-lg transition-colors"
            title="Edit student"
          >
            <IconPencil
              size={15}
              className="text-slate-300 hover:text-orange-400"
            />
          </button>
          <button
            onClick={() => navigate(`/Users/edit-student/${row.id}?tab=fees`)}
            className="p-2 bg-slate-700/40 hover:bg-slate-600/60 rounded-lg transition-colors"
            title="Update payment"
          >
            <IconCurrencyRupee
              size={15}
              className="text-slate-300 hover:text-green-400"
            />
          </button>
        </div>
      ),
    },
  ];
}
