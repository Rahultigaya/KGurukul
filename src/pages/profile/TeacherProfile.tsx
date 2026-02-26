// src/pages/profile/TeacherProfile.tsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IconUser,
  IconUsers,
  IconCalendar,
  IconBriefcase,
} from "@tabler/icons-react";
import ProfileHeader from "./components/ProfileHeader";
import PersonalInfo, { SectionCard } from "./components/PersonalInfo";
import {
  getTeacherById,
  updateTeacher,
} from "../admin/Users/Teacher/teacherStore";
import type { TeacherData } from "../admin/Users/Teacher/teacherStore";

// ─────────────────────────────────────────────────────────────────────────────
// TeacherProfile
// ─────────────────────────────────────────────────────────────────────────────

const TeacherProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [teacher, setTeacher] = useState<TeacherData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      return;
    }
    const data = getTeacherById(id);
    if (!data) {
      setNotFound(true);
      return;
    }
    setTeacher(data);
  }, [id]);

  const handlePhotoSave = (dataUrl: string) => {
    if (!teacher || !id) return;
    const updated = { ...teacher, avatar: dataUrl };
    setTeacher(updated);
    updateTeacher(id, updated);
  };

  if (notFound) return <p className="text-slate-400 p-8">Teacher not found.</p>;
  if (!teacher) return <p className="text-slate-400 p-8">Loading...</p>;

  const stats = [
    {
      label: "Students",
      value: String(teacher.students),
      color: "text-orange-400",
      bg: "bg-orange-500/10 border-orange-500/20",
    },
    {
      label: "Subject",
      value: teacher.subject,
      color: "text-violet-400",
      bg: "bg-violet-500/10 border-violet-500/20",
    },
    {
      label: "Status",
      value: teacher.status,
      color: "text-green-400",
      bg: "bg-green-500/10  border-green-500/20",
    },
    {
      label: "Since",
      value: teacher.joined,
      color: "text-blue-400",
      bg: "bg-blue-500/10   border-blue-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      <ProfileHeader
        id={String(teacher.id)}
        name={teacher.name}
        role="teacher"
        subtitle={`${teacher.subject} · ${teacher.status} · Joined ${teacher.joined}`}
        photo={teacher.avatar ?? null}
        onPhotoSave={handlePhotoSave}
      >
        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`rounded-xl border p-3 text-center ${s.bg}`}
            >
              <p className={`text-sm font-bold truncate ${s.color}`}>
                {s.value}
              </p>
              <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </ProfileHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Info */}
        <PersonalInfo
          icon={<IconUser size={16} />}
          title="Personal Information"
          iconColor="text-orange-400"
          fields={[
            { label: "Full Name", value: teacher.name },
            { label: "Email", value: "—" }, // add email to TeacherData when ready
            { label: "Phone", value: "—" }, // add phone to TeacherData when ready
          ]}
        />

        {/* Professional Info */}
        <PersonalInfo
          icon={<IconBriefcase size={16} />}
          title="Professional Details"
          iconColor="text-violet-400"
          fields={[
            { label: "Subject", value: teacher.subject },
            { label: "Status", value: teacher.status },
            { label: "Joined", value: teacher.joined },
            { label: "Students", value: String(teacher.students) },
          ]}
        />

        {/* Placeholder for schedule / classes */}
        <SectionCard
          icon={<IconCalendar size={16} />}
          title="Schedule"
          iconColor="text-blue-400"
        >
          <p className="text-slate-500 text-sm text-center py-4">
            Schedule details will appear here once configured.
          </p>
        </SectionCard>

        {/* Placeholder for assigned classes */}
        <SectionCard
          icon={<IconUsers size={16} />}
          title="Assigned Batches"
          iconColor="text-green-400"
        >
          <p className="text-slate-500 text-sm text-center py-4">
            Batch assignment details will appear here once configured.
          </p>
        </SectionCard>
      </div>
    </div>
  );
};

export default TeacherProfile;
