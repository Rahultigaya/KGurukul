// src\pages\admin\Users\UserList.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable, { type TableColumn } from "react-data-table-component";
import {
  IconPlus,
  IconPencil,
  IconShare,
  IconPhone,
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
  return isNaN(n) ? "—" : `₹${n.toLocaleString("en-IN")}`;
};

const computeNetFees = (s: Student) =>
  (parseFloat(s.totalFees) || 0) - (parseFloat(s.discountAmount) || 0);

const computePaidAmount = (s: Student) =>
  s.installments.reduce(
    (acc, i) => acc + (parseFloat(i.amount) || 0),
    parseFloat(s.fullPayment.amount) || 0,
  );

const computePaymentStatus = (s: Student) => {
  if (s.paymentType === "later")
    return { label: "Pending", color: "text-yellow-400 bg-yellow-500/10" };
  const paid = computePaidAmount(s);
  const net = computeNetFees(s);
  if (paid >= net)
    return { label: "Paid", color: "text-green-400 bg-green-500/10" };
  if (paid > 0)
    return { label: "Partial", color: "text-blue-400 bg-blue-500/10" };
  return { label: "Unpaid", color: "text-red-400 bg-red-500/10" };
};

// ─────────────────────────────────────────────────────────────────────────────
// Sample Data
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
  {
    id: 4,
    photo: null,
    registrationDate: "2026-02-10",
    subject: "Biology",
    branch: "Pune Main",
    courseType: "Regular",
    reference: "Friend",
    surname: "Deshmukh",
    firstName: "Sneha",
    middleName: "Vilas",
    gender: "female",
    email: "sneha.deshmukh@email.com",
    contactNo: "9123456780",
    address: "Karve Nagar, Pune",
    schoolCollegeName: "Modern College",
    standard: "12",
    guardians: [
      {
        id: "1",
        name: "Vilas Deshmukh",
        email: "vilas@email.com",
        contact: "9123456700",
        relation: "Father",
      },
    ],
    paymentType: "full",
    totalFees: "42000",
    discountAmount: "2000",
    fullPayment: {
      amount: "40000",
      date: "2026-02-10",
      mode: "Cash",
      bankName: "",
      paidTo: "Admin",
    },
    installments: [],
  },
  {
    id: 5,
    photo: null,
    registrationDate: "2026-02-12",
    subject: "Mathematics",
    branch: "Pune West",
    courseType: "Crash (Backlog)",
    reference: "Instagram",
    surname: "Kulkarni",
    firstName: "Aditya",
    middleName: "Suresh",
    gender: "male",
    email: "aditya.k@email.com",
    contactNo: "9988776655",
    address: "Aundh, Pune",
    schoolCollegeName: "MIT College",
    standard: "11",
    guardians: [
      {
        id: "1",
        name: "Suresh Kulkarni",
        email: "suresh@email.com",
        contact: "9988776600",
        relation: "Father",
      },
    ],
    paymentType: "installment",
    totalFees: "45000",
    discountAmount: "5000",
    fullPayment: { amount: "", date: "", mode: "", bankName: "", paidTo: "" },
    installments: [
      {
        amount: "20000",
        date: "2026-02-12",
        mode: "UPI",
        bankName: "",
        paidTo: "Admin",
      },
    ],
  },
  {
    id: 6,
    photo: null,
    registrationDate: "2026-02-08",
    subject: "Physics",
    branch: "Pune East",
    courseType: "Regular",
    reference: "",
    surname: "Yadav",
    firstName: "Rohit",
    middleName: "Kiran",
    gender: "male",
    email: "rohit.y@email.com",
    contactNo: "9871234560",
    address: "Hadapsar, Pune",
    schoolCollegeName: "DY Patil College",
    standard: "12",
    guardians: [
      {
        id: "1",
        name: "Kiran Yadav",
        email: "kiran@email.com",
        contact: "9871234500",
        relation: "Father",
      },
    ],
    paymentType: "later",
    totalFees: "48000",
    discountAmount: "3000",
    fullPayment: { amount: "", date: "", mode: "", bankName: "", paidTo: "" },
    installments: [],
  },
  {
    id: 7,
    photo: null,
    registrationDate: "2026-02-05",
    subject: "Chemistry",
    branch: "Pune Main",
    courseType: "Regular",
    reference: "Website",
    surname: "Jain",
    firstName: "Neha",
    middleName: "Raj",
    gender: "female",
    email: "neha.j@email.com",
    contactNo: "9090909090",
    address: "Shivajinagar, Pune",
    schoolCollegeName: "BMCC",
    standard: "11",
    guardians: [
      {
        id: "1",
        name: "Raj Jain",
        email: "raj@email.com",
        contact: "9090909000",
        relation: "Father",
      },
    ],
    paymentType: "full",
    totalFees: "39000",
    discountAmount: "1000",
    fullPayment: {
      amount: "38000",
      date: "2026-02-05",
      mode: "NEFT",
      bankName: "ICICI",
      paidTo: "Admin",
    },
    installments: [],
  },
  {
    id: 8,
    photo: null,
    registrationDate: "2026-02-14",
    subject: "Mathematics",
    branch: "Pune West",
    courseType: "Crash (Backlog)",
    reference: "Friend",
    surname: "More",
    firstName: "Akash",
    middleName: "Sunil",
    gender: "male",
    email: "akash.more@email.com",
    contactNo: "9345678901",
    address: "Wakad, Pune",
    schoolCollegeName: "Indira College",
    standard: "12",
    guardians: [
      {
        id: "1",
        name: "Sunil More",
        email: "sunil@email.com",
        contact: "9345678900",
        relation: "Father",
      },
    ],
    paymentType: "installment",
    totalFees: "47000",
    discountAmount: "2000",
    fullPayment: { amount: "", date: "", mode: "", bankName: "", paidTo: "" },
    installments: [
      {
        amount: "25000",
        date: "2026-02-14",
        mode: "Cash",
        bankName: "",
        paidTo: "Admin",
      },
    ],
  },
  {
    id: 9,
    photo: null,
    registrationDate: "2026-02-16",
    subject: "Biology",
    branch: "Pune East",
    courseType: "Regular",
    reference: "Online Ad",
    surname: "Kadam",
    firstName: "Pooja",
    middleName: "Ramesh",
    gender: "female",
    email: "pooja.k@email.com",
    contactNo: "9456781230",
    address: "Viman Nagar, Pune",
    schoolCollegeName: "Symbiosis College",
    standard: "11",
    guardians: [
      {
        id: "1",
        name: "Ramesh Kadam",
        email: "ramesh@email.com",
        contact: "9456781200",
        relation: "Father",
      },
    ],
    paymentType: "full",
    totalFees: "41000",
    discountAmount: "1000",
    fullPayment: {
      amount: "40000",
      date: "2026-02-16",
      mode: "UPI",
      bankName: "",
      paidTo: "Admin",
    },
    installments: [],
  },
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
// Dark theme — all icons, text, pagination visible on dark bg
// ─────────────────────────────────────────────────────────────────────────────

