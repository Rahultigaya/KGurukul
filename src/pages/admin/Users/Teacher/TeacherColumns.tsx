// src/pages/admin/Users/Teacher/TeacherColumns.tsx

import { type TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { IconPencil, IconShare } from "@tabler/icons-react";
import { type TeacherData } from "./teacherStore";

export function useTeacherColumns(): TableColumn<TeacherData>[] {
  const navigate = useNavigate();

  return [
    {
      name: "Teacher",
      sortable: true,
      selector: (row) => row.name,
      minWidth: "220px",
      cell: (row) => (
        <div className="flex items-center gap-3 py-1">
          {row.photo ? (
            <img
              src={row.photo}
              alt={row.name}
              className="w-9 h-9 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <img
              src={row.avatar}
              alt={row.name}
              className="w-9 h-9 rounded-full flex-shrink-0"
              style={{ background: "var(--bg-tertiary)" }}
            />
          )}
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>
              {row.name}
            </p>
            <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      name: "Status",
      width: "110px",
      cell: (row) => (
        <span
          className="px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{
            background: row.status === "Active" ? "rgba(34,197,94,0.12)" : "rgba(100,116,139,0.15)",
            color:      row.status === "Active" ? "#22c55e"               : "var(--text-muted)",
          }}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Joined",
      selector: (row) => row.joined,
      sortable: true,
      cell: (row) => (
        <span className="text-sm" style={{ color: "var(--text-primary)" }}>
          {row.joined}
        </span>
      ),
    },
    {
      name: "Actions",
      width: "100px",
      cell: (row) => (
        <div className="flex gap-1">
          <button
            onClick={() => navigate(`/Users/edit-teacher/${row.id}`)}
            className="p-2 rounded-lg transition-colors"
            title="Edit teacher"
            style={{ background: "var(--bg-tertiary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-tertiary)")}
          >
            <IconPencil size={15} style={{ color: "var(--text-secondary)" }} />
          </button>
          <button
            className="p-2 rounded-lg transition-colors"
            title="Share"
            style={{ background: "var(--bg-tertiary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-tertiary)")}
          >
            <IconShare size={15} style={{ color: "var(--text-secondary)" }} />
          </button>
        </div>
      ),
    },
  ];
}