// src/pages/admin/Profile/UserProfile.tsx

import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconArrowLeft,
  IconCamera,
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBriefcase,
  IconCalendar,
  IconEdit,
  IconCheck,
  IconX,
  IconShield,
  IconBell,
  IconKey,
} from "@tabler/icons-react";

// ─────────────────────────────────────────────────────────────────────────────
// Mock user data — replace with real auth/user context later
// ─────────────────────────────────────────────────────────────────────────────

const defaultUser = {
  name: "Arjun Mehta",
  role: "Admin",
  email: "arjun.mehta@institute.com",
  phone: "+91 98765 43210",
  address: "Shivajinagar, Pune, Maharashtra",
  department: "Management",
  joined: "15 Jan, 2023",
  bio: "Institute administrator managing student registrations, fee collections, and overall operations.",
  photo: null as string | null,
};

// ─────────────────────────────────────────────────────────────────────────────
// Stat card data
// ─────────────────────────────────────────────────────────────────────────────

const stats = [
  {
    label: "Students",
    value: "248",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
  {
    label: "Teachers",
    value: "12",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    label: "Collections",
    value: "₹4.2L",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
  },
  {
    label: "Pending",
    value: "18",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Editable field component
// ─────────────────────────────────────────────────────────────────────────────

interface EditableFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  field: string;
  type?: string;
  onSave: (field: string, value: string) => void;
}

const EditableField: React.FC<EditableFieldProps> = ({
  icon,
  label,
  value,
  field,
  type = "text",
  onSave,
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const handleSave = () => {
    onSave(field, draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  return (
    <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-slate-800/50 transition-colors">
      <div className="mt-0.5 w-8 h-8 rounded-lg bg-slate-700/60 flex items-center justify-center shrink-0">
        <span className="text-slate-400">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">
          {label}
        </p>
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              type={type}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
              className="flex-1 bg-slate-700/80 border border-violet-500/50 text-white text-sm rounded-lg px-3 py-1.5 outline-none focus:border-violet-400 transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
            />
            <button
              onClick={handleSave}
              className="p-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
            >
              <IconCheck size={14} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              <IconX size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-white text-sm font-medium truncate">{value}</p>
            <button
              onClick={() => setEditing(true)}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-orange-400 transition-all"
            >
              <IconEdit size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState(defaultUser);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [photoSaved, setPhotoSaved] = useState(false);

  // ── Photo upload ──────────────────────────────────────────────────────────

  const handlePhotoChange = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
      setPhotoSaved(false);
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
    setPhotoSaved(true);
    setTimeout(() => setPhotoSaved(false), 2000);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setUser((prev) => ({ ...prev, photo: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Field save ────────────────────────────────────────────────────────────

  const handleSaveField = (field: string, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  // ── Active photo ──────────────────────────────────────────────────────────

  const activePhoto = photoPreview ?? user.photo;
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-slate-700/60 text-slate-400 hover:text-white transition-colors"
        >
          <IconArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">My Profile</h2>
          <p className="text-slate-400 text-sm">
            View and manage your account details
          </p>
        </div>
      </div>

      {/* ── Top card — photo + name + stats ────────────────────────────── */}
      <div className="relative rounded-2xl border border-slate-700/60 bg-slate-800/40 overflow-hidden">
        {/* Banner gradient */}
        <div className="h-28 bg-gradient-to-r from-orange-500/20 via-violet-500/20 to-slate-800/0 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(249,115,22,0.15),transparent_60%)]" />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar row */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 mb-6">
            {/* Avatar with upload overlay */}
            <div
              className={`relative shrink-0 w-24 h-24 rounded-2xl border-4 border-slate-800 overflow-hidden cursor-pointer group ${isDragging ? "ring-2 ring-orange-400" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {activePhoto ? (
                <img
                  src={activePhoto}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-500 to-violet-600 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {initials}
                  </span>
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                <IconCamera size={18} className="text-white" />
                <span className="text-white text-[10px] font-medium">
                  Change
                </span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />

            {/* Name + role */}
            <div className="flex-1 sm:mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold text-white">{user.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/25">
                  {user.role}
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-0.5">
                {user.department} · Joined {user.joined}
              </p>
            </div>

            {/* Photo action buttons — show only when preview is pending */}
            {photoPreview && (
              <div className="flex items-center gap-2 sm:mb-1">
                <button
                  onClick={handleSavePhoto}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    photoSaved
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {photoSaved ? (
                    <>
                      <IconCheck size={14} /> Saved
                    </>
                  ) : (
                    "Save Photo"
                  )}
                </button>
                <button
                  onClick={handleRemovePhoto}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-700/60 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <IconX size={14} />
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className={`rounded-xl border p-3 text-center ${s.bg}`}
              >
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom two columns ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Personal details (editable) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-700/60 bg-slate-800/40 p-2">
          <div className="px-4 pt-4 pb-2 flex items-center gap-2">
            <IconUser size={16} className="text-orange-400" />
            <h4 className="text-white font-semibold text-sm">
              Personal Details
            </h4>
            <span className="ml-auto text-xs text-slate-500">
              Hover a field to edit
            </span>
          </div>

          <div className="divide-y divide-slate-700/40">
            <EditableField
              icon={<IconMail size={15} />}
              label="Email Address"
              value={user.email}
              field="email"
              type="email"
              onSave={handleSaveField}
            />
            <EditableField
              icon={<IconPhone size={15} />}
              label="Phone Number"
              value={user.phone}
              field="phone"
              type="tel"
              onSave={handleSaveField}
            />
            <EditableField
              icon={<IconMapPin size={15} />}
              label="Address"
              value={user.address}
              field="address"
              onSave={handleSaveField}
            />
            <EditableField
              icon={<IconBriefcase size={15} />}
              label="Department"
              value={user.department}
              field="department"
              onSave={handleSaveField}
            />
            <EditableField
              icon={<IconCalendar size={15} />}
              label="Joined On"
              value={user.joined}
              field="joined"
              onSave={handleSaveField}
            />
          </div>

          {/* Bio */}
          <div className="px-4 pt-3 pb-4">
            <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">
              Bio
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">{user.bio}</p>
          </div>
        </div>

        {/* Right — Quick actions */}
        <div className="flex flex-col gap-4">
          {/* Photo upload zone */}
          <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-4">
            <div className="flex items-center gap-2 mb-3">
              <IconCamera size={16} className="text-orange-400" />
              <h4 className="text-white font-semibold text-sm">
                Profile Photo
              </h4>
            </div>
            <div
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-orange-400 bg-orange-500/10"
                  : "border-slate-600 hover:border-slate-500 hover:bg-slate-700/30"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <IconCamera size={24} className="text-slate-500 mx-auto mb-2" />
              <p className="text-slate-400 text-xs font-medium">
                Click or drag & drop
              </p>
              <p className="text-slate-600 text-xs mt-1">PNG, JPG, WEBP</p>
            </div>
            {photoPreview && (
              <div className="mt-3 flex items-center gap-2">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-10 h-10 rounded-lg object-cover border border-slate-600"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-xs font-medium truncate">
                    New photo ready
                  </p>
                  <p className="text-slate-500 text-xs">
                    Click "Save Photo" above
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Account actions */}
          <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-4">
            <div className="flex items-center gap-2 mb-3">
              <IconShield size={16} className="text-violet-400" />
              <h4 className="text-white font-semibold text-sm">Account</h4>
            </div>
            <div className="space-y-2">
              {[
                {
                  icon: <IconKey size={15} />,
                  label: "Change Password",
                  color: "hover:text-orange-400",
                },
                {
                  icon: <IconBell size={15} />,
                  label: "Notifications",
                  color: "hover:text-violet-400",
                },
                {
                  icon: <IconShield size={15} />,
                  label: "Privacy Settings",
                  color: "hover:text-green-400",
                },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 ${item.color} hover:bg-slate-700/50 transition-all text-sm text-left`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
