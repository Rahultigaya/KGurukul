// src/pages/batches/BatchList.tsx

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "@mantine/core";
import { Autocomplete, TextField } from "@mui/material";
import {
  IconPlus, IconSearch, IconMapPin, IconClock,
  IconUser, IconUsers, IconBook, IconEdit,
  IconEye, IconUserPlus, IconX, IconSchool,
  IconCircleCheck, IconCalendar, IconTrash,
} from "@tabler/icons-react";
import {
  getAllBatchesAPI, deleteBatch, AREAS, BRANCHES, DAYS, BATCH_TYPES,
  type Batch, type Area, type BatchType,
} from "./batchStore";
import { DUMMY_BATCH } from "./dummyBatch";
import Swal from "sweetalert2";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers & Colors (Matching Student UI Slate/Blue Theme)
// ─────────────────────────────────────────────────────────────────────────────

const TODAY_DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()];

const areaColor: Record<Area, { badge: string; dot: string }> = {
  Thane: { badge: "bg-blue-50 text-blue-700 border border-blue-200/80 font-bold", dot: "bg-blue-600" },
  Mulund: { badge: "bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-bold", dot: "bg-indigo-600" },
};

const dayColor: Record<string, string> = {
  Monday: "text-blue-600 font-semibold", Tuesday: "text-emerald-600 font-semibold", Wednesday: "text-amber-600 font-semibold",
  Thursday: "text-orange-600 font-semibold", Friday: "text-indigo-600 font-semibold", Saturday: "text-purple-600 font-semibold", Sunday: "text-rose-600 font-semibold",
};

const typeColor: Record<BatchType, string> = {
  Regular: "bg-blue-50 text-blue-700 border border-blue-200/60 font-semibold",
  Backlog: "bg-amber-50 text-amber-700 border border-amber-200/60 font-semibold",
  Recovery: "bg-purple-50 text-purple-700 border border-purple-200/60 font-semibold",
};

