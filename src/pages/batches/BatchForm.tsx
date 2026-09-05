import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import {
  Typography,
  Card,
  CardContent,
  Autocomplete,
  TextField,
  Button,
} from "@mui/material";
import {
  Alert, Badge, Text,
} from "@mantine/core";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  LocationOn as LocationOnIcon,
  CalendarMonth as CalendarMonthIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  AutoAwesome as AutoAwesomeIcon,
  ErrorOutlined as ErrorOutlineIcon,
  Close as CloseIcon,
  InfoOutlined as InfoOutlinedIcon,
} from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import {
  DAYS, BATCH_TYPES, BATCH_STATUSES, BATCH_TYPE_META,
  generateBatchName,
  createBatchAPI, updateBatchAPI, getBatchByIdAPI,
  type BatchType, type BatchStatus,
} from "./batchStore";
import {
  getAllAreas,
  getAllBranches,
  getAllStandards,
  getAllSubjects,
  getAllTeachers,
  getTeacherFullName,
  type Area as MasterArea,
  type Branch as MasterBranch,
  type Standard as MasterStandard,
  type Subject as MasterSubject,
  type Teacher as MasterTeacher,
} from "../admin/Master/masterStore";
import { IconCheck } from "@tabler/icons-react";

// ─────────────────────────────────────────────────────────────────────────────


interface OptionItem {
  value: string;
  label: string;
}