const dtStyles = {
  table: {
    style: { backgroundColor: "transparent" },
  },
  headRow: {
    style: {
      backgroundColor: "rgba(15,23,42,0.9)",
      borderBottomColor: "rgba(100,116,139,0.3)",
    },
  },
  headCells: {
    style: {
      color: "#e2e8f0",
    },
  },
  sortIcon: {
    style: {
      color: "#e2e8f0",
      fill: "#e2e8f0",
      opacity: 1,
    },
  },
  rows: {
    style: {
      backgroundColor: "rgba(15,23,42,0.6)",
    },
    highlightOnHoverStyle: {
      backgroundColor: "rgba(30,41,59,0.9)",
      borderBottomColor: "rgba(100,116,139,0.2)",
      outline: "none",
      cursor: "default",
    },
  },
  pagination: {
    style: {
      backgroundColor: "rgba(15,23,42,0.9)",
      borderTopColor: "rgba(100,116,139,0.3)",
      color: "#cbd5e1",
    },
    pageButtonsStyle: {
      fill: "#e2e8f0",
      "&:disabled": {
        fill: "rgba(148,163,184,0.25)",
      },
      "&:hover:not(:disabled)": {
        backgroundColor: "rgba(100,116,139,0.25)",
        fill: "#f97316",
      },
    },
  },
  noData: {
    style: { backgroundColor: "rgba(15,23,42,0.6)", color: "#64748b" },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

const UsersList: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("students");

  // ── Student columns ──────────────────────────────────────────────────────
  const studentColumns: TableColumn<Student>[] = [
    {
      name: "Student",
      sortable: true,
      selector: (row) => row.firstName,
      width: "220px",
      cell: (row) => {
        const fullName =
          `${row.firstName} ${row.middleName} ${row.surname}`.trim();
        return (
          <div className="flex items-center gap-3 py-1">
            {row.photo ? (
              <img
                src={row.photo}
                alt={fullName}
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
            ) : (
              <div
                className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-xs ${getAvatarColor(row.id)}`}
              >
                {getInitials(row.firstName, row.surname)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-white font-medium text-sm">{fullName}</p>
              <p className="text-slate-400 text-xs">{row.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      name: "Course / Subject",
      sortable: true,
      selector: (row) => row.courseType,
      cell: (row) => (
        <div>
          <p className="text-slate-200 text-sm">{row.courseType}</p>
          <p className="text-slate-400 text-xs">{row.subject}</p>
        </div>
      ),
    },
    {
      name: "Std",
      sortable: true,
      selector: (row) => row.standard,
      width: "80px",
      cell: (row) => (
        <span className="text-slate-200 text-sm font-medium">
          Std {row.standard}
        </span>
      ),
    },
    {
      name: "Contact",
      cell: (row) => (
        <div>
          <p className="text-slate-200 text-sm flex items-center gap-1">
            <IconPhone size={12} className="text-slate-400" /> {row.contactNo}
          </p>
          <p className="text-slate-400 text-xs mt-0.5">{row.branch}</p>
        </div>
      ),
    },
    {
      name: "Payment",
      sortable: true,
      selector: (row) => computePaymentStatus(row).label,
      cell: (row) => {
        const s = computePaymentStatus(row);
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.color}`}
          >
            {s.label}
          </span>
        );
      },
    },
    {
      name: "Fees (Net)",
      sortable: true,
      selector: (row) => computeNetFees(row),
      cell: (row) => {
        const net = computeNetFees(row);
        return (
          <div>
            <p className="text-white text-sm font-semibold">
              {formatCurrency(String(net))}
            </p>
            {parseFloat(row.discountAmount) > 0 && (
              <p className="text-green-400 text-xs">
                -{formatCurrency(row.discountAmount)} off
              </p>
            )}
          </div>
        );
      },
    },
    {
      name: "Actions",
      width: "80px",
      cell: (row) => (
        <button
          onClick={() => navigate(`/Users/edit-student/${row.id}`)}
          className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors"
          title="Edit"
        >
          <IconPencil
            size={15}
            className="text-slate-300 hover:text-orange-400"
          />
        </button>
      ),
    },
  ];

  // ── Teacher columns ──────────────────────────────────────────────────────
  const teacherColumns: TableColumn<Teacher>[] = [
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
          >
            <IconPencil
              size={15}
              className="text-slate-300 hover:text-orange-400"
            />
          </button>
          <button className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors">
            <IconShare
              size={15}
              className="text-slate-300 hover:text-orange-400"
            />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Users</h2>
            <p className="text-slate-400 text-sm">
              Manage students and teachers
            </p>
          </div>
          <button
            onClick={() =>
              navigate(
                activeTab === "students"
                  ? "/Users/add-student"
                  : "/Users/add-teacher",
              )
            }
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all hover:scale-110"
          >
            <IconPlus size={22} />
          </button>
        </div>

        {/* Tabs */}
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

        {/* DataTable */}
        <div className="rounded-xl overflow-hidden border border-slate-700/70">
          {activeTab === "students" && (
            <DataTable
              columns={studentColumns}
              data={sampleStudents}
              customStyles={dtStyles}
              sortIcon={
                <span style={{ color: "#e2e8f0", fontSize: 12, marginLeft: 4 }}>
                  ↕
                </span>
              }
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
              data={sampleTeachers}
              customStyles={dtStyles}
              sortIcon={
                <span style={{ color: "#e2e8f0", fontSize: 12, marginLeft: 4 }}>
                  ↕
                </span>
              }
              pagination
              paginationPerPage={10}
              highlightOnHover
              responsive
            />
          )}
        </div>
      </div>
    </>
  );
};

export default UsersList;
