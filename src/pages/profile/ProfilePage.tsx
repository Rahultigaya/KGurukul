// src/pages/profile/ProfilePage.tsx
//
// Main wrapper. Detects the logged-in user's role and renders the
// correct profile component.

import React from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";
import AdminProfile from "./AdminProfile";
import StudentProfile from "./StudentProfile";
import TeacherProfile from "./TeacherProfile";
import ParentProfile from "./ParentProfile";
import { type UserRole } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Mock auth — replace with your real auth context
// e.g. const { user } = useAuth(); return user.role;
// ─────────────────────────────────────────────────────────────────────────────

function useCurrentRole(): UserRole {
  const path = window.location.pathname;
  if (path.includes("student")) return "student";
  if (path.includes("teacher")) return "teacher";
  if (path.includes("parent")) return "parent";
  return "admin";
}

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────

const pageMeta: Record<UserRole, { title: string; subtitle: string }> = {
  admin: {
    title: "Admin Profile",
    subtitle: "Manage your account and institute settings",
  },
  student: {
    title: "Student Profile",
    subtitle: "View your registration and payment details",
  },
  teacher: {
    title: "Teacher Profile",
    subtitle: "View your professional details and schedule",
  },
  parent: {
    title: "Parent Profile",
    subtitle: "View your children's enrollment and fee details",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ProfilePage
// ─────────────────────────────────────────────────────────────────────────────

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const role = useCurrentRole();
  const meta = pageMeta[role];

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-slate-700/60 text-slate-400 hover:text-white transition-colors"
        >
          <IconArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">{meta.title}</h2>
          <p className="text-slate-400 text-sm">{meta.subtitle}</p>
        </div>
      </div>

      {/* Render correct profile based on role */}
      {role === "admin" && <AdminProfile />}
      {role === "student" && <StudentProfile />}
      {role === "teacher" && <TeacherProfile />}
      {role === "parent" && <ParentProfile />}
    </div>
  );
};

export default ProfilePage;
