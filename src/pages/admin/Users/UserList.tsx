// src/pages/admin/Users/UserList.tsx

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconPlus,
  IconPencil,
  IconPhone,
  IconCurrencyRupee,
  IconSchool,
  IconChalkboard,
} from "@tabler/icons-react";
import { Loader } from "@mantine/core";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  TableSortLabel,
  Paper,
} from "@mui/material";

import { getStudents } from "../../../api/api";
import { getAllTeachers } from "./Teacher/teacherStore";
import { type Student } from "./Student/StudentColumns";
import { DUMMY_STUDENT } from "./Student/dummyStudent";

type TabType = "students" | "teachers";
type Order = "asc" | "desc";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const avatarColors = [
  "bg-blue-600",
  "bg-indigo-600",
  "bg-sky-600",
  "bg-teal-600",
  "bg-purple-600",
  "bg-amber-600",
];

const getInitials = (first: string, last: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

const getAvatarColor = (id: string) => {
  const num = parseInt(id.replace(/\D/g, "")) || 0;
  return avatarColors[num % avatarColors.length];
};

const formatCurrency = (val: string) => {
  const n = parseFloat(val);
  return isNaN(n) ? "—" : `₹${n.toLocaleString("en-IN")}`;
};

const computeNetFees = (s: Student) =>
  (parseFloat(s.totalFees) || 0) - (parseFloat(s.discountAmount) || 0);

const computePaidAmount = (s: Student) =>
  (s.installments ?? []).reduce(
    (acc, i) => acc + (parseFloat(i.amount) || 0),
    parseFloat(s.fullPayment?.amount) || 0
  );

const computePaymentStatus = (s: Student) => {
  if (s.paymentType === "later")
    return { label: "Pending", color: "text-amber-600 bg-amber-50" };
  const paid = computePaidAmount(s);
  const net = computeNetFees(s);
  if (paid >= net) return { label: "Paid", color: "text-emerald-600 bg-emerald-50" };
  if (paid > 0) return { label: "Partial", color: "text-blue-600 bg-blue-50" };
  return { label: "Unpaid", color: "text-rose-600 bg-rose-50" };
};

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
      id: String(g.id ?? i + 1),
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

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const UsersList: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("students");
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Sorting state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>("firstName");

  // Reset page on tab change
  useEffect(() => {
    setPage(0);
    if (activeTab === "students") {
      setOrderBy("firstName");
    } else {
      setOrderBy("name");
    }
  }, [activeTab]);

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
      setStudents([DUMMY_STUDENT]);
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

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Sort Student records
  const sortedStudents = useMemo(() => {
    const data = [...students];
    return data.sort((a, b) => {
      let aVal: any = a[orderBy as keyof Student];
      let bVal: any = b[orderBy as keyof Student];

      if (orderBy === "firstName") {
        aVal = `${a.firstName} ${a.surname}`.toLowerCase();
        bVal = `${b.firstName} ${b.surname}`.toLowerCase();
      } else if (orderBy === "netFees") {
        aVal = computeNetFees(a);
        bVal = computeNetFees(b);
      } else if (orderBy === "paymentStatus") {
        aVal = computePaymentStatus(a).label;
        bVal = computePaymentStatus(b).label;
      }

      if (bVal < aVal) return order === "asc" ? 1 : -1;
      if (bVal > aVal) return order === "asc" ? -1 : 1;
      return 0;
    });
  }, [students, order, orderBy]);

  // Paginated Students
  const paginatedStudents = useMemo(() => {
    return sortedStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedStudents, page, rowsPerPage]);

  // Sort Teacher records
  const sortedTeachers = useMemo(() => {
    const data = [...teachers];
    return data.sort((a, b) => {
      const aVal = String(a[orderBy] ?? "").toLowerCase();
      const bVal = String(b[orderBy] ?? "").toLowerCase();
      if (bVal < aVal) return order === "asc" ? 1 : -1;
      if (bVal > aVal) return order === "asc" ? -1 : 1;
      return 0;
    });
  }, [teachers, order, orderBy]);

  // Paginated Teachers
  const paginatedTeachers = useMemo(() => {
    return sortedTeachers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedTeachers, page, rowsPerPage]);

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
          <button
            onClick={() => navigate("/Users/add-student")}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md transition-all hover:scale-105"
          >
            <IconPlus size={16} />
            Add Student
          </button>
        )}
        {activeTab === "teachers" && (
          <button
            onClick={() => navigate("/Users/add-teacher")}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md transition-all hover:scale-105"
          >
            <IconPlus size={16} />
            Add Teacher
          </button>
        )}
      </div>

      {/* ── Modern Underline Tabs Bar ───────────────────────────────────────── */}
      <div className="flex items-center gap-6 border-b border-slate-200/90 pb-px">
        <button
  onClick={() => setActiveTab("students")}
  className={`flex items-center gap-2 py-2 px-2 font-bold text-sm sm:text-base border-b-2 transition-all duration-200 ${
    activeTab === "students"
      ? "border-blue-600 text-blue-600 bg-blue-200 rounded-t-lg"
      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
  }`}
