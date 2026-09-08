import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconBell,
  IconLogout,
  IconChevronDown,
  IconMenu2,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { Button, IconButton } from "@mui/material";
import { getCurrentUserRole, getRoleName } from "../../../utils/authRole";

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
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userData, setUserData] = useState<UserData>({});

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    const rawRole =
      userData.role_id ??
      userData.role ??
      userData.user_role ??
      userData.roleId ??
      userData.userRole;

    const detectedRole = rawRole !== undefined ? getRoleName(rawRole) : getRoleName(getCurrentUserRole());

    return {
      name: userData.name || userData.full_name || userData.username || "User",
      email: userData.email || localStorage.getItem("userEmail") || "user@kgurukul.com",
      role: detectedRole,
      avatar: userData.avatar || userData.photo || userData.profile_image ||
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
    setShowUserMenu(false);
    localStorage.clear();
    navigate("/login");
  };

  // ── style helpers ──────────────────────────────────────────────────────────
  
  const dropBg   = "#ffffff";
  const dropBorder = "#e2e8f0";
  const dropHeaderBg = "#f8fafc";

  return (
    <nav className="sticky top-0 z-[60] bg-white border-b border-slate-200 shadow-sm transition-all">
      <div className="px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">

          {/* Left — Welcome */}
          <div className="flex items-center gap-4">
            {/* Mobile burger */}
            <IconButton
              onClick={() => setIsMobileMenuOpen(true)}
              className={`md:hidden !p-2 !rounded-lg text-slate-700 hover:bg-slate-100 transition-all ${
                isMobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <IconMenu2 size={24} />
            </IconButton>

            <div className="hidden md:block">
              <h2 className="text-xl font-semibold text-slate-900">
                Welcome back, {user.name.split(" ")[0]} !!!
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Right — Notifications + User */}
          <div className="flex items-center gap-2 md:gap-3">

            {/* ── Notifications ────────────────────────────────────── */}
            <div className="relative" ref={notificationsRef}>
              <IconButton
                onClick={() => {
                  setShowNotifications((prev) => !prev);
                  setShowUserMenu(false);
                }}
                className="relative !p-2 !rounded-lg text-slate-600 hover:bg-slate-100 transition-all"
              >
                <IconBell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {unreadCount}
                  </span>
                )}
              </IconButton>

              {showNotifications && (
                <div
                  className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl shadow-2xl overflow-hidden z-50"
                  style={{
                    background: dropBg,
                    border: `1px solid ${dropBorder}`,
                  }}
                >
                  <div
                    className="px-4 py-3"
                    style={{
                      borderBottom: `1px solid ${dropBorder}`,
                      background: dropHeaderBg,
                    }}
                  >
                    <h3 className="font-semibold text-slate-800">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => setShowNotifications(false)}
                        className="px-4 py-3 cursor-pointer transition-colors hover:bg-slate-50"
                        style={{
                          borderBottom: `1px solid ${dropBorder}`,
                          background: n.unread ? "rgba(37,99,235,0.04)" : "transparent",
                        }}
                      >
                        <div className="flex items-start gap-3">
                          {n.unread && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm text-slate-800 font-medium">
                              {n.message}
                            </p>
                            <p className="text-xs mt-1 text-slate-500">
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
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => setShowNotifications(false)}
                      className="!normal-case !text-xs !font-semibold !text-blue-600"
                    >
                      View all notifications
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* ── User Menu ────────────────────────────────────────── */}
            <div className="relative" ref={userMenuRef}>
              <Button
                onClick={() => {
                  setShowUserMenu((prev) => !prev);
                  setShowNotifications(false);
                }}
                className="!normal-case !p-1.5 !rounded-xl text-slate-800 hover:!bg-slate-100 flex items-center gap-3 transition-all"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-blue-600 object-cover"
                />
                <div className="text-left hidden md:block">
                  <p className="text-sm font-semibold text-slate-800">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {user.role}
                  </p>
                </div>
                <IconChevronDown
                  size={16}
                  className={`hidden md:block transition-transform text-slate-500 ${showUserMenu ? "rotate-180" : ""}`}
                />
              </Button>

              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-xl shadow-2xl overflow-hidden z-50"
                  style={{
                    background: dropBg,
                    border: `1px solid ${dropBorder}`,
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
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="overflow-hidden">
                        <p className="font-semibold text-slate-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-sm text-slate-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    <Button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate("/Users/profile");
                      }}
                      className="w-full !justify-start !normal-case !px-4 !py-2.5 !text-slate-700 hover:!bg-slate-50 flex items-center gap-3"
                    >
                      <IconUser size={18} />
                      <span>My Profile</span>
                    </Button>
                    <Button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate("/settings");
                      }}
                      className="w-full !justify-start !normal-case !px-4 !py-2.5 !text-slate-700 hover:!bg-slate-50 flex items-center gap-3"
                    >
                      <IconSettings size={18} />
                      <span>Settings</span>
                    </Button>
                  </div>

                  <div className="py-1 border-t border-slate-200">
                    <Button
                      onClick={handleLogout}
                      className="w-full !justify-start !normal-case !px-4 !py-2.5 !text-rose-600 hover:!bg-rose-50 flex items-center gap-3 font-semibold"
                    >
                      <IconLogout size={18} />
                      <span>Logout</span>
                    </Button>
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