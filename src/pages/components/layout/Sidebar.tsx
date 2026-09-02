import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IconLayoutDashboard,
  IconTrophy,
  IconChecklist,
  IconChartBar,
  IconCreditCard,
  IconUser,
  IconX,
  IconMenu2,
  IconUsersGroup,
  IconCalendarCheck,
} from "@tabler/icons-react";
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

  const menuItems = [
    { path: "/adminDashboard", icon: IconLayoutDashboard, label: "Dashboard" },
    { path: "/Users", icon: IconUser, label: "Users" },
    { path: "/Batches", icon: IconUsersGroup, label: "Batches" },

    // Bhavana Attendance Route
    { path: "/attendance/mark", icon: IconCalendarCheck, label: "Attendance" },

    // Rahul Attendance Route
    // { path: "/attendance", icon: IconCalendarCheck, label: "Attendance" },

    // Added
    { path: "/master", icon: IconCalendarCheck, label: "Master" },

    { path: "/grades", icon: IconTrophy, label: "My Grades" },
    { path: "/tasks", icon: IconChecklist, label: "Tasks" },
    { path: "/analytics", icon: IconChartBar, label: "Analytics" },
    { path: "/subscription", icon: IconCreditCard, label: "Subscription" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Burger Button */}
      {!isMobileMenuOpen && (
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden fixed top-4 left-4 z-[60] p-2.5 rounded-lg shadow-lg transition-all"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-default)",
          }}
        >
          <IconMenu2 size={22} />
        </button>
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
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden absolute top-4 -right-5 z-10 p-2.5 rounded-lg shadow-xl transition-all bg-white text-slate-800"
            style={{
              backgroundColor: "#ffffff",
              color: "#0f172a",
              border: "1px solid #e2e8f0",
            }}
          >
            <IconX size={22} />
          </button>
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
                className={`flex flex-col items-center px-2 py-4 cursor-pointer transition-all group ${
                  active
                    ? "bg-[rgba(124,58,237,0.20)] border-l-2 border-[var(--accent-purple)]"
                    : "hover:bg-[var(--bg-card-hover)]"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-all ${
                    active
                      ? "bg-[var(--accent-purple)] shadow-lg scale-105"
                      : "bg-[var(--bg-tertiary)] group-hover:bg-[var(--text-accent-secondary)] group-hover:scale-110"
                  }`}
                >
                  <Icon
                    size={24}
                    className={`transition-colors ${
                      active
                        ? "text-white"
                        : "text-slate-400 group-hover:text-white"
                    }`}
                  />
                </div>

                <span
                  className={`text-xs text-center transition-colors ${
                    active
                      ? "text-[var(--text-accent-primary)] font-bold"
                      : "text-[var(--text-accent-secondary)] group-hover:text-[var(--text-accent-primary)] group-hover:font-semibold"
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
            background: rgba(51, 65, 85, 0.3);
            border-radius: 10px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(147, 51, 234, 0.5);
            border-radius: 10px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(147, 51, 234, 0.7);
          }

          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: var(--accent-purple) var(--bg-tertiary);
          }
        `}</style>
      </div>
    </>
  );
};

export default Sidebar;
