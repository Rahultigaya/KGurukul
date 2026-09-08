import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../../components/PageHeader";

import {
  IconPencil,
  IconEye,
  IconPhone,
  IconCurrencyRupee,
  IconSchool,
  IconChalkboard,
  IconUserOff,
  IconUserCheck,
  IconAlertCircle,
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
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";

import {
  Search as SearchIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from "@mui/icons-material";

import Swal from "sweetalert2";

import { getStudents, toggleStudentStatus, toggleTeacherStatus } from "../../../api/api";
import {
  getAllTeachers,
  formatTeacherForUI,
} from "./Teacher/teacherStore";
import { type Student } from "./Student/StudentColumns";
import { DUMMY_STUDENT } from "./Student/dummyStudent";
import { DUMMY_TEACHER } from "./Teacher/dummyTeacher";

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

  return isNaN(n)
    ? "—"
    : `₹${n.toLocaleString("en-IN")}`;
};

const computeNetFees = (s: Student) =>
  (parseFloat(s.totalFees) || 0) -
  (parseFloat(s.discountAmount) || 0);

const computePaidAmount = (s: Student) =>
  (s.installments ?? []).reduce(
    (acc, i) =>
      acc + (parseFloat(i.amount) || 0),
    parseFloat(s.fullPayment?.amount) || 0
  );

const computePaymentStatus = (s: Student) => {
  if (s.paymentType === "later") {
    return {
      label: "Pending",
      color: "text-amber-600 bg-amber-50",
    };
  }

  const paid = computePaidAmount(s);
  const net = computeNetFees(s);

  if (paid >= net) {
    return {
      label: "Paid",
      color: "text-emerald-600 bg-emerald-50",
    };
  }

  if (paid > 0) {
    return {
      label: "Partial",
      color: "text-blue-600 bg-blue-50",
    };
  }

  return {
    label: "Unpaid",
    color: "text-rose-600 bg-rose-50",
  };
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

    guardians: (raw.guardians ?? []).map(
      (g: any, i: number) => ({
        id: String(g.id ?? i + 1),
        name: g.name ?? "",
        email: g.email ?? "",
        contact: g.contact ?? "",
        relation: g.relation ?? "",
      })
    ),

    fullPayment: {
      amount: raw.full_payment?.amount ?? "",
      date: raw.full_payment?.date
        ? new Date(raw.full_payment.date)
        : null,
      mode: raw.full_payment?.mode ?? "",
      bankName: raw.full_payment?.bank_name ?? "",
      paidTo: raw.full_payment?.paid_to ?? "",
    },

    installments: (raw.installments ?? []).map(
      (inst: any) => ({
        amount: inst.amount ?? "",
        date: inst.date
          ? new Date(inst.date)
          : null,
        mode: inst.mode ?? "",
        bankName: inst.bank_name ?? "",
        paidTo: inst.paid_to ?? "",
      })
    ),

    isActive:
      raw.is_active ??
      raw.isactive ??
      raw.isActive ??
      true,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const UsersList: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState<TabType>("students");

  const [students, setStudents] =
    useState<Student[]>([]);

  const [teachers, setTeachers] =
    useState<any[]>([]);

  const [loadingStudents, setLoadingStudents] =
    useState(false);

  const [loadingTeachers, setLoadingTeachers] =
    useState(false);

  const loading =
    activeTab === "students"
      ? loadingStudents
      : loadingTeachers;

  const [studentError, setStudentError] =
    useState<string | null>(null);

  const [teacherError, setTeacherError] =
    useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  // Sorting
  const [order, setOrder] =
    useState<Order>("asc");

  const [orderBy, setOrderBy] =
    useState<string>("firstName");

  // Search
  const [searchQuery, setSearchQuery] =
    useState("");

  // ───────────────────────────────────────────────────────────────────────────
  // Reset pagination and sorting when tab changes
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    setPage(0);

    if (activeTab === "students") {
      setOrderBy("firstName");
    } else {
      setOrderBy("name");
    }

    setOrder("asc");
  }, [activeTab]);

  // ───────────────────────────────────────────────────────────────────────────
  // Fetch data on mount: Call both APIs once (guarded against StrictMode double calls)
  // ───────────────────────────────────────────────────────────────────────────

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchStudents();
    fetchTeachers();
  }, []);

  // ───────────────────────────────────────────────────────────────────────────
  // Fetch Students
  // ───────────────────────────────────────────────────────────────────────────

  const fetchStudents = async () => {
    setLoadingStudents(true);
    setStudentError(null);

    try {
      const res = await getStudents();

      setStudents(
        res.data.map(transformStudent)
      );
    } catch (err: any) {
      console.error(
        "Error fetching students:",
        err
      );

      setStudentError(
        err?.response?.data?.detail ||
          err.message ||
          "Failed to load students"
      );

      setStudents([DUMMY_STUDENT]);
    } finally {
      setLoadingStudents(false);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Fetch Teachers
  // ───────────────────────────────────────────────────────────────────────────

  const fetchTeachers = async () => {
    setLoadingTeachers(true);
    setTeacherError(null);

    try {
      const data = await getAllTeachers();

      setTeachers(data);
    } catch (err: any) {
      console.error(
        "Error fetching teachers:",
        err
      );

      setTeacherError(
        err?.response?.data?.detail ||
          err.message ||
          "Failed to load teachers"
      );

      setTeachers([
        formatTeacherForUI(DUMMY_TEACHER),
      ]);
    } finally {
      setLoadingTeachers(false);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Toggle Student Status
  // ───────────────────────────────────────────────────────────────────────────

  const handleToggleStudentStatus = async (
    student: Student
  ) => {
    const isCurrentlyActive =
      student.isActive ?? true;

    const actionText =
      isCurrentlyActive
        ? "deactivate"
        : "activate";

    const newIsActive =
      !isCurrentlyActive;

    const fullName =
      `${student.firstName} ${student.surname}`.trim();

    const result = await Swal.fire({
      title: `${
        isCurrentlyActive
          ? "Deactivate"
          : "Activate"
      } Student?`,

      text: `Are you sure you want to ${actionText} ${fullName}?`,

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor:
        isCurrentlyActive
          ? "#ef4444"
          : "#10b981",

      cancelButtonColor: "#64748b",

      confirmButtonText:
        `Yes, ${actionText}!`,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await toggleStudentStatus(Number(student.id));
    } catch (err: any) {
      console.error("API error toggling student status:", err);
    }

    setStudents((prev) =>
      prev.map((s) =>
        s.id === student.id
          ? {
              ...s,
              isActive: newIsActive,
            }
          : s
      )
    );

    Swal.fire(
      "Updated!",
      `Student ${fullName} has been ${
        newIsActive
          ? "activated"
          : "deactivated"
      }.`,
      "success"
    );
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Toggle Teacher Status
  // ───────────────────────────────────────────────────────────────────────────

  const handleToggleTeacherStatus = async (
    teacher: any
  ) => {
    const isCurrentlyActive =
      teacher.status === "Active";

    const actionText =
      isCurrentlyActive
        ? "deactivate"
        : "activate";

    const newStatus: "Active" | "Inactive" =
      isCurrentlyActive
        ? "Inactive"
        : "Active";

    const result = await Swal.fire({
      title: `${
        isCurrentlyActive
          ? "Deactivate"
          : "Activate"
      } Teacher?`,

      text: `Are you sure you want to ${actionText} ${teacher.name}?`,

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor:
        isCurrentlyActive
          ? "#ef4444"
          : "#10b981",

      cancelButtonColor: "#64748b",

      confirmButtonText:
        `Yes, ${actionText}!`,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await toggleTeacherStatus(teacher.id);
    } catch (err: any) {
      console.error("API error toggling teacher status:", err);
    }

    setTeachers((prev) =>
      prev.map((t) =>
        t.id === teacher.id
          ? {
              ...t,
              status: newStatus,
            }
          : t
      )
    );

    Swal.fire(
      "Updated!",
      `Teacher ${teacher.name} has been ${
        newStatus === "Inactive"
          ? "deactivated"
          : "activated"
      }.`,
      "success"
    );
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Sorting
  // ───────────────────────────────────────────────────────────────────────────

  const handleRequestSort = (
    property: string
  ) => {
    const isAsc =
      orderBy === property &&
      order === "asc";

    setOrder(
      isAsc ? "desc" : "asc"
    );

    setOrderBy(property);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Rows Per Page
  // ───────────────────────────────────────────────────────────────────────────

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(
      parseInt(
        event.target.value,
        10
      )
    );

    setPage(0);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Filter Students
  // ───────────────────────────────────────────────────────────────────────────

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) {
      return students;
    }

    const q =
      searchQuery
        .toLowerCase()
        .trim();

    return students.filter((s) => {
      const fullName =
        `${s.firstName} ${s.middleName} ${s.surname}`
          .toLowerCase();

      const email =
        (s.email || "").toLowerCase();

      const contact =
        (s.contactNo || "").toLowerCase();

      const standard =
        (s.standard || "").toLowerCase();

      const subject =
        (s.subject || "").toLowerCase();

      const branch =
        (s.branch || "").toLowerCase();

      const courseType =
        (s.courseType || "").toLowerCase();

      const paymentStatus =
        computePaymentStatus(s)
          .label
          .toLowerCase();

      const school =
        (s.schoolCollegeName || "")
          .toLowerCase();

      return (
        fullName.includes(q) ||
        email.includes(q) ||
        contact.includes(q) ||
        standard.includes(q) ||
        subject.includes(q) ||
        branch.includes(q) ||
        courseType.includes(q) ||
        paymentStatus.includes(q) ||
        school.includes(q)
      );
    });
  }, [
    students,
    searchQuery,
  ]);

  // ───────────────────────────────────────────────────────────────────────────
  // Sort Students
  // ───────────────────────────────────────────────────────────────────────────

  const sortedStudents = useMemo(() => {
    const data = [
      ...filteredStudents,
    ];

    return data.sort((a, b) => {
      let aVal: any =
        a[
          orderBy as keyof Student
        ];

      let bVal: any =
        b[
          orderBy as keyof Student
        ];

      if (orderBy === "firstName") {
        aVal =
          `${a.firstName} ${a.surname}`
            .toLowerCase();

        bVal =
          `${b.firstName} ${b.surname}`
            .toLowerCase();
      }

      if (orderBy === "netFees") {
        aVal = computeNetFees(a);
        bVal = computeNetFees(b);
      }

      if (
        orderBy ===
        "paymentStatus"
      ) {
        aVal =
          computePaymentStatus(a)
            .label;

        bVal =
          computePaymentStatus(b)
            .label;
      }

      if (bVal < aVal) {
        return order === "asc"
          ? 1
          : -1;
      }

      if (bVal > aVal) {
        return order === "asc"
          ? -1
          : 1;
      }

      return 0;
    });
  }, [
    filteredStudents,
    order,
    orderBy,
  ]);

  // ───────────────────────────────────────────────────────────────────────────
  // Paginate Students
  // ───────────────────────────────────────────────────────────────────────────

  const paginatedStudents =
    useMemo(() => {
      return sortedStudents.slice(
        page * rowsPerPage,
        page * rowsPerPage +
          rowsPerPage
      );
    }, [
      sortedStudents,
      page,
      rowsPerPage,
    ]);

  // ───────────────────────────────────────────────────────────────────────────
  // Filter Teachers
  // ───────────────────────────────────────────────────────────────────────────

  const filteredTeachers = useMemo(() => {
    if (!searchQuery.trim()) {
      return teachers;
    }

    const q =
      searchQuery
        .toLowerCase()
        .trim();

    return teachers.filter((t) => {
      const name = (
        t.name ||
        `${t.firstName || ""} ${t.lastName || ""}`
      ).toLowerCase();

      const email =
        (t.email || "").toLowerCase();

      const status =
        (t.status || "").toLowerCase();

      const joined =
        (
          t.joined ||
          t.joiningDate ||
          ""
        ).toLowerCase();

      return (
        name.includes(q) ||
        email.includes(q) ||
        status.includes(q) ||
        joined.includes(q)
      );
    });
  }, [
    teachers,
    searchQuery,
  ]);

  // ───────────────────────────────────────────────────────────────────────────
  // Sort Teachers
  // ───────────────────────────────────────────────────────────────────────────

  const sortedTeachers = useMemo(() => {
    const data = [
      ...filteredTeachers,
    ];

    return data.sort((a, b) => {
      const aVal = String(
        a[orderBy] ?? ""
      ).toLowerCase();

      const bVal = String(
        b[orderBy] ?? ""
      ).toLowerCase();

      if (bVal < aVal) {
        return order === "asc"
          ? 1
          : -1;
      }

      if (bVal > aVal) {
        return order === "asc"
          ? -1
          : 1;
      }

      return 0;
    });
  }, [
    filteredTeachers,
    order,
    orderBy,
  ]);

  // ───────────────────────────────────────────────────────────────────────────
  // Paginate Teachers
  // ───────────────────────────────────────────────────────────────────────────

  const paginatedTeachers =
    useMemo(() => {
      return sortedTeachers.slice(
        page * rowsPerPage,
        page * rowsPerPage +
          rowsPerPage
      );
    }, [
      sortedTeachers,
      page,
      rowsPerPage,
    ]);

  // ─────────────────────────────────────────────────────────────────────────────
  // JSX
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <PageHeader
        title="Users"
        subtitle="Manage students and teachers"
        action={
          <>
            {activeTab === "students" && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon className="!text-white" />}
                onClick={() => navigate("/Users/add-student")}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 !text-white [&_svg]:!text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md transition-all hover:scale-105"
              >
                Add Student
              </Button>
            )}
            {activeTab === "teachers" && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon className="!text-white" />}
                onClick={() => navigate("/Users/add-teacher")}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 !text-white [&_svg]:!text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md transition-all hover:scale-105"
              >
                Add Teacher
              </Button>
            )}
          </>
        }
      />

      {/* Main Card with Folder Tabs Sticking Out */}
      <div className="space-y-0 relative">
        {/* Top Folder Tabs (Sticking out of top of card) */}
        <div className="flex items-end gap-2 px-2 -mb-px relative z-10">
          {/* Students Tab */}
          <Button
            onClick={() => {
              setActiveTab("students");
              setPage(0);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-t-xl border transition-all !normal-case ${
              activeTab === "students"
                ? "!bg-blue-600 !text-white !border-blue-600 shadow-sm"
                : "!bg-slate-100/90 hover:!bg-slate-200 !text-slate-600 !border-slate-200"
            }`}
          >
            <IconSchool size={18} />
            <span>Students</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === "students"
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {filteredStudents.length}
            </span>
          </Button>

          {/* Teachers Tab */}
          <Button
            onClick={() => {
              setActiveTab("teachers");
              setPage(0);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-t-xl border transition-all !normal-case ${
              activeTab === "teachers"
                ? "!bg-blue-600 !text-white !border-blue-600 shadow-sm"
                : "!bg-slate-100/90 hover:!bg-slate-200 !text-slate-600 !border-slate-200"
            }`}
          >
            <IconChalkboard size={18} />
            <span>Teachers</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === "teachers"
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {filteredTeachers.length}
            </span>
          </Button>
        </div>

        {/* Main Card Container */}
        <Card
          elevation={1}
          className="bg-white border border-slate-200/80 rounded-b-2xl rounded-tr-2xl rounded-tl-none shadow-lg relative z-0"
        >
          <CardContent className="!p-5 sm:!p-6">
            {/* Card Toolbar: Directory Title & Search Box */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-lg font-bold text-slate-800">
                {activeTab === "students" ? "Student List" : "Teacher List"}
              </h3>

              {/* Search */}
              <TextField
                placeholder={
                  activeTab === "students"
                    ? "Search students by name, email, std, subject..."
                    : "Search teachers by name, email, status..."
                }
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                size="small"
                className="w-full sm:w-80"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon className="text-slate-400" fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery ? (
                      <IconButton size="small" onClick={() => setSearchQuery("")}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    ) : null,
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f8fafc",
                    borderRadius: "12px",
                  },
                }}
              />
            </div>

          {/* ================================================================ */}
          {/* STUDENTS */}
          {/* ================================================================ */}

          {activeTab === "students" && (
            <>
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader
                    color="blue"
                    size="lg"
                  />
                </div>
              ) : (
                <div>

                  {/* Student Error */}
                  {studentError && (
                    <div className="flex items-center justify-between px-4 py-3 bg-red-50 border-b border-red-200 text-red-600 text-sm">
                      <span className="flex items-center gap-1.5">
                        <IconAlertCircle size={16} className="shrink-0" />
                        API connection failed (
                        {studentError}
                        ). Showing 1 dummy student for offline preview.
                      </span>

                      <Button
                        size="small"
                        variant="contained"
                        onClick={
                          fetchStudents
                        }
                        className="!px-3 !py-1 !bg-blue-600 hover:!bg-blue-700 !text-white !text-xs !font-medium !rounded !normal-case"
                      >
                        Retry API
                      </Button>
                    </div>
                  )}

                  {/* Student Table */}
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    className="bg-transparent"
                  >
                    <Table className="min-w-full">

                      <TableHead className="bg-slate-50">
                        <TableRow>

                          {/* Student */}
                          <TableCell className="!font-semibold !text-xs !text-slate-600 !py-3">
                            <TableSortLabel
                              active={
                                orderBy ===
                                "firstName"
                              }
                              direction={
                                orderBy ===
                                "firstName"
                                  ? order
                                  : "asc"
                              }
                              onClick={() =>
                                handleRequestSort(
                                  "firstName"
                                )
                              }
                            >
                              Student
                            </TableSortLabel>
                          </TableCell>

                          {/* Course */}
                          <TableCell className="!font-semibold !text-xs !text-slate-600 !py-3">
                            <TableSortLabel
                              active={
                                orderBy ===
                                "courseType"
                              }
                              direction={
                                orderBy ===
                                "courseType"
                                  ? order
                                  : "asc"
                              }
                              onClick={() =>
                                handleRequestSort(
                                  "courseType"
                                )
                              }
                            >
                              Course / Subject
                            </TableSortLabel>
                          </TableCell>

                          {/* Standard */}
                          <TableCell className="!font-semibold !text-xs !text-slate-600 !py-3">
                            <TableSortLabel
                              active={
                                orderBy ===
                                "standard"
                              }
                              direction={
                                orderBy ===
                                "standard"
                                  ? order
                                  : "asc"
                              }
                              onClick={() =>
                                handleRequestSort(
                                  "standard"
                                )
                              }
                            >
                              Std
                            </TableSortLabel>
                          </TableCell>

                          {/* Contact */}
                          <TableCell className="!font-semibold !text-xs !text-slate-600 !py-3">
                            Contact
                          </TableCell>

                          {/* Payment */}
                          <TableCell className="!font-semibold !text-xs !text-slate-600 !py-3">
                            <TableSortLabel
                              active={
                                orderBy ===
                                "paymentStatus"
                              }
                              direction={
                                orderBy ===
                                "paymentStatus"
                                  ? order
                                  : "asc"
                              }
                              onClick={() =>
                                handleRequestSort(
                                  "paymentStatus"
                                )
                              }
                            >
                              Payment
                            </TableSortLabel>
                          </TableCell>

                          {/* Fees */}
                          <TableCell className="!font-semibold !text-xs !text-slate-600 !py-3">
                            <TableSortLabel
                              active={
                                orderBy ===
                                "netFees"
                              }
                              direction={
                                orderBy ===
                                "netFees"
                                  ? order
                                  : "asc"
                              }
                              onClick={() =>
                                handleRequestSort(
                                  "netFees"
                                )
                              }
                            >
                              Fees (Net)
                            </TableSortLabel>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="!font-semibold !text-xs !text-slate-600 !py-3 text-right">
                            Actions
                          </TableCell>

                        </TableRow>
                      </TableHead>

                      <TableBody>

                        {paginatedStudents.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="text-center py-10 text-slate-400 text-sm"
                            >
                              No students found
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedStudents.map(
                            (row) => {
                              const fullName =
                                `${row.firstName} ${row.middleName} ${row.surname}`.trim();

                              const paymentStatus =
                                computePaymentStatus(
                                  row
                                );

                              const netFees =
                                computeNetFees(
                                  row
                                );

                              const isActive =
                                row.isActive ??
                                true;

                              return (
                                <TableRow
                                  key={row.id}
                                  hover
                                  className="transition-colors hover:bg-slate-50/80"
                                >

                                  {/* Student */}
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
                                          {getInitials(
                                            row.firstName,
                                            row.surname
                                          )}
                                        </div>
                                      )}

                                      <div className="min-w-0">
                                        <p className="font-semibold text-sm text-slate-800">
                                          {fullName}
                                        </p>

                                        <p className="text-xs text-slate-500">
                                          {row.email}
                                        </p>
                                      </div>

                                    </div>
                                  </TableCell>

                                  {/* Course / Subject */}
                                  <TableCell className="!py-3">
                                    <div>
                                      <p className="text-sm font-medium text-slate-800">
                                        {row.courseType}
                                      </p>

                                      <p className="text-xs text-slate-500">
                                        {row.subject}
                                      </p>
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
                                        <IconPhone
                                          size={13}
                                          className="text-slate-400"
                                        />

                                        {row.contactNo}
                                      </p>

                                      <p className="text-xs text-slate-500">
                                        {row.branch}
                                      </p>
                                    </div>
                                  </TableCell>

                                  {/* Payment */}
                                  <TableCell className="!py-3">
                                    <span
                                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${paymentStatus.color}`}
                                    >
                                      {
                                        paymentStatus.label
                                      }
                                    </span>
                                  </TableCell>

                                  {/* Fees */}
                                  <TableCell className="!py-3">
                                    <div>
                                      <p className="text-sm font-semibold text-slate-800">
                                        {formatCurrency(
                                          String(
                                            netFees
                                          )
                                        )}
                                      </p>

                                      {parseFloat(
                                        row.discountAmount
                                      ) > 0 && (
                                        <p className="text-emerald-600 text-xs font-medium">
                                          -
                                          {formatCurrency(
                                            row.discountAmount
                                          )}{" "}
                                          off
                                        </p>
                                      )}
                                    </div>
                                  </TableCell>

                                  {/* Actions */}
                                  <TableCell
                                    className="!py-3"
                                    align="right"
                                  >
                                    <div
                                      className="flex items-center justify-end gap-1"
                                      onClick={(e) =>
                                        e.stopPropagation()
                                      }
                                    >

                                      {/* View */}
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          navigate(
                                            `/Users/edit-student/${row.id}?mode=view`
                                          )
                                        }
                                        className="!p-1.5 !rounded-lg !bg-blue-50 hover:!bg-blue-100 !text-blue-600 !border !border-blue-200/60 shadow-sm transition-all hover:scale-105"
                                        title="View student"
                                      >
                                        <IconEye
                                          size={15}
                                        />
                                      </IconButton>

                                      {/* Edit */}
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          navigate(
                                            `/Users/edit-student/${row.id}`
                                          )
                                        }
                                        className="!p-1.5 !rounded-lg !bg-amber-50 hover:!bg-amber-100 !text-amber-600 !border !border-amber-200/60 shadow-sm transition-all hover:scale-105"
                                        title="Edit student"
                                      >
                                        <IconPencil
                                          size={15}
                                        />
                                      </IconButton>

                                      {/* Payment */}
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          navigate(
                                            `/Users/edit-student/${row.id}?tab=fees`
                                          )
                                        }
                                        className="!p-1.5 !rounded-lg !bg-emerald-50 hover:!bg-emerald-100 !text-emerald-600 !border !border-emerald-200/60 shadow-sm transition-all hover:scale-105"
                                        title="Update payment"
                                      >
                                        <IconCurrencyRupee
                                          size={15}
                                        />
                                      </IconButton>

                                      {/* Activate / Deactivate */}
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          handleToggleStudentStatus(
                                            row
                                          )
                                        }
                                        className={`!p-1.5 !rounded-lg shadow-sm !border transition-all hover:scale-105 ${
                                          isActive
                                            ? "!bg-rose-50 hover:!bg-rose-100 !text-rose-600 !border-rose-200/60"
                                            : "!bg-teal-50 hover:!bg-teal-100 !text-teal-600 !border-teal-200/60"
                                        }`}
                                        title={
                                          isActive
                                            ? "Deactivate student"
                                            : "Activate student"
                                        }
                                      >
                                        {isActive ? (
                                          <IconUserOff
                                            size={15}
                                          />
                                        ) : (
                                          <IconUserCheck
                                            size={15}
                                          />
                                        )}
                                      </IconButton>

                                    </div>
                                  </TableCell>

                                </TableRow>
                              );
                            }
                          )
                        )}

                      </TableBody>

                    </Table>
                  </TableContainer>

                  {/* Student Pagination */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-slate-200 bg-slate-50/50">

                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">

                      <span>
                        Rows per page:
                      </span>

                      <select
                        value={rowsPerPage}
                        onChange={
                          handleChangeRowsPerPage
                        }
                        className="px-2 py-1 rounded border border-slate-300 bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value={10}>
                          10
                        </option>

                        <option value={25}>
                          25
                        </option>

                        <option value={50}>
                          50
                        </option>
                      </select>

                      <span className="ml-2 text-slate-500">
                        Showing{" "}
                        {filteredStudents.length ===
                        0
                          ? 0
                          : page *
                              rowsPerPage +
                            1}
                        –
                        {Math.min(
                          (page + 1) *
                            rowsPerPage,
                          filteredStudents.length
                        )}{" "}
                        of{" "}
                        {
                          filteredStudents.length
                        }
                      </span>

                    </div>

                    <Pagination
                      count={Math.max(
                        1,
                        Math.ceil(
                          filteredStudents.length /
                            rowsPerPage
                        )
                      )}
                      page={page + 1}
                      onChange={(
                        _e,
                        value
                      ) =>
                        setPage(value - 1)
                      }
                      color="primary"
                      shape="rounded"
                      showFirstButton
                      showLastButton
                      size="small"
                    />

                  </div>

                </div>
              )}
            </>
          )}

          {/* ================================================================ */}
          {/* TEACHERS */}
          {/* ================================================================ */}

          {activeTab === "teachers" && (
            <>
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader
                    color="blue"
                    size="lg"
                  />
                </div>
              ) : (
                <div>

                  {/* Teacher Error */}
                  {teacherError && (
                    <div className="flex items-center justify-between px-4 py-3 bg-red-50 border-b border-red-200 text-red-600 text-sm">

                      <span className="flex items-center gap-1.5">
                        <IconAlertCircle size={16} className="shrink-0" />
                        API connection failed (
                        {teacherError}
                        ). Showing 1 dummy teacher for offline preview.
                      </span>

                      <Button
                        size="small"
                        variant="contained"
                        onClick={
                          fetchTeachers
                        }
                        className="!px-3 !py-1 !bg-blue-600 hover:!bg-blue-700 !text-white !text-xs !font-medium !rounded !normal-case"
                      >
                        Retry API
                      </Button>

                    </div>
                  )}

                  {/* Teacher Table */}
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    className="bg-transparent"
                  >
                    <Table className="min-w-full">

                      <TableHead className="bg-slate-50">
                        <TableRow>

                          {/* Teacher */}
                          <TableCell className="!font-semibold !text-xs !text-slate-600 !py-3">
                            <TableSortLabel
                              active={
                                orderBy ===
                                "name"
                              }
                              direction={
                                orderBy === "name"
                                  ? order
                                  : "asc"
                              }
                              onClick={() =>
                                handleRequestSort(
                                  "name"
                                )
                              }
                            >
                              Teacher
                            </TableSortLabel>
                          </TableCell>

                          {/* Joined */}
                          <TableCell className="!font-semibold !text-xs !text-slate-600 !py-3">
                            <TableSortLabel
                              active={
                                orderBy ===
                                "joined"
                              }
                              direction={
                                orderBy === "joined"
                                  ? order
                                  : "asc"
                              }
                              onClick={() =>
                                handleRequestSort(
                                  "joined"
                                )
                              }
                            >
                              Joined
                            </TableSortLabel>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="!font-semibold !text-xs !text-slate-600 !py-3 text-right">
                            Actions
                          </TableCell>

                        </TableRow>
                      </TableHead>

                      <TableBody>

                        {paginatedTeachers.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={3}
                              className="text-center py-10 text-slate-400 text-sm"
                            >
                              No teachers found
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedTeachers.map(
                            (row) => (
                              <TableRow
                                key={row.id}
                                hover
                                className="transition-colors hover:bg-slate-50/80"
                              >

                                {/* Teacher */}
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

                                      <p className="font-semibold text-sm text-slate-800">
                                        {row.name}
                                      </p>

                                      <p className="text-xs text-slate-500">
                                        {row.email}
                                      </p>

                                    </div>

                                  </div>
                                </TableCell>

                                {/* Joined */}
                                <TableCell className="!py-3">
                                  <span className="text-sm text-slate-700">
                                    {row.joined}
                                  </span>
                                </TableCell>

                                {/* Actions */}
                                <TableCell
                                  className="!py-3"
                                  align="right"
                                >
                                  <div
                                    className="flex items-center justify-end gap-1"
                                    onClick={(e) =>
                                      e.stopPropagation()
                                    }
                                  >

                                    {/* View */}
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        navigate(
                                          `/Users/edit-teacher/${row.id}?mode=view`
                                        )
                                      }
                                      className="!p-1.5 !rounded-lg !bg-blue-50 hover:!bg-blue-100 !text-blue-600 !border !border-blue-200/60 shadow-sm transition-all hover:scale-105"
                                      title="View teacher"
                                    >
                                      <IconEye
                                        size={15}
                                      />
                                    </IconButton>

                                    {/* Edit */}
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        navigate(
                                          `/Users/edit-teacher/${row.id}`
                                        )
                                      }
                                      className="!p-1.5 !rounded-lg !bg-amber-50 hover:!bg-amber-100 !text-amber-600 !border !border-amber-200/60 shadow-sm transition-all hover:scale-105"
                                      title="Edit teacher"
                                    >
                                      <IconPencil
                                        size={15}
                                      />
                                    </IconButton>

                                    {/* Activate / Deactivate */}
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        handleToggleTeacherStatus(
                                          row
                                        )
                                      }
                                      className={`!p-1.5 !rounded-lg shadow-sm !border transition-all hover:scale-105 ${
                                        row.status ===
                                        "Active"
                                          ? "!bg-rose-50 hover:!bg-rose-100 !text-rose-600 !border-rose-200/60"
                                          : "!bg-teal-50 hover:!bg-teal-100 !text-teal-600 !border-teal-200/60"
                                      }`}
                                      title={
                                        row.status ===
                                        "Active"
                                          ? "Deactivate teacher"
                                          : "Activate teacher"
                                      }
                                    >
                                      {row.status ===
                                      "Active" ? (
                                        <IconUserOff
                                          size={15}
                                        />
                                      ) : (
                                        <IconUserCheck
                                          size={15}
                                        />
                                      )}
                                    </IconButton>

                                  </div>
                                </TableCell>

                              </TableRow>
                            )
                          )
                        )}

                      </TableBody>

                    </Table>
                  </TableContainer>

                  {/* Teacher Pagination */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-slate-200 bg-slate-50/50">

                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">

                      <span>
                        Rows per page:
                      </span>

                      <select
                        value={rowsPerPage}
                        onChange={
                          handleChangeRowsPerPage
                        }
                        className="px-2 py-1 rounded border border-slate-300 bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value={10}>
                          10
                        </option>

                        <option value={25}>
                          25
                        </option>

                        <option value={50}>
                          50
                        </option>
                      </select>

                      <span className="ml-2 text-slate-500">
                        Showing{" "}
                        {filteredTeachers.length ===
                        0
                          ? 0
                          : page *
                              rowsPerPage +
                            1}
                        –
                        {Math.min(
                          (page + 1) *
                            rowsPerPage,
                          filteredTeachers.length
                        )}{" "}
                        of{" "}
                        {
                          filteredTeachers.length
                        }
                      </span>

                    </div>

                    <Pagination
                      count={Math.max(
                        1,
                        Math.ceil(
                          filteredTeachers.length /
                            rowsPerPage
                        )
                      )}
                      page={page + 1}
                      onChange={(
                        _e,
                        value
                      ) =>
                        setPage(value - 1)
                      }
                      color="primary"
                      shape="rounded"
                      showFirstButton
                      showLastButton
                      size="small"
                    />

                  </div>

                </div>
              )}
            </>
          )}

        </CardContent>
      </Card>
    </div>

    </div>
  );
};

export default UsersList;