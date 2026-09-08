// src/pages/attendance/StudentAttendance.tsx
import React, { useState, useEffect } from "react";
import { PageHeader } from "../../components/PageHeader";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  IconCalendarCheck,
  IconCalendarEvent,
  IconCheck,
  IconX,
  IconClock,
  IconBook,
  IconChartPie,
  IconInfoCircle,
} from "@tabler/icons-react";

interface AttendanceRecord {
  id: number;
  date: string;
  day: string;
  subject: string;
  batch: string;
  time: string;
  status: "Present" | "Absent" | "Late";
  remark?: string;
}

const mockAttendanceList: AttendanceRecord[] = [
  {
    id: 1,
    date: "2026-09-08",
    day: "Tuesday",
    subject: "Computer Science (Python & DSA)",
    batch: "Morning Batch A",
    time: "09:00 AM - 10:30 AM",
    status: "Present",
    remark: "Regular class",
  },
  {
    id: 2,
    date: "2026-09-07",
    day: "Monday",
    subject: "Web Development (React & Node.js)",
    batch: "Regular Batch B",
    time: "11:00 AM - 12:30 PM",
    status: "Present",
    remark: "Hands-on lab",
  },
  {
    id: 3,
    date: "2026-09-05",
    day: "Saturday",
    subject: "Database Management Systems",
    batch: "Weekend Batch C",
    time: "10:00 AM - 01:00 PM",
    status: "Present",
    remark: "SQL Workshop",
  },
  {
    id: 4,
    date: "2026-09-04",
    day: "Friday",
    subject: "Mathematics for Computing",
    batch: "Morning Batch A",
    time: "09:00 AM - 10:30 AM",
    status: "Absent",
    remark: "Sick leave reported",
  },
  {
    id: 5,
    date: "2026-09-03",
    day: "Thursday",
    subject: "Computer Science (Python & DSA)",
    batch: "Morning Batch A",
    time: "09:00 AM - 10:30 AM",
    status: "Present",
    remark: "Regular class",
  },
  {
    id: 6,
    date: "2026-09-02",
    day: "Wednesday",
    subject: "Web Development (React & Node.js)",
    batch: "Regular Batch B",
    time: "11:00 AM - 12:30 PM",
    status: "Late",
    remark: "Joined 10 mins late",
  },
  {
    id: 7,
    date: "2026-09-01",
    day: "Tuesday",
    subject: "Database Management Systems",
    batch: "Weekend Batch C",
    time: "09:00 AM - 10:30 AM",
    status: "Present",
    remark: "Regular class",
  },
  {
    id: 8,
    date: "2026-08-31",
    day: "Monday",
    subject: "Mathematics for Computing",
    batch: "Morning Batch A",
    time: "09:00 AM - 10:30 AM",
    status: "Present",
    remark: "Unit test review",
  },
  {
    id: 9,
    date: "2026-08-29",
    day: "Saturday",
    subject: "Computer Science (Python & DSA)",
    batch: "Morning Batch A",
    time: "10:00 AM - 01:00 PM",
    status: "Present",
    remark: "Special session",
  },
  {
    id: 10,
    date: "2026-08-28",
    day: "Friday",
    subject: "Web Development (React & Node.js)",
    batch: "Regular Batch B",
    time: "11:00 AM - 12:30 PM",
    status: "Present",
    remark: "Project review",
  },
];

const subjectStats = [
  { name: "Computer Science (Python & DSA)", total: 18, attended: 17, pct: 94 },
  { name: "Web Development (React & Node.js)", total: 16, attended: 15, pct: 93 },
  { name: "Database Management Systems", total: 12, attended: 12, pct: 100 },
  { name: "Mathematics for Computing", total: 14, attended: 12, pct: 86 },
];

