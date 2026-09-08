// src/pages/components/layout/AppLayout.tsx

import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNav from "./Topnav";
import { getCurrentUserRole } from "../../../utils/authRole";
import "./AppLayout.css";

const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const role = getCurrentUserRole();
    const path = location.pathname.toLowerCase();

    // If Student (2) or Parent (1) tries to access restricted Admin routes:
    if (
      (role === 2 || role === 1) &&
      (path === "/admindashboard" ||
        path.startsWith("/master") ||
        path.startsWith("/users") ||
        path.startsWith("/batches") ||
        path === "/attendance" ||
        path === "/attendance/mark")
    ) {
      navigate("/my-attendance", { replace: true });
    }

    // If Teacher (3) tries to access restricted Admin routes:
    if (
      role === 3 &&
      (path === "/admindashboard" ||
        path.startsWith("/master") ||
        path.startsWith("/users") ||
        path.startsWith("/batches"))
    ) {
      navigate("/attendance/mark", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto transition-colors duration-300 bg-slate-50">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;