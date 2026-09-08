// src/pages/admin/Users/AdminProfile.tsx
// Route: { path: "Users/profile", element: <UserProfile /> }

import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../../components/PageHeader";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Divider,
  Switch,
  Tooltip,
} from "@mui/material";
import {
  IconCamera,
  IconUser,
  IconMail,
  IconPhone,
  IconCheck,
  IconX,
  IconBell,
  IconSchool,
  IconUsers,
  IconBook,
  IconCurrencyRupee,
  IconSparkles,
  IconTrash,
} from "@tabler/icons-react";
import Swal from "sweetalert2";

// ─────────────────────────────────────────────────────────────────────────────
// Default Admin Data (Only Name, Email, and Phone)
// ─────────────────────────────────────────────────────────────────────────────

const initialAdmin = {
  name: "Arjun Mehta",
  role: "Admin",
  email: "arjun.mehta@kgurukul.com",
  phone: "+91 98765 43210",
  photo: null as string | null,
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"overview" | "notifications">("overview");
  const [user, setUser] = useState(initialAdmin);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Notification Preferences State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [feeReminders, setFeeReminders] = useState(true);
  const [attendanceAlerts, setAttendanceAlerts] = useState(true);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const stored = localStorage.getItem("userData");
      const storedEmail = localStorage.getItem("userEmail");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser((prev) => ({
          ...prev,
          name: parsed.name || parsed.full_name || parsed.username || prev.name,
          email: parsed.email || storedEmail || prev.email,
          phone: parsed.phone || parsed.contactNo || parsed.contact_no || prev.phone,
          role: parsed.role || prev.role,
          photo: parsed.avatar || parsed.photo || prev.photo,
        }));
      } else if (storedEmail) {
        setUser((prev) => ({ ...prev, email: storedEmail }));
      }
    } catch (err) {
      console.error("Failed to load user from localStorage:", err);
    }
  }, []);

  // ── Photo Upload Handlers ──────────────────────────────────────────────────

  const handlePhotoChange = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please upload an image file (PNG, JPG, or WEBP).",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPhotoPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePhotoChange(e.target.files?.[0] ?? null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handlePhotoChange(e.dataTransfer.files?.[0] ?? null);
  };

  const handleSavePhoto = () => {
    if (!photoPreview) return;
    setUser((prev) => ({ ...prev, photo: photoPreview }));

    // Persist to localStorage
    try {
      const stored = localStorage.getItem("userData");
      const current = stored ? JSON.parse(stored) : {};
      localStorage.setItem("userData", JSON.stringify({ ...current, photo: photoPreview, avatar: photoPreview }));
    } catch (e) {
      console.error(e);
    }

    setPhotoPreview(null);
    Swal.fire({
      icon: "success",
      title: "Photo Updated",
      text: "Profile photo saved successfully!",
      timer: 1800,
      showConfirmButton: false,
    });
  };

  const handleRemovePhoto = () => {
    Swal.fire({
      title: "Remove Photo?",
      text: "Your profile picture will be reset to default initials.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, remove",
    }).then((result) => {
      if (result.isConfirmed) {
        setPhotoPreview(null);
        setUser((prev) => ({ ...prev, photo: null }));
        if (fileInputRef.current) fileInputRef.current.value = "";
        try {
          const stored = localStorage.getItem("userData");
          if (stored) {
            const current = JSON.parse(stored);
            delete current.photo;
            delete current.avatar;
            localStorage.setItem("userData", JSON.stringify(current));
          }
        } catch (e) {
          console.error(e);
        }
      }
    });
  };

  const activePhoto = photoPreview ?? user.photo;
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <PageHeader
        title="Admin Profile"
        subtitle="View and manage your account details and system settings"
        onBack={() => navigate("/adminDashboard")}
      />

      {/* ── Top Hero Profile Card ────────────────────────────────────────── */}
      <Card
        elevation={1}
        className="bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
      >
        {/* Soft, Light Top Banner */}
        <div className="h-16 sm:h-20 bg-gradient-to-r from-slate-100 via-blue-50/60 to-indigo-50/50 border-b border-slate-200/60 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(59,130,246,0.06),transparent_60%)]" />
          <div className="absolute top-3 right-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-blue-700 border border-blue-200/80 shadow-xs">
              <IconSparkles size={14} className="text-blue-600" />
              Verified Institute Admin
            </span>
          </div>
        </div>

        <CardContent className="!p-5 sm:!p-6 !pt-0 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-10 sm:-mt-12 mb-6">
            {/* Left: Avatar + Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              {/* Avatar with Click-to-Upload */}
              <div
                className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white shadow-md overflow-hidden cursor-pointer group bg-white shrink-0 ${
                  isDragging ? "ring-4 ring-blue-400" : ""
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                title="Click or drag an image to update avatar"
              >
                {activePhoto ? (
                  <img src={activePhoto} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-black">
                    {initials}
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
                  <IconCamera size={20} />
                  <span className="text-[10px] font-bold">Change Photo</span>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
              />

              {/* Title & Core Meta */}
              <div className="space-y-1 sm:mb-1">
                <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                  <h2 className="text-2xl font-black text-slate-800">{user.name}</h2>
                  <Chip
                    label={user.role}
                    size="small"
                    sx={{
                      bgcolor: "#eff6ff",
                      color: "#1d4ed8",
                      border: "1px solid #bfdbfe",
                      fontWeight: 700,
                      borderRadius: "8px",
                      height: "24px",
                    }}
                  />
                  <Chip
                    label="Active"
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ fontWeight: 700, borderRadius: "8px", height: "24px" }}
                  />
                </div>

                <p className="text-sm font-semibold text-slate-600 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <span>{user.email}</span>
                  <span className="text-slate-300">•</span>
                  <span>{user.phone}</span>
                </p>
              </div>
            </div>

            {/* Right: Actions / Pending Photo Controls */}
            {photoPreview ? (
              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end sm:mb-1">
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSavePhoto}
                  startIcon={<IconCheck size={16} />}
                  sx={{
                    bgcolor: "#16a34a",
                    "&:hover": { bgcolor: "#15803d" },
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 700,
                    px: 2.5,
                  }}
                >
                  Save Photo
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={() => setPhotoPreview(null)}
                  startIcon={<IconX size={16} />}
                  sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600 }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end sm:mb-1">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                  startIcon={<IconCamera size={16} />}
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 600,
                    color: "#334155",
                    borderColor: "#cbd5e1",
                    "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" },
                  }}
                >
                  Upload Photo
                </Button>
                {user.photo && (
                  <Tooltip title="Remove custom photo">
                    <IconButton size="small" color="error" onClick={handleRemovePhoto}>
                      <IconTrash size={18} />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            )}
          </div>

          <Divider className="my-5" />

          {/* ── Key Statistics Row ────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <IconSchool size={22} />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">248</p>
                <p className="text-xs font-semibold text-blue-700">Enrolled Students</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-violet-50/70 border border-violet-100 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <IconUsers size={22} />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">12</p>
                <p className="text-xs font-semibold text-violet-700">Active Teachers</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <IconBook size={22} />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">16</p>
                <p className="text-xs font-semibold text-amber-700">Batches Running</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <IconCurrencyRupee size={22} />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">₹4.2L</p>
                <p className="text-xs font-semibold text-emerald-700">Monthly Collections</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Navigation Tabs ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <Button
          onClick={() => setActiveTab("overview")}
          className={`!flex !items-center !gap-2 !px-5 !py-3 !text-sm !font-bold !rounded-t-xl transition-all !normal-case ${
            activeTab === "overview"
              ? "!bg-white !text-blue-600 !border-t-2 !border-t-blue-600 !border-x !border-x-slate-200 -mb-px shadow-xs"
              : "!text-slate-500 hover:!text-slate-800 hover:!bg-slate-100"
          }`}
        >
          <IconUser size={18} />
          <span>Basic Information</span>
        </Button>

        <Button
          onClick={() => setActiveTab("notifications")}
          className={`!flex !items-center !gap-2 !px-5 !py-3 !text-sm !font-bold !rounded-t-xl transition-all !normal-case ${
            activeTab === "notifications"
              ? "!bg-white !text-blue-600 !border-t-2 !border-t-blue-600 !border-x !border-x-slate-200 -mb-px shadow-xs"
              : "!text-slate-500 hover:!text-slate-800 hover:!bg-slate-100"
          }`}
        >
          <IconBell size={18} />
          <span>Notification Preferences</span>
        </Button>
      </div>

      {/* ── Tab 1: Basic Information (Only Name, Email, Number) ───────────── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Basic Information */}
          <div className="lg:col-span-8">
            <Card elevation={1} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm">
              <CardContent className="!p-6 space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <IconUser size={18} />
                  </div>
                  <Typography variant="h6" className="!font-bold text-slate-800 !text-base">
                    Basic Information
                  </Typography>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      <IconUser size={15} className="text-blue-600" />
                      Full Name
                    </div>
                    <p className="text-base font-bold text-slate-800">{user.name}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      <IconMail size={15} className="text-blue-600" />
                      Email Address
                    </div>
                    <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      <IconPhone size={15} className="text-emerald-600" />
                      Contact Number
                    </div>
                    <p className="text-sm font-bold text-slate-800">{user.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Profile Photo Upload Card */}
          <div className="lg:col-span-4">
            <Card elevation={1} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm">
              <CardContent className="!p-6 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <IconCamera size={18} className="text-blue-600" />
                  <Typography variant="subtitle1" className="!font-bold text-slate-800">
                    Profile Photo
                  </Typography>
                </div>

                <div
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-blue-500 bg-blue-50/70 scale-102"
                      : "border-slate-200 bg-slate-50/60 hover:border-blue-300 hover:bg-blue-50/30"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                    <IconCamera size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Click or drag image here</p>
                  <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, or WEBP (Max 2MB)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── Tab 2: Notification Preferences ──────────────────────────────── */}
      {activeTab === "notifications" && (
        <Card elevation={1} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm max-w-3xl">
          <CardContent className="!p-6 space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <IconBell size={18} />
              </div>
              <div>
                <Typography variant="h6" className="!font-bold text-slate-800 !text-base">
                  Notification & Alert Preferences
                </Typography>
                <Typography variant="caption" className="text-slate-400 block">
                  Select which notifications you would like to receive across channels
                </Typography>
              </div>
            </div>

            <div className="space-y-4 divide-y divide-slate-100">
              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="text-sm font-bold text-slate-800">Email Digest & Alerts</p>
                  <p className="text-xs text-slate-500">Receive weekly summaries and important administrative announcements via email.</p>
                </div>
                <Switch checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} color="primary" />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="text-sm font-bold text-slate-800">SMS Notifications</p>
                  <p className="text-xs text-slate-500">Get urgent OTPs and critical server alerts directly on your registered mobile number.</p>
                </div>
                <Switch checked={smsAlerts} onChange={(e) => setSmsAlerts(e.target.checked)} color="primary" />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="text-sm font-bold text-slate-800">Student Attendance Updates</p>
                  <p className="text-xs text-slate-500">Notifications when attendance sheets are submitted or students are absent.</p>
                </div>
                <Switch checked={attendanceAlerts} onChange={(e) => setAttendanceAlerts(e.target.checked)} color="primary" />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="text-sm font-bold text-slate-800">Fee Collection & Invoice Reminders</p>
                  <p className="text-xs text-slate-500">Alerts for upcoming installment due dates and payment receipts.</p>
                </div>
                <Switch checked={feeReminders} onChange={(e) => setFeeReminders(e.target.checked)} color="primary" />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="contained"
                onClick={() =>
                  Swal.fire({
                    icon: "success",
                    title: "Preferences Saved",
                    text: "Notification settings updated successfully!",
                    timer: 1600,
                    showConfirmButton: false,
                  })
                }
                className="!bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !px-6 !py-2 !rounded-xl !text-sm shadow-md !normal-case"
              >
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserProfile;
