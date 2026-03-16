// src/pages/batches/BatchList.tsx

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Select, Badge } from "@mantine/core";
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
  IconUserPlus,
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
  BATCH_TYPES,
  type Batch,
  type Area,
  type BatchType,
} from "./batchStore";

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const selectStyles = {
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
      height: "36px",
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

const areaColor: Record<Area, { badge: string; dot: string; border: string }> =
  {
    Thane: {
      badge: "bg-orange-500/15 text-orange-400 border-orange-500/25",
      dot: "bg-orange-400",
      border: "border-orange-500/20",
    },
    Mulund: {
      badge: "bg-violet-500/15 text-violet-400 border-violet-500/25",
      dot: "bg-violet-400",
      border: "border-violet-500/20",
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

const typeColor: Record<BatchType, string> = {
  Regular: "bg-blue-500/15 text-blue-400",
  Backlog: "bg-orange-500/15 text-orange-400",
  Recovery: "bg-violet-500/15 text-violet-400",
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
// BatchCard — replaces table row
// ─────────────────────────────────────────────────────────────────────────────

const BatchCard: React.FC<{
  batch: Batch;
  onView: () => void;
  onAssign: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ batch, onView, onAssign, onEdit, onDelete }) => {
  const area = areaColor[batch.area];
  const isToday = batch.day === TODAY_DAY && batch.status === "Active";
  const fillPct = Math.min(
    (batch.studentIds.length / batch.capacity) * 100,
    100,
  );
  const fillColor =
    batch.studentIds.length >= batch.capacity
      ? "bg-red-500"
      : fillPct >= 80
        ? "bg-yellow-500"
        : "bg-green-500";

  return (
    <div
      className={`rounded-xl border bg-slate-800/40 p-4 transition-colors hover:bg-slate-800/60 ${
        batch.status !== "Active" ? "opacity-60" : ""
      } ${isToday ? "border-orange-500/30" : "border-slate-700/50"}`}
    >
      {/* Top row — name + badges + actions */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            {/* Type badge */}
            <span
              className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${typeColor[batch.type]}`}
            >
              {batch.type}
            </span>
            {/* Status badge (only if not Active) */}
            {batch.status !== "Active" && (
              <span className="px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-400 text-[9px] font-semibold uppercase">
                {batch.status}
              </span>
            )}
            {isToday && (
              <span className="px-1.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[9px] font-bold uppercase animate-pulse">
                Today
              </span>
            )}
          </div>
          <p className="text-white text-sm font-semibold leading-snug">
            {batch.name}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={onView}
            title="View"
            className="p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-400 hover:text-white      transition-colors"
          >
            <IconEye size={14} />
          </button>
          <button
            onClick={onAssign}
            title="Assign"
            className="p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-400 hover:text-green-400  transition-colors"
          >
            <IconUserPlus size={14} />
          </button>
          <button
            onClick={onEdit}
            title="Edit"
            className="p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-400 hover:text-orange-400 transition-colors"
          >
            <IconEdit size={14} />
          </button>
          <button
            onClick={onDelete}
            title="Delete"
            className="p-1.5 rounded-lg hover:bg-red-500/15   text-slate-400 hover:text-red-400    transition-colors"
          >
            <IconTrash size={14} />
          </button>
        </div>
      </div>

      {/* Info grid — 2 col */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3">
        <div className="flex items-center gap-1.5">
          <IconCalendar size={12} className="text-slate-500 shrink-0" />
          <span
            className={`text-xs font-semibold ${dayColor[batch.day] ?? "text-slate-400"}`}
          >
            {batch.day}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <IconClock size={12} className="text-slate-500 shrink-0" />
          <span className="text-slate-400 text-xs ">{batch.timeSlot}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <IconBook size={12} className="text-slate-500 shrink-0" />
          <span className="text-slate-300 text-xs ">{batch.subject}</span>
          <span className="text-slate-500 text-xs">·</span>
          <span className="text-slate-500 text-xs">{batch.standard}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <IconUser size={12} className="text-slate-500 shrink-0" />
          <span className="text-slate-400 text-xs ">{batch.teacherName}</span>
        </div>
      </div>

      {/* Capacity bar */}
      <div className="flex items-center gap-2">
        <IconUsers size={12} className="text-slate-500 shrink-0" />
        <div className="flex-1 h-1.5 bg-slate-700/80 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${fillColor}`}
            style={{ width: `${fillPct}%` }}
          />
        </div>
        <span className="text-slate-500 text-[11px] font-medium shrink-0">
          {batch.studentIds.length}/{batch.capacity}
        </span>
      </div>
    </div>
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
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Batch | null>(null);

  const stats = useMemo(
    () => ({
      total: batches.length,
      active: batches.filter((b) => b.status === "Active").length,
      todayBatches: batches.filter(
        (b) => b.day === TODAY_DAY && b.status === "Active",
      ).length,
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
            (!filterType || b.type === filterType) &&
            (!filterStatus ||
              (filterStatus === "today"
                ? b.day === TODAY_DAY && b.status === "Active"
                : b.status === filterStatus))
          );
        })
        .sort((a, b) => {
          if (a.area !== b.area) return a.area.localeCompare(b.area);
          if (a.branch !== b.branch) return a.branch.localeCompare(b.branch);
          return DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
        }),
    [
      batches,
      search,
      filterArea,
      filterBranch,
      filterDay,
      filterStatus,
      filterType,
    ],
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
    filterType && { label: filterType, clear: () => setFilterType(null) },
    filterStatus && { label: filterStatus, clear: () => setFilterStatus(null) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteBatch(deleteTarget.id);
    setBatches(getAllBatches());
    setDeleteTarget(null);
  };

  return (
    <div className="max-w-6xl mx-auto pb-10 space-y-5 px-2 sm:px-0">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-white">Batches</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Manage all batches across areas and branches
          </p>
        </div>
        <button
          onClick={() => navigate("/batches/create")}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-orange-500/20"
        >
          <IconPlus size={16} /> Create Batch
        </button>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

      {/* ── Search + Filter toggle ──────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          <div className="flex-1 min-w-[180px] relative">
            <IconSearch
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search batch, subject, teacher…"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
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

        {/* Filter dropdowns */}
        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
            <Select
              placeholder="All Areas"
              value={filterArea}
              onChange={(v) => {
                setFilterArea(v);
                setFilterBranch(null);
              }}
              data={AREAS.map((a) => ({ value: a, label: a }))}
              clearable
              {...selectStyles}
            />
            <Select
              placeholder="All Branches"
              value={filterBranch}
              onChange={setFilterBranch}
              data={availableBranches.map((b) => ({ value: b, label: b }))}
              clearable
              {...selectStyles}
            />
            <Select
              placeholder="All Days"
              value={filterDay}
              onChange={setFilterDay}
              data={DAYS.map((d) => ({ value: d, label: d }))}
              clearable
              {...selectStyles}
            />
            <Select
              placeholder="All Types"
              value={filterType}
              onChange={setFilterType}
              data={BATCH_TYPES.map((t) => ({ value: t, label: t }))}
              clearable
              {...selectStyles}
            />
            <Select
              placeholder="All Status"
              value={filterStatus}
              onChange={setFilterStatus}
              data={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
                { value: "Completed", label: "Completed" },
                { value: "today", label: "Today" },
              ]}
              clearable
              {...selectStyles}
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
              onClick={() => {
                setFilterArea(null);
                setFilterBranch(null);
                setFilterDay(null);
                setFilterType(null);
                setFilterStatus(null);
              }}
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

      {/* ── Cards grouped by Area → Branch ─────────────────────────────── */}
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

              {/* Branches */}
              <div className="space-y-4">
                {Object.entries(branches).map(([branch, batchList]) => (
                  <div key={branch}>
                    {/* Branch sub-header */}
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <IconMapPin size={12} className="text-slate-500" />
                      <span className="text-slate-400 text-xs font-semibold">
                        {branch}
                      </span>
                      <span className="text-slate-600 text-xs">
                        {batchList.length} batch
                        {batchList.length !== 1 ? "es" : ""}
                      </span>
                    </div>

                    {/* Card grid — 1 col mobile, 2 col sm, 3 col lg */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {batchList.map((batch) => (
                        <BatchCard
                          key={batch.id}
                          batch={batch}
                          onView={() => navigate(`/batches/${batch.id}`)}
                          onAssign={() =>
                            navigate(`/batches/${batch.id}/assign`)
                          }
                          onEdit={() => navigate(`/batches/${batch.id}/edit`)}
                          onDelete={() => setDeleteTarget(batch)}
                        />
                      ))}
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
