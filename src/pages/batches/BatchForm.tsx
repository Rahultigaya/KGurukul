// src/pages/batches/BatchForm.tsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Stack, Paper, Title, Grid, Select, NumberInput,
  Button, ActionIcon, Alert, Group, Tooltip, Badge, Text,
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import {
  IconArrowLeft, IconDeviceFloppy, IconMapPin,
  IconCalendar, IconClock, IconBook, IconUser,
  IconUsers, IconSparkles, IconAlertCircle, IconCheck, IconX,
} from "@tabler/icons-react";
import Swal from "sweetalert2";
import {
  AREAS, BRANCHES, DAYS, BATCH_TYPES, BATCH_STATUSES, BATCH_TYPE_META,
  generateBatchName, getBatchById, addBatch, updateBatch,
  type Area, type BatchType, type BatchStatus,
} from "./batchStore";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const TEACHERS = [
  { id: "T001", name: "Rahul Sir"   },
  { id: "T002", name: "Priya Ma'am" },
  { id: "T003", name: "Anita Ma'am" },
];

const STANDARDS = ["5th","6th","7th","8th","9th","10th","11th","12th","JEE","NEET","Other"];
const SUBJECTS  = ["Mathematics","Science","English","Physics","Chemistry","Biology","History","Geography","SSC","HSC","Other"];

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
  area:       string | null;
  branch:     string | null;
  day:        string | null;
  startTime:  string;
  endTime:    string;
  subject:    string | null;
  standard:   string | null;
  teacherId:  string | null;
  capacity:   number | string;
  type:       BatchType;
  status:     BatchStatus;
}
type FormErrors = Partial<Record<keyof FormData, string>>;

const emptyForm: FormData = {
  area: null, branch: null, day: null,
  startTime: "", endTime: "",
  subject: null, standard: null, teacherId: null,
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

  useEffect(() => {
    if (mode !== "edit" || !batchId) return;
    const batch = getBatchById(batchId);
    if (!batch) { setNotFound(true); return; }
    const { startTime, endTime } = parseTimeSlot(batch.timeSlot);
    setForm({
      area: batch.area, branch: batch.branch, day: batch.day,
      startTime, endTime,
      subject: batch.subject, standard: batch.standard,
      teacherId: batch.teacherId, capacity: batch.capacity,
      type: batch.type, status: batch.status,
    });
  }, [mode, batchId]);

  const timeSlot    = buildTimeSlot(form.startTime, form.endTime);
  const hasAny      = !!(form.area || form.branch || form.day || form.startTime || form.endTime);
  const isComplete  = !!(form.area && form.branch && form.day && form.startTime && form.endTime);
  const branchOpts  = form.area ? (BRANCHES[form.area as Area] ?? []).map((b) => ({ value: b, label: b })) : [];
  const teacherName = TEACHERS.find((t) => t.id === form.teacherId)?.name ?? "";

  const set = (field: keyof FormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.area)      e.area      = "Required";
    if (!form.branch)    e.branch    = "Required";
    if (!form.day)       e.day       = "Required";
    if (!form.startTime) e.startTime = "Required";
    if (!form.endTime)   e.endTime   = "Required";
    if (form.startTime && form.endTime && form.startTime >= form.endTime)
      e.endTime = "End time must be after start time";
    if (!form.subject)   e.subject   = "Required";
    if (!form.standard)  e.standard  = "Required";
    if (!form.teacherId) e.teacherId = "Required";
    if (!form.capacity || Number(form.capacity) < 1) e.capacity = "Minimum 1";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      const slot = buildTimeSlot(form.startTime, form.endTime);
      const name = generateBatchName(form.area!, form.branch!, form.day!, slot);

      if (mode === "create") {
        addBatch({
          id: `B${String(Date.now()).slice(-4)}`,
          name, area: form.area as Area, branch: form.branch!, day: form.day!,
          timeSlot: slot, subject: form.subject!, standard: form.standard!,
          teacherId: form.teacherId!, teacherName,
          capacity: Number(form.capacity), studentIds: [],
          type: form.type, status: form.status,
          createdAt: new Date().toISOString().split("T")[0],
        });
      } else if (batchId) {
        const existing = getBatchById(batchId)!;
        updateBatch(batchId, {
          ...existing, name, area: form.area as Area, branch: form.branch!,
          day: form.day!, timeSlot: slot, subject: form.subject!,
          standard: form.standard!, teacherId: form.teacherId!, teacherName,
          capacity: Number(form.capacity), type: form.type, status: form.status,
        });
      }

      setSaving(false);
      Swal.fire({
        title: mode === "create" ? "Batch Created!" : "Batch Updated!",
        html: `
          <div style="color:#94a3b8; font-size:14px; line-height:1.8">
            <div style="color:#f97316; font-weight:700; font-size:16px; margin-bottom:8px">${name}</div>
            <div>📍 ${form.branch} · ${form.area}</div>
            <div>📅 ${form.day} &nbsp;·&nbsp; 🕐 ${slot}</div>
            <div>📚 ${form.subject} – ${form.standard}</div>
            <div>👤 ${teacherName} &nbsp;·&nbsp; 👥 Capacity: ${form.capacity}</div>
          </div>`,
        icon: "success", confirmButtonText: "Go to Batches",
        background: "#1e293b", color: "#f8fafc", iconColor: "#4ade80",
        confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-xl border border-purple-500/30", confirmButton: "rounded-lg px-6 py-2 font-medium" },
      }).then(() => navigate("/batches"));
    }, 600);
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
          <BatchNamePreview area={form.area} branch={form.branch} day={form.day} startTime={form.startTime} endTime={form.endTime} />
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
              value={form.area}
              onChange={(v) => { set("area", v); set("branch", null); }}
              data={AREAS.map((a) => ({ value: a, label: a }))}
              required withAsterisk error={errors.area}
              {...selectStyles}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Select
              label="Branch"
              placeholder={form.area ? "Select branch" : "Select area first"}
              value={form.branch}
              onChange={(v) => set("branch", v)}
              data={branchOpts}
              disabled={!form.area}
              required withAsterisk error={errors.branch}
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
            <TimeInput
              label="Start Time"
              value={form.startTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("startTime", e.currentTarget.value)}
              leftSection={<IconClock size={15} style={{ color: "var(--text-accent)" }} />}
              required withAsterisk error={errors.startTime}
              {...timeInputStyles}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <TimeInput
              label="End Time"
              value={form.endTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => set("endTime", e.currentTarget.value)}
              leftSection={<IconClock size={15} style={{ color: "var(--text-accent)" }} />}
              required withAsterisk error={errors.endTime}
              {...timeInputStyles}
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
              value={form.subject} onChange={(v) => set("subject", v)}
              data={SUBJECTS.map((s) => ({ value: s, label: s }))}
              required withAsterisk error={errors.subject}
              {...selectStyles}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Select
              label="Standard" placeholder="Select standard"
              value={form.standard} onChange={(v) => set("standard", v)}
              data={STANDARDS.map((s) => ({ value: s, label: s }))}
              required withAsterisk error={errors.standard}
              {...selectStyles}
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
              value={form.teacherId} onChange={(v) => set("teacherId", v)}
              data={TEACHERS.map((t) => ({ value: t.id, label: t.name }))}
              required withAsterisk error={errors.teacherId}
              {...selectStyles}
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