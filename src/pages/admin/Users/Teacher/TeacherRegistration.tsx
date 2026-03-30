// src/pages/admin/Users/Teacher/TeacherRegistration.tsx
// Routes:
//   { path: "Users/add-teacher",           element: <TeacherRegistration /> }
//   { path: "Users/edit-teacher/:id",      element: <TeacherRegistration /> }

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Stack, Paper, Title, Grid, Text, Group,
  TextInput, ActionIcon, Avatar, Tooltip, Alert,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconArrowLeft, IconUpload, IconX, IconUser,
  IconDeviceFloppy, IconAlertCircle, IconCircleCheck,
} from "@tabler/icons-react";
import Swal from "sweetalert2";
import { useTheme } from "../../../../context/ThemeContext";
import {
  emptyTeacherForm, getTeacherById, addTeacher, updateTeacher,
  type TeacherFormData,
} from "./teacherStore";

// ─────────────────────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────────────────────

type FormErrors = Partial<Record<keyof TeacherFormData | "general", string>>;

function validate(form: TeacherFormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.firstName.trim())     errors.firstName   = "First name is required.";
  else if (!/^[a-zA-Z\s]+$/.test(form.firstName))
                                  errors.firstName   = "First name must contain letters only.";
  if (form.middleName.trim() && !/^[a-zA-Z\s]+$/.test(form.middleName))
                                  errors.middleName  = "Middle name must contain letters only.";
  if (!form.lastName.trim())      errors.lastName    = "Last name is required.";
  else if (!/^[a-zA-Z\s]+$/.test(form.lastName))
                                  errors.lastName    = "Last name must contain letters only.";
  if (!form.email.trim())         errors.email       = "Email is required.";
  else if (!/\S+@\S+\.\S+/.test(form.email))
                                  errors.email       = "Enter a valid email address.";
  if (!form.joiningDate)          errors.joiningDate = "Joining date is required.";
  return errors;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared input styles
// ─────────────────────────────────────────────────────────────────────────────

const inputSt = {
  label:       { color: "var(--text-primary)", marginBottom: 6 },
  input:       { backgroundColor: "var(--bg-input)", color: "var(--text-primary)", borderColor: "var(--border-default)" },
  placeholder: { color: "var(--text-muted)" },
  error:       { color: "#f87171" },
};

// ─────────────────────────────────────────────────────────────────────────────
// TeacherRegistration
// ─────────────────────────────────────────────────────────────────────────────

