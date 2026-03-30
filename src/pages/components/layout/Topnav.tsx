// src/pages/components/layout/Topnav.tsx

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconBell,
  IconLogout,
  IconChevronDown,
  IconMenu2,
  IconSun,
  IconMoon,
  IconSettings,
} from "@tabler/icons-react";
import { useTheme } from "../../../context/ThemeContext";

interface TopNavProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

interface UserData {
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  [key: string]: any;
}

const TopNav: React.FC<TopNavProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const navigate = useNavigate();
  const { toggleTheme, isDark } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userData, setUserData] = useState<UserData>({});

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUser = localStorage.getItem("userData");
        const userEmail = localStorage.getItem("userEmail");

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);
        } else if (userEmail) {
          // Fallback to email if userData is not available
          setUserData({ email: userEmail });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();

    // Listen for storage changes (for multi-tab support)
    const handleStorageChange = () => {
      loadUserData();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Memoize user object with defaults
  const user = useMemo(() => {
    return {
      name: userData.name || userData.full_name || userData.username || "User",
      email: userData.email || localStorage.getItem("userEmail") || "user@kgurukul.com",
      role: userData.role || "Student",
      avatar: userData.avatar || userData.profile_image ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email || "User"}`,
    };
  }, [userData]);

  const notifications = [
    { id: 1, message: "New student enrolled",  time: "5 min ago",   unread: true  },
    { id: 2, message: "Assignment submitted",  time: "1 hour ago",  unread: true  },
    { id: 3, message: "Meeting scheduled",     time: "2 hours ago", unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleLogout = () => {
    // Use the logout function from common.ts
    localStorage.clear();
    navigate("/auth/login");
  };

  // ── style helpers (use CSS vars so both themes work) ──────────────────────
  
  const navBorder = "var(--border-default)";
  const dropBg   = isDark ? "#1e293b" : "#ffffff";
  const dropBorder = "var(--border-default)";
  const dropHeaderBg = isDark ? "rgba(15,23,42,0.6)" : "rgba(241,245,249,0.8)";

  return (
    <nav
      className="sticky top-0 z-[60] shadow-md backdrop-blur-sm"
      style={{
        background: "var(--bg-topnav)",
        borderBottom: `1px solid ${navBorder}`,
        color: "var(--text-primary)",
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      <div className="px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">

          {/* Left — Welcome */}
          <div className="flex items-center gap-4">
            {/* Mobile burger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`md:hidden p-2 rounded-lg shadow-lg transition-all ${
                isMobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
            >
              <IconMenu2 size={24} />
            </button>

            <div className="hidden md:block">
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Welcome back, {user.name.split(" ")[0]}! 👋
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Right — Theme toggle + Notifications + User */}
          <div className="flex items-center gap-2 md:gap-3">

            {/* ── Theme Toggle ─────────────────────────────────────── */}
            <button
              onClick={toggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="relative p-2 rounded-xl transition-all duration-300 group"
              style={{
                background: isDark
                  ? "rgba(124,58,237,0.15)"
                  : "rgba(234,108,0,0.1)",
                border: `1px solid ${isDark ? "rgba(124,58,237,0.3)" : "rgba(234,108,0,0.25)"}`,
                color: isDark ? "#a78bfa" : "#ea6c00",
              }}
            >
              <span
                className="block transition-transform duration-500"
                style={{ transform: isDark ? "rotate(0deg)" : "rotate(180deg)" }}
              >
                {isDark ? <IconMoon size={20} /> : <IconSun size={20} />}
              </span>
            </button>

            {/* ── Notifications ────────────────────────────────────── */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2 rounded-lg transition-all"
                style={{ color: "var(--text-secondary)" }}
              >
                <IconBell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl shadow-2xl overflow-hidden"
                  style={{
                    background: dropBg,
                    border: `1px solid ${dropBorder}`,
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <div
                    className="px-4 py-3"
                    style={{
                      borderBottom: `1px solid ${dropBorder}`,
                      background: dropHeaderBg,
                    }}
                  >
                    <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="px-4 py-3 cursor-pointer transition-colors"
                        style={{
                          borderBottom: `1px solid ${dropBorder}`,
                          background: n.unread
                            ? isDark ? "rgba(124,58,237,0.07)" : "rgba(124,58,237,0.04)"
                            : "transparent",
                        }}
                      >
                        <div className="flex items-start gap-3">
                          {n.unread && (
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                              {n.message}
                            </p>
                            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                              {n.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    className="px-4 py-3 text-center"
                    style={{ background: dropHeaderBg }}
                  >
                    <button className="text-sm font-medium" style={{ color: "var(--text-accent)" }}>
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── User Menu ────────────────────────────────────────── */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-3 p-2 rounded-lg transition-all"
                style={{ color: "var(--text-primary)" }}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-purple-500"
                />
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {user.name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {user.role}
                  </p>
                </div>
                <IconChevronDown
                  size={16}
                  className={`hidden md:block transition-transform ${showUserMenu ? "rotate-180" : ""}`}
                  style={{ color: "var(--text-muted)" }}
                />
              </button>

              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-xl shadow-2xl overflow-hidden"
                  style={{
                    background: dropBg,
                    border: `1px solid ${dropBorder}`,
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  {/* User info header */}
                  <div
                    className="px-4 py-3"
                    style={{
                      borderBottom: `1px solid ${dropBorder}`,
                      background: dropHeaderBg,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                          {user.name}
                        </p>
                        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => navigate("/Users/profile")}
                      className="w-full px-4 py-2 text-left flex items-center gap-3 transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-tertiary)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <IconBell size={18} />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => navigate("/settings")}
                      className="w-full px-4 py-2 text-left flex items-center gap-3 transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-tertiary)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <IconSettings size={18} />
                      <span>Settings</span>
                    </button>
                  </div>

                  <div className="py-2" style={{ borderTop: `1px solid ${dropBorder}` }}>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left flex items-center gap-3 transition-colors text-red-400 hover:text-red-300"
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <IconLogout size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;