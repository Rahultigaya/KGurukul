// src/pages/profile/ProfilePage.tsx
//
// Main wrapper. Detects the logged-in user's role and renders the
// correct profile component.

import React from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";
import { IconButton } from "@mui/material";
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
        <IconButton
          onClick={() => navigate(-1)}
          className="!p-2 !rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <IconArrowLeft size={20} />
        </IconButton>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{meta.title}</h2>
          <p className="text-slate-500 text-sm font-medium">{meta.subtitle}</p>
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
