// src/pages/profile/ProfilePage.tsx
//
// Main wrapper. Detects the logged-in user's role and renders the
// correct profile component.
//
// Router setup (add these routes):
//
//   { path: "profile",                  element: <ProfilePage /> }
//   { path: "profile/student/:id",      element: <ProfilePage /> }
//   { path: "profile/teacher/:id",      element: <ProfilePage /> }
//
// Or simply use ProfilePage as the single entry point and let it
// read the role from your auth context.

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";
import AdminProfile from "./AdminProfile";
import StudentProfile from "./StudentProfile";
import TeacherProfile from "./TeacherProfile";
import { type UserRole } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Mock auth — replace with your real auth context
// e.g. const { role } = useAuth();
// ─────────────────────────────────────────────────────────────────────────────

function useCurrentRole(): UserRole {
  // TODO: replace with real auth context
  // const { user } = useAuth();
  // return user.role;

  // For now: derive from URL
  useParams();
  const path = window.location.pathname;

  if (path.includes("student")) return "student";
  if (path.includes("teacher")) return "teacher";
  return "admin";
}

// ─────────────────────────────────────────────────────────────────────────────
// ProfilePage
// ─────────────────────────────────────────────────────────────────────────────

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const role = useCurrentRole();

  const titles: Record<UserRole, string> = {
    admin: "Admin Profile",
    student: "Student Profile",
    teacher: "Teacher Profile",
  };

  const subtitles: Record<UserRole, string> = {
    admin: "Manage your account and institute settings",
    student: "View your registration and payment details",
    teacher: "View your professional details and schedule",
  };

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
          <h2 className="text-2xl font-bold text-white">{titles[role]}</h2>
          <p className="text-slate-400 text-sm">{subtitles[role]}</p>
        </div>
      </div>

      {/* Render correct profile based on role */}
      {role === "admin" && <AdminProfile />}
      {role === "student" && <StudentProfile />}
      {role === "teacher" && <TeacherProfile />}
    </div>
  );
};

export default ProfilePage;