const StudentAttendance: React.FC = () => {
  const [studentName, setStudentName] = useState("Student");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("userData");
      if (stored) {
        const parsed = JSON.parse(stored);
        setStudentName(parsed.name || parsed.full_name || parsed.username || "Student");
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const filteredRecords = mockAttendanceList.filter((item) => {
    const matchesSub = selectedSubject === "All" || item.subject === selectedSubject;
    const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;
    return matchesSub && matchesStatus;
  });

  const totalClasses = mockAttendanceList.length;
  const presentCount = mockAttendanceList.filter((i) => i.status === "Present").length;
  const absentCount = mockAttendanceList.filter((i) => i.status === "Absent").length;
  const lateCount = mockAttendanceList.filter((i) => i.status === "Late").length;
  const overallPercentage = Math.round(((presentCount + lateCount * 0.5) / totalClasses) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <PageHeader
        title="My Attendance"
        subtitle={`Track your daily attendance record and subject-wise lecture consistency, ${studentName}`}
      />

      {/* ── KPI Summary Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Rate */}
        <Card elevation={1} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm">
          <CardContent className="!p-5 flex items-center justify-between">
            <div>
              <p className="text-2xl font-black text-blue-600">{overallPercentage}%</p>
              <p className="text-xs font-semibold text-slate-500">Overall Attendance</p>
              <span className="inline-block mt-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Above 75% Criteria
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <IconChartPie size={26} />
            </div>
          </CardContent>
        </Card>

        {/* Present Sessions */}
        <Card elevation={1} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm">
          <CardContent className="!p-5 flex items-center justify-between">
            <div>
              <p className="text-2xl font-black text-emerald-600">{presentCount}</p>
              <p className="text-xs font-semibold text-slate-500">Attended Sessions</p>
              <span className="inline-block mt-1 text-[10px] font-bold text-slate-500">
                Out of {totalClasses} classes
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IconCheck size={26} />
            </div>
          </CardContent>
        </Card>

        {/* Absent */}
        <Card elevation={1} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm">
          <CardContent className="!p-5 flex items-center justify-between">
            <div>
              <p className="text-2xl font-black text-rose-600">{absentCount}</p>
              <p className="text-xs font-semibold text-slate-500">Absent Days</p>
              <span className="inline-block mt-1 text-[10px] font-bold text-slate-400">
                Approved leaves: {absentCount}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <IconX size={26} />
            </div>
          </CardContent>
        </Card>

        {/* Late / Grace */}
        <Card elevation={1} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm">
          <CardContent className="!p-5 flex items-center justify-between">
            <div>
              <p className="text-2xl font-black text-amber-600">{lateCount}</p>
              <p className="text-xs font-semibold text-slate-500">Late Check-ins</p>
              <span className="inline-block mt-1 text-[10px] font-bold text-amber-600">
                Grace period utilized
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <IconClock size={26} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Subject Breakdown Row ────────────────────────────────────────── */}
      <Card elevation={1} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm">
        <CardContent className="!p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <IconBook size={20} className="text-blue-600" />
            <Typography variant="subtitle1" className="!font-bold text-slate-800">
              Subject-wise Attendance Distribution
            </Typography>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjectStats.map((sub, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-xs font-bold text-slate-800 line-clamp-2 h-8">
                    {sub.name}
                  </p>
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded-md ${
                      sub.pct >= 90
                        ? "bg-emerald-100 text-emerald-800"
                        : sub.pct >= 75
                        ? "bg-blue-100 text-blue-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {sub.pct}%
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-semibold mb-1.5 flex justify-between">
                  <span>Attended:</span>
                  <span className="text-slate-800 font-bold">
                    {sub.attended} / {sub.total}
                  </span>
                </div>
                <LinearProgress
                  variant="determinate"
                  value={sub.pct}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: "#e2e8f0",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: sub.pct >= 90 ? "#16a34a" : sub.pct >= 75 ? "#2563eb" : "#e11d48",
                      borderRadius: 3,
                    },
                  }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Attendance History Log ────────────────────────────────────────── */}
      <Card elevation={1} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Header with Filters */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <IconCalendarCheck size={18} />
            </div>
            <div>
              <Typography variant="h6" className="!font-bold text-slate-800 !text-base">
                Daily Attendance History
              </Typography>
              <Typography variant="caption" className="text-slate-400 block">
                Detailed records of past class attendance
              </Typography>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap w-full md:w-auto">
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Filter Subject</InputLabel>
              <Select
                value={selectedSubject}
                label="Filter Subject"
                onChange={(e) => setSelectedSubject(e.target.value)}
                sx={{ bgcolor: "#ffffff", borderRadius: "10px" }}
              >
                <MenuItem value="All">All Subjects</MenuItem>
                <MenuItem value="Computer Science (Python & DSA)">Computer Science (Python & DSA)</MenuItem>
                <MenuItem value="Web Development (React & Node.js)">Web Development (React & Node.js)</MenuItem>
                <MenuItem value="Database Management Systems">Database Management Systems</MenuItem>
                <MenuItem value="Mathematics for Computing">Mathematics for Computing</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={selectedStatus}
                label="Status"
                onChange={(e) => setSelectedStatus(e.target.value)}
                sx={{ bgcolor: "#ffffff", borderRadius: "10px" }}
              >
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
                <MenuItem value="Late">Late</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        {/* Table Content */}
        <CardContent className="!p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 text-xs uppercase font-bold tracking-wider">
                  <th className="py-3.5 px-6">Date & Day</th>
                  <th className="py-3.5 px-6">Subject</th>
                  <th className="py-3.5 px-6">Batch & Slot</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                  <th className="py-3.5 px-6">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <IconCalendarEvent size={18} className="text-slate-400" />
                          <div>
                            <p className="font-bold text-slate-800">{item.date}</p>
                            <p className="text-xs text-slate-400 font-medium">{item.day}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-800">{item.subject}</p>
                      </td>

                      <td className="py-4 px-6">
                        <p className="text-xs font-semibold text-slate-700">{item.batch}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <IconClock size={13} /> {item.time}
                        </p>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <Chip
                          label={item.status}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            borderRadius: "8px",
                            height: "24px",
                            bgcolor:
                              item.status === "Present"
                                ? "#f0fdf4"
                                : item.status === "Absent"
                                ? "#fef2f2"
                                : "#fffbeb",
                            color:
                              item.status === "Present"
                                ? "#15803d"
                                : item.status === "Absent"
                                ? "#b91c1c"
                                : "#b45309",
                            border: `1px solid ${
                              item.status === "Present"
                                ? "#bbf7d0"
                                : item.status === "Absent"
                                ? "#fecaca"
                                : "#fde68a"
                            }`,
                          }}
                        />
                      </td>

                      <td className="py-4 px-6 text-slate-600 text-xs">
                        <span className="flex items-center gap-1.5">
                          <IconInfoCircle size={14} className="text-slate-400" />
                          {item.remark || "—"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400 text-sm">
                      No attendance records found matching your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAttendance;
