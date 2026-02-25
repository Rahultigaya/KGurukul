import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNav from "./Topnav";
import "./AppLayout.css";   // ✅ Import CSS here

const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* Sidebar - Fixed on left */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation - Sticky */}
        <TopNav
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="p-6">
            <Outlet /> {/* This renders AdminDashboard, TasksPage, etc. */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
