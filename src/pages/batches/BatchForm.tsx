// src/pages/batches/BatchForm.tsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Select,
  NumberInput,
  Button,
  ActionIcon,
  Alert,
  Group,
  Tooltip,
  Badge,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconMapPin,
  IconBuilding,
  IconCalendar,
  IconClock,
  IconBook,
  IconUser,
  IconUsers,
  IconSparkles,
  IconAlertCircle,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { TimeInput } from "@mantine/dates";

import Swal from "sweetalert2";
import {
  AREAS,
  BRANCHES,
  DAYS,
  BATCH_TYPES,
  BATCH_STATUSES,
  BATCH_TYPE_META,
  generateBatchName,
  getBatchById,
  addBatch,
  updateBatch,
  type Area,
  type BatchType,
  type BatchStatus,
} from "./batchStore";

const TEACHERS = [
  { id: "T001", name: "Rahul Sir" },
  { id: "T002", name: "Priya Ma'am" },
  { id: "T003", name: "Anita Ma'am" },
];
const STANDARDS = [
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
  "JEE",
  "NEET",
  "Other",
];
const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "SSC",
  "HSC",
  "Other",
];

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
// Shared Mantine styles
// ─────────────────────────────────────────────────────────────────────────────

const selectStyles = {
  comboboxProps: {
    styles: {
      dropdown: {
        background: "#1c2739",
        border: "1px solid rgba(139,92,246,0.3)",
        color: "white",
      },
    },
  },
  styles: {
    input: {
      backgroundColor: "rgba(30,41,59,0.8)",
      border: "1px solid rgba(71,85,105,0.5)",
      color: "white",
      borderRadius: "10px",
      fontSize: "14px",
      height: "42px",
    },
    label: {
      color: "white",
      marginBottom: "6px",
      fontSize: "13px",
      fontWeight: 500,
    },
    section: { color: "#94a3b8" },
    option: { color: "white", backgroundColor: "#1c2739" },
    error: { color: "#f87171" },
  },
};

const timeInputStyles = {
  styles: {
    input: {
      backgroundColor: "rgba(30,41,59,0.8)",
      border: "1px solid rgba(71,85,105,0.5)",
      color: "white",
      borderRadius: "10px",
      fontSize: "14px",
      height: "42px",
      paddingLeft: "36px",
      colorScheme: "dark",
    },
    label: {
      color: "white",
      marginBottom: "6px",
      fontSize: "13px",
      fontWeight: 500,
    },
    section: { color: "#94a3b8" },
    error: { color: "#f87171" },
  },
};

