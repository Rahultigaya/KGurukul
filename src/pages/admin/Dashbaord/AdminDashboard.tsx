// src/pages/AdminDashboard.tsx

import React from "react";
import {
  IconUsers,
  IconUsersGroup,
  IconCurrencyRupee,
  IconCalendarCheck,
  IconTrendingUp,
  IconTrendingDown,
  IconArrowRight,
  IconSchool,
  IconClockHour4,
  IconCircleCheck,
  IconAlertTriangle,
} from "@tabler/icons-react";

// ─────────────────────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────────────────────

const TODAY_DAY = [
  "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday",
][new Date().getDay()];

const stats = [
  {
    label: "Total Students",
    value: "248",
    sub: "+12 this month",
    trend: "up",
    icon: IconUsers,
    iconColor: "#7c3aed",
    iconBg: "rgba(124,58,237,0.12)",
    accentColor: "#7c3aed",
  },
  {
    label: "Active Batches",
    value: "14",
    sub: "3 running today",
    trend: "up",
    icon: IconUsersGroup,
    iconColor: "#f97316",
    iconBg: "rgba(249,115,22,0.12)",
    accentColor: "#f97316",
  },
  {
    label: "Fees Collected",
    value: "₹1,24,500",
    sub: "₹18,000 pending",
    trend: "up",
    icon: IconCurrencyRupee,
    iconColor: "#22c55e",
    iconBg: "rgba(34,197,94,0.12)",
    accentColor: "#22c55e",
  },
  {
    label: "Avg Attendance",
    value: "87%",
    sub: "−2% vs last week",
    trend: "down",
    icon: IconCalendarCheck,
    iconColor: "#06b6d4",
    iconBg: "rgba(6,182,212,0.12)",
    accentColor: "#06b6d4",
  },
];

const todayBatches = [
  { id: "B001", name: "Khopat – Maths 10th",    time: "3:30 PM – 6:30 PM", teacher: "Rahul Sir",    students: 22, capacity: 30, status: "upcoming" },
  { id: "B003", name: "Hariniwas – Science 9th", time: "5:00 PM – 7:00 PM", teacher: "Priya Ma'am",  students: 18, capacity: 25, status: "upcoming" },
  { id: "B007", name: "Jay Plaza – Maths 10th",  time: "5:00 PM – 7:00 PM", teacher: "Anita Ma'am",  students: 8,  capacity: 10, status: "upcoming" },
];

const recentActivity = [
  { icon: IconCircleCheck,   color: "#22c55e", text: "Priya Ma'am marked attendance for Science 9th",    time: "10 min ago"  },
  { icon: IconUsers,         color: "#7c3aed", text: "New student Arjun Mehta enrolled in Maths 10th",   time: "1 hr ago"    },
  { icon: IconCurrencyRupee, color: "#f97316", text: "₹8,000 fee collected from Sneha Patil",            time: "2 hrs ago"   },
  { icon: IconAlertTriangle, color: "#f59e0b", text: "Ravi Kumar absent for 3 consecutive classes",      time: "Yesterday"   },
  { icon: IconUsersGroup,    color: "#06b6d4", text: "Recovery batch B009 created for Maths 9th backlog", time: "Yesterday"  },
];

const pendingFees = [
  { name: "Rahul Sharma",  standard: "12th", amount: "₹5,000",  dueDate: "Mar 30" },
  { name: "Sneha Patil",   standard: "10th", amount: "₹8,000",  dueDate: "Apr 2"  },
  { name: "Arjun Mehta",   standard: "10th", amount: "₹12,000", dueDate: "Apr 5"  },
  { name: "Pooja Desai",   standard: "9th",  amount: "₹3,500",  dueDate: "Apr 8"  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────────────────────────────────────

const StatCard: React.FC<(typeof stats)[0]> = ({
  label, value, sub, trend, icon: Icon, iconColor, iconBg, accentColor,
}) => (
  <div
    className="rounded-2xl p-5 flex flex-col gap-4 transition-all hover:scale-[1.01]"
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-card)",
      boxShadow: "var(--shadow-card)",
    }}
  >
    <div className="flex items-start justify-between">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: iconBg }}
      >
        <Icon size={22} style={{ color: iconColor }} />
      </div>
      <div
        className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{
          background: trend === "up" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
          color: trend === "up" ? "#22c55e" : "#ef4444",
        }}
      >
        {trend === "up" ? <IconTrendingUp size={12} /> : <IconTrendingDown size={12} />}
        {sub.split(" ")[0]}
      </div>
    </div>

    <div>
      <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
        {value}
      </p>
      <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
        {label}
      </p>
      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
        {sub}
      </p>
    </div>

    {/* Bottom accent bar */}
    <div className="h-1 rounded-full w-full" style={{ background: "var(--bg-tertiary)" }}>
      <div className="h-1 rounded-full w-2/3" style={{ background: accentColor, opacity: 0.6 }} />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Section header
// ─────────────────────────────────────────────────────────────────────────────

