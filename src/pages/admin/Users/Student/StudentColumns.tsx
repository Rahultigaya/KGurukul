// src/pages/admin/Users/Student/StudentColumns.tsx

import { type TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { IconPencil, IconCurrencyRupee, IconEye } from "@tabler/icons-react";
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
const formatCurrency = (val: string | number) => { const n = typeof val === "number" ? val : parseFloat(val); return isNaN(n) ? "—" : `₹${n.toLocaleString("en-IN")}`; };

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
        const fullName = `${row.firstName} ${row.middleName || ""} ${row.surname || ""}`.trim();
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
              <p className="font-semibold text-sm text-slate-800 truncate">{fullName}</p>
              <p className="text-xs text-slate-500 truncate">{row.email}</p>
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
          <p className="text-sm text-slate-800 font-medium">{row.courseType}</p>
          <p className="text-xs text-slate-500">{row.subject}</p>
        </div>
      ),
    },
    {
      name: "Std",
      sortable: true,
      selector: (row) => row.standard,
      width: "100px",
      cell: (row) => (
        <span className="text-sm font-medium text-slate-700">
          Std {row.standard}
        </span>
      ),
    },
    {
      name: "Contact",
      selector: (row) => row.contactNo || (row as any).mobileNo || "",
      cell: (row) => (
        <span className="text-sm text-slate-700 font-medium">
          {row.contactNo || (row as any).mobileNo || "—"}
        </span>
      ),
    },
    {
      name: "Standard & Stream",
      selector: (row) => row.standard,
      sortable: true,
      cell: (row) => (
        <span className="text-sm text-slate-700 font-medium">
          Std {row.standard} {(row as any).stream ? `(${(row as any).stream})` : ""}
        </span>
      ),
    },
    {
      name: "Course / Batch",
      selector: (row) => row.courseType,
      cell: (row) => (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          {row.courseType}
        </span>
      ),
    },
    {
      name: "Fees Info",
      selector: (row) => (row as any).finalNetPayable || row.totalFees || "0",
      sortable: true,
      cell: (row) => {
        const net = parseFloat((row as any).finalNetPayable || (row as any).totalFeesCalculated || row.totalFees || "0");
        return (
          <div className="py-1">
            <p className="font-bold text-sm text-slate-800">
              {formatCurrency(net)}
            </p>
            {parseFloat(row.discountAmount) > 0 && (
              <p className="text-emerald-600 text-xs">-{formatCurrency(row.discountAmount)} off</p>
            )}
          </div>
        );
      },
    },
    {
      name: "Actions",
      width: "140px",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <IconButton
            size="small"
            onClick={() => navigate(`/Users/edit-student/${row.id}?mode=view`)}
            className="!p-1.5 !rounded-lg !bg-blue-50 hover:!bg-blue-100 !text-blue-600 !border !border-blue-200/60 shadow-sm transition-all hover:scale-105"
            title="View student"
          >
            <IconEye size={15} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => navigate(`/Users/edit-student/${row.id}`)}
            className="!p-1.5 !rounded-lg !bg-amber-50 hover:!bg-amber-100 !text-amber-600 !border !border-amber-200/60 shadow-sm transition-all hover:scale-105"
            title="Edit student"
          >
            <IconPencil size={15} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => navigate(`/Users/edit-student/${row.id}?tab=fees`)}
            className="!p-1.5 !rounded-lg !bg-emerald-50 hover:!bg-emerald-100 !text-emerald-600 !border !border-emerald-200/60 shadow-sm transition-all hover:scale-105"
            title="Update payment"
          >
            <IconCurrencyRupee size={15} />
          </IconButton>
        </div>
      ),
    },
  ];
}