const numberInputStyles = {
  styles: {
    input: {
      backgroundColor: "rgba(30,41,59,0.8)",
      border: "1px solid rgba(71,85,105,0.5)",
      color: "white",
      borderRadius: "10px",
      fontSize: "14px",
      height: "42px",
    },
    label: {
      color: "white",
      marginBottom: "6px",
      fontSize: "13px",
      fontWeight: 500,
    },
    control: { borderColor: "rgba(71,85,105,0.5)", color: "#94a3b8" },
    error: { color: "#f87171" },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface FormData {
  area: string | null;
  branch: string | null;
  day: string | null;
  startTime: string;
  endTime: string;
  subject: string | null;
  standard: string | null;
  teacherId: string | null;
  capacity: number | string;
  type: BatchType;
  status: BatchStatus;
}
type FormErrors = Partial<Record<keyof FormData, string>>;

const emptyForm: FormData = {
  area: null,
  branch: null,
  day: null,
  startTime: "",
  endTime: "",
  subject: null,
  standard: null,
  teacherId: null,
  capacity: 30,
  type: "Regular",
  status: "Active",
};

// ─────────────────────────────────────────────────────────────────────────────
// Batch name preview component
// ─────────────────────────────────────────────────────────────────────────────

const BatchNamePreview: React.FC<{
  area: string | null;
  branch: string | null;
  day: string | null;
  startTime: string;
  endTime: string;
}> = ({ area, branch, day, startTime, endTime }) => {
  const hasAny = !!(area || branch || day || startTime || endTime);
  const isComplete = !!(area && branch && day && startTime && endTime);

  const tokens = [
    { label: "Area", value: area, filled: !!area },
    { label: "Branch", value: branch, filled: !!branch },
    { label: "Day", value: day, filled: !!day },
    {
      label: "Time",
      value:
        startTime && endTime
          ? buildTimeSlot(startTime, endTime)
          : startTime
            ? `${to12h(startTime)} – ?`
            : endTime
              ? `? – ${to12h(endTime)}`
              : null,
      filled: !!(startTime && endTime),
    },
  ];

  if (!hasAny)
    return (
      <p className="text-slate-600 text-sm italic">
        Fill Area, Branch, Day and Time to generate name…
      </p>
    );

  return (
    <div>
      <p className="font-bold text-base tracking-wide flex flex-wrap items-center gap-0">
        {tokens.map((t, i) => (
          <span key={i} className="flex items-center">
            <span
              className={
                t.filled ? "text-orange-400" : "text-slate-500 italic text-sm"
              }
            >
              {t.filled ? t.value : `[ ${t.label} ]`}
            </span>
            {i < tokens.length - 1 && (
              <span className="text-slate-600 mx-1.5">·</span>
            )}
          </span>
        ))}
        {isComplete && (
          <Badge
            size="xs"
            variant="light"
            color="green"
            leftSection={<IconCheck size={9} />}
            ml="sm"
            styles={{
              root: {
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 700,
              },
            }}
          >
            Complete
          </Badge>
        )}
      </p>

      {/* Progress dots */}
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
              <div
                className={`w-1.5 h-1.5 rounded-full transition-all ${s.filled ? "bg-orange-400" : "bg-slate-600"}`}
              />
              <span
                className={`text-[10px] ${s.filled ? "text-orange-400/70" : "text-slate-600"}`}
              >
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
// Section card wrapper
// ─────────────────────────────────────────────────────────────────────────────

const SectionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="rounded-2xl border border-purple-500/30 bg-slate-700/50 p-5">
    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700/50">
      <span className="text-white">{icon}</span>
      <h3 className="text-purple-400 font-semibold text-sm">{title}</h3>
    </div>
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// BatchForm
// ─────────────────────────────────────────────────────────────────────────────

interface BatchFormProps {
  mode: "create" | "edit";
}

const BatchForm: React.FC<BatchFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { id: batchId } = useParams<{ id: string }>();

  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // ── Load for edit ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== "edit" || !batchId) return;
    const batch = getBatchById(batchId);
    if (!batch) {
      setNotFound(true);
      return;
    }
    const { startTime, endTime } = parseTimeSlot(batch.timeSlot);
    setForm({
      area: batch.area,
      branch: batch.branch,
      day: batch.day,
      startTime,
      endTime,
      subject: batch.subject,
      standard: batch.standard,
      teacherId: batch.teacherId,
      capacity: batch.capacity,
      type: batch.type,
      status: batch.status,
    });
  }, [mode, batchId]);

  const timeSlot = buildTimeSlot(form.startTime, form.endTime);
  const hasAny = !!(
    form.area ||
    form.branch ||
    form.day ||
    form.startTime ||
    form.endTime
  );
  const isComplete = !!(
    form.area &&
    form.branch &&
    form.day &&
    form.startTime &&
    form.endTime
  );
  const branchOptions = form.area
    ? (BRANCHES[form.area as Area] ?? []).map((b) => ({ value: b, label: b }))
    : [];
  const teacherName = TEACHERS.find((t) => t.id === form.teacherId)?.name ?? "";

  const set = (field: keyof FormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const e = { ...prev };
      delete e[field];
      return e;
    });
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.area) e.area = "Required";
    if (!form.branch) e.branch = "Required";
    if (!form.day) e.day = "Required";
    if (!form.startTime) e.startTime = "Required";
    if (!form.endTime) e.endTime = "Required";
    if (form.startTime && form.endTime && form.startTime >= form.endTime)
      e.endTime = "End must be after start";
    if (!form.subject) e.subject = "Required";
    if (!form.standard) e.standard = "Required";
    if (!form.teacherId) e.teacherId = "Required";
    if (!form.capacity || Number(form.capacity) < 1) e.capacity = "Min 1";
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
        const newId = `B${String(Date.now()).slice(-4)}`;
        addBatch({
          id: newId,
          name,
          area: form.area as Area,
          branch: form.branch!,
          day: form.day!,
          timeSlot: slot,
          subject: form.subject!,
          standard: form.standard!,
          teacherId: form.teacherId!,
          teacherName,
          capacity: Number(form.capacity),
          studentIds: [],
          type: form.type,
          status: form.status,
          createdAt: new Date().toISOString().split("T")[0],
        });
      } else if (batchId) {
        const existing = getBatchById(batchId)!;
        updateBatch(batchId, {
          ...existing,
          name,
          area: form.area as Area,
          branch: form.branch!,
          day: form.day!,
          timeSlot: slot,
          subject: form.subject!,
          standard: form.standard!,
          teacherId: form.teacherId!,
          teacherName,
          capacity: Number(form.capacity),
          type: form.type,
          status: form.status,
        });
      }

      setSaving(false);

      // ── SweetAlert2 success ───────────────────────────────────────
      Swal.fire({
        title: mode === "create" ? "Batch Created!" : "Batch Updated!",
        html: `
          <div style="color:#94a3b8; font-size:14px; line-height:1.8">
            <div style="color:#f97316; font-weight:700; font-size:16px; margin-bottom:8px">${name}</div>
            <div>📍 ${form.branch} · ${form.area}</div>
            <div>📅 ${form.day} &nbsp;·&nbsp; 🕐 ${slot}</div>
            <div>📚 ${form.subject} – ${form.standard}</div>
            <div>👤 ${teacherName} &nbsp;·&nbsp; 👥 Capacity: ${form.capacity}</div>
          </div>
        `,
        icon: "success",
        confirmButtonText: "Go to Batches",
        background: "#1e293b",
        color: "#f8fafc",
        iconColor: "#4ade80",
        confirmButtonColor: "#7c3aed",
        customClass: {
          popup: "rounded-xl border border-purple-500/30",
          confirmButton: "rounded-lg px-6 py-2 font-medium",
        },
      }).then(() => navigate("/batches"));
    }, 600);
  };

  // ─────────────────────────────────────────────────────────────────────────
  if (notFound)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-slate-400">Batch not found.</p>
        <Button
          variant="subtle"
          color="orange"
          leftSection={<IconArrowLeft size={15} />}
          onClick={() => navigate("/batches")}
        >
          Back to Batches
        </Button>
      </div>
    );

  const isEdit = mode === "edit";

  return (
    <div className="max-w-6xl mx-auto pb-12 space-y-5">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Tooltip label="Back to Batches" position="right" withArrow>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            radius="lg"
            onClick={() => navigate("/batches")}
            styles={{ root: { color: "#94a3b8" } }}
          >
            <IconArrowLeft size={20} />
          </ActionIcon>
        </Tooltip>
        <div>
          <h2 className="text-2xl font-bold text-white">
            {isEdit ? "Edit Batch" : "Create Batch"}
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            {isEdit
              ? "Update the batch details below"
              : "Fill in the details to create a new batch"}
          </p>
        </div>
      </div>

      {/* ── Batch name preview ───────────────────────────────────────── */}
      <div
        className={`rounded-2xl border p-4 flex items-start gap-3 transition-all duration-300 ${
          isComplete
            ? "border-orange-500/40 bg-orange-500/[0.08]"
            : hasAny
              ? "border-orange-500/20 bg-orange-500/[0.04]"
              : "border-slate-700/50 bg-slate-800/30"
        }`}
      >
        <IconSparkles
          size={18}
          className={`mt-0.5 shrink-0 transition-colors ${isComplete ? "text-orange-400" : hasAny ? "text-orange-500/60" : "text-slate-600"}`}
        />
        <div className="flex-1 min-w-0">
          <p className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold mb-1">
            Auto-generated Batch Name
          </p>
          <BatchNamePreview
            area={form.area}
            branch={form.branch}
            day={form.day}
            startTime={form.startTime}
            endTime={form.endTime}
          />
        </div>
      </div>

      {/* ── 2-column grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* LEFT */}
        <div className="space-y-5">
          <SectionCard icon={<IconMapPin size={15} />} title="Location">
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Area"
                placeholder="Select area"
                value={form.area}
                onChange={(v) => {
                  set("area", v);
                  set("branch", null);
                }}
                data={AREAS.map((a) => ({ value: a, label: a }))}
                required
                withAsterisk
                error={errors.area}
                {...selectStyles}
              />
              <Select
                label="Branch"
                placeholder={form.area ? "Select branch" : "Select area first"}
                value={form.branch}
                onChange={(v) => set("branch", v)}
                data={branchOptions}
                disabled={!form.area}
                required
                withAsterisk
                error={errors.branch}
                {...selectStyles}
              />
            </div>
          </SectionCard>

          <SectionCard icon={<IconCalendar size={15} />} title="Schedule">
            <div className="space-y-4">
              <Select
                label="Day"
                placeholder="Select day"
                value={form.day}
                onChange={(v) => set("day", v)}
                data={DAYS.map((d) => ({ value: d, label: d }))}
                required
                withAsterisk
                error={errors.day}
                {...selectStyles}
              />

              <div className="grid grid-cols-2 gap-4">
                <TimeInput
                  label="Start Time"
                  value={form.startTime}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    set("startTime", e.currentTarget.value)
                  }
                  leftSection={
                    <IconClock size={15} className="text-violet-400" />
                  }
                  required
                  withAsterisk
                  error={errors.startTime}
                  {...timeInputStyles}
                />
                <TimeInput
                  label="End Time"
                  value={form.endTime}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    set("endTime", e.currentTarget.value)
                  }
                  leftSection={
                    <IconClock size={15} className="text-violet-400" />
                  }
                  required
                  withAsterisk
                  error={errors.endTime}
                  {...timeInputStyles}
                />
              </div>

              {form.startTime && form.endTime && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <IconClock size={13} className="text-violet-400 shrink-0" />
                  <span className="text-violet-300 text-sm font-medium">
                    {timeSlot}
                  </span>
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        {/* RIGHT */}
        <div className="space-y-5">
          <SectionCard icon={<IconBook size={15} />} title="Academic Details">
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Subject"
                placeholder="Select subject"
                value={form.subject}
                onChange={(v) => set("subject", v)}
                data={SUBJECTS.map((s) => ({ value: s, label: s }))}
                required
                withAsterisk
                error={errors.subject}
                {...selectStyles}
              />
              <Select
                label="Standard"
                placeholder="Select standard"
                value={form.standard}
                onChange={(v) => set("standard", v)}
                data={STANDARDS.map((s) => ({ value: s, label: s }))}
                required
                withAsterisk
                error={errors.standard}
                {...selectStyles}
              />
            </div>
          </SectionCard>

          <SectionCard icon={<IconUser size={15} />} title="Teacher & Capacity">
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Teacher"
                placeholder="Select teacher"
                value={form.teacherId}
                onChange={(v) => set("teacherId", v)}
                data={TEACHERS.map((t) => ({ value: t.id, label: t.name }))}
                required
                withAsterisk
                error={errors.teacherId}
                {...selectStyles}
              />
              <NumberInput
                label="Capacity"
                placeholder="Max students"
                value={form.capacity}
                onChange={(v) => set("capacity", v)}
                min={1}
                max={100}
                required
                withAsterisk
                error={errors.capacity}
                leftSection={<IconUsers size={15} className="text-green-400" />}
                {...numberInputStyles}
              />
            </div>
          </SectionCard>

          {/* Batch Type + Status */}
          <SectionCard
            icon={<IconSparkles size={15} />}
            title="Batch Type & Status"
          >
            <div className="grid grid-cols-2 gap-4 pt-1">
              <Select
                label="Batch Type"
                value={form.type}
                onChange={(v) => set("type", v as BatchType)}
                data={BATCH_TYPES.map((t) => ({
                  value: t,
                  label: t,
                  description: BATCH_TYPE_META[t as BatchType].description,
                }))}
                required
                withAsterisk
                {...selectStyles}
              />
              <Select
                label="Status"
                value={form.status}
                onChange={(v) => set("status", v as BatchStatus)}
                data={BATCH_STATUSES.map((s) => ({ value: s, label: s }))}
                required
                withAsterisk
                {...selectStyles}
              />
            </div>
            <div className="mt-3 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/40">
              <p className="text-slate-500 text-xs">
                <span className="text-orange-400 font-semibold">
                  {form.type}:{" "}
                </span>
                {BATCH_TYPE_META[form.type]?.description}
              </p>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* ── Error summary ────────────────────────────────────────────── */}
      {Object.keys(errors).length > 0 && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="red"
          variant="light"
          radius="xl"
          styles={{
            root: {
              backgroundColor: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
            },
            icon: { color: "#f87171" },
            message: { color: "#f87171", fontSize: "14px" },
          }}
        >
          Please fill in all required fields before saving.
        </Alert>
      )}

      {/* ── Actions ──────────────────────────────────────────────────── */}
      <Group justify="flex-end" gap="sm">
        <Button
          variant="default"
          size="md"
          onClick={() => navigate("/batches")}
          leftSection={<IconX size={16} />}
          styles={{
            root: {
              backgroundColor: "rgba(71,85,105,0.3)",
              border: "1px solid rgba(71,85,105,0.5)",
              color: "white",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          size="md"
          color="orange"
          loading={saving}
          disabled={saving}
          leftSection={<IconDeviceFloppy size={16} />}
          onClick={handleSubmit}
        >
          {isEdit ? "Save Changes" : "Create Batch"}
        </Button>
      </Group>
    </div>
  );
};

export default BatchForm;
