// src/pages/profile/components/ProfileHeader.tsx
//
// Shared header used by Admin, Student, and Teacher profile pages.
// Handles photo upload (click or drag & drop), shows name, role badge, subtitle.

import React, { useRef, useState } from "react";
import { IconCamera, IconCheck, IconX } from "@tabler/icons-react";
import { type UserRole } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────

const roleBadge: Record<UserRole, { label: string; classes: string }> = {
  admin: {
    label: "Admin",
    classes: "bg-orange-500/15 text-orange-400 border-orange-500/25",
  },
  student: {
    label: "Student",
    classes: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  },
  teacher: {
    label: "Teacher",
    classes: "bg-blue-500/15   text-blue-400   border-blue-500/25",
  },
  parent: {
    label: "Parent",
    classes: "bg-green-500/15  text-green-400  border-green-500/25",
  },
};

const avatarGradients = [
  "from-orange-500 to-pink-600",
  "from-violet-500 to-indigo-600",
  "from-green-500  to-teal-600",
  "from-blue-500   to-cyan-600",
  "from-yellow-500 to-orange-600",
];

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface ProfileHeaderProps {
  id: string;
  name: string;
  role: UserRole;
  subtitle: string;
  photo: string | null;
  onPhotoSave: (dataUrl: string) => void;
  children?: React.ReactNode;
  showPhotoPrompt?: boolean; // shows persistent "Add Photo" nudge (for students)
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  id,
  name,
  role,
  subtitle,
  photo,
  onPhotoSave,
  children,
  showPhotoPrompt = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setDragging] = useState(false);
  const [saved, setSaved] = useState(false);

  // ── Initials + gradient ──────────────────────────────────────────────────
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const gradient = avatarGradients[Number(id) % avatarGradients.length];
  const badge = roleBadge[role];
  const active = preview ?? photo;

  // whether to show the persistent "Add Photo" nudge state
  const showNudge = showPhotoPrompt && !active && !preview;

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleFile = (file: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!preview) return;
    onPhotoSave(preview);
    setPreview(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 overflow-hidden">
      {/* Banner */}
      <div className="h-24 bg-gradient-to-r from-orange-500/20 via-violet-500/15 to-transparent relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(249,115,22,0.12),transparent_70%)]" />
      </div>

      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 mb-5">
          {/* ── Avatar ──────────────────────────────────────────────── */}
          <div className="relative shrink-0">
            <div
              className={`w-24 h-24 rounded-2xl border-4 border-slate-800 overflow-hidden cursor-pointer group ${
                isDragging ? "ring-2 ring-orange-400" : ""
              } ${showNudge ? "ring-2 ring-red-500 ring-offset-2 ring-offset-slate-800" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleFile(e.dataTransfer.files?.[0] ?? null);
              }}
            >
              {active ? (
                <img
                  src={active}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
                >
                  <span className="text-white text-2xl font-bold">
                    {initials}
                  </span>
                </div>
              )}

              {/* Overlay — always visible when nudging, hover-only otherwise */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center gap-1 transition-opacity
                  ${
                    showNudge
                      ? "opacity-100 bg-red-950/70"
                      : "opacity-0 group-hover:opacity-100 bg-black/55"
                  }`}
              >
                <IconCamera size={18} className="text-white" />
                <span className="text-white text-[10px] font-medium">
                  {showNudge ? "Add Photo" : "Change"}
                </span>
              </div>
            </div>

            {/* Saved tick */}
            {saved && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-slate-800">
                <IconCheck size={12} className="text-white" />
              </div>
            )}

            {/* Pulsing dot indicator when nudging */}
            {showNudge && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />

          {/* ── Name + role badge ────────────────────────────────────── */}
          <div className="flex-1 sm:mb-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-white truncate">{name}</h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.classes}`}
              >
                {badge.label}
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1 truncate">{subtitle}</p>

            {/* Inline nudge text under subtitle — only when no photo */}
            {showNudge && (
              <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                <IconCamera size={11} />
                Click the avatar to add your profile photo
              </p>
            )}
          </div>

          {/* ── Save / Cancel buttons (only when preview is pending) ── */}
          {preview && (
            <div className="flex items-center gap-2 sm:mb-1 shrink-0">
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <IconCheck size={14} /> Save Photo
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors"
              >
                <IconX size={14} /> Cancel
              </button>
            </div>
          )}
        </div>

        {/* Photo prompt banner — shown above children when student has no photo */}
        {showNudge && (
          <div className="flex items-start gap-2.5 mb-4 px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30">
            <IconCamera size={14} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-300 leading-relaxed">
              <span className="font-semibold text-red-200">
                Profile photo missing.
              </span>{" "}
              Adding a photo helps staff and teachers identify you quickly.
              Click the avatar above to upload one.
            </p>
          </div>
        )}

        {/* Optional stats strip or any extra content passed as children */}
        {children}
      </div>
    </div>
  );
};

export default ProfileHeader;
