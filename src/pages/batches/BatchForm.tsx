// src/pages/batches/BatchForm.tsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Stack, Paper, Title, Grid, Select, NumberInput,
  Button, ActionIcon, Alert, Group, Tooltip, Badge, Text,
} from "@mantine/core";
import {
  IconArrowLeft, IconDeviceFloppy, IconMapPin,
  IconCalendar, IconClock, IconBook, IconUser,
  IconUsers, IconSparkles, IconAlertCircle, IconCheck, IconX,
  IconLoader,
} from "@tabler/icons-react";
import Swal from "sweetalert2";
import {
  DAYS, BATCH_TYPES, BATCH_STATUSES, BATCH_TYPE_META,
  generateBatchName,
  createBatchAPI, updateBatchAPI, getBatchByIdAPI,
  type Area, type BatchType, type BatchStatus,
} from "./batchStore";
import {
  getAllAreas,
  getAllBranches,
  getAllStandards,
  getAllSubjects,
  getAllTeachers,
  getBranchesByArea,
  getTeacherFullName,
  type Area as MasterArea,
  type Branch as MasterBranch,
  type Standard as MasterStandard,
  type Subject as MasterSubject,
  type Teacher as MasterTeacher,
} from "../admin/Master/masterStore";

// ─────────────────────────────────────────────────────────────────────────────
// Time slots for batch scheduling
// ─────────────────────────────────────────────────────────────────────────────

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 6; hour <= 23; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const h = hour % 24;
      const period = h >= 12 ? "PM" : "AM";
      const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const time = `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
      slots.push({ value: time, label: `${displayHour}:${String(min).padStart(2, "0")} ${period}` });
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

// ─────────────────────────────────────────────────────────────────────────────
// Shared input styles — uses CSS vars, matches EnrollmentContent pattern
// ─────────────────────────────────────────────────────────────────────────────

const inputStyles = {
  label: { color: "var(--text-primary)", marginBottom: 6 },
  input: {
    backgroundColor: "var(--bg-input)",
    color: "var(--text-primary)",
    borderColor: "var(--border-default)",
  },
  placeholder: { color: "var(--text-muted)" },
  error: { color: "#f87171" },
};

const selectStyles = {
  styles: {
    label:       { color: "var(--text-primary)", marginBottom: 6 },
    input:       { backgroundColor: "var(--bg-input)", color: "var(--text-primary)", borderColor: "var(--border-default)" },
    section:     { color: "var(--text-muted)" },
    option:      { color: "var(--text-primary)", backgroundColor: "var(--bg-secondary)" },
    placeholder: { color: "var(--text-muted)" },
    error:       { color: "#f87171" },
  },
  comboboxProps: {
    styles: {
      dropdown: {
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-accent)",
        color: "var(--text-primary)",
      },
    },
  },
};

const numberInputStyles = {
  styles: {
    label:   { color: "var(--text-primary)", marginBottom: 6 },
    input:   { backgroundColor: "var(--bg-input)", color: "var(--text-primary)", borderColor: "var(--border-default)" },
    control: { borderColor: "var(--border-default)", color: "var(--text-muted)" },
    error:   { color: "#f87171" },
  },
};

const timeInputStyles = {
  styles: {
    label:   { color: "var(--text-primary)", marginBottom: 6 },
    input:   { backgroundColor: "var(--bg-input)", color: "var(--text-primary)", borderColor: "var(--border-default)", paddingLeft: "36px" },
    section: { color: "var(--text-muted)" },
    error:   { color: "#f87171" },
  },
};

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
  const parts = slot.split("–").map((s) => s.trim());
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

// ─────────────────────────────────────────────────────────────────────────────
// Form types
// ─────────────────────────────────────────────────────────────────────────────

interface FormData {
  area_id:    number | null;
  branch_id:  number | null;
  day:        string | null;
  startTime:  string;
  endTime:    string;
  subject_id: number | null;
  standard_id: number | null;
  teacher_id: number | null;
  capacity:   number | string;
  type:       BatchType;
  status:     BatchStatus;
}
type FormErrors = Partial<Record<keyof FormData, string>>;

const emptyForm: FormData = {
  area_id: null, branch_id: null, day: null,
  startTime: "", endTime: "",
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
  const hasAny     = !!(area || branch || day || startTime || endTime);
  const isComplete = !!(area && branch && day && startTime && endTime);

  const tokens = [
    { label: "Area",   value: area,   filled: !!area   },
    { label: "Branch", value: branch, filled: !!branch },
    { label: "Day",    value: day,    filled: !!day    },
    {
      label: "Time",
      value: startTime && endTime ? buildTimeSlot(startTime, endTime)
        : startTime ? `${to12h(startTime)} – ?`
        : endTime   ? `? – ${to12h(endTime)}` : null,
      filled: !!(startTime && endTime),
    },
  ];

  if (!hasAny)
    return (
      <Text size="sm" fs="italic" style={{ color: "var(--text-muted)" }}>
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
              <span style={{ color: "var(--text-muted)" }} className="mx-1.5">·</span>
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
            { label: "Area",   filled: !!area      },
            { label: "Branch", filled: !!branch    },
            { label: "Day",    filled: !!day       },
            { label: "Start",  filled: !!startTime },
            { label: "End",    filled: !!endTime   },
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

  const [form, setForm]       = useState<FormData>(emptyForm);
  const [errors, setErrors]   = useState<FormErrors>({});
  const [saving, setSaving]   = useState(false);
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
        const { startTime, endTime } = parseTimeSlot(batch.timeSlot);
        // Find IDs from names
        const areaObj = areas.find(a => a.name === batch.area);
        const branchObj = branches.find(b => b.name === batch.branch);
        const subjectObj = subjects.find(s => s.name === batch.subject);
        const standardObj = standards.find(s => s.name === batch.standard);
        const teacherObj = teachers.find(t => t.id === batch.teacherId || getTeacherFullName(t) === batch.teacherName);

        setForm({
          area_id: areaObj?.id || null,
          branch_id: branchObj?.id || null,
          day: batch.day,
          startTime, endTime,
          subject_id: subjectObj?.id || null,
          standard_id: standardObj?.id || null,
          teacher_id: teacherObj?.id || null,
          capacity: batch.capacity,
          type: batch.type,
          status: batch.status,
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

  const timeSlot    = buildTimeSlot(form.startTime, form.endTime);
  const hasAny      = !!(form.area_id || form.branch_id || form.day || form.startTime || form.endTime);
  const isComplete  = !!(form.area_id && form.branch_id && form.day && form.startTime && form.endTime);

  // Filter branches based on selected area (only active branches)
  const branchOpts  = form.area_id
    ? branches
        .filter(b => b.area_id === form.area_id && b.is_active === 1)
        .map(b => ({ value: String(b.id), label: b.name }))
    : [];

  const teacherName = teachers.find((t) => t.id === form.teacher_id)
    ? getTeacherFullName(teachers.find((t) => t.id === form.teacher_id)!)
    : "";

  const set = (field: keyof FormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.area_id)    e.area_id    = "Required";
    if (!form.branch_id)  e.branch_id  = "Required";
    if (!form.day)        e.day        = "Required";
    if (!form.startTime)  e.startTime  = "Required";
    if (!form.endTime)    e.endTime    = "Required";
    if (form.startTime && form.endTime && form.startTime >= form.endTime)
      e.endTime = "End time must be after start time";
    if (!form.subject_id) e.subject_id = "Required";
    if (!form.standard_id) e.standard_id = "Required";
    if (!form.teacher_id)  e.teacher_id  = "Required";
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
          <div style="color:#94a3b8; font-size:14px; line-height:1.8">
            <div style="color:#f97316; font-weight:700; font-size:16px; margin-bottom:8px">${name}</div>
            <div>📍 ${branchName} · ${areaName}</div>
            <div>📅 ${form.day} &nbsp;·&nbsp; 🕐 ${slot}</div>
            <div>📚 ${subjectName} – ${standardName}</div>
            <div>👤 ${teacherName} &nbsp;·&nbsp; 👥 Capacity: ${form.capacity}</div>
          </div>`,
        icon: "success", confirmButtonText: "Go to Batches",
        background: "#1e293b", color: "#f8fafc", iconColor: "#4ade80",
        confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-xl border border-purple-500/30", confirmButton: "rounded-lg px-6 py-2 font-medium" },
      }).then(() => navigate("/batches"));
    } catch (error: any) {
      setSaving(false);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to create batch",
        icon: "error",
        background: "#1e293b",
        color: "#f8fafc",
      });
    }
  };

  if (notFound)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Text style={{ color: "var(--text-secondary)" }}>Batch not found.</Text>
        <Button variant="subtle" color="orange" leftSection={<IconArrowLeft size={15} />} onClick={() => navigate("/batches")}>
          Back to Batches
        </Button>
      </div>
    );

  const errorCount = Object.keys(errors).length;

  return (
    <Stack gap="md" maw={1100} mx="auto" pb="xl">

      {/* Loading indicator for master data */}
      {loadingMasterData && (
        <Alert icon={<IconLoader size={18} />} title="Loading data" color="blue">
          Loading areas, branches, standards, subjects, and teachers from server...
        </Alert>
      )}

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Tooltip label="Back to Batches" position="right" withArrow>
          <ActionIcon variant="subtle" size="lg" radius="lg" onClick={() => navigate("/batches")}
            styles={{ root: { color: "var(--text-secondary)" } }}>
            <IconArrowLeft size={20} />
          </ActionIcon>
        </Tooltip>
        <div>
          <Title order={3} style={{ color: "var(--text-primary)" }}>
            {mode === "edit" ? "Edit Batch" : "Create Batch"}
          </Title>
          <Text size="sm" style={{ color: "var(--text-secondary)" }}>
            {mode === "edit" ? "Update the batch details below" : "Fill in the details to create a new batch"}
          </Text>
        </div>
      </div>

      {/* ── Batch name preview banner ──────────────────────────────────── */}
      <Paper
        className="p-4"
        style={{
          background: isComplete
            ? "rgba(249,115,22,0.06)"
            : hasAny
              ? "rgba(249,115,22,0.03)"
              : "var(--bg-card)",
          border: `1px solid ${isComplete ? "rgba(249,115,22,0.35)" : hasAny ? "rgba(249,115,22,0.15)" : "var(--border-card)"}`,
        }}
      >
        <Text size="xs" fw={600} mb={6} style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          Auto-generated Batch Name
        </Text>
        <div className="flex items-start gap-2">
          <IconSparkles size={16} style={{ color: isComplete ? "var(--accent-orange)" : "var(--text-muted)", marginTop: 2, flexShrink: 0 }} />
          <BatchNamePreview
            area={areas.find(a => a.id === form.area_id)?.name}
            branch={branches.find(b => b.id === form.branch_id)?.name}
            day={form.day}
            startTime={form.startTime}
            endTime={form.endTime}
          />
        </div>
      </Paper>

      {/* ── Error alert ───────────────────────────────────────────────── */}
      {errorCount > 0 && (
        <Alert icon={<IconAlertCircle size={18} />}
          title="Please fix the errors below before continuing"
          color="red" variant="light"
          classNames={{ title: "font-semibold" }}
          styles={{
            root:    { backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" },
            icon:    { color: "#f87171" },
            title:   { color: "var(--text-primary)" },
            message: { color: "var(--text-primary)" },
          }}
        >
          {errorCount === 1 ? "1 required field is missing or invalid." : `${errorCount} required fields are missing or invalid.`}
        </Alert>
      )}

      {/* ── Section 1: Location ───────────────────────────────────────── */}
      <Paper className="p-4 sm:p-6"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)" }}>
        <Title order={5} mb="md" style={{ color: "var(--text-accent)", fontSize: "clamp(14px,2vw,18px)" }}>
          <span className="flex items-center gap-2">
            <IconMapPin size={16} style={{ color: "var(--text-accent)" }} />
            Location
          </span>
        </Title>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Select
              label="Area" placeholder="Select area"
              value={form.area_id ? String(form.area_id) : null}
              onChange={(v) => { set("area_id", v ? Number(v) : null); set("branch_id", null); }}
              data={areas
                .filter(a => a.is_active === 1) // Only active areas
                .map(a => ({ value: String(a.id), label: a.name }))}
              required withAsterisk error={errors.area_id}
              {...selectStyles}
              disabled={loadingMasterData || mode === "edit"}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Select
              label="Branch"
              placeholder={form.area_id ? "Select branch" : "Select area first"}
              value={form.branch_id ? String(form.branch_id) : null}
              onChange={(v) => set("branch_id", v ? Number(v) : null)}
              data={branchOpts}
              disabled={!form.area_id || mode === "edit"}
              required withAsterisk error={errors.branch_id}
              {...selectStyles}
            />
          </Grid.Col>
        </Grid>
      </Paper>

      {/* ── Section 2: Schedule ───────────────────────────────────────── */}
      <Paper className="p-4 sm:p-6"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)" }}>
        <Title order={5} mb="md" style={{ color: "var(--text-accent)", fontSize: "clamp(14px,2vw,18px)" }}>
          <span className="flex items-center gap-2">
            <IconCalendar size={16} style={{ color: "var(--text-accent)" }} />
            Schedule
          </span>
        </Title>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Select
              label="Day" placeholder="Select day"
              value={form.day} onChange={(v) => set("day", v)}
              data={DAYS.map((d) => ({ value: d, label: d }))}
              required withAsterisk error={errors.day}
              {...selectStyles}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Select
              label="Start Time"
              placeholder="Select start time"
              value={form.startTime}
              onChange={(value) => set("startTime", value)}
              data={TIME_SLOTS}
              leftSection={<IconClock size={15} style={{ color: "var(--text-accent)" }} />}
              required withAsterisk error={errors.startTime}
              searchable
              clearable
              {...selectStyles}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Select
              label="End Time"
              placeholder="Select end time"
              value={form.endTime}
              onChange={(value) => set("endTime", value)}
              data={TIME_SLOTS}
              leftSection={<IconClock size={15} style={{ color: "var(--text-accent)" }} />}
              required withAsterisk error={errors.endTime}
              searchable
              clearable
              {...selectStyles}
            />
          </Grid.Col>

          {/* Time preview pill */}
          {form.startTime && form.endTime && (
            <Grid.Col span={12}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-accent)" }}>
                <IconClock size={13} style={{ color: "var(--text-accent)" }} className="shrink-0" />
                <Text size="sm" fw={500} style={{ color: "var(--text-accent)" }}>{timeSlot}</Text>
              </div>
            </Grid.Col>
          )}
        </Grid>
      </Paper>

      {/* ── Section 3: Academic Details ───────────────────────────────── */}
      <Paper className="p-4 sm:p-6"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)" }}>
        <Title order={5} mb="md" style={{ color: "var(--text-accent)", fontSize: "clamp(14px,2vw,18px)" }}>
          <span className="flex items-center gap-2">
            <IconBook size={16} style={{ color: "var(--text-accent)" }} />
            Academic Details
          </span>
        </Title>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Select
              label="Subject" placeholder="Select subject"
              value={form.subject_id ? String(form.subject_id) : null}
              onChange={(v) => set("subject_id", v ? Number(v) : null)}
              data={subjects
                .filter(s => s.is_active === 1)
                .map(s => ({ value: String(s.id), label: s.name }))}
              required withAsterisk error={errors.subject_id}
              {...selectStyles}
              disabled={loadingMasterData}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Select
              label="Standard" placeholder="Select standard"
              value={form.standard_id ? String(form.standard_id) : null}
              onChange={(v) => set("standard_id", v ? Number(v) : null)}
              data={standards
                .filter(s => s.is_active === 1) // Only active standards
                .map(s => ({ value: String(s.id), label: s.name }))}
              required withAsterisk error={errors.standard_id}
              {...selectStyles}
              disabled={loadingMasterData}
            />
          </Grid.Col>
        </Grid>
      </Paper>

      {/* ── Section 4: Teacher, Capacity & Type ───────────────────────── */}
      <Paper className="p-4 sm:p-6"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)" }}>
        <Title order={5} mb="md" style={{ color: "var(--text-accent)", fontSize: "clamp(14px,2vw,18px)" }}>
          <span className="flex items-center gap-2">
            <IconUser size={16} style={{ color: "var(--text-accent)" }} />
            Teacher, Capacity & Type
          </span>
        </Title>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              label="Teacher" placeholder="Select teacher"
              value={form.teacher_id ? String(form.teacher_id) : null}
              onChange={(v) => set("teacher_id", v ? Number(v) : null)}
              data={teachers
                .filter(t => t.status === "Active")
                .map(t => ({ value: String(t.id), label: getTeacherFullName(t) }))}
              required withAsterisk error={errors.teacher_id}
              {...selectStyles}
              disabled={loadingMasterData}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <NumberInput
              label="Capacity" placeholder="Max students"
              value={form.capacity} onChange={(v) => set("capacity", v)}
              min={1} max={100}
              required withAsterisk error={errors.capacity}
              leftSection={<IconUsers size={15} style={{ color: "var(--text-accent)" }} />}
              {...numberInputStyles}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              label="Batch Type"
              value={form.type} onChange={(v) => set("type", v as BatchType)}
              data={BATCH_TYPES.map((t) => ({ value: t, label: t }))}
              required withAsterisk
              {...selectStyles}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              label="Status"
              value={form.status} onChange={(v) => set("status", v as BatchStatus)}
              data={BATCH_STATUSES.map((s) => ({ value: s, label: s }))}
              required withAsterisk
              {...selectStyles}
            />
          </Grid.Col>

          {/* Type description hint */}
          <Grid.Col span={12}>
            <div className="px-3 py-2 rounded-lg"
              style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-default)" }}>
              <Text size="xs" style={{ color: "var(--text-secondary)" }}>
                <span style={{ color: "var(--accent-orange)", fontWeight: 600 }}>{form.type}: </span>
                {BATCH_TYPE_META[form.type]?.description}
              </Text>
            </div>
          </Grid.Col>
        </Grid>
      </Paper>

      {/* ── Actions ───────────────────────────────────────────────────── */}
      <Group justify="flex-end" gap="sm">
        <Button
          variant="default" size="md"
          onClick={() => navigate("/batches")}
          leftSection={<IconX size={16} />}
          styles={{
            root: {
              backgroundColor: "var(--bg-tertiary)",
              border: "1px solid var(--border-default)",
              color: "var(--text-primary)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          size="md" color="orange"
          loading={saving} disabled={saving}
          leftSection={<IconDeviceFloppy size={16} />}
          onClick={handleSubmit}
        >
          {mode === "edit" ? "Save Changes" : "Create Batch"}
        </Button>
      </Group>

    </Stack>
  );
};

export default BatchForm;