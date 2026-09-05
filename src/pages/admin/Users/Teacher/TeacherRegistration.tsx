import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { PageHeader } from "../../../../components/PageHeader";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Avatar,
  Alert,
  IconButton,
  Button,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  IconUpload, IconX, IconUser,
  IconDeviceFloppy, IconAlertCircle, IconPencil,
} from "@tabler/icons-react";
import Swal from "sweetalert2";
import { useTheme } from "../../../../context/ThemeContext";
import {
  emptyTeacherForm, getTeacherById, addTeacher, updateTeacher,
  type TeacherFormData,
} from "./teacherStore";
import { uploadToCloudinary, validateImage } from "../../../../utils/cloudinary";

// ─────────────────────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────────────────────

type FormErrors = Partial<Record<keyof TeacherFormData | "general", string>>;

function validate(form: TeacherFormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.firstName.trim()) errors.firstName = "First name is required.";
  else if (!/^[a-zA-Z\s]+$/.test(form.firstName))
    errors.firstName = "First name must contain letters only.";
  if (form.middleName.trim() && !/^[a-zA-Z\s]+$/.test(form.middleName))
    errors.middleName = "Middle name must contain letters only.";
  if (!form.lastName.trim()) errors.lastName = "Last name is required.";
  else if (!/^[a-zA-Z\s]+$/.test(form.lastName))
    errors.lastName = "Last name must contain letters only.";
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!/\S+@\S+\.\S+/.test(form.email))
    errors.email = "Enter a valid email address.";
  if (!form.joiningDate) errors.joiningDate = "Joining date is required.";
  return errors;
}

// ─────────────────────────────────────────────────────────────────────────────
// Date Helpers (Prevent UTC offset shifts and RangeError crashes)
// ─────────────────────────────────────────────────────────────────────────────

const formatDateToISO = (date: Date | null): string => {
  if (!date || isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseISOToDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  return new Date(year, month, day);
};

// ─────────────────────────────────────────────────────────────────────────────
// Shared MUI input styling (matches your CSS var theme, keeps borders/labels themed)
// ─────────────────────────────────────────────────────────────────────────────

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "var(--bg-input)",
    color: "var(--text-primary)",
    "& fieldset": { borderColor: "var(--border-default)" },
    "&:hover fieldset": { borderColor: "var(--border-accent)" },
    "&.Mui-focused fieldset": { borderColor: "var(--accent-orange)" },
  },
  "& .MuiInputLabel-root": { color: "var(--text-muted)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "var(--accent-orange)" },
  "& .MuiFormHelperText-root": { color: "#f87171" },
};

// ─────────────────────────────────────────────────────────────────────────────
// TeacherRegistration
// ─────────────────────────────────────────────────────────────────────────────

const TeacherRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { isDark } = useTheme();
  const isEdit = Boolean(id);
  const isView = searchParams.get("mode") === "view" || window.location.pathname.includes("view-teacher");

  const [form, setForm] = useState<TeacherFormData>(emptyTeacherForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const hasFetched = useRef(false);

  // ── Load for edit / view ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isEdit || !id || hasFetched.current) return;
    hasFetched.current = true;

    const loadTeacher = async () => {
      try {
        const t = await getTeacherById(id);
        if (!t) {
          Swal.fire({
            title: "Teacher not found",
            text: "The teacher record could not be found on the server.",
            icon: "error",
            background: isDark ? "#1e293b" : "#fff",
            color: isDark ? "#f8fafc" : "#0f172a",
            confirmButtonColor: "#7c3aed",
          });
          return;
        }
        setForm({
          photo: t.photo,
          firstName: t.firstName,
          middleName: t.middleName,
          lastName: t.lastName,
          email: t.email,
          joiningDate: t.joiningDate,
          status: t.status,
        });
      } catch {
        Swal.fire({
          title: "Error",
          text: "Failed to load teacher data from server.",
          icon: "error",
          background: isDark ? "#1e293b" : "#fff",
          color: isDark ? "#f8fafc" : "#0f172a",
          confirmButtonColor: "#7c3aed",
        });
      }
    };

    loadTeacher();
  }, [id, isEdit, isDark]);

  // ── Field helpers ──────────────────────────────────────────────────────────
  const set = useCallback(<K extends keyof TeacherFormData>(field: K, value: TeacherFormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  }, []);

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.valid) {
      Swal.fire({
        title: "Invalid File",
        text: validation.error,
        icon: "warning",
        background: isDark ? "#1e293b" : "#ffffff",
        color: isDark ? "#f8fafc" : "#0f172a",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = reader.result as string;
        const cloudinaryUrl = await uploadToCloudinary(base64, "kgurukul/teachers");
        set("photo", cloudinaryUrl);
      } catch (error) {
        console.error("Error uploading photo:", error);
        Swal.fire({
          title: "Upload Failed",
          text: "Could not upload photo. Please try again.",
          icon: "error",
          background: isDark ? "#1e293b" : "#ffffff",
          color: isDark ? "#f8fafc" : "#0f172a",
          confirmButtonColor: "#ef4444",
        });
      }
    };
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

      const formattedDate = form.joiningDate
        ? new Date(form.joiningDate + "T00:00:00").toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "";

      setSaving(false);
      Swal.fire({
        title: isEdit ? "Teacher Updated!" : "Teacher Registered!",
        html: `
          <div style="color:#94a3b8;font-size:14px;line-height:1.8">
            <div style="color:#f97316;font-weight:700;font-size:16px;margin-bottom:8px">
              ${previewName}
            </div>
            <div>Email: ${form.email}</div>
            <div>Joined: ${formattedDate}</div>
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ maxWidth: "1280px", mx: "auto" }} className="space-y-6">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <PageHeader
          title={isView ? "View Teacher" : isEdit ? "Edit Teacher" : "Teacher Registration"}
          subtitle={isView ? "View teacher details" : isEdit ? "Update teacher information" : "Register a new teacher"}
        />

        {/* ── View Mode Banner ───────────────────────────────────────────── */}
        {isView && (
          <Alert severity="info" sx={{ borderRadius: 3, mt: 2 }}>
            You are viewing this teacher in <strong>View Mode (Read-Only)</strong>. All form inputs are disabled. Click <strong>Edit Teacher</strong> below to modify.
          </Alert>
        )}

        {/* ── Error banner ──────────────────────────────────────────────── */}
        {errorCount > 0 && !isView && (
          <Alert
            icon={<IconAlertCircle size={18} />}
            severity="error"
            sx={{
              backgroundColor: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "var(--text-primary)",
              "& .MuiAlert-icon": { color: "#f87171" },
              mt: 2,
            }}
          >
            <strong>Please fix the errors below before saving.</strong>{" "}
            {errorCount === 1 ? "1 required field is missing or invalid." : `${errorCount} required fields are missing or invalid.`}
          </Alert>
        )}

        {/* ── Form card ─────────────────────────────────────────────────── */}
        <fieldset
          disabled={isView}
          className={`contents border-0 p-0 m-0 ${
            isView
              ? "pointer-events-none opacity-85 select-text [&_input]:!cursor-not-allowed [&_.MuiInputBase-root]:!bg-slate-100/90 [&_.MuiInputBase-input]:!text-slate-600 [&_.MuiOutlinedInput-notchedOutline]:!border-slate-300"
              : ""
          }`}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              mt: 2,
              background: "var(--bg-card)",
              border: "1px solid var(--border-accent)",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

              {/* ── Photo + name preview column ───────────────────────────── */}
              <div className="md:col-span-3">
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, pt: { sm: 1 } }}>

                  {form.photo ? (
                    <Box sx={{ position: "relative" }}>
                      <Avatar src={form.photo} sx={{ width: 96, height: 96 }} />
                      {!isView && (
                        <IconButton
                          onClick={() => set("photo", null)}
                          size="small"
                          sx={{
                            position: "absolute", top: -4, right: -4,
                            width: 24, height: 24,
                            background: "#ef4444",
                            "&:hover": { background: "#dc2626" },
                          }}
                        >
                          <IconX size={12} color="white" />
                        </IconButton>
                      )}
                    </Box>
                  ) : (
                    <Avatar
                      sx={{
                        width: 96, height: 96,
                        background: "var(--bg-tertiary)",
                        border: "2px dashed var(--border-default)",
                      }}
                    >
                      <IconUser size={38} style={{ color: "var(--text-muted)" }} />
                    </Avatar>
                  )}

                  {!isView && (
                    <label style={{ cursor: "pointer" }}>
                      <input type="file" accept="image/jpeg,image/jpg,image/png" hidden onChange={handlePhotoUpload} />
                      <Box
                        sx={{
                          display: "flex", alignItems: "center", gap: 0.75,
                          px: 1.5, py: 0.75, borderRadius: 2,
                          fontSize: 12, fontWeight: 500,
                          background: "var(--bg-tertiary)",
                          color: "var(--text-secondary)",
                          border: "1px solid var(--border-default)",
                        }}
                      >
                        <IconUpload size={13} />
                        {form.photo ? "Change" : "Upload Photo"}
                      </Box>
                    </label>
                  )}

                <Typography variant="caption" align="center" sx={{ color: "var(--text-muted)" }}>
                  Optional · JPG, PNG · Max 500KB
                </Typography>

                <Box
                  sx={{
                    width: "100%", mt: 0.5, px: 1.5, py: 1, borderRadius: 2, textAlign: "center",
                    background: "var(--bg-tertiary)", border: "1px solid var(--border-default)",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "var(--text-muted)", display: "block", mb: 0.25 }}>
                    Preview
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: form.firstName ? "var(--text-primary)" : "var(--text-muted)",
                      fontStyle: form.firstName ? "normal" : "italic",
                    }}
                  >
                    {previewName}
                  </Typography>
                </Box>
              </Box>
            </div>

            {/* ── Fields column ─────────────────────────────────────────── */}
            <div className="md:col-span-9">
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

                {/* Name row */}
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", mb: 1 }}
                  >
                    Full Name
                  </Typography>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <TextField
                        size="small"
                        fullWidth
                        label="First Name"
                        value={form.firstName}
                        onChange={(e) => set("firstName", e.target.value)}
                        required
                        error={Boolean(errors.firstName)}
                        helperText={errors.firstName}
                        sx={fieldSx}
                      />
                    </div>
                    <div>
                      <TextField
                        size="small"
                        fullWidth
                        label="Middle Name"
                        value={form.middleName}
                        onChange={(e) => set("middleName", e.target.value)}
                        error={Boolean(errors.middleName)}
                        helperText={errors.middleName}
                        sx={fieldSx}
                      />
                    </div>
                    <div>
                      <TextField
                        size="small"
                        fullWidth
                        label="Last Name"
                        value={form.lastName}
                        onChange={(e) => set("lastName", e.target.value)}
                        required
                        error={Boolean(errors.lastName)}
                        helperText={errors.lastName}
                        sx={fieldSx}
                      />
                    </div>
                  </div>
                </Box>

                <Box sx={{ borderTop: "1px solid var(--border-default)" }} />

                {/* Contact + Joining date */}
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", mb: 1 }}
                  >
                    Contact & Joining
                  </Typography>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-7">
                      <TextField
                        size="small"
                        fullWidth
                        label="Email Address"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        required
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                        sx={fieldSx}
                      />
                    </div>
                    <div className="sm:col-span-5">
                      <DatePicker
                        label="Joining Date"
                        format="dd/MM/yyyy"
                        value={parseISOToDate(form.joiningDate)}
                        onChange={(newDate: Date | null) => {
                          set("joiningDate", formatDateToISO(newDate));
                        }}
                        maxDate={new Date()}
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            required: true,
                            error: Boolean(errors.joiningDate),
                            helperText: errors.joiningDate,
                            onKeyDown: (e) => e.preventDefault(),
                            sx: fieldSx,
                          },
                          popper: {
                            sx: {
                              "& .MuiPaper-root": {
                                backgroundColor: "var(--bg-secondary)",
                                color: "var(--text-primary)",
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </Box>
              </Box>
            </div>
          </div>
        </Paper>
      </fieldset>

        {/* ── Actions ───────────────────────────────────────────────────── */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 2 }}>
          <Button
            onClick={() => navigate("/Users")}
            startIcon={<IconX size={15} />}
            sx={{
              px: 2, py: 1.25, borderRadius: 3,
              fontSize: 14, fontWeight: 500, textTransform: "none",
              background: "var(--bg-tertiary)", color: "var(--text-secondary)",
              border: "1px solid var(--border-default)",
              "&:hover": { background: "var(--bg-tertiary)", opacity: 0.85 },
            }}
          >
            Cancel
          </Button>
          {isView ? (
            <Button
              onClick={() => navigate(`/Users/edit-teacher/${id}`)}
              startIcon={<IconPencil size={15} />}
              sx={{
                px: 2.5, py: 1.25, borderRadius: 3,
                fontSize: 14, fontWeight: 600, textTransform: "none",
                background: "#2563eb", color: "white",
                boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                "&:hover": { background: "#1d4ed8" },
              }}
            >
              Edit Teacher
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={saving}
              startIcon={<IconDeviceFloppy size={15} />}
              sx={{
                px: 2.5, py: 1.25, borderRadius: 3,
                fontSize: 14, fontWeight: 600, textTransform: "none",
                background: "var(--accent-orange)", color: "white",
                boxShadow: "0 4px 14px rgba(249,115,22,0.3)",
                "&:hover": { background: "var(--accent-orange)", opacity: 0.9 },
                "&.Mui-disabled": { opacity: 0.5, color: "white" },
              }}
            >
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Register Teacher"}
            </Button>
          )}
        </Box>

      </Box>
    </LocalizationProvider>
  );
};

export default TeacherRegistration;