// ─────────────────────────────────────────────────────────────────────────────
// StatCard
// ─────────────────────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  icon: React.ReactNode; label: string;
  value: string | number; iconBg: string; sub?: string;
}> = ({ icon, label, value, iconBg, sub }) => (
  <div className="rounded-xl px-4 py-3 bg-white border border-slate-200/90 shadow-sm flex items-center justify-between gap-3.5 transition-all hover:shadow-md hover:border-slate-300">
    <div className="flex items-center gap-3 min-w-0">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-700 truncate">{label}</p>
        {sub && <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">{sub}</p>}
      </div>
    </div>
    <span className="text-2xl font-extrabold text-slate-800 shrink-0">{value}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// BatchCard
// ─────────────────────────────────────────────────────────────────────────────

const BatchCard: React.FC<{
  batch: Batch;
  onView: () => void; onAssign: () => void; onEdit: () => void; onDelete: () => void;
}> = ({ batch, onView, onAssign, onEdit, onDelete }) => {
  const isToday = batch.day === TODAY_DAY && batch.status === "Active";
  const fillPct = Math.min((batch.studentIds.length / batch.capacity) * 100, 100);
  const fillColor = batch.studentIds.length >= batch.capacity
    ? "bg-rose-500" : fillPct >= 80 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div
      className={`rounded-xl p-4 bg-white border transition-all shadow-sm hover:shadow-md ${
        isToday ? "border-blue-300 ring-1 ring-blue-200" : "border-slate-200/80"
      } ${batch.status !== "Active" ? "opacity-60" : ""}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${typeColor[batch.type]}`}>
              {batch.type}
            </span>
            {batch.status !== "Active" && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 font-semibold uppercase">
                {batch.status}
              </span>
            )}
            {isToday && (
              <span className="px-2 py-0.5 rounded-full bg-blue-100 border border-blue-300 text-blue-700 text-[10px] font-bold uppercase animate-pulse">
                Today
              </span>
            )}
          </div>
          <p className="text-sm font-bold text-slate-800 leading-snug">
            {batch.name}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button onClick={onView} title="View" className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"><IconEye size={15} /></button>
          <button onClick={onAssign} title="Assign" className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-colors"><IconUserPlus size={15} /></button>
          <button onClick={onEdit} title="Edit" className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"><IconEdit size={15} /></button>
          <button onClick={onDelete} title="Delete" className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"><IconTrash size={15} /></button>
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3 text-xs">
        <div className="flex items-center gap-1.5">
          <IconCalendar size={13} className="text-slate-400 shrink-0" />
          <span className={dayColor[batch.day] ?? "text-slate-700"}>{batch.day}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <IconClock size={13} className="text-slate-400 shrink-0" />
          <span className="text-slate-600 font-medium">{batch.timeSlot}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <IconBook size={13} className="text-slate-400 shrink-0" />
          <span className="text-slate-700 font-medium truncate">{batch.subject}</span>
          <span className="text-slate-400 font-semibold">· {batch.standard}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <IconUser size={13} className="text-slate-400 shrink-0" />
          <span className="text-slate-600 font-medium truncate">{batch.teacherName}</span>
        </div>
      </div>

      {/* Capacity bar */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <IconUsers size={13} className="text-slate-400 shrink-0" />
        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className={`h-full rounded-full transition-all ${fillColor}`} style={{ width: `${fillPct}%` }} />
        </div>
        <span className="text-[11px] font-semibold text-slate-600 shrink-0">
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

  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterArea, setFilterArea] = useState<string | null>(null);
  const [filterBranch, setFilterBranch] = useState<string | null>(null);
  const [filterDay, setFilterDay] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  // Fetch batches from API
  const fetchBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllBatchesAPI();
      setBatches(data);
    } catch (err: any) {
      console.error("Error fetching batches:", err);
      setError(err.message || "Failed to load batches");
      setBatches([DUMMY_BATCH]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleDelete = (batch: Batch) => {
    Swal.fire({
      title: "Delete Batch?",
      html: `
        <div style="font-size: 14px; color: #475569; margin-bottom: 8px;">
          You are about to delete <strong>${batch.name}</strong>.
        </div>
        <div style="font-size: 12px; color: #64748b;">
          This will remove ${batch.studentIds.length} student assignment${batch.studentIds.length !== 1 ? "s" : ""}. This action cannot be undone.
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#94a3b8",
      customClass: {
        confirmButton: "rounded-xl px-5 py-2.5 font-bold text-sm shadow-md",
        cancelButton: "rounded-xl px-5 py-2.5 font-semibold text-sm shadow-sm",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setBatches((prev) => prev.filter((b) => b.id !== batch.id));
        deleteBatch(batch.id);
        Swal.fire({
          title: "Deleted!",
          text: `Batch "${batch.name}" has been deleted.`,
          icon: "success",
          confirmButtonColor: "#2563eb",
          customClass: {
            confirmButton: "rounded-xl px-5 py-2.5 font-bold text-sm shadow-md",
          },
        });
      }
    });
  };



  const stats = useMemo(() => ({
    total: batches.length,
    active: batches.filter((b) => b.status === "Active").length,
    todayBatches: batches.filter((b) => b.day === TODAY_DAY && b.status === "Active").length,
    totalStudents: new Set(batches.flatMap((b) => b.studentIds)).size,
  }), [batches]);

  const availableBranches = filterArea
    ? (BRANCHES[filterArea as Area] ?? [])
    : Object.values(BRANCHES).flat();

  const filtered = useMemo(() =>
    batches
      .filter((b) => {
        const q = search.toLowerCase();
        return (
          (!q || b.name.toLowerCase().includes(q) || b.subject.toLowerCase().includes(q) ||
            b.teacherName.toLowerCase().includes(q) || b.branch.toLowerCase().includes(q)) &&
          (!filterArea || b.area === filterArea) &&
          (!filterBranch || b.branch === filterBranch) &&
          (!filterDay || b.day === filterDay) &&
          (!filterType || b.type === filterType) &&
          (!filterStatus || (filterStatus === "today"
            ? b.day === TODAY_DAY && b.status === "Active"
            : b.status === filterStatus))
        );
      })
      .sort((a, b) => {
        if (a.area !== b.area) return a.area.localeCompare(b.area);
        if (a.branch !== b.branch) return a.branch.localeCompare(b.branch);
        return DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
      }),
    [batches, search, filterArea, filterBranch, filterDay, filterStatus, filterType]
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
    filterArea && { label: filterArea, clear: () => { setFilterArea(null); setFilterBranch(null); } },
    filterBranch && { label: filterBranch, clear: () => setFilterBranch(null) },
    filterDay && { label: filterDay, clear: () => setFilterDay(null) },
    filterType && { label: filterType, clear: () => setFilterType(null) },
    filterStatus && { label: filterStatus, clear: () => setFilterStatus(null) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  return (
    <div className="space-y-6">

      {/* ── Header (Matches Student / Teacher List UI) ───────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            Batches
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Manage all batches across areas and branches
          </p>
        </div>

        <button
          onClick={() => navigate("/batches/create")}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md transition-all hover:scale-105"
        >
          <IconPlus size={16} />
          Create Batch
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader color="blue" size="lg" />
        </div>
      )}

      {!loading && (
        <div className="space-y-5">
          {/* Offline Alert Banner (Matching Student / Teacher UI) */}
          {error && (
            <div className="flex items-center justify-between px-4 py-3 bg-red-50 border-b border-red-200 text-red-600 text-sm rounded-xl">
              <span>
                ⚠️ API connection failed ({error}). Showing 1 dummy batch for offline preview.
              </span>
              <button
                onClick={fetchBatches}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
              >
                Retry API
              </button>
            </div>
          )}

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={<IconSchool size={20} className="text-blue-600" />} label="Total Batches" value={stats.total} iconBg="bg-blue-50" sub={`${stats.active} active`} />
            <StatCard icon={<IconCircleCheck size={20} className="text-emerald-600" />} label="Today's Batches" value={stats.todayBatches} iconBg="bg-emerald-50" sub={TODAY_DAY} />
            <StatCard icon={<IconUsers size={20} className="text-indigo-600" />} label="Total Students" value={stats.totalStudents} iconBg="bg-indigo-50" sub="across all batches" />
          </div>

          {/* ── Single Always-Visible Filter Card ─────────────────────────────── */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
            {/* Search Input */}
            <div className="relative">
              <IconSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search batch, subject, teacher, branch…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-sm rounded-lg pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <IconX size={14} />
                </button>
              )}
            </div>

            {/* Filter Dropdowns Grid + Clear Filters Button */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-center">
              <Autocomplete
                options={AREAS}
                value={filterArea}
                onChange={(_e, newValue) => {
                  setFilterArea(newValue);
                  setFilterBranch(null);
                }}
                size="small"
                renderInput={(params) => (
                  <TextField {...params} placeholder="All Areas" sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#f8fafc",
                      borderRadius: "8px",
                      fontSize: "13px",
                      paddingTop: "2px",
                      paddingBottom: "2px",
                      "& fieldset": { borderColor: "#cbd5e1" },
                      "&:hover fieldset": { borderColor: "#94a3b8" },
                      "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                    },
                    "& .MuiInputBase-input": { fontSize: "13px", color: "#0f172a" },
                  }} />
                )}
              />
              <Autocomplete
                options={availableBranches}
                value={filterBranch}
                onChange={(_e, newValue) => setFilterBranch(newValue)}
                size="small"
                renderInput={(params) => (
                  <TextField {...params} placeholder="All Branches" sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#f8fafc",
                      borderRadius: "8px",
                      fontSize: "13px",
                      paddingTop: "2px",
                      paddingBottom: "2px",
                      "& fieldset": { borderColor: "#cbd5e1" },
                      "&:hover fieldset": { borderColor: "#94a3b8" },
                      "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                    },
                    "& .MuiInputBase-input": { fontSize: "13px", color: "#0f172a" },
                  }} />
                )}
              />
              <Autocomplete
                options={DAYS}
                value={filterDay}
                onChange={(_e, newValue) => setFilterDay(newValue)}
                size="small"
                renderInput={(params) => (
                  <TextField {...params} placeholder="All Days" sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#f8fafc",
                      borderRadius: "8px",
                      fontSize: "13px",
                      paddingTop: "2px",
                      paddingBottom: "2px",
                      "& fieldset": { borderColor: "#cbd5e1" },
                      "&:hover fieldset": { borderColor: "#94a3b8" },
                      "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                    },
                    "& .MuiInputBase-input": { fontSize: "13px", color: "#0f172a" },
                  }} />
                )}
              />
              <Autocomplete
                options={BATCH_TYPES}
                value={filterType}
                onChange={(_e, newValue) => setFilterType(newValue)}
                size="small"
                renderInput={(params) => (
                  <TextField {...params} placeholder="All Types" sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#f8fafc",
                      borderRadius: "8px",
                      fontSize: "13px",
                      paddingTop: "2px",
                      paddingBottom: "2px",
                      "& fieldset": { borderColor: "#cbd5e1" },
                      "&:hover fieldset": { borderColor: "#94a3b8" },
                      "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                    },
                    "& .MuiInputBase-input": { fontSize: "13px", color: "#0f172a" },
                  }} />
                )}
              />
              <Autocomplete
                options={["Active", "Inactive", "Completed", "today"]}
                value={filterStatus}
                onChange={(_e, newValue) => setFilterStatus(newValue)}
                size="small"
                getOptionLabel={(option) => option === "today" ? "Today" : option}
                renderInput={(params) => (
                  <TextField {...params} placeholder="All Status" sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#f8fafc",
                      borderRadius: "8px",
                      fontSize: "13px",
                      paddingTop: "2px",
                      paddingBottom: "2px",
                      "& fieldset": { borderColor: "#cbd5e1" },
                      "&:hover fieldset": { borderColor: "#94a3b8" },
                      "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                    },
                    "& .MuiInputBase-input": { fontSize: "13px", color: "#0f172a" },
                  }} />
                )}
              />
              
              <button
                onClick={() => {
                  setSearch("");
                  setFilterArea(null);
                  setFilterBranch(null);
                  setFilterDay(null);
                  setFilterType(null);
                  setFilterStatus(null);
                }}
                disabled={!search && activeFilters.length === 0}
                className={`flex items-center justify-center gap-1.5 h-[36px] px-3 rounded-lg text-xs font-semibold transition-all ${
                  search || activeFilters.length > 0
                    ? "bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer border border-slate-300 shadow-sm"
                    : "bg-slate-50 text-slate-300 border border-slate-200 cursor-not-allowed"
                }`}
              >
                <IconX size={14} /> Clear Filters
              </button>
            </div>

            {/* Active Filter Chips */}
            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Active filters:</span>
                {activeFilters.map((f) => (
                  <span key={f.label} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                    {f.label}
                    <button onClick={f.clear} className="hover:text-blue-900"><IconX size={11} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 font-medium">
            {filtered.length === batches.length
              ? `${batches.length} batches total`
              : `${filtered.length} of ${batches.length} batches`}
          </p>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                <IconSchool size={22} />
              </div>
              <p className="font-semibold text-slate-700 text-base">No batches found</p>
              <p className="text-xs text-slate-500 mt-0.5">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(grouped).map(([area, branches]) => (
                <div key={area}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${areaColor[area as Area].dot}`} />
                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${areaColor[area as Area].badge}`}>
                      {area}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {Object.values(branches).flat().length} batches · {Object.keys(branches).length} branches
                    </span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  <div className="space-y-4">
                    {Object.entries(branches).map(([branch, batchList]) => (
                      <div key={branch}>
                        <div className="flex items-center gap-2 mb-2 px-1">
                          <IconMapPin size={14} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-700">{branch}</span>
                          <span className="text-xs text-slate-400">
                            ({batchList.length} batch{batchList.length !== 1 ? "es" : ""})
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {batchList.map((batch) => (
                            <BatchCard
                              key={batch.id}
                              batch={batch}
                              onView={() => navigate(`/batches/${batch.id}`)}
                              onAssign={() => navigate(`/batches/${batch.id}/assign`)}
                              onEdit={() => navigate(`/batches/${batch.id}/edit`)}
                              onDelete={() => handleDelete(batch)}
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
        </div>
      )}

    </div>
  );
};

export default BatchList;