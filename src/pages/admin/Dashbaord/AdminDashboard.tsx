import React from "react";
import { PageHeader } from "../../../components/PageHeader";
import { Button } from "@mui/material";
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
    iconColorClass: "text-purple-600",
    iconBgClass: "bg-purple-50 border border-purple-100",
    accentBgClass: "bg-purple-600",
  },
  {
    label: "Active Batches",
    value: "14",
    sub: "3 running today",
    trend: "up",
    icon: IconUsersGroup,
    iconColorClass: "text-orange-600",
    iconBgClass: "bg-orange-50 border border-orange-100",
    accentBgClass: "bg-orange-500",
  },
  {
    label: "Fees Collected",
    value: "₹1,24,500",
    sub: "₹18,000 pending",
    trend: "up",
    icon: IconCurrencyRupee,
    iconColorClass: "text-emerald-600",
    iconBgClass: "bg-emerald-50 border border-emerald-100",
    accentBgClass: "bg-emerald-600",
  },
  {
    label: "Avg Attendance",
    value: "87%",
    sub: "−2% vs last week",
    trend: "down",
    icon: IconCalendarCheck,
    iconColorClass: "text-cyan-600",
    iconBgClass: "bg-cyan-50 border border-cyan-100",
    accentBgClass: "bg-cyan-600",
  },
];

const todayBatches = [
  { id: "B001", name: "Khopat – Maths 10th",    time: "3:30 PM – 6:30 PM", teacher: "Rahul Sir",    students: 22, capacity: 30, status: "upcoming" },
  { id: "B003", name: "Hariniwas – Science 9th", time: "5:00 PM – 7:00 PM", teacher: "Priya Ma'am",  students: 18, capacity: 25, status: "upcoming" },
  { id: "B007", name: "Jay Plaza – Maths 10th",  time: "5:00 PM – 7:00 PM", teacher: "Anita Ma'am",  students: 8,  capacity: 10, status: "upcoming" },
];

