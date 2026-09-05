// src/pages/batches/BatchAssign.tsx
// Route: { path: "batches/:id/assign", element: <BatchAssign /> }

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import { IconDeviceFloppy } from "@tabler/icons-react";
import {
  Typography,
  IconButton,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Avatar,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  InfoOutlined as InfoOutlinedIcon,
  CheckCircleOutlined as CheckCircleOutlineIcon,
  ErrorOutlined as ErrorOutlineIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import {
  getBatchById,
  getBatchByIdAPI,
  getAllBatches,
  canAssignStudent,
  BATCH_TYPE_META,
  batchStore,
  assignStudentsToBatchAPI,
  type Batch,
} from "./batchStore";
import { studentCache, loadStudentCache } from "../admin/Users/Student/studentStore";
import { getStudents } from "../../api/api";

export interface AssignableStudent {
  id: string;
  name: string;
  standard: string;
  subject: string;
  rollNo?: string;
  contactNo?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function safeText(val: any, fallback = "–"): string {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "string") return val.trim() || fallback;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") {
    if (val.name) return String(val.name).trim() || fallback;
    if (val.label) return String(val.label).trim() || fallback;
  }
  return fallback;
}

function getStudentName(id: string, map?: Record<string, AssignableStudent>): string {
  if (map && map[id]) return safeText(map[id].name);
  const s = studentCache[id];
  if (!s) return `Student #${id}`;
  return `${s.firstName || ""} ${s.surname || ""}`.trim() || `Student #${id}`;
}

function getStudentStandard(id: string, map?: Record<string, AssignableStudent>): string {
  if (map && map[id] && map[id].standard) return safeText(map[id].standard);
  const s = studentCache[id] as any;
  if (!s) return "–";
  return safeText(s.standard?.name || s.standardName || s.standard);
}

function getStudentSubject(id: string, map?: Record<string, AssignableStudent>): string {
  if (map && map[id] && map[id].subject) return safeText(map[id].subject);
  const s = studentCache[id] as any;
  if (!s) return "–";
  return safeText(s.subject?.name || s.subjectName || s.subject);
}

function getInitials(id: string, map?: Record<string, AssignableStudent>): string {
  const name = getStudentName(id, map);
  const parts = name.split(" ").filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
  return id.slice(0, 2).toUpperCase();
}

function getReasonTag(reason?: string): {
  label: string;
  color: "default" | "error" | "warning" | "info" | "secondary";
} {
  if (!reason) return { label: "", color: "default" };
  if (reason.includes("already assigned")) return { label: "Already in batch", color: "default" };
  if (reason.includes("full capacity")) return { label: "Batch full", color: "error" };
  if (reason.includes("inactive") || reason.includes("completed"))
    return { label: "Batch inactive", color: "warning" };
  if (reason.includes("Regular batch")) return { label: "Regular conflict", color: "info" };
  if (reason.includes("Backlog batch")) return { label: "Backlog conflict", color: "secondary" };
  return { label: "Cannot assign", color: "error" };
}

// ─────────────────────────────────────────────────────────────────────────────
// AssignedRow Component
// ─────────────────────────────────────────────────────────────────────────────

