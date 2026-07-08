// src/pages/attendance/MarkAttendance.tsx
// Route: { path: "attendance/mark", element: <MarkAttendance /> }

import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stack, Paper, Title, Grid, Text, Group, Badge,
  Select, Textarea, ActionIcon, Tooltip, Divider, Avatar,
} from "@mantine/core";
import {
  IconArrowLeft, IconUserPlus, IconUsers, IconDeviceFloppy,
  IconAlertCircle, IconCircleCheck, IconX, IconNote, IconRefresh,
  IconCheck, IconCalendar, IconHistory, IconSearch, IconChevronDown,
} from "@tabler/icons-react";
import Swal from "sweetalert2";
import { getAllBatches, getBatchById } from "../batches/batchStore";
import { studentStore } from "../admin/Users/Student/studentStore";
import {
  getSession, saveSession, getBatchSessions,
  type AttendanceStatus, type StudentAttendance, type AttendanceSession,
} from "./attendanceStore";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function toYMD(d: Date): string {
  return d.toISOString().split("T")[0];
}

function fmtDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric", weekday: "short",
  });
}

function getStudentName(id: string) {
  const s = studentStore[id];
  if (!s) return `Student #${id}`;
  return `${s.firstName} ${s.surname}`;
}
function getStudentStandard(id: string) { return studentStore[id]?.standard ?? "–"; }
function getStudentSubject(id: string)  { return studentStore[id]?.subject  ?? "–"; }
function getInitials(id: string) {
  const s = studentStore[id];
  if (!s) return id.slice(0, 2).toUpperCase();
  return `${s.firstName[0]}${s.surname[0]}`.toUpperCase();
}

// Get all past occurrences of a given weekday (e.g. "Monday") up to today
const DAYS_MAP: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
  Thursday: 4, Friday: 5, Saturday: 6,
};

