// src/pages/admin/Users/UserList.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { IconPlus } from "@tabler/icons-react";
import { Loader } from "@mantine/core";

import { getStudents } from "../../../api/api";
import { getAllTeachers } from "./Teacher/teacherStore";
import { useStudentColumns, type Student } from "./Student/StudentColumns";
import { useTeacherColumns } from "./Teacher/TeacherColumns";
import { dtStyles, sortIcon } from "../../../utils/dtStyles";
import { Button } from "@mantine/core";

type TabType = "students" | "teachers";

function transformStudent(raw: any): Student {
  return {
    id: String(raw.id),
    photo: raw.photo ?? null,
    academicYear: raw.academic_year ?? "",
    registrationDate: raw.registration_date ?? "",
    subject: raw.subject?.name ?? raw.subject ?? "",
    branch: raw.branch?.name ?? raw.branch ?? "",
    standard: raw.standard?.name ?? raw.standard ?? "",
    courseType: raw.course_type ?? "",
    reference: raw.reference ?? "",
    surname: raw.surname ?? "",
    firstName: raw.first_name ?? "",
    middleName: raw.middle_name ?? "",
    gender: raw.gender ?? "",
    email: raw.email ?? "",
    contactNo: raw.contact_no ?? "",
    address: raw.address ?? "",
    schoolCollegeName: raw.school_college_name ?? "",
    paymentType: raw.payment_type ?? "full",
    totalFees: raw.total_fees ?? "",
    discountAmount: raw.discount_amount ?? "",
    guardians: (raw.guardians ?? []).map((g: any, i: number) => ({
      id: String(g.id ?? (i + 1)),
      name: g.name ?? "",
      email: g.email ?? "",
      contact: g.contact ?? "",
      relation: g.relation ?? "",
    })),
    fullPayment: {
      amount: raw.full_payment?.amount ?? "",
      date: raw.full_payment?.date ? new Date(raw.full_payment.date) : null,
      mode: raw.full_payment?.mode ?? "",
      bankName: raw.full_payment?.bank_name ?? "",
      paidTo: raw.full_payment?.paid_to ?? "",
    },
    installments: (raw.installments ?? []).map((inst: any) => ({
      amount: inst.amount ?? "",
      date: inst.date ? new Date(inst.date) : null,
      mode: inst.mode ?? "",
      bankName: inst.bank_name ?? "",
      paidTo: inst.paid_to ?? "",
    })),
  };
}

const UsersList: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("students");
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const studentColumns = useStudentColumns();
  const teacherColumns = useTeacherColumns();

  // Fetch students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch teachers when tab changes
  useEffect(() => {
    if (activeTab === "teachers") {
      fetchTeachers();
    }
  }, [activeTab]);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getStudents();
      setStudents(res.data.map(transformStudent));
    } catch (err: any) {
      console.error("Error fetching students:", err);
      setError(err?.response?.data?.detail || err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllTeachers();
      setTeachers(data);
    } catch (err: any) {
      console.error("Error fetching teachers:", err);
      setError(err.message || "Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

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
          loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader color="orange" size="lg" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <p className="text-red-400">Error: {error}</p>
              <button
                onClick={fetchStudents}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
              >
                Retry
              </button>
            </div>
          ) : (
            <DataTable
              columns={studentColumns}
              data={students}
              customStyles={dtStyles}
              sortIcon={sortIcon}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 25, 50]}
              highlightOnHover
              responsive
            />
          )
        )}
        {activeTab === "teachers" && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader color="orange" size="lg" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-red-400">Error: {error}</p>
                <button
                  onClick={fetchTeachers}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                >
                  Retry
                </button>
              </div>
            ) : (
              <DataTable
                columns={teacherColumns}
                data={teachers}
                customStyles={dtStyles}
                sortIcon={sortIcon}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 25, 50]}
                highlightOnHover
                responsive
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UsersList;