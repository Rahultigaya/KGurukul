// src/pages/batches/BatchAssign.tsx
// Route: { path: "batches/:id/assign", element: <BatchAssign /> }

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Save as SaveIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import {
  getBatchById,
  getBatchByIdAPI,
  getAllBatches,
  canAssignStudent,
  BATCH_TYPE_META,
  batchStore,
  type Batch,
} from "./batchStore";
import { studentCache, loadStudentCache } from "../admin/Users/Student/studentStore";
import { getAllStandards, getAllSubjects } from "../admin/Master/masterStore";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getStudentName(id: string): string {
  const s = studentCache[id];
  if (!s) return `Student #${id}`;
  return `${s.firstName} ${s.surname}`;
}

function getStudentStandard(id: string, stdMap?: Record<string, string>): string {
  const s = studentCache[id] as any;
  if (!s) return "–";
  const raw = s.standardName || s.standard;
  if (!raw) return "–";
  return stdMap?.[raw] ?? stdMap?.[s.standard] ?? raw;
}

function getStudentSubject(id: string, subMap?: Record<string, string>): string {
  const s = studentCache[id] as any;
  if (!s) return "–";
  const raw = s.subjectName || s.subject;
  if (!raw) return "–";
  return subMap?.[raw] ?? subMap?.[s.subject] ?? raw;
}

function getInitials(id: string): string {
  const s = studentCache[id];
  if (!s) return id.slice(0, 2).toUpperCase();
  return `${s.firstName[0]}${s.surname[0]}`.toUpperCase();
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
  stdMap?: Record<string, string>;
  subMap?: Record<string, string>;
}> = ({ id, index, canRemove, onRemove, stdMap, subMap }) => (
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
          {getStudentName(id)}
        </Typography>
        <Typography variant="caption" className="text-slate-500">
          Std {getStudentStandard(id, stdMap)} · {getStudentSubject(id, subMap)}
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
  stdMap?: Record<string, string>;
  subMap?: Record<string, string>;
}> = ({ id, eligible, reason, onAssign, stdMap, subMap }) => {
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
          {getInitials(id)}
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Typography
              variant="body2"
              className={`!font-semibold truncate ${eligible ? "text-slate-800" : "text-slate-400"}`}
            >
              {getStudentName(id)}
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
            Std {getStudentStandard(id, stdMap)} · {getStudentSubject(id, subMap)}
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
  const [stdMap, setStdMap] = useState<Record<string, string>>({});
  const [subMap, setSubMap] = useState<Record<string, string>>({});

  useEffect(() => {
    loadStudentCache().then(() => {
      setStudentIds(Object.keys(studentCache));
    });
    Promise.all([getAllStandards(), getAllSubjects()]).then(([stds, subjs]) => {
      const sMap: Record<string, string> = {};
      stds.forEach((item) => { sMap[String(item.id)] = item.name; });
      setStdMap(sMap);

      const subObj: Record<string, string> = {};
      subjs.forEach((item) => { subObj[String(item.id)] = item.name; });
      setSubMap(subObj);
    }).catch(console.error);
  }, []);

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
          getStudentName(sid).toLowerCase().includes(q) ||
          getStudentStandard(sid, stdMap).toLowerCase().includes(q) ||
          getStudentSubject(sid, subMap).toLowerCase().includes(q)
        );
      })
      .map((sid) => {
        if (!candidateBatch) return { id: sid, eligible: false, reason: "Batch not found" };
        const result = canAssignStudent(sid, candidateBatch, allBatches);
        return { id: sid, eligible: result.ok, reason: result.ok ? undefined : result.reason };
      });
  }, [search, candidateBatch, allBatches, allStudentIds, assignedStudentIds, stdMap, subMap]);

  const handleAssign = (studentId: string) => {
    if (assignedStudentIds.includes(studentId)) return;
    setAssignedStudentIds((prev) => [...prev, studentId]);
    showToast(`${getStudentName(studentId)} added to assignment list.`, true);
  };

  const handleRemove = (studentId: string) => {
    setAssignedStudentIds((prev) => prev.filter((sid) => sid !== studentId));
    showToast(`${getStudentName(studentId)} removed from assignment list.`, true);
  };

  const handleSave = async () => {
    if (!id || !batch) return;
    setSaving(true);
    try {
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
      setSaving(false);
      Swal.fire({
        title: "Error",
        text: err.message || "Failed to save assignments",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
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
      <div className="flex items-center gap-3">
        <IconButton onClick={() => navigate("/batches")} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <div>
          <Typography variant="h5" className="!font-bold text-slate-800">
            Assign Students
          </Typography>
          <Typography variant="body2" className="text-slate-500">
            {batch.name}
          </Typography>
        </div>
      </div>

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
                    stdMap={stdMap}
                    subMap={subMap}
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
                    stdMap={stdMap}
                    subMap={subMap}
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
            <SaveIcon fontSize="small" />
          )}
          <span>Save Assignments</span>
        </button>
      </div>
    </div>
  );
};

export default BatchAssign;