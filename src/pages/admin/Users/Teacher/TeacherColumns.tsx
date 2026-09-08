// src/pages/admin/Users/Teacher/TeacherColumns.tsx

import { type TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { IconPencil, IconEye } from "@tabler/icons-react";
import { IconButton } from "@mui/material";
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
            <img src={row.photo} alt={row.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
          ) : (
            <img src={row.avatar} alt={row.name} className="w-9 h-9 rounded-full bg-slate-100 shrink-0" />
          )}
          <div className="min-w-0">
            <p className="font-semibold text-sm text-primary">{row.name}</p>
            <p className="text-xs text-secondary">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      name: "Joined",
      selector: (row) => row.joined,
      sortable: true,
      cell: (row) => (
        <span className="text-sm text-primary">
          {row.joined}
        </span>
      ),
    },
    {
      name: "Actions",
      width: "120px",
      cell: (row) => (
        <div className="flex gap-1">
          <IconButton
            size="small"
            onClick={() => navigate(`/Users/edit-teacher/${row.id}?mode=view`)}
            className="!p-1.5 !rounded-lg !bg-blue-50 hover:!bg-blue-100 !text-blue-600 !border !border-blue-200/60 shadow-sm transition-all hover:scale-105"
            title="View teacher"
          >
            <IconEye size={15} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => navigate(`/Users/edit-teacher/${row.id}`)}
            className="!p-1.5 !rounded-lg !bg-amber-50 hover:!bg-amber-100 !text-amber-600 !border !border-amber-200/60 shadow-sm transition-all hover:scale-105"
            title="Edit teacher"
          >
            <IconPencil size={15} />
          </IconButton>
        </div>
      ),
    },
  ];
}