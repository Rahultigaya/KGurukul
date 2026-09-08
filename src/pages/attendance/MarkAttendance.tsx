// src/pages/attendance/MarkAttendance.tsx
// Route: { path: "attendance/mark", element: <MarkAttendance /> }

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { PageHeader } from "../../components/PageHeader";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Autocomplete,
  Chip,
  Avatar,
  Tooltip,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  IconArrowLeft,
  IconUserPlus,
  IconUsers,
  IconDeviceFloppy,
  IconAlertCircle,
  IconCircleCheck,
  IconX,
  IconNote,
  IconRefresh,
  IconCheck,
  IconCalendar,
  IconHistory,
  IconSearch,
  IconChevronDown,
  IconClock,
  IconInfoCircle,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";
import Swal from "sweetalert2";
import { fetchWithAuth } from "../../api/common";
import { getAllBatches, getBatchesOnlyAPI, getBatchById, getBatchByIdAPI, cleanBatchName as cleanBatchNameHelper, type Batch, type AssignedStudent } from "../batches/batchStore";
import { studentCache, loadStudentCache, transformApiToFormData } from "../admin/Users/Student/studentStore";
import {
  getSession,
  saveSession,
  getBatchSessions,
  type AttendanceStatus,
  type StudentAttendance,
  type AttendanceSession,
} from "./attendanceStore";

const API_BASE_URL = "http://127.0.0.1:8000";

// ─────────────────────────────────────────────────────────────────────────────
// Fallback Demo Records (used when no data is returned from API or Store)
// ─────────────────────────────────────────────────────────────────────────────

export const FALLBACK_STUDENT = {
  id: "fallback-student-1",
  first_name: "Rahul",
  firstName: "Rahul",
  surname: "Sharma",
  roll_no: "101",
  rollNo: "101",
  standard: "10th",
  standard_name: "10th",
  subject: "Science",
  subject_name: "Science",
  email: "rahul.sharma@example.com",
  contact_no: "9876543210",
  contactNo: "9876543210",
};

export const FALLBACK_GUEST_STUDENT = {
  id: "fallback-student-2",
  first_name: "Priya",
  firstName: "Priya",
  surname: "Verma",
  roll_no: "102",
  rollNo: "102",
  standard: "10th",
  standard_name: "10th",
  subject: "Mathematics",
  subject_name: "Mathematics",
  email: "priya.verma@example.com",
  contact_no: "9876543211",
  contactNo: "9876543211",
};

export const FALLBACK_BATCH: Batch = {
  id: "fallback-batch-1",
  name: "10th Science - Mon (Demo)",
  type: "Regular",
  status: "Active",
  area: "Thane",
  branch: "Khopat",
  day: "Monday",
  timeSlot: "09:00 AM - 10:30 AM",
  subject: "Science",
  standard: "10th",
  capacity: 30,
  teacherId: "1",
  teacherName: "Demo Teacher",
  studentIds: ["fallback-student-1"],
  students: [
    {
      id: "fallback-student-1",
      name: "Rahul Sharma",
      firstName: "Rahul",
      surname: "Sharma",
      email: "rahul.sharma@example.com",
      contactNo: "9876543210",
      rollNo: "101",
      standard: "10th",
    },
  ],
  createdAt: new Date().toISOString(),
};

export const FALLBACK_GUEST_BATCH: Batch = {
  id: "fallback-batch-2",
  name: "10th Math - Tue (Demo)",
  type: "Regular",
  status: "Active",
  area: "Thane",
  branch: "Khopat",
  day: "Tuesday",
  timeSlot: "11:00 AM - 12:30 PM",
  subject: "Mathematics",
  standard: "10th",
  capacity: 30,
  teacherId: "2",
  teacherName: "Demo Teacher 2",
  studentIds: ["fallback-student-2"],
  students: [
    {
      id: "fallback-student-2",
      name: "Priya Verma",
      firstName: "Priya",
      surname: "Verma",
      email: "priya.verma@example.com",
      contactNo: "9876543211",
      rollNo: "102",
      standard: "10th",
    },
  ],
  createdAt: new Date().toISOString(),
};

// Pre-seed studentCache with fallback records
studentCache["fallback-student-1"] = FALLBACK_STUDENT as any;
studentCache["fallback-student-2"] = FALLBACK_GUEST_STUDENT as any;


/**
 * Direct API call to fetch all students (bypassing any in-memory cache check)
 * GET http://127.0.0.1:8000/students
 */
export async function fetchAllStudentsAPI(): Promise<any[]> {
  console.log(`[MarkAttendance API] Fetching all students: GET ${API_BASE_URL}/students`);
  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/students`);
    if (res.ok) {
      const json = await res.json();
      console.log(`[MarkAttendance API] GET /students response:`, json);
      const list = Array.isArray(json)
        ? json
        : Array.isArray(json.data)
          ? json.data
          : Array.isArray(json.students)
            ? json.students
            : [];

      list.forEach((s: any) => {
        const sId = String(s.id);
        studentCache[sId] = {
          ...transformApiToFormData(s),
          id: sId,
        };
      });
      return list;
    }
  } catch (err) {
    console.warn(`[MarkAttendance API] GET /students error:`, err);
  }
  return [];
}

/**
 * Fetch assigned students for a batch from backend API.
 * Calls: GET http://127.0.0.1:8000/batch/{batchId} (same endpoint as BatchAssign)
 */
export async function fetchBatchAssignedStudentsAPI(batchId: string | number): Promise<AssignedStudent[]> {
  const bId = String(batchId);
  console.log(`[MarkAttendance API] Fetching assigned users for batch: GET ${API_BASE_URL}/batch/${bId}`);
  try {
    const fullBatch = await getBatchByIdAPI(bId);
    if (fullBatch && fullBatch.students && fullBatch.students.length > 0) {
      console.log(`[MarkAttendance API] GET /batch/${bId} assigned students:`, fullBatch.students);
      return fullBatch.students;
    }
  } catch (err) {
    console.warn(`[MarkAttendance API] GET /batch/${bId} error:`, err);
  }
  return [];
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function toYMD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function fmtDate(d?: string | null): string {
  if (!d) return "–";
  try {
    const cleanStr = d.includes("T") ? d.split("T")[0] : d;
    const dateObj = new Date(cleanStr + "T00:00:00");
    if (isNaN(dateObj.getTime())) {
      const fallback = new Date(d);
      if (!isNaN(fallback.getTime())) {
        return fallback.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          weekday: "short",
        });
      }
      return d;
    }
    return dateObj.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      weekday: "short",
    });
  } catch {
    return d || "–";
  }
}

function fmtFullDate(d?: string | null): string {
  if (!d) return "–";
  try {
    const cleanStr = d.includes("T") ? d.split("T")[0] : d;
    const dateObj = new Date(cleanStr + "T00:00:00");
    if (isNaN(dateObj.getTime())) {
      const fallback = new Date(d);
      if (!isNaN(fallback.getTime())) {
        return fallback.toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
      return d;
    }
    return dateObj.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return d || "–";
  }
}

function getStudentName(id: string): string {
  const s = studentCache[id] as any;
  if (!s) {
    if (id === "fallback-student-1") return "Rahul Sharma";
    if (id === "fallback-student-2") return "Priya Verma";
    return `Student #${id}`;
  }
  return `${s.first_name || s.firstName || ""} ${s.surname || ""}`.trim() || `Student #${id}`;
}

function getStudentRollNo(id: string): string {
  const s = studentCache[id] as any;
  if (!s) {
    if (id === "fallback-student-1") return "101";
    if (id === "fallback-student-2") return "102";
    return "";
  }
  return s.roll_no || s.rollNo || "";
}

