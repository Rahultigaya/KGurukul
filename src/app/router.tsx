// src\app\router.tsx

import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import AdminDashboard from "../pages/admin/Dashbaord/AdminDashboard";
import AppLayout from "../pages/components/layout/AppLayout"; // Your layout with sidebar
import UsersList from "../pages/admin/Users/UserList";
import StudentRegistration from "../pages/admin/Users/Student/StudentRegistration";
import StudentRegistration1 from "../pages/admin/Users/StudentRegistration1";
import UserProfile from "../pages/admin/Users/AdminProfile";
import ProfilePage from "../pages/profile/ProfilePage";
import BatchList from "../pages/batches/BatchList";
import BatchForm from "../pages/batches/BatchForm";
import BatchDetail from "../pages/batches/BatchDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{ index: true, element: <Home /> }],
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
  // 👇 NEW: All admin routes wrapped with AppLayout
  {
    path: "/",
    element: <AppLayout />, // Sidebar layout
    children: [
      {
        path: "adminDashboard",
        element: <AdminDashboard />,
      },
      {
        path: "Batches",
        element: <BatchList />,
      },
      { path: "batches/create", element: <BatchForm mode="create" /> },
      { path: "batches/:id", element: <BatchDetail /> },
      { path: "batches/:id/edit", element: <BatchForm mode="edit" /> },
      {
        path: "Users",
        element: <UsersList />,
      },
      { path: "profile", element: <ProfilePage /> }, // admin
      { path: "profile/student/:id", element: <ProfilePage /> }, // student
      { path: "profile/teacher/:id", element: <ProfilePage /> }, // teacher
      { path: "profile/parent/:id", element: <ProfilePage /> },

      // Routes added:
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
        element: <StudentRegistration />, // Temporary - create AddEditTeacher later
      },
      {
        path: "Users/edit-teacher/:id",
        element: <StudentRegistration />, // Temporary - create AddEditTeacher later
      },
    ],
  },
]);
