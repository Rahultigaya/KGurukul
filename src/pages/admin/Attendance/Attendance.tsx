// src/pages/admin/Attendance/Attendance.tsx

import React, { useState } from "react";
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
    <div className="rounded-2xl p-4 flex items-center gap-3">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm opacity-70">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6" style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "var(--accent-purple)" }}
          >
            <IconCalendarCheck size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Attendance Management
            </h1>
            <p className="text-sm font-bold text-secondary">
              Mark and manage student attendance
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<IconUsers size={24} className="text-blue-400" />}
          label="Total Students"
          value={attendanceData.length}
          color="text-blue-400"
          bgColor="bg-blue-500/15"
        />
        <StatCard
          icon={<IconCheck size={24} className="text-green-400" />}
          label="Present"
          value={`${presentCount} (${Math.round((presentCount / attendanceData.length) * 100)}%)`}
          color="text-green-400"
          bgColor="bg-green-500/15"
        />
        <StatCard
          icon={<IconX size={24} className="text-red-400" />}
          label="Absent"
          value={`${absentCount} (${Math.round((absentCount / attendanceData.length) * 100)}%)`}
          color="text-red-400"
          bgColor="bg-red-500/15"
        />
      </div>

      {/* Filters */}
      <div
        className="rounded-2xl p-4 flex flex-wrap gap-4 items-center"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)" }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <IconSearch size={20} className="opacity-50" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none"
            style={{ color: "var(--text-primary)" }}
          />
        </div>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 rounded-lg border outline-none"
          style={{
            background: "var(--bg-tertiary)",
            borderColor: "var(--border-default)",
            color: "var(--text-primary)",
          }}
        />

        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="px-4 py-2 rounded-lg border outline-none cursor-pointer"
          style={{
            background: "var(--bg-tertiary)",
            borderColor: "var(--border-default)",
            color: "var(--text-primary)",
          }}
        >
          <option value="">All Batches</option>
          {batches.map(batch => (
            <option key={batch.id} value={batch.id}>{batch.name}</option>
          ))}
        </select>

        <button
          onClick={markAllPresent}
          className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors flex items-center gap-2"
        >
          <IconCheck size={18} />
          Mark All Present
        </button>

        <button
          onClick={markAllAbsent}
          className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-2"
        >
          <IconX size={18} />
          Mark All Absent
        </button>
      </div>

      {/* Students List */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--border-default)" }}
      >
        <div
          className="grid grid-cols-12 gap-4 p-4 font-semibold"
          style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-default)" }}
        >
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
              className="grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-white/5"
              style={{ borderBottom: "1px solid var(--border-default)" }}
            >
              <div className="col-span-1 font-mono text-sm opacity-70">{student.rollNo}</div>
              <div className="col-span-5" style={{ color: "var(--text-primary)" }}>
                {student.name}
              </div>
              <div className="col-span-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    student.status === "present"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {student.status === "present" ? "Present" : "Absent"}
                </span>
              </div>
              <div className="col-span-3 text-right">
                <button
                  onClick={() => toggleAttendance(student.id)}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ml-auto ${
                    student.status === "present"
                      ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  }`}
                >
                  {student.status === "present" ? (
                    <>
                      <IconX size={18} />
                      Mark Absent
                    </>
                  ) : (
                    <>
                      <IconCheck size={18} />
                      Mark Present
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Overall Percentage */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)" }}
      >
        <div className="flex items-center justify-center gap-4 mb-2">
          <IconClock size={24} className="opacity-70" />
          <span className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Overall Attendance: {attendancePercentage}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "var(--bg-tertiary)" }}>
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${attendancePercentage}%`,
              background: attendancePercentage >= 75
                ? "#22c55e"
                : attendancePercentage >= 50
                ? "#eab308"
                : "#ef4444"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Attendance;