const AssignedRow: React.FC<{
  id: string;
  index: number;
  canRemove: boolean;
  onRemove: () => void;
  studentsMap?: Record<string, AssignableStudent>;
}> = ({ id, index, canRemove, onRemove, studentsMap }) => (
  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
    <div className="flex items-center gap-3 min-w-0">
      <Avatar
        sx={{
          bgcolor: "#2563eb",
          width: 32,
          height: 32,
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {index + 1}
      </Avatar>
      <div className="min-w-0">
        <Typography variant="body2" className="!font-semibold text-slate-800 truncate">
          {getStudentName(id, studentsMap)}
        </Typography>
        <Typography variant="caption" className="text-slate-500">
          Std {getStudentStandard(id, studentsMap)} · {getStudentSubject(id, studentsMap)}
        </Typography>
      </div>
    </div>
    {canRemove && (
      <Tooltip title="Remove from batch">
        <IconButton size="small" color="error" onClick={onRemove} className="hover:bg-red-50">
          <RemoveIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// CandidateRow Component
// ─────────────────────────────────────────────────────────────────────────────

const CandidateRow: React.FC<{
  id: string;
  eligible: boolean;
  reason?: string;
  onAssign: () => void;
  studentsMap?: Record<string, AssignableStudent>;
}> = ({ id, eligible, reason, onAssign, studentsMap }) => {
  const tag = !eligible ? getReasonTag(reason) : null;
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar
          sx={{
            bgcolor: eligible ? "#3b82f6" : "#94a3b8",
            width: 32,
            height: 32,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {getInitials(id, studentsMap)}
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Typography
              variant="body2"
              className={`!font-semibold truncate ${eligible ? "text-slate-800" : "text-slate-400"}`}
            >
              {getStudentName(id, studentsMap)}
            </Typography>
            {tag && (
              <Chip
                label={tag.label}
                size="small"
                color={tag.color}
                variant="outlined"
                sx={{ height: 20, fontSize: 10, fontWeight: 700 }}
              />
            )}
          </div>
          <Typography variant="caption" className="text-slate-500">
            Std {getStudentStandard(id, studentsMap)} · {getStudentSubject(id, studentsMap)}
          </Typography>
          {!eligible && reason && (
            <Typography variant="caption" className="text-red-500 block">
              {reason}
            </Typography>
          )}
        </div>
      </div>
      <Tooltip title={eligible ? "Assign to batch" : (reason ?? "Cannot assign")}>
        <span>
          <IconButton
            size="small"
            color="primary"
            disabled={!eligible}
            onClick={onAssign}
            className="disabled:opacity-40"
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BatchAssign Main Page
// ─────────────────────────────────────────────────────────────────────────────

const BatchAssign: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [batch, setBatch] = useState<Batch | null>(id ? getBatchById(id) : null);
  const [assignedStudentIds, setAssignedStudentIds] = useState<string[]>(
    id && getBatchById(id) ? getBatchById(id)!.studentIds : []
  );
  const [loadingBatch, setLoadingBatch] = useState<boolean>(!batch);
  const [saving, setSaving] = useState<boolean>(false);
  const savingRef = useRef<boolean>(false);
  const [studentsMap, setStudentsMap] = useState<Record<string, AssignableStudent>>({});
  const [, setLoadingStudents] = useState<boolean>(false);

  // Fetch eligible students specifically for this batch's standard and subject
  useEffect(() => {
    if (!batch?.standard_id || !batch?.subject_id) return;

    const fetchStudentsForBatch = async () => {
      setLoadingStudents(true);
      try {
        const res = await getStudents({
          standard_id: batch.standard_id,
          subject_id: batch.subject_id,
        });

        const rawList = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.students)
            ? res.data.students
            : Array.isArray(res.data?.data)
              ? res.data.data
              : [];

        if (rawList.length > 0) {
          const map: Record<string, AssignableStudent> = {};
          rawList.forEach((s: any) => {
            const sid = String(s.id);
            const stdName = s.standard?.name || s.standard || batch.standard || "";
            const subjName = s.subject?.name || s.subject || batch.subject || "";
            const fullName = `${s.first_name || ""} ${s.surname || ""}`.trim() || `Student #${sid}`;

            map[sid] = {
              id: sid,
              name: fullName,
              standard: stdName,
              subject: subjName,
              rollNo: s.roll_no || "",
              contactNo: s.contact_no || "",
            };
          });
          setStudentsMap(map);
          setStudentIds(Object.keys(map));
        } else {
          loadStudentCache().then(() => {
            setStudentIds(Object.keys(studentCache));
          });
        }
      } catch (err) {
        console.error("Error fetching students for batch standard/subject:", err);
        loadStudentCache().then(() => {
          setStudentIds(Object.keys(studentCache));
        });
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudentsForBatch();
  }, [batch?.standard_id, batch?.subject_id]);

  useEffect(() => {
    if (!id) {
      setLoadingBatch(false);
      return;
    }
    const fetchBatchData = async () => {
      setLoadingBatch(true);
      try {
        const fetched = await getBatchByIdAPI(id);
        if (fetched) {
          setBatch(fetched);
          setAssignedStudentIds([...(fetched.studentIds || [])]);
        } else {
          const b = getBatchById(id);
          setBatch(b);
          if (b) setAssignedStudentIds([...(b.studentIds || [])]);
        }
      } catch (err) {
        const b = getBatchById(id);
        setBatch(b);
        if (b) setAssignedStudentIds([...(b.studentIds || [])]);
      } finally {
        setLoadingBatch(false);
      }
    };
    fetchBatchData();
  }, [id]);

  const allBatches = getAllBatches();

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const allStudentIds = studentIds;

  const candidateBatch = useMemo(() => {
    if (!batch) return null;
    return { ...batch, studentIds: assignedStudentIds };
  }, [batch, assignedStudentIds]);

  const candidates = useMemo(() => {
    const q = search.toLowerCase();
    return allStudentIds
      .filter((sid) => !assignedStudentIds.includes(sid))
      .filter((sid) => {
        if (!q) return true;
        return (
          getStudentName(sid, studentsMap).toLowerCase().includes(q) ||
          getStudentStandard(sid, studentsMap).toLowerCase().includes(q) ||
          getStudentSubject(sid, studentsMap).toLowerCase().includes(q)
        );
      })
      .map((sid) => {
        if (!candidateBatch) return { id: sid, eligible: false, reason: "Batch not found" };
        const result = canAssignStudent(sid, candidateBatch, allBatches);
        return { id: sid, eligible: result.ok, reason: result.ok ? undefined : result.reason };
      });
  }, [search, candidateBatch, allBatches, allStudentIds, assignedStudentIds, studentsMap]);

  const handleAssign = (studentId: string) => {
    if (assignedStudentIds.includes(studentId)) return;
    setAssignedStudentIds((prev) => [...prev, studentId]);
    showToast(`${getStudentName(studentId, studentsMap)} added to assignment list.`, true);
  };

  const handleRemove = (studentId: string) => {
    setAssignedStudentIds((prev) => prev.filter((sid) => sid !== studentId));
    showToast(`${getStudentName(studentId, studentsMap)} removed from assignment list.`, true);
  };

  const handleSave = async () => {
    if (!id || !batch || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    try {
      // 1. Call Backend API to persist student assignments
      await assignStudentsToBatchAPI(id, assignedStudentIds);

      // 2. Update local state
      batch.studentIds = [...assignedStudentIds];
      batchStore[id] = { ...batch, studentIds: [...assignedStudentIds] };

      Swal.fire({
        title: "Assignments Saved!",
        html: `<div style="font-size:14px;color:#475569">Successfully saved student assignments for <strong>${batch.name}</strong> (${assignedStudentIds.length} students assigned).</div>`,
        icon: "success",
        confirmButtonText: "Go to Batches",
        confirmButtonColor: "#2563eb",
        customClass: { confirmButton: "rounded-xl px-6 py-2.5 font-medium text-sm shadow-md" },
      }).then(() => navigate("/batches"));
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text: err.message || "Failed to save assignments",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  if (loadingBatch) {
    return (
      <div className="flex items-center justify-center py-24">
        <CircularProgress size={40} />
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Typography className="text-slate-500 font-medium">Batch not found.</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon fontSize="small" />}
          onClick={() => navigate("/batches")}
        >
          Back to Batches
        </Button>
      </div>
    );
  }

  const typeMeta = BATCH_TYPE_META[batch.type];
  const fillPct = Math.min((assignedStudentIds.length / batch.capacity) * 100, 100);
  const fillColor =
    assignedStudentIds.length >= batch.capacity
      ? "#ef4444"
      : fillPct >= 80
      ? "#f59e0b"
      : "#2563eb";
  const canEdit = batch.status === "Active";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ── Toast Popup Notification ──────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl ${
            toast.ok
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {toast.ok ? (
            <CheckCircleOutlineIcon fontSize="small" />
          ) : (
            <ErrorOutlineIcon fontSize="small" />
          )}
          <Typography variant="body2" className="!font-medium">
            {toast.msg}
          </Typography>
          <IconButton size="small" onClick={() => setToast(null)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      )}

      {/* ── Page Header ────────────────────────────────────────────────── */}
      <PageHeader
        title="Assign Students to Batch"
        subtitle="Manage and assign students to this batch"
        onBack={() => navigate("/batches")}
      />

      {/* ── Batch Summary Banner Card ────────────────────────────────────── */}
      <Card
        elevation={1}
        className="bg-white border border-slate-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all"
      >
        <CardContent className="!p-5 sm:!p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar sx={{ bgcolor: "#eff6ff", color: "#2563eb", width: 44, height: 44 }}>
                <GroupIcon />
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Chip label={batch.type} size="small" color="primary" sx={{ fontWeight: 700 }} />
                  <Chip
                    label={batch.status}
                    size="small"
                    color={batch.status === "Active" ? "success" : "warning"}
                    variant="outlined"
                    sx={{ fontWeight: 700 }}
                  />
                  <Chip
                    label={`${batch.subject} · ${batch.standard}`}
                    size="small"
                    variant="outlined"
                  />
                </div>
                <Typography variant="h6" className="!font-bold text-slate-800">
                  {batch.name}
                </Typography>
                <Typography variant="body2" className="text-slate-500">
                  Teacher: {batch.teacherName} | Day: {batch.day} | Time: {batch.timeSlot}
                </Typography>
              </div>
            </div>

            {/* Capacity Progress Meter */}
            <div className="flex flex-col items-start sm:items-end gap-1">
              <div className="flex items-baseline gap-1">
                <Typography variant="h5" className="!font-extrabold text-slate-800">
                  {assignedStudentIds.length}
                </Typography>
                <Typography variant="body2" className="text-slate-500 font-medium">
                  / {batch.capacity} Students
                </Typography>
              </div>
              <div className="w-32 h-2.5 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${fillPct}%`, backgroundColor: fillColor }}
                />
              </div>
            </div>
          </div>

          {/* Type Rule Description Hint */}
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center gap-2">
            <InfoOutlinedIcon fontSize="small" className="text-blue-600" />
            <Typography variant="caption" className="text-blue-900 font-medium">
              <span className="font-bold">{batch.type} Rule:</span> {typeMeta.description}
            </Typography>
          </div>

          {!canEdit && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-800">
              <InfoOutlinedIcon fontSize="small" />
              <Typography variant="caption" className="font-semibold">
                This batch is {batch.status} — student assignments are currently locked.
              </Typography>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Blocked Reasons Legend Card ───────────────────────────────── */}
      <Card
        elevation={1}
        className="bg-white border border-slate-200/60 rounded-2xl shadow-sm"
      >
        <CardContent className="!p-4 flex items-center gap-3 flex-wrap">
          <Typography variant="caption" className="!font-bold text-slate-500 uppercase tracking-wider">
            Blocked Legend:
          </Typography>
          {[
            { label: "Already in batch", color: "default" as const, desc: "Student is already in this batch" },
            { label: "Batch full", color: "error" as const, desc: "Maximum capacity reached" },
            { label: "Regular conflict", color: "info" as const, desc: "Regular batch already assigned for subject" },
            { label: "Backlog conflict", color: "secondary" as const, desc: "Backlog batch already assigned" },
            { label: "Batch inactive", color: "warning" as const, desc: "Batch is inactive or completed" },
          ].map((item) => (
            <Tooltip key={item.label} title={item.desc} arrow>
              <Chip label={item.label} size="small" color={item.color} variant="outlined" sx={{ cursor: "help", fontWeight: 600 }} />
            </Tooltip>
          ))}
        </CardContent>
      </Card>

      {/* ── Two Columns: Assigned vs Candidates Cards ─────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column — Assigned Students Card */}
        <Card
          elevation={1}
          className="bg-white border border-slate-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all"
        >
          <CardContent className="!p-5 sm:!p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Avatar sx={{ bgcolor: "#eff6ff", color: "#2563eb", width: 32, height: 32 }}>
                  <GroupIcon fontSize="small" />
                </Avatar>

                <Typography variant="h6" className="!font-bold text-slate-800">
                  Assigned Students
                </Typography>
              </div>

              <Chip
                label={`${assignedStudentIds.length} / ${batch.capacity}`}
                color={assignedStudentIds.length >= batch.capacity ? "error" : "success"}
                size="small"
                sx={{ fontWeight: 700 }}
              />
            </div>

            {assignedStudentIds.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                <PersonIcon fontSize="large" />
                <Typography variant="body2">No students assigned to this batch yet.</Typography>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto pr-1">
                {assignedStudentIds.map((sid, idx) => (
                  <AssignedRow
                    key={sid}
                    id={sid}
                    index={idx}
                    canRemove={canEdit}
                    onRemove={() => handleRemove(sid)}
                    studentsMap={studentsMap}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column — Candidate Students Card */}
        <Card
          elevation={1}
          className="bg-white border border-slate-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all"
        >
          <CardContent className="!p-5 sm:!p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Avatar sx={{ bgcolor: "#eff6ff", color: "#2563eb", width: 32, height: 32 }}>
                  <PersonIcon fontSize="small" />
                </Avatar>

                <Typography variant="h6" className="!font-bold text-slate-800">
                  All Candidate Students
                </Typography>
              </div>

              <Chip
                label={`${candidates.length} Available`}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ fontWeight: 700 }}
              />
            </div>

            {/* Search Input Box */}
            <TextField
              placeholder="Search student by name, std, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              fullWidth
              autoComplete="off"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="text-slate-400" fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: search ? (
                    <IconButton size="small" onClick={() => setSearch("")}>
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

            {candidates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                <SearchIcon fontSize="large" />
                <Typography variant="body2">No matching candidate students found.</Typography>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto pr-1">
                {candidates.map(({ id: sid, eligible, reason }) => (
                  <CandidateRow
                    key={sid}
                    id={sid}
                    eligible={eligible && canEdit}
                    reason={!canEdit ? "Batch is not active" : reason}
                    onAssign={() => handleAssign(sid)}
                    studentsMap={studentsMap}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Save / Cancel Action Bar ────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pt-2 pb-6">
        <button
          type="button"
          onClick={() => navigate("/batches")}
          className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all flex items-center gap-2 shadow-sm"
        >
          <CloseIcon fontSize="small" />
          <span>Cancel</span>
        </button>

        <button
          type="button"
          disabled={saving || !canEdit}
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <IconDeviceFloppy size={18} className="text-white" stroke={2.5} />
          )}
          <span>Save Assignments</span>
        </button>
      </div>
    </div>
  );
};

export default BatchAssign;