function getPastDaysOfWeek(dayName: string, count = 16): string[] {
  const target = DAYS_MAP[dayName];
  if (target === undefined) return [];
  const results: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cur = new Date(today);
  // go back until we hit the target day
  while (cur.getDay() !== target) cur.setDate(cur.getDate() - 1);
  for (let i = 0; i < count; i++) {
    results.push(toYMD(new Date(cur)));
    cur.setDate(cur.getDate() - 7);
  }
  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// Status config
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<AttendanceStatus, {
  label: string; icon: React.ReactNode;
  activeBg: string; activeColor: string; activeBorder: string;
}> = {
  Present:  {
    label: "Present",  icon: <IconCheck   size={12} />,
    activeBg: "rgba(34,197,94,0.15)",   activeColor: "#22c55e", activeBorder: "rgba(34,197,94,0.4)",
  },
  Absent:   {
    label: "Absent",   icon: <IconX       size={12} />,
    activeBg: "rgba(239,68,68,0.15)",    activeColor: "#ef4444", activeBorder: "rgba(239,68,68,0.4)",
  },
  Recovery: {
    label: "Recovery", icon: <IconRefresh size={12} />,
    activeBg: "rgba(139,92,246,0.15)",   activeColor: "#a78bfa", activeBorder: "rgba(139,92,246,0.4)",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// StatusBtn
// ─────────────────────────────────────────────────────────────────────────────

const StatusBtn: React.FC<{
  status: AttendanceStatus; active: boolean; onClick: () => void;
}> = ({ status, active, onClick }) => {
  const c = STATUS_CFG[status];
  return (
    <button onClick={onClick}
      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
      style={{
        background:  active ? c.activeBg     : "var(--bg-tertiary)",
        color:       active ? c.activeColor  : "var(--text-muted)",
        border:      active ? `1px solid ${c.activeBorder}` : "1px solid var(--border-default)",
      }}>
      {c.icon} {c.label}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// StudentRow — regular batch student
// ─────────────────────────────────────────────────────────────────────────────

const StudentRow: React.FC<{
  record: StudentAttendance;
  serialNo: number;
  onChange: (u: StudentAttendance) => void;
}> = ({ record, serialNo, onChange }) => {
  const [showRemark, setShowRemark] = useState(!!record.remark);
  return (
    <div className="rounded-xl p-3 transition-all"
      style={{
        background: record.status === "Absent"
          ? "rgba(239,68,68,0.04)" : "var(--bg-tertiary)",
        border: `1px solid ${record.status === "Absent"
          ? "rgba(239,68,68,0.2)" : "var(--border-default)"}`,
      }}>
      <div className="flex items-center gap-3">
        {/* Serial + Avatar */}
        <div className="flex items-center gap-2 shrink-0">
          <Text size="xs" w={20} ta="right" style={{ color: "var(--text-muted)" }}>{serialNo}.</Text>
          <Avatar size="sm" radius="md" color="orange" variant="light"
            styles={{ root: { fontSize: 10, fontWeight: 700 } }}>
            {getInitials(record.studentId)}
          </Avatar>
        </div>
        {/* Name */}
        <div className="flex-1 min-w-0">
          <Text size="sm" fw={600} style={{ color: "var(--text-primary)" }} truncate>
            {getStudentName(record.studentId)}
          </Text>
          <Text size="xs" style={{ color: "var(--text-muted)" }}>
            {getStudentStandard(record.studentId)} · {getStudentSubject(record.studentId)}
          </Text>
        </div>
        {/* Status buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <StatusBtn status="Present" active={record.status === "Present"} onClick={() => onChange({ ...record, status: "Present" })} />
          <StatusBtn status="Absent"  active={record.status === "Absent"}  onClick={() => onChange({ ...record, status: "Absent"  })} />
        </div>
        {/* Remark toggle */}
        <Tooltip label={showRemark ? "Hide remark" : "Add remark"} withArrow>
          <ActionIcon size="sm" variant="subtle" radius="md"
            onClick={() => setShowRemark(v => !v)}
            style={{ color: showRemark ? "var(--accent-orange)" : "var(--text-muted)" }}>
            <IconNote size={14} />
          </ActionIcon>
        </Tooltip>
      </div>
      {showRemark && (
        <Textarea
          placeholder="Remark…"
          value={record.remark}
          onChange={(e) => onChange({ ...record, remark: e.currentTarget.value })}
          mt={8} ml={52} minRows={1} maxRows={3} autosize
          styles={{
            input: {
              backgroundColor: "var(--bg-input)",
              borderColor: "var(--border-default)",
              color: "var(--text-primary)", fontSize: "12px",
            },
          }}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GuestRow — recovery student from another batch
// ─────────────────────────────────────────────────────────────────────────────

const GuestRow: React.FC<{
  record: StudentAttendance;
  serialNo: number;
  onChange: (u: StudentAttendance) => void;
  onRemove: () => void;
}> = ({ record, serialNo, onChange, onRemove }) => {
  const [showRemark, setShowRemark] = useState(!!record.remark);
  return (
    <div className="rounded-xl p-3 transition-all"
      style={{
        background: "rgba(139,92,246,0.05)",
        border: "1px solid rgba(139,92,246,0.25)",
      }}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <Text size="xs" w={20} ta="right" style={{ color: "var(--text-muted)" }}>{serialNo}.</Text>
          <Avatar size="sm" radius="md" color="violet" variant="light"
            styles={{ root: { fontSize: 10, fontWeight: 700 } }}>
            {getInitials(record.studentId)}
          </Avatar>
        </div>
        <div className="flex-1 min-w-0">
          <Group gap="xs" mb={1} wrap="nowrap">
            <Text size="sm" fw={600} style={{ color: "var(--text-primary)" }} truncate>
              {getStudentName(record.studentId)}
            </Text>
            <Badge size="xs" color="violet" variant="light" radius="sm" style={{ flexShrink: 0 }}>Guest</Badge>
          </Group>
          <Text size="xs" style={{ color: "var(--text-muted)" }}>
            {getStudentStandard(record.studentId)} · {getStudentSubject(record.studentId)}
          </Text>
          {/* Missed lecture info */}
          {record.recoveryInfo && (
            <div className="mt-1.5 flex items-center gap-1.5 px-2 py-1 rounded-lg"
              style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", width: "fit-content" }}>
              <IconHistory size={11} style={{ color: "#a78bfa" }} />
              <Text size="xs" style={{ color: "#a78bfa" }}>
                Missed <strong>{fmtDate(record.recoveryInfo.missedDate)}</strong>
                {" · "}{record.recoveryInfo.fromBatchName}
              </Text>
            </div>
          )}
        </div>
        {/* Status — Recovery is fixed */}
        <div className="shrink-0">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg"
            style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.4)" }}>
            <IconRefresh size={12} style={{ color: "#a78bfa" }} />
            <Text size="xs" fw={600} style={{ color: "#a78bfa" }}>Recovery</Text>
          </div>
        </div>
        <Tooltip label="Add remark" withArrow>
          <ActionIcon size="sm" variant="subtle" radius="md"
            onClick={() => setShowRemark(v => !v)}
            style={{ color: showRemark ? "var(--accent-orange)" : "var(--text-muted)" }}>
            <IconNote size={14} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Remove from session" withArrow>
          <ActionIcon size="sm" variant="subtle" color="red" radius="md" onClick={onRemove}>
            <IconX size={14} />
          </ActionIcon>
        </Tooltip>
      </div>
      {showRemark && (
        <Textarea
          placeholder="Remark for this guest student…"
          value={record.remark}
          onChange={(e) => onChange({ ...record, remark: e.currentTarget.value })}
          mt={8} ml={52} minRows={1} maxRows={3} autosize
          styles={{
            input: {
              backgroundColor: "var(--bg-input)",
              borderColor: "var(--border-default)",
              color: "var(--text-primary)", fontSize: "12px",
            },
          }}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// AddGuestPanel — inline panel below student list
// ─────────────────────────────────────────────────────────────────────────────

const AddGuestPanel: React.FC<{
  currentBatchId: string;
  existingStudentIds: string[];
  onAdd: (record: StudentAttendance) => void;
  onClose: () => void;
}> = ({ currentBatchId, existingStudentIds, onAdd, onClose }) => {
  const [search,          setSearch]          = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedDate,    setSelectedDate]    = useState<string | null>(null);
  const [remark,          setRemark]          = useState("");

  const allBatches = getAllBatches();

  // All students NOT already in this session
  const allStudentIds = Object.keys(studentStore).filter(
    (sid) => !existingStudentIds.includes(sid)
  );

  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return [];
    return allStudentIds.filter((sid) =>
      getStudentName(sid).toLowerCase().includes(q) ||
      getStudentStandard(sid).toLowerCase().includes(q) ||
      getStudentSubject(sid).toLowerCase().includes(q)
    ).slice(0, 8);
  }, [search, allStudentIds]);

  // Batches that the selected student belongs to (excluding current)
  const studentBatches = useMemo(() => {
    if (!selectedStudent) return [];
    return allBatches.filter(
      (b) => b.studentIds.includes(selectedStudent) && b.id !== currentBatchId
    );
  }, [selectedStudent, allBatches, currentBatchId]);

  // Past dates for selected batch (batch's day of week)
  const batchDates = useMemo(() => {
    if (!selectedBatchId) return [];
    const b = getBatchById(selectedBatchId);
    if (!b) return [];
    return getPastDaysOfWeek(b.day, 12);
  }, [selectedBatchId]);

  const canAdd = selectedStudent && selectedBatchId && selectedDate;

  const handleAdd = () => {
    if (!canAdd) return;
    const fromBatch = getBatchById(selectedBatchId!)!;
    onAdd({
      studentId: selectedStudent!,
      status: "Recovery",
      remark,
      recoveryInfo: {
        fromBatchId:   fromBatch.id,
        fromBatchName: fromBatch.name,
        missedDate:    selectedDate!,
      },
    });
  };

  const selectSt = {
    styles: {
      label:   { color: "var(--text-primary)", marginBottom: 4 },
      input:   { backgroundColor: "var(--bg-input)", color: "var(--text-primary)", borderColor: "var(--border-default)", fontSize: "13px" },
      section: { color: "var(--text-muted)" },
      option:  { color: "var(--text-primary)", backgroundColor: "var(--bg-secondary)" },
    },
    comboboxProps: { styles: { dropdown: { background: "var(--bg-secondary)", border: "1px solid var(--border-accent)" } } },
  };

  return (
    <div className="rounded-2xl p-4 space-y-4"
      style={{ background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.25)" }}>

      <div className="flex items-center justify-between">
        <Group gap="xs">
          <div className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: "rgba(139,92,246,0.15)" }}>
            <IconUserPlus size={13} style={{ color: "#a78bfa" }} />
          </div>
          <Text size="sm" fw={600} style={{ color: "#a78bfa" }}>Add Guest / Recovery Student</Text>
        </Group>
        <ActionIcon size="sm" variant="subtle" color="gray" onClick={onClose}>
          <IconX size={14} />
        </ActionIcon>
      </div>

      <Divider style={{ borderColor: "rgba(139,92,246,0.2)" }} />

      {/* Step 1 — search student */}
      <div>
        <Text size="xs" fw={700} mb={6}
          style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          Step 1 — Search Student
        </Text>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <IconSearch size={14} style={{ color: "var(--text-muted)" }} />
          </div>
          <input
            type="text"
            placeholder="Type name, standard or subject…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedStudent(null);
              setSelectedBatchId(null);
              setSelectedDate(null);
            }}
            className="w-full text-sm rounded-xl pl-9 pr-4 py-2.5 outline-none transition-colors"
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border-default)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        {/* Results dropdown */}
        {search.length > 0 && (
          <div className="mt-1.5 rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--border-default)", background: "var(--bg-card)" }}>
            {filteredStudents.length === 0 ? (
              <div className="px-4 py-3 text-center">
                <Text size="xs" style={{ color: "var(--text-muted)" }}>No students found</Text>
              </div>
            ) : filteredStudents.map((sid) => (
              <button key={sid}
                onClick={() => {
                  setSelectedStudent(sid);
                  setSearch(getStudentName(sid));
                  setSelectedBatchId(null);
                  setSelectedDate(null);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors"
                style={{
                  borderBottom: "1px solid var(--border-default)",
                  background: selectedStudent === sid ? "rgba(139,92,246,0.08)" : "transparent",
                }}
                onMouseEnter={(e) => { if (selectedStudent !== sid) e.currentTarget.style.background = "var(--bg-tertiary)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = selectedStudent === sid ? "rgba(139,92,246,0.08)" : "transparent"; }}
              >
                <Avatar size="sm" radius="md" color="violet" variant="light"
                  styles={{ root: { fontSize: 10, fontWeight: 700 } }}>
                  {getInitials(sid)}
                </Avatar>
                <div>
                  <Text size="sm" fw={500} style={{ color: "var(--text-primary)" }}>{getStudentName(sid)}</Text>
                  <Text size="xs" style={{ color: "var(--text-muted)" }}>
                    {getStudentStandard(sid)} · {getStudentSubject(sid)}
                  </Text>
                </div>
                {selectedStudent === sid && <IconCheck size={14} style={{ color: "#a78bfa", marginLeft: "auto" }} />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Step 2 — select their batch */}
      {selectedStudent && (
        <div>
          <Text size="xs" fw={700} mb={6}
            style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
            Step 2 — Their Assigned Batch
          </Text>
          {studentBatches.length === 0 ? (
            <div className="px-3 py-2 rounded-lg"
              style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.25)" }}>
              <Text size="xs" c="yellow.6">This student has no assigned batch.</Text>
            </div>
          ) : (
            <div className="space-y-1.5">
              {studentBatches.map((b) => (
                <button key={b.id}
                  onClick={() => { setSelectedBatchId(b.id); setSelectedDate(null); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                  style={{
                    background: selectedBatchId === b.id ? "rgba(139,92,246,0.1)" : "var(--bg-tertiary)",
                    border: `1px solid ${selectedBatchId === b.id ? "rgba(139,92,246,0.4)" : "var(--border-default)"}`,
                  }}>
                  <IconUsers size={14} style={{ color: selectedBatchId === b.id ? "#a78bfa" : "var(--text-muted)" }} />
                  <div className="flex-1 min-w-0">
                    <Text size="sm" fw={500} style={{ color: "var(--text-primary)" }} truncate>{b.name}</Text>
                    <Text size="xs" style={{ color: "var(--text-muted)" }}>{b.day} · {b.timeSlot}</Text>
                  </div>
                  {selectedBatchId === b.id && <IconCheck size={14} style={{ color: "#a78bfa" }} />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3 — pick missed date */}
      {selectedBatchId && (() => {
        const b = getBatchById(selectedBatchId)!;
        const submittedDates = new Set(getBatchSessions(selectedBatchId).map((s) => s.date));
        return (
          <div>
            <Text size="xs" fw={700} mb={6}
              style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Step 3 — Lecture He Missed ({b.day}s)
            </Text>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-44 overflow-y-auto pr-1">
              {batchDates.map((date) => {
                const wasMarked = submittedDates.has(date);
                const isSelected = selectedDate === date;
                return (
                  <button key={date}
                    onClick={() => setSelectedDate(date)}
                    className="flex flex-col items-start px-3 py-2 rounded-lg text-left transition-all"
                    style={{
                      background: isSelected ? "rgba(139,92,246,0.15)" : wasMarked ? "rgba(34,197,94,0.06)" : "var(--bg-tertiary)",
                      border: `1px solid ${isSelected ? "rgba(139,92,246,0.5)" : wasMarked ? "rgba(34,197,94,0.2)" : "var(--border-default)"}`,
                    }}>
                    <Text size="xs" fw={600} style={{ color: isSelected ? "#a78bfa" : "var(--text-primary)" }}>
                      {new Date(date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </Text>
                    <Text size="xs" style={{ color: isSelected ? "#a78bfa" : wasMarked ? "#22c55e" : "var(--text-muted)" }}>
                      {isSelected ? "✓ Selected" : wasMarked ? "● Marked" : "○ Not marked"}
                    </Text>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Remark */}
      {selectedDate && (
        <div>
          <Text size="xs" fw={700} mb={6}
            style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
            Remark (optional)
          </Text>
          <textarea
            placeholder="e.g. came to cover Chapter 3 from missed lecture"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            rows={2}
            className="w-full text-sm rounded-xl px-3 py-2 outline-none resize-none transition-colors"
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border-default)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      )}

      {/* Add button */}
      <Group justify="flex-end">
        <button
          disabled={!canAdd}
          onClick={handleAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
          style={{
            background: canAdd ? "var(--accent-purple)" : "var(--bg-tertiary)",
            color: "white",
          }}>
          <IconUserPlus size={15} /> Add to Attendance
        </button>
      </Group>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MarkAttendance — Main Page
// ─────────────────────────────────────────────────────────────────────────────

const MarkAttendance: React.FC = () => {
  const navigate = useNavigate();

  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedDate,    setSelectedDate]    = useState<string | null>(null);
  const [markedBy,        setMarkedBy]        = useState("Admin");
  const [records,         setRecords]         = useState<StudentAttendance[]>([]);
  const [sessionLoaded,   setSessionLoaded]   = useState(false);
  const [showGuest,       setShowGuest]       = useState(false);
  const [saving,          setSaving]          = useState(false);
  const [toast,           setToast]           = useState<{ msg: string; ok: boolean } | null>(null);

  const allBatches  = getAllBatches().filter((b) => b.status === "Active");
  const batch       = selectedBatchId ? getBatchById(selectedBatchId) : null;

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  // Dates for this batch's day of week
  const batchDates = useMemo(() => {
    if (!batch) return [];
    return getPastDaysOfWeek(batch.day, 16);
  }, [batch]);

  // Which dates already have a submitted session
  const markedDates = useMemo(() => {
    if (!selectedBatchId) return new Set<string>();
    return new Set(getBatchSessions(selectedBatchId).map((s) => s.date));
  }, [selectedBatchId, records]);

  const loadSession = (bId: string, date: string) => {
    const b = getBatchById(bId);
    if (!b) return;
    const existing = getSession(bId, date);
    if (existing) {
      setRecords(existing.records.map((r) => ({ ...r })));
    } else {
      setRecords(b.studentIds.map((sid) => ({ studentId: sid, status: "Present" as AttendanceStatus, remark: "" })));
    }
    setSessionLoaded(true);
    setShowGuest(false);
  };

  const updateRecord = useCallback((idx: number, updated: StudentAttendance) => {
    setRecords((prev) => prev.map((r, i) => i === idx ? updated : r));
  }, []);

  const removeRecord = useCallback((idx: number) => {
    setRecords((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const regularRecords = records.filter((r) => !r.recoveryInfo);
  const guestRecords   = records.filter((r) =>  r.recoveryInfo);

  const stats = useMemo(() => ({
    present:  regularRecords.filter((r) => r.status === "Present").length,
    absent:   regularRecords.filter((r) => r.status === "Absent").length,
    guests:   guestRecords.length,
    total:    regularRecords.length,
  }), [regularRecords, guestRecords]);

  const markAll = (status: AttendanceStatus) => {
    setRecords((prev) =>
      prev.map((r) => r.recoveryInfo ? r : { ...r, status })
    );
  };

  const handleAddGuest = (record: StudentAttendance) => {
    setRecords((prev) => [...prev, record]);
    setShowGuest(false);
    showToast(`${getStudentName(record.studentId)} added as guest.`, true);
  };

  const handleSave = (submit: boolean) => {
    if (!selectedBatchId || !selectedDate || !batch) return;
    setSaving(true);
    setTimeout(() => {
      const session: AttendanceSession = {
        id: `${selectedBatchId}_${selectedDate}`,
        batchId: selectedBatchId, batchName: batch.name,
        date: selectedDate, markedBy,
        markedAt: new Date().toISOString(),
        records, isSubmitted: submit,
      };
      saveSession(session);
      setSaving(false);
      if (submit) {
        Swal.fire({
          title: "Attendance Submitted!",
          html: `
            <div style="color:#94a3b8;font-size:14px;line-height:1.9">
              <div style="color:#f97316;font-weight:700;font-size:15px;margin-bottom:8px">${batch.name}</div>
              <div>📅 ${fmtDate(selectedDate)}</div>
              <div>✅ Present: <strong style="color:#22c55e">${stats.present}</strong>
                   &nbsp;❌ Absent: <strong style="color:#ef4444">${stats.absent}</strong>
                   &nbsp;🔄 Guests: <strong style="color:#a78bfa">${stats.guests}</strong></div>
              <div>👤 Marked by: ${markedBy}</div>
            </div>`,
          icon: "success", confirmButtonText: "Done",
          background: "#1e293b", color: "#f8fafc", iconColor: "#4ade80",
          confirmButtonColor: "#7c3aed",
          customClass: { popup: "rounded-xl border border-purple-500/30", confirmButton: "rounded-lg px-6 py-2 font-medium" },
        });
      } else {
        showToast("Draft saved.", true);
      }
    }, 400);
  };

  const selectSt = {
    styles: {
      label:   { color: "var(--text-primary)", marginBottom: 6 },
      input:   { backgroundColor: "var(--bg-input)", color: "var(--text-primary)", borderColor: "var(--border-default)" },
      section: { color: "var(--text-muted)" },
      option:  { color: "var(--text-primary)", backgroundColor: "var(--bg-secondary)" },
    },
    comboboxProps: { styles: { dropdown: { background: "var(--bg-secondary)", border: "1px solid var(--border-accent)" } } },
  };

  return (
    <Stack gap="md" maw={860} mx="auto" pb="xl" px={{ base: "xs", sm: 0 }}>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl ${
          toast.ok ? "bg-green-500/15 border-green-500/30 text-green-500" : "bg-red-500/15 border-red-500/30 text-red-400"
        }`}>
          {toast.ok ? <IconCircleCheck size={16} /> : <IconAlertCircle size={16} />}
          <span className="text-sm font-medium">{toast.msg}</span>
          <button onClick={() => setToast(null)}><IconX size={13} /></button>
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Tooltip label="Back" position="right" withArrow>
          <ActionIcon variant="subtle" size="lg" radius="lg"
            onClick={() => navigate("/attendance")}
            styles={{ root: { color: "var(--text-secondary)" } }}>
            <IconArrowLeft size={20} />
          </ActionIcon>
        </Tooltip>
        <div>
          <Title order={3} style={{ color: "var(--text-primary)" }}>Mark Attendance</Title>
          <Text size="sm" style={{ color: "var(--text-muted)" }}>Select batch then pick a date</Text>
        </div>
      </div>

      {/* ── Step 1: Select Batch ────────────────────────────────────── */}
      <Paper className="p-4 sm:p-5"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)" }}>
        <Title order={5} mb="md" style={{ color: "var(--text-accent)", fontSize: "clamp(13px,2vw,16px)" }}>
          <span className="flex items-center gap-2">
            <IconUsers size={15} style={{ color: "var(--text-accent)" }} /> Select Batch
          </span>
        </Title>
        <Grid gutter="md" align="flex-end">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Select
              label="Batch"
              placeholder="Choose a batch…"
              value={selectedBatchId}
              onChange={(v) => {
                setSelectedBatchId(v);
                setSelectedDate(null);
                setSessionLoaded(false);
                setRecords([]);
                setShowGuest(false);
              }}
              data={allBatches.map((b) => ({
                value: b.id,
                label: `${b.name} · ${b.type}`,
              }))}
              searchable
              {...selectSt}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 3 }}>
            <div>
              <Text size="sm" mb={6} style={{ color: "var(--text-primary)", fontWeight: 500 }}>Marked By</Text>
              <input
                value={markedBy}
                onChange={(e) => setMarkedBy(e.target.value)}
                className="w-full text-sm rounded-xl px-3 py-2.5 outline-none transition-colors"
                style={{ background: "var(--bg-input)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
              />
            </div>
          </Grid.Col>
          {batch && (
            <Grid.Col span={{ base: 12, sm: 3 }}>
              <div className="px-3 py-2 rounded-xl flex items-center gap-2"
                style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-default)" }}>
                <IconCalendar size={14} style={{ color: "var(--text-accent)" }} />
                <div>
                  <Text size="xs" style={{ color: "var(--text-muted)" }}>Batch day</Text>
                  <Text size="sm" fw={600} style={{ color: "var(--text-primary)" }}>{batch.day}s</Text>
                </div>
              </div>
            </Grid.Col>
          )}
        </Grid>
      </Paper>

      {/* ── Step 2: Pick date (batch's day only) ───────────────────── */}
      {batch && (
        <Paper className="p-4 sm:p-5"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)" }}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <Title order={5} style={{ color: "var(--text-accent)", fontSize: "clamp(13px,2vw,16px)" }}>
              <span className="flex items-center gap-2">
                <IconCalendar size={15} style={{ color: "var(--text-accent)" }} />
                Pick Date — {batch.day}s only
              </span>
            </Title>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#22c55e" }} />
                <Text size="xs" style={{ color: "var(--text-muted)" }}>Already marked</Text>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--border-default)" }} />
                <Text size="xs" style={{ color: "var(--text-muted)" }}>Not marked</Text>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {batchDates.map((date) => {
              const isMarked   = markedDates.has(date);
              const isSelected = selectedDate === date;
              const d = new Date(date + "T00:00:00");
              return (
                <button key={date}
                  onClick={() => {
                    setSelectedDate(date);
                    setSessionLoaded(false);
                    setRecords([]);
                    setShowGuest(false);
                    loadSession(selectedBatchId!, date);
                  }}
                  className="flex flex-col items-start px-3 py-2.5 rounded-xl text-left transition-all"
                  style={{
                    background: isSelected ? "rgba(249,115,22,0.12)"
                              : isMarked   ? "rgba(34,197,94,0.06)"
                              : "var(--bg-tertiary)",
                    border: `1px solid ${isSelected ? "rgba(249,115,22,0.45)"
                           : isMarked   ? "rgba(34,197,94,0.3)"
                           : "var(--border-default)"}`,
                  }}>
                  <Text size="sm" fw={700}
                    style={{ color: isSelected ? "var(--accent-orange)" : "var(--text-primary)" }}>
                    {d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </Text>
                  <Text size="xs"
                    style={{ color: isSelected ? "var(--accent-orange)" : isMarked ? "#22c55e" : "var(--text-muted)" }}>
                    {isSelected ? "● Selected" : isMarked ? "✓ Marked" : "○ Open"}
                  </Text>
                </button>
              );
            })}
          </div>

          {selectedDate && getSession(selectedBatchId!, selectedDate) && (
            <div className="mt-3 px-3 py-2 rounded-lg flex items-center gap-2"
              style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.25)" }}>
              <IconHistory size={13} style={{ color: "var(--accent-purple)" }} />
              <Text size="xs" style={{ color: "var(--text-accent)" }}>
                Existing session loaded — editing allowed.
              </Text>
            </div>
          )}
        </Paper>
      )}

      {/* ── Step 3: Mark Attendance ─────────────────────────────────── */}
      {sessionLoaded && (
        <>
          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Students", value: stats.total,   color: "var(--text-primary)", bg: "var(--bg-card)"        },
              { label: "Present",        value: stats.present, color: "#22c55e",              bg: "rgba(34,197,94,0.07)" },
              { label: "Absent",         value: stats.absent,  color: "#ef4444",              bg: "rgba(239,68,68,0.07)" },
              { label: "Guest / Recovery", value: stats.guests, color: "#a78bfa",             bg: "rgba(139,92,246,0.07)"},
            ].map((s) => (
              <div key={s.label} className="rounded-xl px-4 py-3 flex items-center gap-3"
                style={{ background: s.bg, border: "1px solid var(--border-card)" }}>
                <Text fw={700} size="xl" style={{ color: s.color }}>{s.value}</Text>
                <Text size="xs" style={{ color: "var(--text-muted)" }}>{s.label}</Text>
              </div>
            ))}
          </div>

          {/* Attendance sheet */}
          <Paper className="p-4 sm:p-5"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)" }}>

            {/* Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
              <Title order={5} style={{ color: "var(--text-accent)", fontSize: "clamp(13px,2vw,16px)" }}>
                <span className="flex items-center gap-2">
                  <IconUsers size={15} style={{ color: "var(--text-accent)" }} />
                  {batch?.name} &nbsp;·&nbsp;
                  <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>
                    {fmtDate(selectedDate!)}
                  </span>
                </span>
              </Title>
              <div className="flex items-center gap-2">
                <Text size="xs" style={{ color: "var(--text-muted)" }}>Mark all:</Text>
                {(["Present","Absent"] as AttendanceStatus[]).map((s) => (
                  <button key={s} onClick={() => markAll(s)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: s === "Present" ? "rgba(34,197,94,0.12)"  : "rgba(239,68,68,0.12)",
                      color:      s === "Present" ? "#22c55e" : "#ef4444",
                      border:     s === "Present" ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(239,68,68,0.3)",
                    }}>
                    All {s}
                  </button>
                ))}
              </div>
            </div>

            <Divider my="sm" style={{ borderColor: "var(--border-default)" }} />

            {/* Regular students */}
            <Stack gap="xs">
              {regularRecords.map((r, i) => {
                const realIdx = records.indexOf(r);
                return (
                  <StudentRow key={r.studentId} record={r} serialNo={i + 1}
                    onChange={(u) => updateRecord(realIdx, u)} />
                );
              })}
            </Stack>

            {/* Guest / Recovery section */}
            {guestRecords.length > 0 && (
              <>
                <div className="flex items-center gap-3 mt-4 mb-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
                    <IconRefresh size={12} style={{ color: "#a78bfa" }} />
                    <Text size="xs" fw={600} style={{ color: "#a78bfa" }}>
                      Guest / Recovery Students ({guestRecords.length})
                    </Text>
                  </div>
                  <div className="flex-1 h-px" style={{ background: "var(--border-default)" }} />
                </div>
                <Stack gap="xs">
                  {guestRecords.map((r, i) => {
                    const realIdx = records.indexOf(r);
                    return (
                      <GuestRow key={r.studentId} record={r} serialNo={i + 1}
                        onChange={(u) => updateRecord(realIdx, u)}
                        onRemove={() => removeRecord(realIdx)} />
                    );
                  })}
                </Stack>
              </>
            )}

            {/* Add Guest button / panel */}
            <div className="mt-4">
              {!showGuest ? (
                <button onClick={() => setShowGuest(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: "rgba(139,92,246,0.06)",
                    border: "1px dashed rgba(139,92,246,0.35)",
                    color: "#a78bfa",
                  }}>
                  <IconUserPlus size={15} />
                  Add Guest / Recovery Student from Another Batch
                  <IconChevronDown size={14} />
                </button>
              ) : (
                <AddGuestPanel
                  currentBatchId={selectedBatchId!}
                  existingStudentIds={records.map((r) => r.studentId)}
                  onAdd={handleAddGuest}
                  onClose={() => setShowGuest(false)}
                />
              )}
            </div>
          </Paper>

          {/* ── Save Actions ─────────────────────────────────────────── */}
          <Group justify="flex-end" gap="sm">
            <button onClick={() => handleSave(false)} disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
              style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}>
              <IconDeviceFloppy size={15} /> Save Draft
            </button>
            <button onClick={() => handleSave(true)} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
              style={{ background: "var(--accent-orange)", color: "white", boxShadow: "0 4px 14px rgba(249,115,22,0.3)" }}>
              <IconCircleCheck size={15} /> Submit Attendance
            </button>
          </Group>
        </>
      )}
    </Stack>
  );
};

export default MarkAttendance;
