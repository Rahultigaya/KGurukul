// src/pages/batches/BatchList.tsx

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Select } from "@mantine/core";
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconMapPin,
  IconClock,
  IconUser,
  IconUsers,
  IconBook,
  IconEdit,
  IconTrash,
  IconEye,
  IconX,
  IconSchool,
  IconAlertTriangle,
  IconCircleCheck,
  IconCalendar,
} from "@tabler/icons-react";
import {
  getAllBatches,
  deleteBatch,
  AREAS,
  BRANCHES,
  DAYS,
  type Batch,
  type Area,
} from "./batchStore";

// ─────────────────────────────────────────────────────────────────────────────
// Mantine Select styles — matches your existing selectDropdownStyles
// ─────────────────────────────────────────────────────────────────────────────

const selectDropdownStyles = {
  comboboxProps: {
    styles: {
      dropdown: {
        background: "#1c2739",
        border: "1px solid rgba(139,92,246,0.3)",
        color: "white",
      },
    },
  },
  styles: {
    input: {
      backgroundColor: "rgba(30,41,59,0.8)",
      border: "1px solid rgba(71,85,105,0.5)",
      color: "white",
      borderRadius: "10px",
      fontSize: "13px",
      height: "38px",
      "&:focus": { borderColor: "rgba(249,115,22,0.5)" },
    },
    section: { color: "#94a3b8" },
    option: { color: "white", backgroundColor: "#1c2739" },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const TODAY_DAY = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
][new Date().getDay()];

const areaColor: Record<Area, { badge: string; dot: string; row: string }> = {
  Thane: {
    badge: "bg-orange-500/15 text-orange-400 border-orange-500/25",
    dot: "bg-orange-400",
    row: "hover:bg-orange-500/5",
  },
  Mulund: {
    badge: "bg-violet-500/15 text-violet-400 border-violet-500/25",
    dot: "bg-violet-400",
    row: "hover:bg-violet-500/5",
  },
};

const dayColor: Record<string, string> = {
  Monday: "text-blue-400",
  Tuesday: "text-green-400",
  Wednesday: "text-yellow-400",
  Thursday: "text-orange-400",
  Friday: "text-violet-400",
  Saturday: "text-pink-400",
  Sunday: "text-red-400",
};

// ─────────────────────────────────────────────────────────────────────────────
// StatCard
// ─────────────────────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconBg: string;
  sub?: string;
}> = ({ icon, label, value, iconBg, sub }) => (
  <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-4 flex items-center gap-3">
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-slate-400 text-xs">{label}</p>
      {sub && <p className="text-slate-500 text-[10px] mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// DeleteModal
// ─────────────────────────────────────────────────────────────────────────────

const DeleteModal: React.FC<{
  batch: Batch;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ batch, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
      <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center mb-4">
        <IconAlertTriangle size={22} className="text-red-400" />
      </div>
      <h3 className="text-white font-bold text-lg mb-1">Delete Batch?</h3>
      <p className="text-slate-400 text-sm mb-1">You are about to delete:</p>
      <p className="text-orange-400 font-semibold text-sm mb-3">{batch.name}</p>
      <p className="text-slate-500 text-xs mb-6">
        This will remove {batch.studentIds.length} student assignment
        {batch.studentIds.length !== 1 ? "s" : ""}. This action cannot be
        undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// BatchTableRow
// ─────────────────────────────────────────────────────────────────────────────

const BatchTableRow: React.FC<{
  batch: Batch;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ batch, onView, onEdit, onDelete }) => {
  const area = areaColor[batch.area];
  const isToday = batch.day === TODAY_DAY && batch.isActive;

  return (
    <tr
      className={`border-b border-slate-700/30 last:border-0 transition-colors ${area.row} ${!batch.isActive ? "opacity-50" : ""}`}
    >
      <td className="py-3 pl-4 pr-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-300 text-sm">{batch.name}</span>
          {isToday && (
            <span className="px-1.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[9px] font-bold uppercase tracking-wider">
              Today
            </span>
          )}
          {!batch.isActive && (
            <span className="px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-500 text-[9px]">
              Inactive
            </span>
          )}
        </div>
      </td>
      <td className="py-3 px-3 whitespace-nowrap">
        <span
          className={`text-sm font-semibold ${dayColor[batch.day] ?? "text-slate-400"}`}
        >
          {batch.day}
        </span>
      </td>
      <td className="py-3 px-3 whitespace-nowrap">
        <span className="flex items-center gap-1 text-slate-400 text-sm">
          <IconClock size={12} className="text-slate-500 shrink-0" />
          {batch.timeSlot}
        </span>
      </td>
      <td className="py-3 px-3 whitespace-nowrap">
        <div className="text-slate-300 text-sm">{batch.subject}</div>
        <div className="text-slate-500 text-xs">{batch.standard}</div>
      </td>
      <td className="py-3 px-3 whitespace-nowrap">
        <span className="flex items-center gap-1 text-slate-400 text-sm">
          <IconUser size={12} className="text-slate-500 shrink-0" />
          {batch.teacherName}
        </span>
      </td>
      <td className="py-3 px-3 text-center whitespace-nowrap">
        <span className="flex items-center justify-center gap-1 text-slate-300 text-sm font-semibold">
          <IconUsers size={13} className="text-slate-500" />
          {batch.studentIds.length}
        </span>
      </td>
      <td className="py-3 pl-3 pr-4">
        <div className="flex items-center gap-0.5 justify-end">
          <button
            onClick={onView}
            className="p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-400 hover:text-white     transition-colors"
            title="View"
          >
            {" "}
            <IconEye size={14} />
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-400 hover:text-orange-400 transition-colors"
            title="Edit"
          >
            {" "}
            <IconEdit size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-red-500/15   text-slate-400 hover:text-red-400   transition-colors"
            title="Delete"
          >
            <IconTrash size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BatchList
// ─────────────────────────────────────────────────────────────────────────────

const BatchList: React.FC = () => {
  const navigate = useNavigate();

  const [batches, setBatches] = useState(() => getAllBatches());
  const [search, setSearch] = useState("");
  const [filterArea, setFilterArea] = useState<string | null>(null);
  const [filterBranch, setFilterBranch] = useState<string | null>(null);
  const [filterDay, setFilterDay] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Batch | null>(null);

  const stats = useMemo(
    () => ({
      total: batches.length,
      active: batches.filter((b) => b.isActive).length,
      todayBatches: batches.filter((b) => b.day === TODAY_DAY && b.isActive)
        .length,
      totalStudents: new Set(batches.flatMap((b) => b.studentIds)).size,
    }),
    [batches],
  );

  const availableBranches = filterArea
    ? (BRANCHES[filterArea as Area] ?? [])
    : Object.values(BRANCHES).flat();

  const filtered = useMemo(
    () =>
      batches
        .filter((b) => {
          const q = search.toLowerCase();
          return (
            (!q ||
              b.name.toLowerCase().includes(q) ||
              b.subject.toLowerCase().includes(q) ||
              b.teacherName.toLowerCase().includes(q) ||
              b.branch.toLowerCase().includes(q)) &&
            (!filterArea || b.area === filterArea) &&
            (!filterBranch || b.branch === filterBranch) &&
            (!filterDay || b.day === filterDay) &&
            (!filterStatus ||
              (filterStatus === "active" && b.isActive) ||
              (filterStatus === "inactive" && !b.isActive) ||
              (filterStatus === "today" && b.day === TODAY_DAY && b.isActive))
          );
        })
        .sort((a, b) => {
          if (a.area !== b.area) return a.area.localeCompare(b.area);
          if (a.branch !== b.branch) return a.branch.localeCompare(b.branch);
          return DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
        }),
    [batches, search, filterArea, filterBranch, filterDay, filterStatus],
  );

  const grouped = useMemo(() => {
    const r: Record<string, Record<string, Batch[]>> = {};
    filtered.forEach((b) => {
      if (!r[b.area]) r[b.area] = {};
      if (!r[b.area][b.branch]) r[b.area][b.branch] = [];
      r[b.area][b.branch].push(b);
    });
    return r;
  }, [filtered]);

  const activeFilters = [
    filterArea && {
      label: filterArea,
      clear: () => {
        setFilterArea(null);
        setFilterBranch(null);
      },
    },
    filterBranch && { label: filterBranch, clear: () => setFilterBranch(null) },
    filterDay && { label: filterDay, clear: () => setFilterDay(null) },
    filterStatus && { label: filterStatus, clear: () => setFilterStatus(null) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteBatch(deleteTarget.id);
    setBatches(getAllBatches());
    setDeleteTarget(null);
  };

  const clearAllFilters = () => {
    setFilterArea(null);
    setFilterBranch(null);
    setFilterDay(null);
    setFilterStatus(null);
  };

  return (
    <div className="max-w-6xl mx-auto pb-10 space-y-5">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-white">Batches</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Manage all batches across areas and branches
          </p>
        </div>
        <Button
          onClick={() => navigate("/batches/create")}
          color="orange"
          size="md"
          leftSection={<IconPlus size={16} />}
        >
          Create Batch
        </Button>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={<IconSchool size={18} className="text-orange-400" />}
          label="Total Batches"
          value={stats.total}
          iconBg="bg-orange-500/15"
          sub={`${stats.active} active`}
        />
        <StatCard
          icon={<IconCircleCheck size={18} className="text-green-400" />}
          label="Today's Batches"
          value={stats.todayBatches}
          iconBg="bg-green-500/15"
          sub={TODAY_DAY}
        />
        <StatCard
          icon={<IconUsers size={18} className="text-violet-400" />}
          label="Total Students"
          value={stats.totalStudents}
          iconBg="bg-violet-500/15"
          sub="across all batches"
        />
      </div>

      {/* ── Search + Filters ────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex gap-3 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-52 relative">
            <IconSearch
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search batch, subject, teacher, branch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700/60 text-white text-sm rounded-xl pl-9 pr-4 py-2.5 placeholder-slate-500 outline-none focus:border-orange-500/50 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <IconX size={13} />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              showFilters || activeFilters.length > 0
                ? "bg-orange-500/15 border-orange-500/30 text-orange-400"
                : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white"
            }`}
          >
            <IconFilter size={14} /> Filters
            {activeFilters.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </button>
        </div>

        {/* Filter dropdowns — Mantine Select */}
        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
            <Select
              placeholder="All Areas"
              value={filterArea}
              onChange={(v) => {
                setFilterArea(v);
                setFilterBranch(null);
              }}
              data={AREAS.map((a) => ({ value: a, label: a }))}
              clearable
              {...selectDropdownStyles}
            />
            <Select
              placeholder="All Branches"
              value={filterBranch}
              onChange={setFilterBranch}
              data={availableBranches.map((b) => ({ value: b, label: b }))}
              clearable
              {...selectDropdownStyles}
            />
            <Select
              placeholder="All Days"
              value={filterDay}
              onChange={setFilterDay}
              data={DAYS.map((d) => ({ value: d, label: d }))}
              clearable
              {...selectDropdownStyles}
            />
            <Select
              placeholder="All Status"
              value={filterStatus}
              onChange={setFilterStatus}
              data={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "today", label: "Today" },
              ]}
              clearable
              {...selectDropdownStyles}
            />
          </div>
        )}

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500 text-xs">Filtered by:</span>
            {activeFilters.map((f) => (
              <span
                key={f.label}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/25 text-orange-400 text-xs font-medium"
              >
                {f.label}
                <button onClick={f.clear} className="hover:text-white">
                  <IconX size={10} />
                </button>
              </span>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Result count ────────────────────────────────────────────────── */}
      <p className="text-slate-500 text-xs">
        {filtered.length === batches.length
          ? `${batches.length} batches total`
          : `${filtered.length} of ${batches.length} batches`}
      </p>

      {/* ── Table grouped by Area → Branch ─────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mb-4">
            <IconSchool size={24} className="text-slate-600" />
          </div>
          <p className="text-slate-400 font-medium">No batches found</p>
          <p className="text-slate-600 text-sm mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([area, branches]) => (
            <div key={area}>
              {/* Area header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-2 h-2 rounded-full ${areaColor[area as Area].dot}`}
                />
                <span
                  className={`text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${areaColor[area as Area].badge}`}
                >
                  {area}
                </span>
                <span className="text-slate-500 text-xs">
                  {Object.values(branches).flat().length} batches ·{" "}
                  {Object.keys(branches).length} branches
                </span>
                <div className="flex-1 h-px bg-slate-700/40" />
              </div>

              {/* Branch tables */}
              <div className="space-y-3">
                {Object.entries(branches).map(([branch, batchList]) => (
                  <div
                    key={branch}
                    className="rounded-2xl border border-slate-700/60 bg-slate-800/30 overflow-hidden"
                  >
                    {/* Branch sub-header */}
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-700/50 bg-slate-800/50">
                      <IconMapPin size={13} className="text-slate-500" />
                      <span className="text-slate-300 text-sm font-semibold">
                        {branch}
                      </span>
                      <span className="text-slate-600 text-xs">
                        {batchList.length} batch
                        {batchList.length !== 1 ? "es" : ""}
                      </span>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-700/40">
                            <th className="text-left py-2 pl-4 pr-3 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                              Batch Name
                            </th>
                            <th className="text-left py-2 px-3 text-slate-500 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap">
                              <span className="flex items-center gap-1">
                                <IconCalendar size={10} /> Day
                              </span>
                            </th>
                            <th className="text-left py-2 px-3 text-slate-500 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap">
                              <span className="flex items-center gap-1">
                                <IconClock size={10} /> Time
                              </span>
                            </th>
                            <th className="text-left py-2 px-3 text-slate-500 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap">
                              <span className="flex items-center gap-1">
                                <IconBook size={10} /> Subject
                              </span>
                            </th>
                            <th className="text-left py-2 px-3 text-slate-500 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap">
                              <span className="flex items-center gap-1">
                                <IconUser size={10} /> Teacher
                              </span>
                            </th>
                            <th className="text-center py-2 px-3 text-slate-500 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap">
                              <span className="flex items-center justify-center gap-1">
                                <IconUsers size={10} /> Students
                              </span>
                            </th>
                            <th className="py-2 pl-3 pr-4 w-24" />
                          </tr>
                        </thead>
                        <tbody>
                          {batchList.map((batch) => (
                            <BatchTableRow
                              key={batch.id}
                              batch={batch}
                              onView={() => navigate(`/batches/${batch.id}`)}
                              onEdit={() =>
                                navigate(`/batches/${batch.id}/edit`)
                              }
                              onDelete={() => setDeleteTarget(batch)}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <DeleteModal
          batch={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default BatchList;
