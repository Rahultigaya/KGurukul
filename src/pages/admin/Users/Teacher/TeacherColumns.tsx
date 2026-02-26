// src/pages/admin/Users/columns/TeacherColumns.tsx

import { type TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { IconPencil, IconShare } from "@tabler/icons-react";
import { type TeacherData } from "../Teacher/teacherStore";

// ─────────────────────────────────────────────────────────────────────────────
// Hook — returns teacher columns
// ─────────────────────────────────────────────────────────────────────────────

export function useTeacherColumns(): TableColumn<TeacherData>[] {
  const navigate = useNavigate();

  return [
    {
      name: "Teacher",
      sortable: true,
      selector: (row) => row.name,
      width: "220px",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar}
            alt={row.name}
            className="w-9 h-9 rounded-full bg-orange-500"
          />
          <span className="text-white font-medium text-sm">{row.name}</span>
        </div>
      ),
    },
    {
      name: "Subject",
      selector: (row) => row.subject,
      sortable: true,
      cell: (row) => (
        <span className="text-slate-200 text-sm">{row.subject}</span>
      ),
    },
    {
      name: "Status",
      cell: () => (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400">
          Active
        </span>
      ),
    },
    {
      name: "Joined",
      selector: (row) => row.joined,
      sortable: true,
      cell: (row) => (
        <span className="text-slate-200 text-sm">{row.joined}</span>
      ),
    },
    {
      name: "Students",
      selector: (row) => row.students,
      sortable: true,
      cell: (row) => (
        <span className="text-slate-200 text-sm">{row.students}</span>
      ),
    },
    {
      name: "Actions",
      width: "100px",
      cell: (row) => (
        <div className="flex gap-1">
          <button
            onClick={() => navigate(`/Users/edit-teacher/${row.id}`)}
            className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors"
            title="Edit teacher"
          >
            <IconPencil
              size={15}
              className="text-slate-300 hover:text-orange-400"
            />
          </button>
          <button
            className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors"
            title="Share"
          >
            <IconShare
              size={15}
              className="text-slate-300 hover:text-orange-400"
            />
          </button>
        </div>
      ),
    },
  ];
}
