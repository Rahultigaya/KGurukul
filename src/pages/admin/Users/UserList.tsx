// src/pages/admin/Users/UserList.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { IconPlus } from "@tabler/icons-react";

import { studentStore } from "./Student/studentStore";
import { teacherStore } from "./Teacher/teacherStore";
import { useStudentColumns } from "./Student/StudentColumns";
import { useTeacherColumns } from "./Teacher/TeacherColumns";
import { dtStyles, sortIcon } from "../../../utils/dtStyles";
import { Button } from "@mantine/core";

type TabType = "students" | "teachers";

const studentsWithId = Object.entries(studentStore).map(([key, student]) => ({
  ...student,
  id: key,
}));

const UsersList: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("students");

  const studentColumns = useStudentColumns();
  const teacherColumns = useTeacherColumns();

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            Users
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Manage students and teachers
          </p>
        </div>

        {activeTab === "students" && (
          <Button
            onClick={() => navigate("/Users/add-student")}
            color="orange"
            size="md"
            leftSection={<IconPlus size={16} />}
          >
            Add Student
          </Button>
        )}
        {activeTab === "teachers" && (
          <button
            onClick={() => navigate("/Users/add-teacher")}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg transition-all hover:scale-105"
          >
            <IconPlus size={16} />
            Add Teacher
          </button>
        )}
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────── */}
      <div
        className="flex gap-8"
        style={{ borderBottom: "1px solid var(--border-default)" }}
      >
        {(["students", "teachers"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="pb-3 px-2 font-medium capitalize transition-all text-sm"
            style={{
              color: activeTab === tab ? "var(--accent-orange)" : "var(--text-secondary)",
              borderBottom: activeTab === tab ? "2px solid var(--accent-orange)" : "2px solid transparent",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── DataTable ──────────────────────────────────────────────── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border-card)" }}
      >
        {activeTab === "students" && (
          <DataTable
            columns={studentColumns}
            data={studentsWithId}
            customStyles={dtStyles}
            sortIcon={sortIcon}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 25, 50]}
            highlightOnHover
            responsive
          />
        )}
        {activeTab === "teachers" && (
          <DataTable
            columns={teacherColumns}
            data={Object.values(teacherStore)}
            customStyles={dtStyles}
            sortIcon={sortIcon}
            pagination
            paginationPerPage={10}
            highlightOnHover
            responsive
          />
        )}
      </div>
    </div>
  );
};

export default UsersList;