function getStudentStandard(id: string): string {
  const s = studentCache[id] as any;
  if (!s) {
    if (id === "fallback-student-1" || id === "fallback-student-2") return "10th";
    return "–";
  }
  if (typeof s.standard === "object" && s.standard?.name) return String(s.standard.name);
  return String(s.standard_name || s.standard || "–");
}

function getStudentSubject(id: string): string {
  const s = studentCache[id] as any;
  if (!s) {
    if (id === "fallback-student-1") return "Science";
    if (id === "fallback-student-2") return "Mathematics";
    return "–";
  }
  if (typeof s.subject === "object" && s.subject?.name) return String(s.subject.name);
  return String(s.subject_name || s.subject || "–");
}

function getInitials(id: string): string {
  const name = getStudentName(id);
  const parts = name.split(" ").filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
  return id.slice(0, 2).toUpperCase();
}

// Get all past occurrences of a given weekday (e.g. "Monday") up to today
const DAYS_MAP: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

function getPastDaysOfWeek(dayName: string, count = 10): string[] {
  const target = DAYS_MAP[dayName];
  if (target === undefined) return [];
  const results: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cur = new Date(today);
  while (cur.getDay() !== target) cur.setDate(cur.getDate() - 1);
  for (let i = 0; i < count; i++) {
    results.push(toYMD(new Date(cur)));
    cur.setDate(cur.getDate() - 7);
  }
  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// Status Button Component
// ─────────────────────────────────────────────────────────────────────────────

const StatusBtn: React.FC<{
  status: AttendanceStatus;
  active: boolean;
  onClick: () => void;
}> = ({ status, active, onClick }) => {
  const isPresent = status === "Present";

  return (
    <Button
      type="button"
      onClick={onClick}
      className={`!flex !items-center !gap-1.5 !px-3 !py-1.5 !rounded-xl !text-xs !font-bold transition-all !normal-case ${active
          ? isPresent
            ? "!bg-emerald-600 !text-white shadow-md scale-105"
            : "!bg-rose-600 !text-white shadow-md scale-105"
          : isPresent
            ? "!bg-white !text-slate-600 !border !border-slate-200 hover:!bg-emerald-50 hover:!text-emerald-700 hover:!border-emerald-300"
            : "!bg-white !text-slate-600 !border !border-slate-200 hover:!bg-rose-50 hover:!text-rose-700 hover:!border-rose-300"
        }`}
    >
      {isPresent ? <IconCheck size={14} stroke={2.5} /> : <IconX size={14} stroke={2.5} />}
      <span>{status}</span>
    </Button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// StudentRow Component (Regular Batch Student)
// ─────────────────────────────────────────────────────────────────────────────

const StudentRow: React.FC<{
  record: StudentAttendance;
  serialNo: number;
  onChange: (u: StudentAttendance) => void;
}> = ({ record, serialNo, onChange }) => {
  const [showRemark, setShowRemark] = useState(!!record.remark);
  const isAbsent = record.status === "Absent";

  return (
    <div
      className={`rounded-2xl p-3.5 transition-all border ${isAbsent
          ? "bg-rose-50/40 border-rose-200/80 shadow-sm"
          : "bg-white border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/40"
        }`}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        {/* Left: Serial + Avatar + Name info */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-bold text-slate-400 w-6 text-right shrink-0">
            {serialNo}.
          </span>

          <Avatar
            sx={{
              bgcolor: isAbsent ? "#fee2e2" : "#eff6ff",
              color: isAbsent ? "#dc2626" : "#2563eb",
              width: 36,
              height: 36,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {getInitials(record.studentId)}
          </Avatar>

          <div className="min-w-0">
            <Typography variant="body2" className="!font-bold text-slate-800 truncate">
              {getStudentName(record.studentId)}
            </Typography>
            <Typography variant="caption" className="text-slate-500 truncate block">
              {getStudentRollNo(record.studentId) ? `Roll #${getStudentRollNo(record.studentId)} · ` : ""}
              Std {getStudentStandard(record.studentId)} · {getStudentSubject(record.studentId)}
            </Typography>
            {record.remark && !showRemark && (
              <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg w-fit">
                <IconNote size={13} className="text-amber-600 shrink-0" />
                <span className="truncate max-w-[240px]">Remark: "{record.remark}"</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Status buttons + Big Prominent Remark Button */}
        <div className="flex items-center gap-2 shrink-0">
          <StatusBtn
            status="Present"
            active={record.status === "Present"}
            onClick={() => onChange({ ...record, status: "Present" })}
          />
          <StatusBtn
            status="Absent"
            active={record.status === "Absent"}
            onClick={() => onChange({ ...record, status: "Absent" })}
          />

          <Button
            type="button"
            onClick={() => setShowRemark((v) => !v)}
            title={showRemark ? "Hide remark field" : "Add or edit remark for student"}
            className={`!flex !items-center !gap-1.5 !px-3 !py-1.5 !rounded-xl !text-xs !font-bold transition-all !border shadow-sm !normal-case ${showRemark || record.remark
                ? "!bg-amber-500 !text-white !border-amber-500 shadow-md scale-105"
                : "!bg-amber-50 !text-amber-800 !border-amber-200 hover:!bg-amber-100 hover:!border-amber-300"
              }`}
          >
            <IconNote size={18} stroke={2.2} />
            <span>{record.remark ? "Edit Remark" : "+ Remark"}</span>
          </Button>
        </div>
      </div>

      {/* Expandable Remark Input */}
      {showRemark && (
        <div className="mt-3 pl-9 pr-2">
          <TextField
            placeholder="Write remark or note for this student (e.g., Late arrival, Homework pending, Fee reminder)…"
            value={record.remark || ""}
            onChange={(e) => onChange({ ...record, remark: e.target.value })}
            size="small"
            fullWidth
            multiline
            rows={1}
            autoFocus
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fffbeb",
                borderRadius: "12px",
                fontSize: "13px",
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GuestRow Component (Recovery Student from Another Batch)
// ─────────────────────────────────────────────────────────────────────────────

const GuestRow: React.FC<{
  record: StudentAttendance;
  serialNo: number;
  onChange: (u: StudentAttendance) => void;
  onRemove: () => void;
}> = ({ record, serialNo, onChange, onRemove }) => {
  const [showRemark, setShowRemark] = useState(!!record.remark);

  return (
    <div className="rounded-2xl p-3.5 transition-all bg-violet-50/50 border border-violet-200/80 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Serial + Avatar + Details */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-bold text-violet-400 w-6 text-right shrink-0">
            {serialNo}.
          </span>

          <Avatar
            sx={{
              bgcolor: "#ede9fe",
              color: "#7c3aed",
              width: 36,
              height: 36,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {getInitials(record.studentId)}
          </Avatar>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Typography variant="body2" className="!font-bold text-slate-800 truncate">
                {getStudentName(record.studentId)}
              </Typography>
              <Chip
                label="Guest / Recovery"
                size="small"
                color="secondary"
                sx={{ height: 20, fontSize: 10, fontWeight: 700 }}
              />
            </div>

            <Typography variant="caption" className="text-slate-500 block">
              Std {getStudentStandard(record.studentId)} · {getStudentSubject(record.studentId)}
            </Typography>

            {record.recoveryInfo && (
              <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-violet-100/80 text-violet-800 text-[11px] font-semibold border border-violet-200">
                <IconHistory size={13} />
                <span>
                  Missed <strong>{fmtDate(record.recoveryInfo.missedDate)}</strong> ·{" "}
                  {record.recoveryInfo.fromBatchName}
                </span>
              </div>
            )}

            {record.remark && !showRemark && (
              <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg w-fit">
                <IconNote size={13} className="text-amber-600 shrink-0" />
                <span className="truncate max-w-[240px]">Remark: "{record.remark}"</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Fixed Recovery Badge + Big Remark + Remove */}
        <div className="flex items-center gap-2 shrink-0">
          <Chip
            icon={<IconRefresh size={14} />}
            label="Recovery"
            color="secondary"
            variant="filled"
            size="small"
            sx={{ fontWeight: 700 }}
          />

          <Button
            type="button"
            onClick={() => setShowRemark((v) => !v)}
            title={showRemark ? "Hide remark field" : "Add or edit remark for recovery student"}
            className={`!flex !items-center !gap-1.5 !px-3 !py-1.5 !rounded-xl !text-xs !font-bold transition-all !border shadow-sm !normal-case ${showRemark || record.remark
                ? "!bg-amber-500 !text-white !border-amber-500 shadow-md scale-105"
                : "!bg-amber-50 !text-amber-800 !border-amber-200 hover:!bg-amber-100 hover:!border-amber-300"
              }`}
          >
            <IconNote size={18} stroke={2.2} />
            <span>{record.remark ? "Edit Remark" : "+ Remark"}</span>
          </Button>

          <Tooltip title="Remove from this session">
            <IconButton size="small" color="error" onClick={onRemove} className="hover:bg-red-50">
              <IconX size={16} />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {showRemark && (
        <div className="mt-3 pl-9 pr-2">
          <TextField
            placeholder="Add note for this recovery student…"
            value={record.remark || ""}
            onChange={(e) => onChange({ ...record, remark: e.target.value })}
            size="small"
            fullWidth
            multiline
            rows={1}
            autoFocus
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fffbeb",
                borderRadius: "12px",
                fontSize: "13px",
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// AddGuestPanel Component
// ─────────────────────────────────────────────────────────────────────────────

const AddGuestPanel: React.FC<{
  currentBatchId: string;
  existingStudentIds: string[];
  studentIds: string[];
  onAdd: (record: StudentAttendance) => void;
  onClose: () => void;
}> = ({ currentBatchId, existingStudentIds, studentIds, onAdd, onClose }) => {
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [remark, setRemark] = useState("");

  const localBatches = getAllBatches();
  const allBatches = localBatches.length > 0 ? localBatches : [FALLBACK_BATCH, FALLBACK_GUEST_BATCH];

  const candidateStudentIds = studentIds.filter((sid) => !existingStudentIds.includes(sid));

  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return [];
    return candidateStudentIds
      .filter(
        (sid) =>
          getStudentName(sid).toLowerCase().includes(q) ||
          getStudentStandard(sid).toLowerCase().includes(q) ||
          getStudentSubject(sid).toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [search, candidateStudentIds]);

  const studentBatches = useMemo(() => {
    if (!selectedStudent) return [];
    return allBatches.filter(
      (b) => b.studentIds.includes(selectedStudent) && b.id !== currentBatchId
    );
  }, [selectedStudent, allBatches, currentBatchId]);

  const batchDates = useMemo(() => {
    if (!selectedBatchId) return [];
    const b = getBatchById(selectedBatchId);
    if (!b) return [];
    return getPastDaysOfWeek(b.day, 10);
  }, [selectedBatchId]);

  const canAdd = Boolean(selectedStudent && selectedBatchId && selectedDate);

  const handleAdd = () => {
    if (!canAdd) return;
    const fromBatch = getBatchById(selectedBatchId!)!;
    onAdd({
      studentId: selectedStudent!,
      status: "Recovery",
      remark,
      recoveryInfo: {
        fromBatchId: fromBatch.id,
        fromBatchName: fromBatch.name,
        missedDate: selectedDate!,
      },
    });
  };

  return (
    <Card elevation={0} className="bg-violet-50/60 border border-violet-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-violet-200/60 pb-3">
        <div className="flex items-center gap-2">
          <Avatar sx={{ bgcolor: "#ede9fe", color: "#7c3aed", width: 32, height: 32 }}>
            <IconUserPlus size={16} />
          </Avatar>
          <Typography variant="subtitle1" className="!font-bold text-violet-950">
            Add Guest / Recovery Student
          </Typography>
        </div>
        <IconButton size="small" onClick={onClose}>
          <IconX size={16} />
        </IconButton>
      </div>

      {/* Step 1: Search Student */}
      <div className="space-y-1.5">
        <Typography variant="caption" className="!font-bold text-slate-600 uppercase tracking-wider">
          Step 1: Search Student
        </Typography>
        <TextField
          placeholder="Search student by name, standard, or subject…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedStudent(null);
            setSelectedBatchId(null);
            setSelectedDate(null);
          }}
          size="small"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <IconSearch size={16} className="text-slate-400 mr-2 shrink-0" />
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#ffffff",
              borderRadius: "12px",
            },
          }}
        />

        {search.length > 0 && (
          <div className="mt-2 bg-white rounded-xl border border-slate-200 shadow-md max-h-48 overflow-y-auto divide-y divide-slate-100">
            {filteredStudents.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 font-medium">
                No matching students found
              </div>
            ) : (
              filteredStudents.map((sid) => (
                <Button
                  key={sid}
                  type="button"
                  onClick={() => {
                    setSelectedStudent(sid);
                    setSearch(getStudentName(sid));
                    setSelectedBatchId(null);
                    setSelectedDate(null);
                  }}
                  className={`w-full !flex !items-center !justify-between !p-3 !text-left transition-colors hover:!bg-violet-50/50 !normal-case ${selectedStudent === sid ? "!bg-violet-50" : ""
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar sx={{ bgcolor: "#ede9fe", color: "#7c3aed", width: 28, height: 28, fontSize: 11, fontWeight: 700 }}>
                      {getInitials(sid)}
                    </Avatar>
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">
                        {getStudentName(sid)}
                      </span>
                      <span className="text-xs text-slate-500">
                        Std {getStudentStandard(sid)} · {getStudentSubject(sid)}
                      </span>
                    </div>
                  </div>
                  {selectedStudent === sid && <IconCheck size={16} className="text-violet-600" />}
                </Button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Step 2: Pick Original Batch */}
      {selectedStudent && (
        <div className="space-y-1.5 pt-1">
          <Typography variant="caption" className="!font-bold text-slate-600 uppercase tracking-wider">
            Step 2: Select Student's Original Batch
          </Typography>
          {studentBatches.length === 0 ? (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              This student has no other active assigned batch registered.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {studentBatches.map((b) => (
                <Button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setSelectedBatchId(b.id);
                    setSelectedDate(null);
                  }}
                  className={`!p-3 !rounded-xl !text-left !border transition-all flex items-center justify-between !normal-case ${selectedBatchId === b.id
                      ? "!bg-violet-100/70 !border-violet-400 shadow-sm"
                      : "!bg-white !border-slate-200 hover:!border-violet-300 hover:!bg-violet-50/30"
                    }`}
                >
                  <div>
                    <span className="text-sm font-bold text-slate-800 block truncate">
                      {cleanBatchNameHelper(b.name, [b.area, b.branch, b.day, b.timeSlot])}
                    </span>
                    <span className="text-xs text-slate-500">
                      {b.day} · {b.timeSlot}
                    </span>
                  </div>
                  {selectedBatchId === b.id && <IconCheck size={16} className="text-violet-700 shrink-0" />}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Pick Missed Date */}
      {selectedBatchId && (
        <div className="space-y-1.5 pt-1">
          <Typography variant="caption" className="!font-bold text-slate-600 uppercase tracking-wider">
            Step 3: Select Missed Lecture Date
          </Typography>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto pr-1">
            {batchDates.map((date) => {
              const isSelected = selectedDate === date;
              const d = new Date(date + "T00:00:00");
              return (
                <Button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`!p-2.5 !rounded-xl !text-left !border transition-all !normal-case ${isSelected
                      ? "!bg-violet-600 !text-white !border-violet-600 shadow-sm"
                      : "!bg-white !border-slate-200 !text-slate-700 hover:!border-violet-300"
                    }`}
                >
                  <span className={`text-xs font-bold block ${isSelected ? "text-white" : "text-slate-800"}`}>
                    {d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                  <span className={`text-[10px] block ${isSelected ? "text-violet-100" : "text-slate-400"}`}>
                    {d.toLocaleDateString("en-IN", { weekday: "short" })}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Remark Input */}
      {selectedDate && (
        <div className="space-y-1.5 pt-1">
          <Typography variant="caption" className="!font-bold text-slate-600 uppercase tracking-wider">
            Recovery Reason / Remark (Optional)
          </Typography>
          <TextField
            placeholder="e.g. Attending this batch to cover Chapter 2 from missed lecture"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            size="small"
            fullWidth
            multiline
            rows={1}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                fontSize: "13px",
              },
            }}
          />
        </div>
      )}

      {/* Add Button */}
      <div className="flex justify-end pt-2">
        <Button
          variant="contained"
          color="secondary"
          disabled={!canAdd}
          onClick={handleAdd}
          startIcon={<IconUserPlus size={16} />}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 700,
            px: 3,
            py: 1,
            bgcolor: "#7c3aed",
            "&:hover": { bgcolor: "#6d28d9" },
          }}
        >
          Add to Attendance
        </Button>
      </div>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MarkAttendance — Main Page Component
// ─────────────────────────────────────────────────────────────────────────────

const MarkAttendance: React.FC = () => {
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [markedBy, setMarkedBy] = useState("Admin");
  const [records, setRecords] = useState<StudentAttendance[]>([]);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [loadingBatchStudents, setLoadingBatchStudents] = useState(false);
  const [showGuest, setShowGuest] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [customDateInput, setCustomDateInput] = useState<string>("");
  const [dateValidationError, setDateValidationError] = useState<string | null>(null);
  const [datePage, setDatePage] = useState<number>(0);
  const DATES_PER_PAGE = 6;
  const attendanceSheetRef = React.useRef<HTMLDivElement>(null);

  // 1. Initial Load: Call batches API; fallback to local batches or demo fallback batch
  const fetchBatchesData = useCallback(() => {
    studentCache["fallback-student-1"] = FALLBACK_STUDENT as any;
    studentCache["fallback-student-2"] = FALLBACK_GUEST_STUDENT as any;
    setApiError(null);

    getBatchesOnlyAPI()
      .then((data) => {
        const active = data && data.length > 0 ? data.filter((b) => b.status === "Active") : [];
        if (active.length > 0) {
          setBatches(active);
        } else {
          const localActive = getAllBatches().filter((b) => b.status === "Active");
          setBatches(localActive.length > 0 ? localActive : [FALLBACK_BATCH]);
        }
      })
      .catch((err: any) => {
        const localActive = getAllBatches().filter((b) => b.status === "Active");
        setBatches(localActive.length > 0 ? localActive : [FALLBACK_BATCH]);
        setApiError(err?.message || "Network Error");
      });
  }, []);

  useEffect(() => {
    fetchBatchesData();
  }, [fetchBatchesData]);

  // When a batch is selected: load full batch details (GET /batch/{id}) to know assigned students
  useEffect(() => {
    if (!selectedBatchId) return;
    getBatchByIdAPI(selectedBatchId).then((fullBatch) => {
      if (fullBatch) {
        setBatches((prev) =>
          prev.map((b) => (b.id === fullBatch.id ? fullBatch : b))
        );
      }
    });
  }, [selectedBatchId]);


  // 3. Lazy-load all students ONLY when user opens "Add Guest / Recovery Student" panel
  useEffect(() => {
    if (showGuest) {
      loadStudentCache().then(() => {
        let keys = Object.keys(studentCache);
        if (!keys.includes("fallback-student-1")) {
          studentCache["fallback-student-1"] = FALLBACK_STUDENT as any;
          keys.push("fallback-student-1");
        }
        if (!keys.includes("fallback-student-2")) {
          studentCache["fallback-student-2"] = FALLBACK_GUEST_STUDENT as any;
          keys.push("fallback-student-2");
        }
        setStudentIds(keys);
      });
    }
  }, [showGuest]);

  const batch = selectedBatchId ? getBatchById(selectedBatchId) || batches.find((b) => b.id === selectedBatchId) || null : null;

  const cleanBatchName = useMemo(() => {
    if (!batch) return "Batch";
    return cleanBatchNameHelper(batch.name, [batch.area, batch.branch, batch.day, batch.timeSlot]);
  }, [batch]);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  // Past 52 occurrences (1 full year) for this batch's scheduled weekday
  const batchDatesAll = useMemo(() => {
    if (!batch) return [];
    const past52 = getPastDaysOfWeek(batch.day, 52);
    if (selectedDate && !past52.includes(selectedDate)) {
      return [selectedDate, ...past52];
    }
    return past52;
  }, [batch, selectedDate]);

  const totalDatePages = useMemo(() => {
    return Math.ceil(batchDatesAll.length / DATES_PER_PAGE) || 1;
  }, [batchDatesAll]);

  const visibleBatchDates = useMemo(() => {
    const start = datePage * DATES_PER_PAGE;
    return batchDatesAll.slice(start, start + DATES_PER_PAGE);
  }, [batchDatesAll, datePage]);

  const handleCustomDateSelect = (val: string) => {
    setCustomDateInput(val);
    if (!val) {
      setDateValidationError(null);
      return;
    }
    if (!batch) return;

    const targetDayNum = DAYS_MAP[batch.day];
    const chosenObj = new Date(val + "T00:00:00");
    if (isNaN(chosenObj.getTime())) {
      setDateValidationError("Invalid date format");
      return;
    }

    const chosenDayNum = chosenObj.getDay();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const chosenDayName = dayNames[chosenDayNum];

    if (chosenDayNum !== targetDayNum) {
      setDateValidationError(`Selected date is a ${chosenDayName}. This batch meets on ${batch.day}s only.`);
    } else {
      setDateValidationError(null);
      setSelectedDate(val);
      setDatePage(0);
      showToast(`Date selected: ${fmtDate(val)} (${batch.day})`, true);
    }
  };

  // Auto-select latest date if none selected
  useEffect(() => {
    if (batchDatesAll.length > 0 && !selectedDate) {
      setSelectedDate(batchDatesAll[0]);
    }
  }, [batchDatesAll, selectedDate]);

  // Marked dates set
  const markedDates = useMemo(() => {
    if (!selectedBatchId) return new Set<string>();
    return new Set(getBatchSessions(selectedBatchId).map((s) => s.date));
  }, [selectedBatchId, records]);

  const loadSession = async (bId: string, date: string) => {
    setLoadingBatchStudents(true);
    setSessionLoaded(true);
    setShowGuest(false);

    // 1. Check existing saved session first
    const existing = getSession(bId, date);

    // 2. Directly fetch all students via API: GET http://127.0.0.1:8000/students (always fresh, no cache skipping)
    try {
      await fetchAllStudentsAPI();
      setStudentIds(Object.keys(studentCache));
    } catch (err) {
      console.warn("[MarkAttendance] fetchAllStudentsAPI error:", err);
    }

    // 3. Get assigned users for this batch (reuse the already-fetched batch from dropdown select)
    let assignedIds: string[] = [];
    const existingBatch = batches.find((b) => b.id === bId) || getBatchById(bId);

    if (existingBatch && existingBatch.students && existingBatch.students.length > 0) {
      console.log(`[MarkAttendance] Reusing batch data already fetched from dropdown selection for batch #${bId}`);
      assignedIds = existingBatch.students.map((s) => String(s.id));
      existingBatch.students.forEach((s) => {
        const sId = String(s.id);
        studentCache[sId] = {
          ...(studentCache[sId] || {}),
          id: sId,
          firstName: s.firstName || s.name || studentCache[sId]?.firstName || "",
          surname: s.surname || studentCache[sId]?.surname || "",
          middleName: "",
          standard: s.standard || existingBatch.standard || studentCache[sId]?.standard || "",
          standardName: s.standard || existingBatch.standard || studentCache[sId]?.standardName || "",
          subject: existingBatch.subject || studentCache[sId]?.subject || "",
          subjectName: existingBatch.subject || studentCache[sId]?.subjectName || "",
          branch: existingBatch.branch || studentCache[sId]?.branch || "",
          rollNo: s.rollNo || studentCache[sId]?.rollNo || "",
          contactNo: s.contactNo || studentCache[sId]?.contactNo || "",
          email: s.email || studentCache[sId]?.email || "",
          photo: s.photo || studentCache[sId]?.photo || null,
        } as any;
      });
    } else if (existingBatch && existingBatch.studentIds && existingBatch.studentIds.length > 0) {
      assignedIds = existingBatch.studentIds;
    } else {
      // Only call GET /batch/{bId} if not already fetched!
      try {
        console.log(`[MarkAttendance API] Fetching batch details: GET ${API_BASE_URL}/batch/${bId}`);
        const fullBatch = await getBatchByIdAPI(bId);
        if (fullBatch) {
          setBatches((prev) =>
            prev.map((b) => (b.id === bId ? fullBatch : b))
          );
          if (fullBatch.students && fullBatch.students.length > 0) {
            assignedIds = fullBatch.students.map((s) => String(s.id));
            fullBatch.students.forEach((s) => {
              const sId = String(s.id);
              studentCache[sId] = {
                ...(studentCache[sId] || {}),
                id: sId,
                firstName: s.firstName || s.name || studentCache[sId]?.firstName || "",
                surname: s.surname || studentCache[sId]?.surname || "",
                middleName: "",
                standard: s.standard || fullBatch.standard || studentCache[sId]?.standard || "",
                standardName: s.standard || fullBatch.standard || studentCache[sId]?.standardName || "",
                subject: fullBatch.subject || studentCache[sId]?.subject || "",
                subjectName: fullBatch.subject || studentCache[sId]?.subjectName || "",
                branch: fullBatch.branch || studentCache[sId]?.branch || "",
                rollNo: s.rollNo || studentCache[sId]?.rollNo || "",
                contactNo: s.contactNo || studentCache[sId]?.contactNo || "",
                email: s.email || studentCache[sId]?.email || "",
                photo: s.photo || studentCache[sId]?.photo || null,
              } as any;
            });
          } else if (fullBatch.studentIds && fullBatch.studentIds.length > 0) {
            assignedIds = fullBatch.studentIds;
          }
        }
      } catch (err) {
        console.warn(`[MarkAttendance API] GET /batch/${bId} error:`, err);
      }
    }

    // Fallback: If API returned no students, check local batch
    if (assignedIds.length === 0) {
      const b = batches.find((item) => item.id === bId) || getBatchById(bId);
      if (b && b.students && b.students.length > 0) {
        assignedIds = b.students.map((s) => String(s.id));
      } else if (b && b.studentIds && b.studentIds.length > 0) {
        assignedIds = b.studentIds;
      }
    }

    // Ultimate Fallback: Ensure at least 1 student record is present to view attendance data
    if (assignedIds.length === 0) {
      assignedIds = ["fallback-student-1"];
      studentCache["fallback-student-1"] = FALLBACK_STUDENT as any;
    }

    // 3. Populate records: preserve existing session statuses if already saved for this date
    if (existing) {
      const existingMap = new Map(existing.records.map((r) => [r.studentId, r]));
      const regular: StudentAttendance[] = assignedIds.map((sid) => {
        const found = existingMap.get(sid);
        return found || {
          studentId: sid,
          status: "Present" as AttendanceStatus,
          remark: "",
        };
      });
      const guests = existing.records.filter((r) => r.recoveryInfo);
      setRecords([...regular, ...guests]);
    } else {
      setRecords(
        assignedIds.map((sid) => ({
          studentId: sid,
          status: "Present" as AttendanceStatus,
          remark: "",
        }))
      );
    }

    setLoadingBatchStudents(false);
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  const handleStartAttendance = (dateOverride?: any) => {
    const targetDate = typeof dateOverride === "string" ? dateOverride : selectedDate;
    if (!selectedBatchId || !targetDate || typeof targetDate !== "string") return;
    setSelectedDate(targetDate);
    setIsStarted(true);
    loadSession(selectedBatchId, targetDate);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateRecord = useCallback((idx: number, updated: StudentAttendance) => {
    setRecords((prev) => prev.map((r, i) => (i === idx ? updated : r)));
  }, []);

  const removeRecord = useCallback((idx: number) => {
    setRecords((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const regularRecords = records.filter((r) => !r.recoveryInfo);
  const guestRecords = records.filter((r) => r.recoveryInfo);

  const stats = useMemo(
    () => ({
      present: regularRecords.filter((r) => r.status === "Present").length,
      absent: regularRecords.filter((r) => r.status === "Absent").length,
      guests: guestRecords.length,
      total: regularRecords.length,
    }),
    [regularRecords, guestRecords]
  );

  const markAll = (status: AttendanceStatus) => {
    setRecords((prev) =>
      prev.map((r) => (r.recoveryInfo ? r : { ...r, status }))
    );
  };

  const handleAddGuest = (record: StudentAttendance) => {
    setRecords((prev) => [...prev, record]);
    setShowGuest(false);
    showToast(`${getStudentName(record.studentId)} added as recovery guest.`, true);
  };

  const handleSave = (submit: boolean) => {
    if (!selectedBatchId || !selectedDate || !batch) return;
    setSaving(true);

    setTimeout(() => {
      const session: AttendanceSession = {
        id: `${selectedBatchId}_${selectedDate}`,
        batchId: selectedBatchId,
        batchName: batch.name,
        date: selectedDate,
        markedBy,
        markedAt: new Date().toISOString(),
        records,
        isSubmitted: submit,
      };
      saveSession(session);
      setSaving(false);

      if (submit) {
        Swal.fire({
          title: "Attendance Submitted!",
          html: `
            <div style="color: #475569; font-size: 14px; line-height: 1.8;">
              <div style="color: #2563eb; font-weight: 700; font-size: 15px; margin-bottom: 8px;">${batch.name}</div>
              <div>📅 ${fmtDate(selectedDate)}</div>
              <div style="margin-top: 4px;">
                ✅ Present: <strong style="color: #16a34a">${stats.present}</strong> &nbsp;·&nbsp;
                ❌ Absent: <strong style="color: #dc2626">${stats.absent}</strong> &nbsp;·&nbsp;
                🔄 Recovery: <strong style="color: #7c3aed">${stats.guests}</strong>
              </div>
              <div style="margin-top: 4px; color: #64748b;">👤 Marked by: ${markedBy}</div>
            </div>`,
          icon: "success",
          confirmButtonText: "Done",
          confirmButtonColor: "#2563eb",
          customClass: {
            confirmButton: "rounded-xl px-6 py-2.5 font-medium text-sm shadow-md",
          },
        }).then(() => {
          // Reset to Step 1 after clicking Done
          setIsStarted(false);
          setSelectedBatchId(null);
          setSelectedDate(null);
          setSessionLoaded(false);
          setRecords([]);
          setShowGuest(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      } else {
        showToast("Attendance draft saved successfully.", true);
      }
    }, 300);
  };

  const batchOptions = batches.map((b) => ({
    id: b.id,
    label: `${cleanBatchNameHelper(b.name, [b.area, b.branch, b.day, b.timeSlot])} · ${b.type || "Regular"}`,
    batch: b,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl transition-all ${toast.ok
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
        >
          {toast.ok ? <IconCircleCheck size={18} className="text-emerald-600" /> : <IconAlertCircle size={18} className="text-rose-600" />}
          <span className="text-sm font-semibold">{toast.msg}</span>
          <IconButton size="small" onClick={() => setToast(null)} className="ml-2 hover:opacity-75">
            <IconX size={14} />
          </IconButton>
        </div>
      )}

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <PageHeader
        title="Mark Attendance"
        subtitle="Select a batch and session date to record student attendance"
      />

      {/* Offline Alert Banner (Matching Student / Teacher UI) */}
      {apiError && (
        <div className="flex items-center justify-between px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
          <span>
            ⚠️ API connection failed ({apiError}). Showing 1 dummy student for offline preview.
          </span>
          <Button
            size="small"
            variant="contained"
            onClick={fetchBatchesData}
            className="!px-3 !py-1 !bg-blue-600 hover:!bg-blue-700 !text-white !text-xs !font-medium !rounded-lg !normal-case transition-colors"
          >
            Retry API
          </Button>
        </div>
      )}

      {/* ── Initial Selection Mode: Step 1 and Step 2 ──────────────────── */}
      {!isStarted && (
        <>
          {/* ── Step 1: Select Batch Card ────────────────────────────────────── */}
          <Card
            elevation={1}
            className="bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <CardContent className="!p-5 sm:!p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Avatar sx={{ bgcolor: "#eff6ff", color: "#2563eb", width: 32, height: 32 }}>
                  <IconUsers size={16} />
                </Avatar>
                <Typography variant="h6" className="!font-bold text-slate-800 !text-base sm:!text-lg">
                  Step 1: Select Batch & Marker
                </Typography>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Batch Selector */}
                <div className="sm:col-span-6">
                  <Autocomplete
                    options={batchOptions}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    value={batchOptions.find((o) => o.id === selectedBatchId) || null}
                    onChange={(_e, val) => {
                      setSelectedBatchId(val ? val.id : null);
                      setSelectedDate(null);
                      setCustomDateInput("");
                      setDateValidationError(null);
                      setDatePage(0);
                      setSessionLoaded(false);
                      setIsStarted(false);
                      setRecords([]);
                      setShowGuest(false);
                    }}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Batch *"
                        placeholder="Search by area, branch, subject…"
                      />
                    )}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "#f8fafc",
                      },
                    }}
                  />
                </div>

                {/* Marked By Input */}
                <div className="sm:col-span-3">
                  <TextField
                    label="Marked By"
                    value={markedBy}
                    onChange={(e) => setMarkedBy(e.target.value)}
                    size="small"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: "#f8fafc",
                      },
                    }}
                  />
                </div>

                {/* Batch Info Badge */}
                <div className="sm:col-span-3">
                  {batch ? (
                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-2.5">
                      <IconCalendar size={18} className="text-blue-600 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-blue-800 uppercase block tracking-wider">
                          Batch Schedule
                        </span>
                        <span className="text-xs font-semibold text-slate-700 truncate block">
                          Every {batch.day}s
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 text-xs text-center font-medium">
                      Select a batch to continue
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Step 2: Pick Date Card ───────────────────────────────────────── */}
          {batch && (
            <Card
              elevation={1}
              className="bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <CardContent className="!p-5 sm:!p-6 space-y-5">
                {/* Top Bar: Icon, Title, Subtitle, Legend */}
                <div className="flex items-start sm:items-center justify-between flex-wrap gap-4 pb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <IconCalendar size={22} />
                    </div>
                    <div>
                      <Typography variant="h6" className="!font-bold text-slate-800 !text-base sm:!text-lg">
                        Step 2: Pick Date
                      </Typography>
                      <Typography variant="caption" className="text-slate-500 block">
                        Pick one of the recent class dates ({batch.day}s only)
                      </Typography>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                      Already marked
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
                      Not marked
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                      Selected
                    </span>
                  </div>
                </div>

                {/* Batch Info Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                    <IconCalendar size={14} className="text-slate-500" />
                    <span><strong className="font-semibold text-slate-900">Batch:</strong> {batch.name}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                    <IconClock size={14} className="text-slate-500" />
                    <span><strong className="font-semibold text-slate-900">Time:</strong> {batch.timeSlot}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                    <IconCalendar size={14} className="text-slate-500" />
                    <span><strong className="font-semibold text-slate-900">Day:</strong> {batch.day}</span>
                  </div>
                </div>

                {/* Compact Direct Calendar Date Selector */}
                <div className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-blue-50/50 border border-blue-100/80 flex-wrap">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <IconCalendar size={16} className="text-blue-600 shrink-0" />
                    <span>Or Pick Custom Date:</span>
                    <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">
                      ({batch.day}s only)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <TextField
                      type="date"
                      size="small"
                      value={customDateInput || selectedDate || ""}
                      onChange={(e) => handleCustomDateSelect(e.target.value)}
                      error={Boolean(dateValidationError)}
                      sx={{
                        width: 160,
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#ffffff",
                          borderRadius: "8px",
                          fontSize: "12px",
                          height: "32px",
                        },
                      }}
                    />

                    {dateValidationError ? (
                      <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                        <IconAlertCircle size={13} className="shrink-0" />
                        {dateValidationError}
                      </span>
                    ) : selectedDate ? (
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <IconCircleCheck size={13} className="text-emerald-600 shrink-0" />
                        Valid {batch.day}
                      </span>
                    ) : null}
                  </div>
                </div>

                <Divider />

                {/* 2-Column Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Timeline List */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center justify-between pb-1">
                      <Typography variant="subtitle2" className="!font-bold text-slate-800">
                        Scheduled {batch.day}s
                      </Typography>
                      <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                        <span>Page {datePage + 1} of {totalDatePages}</span>
                        <Tooltip title={`Showing scheduled class occurrences for ${batch.name}`} arrow>
                          <IconButton size="small" className="!p-0.5 text-slate-400 hover:text-slate-600">
                            <IconInfoCircle size={14} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>

                    {/* Timeline Container */}
                    <div className="relative pl-6 space-y-2.5">
                      {/* Vertical line running behind dots */}
                      <div className="absolute left-[17px] top-4 bottom-5 w-0.5 bg-slate-200" />

                      {visibleBatchDates.map((date) => {
                        const isMarked = markedDates.has(date);
                        const isSelected = selectedDate === date;
                        const d = new Date(date + "T00:00:00");
                        const formattedDate = d.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        });

                        return (
                          <div
                            key={date}
                            onClick={() => {
                              handleSelectDate(date);
                              setDateValidationError(null);
                              setCustomDateInput(date);
                            }}
                            className={`relative flex items-center justify-between p-2.5 sm:p-3 rounded-2xl cursor-pointer transition-all ${isSelected
                                ? "bg-blue-50/70 border border-blue-200 shadow-sm"
                                : "hover:bg-slate-50/80 border border-transparent"
                              }`}
                          >
                            {/* Timeline Node Icon */}
                            <div className="absolute -left-[27px] flex items-center justify-center">
                              {isSelected ? (
                                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center ring-4 ring-blue-100 shadow-sm">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                </div>
                              ) : isMarked ? (
                                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                                  <IconCheck size={12} stroke={3} />
                                </div>
                              ) : (
                                <div className="w-4 h-4 rounded-full bg-slate-300 ring-4 ring-white" />
                              )}
                            </div>

                            {/* Date & Weekday */}
                            <div className="min-w-0 pr-2">
                              <span
                                className={`text-xs sm:text-sm font-bold block truncate ${isSelected ? "text-blue-700" : "text-slate-800"
                                  }`}
                              >
                                {formattedDate}
                              </span>
                              <span
                                className={`text-[11px] font-medium block ${isSelected ? "text-blue-600" : "text-slate-400"
                                  }`}
                              >
                                {batch.day}
                              </span>
                            </div>

                            {/* Middle Status Pill */}
                            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold">
                              {isSelected ? (
                                <span className="flex items-center gap-1.5 text-blue-600">
                                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                                  Selected
                                </span>
                              ) : isMarked ? (
                                <span className="flex items-center gap-1.5 text-emerald-600">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                  Attendance marked
                                </span>
                              ) : (
                                <span className="flex items-center gap-1.5 text-slate-500 font-normal">
                                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                                  Not marked
                                </span>
                              )}
                            </div>

                            {/* Action Button */}
                            <div>
                              {isSelected ? (
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectDate(date);
                                    setDateValidationError(null);
                                    setCustomDateInput(date);
                                  }}
                                  sx={{
                                    bgcolor: "#2563eb",
                                    textTransform: "none",
                                    fontWeight: 700,
                                    borderRadius: "10px",
                                    px: 2.5,
                                    py: 0.5,
                                    fontSize: "12px",
                                    boxShadow: "none",
                                    "&:hover": { bgcolor: "#1d4ed8" },
                                  }}
                                >
                                  Selected
                                </Button>
                              ) : isMarked ? (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectDate(date);
                                    setDateValidationError(null);
                                    setCustomDateInput(date);
                                  }}
                                  sx={{
                                    borderColor: "#10b981",
                                    color: "#059669",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    borderRadius: "10px",
                                    px: 2.5,
                                    py: 0.5,
                                    fontSize: "12px",
                                    "&:hover": { borderColor: "#059669", bgcolor: "#ecfdf5" },
                                  }}
                                >
                                  Edit
                                </Button>
                              ) : (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectDate(date);
                                    setDateValidationError(null);
                                    setCustomDateInput(date);
                                  }}
                                  sx={{
                                    borderColor: "#3b82f6",
                                    color: "#2563eb",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    borderRadius: "10px",
                                    px: 2,
                                    py: 0.5,
                                    fontSize: "12px",
                                    "&:hover": { borderColor: "#2563eb", bgcolor: "#eff6ff" },
                                  }}
                                >
                                  Select
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination Controls: Go Back (Newer) & Load Older Dates */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 flex-wrap gap-2">
                      <div className="text-xs text-slate-500 font-medium">
                        Page <strong>{datePage + 1}</strong> of <strong>{totalDatePages}</strong>
                        <span className="text-slate-400 ml-1">
                          ({datePage * DATES_PER_PAGE + 1}–{Math.min((datePage + 1) * DATES_PER_PAGE, batchDatesAll.length)} of {batchDatesAll.length} {batch.day}s)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={datePage === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDatePage((prev) => Math.max(0, prev - 1));
                          }}
                          startIcon={<IconArrowLeft size={14} />}
                          sx={{
                            textTransform: "none",
                            borderRadius: "10px",
                            borderColor: "#cbd5e1",
                            color: "#475569",
                            fontSize: "12px",
                            py: 0.5,
                            px: 1.5,
                            "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" },
                            "&.Mui-disabled": { opacity: 0.5 },
                          }}
                        >
                          Go Back (Newer)
                        </Button>

                        <Button
                          size="small"
                          variant="contained"
                          disabled={datePage >= totalDatePages - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDatePage((prev) => Math.min(totalDatePages - 1, prev + 1));
                          }}
                          endIcon={<IconChevronDown size={14} />}
                          sx={{
                            textTransform: "none",
                            borderRadius: "10px",
                            bgcolor: "#2563eb",
                            color: "#ffffff",
                            fontSize: "12px",
                            fontWeight: 600,
                            py: 0.5,
                            px: 1.5,
                            boxShadow: "none",
                            "&:hover": { bgcolor: "#1d4ed8" },
                            "&.Mui-disabled": { opacity: 0.5, bgcolor: "#cbd5e1", color: "#94a3b8" },
                          }}
                        >
                          Load Older Dates
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Selected Date Action Panel */}
                  <div className="lg:col-span-5">
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm flex flex-col justify-between">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                            <IconCalendar size={24} />
                          </div>
                          <div className="min-w-0">
                            <Typography variant="caption" className="!font-bold text-slate-400 uppercase tracking-wider block">
                              Selected Date
                            </Typography>
                            <Typography variant="h6" className="!font-bold text-slate-800 leading-tight truncate">
                              {selectedDate ? fmtFullDate(selectedDate) : "Select a Date"}
                            </Typography>
                          </div>
                        </div>

                        {/* Status notification banner */}
                        {selectedDate && (
                          markedDates.has(selectedDate) ? (
                            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-900 space-y-0.5">
                              <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                Attendance already marked
                              </div>
                              <p className="text-xs text-emerald-600 pl-4">
                                Attendance has been saved for this session. You can review or edit it below.
                              </p>
                            </div>
                          ) : (
                            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-blue-900 space-y-0.5">
                              <div className="flex items-center gap-2 font-bold text-xs text-blue-800">
                                <span className="w-2 h-2 rounded-full bg-blue-600" />
                                Attendance not yet marked
                              </div>
                              <p className="text-xs text-blue-600 pl-4">
                                Start taking attendance for this session.
                              </p>
                            </div>
                          )
                        )}

                        {/* Session Details Box */}
                        <div className="border border-slate-200/80 rounded-2xl p-4 bg-slate-50/40 space-y-3.5">
                          <Typography variant="subtitle2" className="!font-bold text-slate-800 !text-xs uppercase tracking-wider">
                            Session Details
                          </Typography>

                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                              <IconUsers size={18} />
                            </div>
                            <div>
                              <span className="text-sm font-bold text-slate-800 block">
                                {batch.studentIds?.length || 0} Students
                              </span>
                              <span className="text-xs text-slate-500 block">
                                All assigned students will be marked as Present by default.
                              </span>
                            </div>
                          </div>

                          <Divider />

                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                              <IconClock size={18} />
                            </div>
                            <div>
                              <span className="text-sm font-bold text-slate-800 block">
                                Time
                              </span>
                              <span className="text-xs text-slate-500 block">
                                {batch.timeSlot}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Tip Box */}
                        <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5">
                          <IconInfoCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold text-blue-900 block">Tip</span>
                            <span className="text-xs text-blue-700 block leading-relaxed">
                              Green dates already have attendance saved. Click Edit to view or update.
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Primary CTA Button */}
                      <div className="pt-4">
                        <Button
                          variant="contained"
                          fullWidth
                          size="large"
                          onClick={() => handleStartAttendance()}
                          disabled={!selectedDate || Boolean(dateValidationError)}
                          startIcon={<IconPlayerPlayFilled size={16} />}
                          sx={{
                            borderRadius: "14px",
                            py: 1.4,
                            fontSize: "14px",
                            fontWeight: 700,
                            textTransform: "none",
                            bgcolor: "#2563eb",
                            "&:hover": { bgcolor: "#1d4ed8" },
                            boxShadow: "0 4px 14px 0 rgba(37,99,235,0.25)",
                            "&.Mui-disabled": { opacity: 0.5 },
                          }}
                        >
                          {selectedDate && markedDates.has(selectedDate) ? "Edit Attendance" : "Start Attendance"}
                        </Button>
                        {dateValidationError ? (
                          <span className="text-xs text-rose-600 font-bold block text-center mt-2">
                            {dateValidationError}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 block text-center mt-2">
                            You can update attendance after starting.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* ── Attendance Sheet Card (shown when attendance is started) ─────── */}
      {isStarted && sessionLoaded && (
        <div ref={attendanceSheetRef}>
          <Card
            elevation={1}
            className="bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-4"
          >
            <CardContent className="!p-5 sm:!p-6 space-y-5">
              {/* Top Navigation Bar: Step 3 Title on Left, "Change Batch / Date" on Right */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <IconCalendar size={22} />
                  </div>
                  <div>
                    <Typography variant="h6" className="!font-bold text-slate-800 !text-base sm:!text-lg leading-tight">
                      Step 3: Attendance Sheet
                    </Typography>
                    <Typography variant="caption" className="text-slate-500 block mt-0.5">
                      {cleanBatchName} · <strong className="text-slate-700">{fmtDate(selectedDate)}</strong>
                    </Typography>
                  </div>
                </div>

                {/* Right Side: Change Batch / Date Button */}
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<IconArrowLeft size={16} />}
                  onClick={() => setIsStarted(false)}
                  sx={{
                    borderRadius: "12px",
                    borderColor: "#cbd5e1",
                    color: "#334155",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 2.5,
                    py: 0.85,
                    fontSize: "13px",
                    boxShadow: "none",
                    "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" },
                  }}
                >
                  Change Batch / Date
                </Button>
              </div>

              {/* Session Meta Badges Row */}
              <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                  <IconCalendar size={14} className="text-slate-500" />
                  <span><strong className="font-semibold text-slate-900">Batch:</strong> {cleanBatchName}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-medium text-blue-800">
                  <IconCalendar size={14} className="text-blue-600" />
                  <span><strong className="font-semibold text-blue-900">Date:</strong> {fmtDate(selectedDate)}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                  <IconClock size={14} className="text-slate-500" />
                  <span><strong className="font-semibold text-slate-900">Time:</strong> {batch?.timeSlot || "–"}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
                  <span><strong className="font-semibold text-slate-900">Marked by:</strong> {markedBy}</span>
                </div>
              </div>

              {/* Mark All Toolbar */}
              <div className="flex items-center justify-between pb-1 flex-wrap gap-3">
                <Typography variant="subtitle2" className="!font-bold text-slate-700">
                  Mark Attendance Records:
                </Typography>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Quick Mark:</span>
                  <Button
                    type="button"
                    onClick={() => markAll("Present")}
                    className="!px-3 !py-1.5 !rounded-xl !text-xs !font-bold !bg-emerald-50 !border !border-emerald-200 !text-emerald-700 hover:!bg-emerald-100 transition-colors shadow-sm !normal-case"
                  >
                    All Present
                  </Button>
                  <Button
                    type="button"
                    onClick={() => markAll("Absent")}
                    className="!px-3 !py-1.5 !rounded-xl !text-xs !font-bold !bg-rose-50 !border !border-rose-200 !text-rose-700 hover:!bg-rose-100 transition-colors shadow-sm !normal-case"
                  >
                    All Absent
                  </Button>
                </div>
              </div>

              {/* Stat Counters Row — Small Compact Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Regular Students Card */}
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-blue-50/70 border border-blue-200/70 hover:bg-blue-50 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <IconUsers size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-base sm:text-lg font-black text-blue-950 leading-tight block">
                      {loadingBatchStudents ? <CircularProgress size={14} sx={{ color: "#2563eb" }} /> : stats.total}
                    </span>
                    <span className="text-[11px] font-semibold text-blue-800/80 truncate block">
                      Regular Students
                    </span>
                  </div>
                </div>

                {/* Present Card */}
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-50/70 border border-emerald-200/70 hover:bg-emerald-50 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <IconCircleCheck size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-base sm:text-lg font-black text-emerald-950 leading-tight block">
                      {stats.present}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-800/80 truncate block">
                      Present
                    </span>
                  </div>
                </div>

                {/* Absent Card */}
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-rose-50/70 border border-rose-200/70 hover:bg-rose-50 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                  <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <IconX size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-base sm:text-lg font-black text-rose-950 leading-tight block">
                      {stats.absent}
                    </span>
                    <span className="text-[11px] font-semibold text-rose-800/80 truncate block">
                      Absent
                    </span>
                  </div>
                </div>

                {/* Recovery Guests Card */}
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-violet-50/70 border border-violet-200/70 hover:bg-violet-50 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                  <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <IconRefresh size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-base sm:text-lg font-black text-violet-950 leading-tight block">
                      {stats.guests}
                    </span>
                    <span className="text-[11px] font-semibold text-violet-800/80 truncate block">
                      Recovery Guests
                    </span>
                  </div>
                </div>
              </div>

              {/* Regular Students List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Typography variant="subtitle2" className="!font-bold text-slate-700 uppercase tracking-wider text-xs">
                    Regular Students ({regularRecords.length})
                  </Typography>
                  {loadingBatchStudents && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
                      <CircularProgress size={12} sx={{ color: "#2563eb" }} />
                      Loading batch students…
                    </span>
                  )}
                </div>

                {loadingBatchStudents && regularRecords.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 text-sm flex flex-col items-center justify-center gap-2">
                    <CircularProgress size={24} sx={{ color: "#2563eb" }} />
                    <span className="font-semibold text-slate-600">Fetching assigned students for this batch...</span>
                    <span className="text-xs text-slate-400">Calling backend API...</span>
                  </div>
                ) : regularRecords.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 text-sm">
                    No regular students assigned to this batch yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {regularRecords.map((r, i) => {
                      const realIdx = records.indexOf(r);
                      return (
                        <StudentRow
                          key={r.studentId}
                          record={r}
                          serialNo={i + 1}
                          onChange={(u) => updateRecord(realIdx, u)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Guest / Recovery Students Section */}
              {guestRecords.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-2">
                    <Chip
                      icon={<IconRefresh size={14} />}
                      label={`Guest / Recovery Students (${guestRecords.length})`}
                      color="secondary"
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                    <Divider className="flex-1" />
                  </div>
                  <div className="space-y-2">
                    {guestRecords.map((r, i) => {
                      const realIdx = records.indexOf(r);
                      return (
                        <GuestRow
                          key={r.studentId}
                          record={r}
                          serialNo={i + 1}
                          onChange={(u) => updateRecord(realIdx, u)}
                          onRemove={() => removeRecord(realIdx)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add Guest Panel Toggle / Inline Panel */}
              <div className="pt-2">
                {!showGuest ? (
                  <Button
                    type="button"
                    onClick={() => setShowGuest(true)}
                    className="w-full !py-3 !px-4 !rounded-2xl !border-2 !border-dashed !border-violet-300 !bg-violet-50/40 hover:!bg-violet-50 !text-violet-700 !font-bold !text-sm transition-all flex items-center justify-center gap-2 !normal-case"
                  >
                    <IconUserPlus size={18} />
                    <span>Add Guest / Recovery Student from Another Batch</span>
                    <IconChevronDown size={16} />
                  </Button>
                ) : (
                  <AddGuestPanel
                    currentBatchId={selectedBatchId!}
                    existingStudentIds={records.map((r) => r.studentId)}
                    studentIds={studentIds}
                    onAdd={handleAddGuest}
                    onClose={() => setShowGuest(false)}
                  />
                )}
              </div>

              {/* Save & Submit Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  variant="outlined"
                  disabled={saving}
                  onClick={() => handleSave(false)}
                  startIcon={<IconDeviceFloppy size={18} />}
                  className="!px-5 !py-2.5 !rounded-xl !border-slate-300 !bg-white hover:!bg-slate-50 !text-slate-700 !font-bold !text-sm shadow-sm !normal-case"
                >
                  Save Draft
                </Button>

                <Button
                  variant="contained"
                  disabled={saving}
                  onClick={() => handleSave(true)}
                  startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <IconCircleCheck size={18} />}
                  className="!px-6 !py-2.5 !rounded-xl !bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !text-sm shadow-md hover:shadow-lg transition-all hover:scale-105 !normal-case"
                >
                  Submit Attendance
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;
