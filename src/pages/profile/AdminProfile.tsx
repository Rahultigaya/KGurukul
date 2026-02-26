// src/pages/profile/AdminProfile.tsx

import React, { useState } from "react";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBriefcase,
  IconCalendar,
  IconEdit,
  IconCheck,
  IconX,
  IconKey,
  IconBell,
  IconShield,
  IconCamera,
} from "@tabler/icons-react";
import ProfileHeader from "./components/ProfileHeader";
import { SectionCard } from "./components/PersonalInfo";
import { type AdminProfileData } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Mock admin — replace with real auth context / API
// ─────────────────────────────────────────────────────────────────────────────

const mockAdmin: AdminProfileData = {
  id: "admin-1",
  role: "admin",
  name: "Arjun Mehta",
  email: "arjun.mehta@institute.com",
  phone: "+91 98765 43210",
  address: "Shivajinagar, Pune, Maharashtra",
  photo: null,
  department: "Management",
  joined: "15 Jan, 2023",
  bio: "Institute administrator managing student registrations, fee collections, and overall operations.",
};

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
    bg: "bg-green-500/10  border-green-500/20",
  },
  {
    label: "Pending",
    value: "18",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Inline editable field
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

  const save = () => {
    onSave(field, draft);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  return (
    <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-slate-800/50 transition-colors">
      <div className="mt-0.5 w-8 h-8 rounded-lg bg-slate-700/60 flex items-center justify-center shrink-0 text-slate-400">
        {icon}
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
              autoFocus
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
                if (e.key === "Escape") cancel();
              }}
              className="flex-1 bg-slate-700/80 border border-violet-500/50 text-white text-sm rounded-lg px-3 py-1.5 outline-none focus:border-violet-400"
            />
            <button
              onClick={save}
              className="p-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg"
            >
              <IconCheck size={14} />
            </button>
            <button
              onClick={cancel}
              className="p-1.5 bg-red-500/20   hover:bg-red-500/30   text-red-400   rounded-lg"
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
// AdminProfile
// ─────────────────────────────────────────────────────────────────────────────

const AdminProfile: React.FC = () => {
  const [admin, setAdmin] = useState<AdminProfileData>(mockAdmin);

  const handlePhotoSave = (dataUrl: string) =>
    setAdmin((prev) => ({ ...prev, photo: dataUrl }));

  const handleFieldSave = (field: string, value: string) =>
    setAdmin((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6">
      <ProfileHeader
        id={admin.id}
        name={admin.name}
        role="admin"
        subtitle={`${admin.department} · Joined ${admin.joined}`}
        photo={admin.photo}
        onPhotoSave={handlePhotoSave}
      >
        {/* Stats strip */}
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
      </ProfileHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editable personal details */}
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
              label="Email"
              value={admin.email}
              field="email"
              type="email"
              onSave={handleFieldSave}
            />
            <EditableField
              icon={<IconPhone size={15} />}
              label="Phone"
              value={admin.phone}
              field="phone"
              type="tel"
              onSave={handleFieldSave}
            />
            <EditableField
              icon={<IconMapPin size={15} />}
              label="Address"
              value={admin.address}
              field="address"
              onSave={handleFieldSave}
            />
            <EditableField
              icon={<IconBriefcase size={15} />}
              label="Department"
              value={admin.department}
              field="department"
              onSave={handleFieldSave}
            />
            <EditableField
              icon={<IconCalendar size={15} />}
              label="Joined"
              value={admin.joined}
              field="joined"
              onSave={handleFieldSave}
            />
          </div>
          <div className="px-4 pt-3 pb-4">
            <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">
              Bio
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              {admin.bio}
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          {/* Photo upload zone */}
          <SectionCard
            icon={<IconCamera size={16} />}
            title="Profile Photo"
            iconColor="text-orange-400"
          >
            <p className="text-slate-500 text-xs text-center">
              Click the avatar above or drag &amp; drop an image onto it to
              change your photo.
            </p>
          </SectionCard>

          {/* Account actions */}
          <SectionCard
            icon={<IconShield size={16} />}
            title="Account"
            iconColor="text-violet-400"
          >
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
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
