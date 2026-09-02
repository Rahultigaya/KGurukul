// src/pages/admin/Users/Teacher/TeacherColumns.tsx

import { type TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { IconPencil } from "@tabler/icons-react";
import { type TeacherData } from "./teacherStore";

type FormattedTeacher = TeacherData & { name: string; avatar: string; joined: string };

export function useTeacherColumns(): TableColumn<FormattedTeacher>[] {
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
        </div>
      ),
    },
  ];
}