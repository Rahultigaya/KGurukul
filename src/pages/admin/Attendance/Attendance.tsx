// src/pages/admin/Attendance/Attendance.tsx

import React, { useState } from "react";
import { Button } from "@mui/material";
import {
  IconCalendarCheck,
  IconUsers,
  IconSearch,
  IconCheck,
  IconX,
  IconClock,
} from "@tabler/icons-react";

const Attendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual API call
  const students = [
    { id: 1, name: "Rahul Sharma", rollNo: "STU001", status: "present" as const },
    { id: 2, name: "Priya Patel", rollNo: "STU002", status: "present" as const },
    { id: 3, name: "Amit Kumar", rollNo: "STU003", status: "absent" as const },
    { id: 4, name: "Sneha Reddy", rollNo: "STU004", status: "present" as const },
    { id: 5, name: "Vikram Singh", rollNo: "STU005", status: "absent" as const },
  ];

  const batches = [
    { id: "1", name: "Science 9th - A" },
    { id: "2", name: "Math 10th - B" },
    { id: "3", name: "Physics 11th - A" },
  ];

  const [attendanceData, setAttendanceData] = useState(students);

  const toggleAttendance = (studentId: number) => {
    setAttendanceData(prev =>
      prev.map(student =>
        student.id === studentId
          ? { ...student, status: student.status === "present" ? "absent" : "present" }
          : student
      )
    );
  };

  const markAllPresent = () => {
    setAttendanceData(prev => prev.map(s => ({ ...s, status: "present" as const })));
  };

  const markAllAbsent = () => {
    setAttendanceData(prev => prev.map(s => ({ ...s, status: "absent" as const })));
  };

  const presentCount = attendanceData.filter(s => s.status === "present").length;
  const absentCount = attendanceData.filter(s => s.status === "absent").length;
  const attendancePercentage = Math.round((presentCount / attendanceData.length) * 100);

  const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
    bgColor: string;
  }> = ({ icon, label, value, color, bgColor }) => (
    <div className="rounded-2xl p-4 flex items-center gap-3 bg-white border border-slate-200 shadow-sm">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-100 text-purple-600">
            <IconCalendarCheck size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Attendance Management
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Mark and manage student attendance
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<IconUsers size={24} className="text-blue-600" />}
          label="Total Students"
          value={attendanceData.length}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<IconCheck size={24} className="text-emerald-600" />}
          label="Present"
          value={`${presentCount} (${Math.round((presentCount / attendanceData.length) * 100)}%)`}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <StatCard
          icon={<IconX size={24} className="text-red-600" />}
          label="Absent"
          value={`${absentCount} (${Math.round((absentCount / attendanceData.length) * 100)}%)`}
          color="text-red-600"
          bgColor="bg-red-50"
        />
      </div>

      {/* Filters */}
      <div className="rounded-2xl p-4 flex flex-wrap gap-4 items-center bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          <IconSearch size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 placeholder-slate-400"
          />
        </div>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-200 outline-none text-sm bg-slate-50 text-slate-800"
        />

        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-200 outline-none text-sm bg-slate-50 text-slate-800 cursor-pointer"
        >
          <option value="">All Batches</option>
          {batches.map(batch => (
            <option key={batch.id} value={batch.id}>{batch.name}</option>
          ))}
        </select>

        <Button
          onClick={markAllPresent}
          startIcon={<IconCheck size={18} />}
          className="!bg-emerald-50 hover:!bg-emerald-100 !text-emerald-600 !border !border-emerald-200 !normal-case !rounded-xl !px-4 !py-2 !text-xs !font-semibold"
        >
          Mark All Present
        </Button>

        <Button
          onClick={markAllAbsent}
          startIcon={<IconX size={18} />}
          className="!bg-red-50 hover:!bg-red-100 !text-red-600 !border !border-red-200 !normal-case !rounded-xl !px-4 !py-2 !text-xs !font-semibold"
        >
          Mark All Absent
        </Button>
      </div>

      {/* Students List */}
      <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
        <div className="grid grid-cols-12 gap-4 p-4 font-semibold text-xs text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
          <div className="col-span-1">Roll No</div>
          <div className="col-span-5">Student Name</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-3 text-right">Action</div>
        </div>

        {attendanceData
          .filter(student =>
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((student) => (
            <div
              key={student.id}
              className="grid grid-cols-12 gap-4 p-4 items-center border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
            >
              <div className="col-span-1 font-mono text-xs text-slate-500 font-semibold">{student.rollNo}</div>
              <div className="col-span-5 text-sm font-semibold text-slate-800">
                {student.name}
              </div>
              <div className="col-span-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    student.status === "present"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-red-50 text-red-600 border border-red-200"
                  }`}
                >
                  {student.status === "present" ? "Present" : "Absent"}
                </span>
              </div>
              <div className="col-span-3 text-right">
                <Button
                  onClick={() => toggleAttendance(student.id)}
                  startIcon={student.status === "present" ? <IconX size={16} /> : <IconCheck size={16} />}
                  className={`!normal-case !text-xs !font-semibold !rounded-lg !px-3 !py-1.5 ${
                    student.status === "present"
                      ? "!bg-red-50 hover:!bg-red-100 !text-red-600 !border !border-red-200"
                      : "!bg-emerald-50 hover:!bg-emerald-100 !text-emerald-600 !border !border-emerald-200"
                  }`}
                >
                  {student.status === "present" ? "Mark Absent" : "Mark Present"}
                </Button>
              </div>
            </div>
          ))}
      </div>

      {/* Overall Percentage */}
      <div className="rounded-2xl p-6 text-center bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-center gap-2 mb-3">
          <IconClock size={20} className="text-slate-400" />
          <span className="text-base font-bold text-slate-800">
            Overall Attendance: {attendancePercentage}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden bg-slate-100">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${attendancePercentage}%`,
              background: attendancePercentage >= 75
                ? "#22c55e"
                : attendancePercentage >= 50
                ? "#f59e0b"
                : "#ef4444"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Attendance;