function findOption(options: OptionItem[], value: string | number | null | undefined): OptionItem | null {
  if (value === null || value === undefined || value === "") return null;
  const strVal = String(value).trim();
  return options.find((o) => o.value === strVal) || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Time helpers
// ─────────────────────────────────────────────────────────────────────────────

function to12h(t: string): string {
  if (!t) return "";
  const [hStr, m] = t.split(":");
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m} ${ampm}`;
}

function buildTimeSlot(start: string, end: string): string {
  if (!start || !end) return "";
  return `${to12h(start)} – ${to12h(end)}`;
}

function parseTimeSlot(slot: string): { startTime: string; endTime: string } {
  if (!slot) return { startTime: "", endTime: "" };
  const parts = slot.split(/\s*[-–—]\s*/).map((s) => s.trim());
  if (parts.length !== 2) return { startTime: "", endTime: "" };
  const to24 = (t: string) => {
    const match = t.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    if (!match) return "";
    let h = parseInt(match[1], 10);
    const m = match[2];
    const ap = match[3].toUpperCase();
    if (ap === "AM" && h === 12) h = 0;
    else if (ap === "PM" && h !== 12) h += 12;
    return `${String(h).padStart(2, "0")}:${m}`;
  };
  return { startTime: to24(parts[0]), endTime: to24(parts[1]) };
}

const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

function parse24to12(time24: string, defaultHour = "09", defaultAmPm = "AM") {
  if (!time24) return { hour: defaultHour, minute: "00", ampm: defaultAmPm };
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr || defaultHour, 10);
  const m = mStr || "00";
  const ampm = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  const hourStr = String(h).padStart(2, "0");
  return { hour: hourStr, minute: m, ampm };
}

function build24From12(hourStr: string, minuteStr: string, ampm: string): string {
  let h = parseInt(hourStr, 10) || 12;
  if (ampm === "PM" && h < 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  const h24 = String(h).padStart(2, "0");
  const m24 = String(minuteStr).padStart(2, "0");
  return `${h24}:${m24}`;
}

const AmPmTimePicker: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  error?: boolean;
  helperText?: string;
  defaultHour?: string;
  defaultAmPm?: "AM" | "PM";
}> = ({ label, value, onChange, error, helperText, defaultHour = "09", defaultAmPm = "AM" }) => {
  useEffect(() => {
    if (!value) {
      onChange(build24From12(defaultHour, "00", defaultAmPm));
    }
  }, [value, defaultHour, defaultAmPm, onChange]);

  const { hour, minute, ampm } = parse24to12(value, defaultHour, defaultAmPm);

  const handleHourChange = (newHour: string) => {
    let nextAmPm = ampm;
    // When selecting 12 from an AM time (e.g. 9 AM -> 12), default to 12 PM (Noon)
    if (newHour === "12" && ampm === "AM") {
      nextAmPm = "PM";
    }
    onChange(build24From12(newHour, minute, nextAmPm));
  };

  const handleMinChange = (newMin: string) => {
    onChange(build24From12(hour, newMin, ampm));
  };

  const handleAmPmToggle = (newAmPm: string) => {
    onChange(build24From12(hour, minute, newAmPm));
  };

  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-slate-700">
        {label}
      </label>
      <div
        className={`flex items-center gap-1.5 p-1.5 rounded-xl border bg-white shadow-sm transition-all ${
          error
            ? "border-red-500 ring-1 ring-red-500 bg-red-50/20"
            : "border-slate-400 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500"
        }`}
      >
        {/* Hour Dropdown */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 pl-1">Hr</span>
          <select
            value={hour}
            onChange={(e) => handleHourChange(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 py-1 px-2 focus:outline-none cursor-pointer hover:border-blue-400"
          >
            {HOURS_12.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>

        <span className="font-bold text-slate-400 text-sm">:</span>

        {/* Minute Dropdown */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Min</span>
          <select
            value={minute}
            onChange={(e) => handleMinChange(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 py-1 px-2 focus:outline-none cursor-pointer hover:border-blue-400"
          >
            {MINUTES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* AM / PM Segmented Control */}
        <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg ml-auto border border-slate-300/50">
          <button
            type="button"
            onClick={() => handleAmPmToggle("AM")}
            className={`px-2.5 py-1 text-xs font-extrabold rounded-md transition-all ${
              ampm === "AM"
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            AM
          </button>
          <button
            type="button"
            onClick={() => handleAmPmToggle("PM")}
            className={`px-2.5 py-1 text-xs font-extrabold rounded-md transition-all ${
              ampm === "PM"
                ? "bg-indigo-600 text-white shadow-md scale-105"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            PM
          </button>
        </div>
      </div>
      {helperText && (
        <p className="text-xs text-red-500 font-medium pl-1">{helperText}</p>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Form types
// ─────────────────────────────────────────────────────────────────────────────

interface FormData {
  area_id: number | null;
  branch_id: number | null;
  day: string | null;
  startTime: string;
  endTime: string;
  subject_id: number | null;
  standard_id: number | null;
  teacher_id: number | null;
  capacity: number | string;
  type: BatchType;
  status: BatchStatus;
}
type FormErrors = Partial<Record<keyof FormData, string>>;

const emptyForm: FormData = {
  area_id: null, branch_id: null, day: null,
  startTime: "09:00", endTime: "11:00",
  subject_id: null, standard_id: null, teacher_id: null,
  capacity: 30, type: "Regular", status: "Active",
};

// ─────────────────────────────────────────────────────────────────────────────
// Batch Name Preview
// ─────────────────────────────────────────────────────────────────────────────

const BatchNamePreview: React.FC<{
  area: string | null; branch: string | null; day: string | null;
  startTime: string; endTime: string;
}> = ({ area, branch, day, startTime, endTime }) => {
  const hasAny = !!(area || branch || day || startTime || endTime);
  const isComplete = !!(area && branch && day && startTime && endTime);

  const tokens = [
    { label: "Area", value: area, filled: !!area },
    { label: "Branch", value: branch, filled: !!branch },
    { label: "Day", value: day, filled: !!day },
    {
      label: "Time",
      value: startTime && endTime ? buildTimeSlot(startTime, endTime)
        : startTime ? `${to12h(startTime)} – ?`
          : endTime ? `? – ${to12h(endTime)}` : null,
      filled: !!(startTime && endTime),
    },
  ];

  if (!hasAny)
    return (
      <Text size="sm" fs="italic" className="text-muted">
        Fill Area, Branch, Day and Time to generate name…
      </Text>
    );

  return (
    <div>
      <p className="font-bold text-base tracking-wide flex flex-wrap items-center gap-0">
        {tokens.map((t, i) => (
          <span key={i} className="flex items-center">
            <span style={{ color: t.filled ? "var(--accent-orange)" : "var(--text-muted)", fontStyle: t.filled ? "normal" : "italic", fontSize: t.filled ? undefined : "13px" }}>
              {t.filled ? t.value : `[ ${t.label} ]`}
            </span>
            {i < tokens.length - 1 && (
              <span className="mx-1.5 text-muted">·</span>
            )}
          </span>
        ))}
        {isComplete && (
          <Badge size="xs" variant="light" color="green" leftSection={<IconCheck size={9} />} ml="sm"
            styles={{ root: { textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 } }}>
            Complete
          </Badge>
        )}
      </p>

      {hasAny && !isComplete && (
        <div className="flex items-center gap-2 mt-2">
          {[
            { label: "Area", filled: !!area },
            { label: "Branch", filled: !!branch },
            { label: "Day", filled: !!day },
            { label: "Start", filled: !!startTime },
            { label: "End", filled: !!endTime },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full transition-all`}
                style={{ background: s.filled ? "var(--accent-orange)" : "var(--border-default)" }} />
              <span className="text-[10px]"
                style={{ color: s.filled ? "var(--accent-orange)" : "var(--text-muted)" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BatchForm
// ─────────────────────────────────────────────────────────────────────────────

interface BatchFormProps { mode: "create" | "edit"; }

const BatchForm: React.FC<BatchFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { id: batchId } = useParams<{ id: string }>();

  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Master data state
  const [areas, setAreas] = useState<MasterArea[]>([]);
  const [branches, setBranches] = useState<MasterBranch[]>([]);
  const [standards, setStandards] = useState<MasterStandard[]>([]);
  const [subjects, setSubjects] = useState<MasterSubject[]>([]);
  const [teachers, setTeachers] = useState<MasterTeacher[]>([]);
  const [loadingMasterData, setLoadingMasterData] = useState(false);

  useEffect(() => {
    const loadBatchForEdit = async () => {
      if (mode !== "edit" || !batchId) return;
      try {
        const batch = await getBatchByIdAPI(batchId);
        if (!batch) { setNotFound(true); return; }

        const parsedTimes = parseTimeSlot(batch.timeSlot);
        const startTime = batch.start_time || (batch as any).startTime || parsedTimes.startTime || "09:00";
        const endTime = batch.end_time || (batch as any).endTime || parsedTimes.endTime || "11:00";

        // Extract IDs directly from backend response fields first, with name lookup as fallback
        const areaId = batch.area_id != null ? Number(batch.area_id) : (areas.find(a => a.name === batch.area)?.id != null ? Number(areas.find(a => a.name === batch.area)!.id) : null);
        const branchId = batch.branch_id != null ? Number(batch.branch_id) : (branches.find(b => b.name === batch.branch)?.id != null ? Number(branches.find(b => b.name === batch.branch)!.id) : null);
        const subjectId = batch.subject_id != null ? Number(batch.subject_id) : (subjects.find(s => s.name === batch.subject)?.id != null ? Number(subjects.find(s => s.name === batch.subject)!.id) : null);
        const standardId = batch.standard_id != null ? Number(batch.standard_id) : (standards.find(s => s.name === batch.standard)?.id != null ? Number(standards.find(s => s.name === batch.standard)!.id) : null);
        const teacherId = batch.teacher_id != null ? Number(batch.teacher_id) : (teachers.find(t => String(t.id) === String(batch.teacherId) || getTeacherFullName(t) === batch.teacherName)?.id != null ? Number(teachers.find(t => String(t.id) === String(batch.teacherId) || getTeacherFullName(t) === batch.teacherName)!.id) : null);

        setForm({
          area_id: areaId,
          branch_id: branchId,
          day: batch.day || null,
          startTime,
          endTime,
          subject_id: subjectId,
          standard_id: standardId,
          teacher_id: teacherId,
          capacity: batch.capacity ?? 30,
          type: batch.type || "Regular",
          status: batch.status || "Active",
        });
      } catch (err) {
        console.error("Error loading batch:", err);
        setNotFound(true);
      }
    };
    loadBatchForEdit();
  }, [mode, batchId, areas, branches, subjects, standards, teachers]);

  // Load master data from backend
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        setLoadingMasterData(true);
        const [areasData, standardsData, branchesData, subjectsData, teachersData] = await Promise.all([
          getAllAreas(),
          getAllStandards(),
          getAllBranches(),
          getAllSubjects(),
          getAllTeachers(),
        ]);
        setAreas(areasData);
        setStandards(standardsData);
        setBranches(branchesData);
        setSubjects(subjectsData);
        setTeachers(teachersData);
      } catch (error: any) {
        console.error("Error loading master data:", error);
        console.error("Error message:", error.message);
        console.error("Error response:", error.response);
      } finally {
        setLoadingMasterData(false);
      }
    };

    loadMasterData();
  }, []);

  const timeSlot = buildTimeSlot(form.startTime, form.endTime);

  // Filter branches based on selected area (including current branch if assigned)
  const branchOpts = form.area_id
    ? branches
      .filter(b => String(b.area_id) === String(form.area_id) && (Number(b.is_active) === 1 || String(b.id) === String(form.branch_id)))
      .map(b => ({ value: String(b.id), label: b.name }))
    : [];

  const set = (field: keyof FormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.area_id) e.area_id = "Required";
    if (!form.branch_id) e.branch_id = "Required";
    if (!form.day) e.day = "Required";
    if (!form.startTime) e.startTime = "Required";
    if (!form.endTime) e.endTime = "Required";
    if (form.startTime && form.endTime && form.startTime >= form.endTime)
      e.endTime = "End time must be after start time";
    if (!form.subject_id) e.subject_id = "Required";
    if (!form.standard_id) e.standard_id = "Required";
    if (!form.teacher_id) e.teacher_id = "Required";
    if (!form.capacity || Number(form.capacity) < 1) e.capacity = "Minimum 1";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);

    try {
      const slot = buildTimeSlot(form.startTime, form.endTime);

      // Get names for display
      const areaName = areas.find(a => a.id === form.area_id)?.name || "";
      const branchName = branches.find(b => b.id === form.branch_id)?.name || "";
      const subjectName = subjects.find(s => s.id === form.subject_id)?.name || "";
      const standardName = standards.find(s => s.id === form.standard_id)?.name || "";
      const teacherName = teachers.find(t => t.id === form.teacher_id)
        ? getTeacherFullName(teachers.find(t => t.id === form.teacher_id)!)
        : "";
      const name = generateBatchName(areaName, branchName, form.day!, slot);

      if (mode === "create") {
        await createBatchAPI({
          area_id: form.area_id!,
          branch_id: form.branch_id!,
          day: form.day!,
          start_time: form.startTime,
          end_time: form.endTime,
          time_slot: slot,
          subject_id: form.subject_id!,
          standard_id: form.standard_id!,
          teacher_id: form.teacher_id!,
          capacity: Number(form.capacity),
          type: form.type,
          status: form.status,
        });
      } else if (batchId) {
        await updateBatchAPI(batchId, {
          area_id: form.area_id!,
          branch_id: form.branch_id!,
          day: form.day!,
          start_time: form.startTime,
          end_time: form.endTime,
          time_slot: slot,
          subject_id: form.subject_id!,
          standard_id: form.standard_id!,
          teacher_id: form.teacher_id!,
          capacity: Number(form.capacity),
          type: form.type,
          status: form.status,
        });
      }

      setSaving(false);
      Swal.fire({
        title: mode === "create" ? "Batch Created!" : "Batch Updated!",
        html: `
          <div style="color:#475569; font-size:14px; line-height:1.8">
            <div style="color:#2563eb; font-weight:700; font-size:16px; margin-bottom:12px">${name}</div>
            <div style="margin-bottom:4px"><strong>Branch & Area:</strong> ${branchName} · ${areaName}</div>
            <div style="margin-bottom:4px"><strong>Schedule:</strong> ${form.day} · ${slot}</div>
            <div style="margin-bottom:4px"><strong>Subject & Standard:</strong> ${subjectName} – ${standardName}</div>
            <div><strong>Teacher & Capacity:</strong> ${teacherName} · Capacity: ${form.capacity}</div>
          </div>`,
        icon: "success",
        confirmButtonText: "Go to Batches",
        confirmButtonColor: "#2563eb",
        customClass: { confirmButton: "rounded-xl px-6 py-2.5 font-medium text-sm shadow-md" },
      }).then(() => navigate("/batches"));
    } catch (error: any) {
      setSaving(false);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to create batch",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  if (notFound)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Text className="text-secondary">Batch not found.</Text>
        <Button variant="contained" color="primary" startIcon={<ArrowBackIcon fontSize="small" />} onClick={() => navigate("/batches")}>
          Back to Batches
        </Button>
      </div>
    );

  const errorCount = Object.keys(errors).length;

  const areaOptions: OptionItem[] = areas
    .filter((a) => Number(a.is_active) === 1 || String(a.id) === String(form.area_id))
    .map((a) => ({ value: String(a.id), label: a.name }));

  const dayOptions: OptionItem[] = DAYS.map((d) => ({ value: d, label: d }));

  const subjectOptions: OptionItem[] = subjects
    .filter((s) => Number(s.is_active) === 1 || String(s.id) === String(form.subject_id))
    .map((s) => ({ value: String(s.id), label: s.name }));

  const standardOptions: OptionItem[] = standards
    .filter((s) => Number(s.is_active) === 1 || String(s.id) === String(form.standard_id))
    .map((s) => ({ value: String(s.id), label: s.name }));

  const teacherOptions: OptionItem[] = teachers
    .filter((t) => t.status === "Active" || String(t.id) === String(form.teacher_id))
    .map((t) => ({ value: String(t.id), label: getTeacherFullName(t) }));

  const batchTypeOptions: OptionItem[] = BATCH_TYPES.map((t) => ({ value: t, label: t }));

  const statusOptions: OptionItem[] = BATCH_STATUSES.map((s) => ({ value: s, label: s }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Loading indicator for master data */}
      {loadingMasterData && (
        <Alert icon={<CircularProgress size={18} />} title="Loading data" color="blue" className="rounded-xl">
          Loading areas, branches, standards, subjects, and teachers from server...
        </Alert>
      )}

      {/* ── Header ────────────────────────────────────────────────────── */}
      <PageHeader
        title={mode === "edit" ? "Edit Batch" : "Create Batch"}
        subtitle={mode === "edit" ? "Update the batch details below" : "Fill in the details to create a new batch"}
      />

      {/* ── Batch name preview banner ──────────────────────────────────── */}
      <Card
        elevation={1}
        className="bg-white border border-slate-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all"
      >
        <CardContent className="!p-5 sm:!p-6 space-y-3">
          <Typography variant="h6" className="!font-bold !text-slate-800 !text-base sm:!text-lg flex items-center gap-2">
            <AutoAwesomeIcon className="text-blue-600" fontSize="small" />
            Auto-Generated Batch Name
          </Typography>
          <div className="pt-1">
            <BatchNamePreview
              area={areas.find(a => a.id === form.area_id)?.name ?? null}
              branch={branches.find(b => b.id === form.branch_id)?.name ?? null}
              day={form.day}
              startTime={form.startTime}
              endTime={form.endTime}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Error alert ───────────────────────────────────────────────── */}
      {errorCount > 0 && (
        <Alert icon={<ErrorOutlineIcon fontSize="small" />} title="Error" color="red" variant="light" className="rounded-xl">
          {errorCount === 1 ? "1 required field is missing or invalid." : `${errorCount} required fields are missing or invalid.`}
        </Alert>
      )}

      {/* ── 3 Section Cards in 1 Horizontal Row ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Location & Academic */}
        <Card
          elevation={1}
          className="bg-white border border-slate-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all flex flex-col justify-between"
        >
          <CardContent className="!p-5 sm:!p-6 space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <Typography variant="h6" className="!font-bold !text-slate-800 !text-base sm:!text-lg flex items-center gap-2 pb-2 border-b border-slate-100">
                <LocationOnIcon className="text-blue-600" fontSize="small" />
                Location & Academic
              </Typography>

              <div className="space-y-3.5 pt-1">
                <Autocomplete
                  options={areaOptions}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  value={findOption(areaOptions, form.area_id)}
                  onChange={(_e, newValue) => {
                    set("area_id", newValue ? Number(newValue.value) : null);
                    set("branch_id", null);
                  }}
                  size="small"
                  disabled={loadingMasterData || mode === "edit"}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Area *"
                      placeholder="Select area"
                      error={Boolean(errors.area_id)}
                      helperText={errors.area_id}
                    />
                  )}
                />

                <Autocomplete
                  options={branchOpts}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  value={findOption(branchOpts, form.branch_id)}
                  onChange={(_e, newValue) => set("branch_id", newValue ? Number(newValue.value) : null)}
                  size="small"
                  disabled={!form.area_id || mode === "edit"}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Branch *"
                      placeholder={form.area_id ? "Select branch" : "Select area first"}
                      error={Boolean(errors.branch_id)}
                      helperText={errors.branch_id}
                    />
                  )}
                />

                <Autocomplete
                  options={subjectOptions}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  value={findOption(subjectOptions, form.subject_id)}
                  onChange={(_e, newValue) => set("subject_id", newValue ? Number(newValue.value) : null)}
                  size="small"
                  disabled={loadingMasterData}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Subject *"
                      placeholder="Select subject"
                      error={Boolean(errors.subject_id)}
                      helperText={errors.subject_id}
                    />
                  )}
                />

                <Autocomplete
                  options={standardOptions}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  value={findOption(standardOptions, form.standard_id)}
                  onChange={(_e, newValue) => set("standard_id", newValue ? Number(newValue.value) : null)}
                  size="small"
                  disabled={loadingMasterData}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Standard *"
                      placeholder="Select standard"
                      error={Boolean(errors.standard_id)}
                      helperText={errors.standard_id}
                    />
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Schedule & Timing */}
        <Card
          elevation={1}
          className="bg-white border border-slate-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all flex flex-col justify-between"
        >
          <CardContent className="!p-5 sm:!p-6 space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <Typography variant="h6" className="!font-bold !text-slate-800 !text-base sm:!text-lg flex items-center gap-2 pb-2 border-b border-slate-100">
                <CalendarMonthIcon className="text-blue-600" fontSize="small" />
                Schedule & Timing
              </Typography>

              <div className="space-y-3.5 pt-1">
                <Autocomplete
                  options={dayOptions}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  value={findOption(dayOptions, form.day)}
                  onChange={(_e, newValue) => set("day", newValue ? newValue.value : null)}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Day *"
                      placeholder="Select day"
                      error={Boolean(errors.day)}
                      helperText={errors.day}
                    />
                  )}
                />

                <AmPmTimePicker
                  label="Start Time *"
                  value={form.startTime}
                  onChange={(val) => set("startTime", val)}
                  error={Boolean(errors.startTime)}
                  helperText={errors.startTime}
                />

                <AmPmTimePicker
                  label="End Time *"
                  value={form.endTime}
                  onChange={(val) => set("endTime", val)}
                  error={Boolean(errors.endTime)}
                  helperText={errors.endTime}
                  defaultHour="11"
                  defaultAmPm="AM"
                />
              </div>
            </div>

            {/* Time preview pill */}
            {form.startTime && form.endTime && (
              <div className="mt-2 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-50 border border-blue-200">
                <AccessTimeIcon className="text-blue-600 shrink-0" fontSize="small" />
                <Text size="sm" fw={600} className="text-blue-700">{timeSlot}</Text>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 3: Faculty & Settings */}
        <Card
          elevation={1}
          className="bg-white border border-slate-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all flex flex-col justify-between"
        >
          <CardContent className="!p-5 sm:!p-6 space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <Typography variant="h6" className="!font-bold !text-slate-800 !text-base sm:!text-lg flex items-center gap-2 pb-2 border-b border-slate-100">
                <PersonIcon className="text-blue-600" fontSize="small" />
                Faculty & Settings
              </Typography>

              <div className="space-y-3.5 pt-1">
                <Autocomplete
                  options={teacherOptions}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  value={findOption(teacherOptions, form.teacher_id)}
                  onChange={(_e, newValue) => set("teacher_id", newValue ? Number(newValue.value) : null)}
                  size="small"
                  disabled={loadingMasterData}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Teacher *"
                      placeholder="Select teacher"
                      error={Boolean(errors.teacher_id)}
                      helperText={errors.teacher_id}
                    />
                  )}
                />

                <TextField
                  label="Capacity *"
                  placeholder="Max students"
                  type="number"
                  size="small"
                  fullWidth
                  value={form.capacity}
                  onChange={(e) => set("capacity", e.target.value)}
                  error={Boolean(errors.capacity)}
                  helperText={errors.capacity}
                  slotProps={{
                    htmlInput: { min: 1, max: 100 }
                  }}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Autocomplete
                    options={batchTypeOptions}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    value={findOption(batchTypeOptions, form.type)}
                    onChange={(_e, newValue) => set("type", (newValue ? newValue.value : "Regular") as BatchType)}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Type *"
                        placeholder="Batch type"
                        error={Boolean(errors.type)}
                        helperText={errors.type}
                      />
                    )}
                  />

                  <Autocomplete
                    options={statusOptions}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    value={findOption(statusOptions, form.status)}
                    onChange={(_e, newValue) => set("status", (newValue ? newValue.value : "Active") as BatchStatus)}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Status *"
                        placeholder="Status"
                        error={Boolean(errors.status)}
                        helperText={errors.status}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Type description hint */}
            <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200">
              <InfoOutlinedIcon className="text-blue-600 shrink-0" fontSize="small" />
              <Text size="xs" className="text-blue-900 font-medium">
                <span className="font-bold text-blue-700">{form.type}: </span>
                {BATCH_TYPE_META[form.type]?.description}
              </Text>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Actions ───────────────────────────────────────────────────── */}
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
          disabled={saving}
          onClick={handleSubmit}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <SaveIcon fontSize="small" />
          )}
          <span>{mode === "edit" ? "Save Changes" : "Create Batch"}</span>
        </button>
      </div>

    </div>
  );
};

export default BatchForm;