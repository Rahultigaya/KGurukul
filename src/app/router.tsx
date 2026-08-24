// src/app/router.tsx

import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";

import AppLayout from "../pages/components/layout/AppLayout";

import AdminDashboard from "../pages/admin/Dashbaord/AdminDashboard";

// Users
import UsersList from "../pages/admin/Users/UserList";
import StudentRegistration from "../pages/admin/Users/Student/StudentRegistration";
import StudentRegistration1 from "../pages/admin/Users/StudentRegistration1";
import TeacherRegistration from "../pages/admin/Users/Teacher/TeacherRegistration";
import UserProfile from "../pages/admin/Users/AdminProfile";
import ProfilePage from "../pages/profile/ProfilePage";

// Batches
import BatchList from "../pages/batches/BatchList";
import BatchForm from "../pages/batches/BatchForm";
import BatchDetail from "../pages/batches/BatchDetail";
import BatchAssign from "../pages/batches/BatchAssign";

// Attendance
import MarkAttendance from "../pages/attendance/MarkAttendance";
import Attendance from "../pages/admin/Attendance/Attendance";

// Master
import Master from "../pages/admin/Master/Master";
import AreaPage from "../pages/admin/Master/Area";
import BranchPage from "../pages/admin/Master/Branch";
import StandardPage from "../pages/admin/Master/Standard";
import SubjectPage from "../pages/admin/Master/Subject";
import NewLogin from "../pages/auth/NewLogin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path:"/login",
    element: <NewLogin/>
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      // Dashboard
      {
        path: "adminDashboard",
        element: <AdminDashboard />,
      },

      // Attendance
      {
        path: "attendance",
        element: <Attendance />,
      },
      {
        path: "attendance/mark",
        element: <MarkAttendance />,
      },

      // Batches
      {
        path: "Batches",
        element: <BatchList />,
      },
      {
        path: "batches/create",
        element: <BatchForm mode="create" />,
      },
      {
        path: "batches/:id",
        element: <BatchDetail />,
      },
      {
        path: "batches/:id/edit",
        element: <BatchForm mode="edit" />,
      },
      {
        path: "batches/:id/assign",
        element: <BatchAssign />,
      },

      // Users
      {
        path: "Users",
        element: <UsersList />,
      },
      {
        path: "Users/profile",
        element: <UserProfile />,
      },
      {
        path: "Users/add",
        element: <StudentRegistration1 />,
      },
      {
        path: "Users/add-student",
        element: <StudentRegistration />,
      },
      {
        path: "Users/edit-student/:id",
        element: <StudentRegistration />,
      },
      {
        path: "Users/add-teacher",
        element: <TeacherRegistration />,
      },
      {
        path: "Users/edit-teacher/:id",
        element: <TeacherRegistration />,
      },

      // Profiles
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "profile/student/:id",
        element: <ProfilePage />,
      },
      {
        path: "profile/teacher/:id",
        element: <ProfilePage />,
      },
      {
        path: "profile/parent/:id",
        element: <ProfilePage />,
      },

      // Master
      {
        path: "master",
        element: <Master />,
      },
      {
        path: "master/area",
        element: <AreaPage />,
      },
      {
        path: "master/branch",
        element: <BranchPage />,
      },
      {
        path: "master/standard",
        element: <StandardPage />,
      },
      {
        path: "master/subject",
        element: <SubjectPage />,
      },
    ],
  },
]);