const TeacherRegistration: React.FC = () => {
  const navigate     = useNavigate();
  const { id }       = useParams<{ id: string }>();
  const { isDark }   = useTheme();
  const isEdit       = Boolean(id);

  const [form,    setForm]    = useState<TeacherFormData>(emptyTeacherForm);
  const [errors,  setErrors]  = useState<FormErrors>({});
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState<{ msg: string; ok: boolean } | null>(null);

  // ── Load for edit ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isEdit || !id) return;
    const t = getTeacherById(id);
    if (!t) {
      Swal.fire({
        title: "Teacher not found", icon: "error",
        background: isDark ? "#1e293b" : "#fff",
        color: isDark ? "#f8fafc" : "#0f172a",
        confirmButtonColor: "#7c3aed",
      }).then(() => navigate("/Users"));
      return;
    }
    setForm({
      photo:       t.photo,
      firstName:   t.firstName,
      middleName:  t.middleName,
      lastName:    t.lastName,
      email:       t.email,
      joiningDate: t.joiningDate,
    });
  }, [id, isEdit, navigate, isDark]);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Field helpers ──────────────────────────────────────────────────────────
  const set = useCallback(<K extends keyof TeacherFormData>(field: K, value: TeacherFormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  }, []);

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => set("photo", reader.result as string);
    reader.readAsDataURL(file);
  }, [set]);

  // ── Preview name ───────────────────────────────────────────────────────────
  const previewName = [form.firstName, form.middleName, form.lastName]
    .filter(Boolean).join(" ") || "Full Name";

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSaving(true);

    try {
      if (isEdit && id) {
        await updateTeacher(id, form);
      } else {
        await addTeacher(form);
      }

      setSaving(false);
      Swal.fire({
        title: isEdit ? "Teacher Updated!" : "Teacher Registered!",
        html: `
          <div style="color:#94a3b8;font-size:14px;line-height:1.8">
            <div style="color:#f97316;font-weight:700;font-size:16px;margin-bottom:8px">
              ${previewName}
            </div>
            <div>📧 ${form.email}</div>
            <div>📅 Joined: ${new Date(form.joiningDate + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
          </div>`,
        icon: "success",
        confirmButtonText: "Go to Users",
        background: isDark ? "#1e293b" : "#ffffff",
        color: isDark ? "#f8fafc" : "#0f172a",
        iconColor: "#4ade80",
        confirmButtonColor: "#7c3aed",
        customClass: {
          popup: "rounded-xl border border-purple-500/30",
          confirmButton: "rounded-lg px-6 py-2 font-medium",
        },
      }).then(() => navigate("/Users"));
    } catch (error: any) {
      setSaving(false);
      console.error("Error saving teacher:", error);

      // Extract error message
      let errorMessage = "Failed to save teacher. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail.map((e: any) => e.msg || e.message).join(', ');
        }
      }

      // Show error alert
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
        background: isDark ? "#1e293b" : "#ffffff",
        color: isDark ? "#f8fafc" : "#0f172a",
        confirmButtonColor: "#ef4444",
        customClass: {
          popup: "rounded-xl border border-red-500/30",
          confirmButton: "rounded-lg px-6 py-2 font-medium",
        },
      });
    }
  };

  const errorCount = Object.keys(errors).length;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Stack gap="md" maw={760} mx="auto" pb="xl" px={{ base: "xs", sm: 0 }}>

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

      {/* ── Header ────────────────────────────────────────────────────── */}
      <Group gap="sm">
        <Tooltip label="Back to Users" position="right" withArrow>
          <ActionIcon variant="subtle" size="lg" radius="lg"
            onClick={() => navigate("/Users")}
            styles={{ root: { color: "var(--text-secondary)" } }}>
            <IconArrowLeft size={20} />
          </ActionIcon>
        </Tooltip>
        <div>
          <Title order={3} style={{ color: "var(--text-primary)" }}>
            {isEdit ? "Edit Teacher" : "Teacher Registration"}
          </Title>
          <Text size="sm" style={{ color: "var(--text-muted)" }}>
            {isEdit ? "Update teacher information" : "Register a new teacher"}
          </Text>
        </div>
      </Group>

      {/* ── Error banner ──────────────────────────────────────────────── */}
      {errorCount > 0 && (
        <Alert icon={<IconAlertCircle size={18} />}
          title="Please fix the errors below before saving"
          color="red" variant="light"
          classNames={{ title: "font-semibold" }}
          styles={{
            root:    { backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" },
            icon:    { color: "#f87171" },
            title:   { color: "var(--text-primary)" },
            message: { color: "var(--text-primary)" },
          }}>
          {errorCount === 1 ? "1 required field is missing or invalid." : `${errorCount} required fields are missing or invalid.`}
        </Alert>
      )}

      {/* ── Form card ─────────────────────────────────────────────────── */}
      <Paper className="p-5 sm:p-7"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)" }}>

        <Grid gutter="lg">

          {/* ── Photo + name preview column ───────────────────────────── */}
          <Grid.Col span={{ base: 12, sm: 3 }}>
            <div className="flex flex-col items-center gap-3 sm:pt-2">

              {/* Avatar */}
              {form.photo ? (
                <div className="relative">
                  <Avatar src={form.photo} size={96} radius="xl" />
                  <button
                    onClick={() => set("photo", null)}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow"
                    style={{ background: "#ef4444" }}>
                    <IconX size={12} color="white" />
                  </button>
                </div>
              ) : (
                <Avatar size={96} radius="xl"
                  style={{ background: "var(--bg-tertiary)", border: "2px dashed var(--border-default)" }}>
                  <IconUser size={38} style={{ color: "var(--text-muted)" }} />
                </Avatar>
              )}

              {/* Upload button */}
              <label className="cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}>
                  <IconUpload size={13} />
                  {form.photo ? "Change" : "Upload Photo"}
                </div>
              </label>

              <Text size="xs" ta="center" style={{ color: "var(--text-muted)" }}>
                Optional · passport size
              </Text>

              {/* Name preview */}
              <div className="w-full mt-1 px-3 py-2 rounded-xl text-center"
                style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-default)" }}>
                <Text size="xs" mb={2} style={{ color: "var(--text-muted)" }}>Preview</Text>
                <Text size="sm" fw={600} style={{ color: form.firstName ? "var(--text-primary)" : "var(--text-muted)", fontStyle: form.firstName ? "normal" : "italic" }}>
                  {previewName}
                </Text>
              </div>
            </div>
          </Grid.Col>

          {/* ── Fields column ─────────────────────────────────────────── */}
          <Grid.Col span={{ base: 12, sm: 9 }}>
            <Stack gap="md">

              {/* Name row */}
              <div>
                <Text size="xs" fw={700} mb={8}
                  style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  Full Name
                </Text>
                <Grid gutter="sm">
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <TextInput
                      label="First Name"
                      placeholder="e.g. Rahul"
                      value={form.firstName}
                      onChange={(e) => set("firstName", e.currentTarget.value)}
                      required withAsterisk
                      error={errors.firstName}
                      styles={inputSt}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <TextInput
                      label="Middle Name"
                      placeholder="optional"
                      value={form.middleName}
                      onChange={(e) => set("middleName", e.currentTarget.value)}
                      error={errors.middleName}
                      styles={inputSt}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <TextInput
                      label="Last Name"
                      placeholder="e.g. Sharma"
                      value={form.lastName}
                      onChange={(e) => set("lastName", e.currentTarget.value)}
                      required withAsterisk
                      error={errors.lastName}
                      styles={inputSt}
                    />
                  </Grid.Col>
                </Grid>
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px solid var(--border-default)" }} />

              {/* Contact + Joining date */}
              <div>
                <Text size="xs" fw={700} mb={8}
                  style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  Contact & Joining
                </Text>
                <Grid gutter="sm">
                  <Grid.Col span={{ base: 12, sm: 7 }}>
                    <TextInput
                      label="Email Address"
                      placeholder="teacher@kgurukul.com"
                      value={form.email}
                      onChange={(e) => set("email", e.currentTarget.value)}
                      required withAsterisk
                      error={errors.email}
                      styles={inputSt}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 5 }}>
                    <DateInput
                      label="Joining Date"
                      placeholder="Select date"
                      value={form.joiningDate ? new Date(form.joiningDate + "T00:00:00") : null}
                      onChange={(v) => set("joiningDate", v ? v.toISOString().split("T")[0] : "")}
                      maxDate={new Date()}
                      required withAsterisk
                      error={errors.joiningDate}
                      onKeyDown={(e) => e.preventDefault()}
                      popoverProps={{
                        styles: { dropdown: { backgroundColor: "var(--bg-secondary)" } },
                      }}
                      styles={{
                        label:                 { color: "var(--text-primary)", marginBottom: 6 },
                        input:                 { backgroundColor: "var(--bg-input)", color: "var(--text-primary)", borderColor: "var(--border-default)" },
                        placeholder:           { color: "var(--text-muted)" },
                        error:                 { color: "#f87171" },
                        calendarHeader:        { color: "var(--text-primary)", backgroundColor: "var(--bg-secondary)" },
                        calendarHeaderLevel:   { color: "var(--text-primary)" },
                        calendarHeaderControl: { color: "var(--text-primary)" },
                        weekday:               { color: "var(--text-secondary)" },
                        day:                   { color: "var(--text-primary)" },
                      }}
                    />
                  </Grid.Col>
                </Grid>
              </div>

            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>

      {/* ── Actions ───────────────────────────────────────────────────── */}
      <Group justify="flex-end" gap="sm">
        <button onClick={() => navigate("/Users")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}>
          <IconX size={15} /> Cancel
        </button>
        <button onClick={handleSubmit} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
          style={{ background: "var(--accent-orange)", color: "white", boxShadow: "0 4px 14px rgba(249,115,22,0.3)" }}>
          <IconDeviceFloppy size={15} />
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Register Teacher"}
        </button>
      </Group>

    </Stack>
  );
};

export default TeacherRegistration;