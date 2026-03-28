// src/pages/admin/Users/Teacher/TeacherColumns.tsx

import { type TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { IconPencil, IconShare } from "@tabler/icons-react";
import { type TeacherData } from "../Teacher/teacherStore";

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
          <img src={row.avatar} alt={row.name} className="w-9 h-9 rounded-full bg-orange-500" />
          <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
            {row.name}
          </span>
        </div>
      ),
    },
    {
      name: "Subject",
      selector: (row) => row.subject,
      sortable: true,
      cell: (row) => (
        <span className="text-sm" style={{ color: "var(--text-primary)" }}>{row.subject}</span>
      ),
    },
    {
      name: "Status",
      cell: () => (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-500">
          Active
        </span>
      ),
    },
    {
      name: "Joined",
      selector: (row) => row.joined,
      sortable: true,
      cell: (row) => (
        <span className="text-sm" style={{ color: "var(--text-primary)" }}>{row.joined}</span>
      ),
    },
    {
      name: "Students",
      selector: (row) => row.students,
      sortable: true,
      cell: (row) => (
        <span className="text-sm" style={{ color: "var(--text-primary)" }}>{row.students}</span>
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
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-tertiary)"  )}
          >
            <IconPencil size={15} style={{ color: "var(--text-secondary)" }} />
          </button>
          <button
            className="p-2 rounded-lg transition-colors"
            title="Share"
            style={{ background: "var(--bg-tertiary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-tertiary)"  )}
          >
            <IconShare size={15} style={{ color: "var(--text-secondary)" }} />
          </button>
        </div>
      ),
    },
  ];
}