// src/pages/batches/BatchDetail.tsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Stack, Paper, Title, Grid, Text, Loader } from "@mantine/core";
import { Button } from "@mui/material";
import {
  IconArrowLeft, IconMapPin, IconBuilding,
  IconCalendar, IconClock, IconBook, IconUser, IconUsers,
  IconCircleCheck, IconCircleOff, IconCircleX,
} from "@tabler/icons-react";
import { PageHeader } from "../../components/PageHeader";
import { getBatchByIdAPI, BATCH_TYPE_META, type Batch } from "./batchStore";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const AREA_PALETTES = [
  { badge: "bg-orange-500/15 text-orange-400 border border-orange-500/25", dot: "bg-orange-400" },
  { badge: "bg-violet-500/15 text-violet-400 border border-violet-500/25", dot: "bg-violet-400" },
  { badge: "bg-blue-500/15 text-blue-400 border border-blue-500/25", dot: "bg-blue-400" },
  { badge: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25", dot: "bg-emerald-400" },
  { badge: "bg-amber-500/15 text-amber-400 border border-amber-500/25", dot: "bg-amber-400" },
  { badge: "bg-rose-500/15 text-rose-400 border border-rose-500/25", dot: "bg-rose-400" },
];

function getAreaColor(areaName: string): { badge: string; dot: string } {
  if (!areaName) return AREA_PALETTES[0];
  let hash = 0;
  for (let i = 0; i < areaName.length; i++) {
    hash = areaName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AREA_PALETTES.length;
  return AREA_PALETTES[index];
}

const TODAY_DAY = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];

// ─────────────────────────────────────────────────────────────────────────────
// InfoRow
// ─────────────────────────────────────────────────────────────────────────────

const InfoRow: React.FC<{
  icon: React.ReactNode; iconColor: string; label: string; value: React.ReactNode;
}> = ({ icon, iconColor, label, value }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-slate-200">
    <span className={`shrink-0 ${iconColor}`}>{icon}</span>
    <Text size="sm" w={64} className="text-slate-500 shrink-0">{label}</Text>
    <Text size="sm" fw={500} className="text-slate-800">{value}</Text>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// BatchDetail
// ─────────────────────────────────────────────────────────────────────────────

const BatchDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id }   = useParams<{ id: string }>();

  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let isCancelled = false;

    const fetchBatch = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getBatchByIdAPI(id);
        if (!isCancelled) {
          setBatch(data);
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error("Error fetching batch:", err);
          setError(err.message || "Failed to load batch");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchBatch();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <Loader size="lg" color="orange" />
      </div>
    );

  if (error || !batch)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Text className="text-slate-600">{error || "Batch not found."}</Text>
        <Button
          variant="text"
          onClick={() => navigate("/batches")}
          startIcon={<IconArrowLeft size={15} />}
          className="!normal-case !text-sm flex items-center gap-1 !text-blue-600"
        >
          Back to Batches
        </Button>
      </div>
    );

  const area     = getAreaColor(batch.area);
  const isToday  = batch.day === TODAY_DAY && batch.status === "Active";
  const fillPct  = Math.min((batch.studentIds.length / batch.capacity) * 100, 100);
  const fillColor = batch.studentIds.length >= batch.capacity ? "#ef4444"
    : fillPct >= 80 ? "#f59e0b" : "#22c55e";

  const typeMeta   = BATCH_TYPE_META[batch.type];
  const statusIcon = batch.status === "Active"    ? <IconCircleCheck size={22} className="text-green-500" />
                   : batch.status === "Completed" ? <IconCircleX     size={22} className="text-slate-400" />
                   :                                <IconCircleOff   size={22} className="text-amber-500" />;
  const statusIconBg = batch.status === "Active"    ? "rgba(34,197,94,0.12)"
                     : batch.status === "Completed" ? "rgba(100,116,139,0.2)"
                     :                                "rgba(234,179,8,0.12)";

  return (
    <Stack gap="md" maw={1000} mx="auto" pb="xl">

      {/* ── Page Header ────────────────────────────────────────────────── */}
      <PageHeader
        title="View Batch Details"
        subtitle="View complete batch information, schedule, and assigned students"
        onBack={() => navigate("/batches")}
      />

      {/* ── Banner ────────────────────────────────────────────────────── */}
      <Paper className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl">
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
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                {batch.type}
              </span>
              <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                batch.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                batch.status === "Completed" ? "bg-slate-100 text-slate-500 border border-slate-200" : "bg-amber-50 text-amber-600 border border-amber-200"
              }`}>
                {batch.status}
              </span>
              {isToday && (
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-600 text-[10px] font-bold uppercase animate-pulse">
                  Today
                </span>
              )}
            </div>
            <Text fw={700} size="lg" className="text-slate-800">{batch.name}</Text>
            <Text size="xs" mt={2} className="text-slate-500">
              {typeMeta.description}
            </Text>
          </div>

          {/* Capacity */}
          <div className="shrink-0 text-right">
            <Text fw={700} size="xl" className="text-slate-800">
              {batch.studentIds.length}
              <Text span size="sm" fw={400} className="text-slate-500"> / {batch.capacity}</Text>
            </Text>
            <Text size="xs" mb={6} className="text-slate-500">students</Text>
            <div className="w-24 h-1.5 rounded-full overflow-hidden bg-slate-100">
              <div className="h-full rounded-full transition-all" style={{ width: `${fillPct}%`, background: fillColor }} />
            </div>
          </div>
        </div>
      </Paper>

      {/* ── Detail cards ──────────────────────────────────────────────── */}
      <Grid gutter="md">
        {/* Location & Schedule */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Paper className="p-4 sm:p-5 h-full bg-white border border-slate-200 shadow-sm rounded-2xl">
            <Title order={5} mb="sm" className="!text-slate-800" style={{ fontSize: "clamp(13px,2vw,16px)" }}>
              <span className="flex items-center gap-2">
                <IconMapPin size={15} className="text-blue-600" />
                Location & Schedule
              </span>
            </Title>
            <InfoRow icon={<IconMapPin  size={14} />} iconColor="text-orange-500" label="Area"   value={batch.area}     />
            <InfoRow icon={<IconBuilding size={14} />} iconColor="text-orange-500" label="Branch" value={batch.branch}   />
            <InfoRow icon={<IconCalendar size={14} />} iconColor="text-violet-500" label="Day"    value={batch.day}      />
            <InfoRow icon={<IconClock   size={14} />} iconColor="text-violet-500" label="Time"   value={batch.timeSlot} />
          </Paper>
        </Grid.Col>

        {/* Academic & Teacher */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Paper className="p-4 sm:p-5 h-full bg-white border border-slate-200 shadow-sm rounded-2xl">
            <Title order={5} mb="sm" className="!text-slate-800" style={{ fontSize: "clamp(13px,2vw,16px)" }}>
              <span className="flex items-center gap-2">
                <IconBook size={15} className="text-blue-600" />
                Academic & Teacher
              </span>
            </Title>
            <InfoRow icon={<IconBook  size={14} />} iconColor="text-blue-500"  label="Subject"  value={batch.subject}     />
            <InfoRow icon={<IconBook  size={14} />} iconColor="text-blue-500"  label="Standard" value={batch.standard}    />
            <InfoRow icon={<IconUser  size={14} />} iconColor="text-green-500" label="Teacher"  value={batch.teacherName} />
            <InfoRow
              icon={<IconUsers size={14} />} iconColor="text-green-500" label="Capacity"
              value={
                <div className="flex items-center gap-2.5">
                  <span>{batch.studentIds.length} / {batch.capacity}</span>
                  <div className="w-16 h-1.5 rounded-full overflow-hidden bg-slate-100">
                    <div className="h-full rounded-full" style={{ width: `${fillPct}%`, background: fillColor }} />
                  </div>
                </div>
              }
            />
          </Paper>
        </Grid.Col>
      </Grid>

      {/* ── Students ──────────────────────────────────────────────────── */}
      <Paper className="p-4 sm:p-5 bg-white border border-slate-200 shadow-sm rounded-2xl">
        <div className="flex items-center justify-between mb-4">
            <Title order={5} style={{ fontSize: "clamp(13px,2vw,16px)" }} className="!text-slate-800">
              <span className="flex items-center gap-2">
                <IconUsers size={15} className="text-blue-600" />
                Assigned Students
              </span>
            </Title>
            <Text size="xs" className="text-slate-500">
            {batch.studentIds.length} of {batch.capacity} seats filled
          </Text>
        </div>

        {(() => {
          const studentsList = batch.students && batch.students.length > 0
            ? batch.students
            : batch.studentIds.map((sid) => ({
                id: sid,
                name: `Student #${sid}`,
              }));

          if (studentsList.length === 0) {
            return (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 border border-slate-200">
                  <IconUsers size={20} className="text-slate-400" />
                </div>
                <Text size="sm" className="text-slate-500">No students assigned yet</Text>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {studentsList.map((st, idx) => (
                <Button
                  key={st.id}
                  onClick={() => navigate(`/Users/edit-student/${st.id}?mode=view`)}
                  className="!normal-case !text-left !justify-start flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all group w-full !bg-slate-50 hover:!bg-blue-50/50 !border !border-slate-200 hover:!border-blue-200 !text-slate-800"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-colors bg-slate-200 text-slate-700">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Text size="sm" fw={600} className="text-slate-800 truncate">
                      {st.name}
                    </Text>
                    {((st as any).rollNo || (st as any).contactNo || (st as any).standard) && (
                      <Text size="xs" className="text-slate-500 truncate">
                        {(st as any).rollNo ? `Roll: ${(st as any).rollNo}` : ""}
                        {(st as any).rollNo && ((st as any).contactNo || (st as any).standard) ? " · " : ""}
                        {typeof (st as any).standard === "object"
                          ? (st as any).standard?.name || ""
                          : (st as any).standard || (st as any).contactNo || ""}
                      </Text>
                    )}
                  </div>
                  <IconUser size={15} className="text-slate-400 shrink-0 group-hover:text-blue-600 transition-colors" />
                </Button>
              ))}
            </div>
          );
        })()}
      </Paper>

    </Stack>
  );
};

export default BatchDetail;