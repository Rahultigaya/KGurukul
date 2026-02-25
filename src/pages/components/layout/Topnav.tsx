import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconBell,
  IconLogout,
  IconChevronDown,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";

interface TopNavProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const TopNav: React.FC<TopNavProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Sample user data - replace with real data from your auth context
  const user = {
    name: "John Doe",
    email: "john.doe@kgurukul.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    role: "Admin",
  };

  // Sample notifications
  const notifications = [
    { id: 1, message: "New student enrolled", time: "5 min ago", unread: true },
    {
      id: 2,
      message: "Assignment submitted",
      time: "1 hour ago",
      unread: true,
    },
    { id: 3, message: "Meeting scheduled", time: "2 hours ago", unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAuthenticated");

    // Redirect to login
    navigate("/auth/login");
  };

  return (
    <nav className="sticky top-0 z-[60] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 shadow-lg backdrop-blur-sm">
      <div className="px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Welcome message */}
          <div className="flex items-center gap-4">
            {/* Mobile Burger Button - Only show when sidebar is CLOSED */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`md:hidden p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg shadow-lg transition-all ${
                isMobileMenuOpen
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100"
              }`}
            >
              <IconMenu2 size={24} />
            </button>

            {/* Welcome message - hidden on mobile */}
            <div className="hidden md:block">
              <h2 className="text-xl font-semibold text-white">
                Welcome back, {user.name.split(" ")[0]}! 👋
              </h2>
              <p className="text-sm text-slate-400">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Right side - Notifications & User Profile */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
              >
                <IconBell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-700 bg-slate-900/50">
                    <h3 className="text-white font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer ${
                          notification.unread ? "bg-purple-900/10" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {notification.unread && (
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          )}
                          <div className="flex-1">
                            <p className="text-white text-sm">
                              {notification.message}
                            </p>
                            <p className="text-slate-400 text-xs mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 bg-slate-900/50 text-center">
                    <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded-lg transition-all"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-purple-500"
                />
                <div className="text-left hidden md:block">
                  <p className="text-white text-sm font-medium">{user.name}</p>
                  <p className="text-slate-400 text-xs">{user.role}</p>
                </div>
                <IconChevronDown
                  size={16}
                  className={`text-slate-400 hidden md:block transition-transform ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-700 bg-slate-900/50">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="text-white font-semibold">{user.name}</p>
                        <p className="text-slate-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => navigate("/profile")}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors flex items-center gap-3"
                    >
                      <IconBell size={18} />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => navigate("/settings")}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors flex items-center gap-3"
                    >
                      <IconBell size={18} />
                      <span>Settings</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-700 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-3"
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
