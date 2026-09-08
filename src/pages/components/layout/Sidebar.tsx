import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IconLayoutDashboard,
  IconTrophy,
  IconUser,
  IconX,
  IconMenu2,
  IconUsersGroup,
  IconCalendarCheck,
  IconFolders,
} from "@tabler/icons-react";
import { IconButton } from "@mui/material";
import { getCurrentUserRole, type RoleType } from "../../../utils/authRole";

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userRole, setUserRole] = useState<RoleType>(() => getCurrentUserRole());

  useEffect(() => {
    const updateRole = () => {
      setUserRole(getCurrentUserRole());
    };

    updateRole();
    window.addEventListener("storage", updateRole);
    return () => window.removeEventListener("storage", updateRole);
  }, []);

  // ── Menu items per user role ───────────────────────────────────────────────
  const menuItems = useMemo(() => {
    switch (userRole) {
      case 0: // Admin
        return [
          { path: "/adminDashboard", icon: IconLayoutDashboard, label: "Dashboard" },
          { path: "/Users", icon: IconUser, label: "Users" },
          { path: "/Batches", icon: IconUsersGroup, label: "Batches" },
          { path: "/attendance/mark", icon: IconCalendarCheck, label: "Mark Attendance" },
          { path: "/master", icon: IconFolders, label: "Master" },
        ];
      case 3: // Teacher
        return [
          { path: "/attendance/mark", icon: IconCalendarCheck, label: "Mark Attendance" },
        ];
      case 2: // Student
        return [
          { path: "/my-attendance", icon: IconCalendarCheck, label: "My Attendance" },
          { path: "/grades", icon: IconTrophy, label: "My Grades" },
        ];
      case 1: // Parent
        return [
          { path: "/my-attendance", icon: IconCalendarCheck, label: "My Attendance" },
          { path: "/grades", icon: IconTrophy, label: "My Grades" },
        ];
      default:
        return [
          { path: "/adminDashboard", icon: IconLayoutDashboard, label: "Dashboard" },
          { path: "/Users", icon: IconUser, label: "Users" },
          { path: "/Batches", icon: IconUsersGroup, label: "Batches" },
          { path: "/attendance/mark", icon: IconCalendarCheck, label: "Mark Attendance" },
          { path: "/master", icon: IconFolders, label: "Master" },
        ];
    }
  }, [userRole]);

  const isActive = (path: string) => {
    if (path === "/my-attendance" && (location.pathname === "/my-attendance" || location.pathname === "/attendance/my")) {
      return true;
    }
    if (path === "/attendance/mark" && location.pathname.startsWith("/attendance") && location.pathname !== "/attendance/my") {
      return true;
    }
    if (path === "/master" && location.pathname.startsWith("/master")) {
      return true;
    }
    if (path === "/Batches" && (location.pathname.startsWith("/Batches") || location.pathname.startsWith("/batches"))) {
      return true;
    }
    if (path === "/Users" && (location.pathname.startsWith("/Users") || location.pathname.startsWith("/users"))) {
      return true;
    }
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Burger Button */}
      {!isMobileMenuOpen && (
        <IconButton
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden !fixed !top-4 !left-4 !z-[60] !p-2.5 !rounded-lg shadow-lg !bg-white !text-slate-800 !border !border-slate-200"
        >
          <IconMenu2 size={22} />
        </IconButton>
      )}

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[45]"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-[70]
          w-32 flex flex-col font-sans shadow-lg bg-white
          transition-transform duration-300 ease-in-out h-screen
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
        style={{
          background: "#ffffff",
          borderRight: "1px solid #e2e8f0",
        }}
      >
        {/* Close Button */}
        {isMobileMenuOpen && (
          <IconButton
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden !absolute !top-4 !-right-5 !z-10 !p-2.5 !rounded-lg shadow-xl !bg-white !text-slate-800 !border !border-slate-200"
          >
            <IconX size={22} />
          </IconButton>
        )}

        {/* Logo */}
        <div
          className="flex flex-col items-center px-2 py-2 bg-white"
          style={{
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div className="w-15 h-14 mb-2 transition-transform hover:scale-105">
            <img
              src="/logo-gurukul-new.png"
              alt="KGurukul"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <div
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center px-2 py-3.5 cursor-pointer transition-all group ${
                  active
                    ? "bg-blue-50 border-l-4 border-blue-600"
                    : "hover:bg-slate-50"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-1.5 transition-all ${
                    active
                      ? "bg-blue-600 shadow-md scale-105"
                      : "bg-slate-100 group-hover:bg-slate-200 group-hover:scale-105"
                  }`}
                >
                  <Icon
                    size={22}
                    className={`transition-colors ${
                      active
                        ? "text-white"
                        : "text-slate-500 group-hover:text-slate-800"
                    }`}
                  />
                </div>

                <span
                  className={`text-[11px] text-center transition-colors ${
                    active
                      ? "text-blue-700 font-bold"
                      : "text-slate-600 group-hover:text-slate-900 group-hover:font-semibold"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </nav>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(241, 245, 249, 0.8);
            border-radius: 10px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(37, 99, 235, 0.4);
            border-radius: 10px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(37, 99, 235, 0.6);
          }

          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(37, 99, 235, 0.4) rgba(241, 245, 249, 0.8);
          }
        `}</style>
      </div>
    </>
  );
};

export default Sidebar;