const recentActivity = [
  { icon: IconCircleCheck,   iconBgClass: "bg-emerald-50 text-emerald-600 border border-emerald-100", text: "Priya Ma'am marked attendance for Science 9th",    time: "10 min ago"  },
  { icon: IconUsers,         iconBgClass: "bg-purple-50 text-purple-600 border border-purple-100",   text: "New student Arjun Mehta enrolled in Maths 10th",   time: "1 hr ago"    },
  { icon: IconCurrencyRupee, iconBgClass: "bg-orange-50 text-orange-600 border border-orange-100",   text: "₹8,000 fee collected from Sneha Patil",            time: "2 hrs ago"   },
  { icon: IconAlertTriangle, iconBgClass: "bg-amber-50 text-amber-600 border border-amber-100",     text: "Ravi Kumar absent for 3 consecutive classes",      time: "Yesterday"   },
  { icon: IconUsersGroup,    iconBgClass: "bg-cyan-50 text-cyan-600 border border-cyan-100",        text: "Recovery batch B009 created for Maths 9th backlog", time: "Yesterday"  },
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
  label, value, sub, trend, icon: Icon, iconColorClass, iconBgClass, accentBgClass,
}) => (
  <div className="rounded-2xl p-5 flex flex-col gap-4 bg-white border border-slate-200 shadow-sm transition-all hover:scale-[1.01]">
    <div className="flex items-start justify-between">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBgClass}`}>
        <Icon size={22} className={iconColorClass} />
      </div>
      <div
        className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
          trend === "up"
            ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
            : "bg-red-50 text-red-600 border border-red-200/60"
        }`}
      >
        {trend === "up" ? <IconTrendingUp size={12} /> : <IconTrendingDown size={12} />}
        {sub.split(" ")[0]}
      </div>
    </div>

    <div>
      <p className="text-2xl font-bold text-slate-800">
        {value}
      </p>
      <p className="text-sm mt-0.5 text-slate-600 font-medium">
        {label}
      </p>
      <p className="text-xs mt-1 text-slate-400 font-medium">
        {sub}
      </p>
    </div>

    {/* Bottom accent bar */}
    <div className="h-1 rounded-full w-full bg-slate-100 overflow-hidden">
      <div className={`h-1 rounded-full w-2/3 ${accentBgClass}`} />
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
      <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-purple-50 border border-purple-100 text-purple-600">
        {icon}
      </div>
      <h3 className="font-semibold text-sm text-slate-800">
        {title}
      </h3>
    </div>
    {action && (
      <Button
        variant="text"
        size="small"
        onClick={onAction}
        endIcon={<IconArrowRight size={12} />}
        className="!flex !items-center !gap-1 !text-xs !font-medium !text-blue-600 !normal-case"
      >
        {action}
      </Button>
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
      <PageHeader
        title="Dashboard"
        subtitle={new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        action={
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium bg-orange-50 text-orange-600 border border-orange-200">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Live System
          </div>
        }
      />

      {/* ── Stat cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Middle row: Today's Batches + Activity ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Today's Batches */}
        <div className="rounded-2xl p-5 bg-white border border-slate-200 shadow-sm">
          <SectionHeader
            icon={<IconUsersGroup size={15} className="text-amber-500" />}
            title={`Today's Batches — ${TODAY_DAY}`}
            action="View All"
          />

          {todayBatches.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-2">
              <IconSchool size={32} className="text-slate-400" />
              <p className="text-sm text-slate-500 font-medium">No batches scheduled today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayBatches.map((b) => {
                const fill = Math.min((b.students / b.capacity) * 100, 100);
                const fillColorClass = b.students >= b.capacity ? "bg-red-500" : fill >= 80 ? "bg-amber-500" : "bg-emerald-500";
                return (
                  <div
                    key={b.id}
                    className="rounded-xl p-3 flex items-center gap-3 bg-slate-50 border border-slate-200/80 transition-all hover:bg-slate-100/50"
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-orange-50 text-orange-600">
                      <IconSchool size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {b.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500">
                          {b.time}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-600 font-medium">
                          {b.teacher}
                        </span>
                      </div>
                      {/* capacity mini bar */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1 rounded-full overflow-hidden bg-slate-200">
                          <div
                            className={`h-full rounded-full ${fillColorClass}`}
                            style={{ width: `${fill}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold shrink-0 text-slate-500">
                          {b.students}/{b.capacity}
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 bg-emerald-50 text-emerald-600 border border-emerald-200">
                      Active
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl p-5 bg-white border border-slate-200 shadow-sm">
          <SectionHeader
            icon={<IconClockHour4 size={15} className="text-purple-600" />}
            title="Recent Activity"
            action="View All"
          />
          <div className="space-y-0">
            {recentActivity.map((a, i) => {
              const Icon = a.icon;
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 py-3 ${
                    i < recentActivity.length - 1 ? "border-b border-slate-100" : ""
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${a.iconBgClass}`}
                  >
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-snug text-slate-700 font-medium">
                      {a.text}
                    </p>
                    <p className="text-[10px] mt-0.5 text-slate-400">
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
        <div className="lg:col-span-2 rounded-2xl p-5 bg-white border border-slate-200 shadow-sm">
          <SectionHeader
            icon={<IconCurrencyRupee size={15} className="text-emerald-600" />}
            title="Pending Fees"
            action="View All"
          />
          <div className="space-y-2">
            {/* Header row */}
            <div className="grid grid-cols-4 px-3 pb-2 border-b border-slate-200">
              {["Student", "Standard", "Amount", "Due Date"].map((h) => (
                <span key={h} className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {h}
                </span>
              ))}
            </div>
            {pendingFees.map((f, i) => (
              <div
                key={i}
                className={`grid grid-cols-4 items-center px-3 py-2.5 rounded-xl transition-all ${
                  i % 2 === 0 ? "bg-slate-50/80" : "bg-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 bg-purple-100 text-purple-700">
                    {f.name[0]}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 truncate">{f.name}</span>
                </div>
                <span className="text-xs text-slate-600">{f.standard}</span>
                <span className="text-xs font-bold text-amber-600">{f.amount}</span>
                <span className="text-xs text-slate-500 font-medium">{f.dueDate}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions — 1/3 width */}
        <div className="rounded-2xl p-5 flex flex-col gap-3 bg-white border border-slate-200 shadow-sm">
          <SectionHeader
            icon={<IconSchool size={15} className="text-cyan-600" />}
            title="Quick Actions"
          />
          {[
            { label: "Add Student",     icon: IconUsers,         iconBg: "bg-blue-100 text-blue-600",    btnClass: "!bg-blue-50 hover:!bg-blue-100 !border-blue-200"  },
            { label: "Create Batch",    icon: IconUsersGroup,    iconBg: "bg-amber-100 text-amber-600",   btnClass: "!bg-amber-50 hover:!bg-amber-100 !border-amber-200"  },
            { label: "Mark Attendance", icon: IconCalendarCheck, iconBg: "bg-emerald-100 text-emerald-600", btnClass: "!bg-emerald-50 hover:!bg-emerald-100 !border-emerald-200"   },
            { label: "Collect Fees",    icon: IconCurrencyRupee, iconBg: "bg-cyan-100 text-cyan-600",    btnClass: "!bg-cyan-50 hover:!bg-cyan-100 !border-cyan-200"   },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <Button
                key={a.label}
                className={`w-full !justify-start !normal-case !px-4 !py-3 !rounded-xl !text-left transition-all hover:scale-[1.02] flex items-center gap-3 border ${a.btnClass}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.iconBg}`}>
                  <Icon size={16} />
                </div>
                <span className="text-sm font-semibold text-slate-800 flex-1">
                  {a.label}
                </span>
                <IconArrowRight size={13} className="text-slate-400 shrink-0" />
              </Button>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;