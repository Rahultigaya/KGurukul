import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconPlus,
  IconPencil,
  IconShare,
  IconChevronDown,
  IconChevronUp,
  IconPhone,
  IconMail,
  IconSchool,
  IconUser,
  IconSearch,
  IconFilter,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type TabType = "students" | "teachers";

interface Guardian {
  id: string;
  name: string;
  email: string;
  contact: string;
  relation: string;
}

interface Installment {
  amount: string;
  date: string | null;
  mode: string;
  bankName: string;
  paidTo: string;
}

interface Student {
  id: number;
  photo: string | null;
  registrationDate: string;
  subject: string;
  branch: string;
  courseType: string;
  reference: string;
  surname: string;
  firstName: string;
  middleName: string;
  gender: string;
  email: string;
  contactNo: string;
  address: string;
  schoolCollegeName: string;
  standard: string;
  guardians: Guardian[];
  paymentType: string;
  totalFees: string;
  discountAmount: string;
  fullPayment: Installment;
  installments: Installment[];
}

interface Teacher {
  id: number;
  name: string;
  avatar: string;
  subject: string;
  status: string;
  joined: string;
  students: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const ROWS_PER_PAGE = 10;

const SUBJECT_OPTIONS = [
  "All",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Computer Science",
];

const STATUS_OPTIONS = ["All", "Paid", "Partial", "Pending", "Unpaid"];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const getInitials = (first: string, last: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

const avatarColors = [
  "bg-orange-500",
  "bg-purple-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-yellow-500",
  "bg-red-500",
];

const getAvatarColor = (id: number) => avatarColors[id % avatarColors.length];

const formatCurrency = (val: string) => {
  const n = parseFloat(val);
  if (isNaN(n)) return "—";
  return `₹${n.toLocaleString("en-IN")}`;
};

const computeNetFees = (student: Student) =>
  (parseFloat(student.totalFees) || 0) -
  (parseFloat(student.discountAmount) || 0);

const computePaidAmount = (student: Student) =>
  student.installments.reduce(
    (acc, inst) => acc + (parseFloat(inst.amount) || 0),
    parseFloat(student.fullPayment.amount) || 0,
  );

const computePaymentStatus = (student: Student) => {
  const net = computeNetFees(student);
  if (student.paymentType === "later")
    return { label: "Pending", color: "text-yellow-400 bg-yellow-500/10" };
  const paid = computePaidAmount(student);
  if (paid >= net)
    return { label: "Paid", color: "text-green-400 bg-green-500/10" };
  if (paid > 0)
    return { label: "Partial", color: "text-blue-400 bg-blue-500/10" };
  return { label: "Unpaid", color: "text-red-400 bg-red-500/10" };
};

// ─────────────────────────────────────────────────────────────────────────────
// Sample Data  (replace with your real data source / API call)
// ─────────────────────────────────────────────────────────────────────────────

const sampleStudents: Student[] = [
  {
    id: 1,
    photo: null,
    registrationDate: "2026-02-24",
    subject: "Mathematics",
    branch: "Pune Main",
    courseType: "Crash (Backlog)",
    reference: "",
    surname: "Sharma",
    firstName: "Rahul",
    middleName: "Kumar",
    gender: "male",
    email: "rahul.sharma@email.com",
    contactNo: "9876543210",
    address: "123, MG Road, Pune",
    schoolCollegeName: "Fergusson College",
    standard: "12",
    guardians: [
      {
        id: "1",
        name: "Rajesh Sharma",
        email: "rajesh@email.com",
        contact: "9876543200",
        relation: "Father",
      },
    ],
    paymentType: "installment",
    totalFees: "45000",
    discountAmount: "5000",
    fullPayment: {
      amount: "",
      date: "2026-02-18",
      mode: "",
      bankName: "",
      paidTo: "",
    },
    installments: [
      {
        amount: "20000",
        date: "2026-02-18",
        mode: "UPI",
        bankName: "",
        paidTo: "Admin",
      },
      { amount: "15000", date: null, mode: "", bankName: "", paidTo: "" },
    ],
  },
  {
    id: 2,
    photo: null,
    registrationDate: "2026-02-20",
    subject: "Physics",
    branch: "Pune West",
    courseType: "Regular",
    reference: "Online Ad",
    surname: "Patel",
    firstName: "Priya",
    middleName: "Anand",
    gender: "female",
    email: "priya.patel@email.com",
    contactNo: "8765432109",
    address: "45, Baner Road, Pune",
    schoolCollegeName: "SP College",
    standard: "11",
    guardians: [
      {
        id: "1",
        name: "Anand Patel",
        email: "anand@email.com",
        contact: "8765432100",
        relation: "Father",
      },
    ],
    paymentType: "full",
    totalFees: "38000",
    discountAmount: "3000",
    fullPayment: {
      amount: "35000",
      date: "2026-02-20",
      mode: "NEFT",
      bankName: "HDFC",
      paidTo: "Admin",
    },
    installments: [],
  },
  {
    id: 3,
    photo: null,
    registrationDate: "2026-02-15",
    subject: "Chemistry",
    branch: "Pune East",
    courseType: "Crash (Backlog)",
    reference: "Friend",
    surname: "Verma",
    firstName: "Amit",
    middleName: "Raj",
    gender: "male",
    email: "amit.verma@email.com",
    contactNo: "7654321098",
    address: "78, Kothrud, Pune",
    schoolCollegeName: "COEP",
    standard: "12",
    guardians: [
      {
        id: "1",
        name: "Raj Verma",
        email: "raj@email.com",
        contact: "7654321000",
        relation: "Father",
      },
    ],
    paymentType: "later",
    totalFees: "50000",
    discountAmount: "0",
    fullPayment: { amount: "", date: "", mode: "", bankName: "", paidTo: "" },
    installments: [],
  },
  // ── Add more students here, or load from localStorage / API ──
];

const sampleTeachers: Teacher[] = [
  {
    id: 1,
    name: "Dr. Emily Brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    subject: "Mathematics",
    status: "Active",
    joined: "12 Jan, 2015",
    students: 45,
  },
  {
    id: 2,
    name: "Prof. David Lee",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    subject: "Science",
    status: "Active",
    joined: "05 Mar, 2016",
    students: 38,
  },
  {
    id: 3,
    name: "Ms. Rachel Green",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel",
    subject: "English",
    status: "Active",
    joined: "20 Sep, 2015",
    students: 52,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

const StudentExpandedRow: React.FC<{ student: Student }> = ({ student }) => {
  const net = computeNetFees(student);
  const paid = computePaidAmount(student);
  const remaining = net - paid;

  return (
    <div className="px-6 py-5 bg-slate-900/60 border-t border-slate-700/50 grid grid-cols-3 gap-6 text-sm">
      {/* Personal */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-2">
          Personal Info
        </p>
        <div className="flex items-center gap-2 text-slate-300">
          <IconMail size={14} className="text-slate-500 shrink-0" />
          <span className="truncate">{student.email}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <IconPhone size={14} className="text-slate-500 shrink-0" />
          <span>{student.contactNo}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <IconUser size={14} className="text-slate-500 shrink-0" />
          <span className="capitalize">{student.gender}</span>
        </div>
        <div className="flex items-start gap-2 text-slate-300">
          <IconSchool size={14} className="text-slate-500 shrink-0 mt-0.5" />
          <span>{student.schoolCollegeName}</span>
        </div>
        {student.reference && (
          <div className="flex items-center gap-2 text-slate-300">
            <IconShare size={14} className="text-slate-500 shrink-0" />
            <span>Ref: {student.reference}</span>
          </div>
        )}
        <div className="text-slate-500 text-xs">
          Registered:{" "}
          {new Date(student.registrationDate).toLocaleDateString("en-IN")}
        </div>
      </div>

      {/* Guardian */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-2">
          Guardian Info
        </p>
        {student.guardians.map((g) => (
          <div key={g.id} className="space-y-2">
            <div className="flex items-center gap-2 text-slate-300">
              <IconUser size={14} className="text-slate-500 shrink-0" />
              <span>
                {g.name}{" "}
                <span className="text-slate-500 text-xs">({g.relation})</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <IconPhone size={14} className="text-slate-500 shrink-0" />
              <span>{g.contact}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <IconMail size={14} className="text-slate-500 shrink-0" />
              <span className="truncate">{g.email}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Payment */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-2">
          Payment Details
        </p>
        <div className="bg-slate-800/60 rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-500">Total Fees</span>
            <span>{formatCurrency(student.totalFees)}</span>
          </div>
          {parseFloat(student.discountAmount) > 0 && (
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Discount</span>
              <span className="text-green-400">
                -{formatCurrency(student.discountAmount)}
              </span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-white border-t border-slate-700 pt-2">
            <span>Net Fees</span>
            <span>{formatCurrency(String(net))}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-500">Paid</span>
            <span className="text-blue-400">
              {formatCurrency(String(paid))}
            </span>
          </div>
          {remaining > 0 && (
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Remaining</span>
              <span className="text-yellow-400">
                {formatCurrency(String(remaining))}
              </span>
            </div>
          )}
        </div>

        {/* Installments */}
        {student.installments.filter((i) => i.amount).length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Installments</p>
            {student.installments
              .filter((i) => i.amount)
              .map((inst, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-xs text-slate-400 bg-slate-800/40 px-2 py-1 rounded"
                >
                  <span>
                    #{idx + 1}{" "}
                    {inst.date
                      ? new Date(inst.date).toLocaleDateString("en-IN")
                      : "—"}{" "}
                    {inst.mode && (
                      <span className="text-slate-500">· {inst.mode}</span>
                    )}
                  </span>
                  <span className="text-green-400">
                    {formatCurrency(inst.amount)}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Pagination Component
// ─────────────────────────────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (p: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  const start = (page - 1) * ROWS_PER_PAGE + 1;
  const end = Math.min(page * ROWS_PER_PAGE, totalItems);

  // Build page number array with ellipses
  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
      <span className="text-slate-500 text-xs">
        Showing {start}–{end} of{" "}
        <strong className="text-slate-400">{totalItems}</strong> students
      </span>

      <div className="flex items-center gap-1.5">
        {/* Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <IconChevronLeft size={15} />
        </button>

        {/* Page buttons */}
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-1 text-slate-600 text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`min-w-[32px] h-8 rounded-lg border text-xs font-medium transition-all ${
                p === page
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "border-slate-700 text-slate-400 hover:bg-slate-700/50"
              }`}
            >
              {p}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <IconChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Stats Bar
// ─────────────────────────────────────────────────────────────────────────────

const StatsBar: React.FC<{ students: Student[] }> = ({ students }) => {
  const total = students.length;
  const paid = students.filter(
    (s) => computePaymentStatus(s).label === "Paid",
  ).length;
  const outstanding = students.filter((s) =>
    ["Partial", "Pending", "Unpaid"].includes(computePaymentStatus(s).label),
  ).length;
  const totalRevenue = students.reduce((a, s) => a + computePaidAmount(s), 0);

  const stats = [
    { label: "Total Students", value: total, color: "text-white" },
    { label: "Fully Paid", value: paid, color: "text-green-400" },
    { label: "Outstanding", value: outstanding, color: "text-yellow-400" },
    {
      label: "Revenue Collected",
      value: `₹${(totalRevenue / 100000).toFixed(1)}L`,
      color: "text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-5">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3"
        >
          <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
          <div className="text-xs text-slate-500 mt-0.5 uppercase tracking-wide">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

const UsersList: React.FC = () => {
  const navigate = useNavigate();

  // ── Tab state ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<TabType>("students");

  // ── Filter / search state ─────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");

  // ── Pagination state ──────────────────────────────────────────────────────
  const [page, setPage] = useState(1);

  // ── Expand state ──────────────────────────────────────────────────────────
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // ── Derive unique branch options from data ────────────────────────────────
  const branchOptions = useMemo(
    () => ["All", ...Array.from(new Set(sampleStudents.map((s) => s.branch)))],
    [],
  );

  // ── Filtered students ─────────────────────────────────────────────────────
  const filteredStudents = useMemo(() => {
    return sampleStudents.filter((s) => {
      const fullName =
        `${s.firstName} ${s.middleName} ${s.surname}`.toLowerCase();
      const matchSearch =
        search === "" ||
        fullName.includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.contactNo.includes(search);

      const matchSubject =
        subjectFilter === "All" || s.subject === subjectFilter;
      const matchBranch = branchFilter === "All" || s.branch === branchFilter;
      const matchStatus =
        statusFilter === "All" ||
        computePaymentStatus(s).label === statusFilter;

      return matchSearch && matchSubject && matchBranch && matchStatus;
    });
  }, [search, subjectFilter, statusFilter, branchFilter]);

  const totalPages = Math.ceil(filteredStudents.length / ROWS_PER_PAGE);

  const paginatedStudents = useMemo(
    () =>
      filteredStudents.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE),
    [filteredStudents, page],
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAddUser = () => {
    navigate(
      activeTab === "students" ? "/Users/add-student" : "/Users/add-teacher",
    );
  };

  const handleFilterChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setter(e.target.value);
      setPage(1);
    };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    setExpandedId(null); // close any open row when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Users</h2>
          <p className="text-slate-400 text-sm">Manage students and teachers</p>
        </div>
        <button
          onClick={handleAddUser}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all hover:scale-110"
          title={`Add ${activeTab === "students" ? "Student" : "Teacher"}`}
        >
          <IconPlus size={22} />
        </button>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <div className="flex gap-8 border-b border-slate-700">
        {(["students", "teachers", "archives"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => tab !== "archives" && setActiveTab(tab as TabType)}
            className={`pb-3 px-2 font-medium capitalize transition-all text-sm ${
              activeTab === tab
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          STUDENTS TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "students" && (
        <>
          {/* Stats bar (updates live with filters) */}
          <StatsBar students={filteredStudents} />

          {/* ── Search + Filter controls ──────────────────────────────────── */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <IconSearch
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search name, email or phone…"
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-orange-500/60 transition-colors"
              />
            </div>

            {/* Subject filter */}
            <select
              value={subjectFilter}
              onChange={handleFilterChange(setSubjectFilter)}
              className="bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-orange-500/60 cursor-pointer"
            >
              {SUBJECT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "All" ? "All Subjects" : opt}
                </option>
              ))}
            </select>

            {/* Branch filter */}
            <select
              value={branchFilter}
              onChange={handleFilterChange(setBranchFilter)}
              className="bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-orange-500/60 cursor-pointer"
            >
              {branchOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "All" ? "All Branches" : opt}
                </option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={handleFilterChange(setStatusFilter)}
              className="bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-orange-500/60 cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "All" ? "All Statuses" : opt}
                </option>
              ))}
            </select>

            {/* Clear filters */}
            {(search ||
              subjectFilter !== "All" ||
              statusFilter !== "All" ||
              branchFilter !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setSubjectFilter("All");
                  setStatusFilter("All");
                  setBranchFilter("All");
                  setPage(1);
                }}
                className="text-xs text-orange-400 hover:text-orange-300 px-3 py-2.5 rounded-xl border border-orange-500/30 hover:border-orange-500/60 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Results info */}
          <p className="text-slate-500 text-xs -mt-2">
            Showing{" "}
            {filteredStudents.length === 0 ? 0 : (page - 1) * ROWS_PER_PAGE + 1}
            –{Math.min(page * ROWS_PER_PAGE, filteredStudents.length)} of{" "}
            <strong className="text-slate-400">
              {filteredStudents.length}
            </strong>{" "}
            students
            {filteredStudents.length !== sampleStudents.length &&
              ` (filtered from ${sampleStudents.length} total)`}
          </p>

          {/* ── Table ──────────────────────────────────────────────────────── */}
          <div className="rounded-xl overflow-hidden border border-slate-700/70">
            {/* Table Header */}
            <div className="bg-slate-800/60 px-6 py-3 grid grid-cols-12 gap-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <div className="col-span-3">Student</div>
              <div className="col-span-2">Course / Subject</div>
              <div className="col-span-1">Std</div>
              <div className="col-span-2">Contact</div>
              <div className="col-span-1">Payment</div>
              <div className="col-span-2">Fees (Net)</div>
              <div className="col-span-1">Actions</div>
            </div>

            <div className="divide-y divide-slate-700/50 bg-slate-800/30">
              {paginatedStudents.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <IconFilter size={32} className="mx-auto mb-3 opacity-30" />
                  <p>No students match your filters.</p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setSubjectFilter("All");
                      setStatusFilter("All");
                      setBranchFilter("All");
                      setPage(1);
                    }}
                    className="mt-2 text-orange-400 text-sm hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                paginatedStudents.map((student) => {
                  const fullName =
                    `${student.firstName} ${student.middleName} ${student.surname}`.trim();
                  const payStatus = computePaymentStatus(student);
                  const net = computeNetFees(student);
                  const isExpanded = expandedId === student.id;

                  return (
                    <div key={student.id}>
                      {/* Main Row */}
                      <div
                        className="grid grid-cols-12 gap-3 px-6 py-4 hover:bg-slate-700/20 transition-colors items-center cursor-pointer"
                        onClick={() => toggleExpand(student.id)}
                      >
                        {/* Name + Avatar */}
                        <div className="col-span-3 flex items-center gap-3 min-w-0">
                          {student.photo ? (
                            <img
                              src={student.photo}
                              alt={fullName}
                              className="w-10 h-10 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm ${getAvatarColor(student.id)}`}
                            >
                              {getInitials(student.firstName, student.surname)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-white font-medium text-sm truncate">
                              {fullName}
                            </p>
                            <p className="text-slate-500 text-xs truncate">
                              {student.email}
                            </p>
                          </div>
                        </div>

                        {/* Course */}
                        <div className="col-span-2">
                          <p className="text-slate-300 text-sm">
                            {student.courseType}
                          </p>
                          <p className="text-slate-500 text-xs">
                            {student.subject}
                          </p>
                        </div>

                        {/* Standard */}
                        <div className="col-span-1">
                          <span className="text-slate-300 text-sm font-medium">
                            Std {student.standard}
                          </span>
                        </div>

                        {/* Contact */}
                        <div className="col-span-2">
                          <p className="text-slate-300 text-sm flex items-center gap-1">
                            <IconPhone size={12} className="text-slate-500" />
                            {student.contactNo}
                          </p>
                          <p className="text-slate-500 text-xs mt-0.5">
                            {student.branch}
                          </p>
                        </div>

                        {/* Payment Status */}
                        <div className="col-span-1">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${payStatus.color}`}
                          >
                            {payStatus.label}
                          </span>
                        </div>

                        {/* Fees */}
                        <div className="col-span-2">
                          <p className="text-white text-sm font-semibold">
                            {formatCurrency(String(net))}
                          </p>
                          {parseFloat(student.discountAmount) > 0 && (
                            <p className="text-green-400 text-xs">
                              -{formatCurrency(student.discountAmount)} off
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div
                          className="col-span-1 flex gap-1 items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              navigate(`/Users/edit-student/${student.id}`)
                            }
                            className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <IconPencil size={15} className="text-slate-400" />
                          </button>
                          <button
                            onClick={() => toggleExpand(student.id)}
                            className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors"
                            title="Details"
                          >
                            {isExpanded ? (
                              <IconChevronUp
                                size={15}
                                className="text-orange-400"
                              />
                            ) : (
                              <IconChevronDown
                                size={15}
                                className="text-slate-400"
                              />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Detail Row */}
                      {isExpanded && <StudentExpandedRow student={student} />}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Pagination ─────────────────────────────────────────────────── */}
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={filteredStudents.length}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TEACHERS TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "teachers" && (
        <div className="rounded-xl overflow-hidden border border-slate-700/70">
          {/* Header */}
          <div className="bg-slate-800/60 px-6 py-3 grid grid-cols-12 gap-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <div className="col-span-4">Teacher</div>
            <div className="col-span-2">Subject</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Joined</div>
            <div className="col-span-1">Students</div>
            <div className="col-span-1">Actions</div>
          </div>

          <div className="divide-y divide-slate-700/50 bg-slate-800/30">
            {sampleTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-700/20 transition-colors items-center"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    className="w-10 h-10 rounded-full bg-orange-500"
                  />
                  <span className="text-white font-medium text-sm">
                    {teacher.name}
                  </span>
                </div>
                <div className="col-span-2 text-slate-300 text-sm">
                  {teacher.subject}
                </div>
                <div className="col-span-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400">
                    {teacher.status}
                  </span>
                </div>
                <div className="col-span-2 text-slate-300 text-sm">
                  {teacher.joined}
                </div>
                <div className="col-span-1 text-slate-300 text-sm">
                  {teacher.students}
                </div>
                <div className="col-span-1 flex gap-1">
                  <button
                    onClick={() =>
                      navigate(`/Users/edit-teacher/${teacher.id}`)
                    }
                    className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors"
                    title="Edit teacher"
                  >
                    <IconPencil size={15} className="text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors">
                    <IconShare size={15} className="text-slate-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
