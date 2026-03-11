// src/pages/batches/BatchDetail.tsx

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActionIcon, Tooltip } from "@mantine/core";
import {
  IconArrowLeft,
  IconEdit,
  IconMapPin,
  IconBuilding,
  IconCalendar,
  IconClock,
  IconBook,
  IconUser,
  IconUsers,
  IconCircleCheck,
  IconCircleOff,
} from "@tabler/icons-react";
import { getBatchById, type Area } from "./batchStore";

const areaColor: Record<Area, { badge: string; dot: string }> = {
  Thane: {
    badge: "bg-orange-500/15 text-orange-400 border-orange-500/25",
    dot: "bg-orange-400",
  },
  Mulund: {
    badge: "bg-violet-500/15 text-violet-400 border-violet-500/25",
    dot: "bg-violet-400",
  },
};

const TODAY_DAY = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
][new Date().getDay()];

const InfoRow: React.FC<{
  icon: React.ReactNode;
  iconColor: string;
  label: string;
  value: React.ReactNode;
}> = ({ icon, iconColor, label, value }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-slate-700/30 last:border-0">
    <span className={`shrink-0 ${iconColor}`}>{icon}</span>
    <span className="text-slate-500 text-sm w-16 shrink-0">{label}</span>
    <span className="text-white text-sm font-medium">{value}</span>
  </div>
);

const SectionCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  children: React.ReactNode;
}> = ({ title, icon, iconColor, children }) => (
  <div className="rounded-2xl border border-purple-500/30 bg-slate-700/50 p-5">
    <div className="flex items-center gap-2 mb-1 pb-3 border-b border-slate-700/50">
      <span className={iconColor}>{icon}</span>
      <h3 className="text-purple-400 font-semibold text-sm">{title}</h3>
    </div>
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const BatchDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const batch = id ? getBatchById(id) : null;

  if (!batch)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-slate-400">Batch not found.</p>
        <button
          onClick={() => navigate("/batches")}
          className="text-orange-400 text-sm flex items-center gap-1"
        >
          <IconArrowLeft size={15} /> Back to Batches
        </button>
      </div>
    );

  const area = areaColor[batch.area];
  const isToday = batch.day === TODAY_DAY && batch.isActive;
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
    <div className="max-w-5xl mx-auto space-y-4 pb-8">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tooltip label="Back to Batches" position="right" withArrow>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              radius="lg"
              onClick={() => navigate("/batches")}
              styles={{ root: { color: "#94a3b8" } }}
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
          </Tooltip>
          <div>
            <h2 className="text-2xl font-bold text-white">Batch Details</h2>
            <p className="text-slate-400 text-sm">
              ID: {batch.id} · Created {batch.createdAt}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/batches/${batch.id}/edit`)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors shadow-lg shadow-orange-500/20"
        >
          <IconEdit size={15} /> Edit Batch
        </button>
      </div>

      {/* ── Banner ─────────────────────────────────────────────────── */}
      <div
        className={`rounded-2xl border p-4 flex items-center gap-4 ${
          isToday
            ? "border-orange-500/40 bg-orange-500/[0.06]"
            : "border-slate-700/60 bg-slate-800/40"
        }`}
      >
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
            batch.isActive ? "bg-green-500/15" : "bg-slate-700/50"
          }`}
        >
          {batch.isActive ? (
            <IconCircleCheck size={22} className="text-green-400" />
          ) : (
            <IconCircleOff size={22} className="text-slate-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <div className={`w-2 h-2 rounded-full ${area.dot}`} />
            <span
              className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${area.badge}`}
            >
              {batch.area}
            </span>
            {isToday && (
              <span className="px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[10px] font-bold uppercase animate-pulse">
                Today
              </span>
            )}
            {!batch.isActive && (
              <span className="px-2 py-0.5 rounded-full bg-slate-700/50 border border-slate-600/50 text-slate-500 text-[10px]">
                Inactive
              </span>
            )}
          </div>
          <p className="text-white font-bold text-lg truncate">{batch.name}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-white font-bold text-base leading-none">
            {batch.studentIds.length}
            <span className="text-slate-500 text-sm font-normal">
              {" "}
              / {batch.capacity}
            </span>
          </p>
          <p className="text-slate-500 text-[11px] mb-1.5">students</p>
          <div className="w-20 h-1.5 bg-slate-700/80 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${fillColor}`}
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Details — 2 cards side by side ─────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        <SectionCard
          title="Location & Schedule"
          icon={<IconMapPin size={15} />}
          iconColor="text-orange-400"
        >
          <InfoRow
            icon={<IconMapPin size={14} />}
            iconColor="text-orange-400"
            label="Area"
            value={batch.area}
          />
          <InfoRow
            icon={<IconBuilding size={14} />}
            iconColor="text-orange-400"
            label="Branch"
            value={batch.branch}
          />
          <InfoRow
            icon={<IconCalendar size={14} />}
            iconColor="text-violet-400"
            label="Day"
            value={batch.day}
          />
          <InfoRow
            icon={<IconClock size={14} />}
            iconColor="text-violet-400"
            label="Time"
            value={batch.timeSlot}
          />
        </SectionCard>

        <SectionCard
          title="Academic & Teacher"
          icon={<IconBook size={15} />}
          iconColor="text-blue-400"
        >
          <InfoRow
            icon={<IconBook size={14} />}
            iconColor="text-blue-400"
            label="Subject"
            value={batch.subject}
          />
          <InfoRow
            icon={<IconBook size={14} />}
            iconColor="text-blue-400"
            label="Standard"
            value={batch.standard}
          />
          <InfoRow
            icon={<IconUser size={14} />}
            iconColor="text-green-400"
            label="Teacher"
            value={batch.teacherName}
          />
          <InfoRow
            icon={<IconUsers size={14} />}
            iconColor="text-green-400"
            label="Capacity"
            value={
              <div className="flex items-center gap-2.5">
                <span>
                  {batch.studentIds.length} / {batch.capacity}
                </span>
                <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${fillColor}`}
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
              </div>
            }
          />
        </SectionCard>
      </div>

      {/* ── Students — full width below ─────────────────────────────── */}
      <SectionCard
        title="Assigned Students"
        icon={<IconUsers size={15} />}
        iconColor="text-purple-400"
      >
        <div className="flex items-center justify-between -mt-1 mb-3">
          <span className="text-slate-500 text-xs">
            {batch.studentIds.length} of {batch.capacity} seats filled
          </span>
        </div>

        {batch.studentIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
              <IconUsers size={20} className="text-slate-600" />
            </div>
            <p className="text-slate-500 text-sm">No students assigned yet</p>
          </div>
        ) : (
          /* grid: 3 columns of student rows */
          <div className="grid grid-cols-3 gap-2">
            {batch.studentIds.map((sid, idx) => (
              <button
                key={sid}
                onClick={() => navigate(`/profile/student/${sid}`)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/40 hover:border-orange-500/40 hover:bg-orange-500/5 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-700/60 flex items-center justify-center shrink-0 text-slate-500 text-xs font-bold group-hover:bg-orange-500/20 group-hover:text-orange-400 transition-colors">
                  {idx + 1}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-slate-300 text-sm font-medium group-hover:text-orange-300 transition-colors truncate">
                    Student #{sid}
                  </p>
                </div>
                <IconUser
                  size={13}
                  className="text-slate-600 group-hover:text-orange-400 transition-colors shrink-0"
                />
              </button>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default BatchDetail;
