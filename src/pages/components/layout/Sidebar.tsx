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
    { path: "/grades", icon: IconTrophy, label: "My Grades" },
    { path: "/tasks", icon: IconChecklist, label: "Tasks" },
    { path: "/analytics", icon: IconChartBar, label: "Analytics" },
    { path: "/subscription", icon: IconCreditCard, label: "Subscription" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <>
      {/* Fixed Burger Button - Only shows when sidebar is CLOSED */}
      {!isMobileMenuOpen && (
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden fixed top-4 left-4 z-[60] p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg shadow-lg transition-all"
        >
          <IconMenu2 size={22} />
        </button>
      )}

      {/* Overlay for mobile - closes menu when clicked */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[45]"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-[70]
          w-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
          flex flex-col font-sans shadow-2xl
          transition-transform duration-300 ease-in-out
          h-screen
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Close button (X) - Only shows when sidebar is OPEN, positioned half outside */}
        {isMobileMenuOpen && (
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden absolute top-4 -right-5 z-10 p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg shadow-xl shadow-black/50 transition-all"
          >
            <IconX size={22} />
          </button>
        )}

        {/* Logo Section - Fixed */}
        <div className="flex flex-col items-center px-2 py-2 border-b border-slate-700/50">
          <div className="w-15 h-14 mb-2 transition-transform hover:scale-105">
            <img
              src="/logo-gurukul-new.png"
              alt="KGurukul's Computer Classes"
              className="w-full h-full object-contain"
            />
          </div>
          {/* <h1 className="text-xs font-bold text-white text-center">
            KGurukul's Computer Classes
          </h1> */}
        </div>

        {/* Navigation Menu - Scrollable with custom thin scrollbar */}
        <nav className="flex-1 py-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <div
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center px-2 py-4 cursor-pointer transition-all group ${
                  active
                    ? "bg-purple-600/20 border-l-2 border-purple-500"
                    : "hover:bg-slate-700/30"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-all ${
                    active
                      ? "bg-purple-600 shadow-lg shadow-purple-500/50"
                      : "bg-slate-700/50 group-hover:bg-purple-600/50 group-hover:scale-110"
                  }`}
                >
                  <Icon
                    size={24}
                    className={
                      active
                        ? "text-white"
                        : "text-slate-400 group-hover:text-purple-300"
                    }
                  />
                </div>
                <span
                  className={`text-xs font-medium text-center ${
                    active
                      ? "text-purple-300 font-semibold"
                      : "text-slate-300 group-hover:text-white"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </nav>

        {/* Custom Scrollbar Styles */}
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

          /* Firefox */
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(147, 51, 234, 0.5) rgba(51, 65, 85, 0.3);
          }
        `}</style>
      </div>
    </>
  );
};

export default Sidebar;
