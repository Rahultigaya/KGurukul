// src/pages/batches/BatchDetail.tsx

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Stack, Paper, Title, Grid, Text, ActionIcon, Tooltip } from "@mantine/core";
import {
  IconArrowLeft, IconEdit, IconMapPin, IconBuilding,
  IconCalendar, IconClock, IconBook, IconUser, IconUsers,
  IconCircleCheck, IconCircleOff, IconCircleX,
} from "@tabler/icons-react";
import { getBatchById, BATCH_TYPE_META, BATCH_STATUS_META, type Area } from "./batchStore";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const areaColor: Record<Area, { badge: string; dot: string }> = {
  Thane:  { badge: "bg-orange-500/15 text-orange-400 border border-orange-500/25", dot: "bg-orange-400" },
  Mulund: { badge: "bg-violet-500/15 text-violet-400 border border-violet-500/25", dot: "bg-violet-400" },
};

const TODAY_DAY = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];

// ─────────────────────────────────────────────────────────────────────────────
// InfoRow — uses CSS vars
// ─────────────────────────────────────────────────────────────────────────────

const InfoRow: React.FC<{
  icon: React.ReactNode; iconColor: string; label: string; value: React.ReactNode;
}> = ({ icon, iconColor, label, value }) => (
  <div className="flex items-center gap-3 py-2.5"
    style={{ borderBottom: "1px solid var(--border-default)" }}>
    <span className={`shrink-0 ${iconColor}`}>{icon}</span>
    <Text size="sm" w={64} style={{ color: "var(--text-muted)", flexShrink: 0 }}>{label}</Text>
    <Text size="sm" fw={500} style={{ color: "var(--text-primary)" }}>{value}</Text>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// BatchDetail
// ─────────────────────────────────────────────────────────────────────────────

const BatchDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id }   = useParams<{ id: string }>();
  const batch     = id ? getBatchById(id) : null;

  if (!batch)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Text style={{ color: "var(--text-secondary)" }}>Batch not found.</Text>
        <button onClick={() => navigate("/batches")}
          className="flex items-center gap-1 text-sm"
          style={{ color: "var(--accent-orange)" }}>
          <IconArrowLeft size={15} /> Back to Batches
        </button>
      </div>
    );

  const area     = areaColor[batch.area];
  const isToday  = batch.day === TODAY_DAY && batch.status === "Active";
  const fillPct  = Math.min((batch.studentIds.length / batch.capacity) * 100, 100);
  const fillColor = batch.studentIds.length >= batch.capacity ? "#ef4444"
    : fillPct >= 80 ? "#f59e0b" : "#22c55e";

  const typeMeta   = BATCH_TYPE_META[batch.type];
  const statusIcon = batch.status === "Active"    ? <IconCircleCheck size={22} className="text-green-400" />
                   : batch.status === "Completed" ? <IconCircleX     size={22} className="text-slate-400" />
                   :                                <IconCircleOff   size={22} className="text-yellow-400" />;
  const statusIconBg = batch.status === "Active"    ? "rgba(34,197,94,0.12)"
                     : batch.status === "Completed" ? "rgba(100,116,139,0.2)"
                     :                                "rgba(234,179,8,0.12)";

  return (
    <Stack gap="md" maw={1000} mx="auto" pb="xl">

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Tooltip label="Back to Batches" position="right" withArrow>
            <ActionIcon variant="subtle" size="lg" radius="lg"
              onClick={() => navigate("/batches")}
              styles={{ root: { color: "var(--text-secondary)" } }}>
              <IconArrowLeft size={20} />
            </ActionIcon>
          </Tooltip>
          <div>
            <Title order={3} style={{ color: "var(--text-primary)" }}>Batch Details</Title>
            <Text size="sm" style={{ color: "var(--text-muted)" }}>
              ID: {batch.id} · Created {batch.createdAt}
            </Text>
          </div>
        </div>
        <button
          onClick={() => navigate(`/batches/${batch.id}/edit`)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors shadow-lg shadow-orange-500/20"
        >
          <IconEdit size={15} /> Edit Batch
        </button>
      </div>

      {/* ── Banner ────────────────────────────────────────────────────── */}
      <Paper className="p-4"
        style={{
          background: isToday ? "rgba(249,115,22,0.05)" : "var(--bg-card)",
          border: `1px solid ${isToday ? "rgba(249,115,22,0.35)" : "var(--border-card)"}`,
        }}>
        <div className="flex items-center gap-4 flex-wrap">

          {/* Status icon */}
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: statusIconBg }}>
            {statusIcon}
          </div>

          {/* Name + badges */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <div className={`w-2 h-2 rounded-full ${area.dot}`} />
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${area.badge}`}>
                {batch.area}
              </span>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full`}
                style={{
                  background: `color-mix(in srgb, var(--accent-orange) 12%, transparent)`,
                  color: "var(--accent-orange)",
                }}>
                {batch.type}
              </span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full"
                style={{
                  background: "var(--bg-tertiary)",
                  color: batch.status === "Active" ? "#22c55e" : batch.status === "Completed" ? "var(--text-muted)" : "#f59e0b",
                }}>
                {batch.status}
              </span>
              {isToday && (
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[10px] font-bold uppercase animate-pulse">
                  Today
                </span>
              )}
            </div>
            <Text fw={700} size="lg" style={{ color: "var(--text-primary)" }}>{batch.name}</Text>
            <Text size="xs" mt={2} style={{ color: "var(--text-muted)" }}>
              {typeMeta.description}
            </Text>
          </div>

          {/* Capacity */}
          <div className="shrink-0 text-right">
            <Text fw={700} size="xl" style={{ color: "var(--text-primary)" }}>
              {batch.studentIds.length}
              <Text span size="sm" fw={400} style={{ color: "var(--text-muted)" }}> / {batch.capacity}</Text>
            </Text>
            <Text size="xs" mb={6} style={{ color: "var(--text-muted)" }}>students</Text>
            <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-tertiary)" }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${fillPct}%`, background: fillColor }} />
            </div>
          </div>
        </div>
      </Paper>

      {/* ── Detail cards ──────────────────────────────────────────────── */}
      <Grid gutter="md">
        {/* Location & Schedule */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Paper className="p-4 sm:p-5 h-full"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)" }}>
            <Title order={5} mb="sm" style={{ color: "var(--text-accent)", fontSize: "clamp(13px,2vw,16px)" }}>
              <span className="flex items-center gap-2">
                <IconMapPin size={15} style={{ color: "var(--text-accent)" }} />
                Location & Schedule
              </span>
            </Title>
            <InfoRow icon={<IconMapPin  size={14} />} iconColor="text-orange-400" label="Area"   value={batch.area}     />
            <InfoRow icon={<IconBuilding size={14} />} iconColor="text-orange-400" label="Branch" value={batch.branch}   />
            <InfoRow icon={<IconCalendar size={14} />} iconColor="text-violet-400" label="Day"    value={batch.day}      />
            <InfoRow icon={<IconClock   size={14} />} iconColor="text-violet-400" label="Time"   value={batch.timeSlot} />
          </Paper>
        </Grid.Col>

        {/* Academic & Teacher */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Paper className="p-4 sm:p-5 h-full"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)" }}>
            <Title order={5} mb="sm" style={{ color: "var(--text-accent)", fontSize: "clamp(13px,2vw,16px)" }}>
              <span className="flex items-center gap-2">
                <IconBook size={15} style={{ color: "var(--text-accent)" }} />
                Academic & Teacher
              </span>
            </Title>
            <InfoRow icon={<IconBook  size={14} />} iconColor="text-blue-400"  label="Subject"  value={batch.subject}     />
            <InfoRow icon={<IconBook  size={14} />} iconColor="text-blue-400"  label="Standard" value={batch.standard}    />
            <InfoRow icon={<IconUser  size={14} />} iconColor="text-green-400" label="Teacher"  value={batch.teacherName} />
            <InfoRow
              icon={<IconUsers size={14} />} iconColor="text-green-400" label="Capacity"
              value={
                <div className="flex items-center gap-2.5">
                  <span>{batch.studentIds.length} / {batch.capacity}</span>
                  <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-tertiary)" }}>
                    <div className="h-full rounded-full" style={{ width: `${fillPct}%`, background: fillColor }} />
                  </div>
                </div>
              }
            />
          </Paper>
        </Grid.Col>
      </Grid>

      {/* ── Students ──────────────────────────────────────────────────── */}
      <Paper className="p-4 sm:p-5"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)" }}>
        <div className="flex items-center justify-between mb-4">
          <Title order={5} style={{ color: "var(--text-accent)", fontSize: "clamp(13px,2vw,16px)" }}>
            <span className="flex items-center gap-2">
              <IconUsers size={15} style={{ color: "var(--text-accent)" }} />
              Assigned Students
            </span>
          </Title>
          <Text size="xs" style={{ color: "var(--text-muted)" }}>
            {batch.studentIds.length} of {batch.capacity} seats filled
          </Text>
        </div>

        {batch.studentIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-default)" }}>
              <IconUsers size={20} style={{ color: "var(--text-muted)" }} />
            </div>
            <Text size="sm" style={{ color: "var(--text-muted)" }}>No students assigned yet</Text>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {batch.studentIds.map((sid, idx) => (
              <button
                key={sid}
                onClick={() => navigate(`/profile/student/${sid}`)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group"
                style={{
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-default)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(249,115,22,0.4)";
                  e.currentTarget.style.background  = "rgba(249,115,22,0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-default)";
                  e.currentTarget.style.background  = "var(--bg-tertiary)";
                }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-colors"
                  style={{ background: "var(--border-default)", color: "var(--text-muted)" }}>
                  {idx + 1}
                </div>
                <Text size="sm" fw={500} style={{ color: "var(--text-primary)", flex: 1 }}>
                  Student #{sid}
                </Text>
                <IconUser size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              </button>
            ))}
          </div>
        )}
      </Paper>

    </Stack>
  );
};

export default BatchDetail;