const SectionHeader: React.FC<{
  icon: React.ReactNode; title: string; action?: string; onAction?: () => void;
}> = ({ icon, title, action, onAction }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center"
        style={{ background: "rgba(124,58,237,0.12)" }}
      >
        {icon}
      </div>
      <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
        {title}
      </h3>
    </div>
    {action && (
      <button
        onClick={onAction}
        className="flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80"
        style={{ color: "var(--text-accent-primary)" }}
      >
        {action} <IconArrowRight size={12} />
      </button>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// AdminDashboard
// ─────────────────────────────────────────────────────────────────────────────

const AdminDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto pb-10 space-y-6 px-2 sm:px-0">

      {/* ── Page heading ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium"
          style={{ background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)" }}
        >
          <IconClockHour4 size={15} />
          {todayBatches.length} batches today
        </div>
      </div>

      {/* ── Stat cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Middle row: Today's Batches + Activity ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Today's Batches */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <SectionHeader
            icon={<IconUsersGroup size={15} style={{ color: "#f97316" }} />}
            title={`Today's Batches — ${TODAY_DAY}`}
            action="View All"
          />

          {todayBatches.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-2">
              <IconSchool size={32} style={{ color: "var(--text-muted)" }} />
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>No batches scheduled today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayBatches.map((b) => {
                const fill = Math.min((b.students / b.capacity) * 100, 100);
                const fillColor = b.students >= b.capacity ? "#ef4444" : fill >= 80 ? "#f59e0b" : "#22c55e";
                return (
                  <div
                    key={b.id}
                    className="rounded-xl p-3 flex items-center gap-3 transition-all"
                    style={{
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border-default)",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "rgba(249,115,22,0.15)" }}
                    >
                      <IconSchool size={18} style={{ color: "#f97316" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {b.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {b.time}
                        </span>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>·</span>
                        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          {b.teacher}
                        </span>
                      </div>
                      {/* capacity mini bar */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <div
                          className="flex-1 h-1 rounded-full overflow-hidden"
                          style={{ background: "var(--border-default)" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${fill}%`, background: fillColor }}
                          />
                        </div>
                        <span className="text-[10px] font-medium shrink-0" style={{ color: "var(--text-muted)" }}>
                          {b.students}/{b.capacity}
                        </span>
                      </div>
                    </div>
                    <span
                      className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}
                    >
                      Active
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <SectionHeader
            icon={<IconClockHour4 size={15} style={{ color: "#7c3aed" }} />}
            title="Recent Activity"
            action="View All"
          />
          <div className="space-y-0">
            {recentActivity.map((a, i) => {
              const Icon = a.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 py-3"
                  style={{ borderBottom: i < recentActivity.length - 1 ? "1px solid var(--border-default)" : "none" }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${a.color}18` }}
                  >
                    <Icon size={14} style={{ color: a.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-snug" style={{ color: "var(--text-secondary)" }}>
                      {a.text}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {a.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom row: Pending Fees + Quick Actions ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Pending Fees — 2/3 width */}
        <div
          className="lg:col-span-2 rounded-2xl p-5"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <SectionHeader
            icon={<IconCurrencyRupee size={15} style={{ color: "#22c55e" }} />}
            title="Pending Fees"
            action="View All"
          />
          <div className="space-y-2">
            {/* Header row */}
            <div className="grid grid-cols-4 px-3 pb-2" style={{ borderBottom: "1px solid var(--border-default)" }}>
              {["Student", "Standard", "Amount", "Due Date"].map((h) => (
                <span key={h} className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  {h}
                </span>
              ))}
            </div>
            {pendingFees.map((f, i) => (
              <div
                key={i}
                className="grid grid-cols-4 items-center px-3 py-2.5 rounded-xl transition-all"
                style={{ background: i % 2 === 0 ? "var(--bg-tertiary)" : "transparent" }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ background: "rgba(124,58,237,0.15)", color: "#7c3aed" }}
                  >
                    {f.name[0]}
                  </div>
                  <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{f.name}</span>
                </div>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{f.standard}</span>
                <span className="text-xs font-semibold" style={{ color: "#f97316" }}>{f.amount}</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{f.dueDate}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions — 1/3 width */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-3"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <SectionHeader
            icon={<IconSchool size={15} style={{ color: "#06b6d4" }} />}
            title="Quick Actions"
          />
          {[
            { label: "Add Student",    icon: IconUsers,         color: "#7c3aed", bg: "rgba(124,58,237,0.1)"  },
            { label: "Create Batch",   icon: IconUsersGroup,    color: "#f97316", bg: "rgba(249,115,22,0.1)"  },
            { label: "Mark Attendance",icon: IconCalendarCheck, color: "#22c55e", bg: "rgba(34,197,94,0.1)"   },
            { label: "Collect Fees",   icon: IconCurrencyRupee, color: "#06b6d4", bg: "rgba(6,182,212,0.1)"   },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.label}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: a.bg,
                  border: `1px solid ${a.color}30`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${a.color}20` }}
                >
                  <Icon size={16} style={{ color: a.color }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {a.label}
                </span>
                <IconArrowRight size={13} className="ml-auto" style={{ color: "var(--text-muted)" }} />
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;