>
          <IconSchool size={20} className={activeTab === "students" ? "text-blue-600" : "text-slate-400"} />
          <span>Students</span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-bold transition-colors ${
              activeTab === "students"
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {students.length}
          </span>
        </button>

       <button
  onClick={() => setActiveTab("teachers")}
  className={`flex items-center gap-2 py-2 px-2 font-bold text-sm sm:text-base border-b-2 transition-all duration-200 ${
    activeTab === "teachers"
      ? "border-blue-600 text-blue-600 bg-blue-200 rounded-t-lg"
      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
  }`}
>
          <IconChalkboard size={20} className={activeTab === "teachers" ? "text-blue-600" : "text-slate-400"} />
          <span>Teachers</span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-bold transition-colors ${
              activeTab === "teachers"
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {teachers.length}
          </span>
        </button>
      </div>

      {/* ── MUI Table Container ────────────────────────────────────── */}
      <div
        className="rounded-xl overflow-hidden shadow-sm bg-white"
        style={{ border: "1px solid var(--border-card)" }}
      >
        {activeTab === "students" &&
          (loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader color="blue" size="lg" />
            </div>
          ) : (
            <div>
              {error && (
                <div className="flex items-center justify-between px-4 py-3 bg-red-50 border-b border-red-200 text-red-600 text-sm">
                  <span>
                    ⚠️ API connection failed ({error}). Showing 1 dummy student for offline preview.
                  </span>
                  <button
                    onClick={fetchStudents}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                  >
                    Retry API
                  </button>
                </div>
              )}

              <TableContainer component={Paper} elevation={0} className="bg-transparent">
                <Table className="min-w-full">
                  <TableHead className="bg-slate-50">
                    <TableRow>
                      <TableCell className="!font-semibold !text-xs !text-slate-600 !py-3">
                        <TableSortLabel
                          active={orderBy === "firstName"}
                          direction={orderBy === "firstName" ? order : "asc"}
                          onClick={() => handleRequestSort("firstName")}
                        >
                          Student
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className="!font-semibold !text-xs !text-slate-600 !py-3">
                        <TableSortLabel
                          active={orderBy === "courseType"}
                          direction={orderBy === "courseType" ? order : "asc"}
                          onClick={() => handleRequestSort("courseType")}
                        >
                          Course / Subject
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className="!font-semibold !text-xs !text-slate-600 !py-3">
                        <TableSortLabel
                          active={orderBy === "standard"}
                          direction={orderBy === "standard" ? order : "asc"}
                          onClick={() => handleRequestSort("standard")}
                        >
                          Std
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className="!font-semibold !text-xs !text-slate-600 !py-3">
                        Contact
                      </TableCell>
                      <TableCell className="!font-semibold !text-xs !text-slate-600 !py-3">
                        <TableSortLabel
                          active={orderBy === "paymentStatus"}
                          direction={orderBy === "paymentStatus" ? order : "asc"}
                          onClick={() => handleRequestSort("paymentStatus")}
                        >
                          Payment
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className="!font-semibold !text-xs !text-slate-600 !py-3">
                        <TableSortLabel
                          active={orderBy === "netFees"}
                          direction={orderBy === "netFees" ? order : "asc"}
                          onClick={() => handleRequestSort("netFees")}
                        >
                          Fees (Net)
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className="!font-semibold !text-xs !text-slate-600 !py-3 text-right">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {paginatedStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10 text-slate-400 text-sm">
                          No students found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedStudents.map((row) => {
                        const fullName = `${row.firstName} ${row.middleName} ${row.surname}`.trim();
                        const paymentStatus = computePaymentStatus(row);
                        const netFees = computeNetFees(row);

                        return (
                          <TableRow
                            key={row.id}
                            hover
                            onClick={() => navigate(`/Users/edit-student/${row.id}`)}
                            className="cursor-pointer transition-colors hover:bg-slate-50/80"
                          >
                            {/* Student Name & Email */}
                            <TableCell className="!py-3">
                              <div className="flex items-center gap-3">
                                {row.photo ? (
                                  <img
                                    src={row.photo}
                                    alt={fullName}
                                    className="w-9 h-9 rounded-full object-cover shrink-0"
                                  />
                                ) : (
                                  <div
                                    className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-xs ${getAvatarColor(
                                      row.id
                                    )}`}
                                  >
                                    {getInitials(row.firstName, row.surname)}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p className="font-semibold text-sm text-slate-800">
                                    {fullName}
                                  </p>
                                  <p className="text-xs text-slate-500">{row.email}</p>
                                </div>
                              </div>
                            </TableCell>

                            {/* Course / Subject */}
                            <TableCell className="!py-3">
                              <div>
                                <p className="text-sm font-medium text-slate-800">{row.courseType}</p>
                                <p className="text-xs text-slate-500">{row.subject}</p>
                              </div>
                            </TableCell>

                            {/* Standard */}
                            <TableCell className="!py-3">
                              <span className="text-sm font-medium text-slate-700">
                                Std {row.standard}
                              </span>
                            </TableCell>

                            {/* Contact */}
                            <TableCell className="!py-3">
                              <div>
                                <p className="text-sm flex items-center gap-1 text-slate-800">
                                  <IconPhone size={13} className="text-slate-400" />{" "}
                                  {row.contactNo}
                                </p>
                                <p className="text-xs text-slate-500">{row.branch}</p>
                              </div>
                            </TableCell>

                            {/* Payment Status */}
                            <TableCell className="!py-3">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${paymentStatus.color}`}
                              >
                                {paymentStatus.label}
                              </span>
                            </TableCell>

                            {/* Net Fees */}
                            <TableCell className="!py-3">
                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  {formatCurrency(String(netFees))}
                                </p>
                                {parseFloat(row.discountAmount) > 0 && (
                                  <p className="text-emerald-600 text-xs font-medium">
                                    -{formatCurrency(row.discountAmount)} off
                                  </p>
                                )}
                              </div>
                            </TableCell>

                            {/* Actions */}
                            <TableCell className="!py-3" align="right">
                              <div
                                className="flex items-center justify-end gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => navigate(`/Users/edit-student/${row.id}`)}
                                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                                  title="Edit student"
                                >
                                  <IconPencil size={15} />
                                </button>
                                <button
                                  onClick={() => navigate(`/Users/edit-student/${row.id}?tab=fees`)}
                                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                                  title="Update payment"
                                >
                                  <IconCurrencyRupee size={15} />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Numbered MUI Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <span>Rows per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={handleChangeRowsPerPage}
                    className="px-2 py-1 rounded border border-slate-300 bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="ml-2 text-slate-500">
                    Showing {students.length === 0 ? 0 : page * rowsPerPage + 1}–
                    {Math.min((page + 1) * rowsPerPage, students.length)} of {students.length}
                  </span>
                </div>

                <Pagination
                  count={Math.max(1, Math.ceil(students.length / rowsPerPage))}
                  page={page + 1}
                  onChange={(_e, value) => setPage(value - 1)}
                  color="primary"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                  size="small"
                />
              </div>
            </div>
          ))}

        {activeTab === "teachers" &&
          (loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader color="blue" size="lg" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <p className="text-red-500">Error: {error}</p>
              <button
                onClick={fetchTeachers}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
              >
                Retry
              </button>
            </div>
          ) : (
            <div>
              <TableContainer component={Paper} elevation={0} className="bg-transparent">
                <Table className="min-w-full">
                  <TableHead className="bg-slate-50">
                    <TableRow>
                      <TableCell className="!font-semibold !text-xs !text-slate-600 !py-3">
                        <TableSortLabel
                          active={orderBy === "name"}
                          direction={orderBy === "name" ? order : "asc"}
                          onClick={() => handleRequestSort("name")}
                        >
                          Teacher
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className="!font-semibold !text-xs !text-slate-600 !py-3">
                        <TableSortLabel
                          active={orderBy === "status"}
                          direction={orderBy === "status" ? order : "asc"}
                          onClick={() => handleRequestSort("status")}
                        >
                          Status
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className="!font-semibold !text-xs !text-slate-600 !py-3">
                        <TableSortLabel
                          active={orderBy === "joined"}
                          direction={orderBy === "joined" ? order : "asc"}
                          onClick={() => handleRequestSort("joined")}
                        >
                          Joined
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className="!font-semibold !text-xs !text-slate-600 !py-3 text-right">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {paginatedTeachers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-slate-400 text-sm">
                          No teachers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedTeachers.map((row) => (
                        <TableRow key={row.id} hover className="transition-colors hover:bg-slate-50/80">
                          <TableCell className="!py-3">
                            <div className="flex items-center gap-3">
                              {row.photo ? (
                                <img
                                  src={row.photo}
                                  alt={row.name}
                                  className="w-9 h-9 rounded-full object-cover shrink-0"
                                />
                              ) : (
                                <img
                                  src={row.avatar}
                                  alt={row.name}
                                  className="w-9 h-9 rounded-full bg-slate-100 shrink-0"
                                />
                              )}
                              <div className="min-w-0">
                                <p className="font-semibold text-sm text-slate-800">{row.name}</p>
                                <p className="text-xs text-slate-500">{row.email}</p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="!py-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                row.status === "Active"
                                  ? "text-emerald-600 bg-emerald-50"
                                  : "text-slate-500 bg-slate-100"
                              }`}
                            >
                              {row.status}
                            </span>
                          </TableCell>

                          <TableCell className="!py-3">
                            <span className="text-sm text-slate-700">{row.joined}</span>
                          </TableCell>

                          <TableCell className="!py-3" align="right">
                            <button
                              onClick={() => navigate(`/Users/edit-teacher/${row.id}`)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                              title="Edit teacher"
                            >
                              <IconPencil size={15} />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Numbered MUI Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <span>Rows per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={handleChangeRowsPerPage}
                    className="px-2 py-1 rounded border border-slate-300 bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="ml-2 text-slate-500">
                    Showing {teachers.length === 0 ? 0 : page * rowsPerPage + 1}–
                    {Math.min((page + 1) * rowsPerPage, teachers.length)} of {teachers.length}
                  </span>
                </div>

                <Pagination
                  count={Math.max(1, Math.ceil(teachers.length / rowsPerPage))}
                  page={page + 1}
                  onChange={(_e, value) => setPage(value - 1)}
                  color="primary"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                  size="small"
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default UsersList;