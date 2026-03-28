// src/pages/batches/BatchAssign.tsx
// Route: { path: "batches/:id/assign", element: <BatchAssign /> }

import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Stack, Paper, Title, Group, Text, Badge,
  ActionIcon, Tooltip, Avatar, TextInput, Divider,
} from "@mantine/core";
import {
  IconArrowLeft, IconSearch, IconUserPlus, IconUserMinus,
  IconUsers, IconUser, IconAlertCircle, IconCircleCheck, IconX,
} from "@tabler/icons-react";
import {
  getBatchById, getAllBatches, canAssignStudent,
  assignStudentToBatch, removeStudentFromBatch,
  BATCH_TYPE_META, BATCH_STATUS_META,
} from "./batchStore";
import { studentStore } from "../admin/Users/Student/studentStore";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getStudentName(id: string): string {
  const s = studentStore[id];
  if (!s) return `Student #${id}`;
  return `${s.firstName} ${s.surname}`;
}
function getStudentStandard(id: string): string { return studentStore[id]?.standard ?? "–"; }
function getStudentSubject(id: string): string { return studentStore[id]?.subject ?? "–"; }
function getInitials(id: string): string {
  const s = studentStore[id];
  if (!s) return id.slice(0, 2).toUpperCase();
  return `${s.firstName[0]}${s.surname[0]}`.toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// AssignedRow
// ─────────────────────────────────────────────────────────────────────────────

const AssignedRow: React.FC<{
  id: string; index: number; canRemove: boolean; onRemove: () => void;
}> = ({ id, index, canRemove, onRemove }) => (
  <Group gap="sm" px="xs" py="xs" className="rounded-xl transition-colors"
    style={{ borderBottom: "1px solid var(--border-default)" }}>
    <Avatar size="sm" radius="md" color="orange" variant="light"
      styles={{ root: { fontSize: 11, fontWeight: 700 } }}>
      {index + 1}
    </Avatar>
    <div style={{ flex: 1, minWidth: 0 }}>
      <Text size="sm" fw={500} style={{ color: "var(--text-primary)" }} truncate>
        {getStudentName(id)}
      </Text>
      <Text size="xs" style={{ color: "var(--text-muted)" }}>
        {getStudentStandard(id)} · {getStudentSubject(id)}
      </Text>
    </div>
    {canRemove && (
      <Tooltip label="Remove from batch" withArrow>
        <ActionIcon size="sm" variant="subtle" color="red" radius="md" onClick={onRemove}>
          <IconUserMinus size={14} />
        </ActionIcon>
      </Tooltip>
    )}
  </Group>
);

// ─────────────────────────────────────────────────────────────────────────────
// CandidateRow
// ─────────────────────────────────────────────────────────────────────────────

function getReasonTag(reason?: string): { label: string; color: string } {
  if (!reason) return { label: "", color: "gray" };
  if (reason.includes("already assigned")) return { label: "Already in batch", color: "gray" };
  if (reason.includes("full capacity")) return { label: "Batch full", color: "red" };
  if (reason.includes("inactive") || reason.includes("completed"))
    return { label: "Batch inactive", color: "yellow" };
  if (reason.includes("Regular batch")) return { label: "Regular conflict", color: "blue" };
  if (reason.includes("Backlog batch")) return { label: "Backlog conflict", color: "orange" };
  return { label: "Cannot assign", color: "red" };
}

const CandidateRow: React.FC<{
  id: string; eligible: boolean; reason?: string; onAssign: () => void;
}> = ({ id, eligible, reason, onAssign }) => {
  const tag = !eligible ? getReasonTag(reason) : null;
  return (
    <Group gap="sm" px="xs" py="xs" className="rounded-xl transition-colors"
      style={{ borderBottom: "1px solid var(--border-default)" }}>
      <Avatar size="sm" radius="md" color={eligible ? "blue" : "gray"} variant="light"
        styles={{ root: { fontSize: 10, fontWeight: 700 } }}>
        {getInitials(id)}
      </Avatar>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Group gap="xs" align="center">
          <Text size="sm" fw={500} truncate
            style={{ color: eligible ? "var(--text-primary)" : "var(--text-muted)" }}>
            {getStudentName(id)}
          </Text>
          {tag && (
            <Badge size="xs" color={tag.color} variant="light" radius="sm" style={{ flexShrink: 0 }}>
              {tag.label}
            </Badge>
          )}
        </Group>
        <Text size="xs" style={{ color: "var(--text-muted)" }}>
          {getStudentStandard(id)} · {getStudentSubject(id)}
        </Text>
        {!eligible && reason && (
          <Text size="xs" c="red.5" lineClamp={2} mt={1}>{reason}</Text>
        )}
      </div>
      <Tooltip label={eligible ? "Assign to batch" : (reason ?? "Cannot assign")} withArrow multiline w={240}>
        <ActionIcon size="sm" variant="light" color={eligible ? "green" : "gray"}
          radius="md" disabled={!eligible} onClick={onAssign}>
          <IconUserPlus size={14} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// BatchAssign
// ─────────────────────────────────────────────────────────────────────────────

const BatchAssign: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [, refresh] = useState(0);
  const rerender = () => refresh((n) => n + 1);

  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const batch = id ? getBatchById(id) : null;
  const allBatches = getAllBatches();

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const allStudentIds = Object.keys(studentStore);

  const candidates = useMemo(() => {
    const q = search.toLowerCase();
    return allStudentIds
      .filter((sid) => !batch?.studentIds.includes(sid))
      .filter((sid) => {
        if (!q) return true;
        return getStudentName(sid).toLowerCase().includes(q) ||
          getStudentStandard(sid).toLowerCase().includes(q) ||
          getStudentSubject(sid).toLowerCase().includes(q);
      })
      .map((sid) => {
        if (!batch) return { id: sid, eligible: false, reason: "Batch not found" };
        const result = canAssignStudent(sid, batch, allBatches);
        return { id: sid, eligible: result.ok, reason: result.ok ? undefined : result.reason };
      });
  }, [search, batch, allBatches, allStudentIds]);

  const handleAssign = (studentId: string) => {
    if (!id) return;
    const result = assignStudentToBatch(studentId, id);
    showToast(result.ok ? `${getStudentName(studentId)} assigned successfully.` : result.reason, result.ok);
    rerender();
  };

  const handleRemove = (studentId: string) => {
    if (!id) return;
    removeStudentFromBatch(studentId, id);
    showToast(`${getStudentName(studentId)} removed from batch.`, true);
    rerender();
  };

  if (!batch)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Text style={{ color: "var(--text-secondary)" }}>Batch not found.</Text>
        <button onClick={() => navigate("/batches")} className="flex items-center gap-1 text-sm"
          style={{ color: "var(--accent-orange)" }}>
          <IconArrowLeft size={15} /> Back to Batches
        </button>
      </div>
    );

  const typeMeta = BATCH_TYPE_META[batch.type];
  const statusMeta = BATCH_STATUS_META[batch.status];
  const fillPct = Math.min((batch.studentIds.length / batch.capacity) * 100, 100);
  const fillColor = batch.studentIds.length >= batch.capacity ? "#ef4444" : fillPct >= 80 ? "#f59e0b" : "#22c55e";
  const canEdit = batch.status === "Active";

  return (
    <Stack gap="md" maw={980} mx="auto" pb="xl" px={{ base: "xs", sm: 0 }}>

      {/* ── Toast ─────────────────────────────────────────────────────── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl ${toast.ok
            ? "bg-green-500/15 border-green-500/30 text-green-500"
            : "bg-red-500/15 border-red-500/30 text-red-400"
          }`}>
          {toast.ok ? <IconCircleCheck size={16} /> : <IconAlertCircle size={16} />}
          <span className="text-sm font-medium">{toast.msg}</span>
          <button onClick={() => setToast(null)}><IconX size={13} /></button>
        </div>
      )}

      {/* ── Header ────────────────────────────────────────────────────── */}
      <Group gap="sm">
        <Tooltip label="Back to Batch" position="right" withArrow>
          <ActionIcon variant="subtle" size="lg" radius="lg"
            onClick={() => navigate(`/batches`)}
            styles={{ root: { color: "var(--text-secondary)" } }}>
            <IconArrowLeft size={20} />
          </ActionIcon>
        </Tooltip>
        <div>
          <Title order={3} style={{ color: "var(--text-primary)" }}>Assign Students</Title>
          <Text size="xs" style={{ color: "var(--text-muted)" }}>{batch.name}</Text>
        </div>
      </Group>

      {/* ── Batch summary banner ───────────────────────────────────────── */}
      <Paper className="p-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)" }}>
        <Group justify="space-between" wrap="wrap" gap="md">
          <Group gap="sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `color-mix(in srgb, var(--accent-purple) 12%, transparent)` }}>
              <IconUsers size={18} style={{ color: "var(--accent-purple)" }} />
            </div>
            <div>
              <Group gap="xs" mb={4}>
                <Badge color={typeMeta.color} variant="light" size="xs">{batch.type}</Badge>
                <Badge color={statusMeta.color} variant="light" size="xs">{batch.status}</Badge>
                <Badge color="gray" variant="outline" size="xs">{batch.subject} · {batch.standard}</Badge>
              </Group>
              <Text size="sm" fw={600} style={{ color: "var(--text-primary)" }}>{batch.name}</Text>
              <Text size="xs" style={{ color: "var(--text-muted)" }}>
                {batch.teacherName} · {batch.day} · {batch.timeSlot}
              </Text>
            </div>
          </Group>

          {/* Capacity */}
          <div style={{ flexShrink: 0, textAlign: "right" }}>
            <Group gap={4} align="baseline" justify="flex-end">
              <Text fw={700} size="lg" style={{ color: "var(--text-primary)" }}>{batch.studentIds.length}</Text>
              <Text size="sm" style={{ color: "var(--text-muted)" }}>/ {batch.capacity}</Text>
            </Group>
            <div className="w-24 h-1.5 rounded-full overflow-hidden mt-1"
              style={{ background: "var(--bg-tertiary)" }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${fillPct}%`, background: fillColor }} />
            </div>
          </div>
        </Group>

        {/* Type rule hint */}
        <div className="mt-3 px-3 py-2 rounded-lg"
          style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-default)" }}>
          <Text size="xs" style={{ color: "var(--text-secondary)" }}>
            <span style={{ color: "var(--accent-orange)", fontWeight: 600 }}>{batch.type} Rule: </span>
            {typeMeta.description}
          </Text>
        </div>

        {!canEdit && (
          <div className="mt-2 px-3 py-2 rounded-lg"
            style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.25)" }}>
            <Text size="xs" c="yellow.6">
              This batch is <strong>{batch.status}</strong> — student assignments are locked.
            </Text>
          </div>
        )}
      </Paper>

      {/* ── Error legend ───────────────────────────────────────────────── */}
      <Paper className="px-4 py-3"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)" }}>
        <Group gap="xs" wrap="wrap">
          <Text size="xs" fw={600} style={{ color: "var(--text-muted)", marginRight: 4 }}>
            Blocked reasons:
          </Text>
          {[
            { label: "Already in batch", color: "gray", desc: "Student is already assigned to this exact batch" },
            { label: "Batch full", color: "red", desc: "Batch has reached maximum capacity" },
            { label: "Regular conflict", color: "blue", desc: "Student already has a Regular batch for the same subject" },
            { label: "Backlog conflict", color: "orange", desc: "Student already has a Backlog batch for same subject+standard" },
            { label: "Batch inactive", color: "yellow", desc: "Batch is Inactive or Completed — assignments are locked" },
          ].map((item) => (
            <Tooltip key={item.label} label={item.desc} withArrow multiline w={220}>
              <Badge size="sm" color={item.color} variant="light" radius="sm" style={{ cursor: "help" }}>
                {item.label}
              </Badge>
            </Tooltip>
          ))}
        </Group>
      </Paper>

      {/* ── Two panels ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* LEFT — Assigned */}
        <Paper className="p-4"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)" }}>
          <Group justify="space-between" mb="xs">
            <Group gap="xs">
              <div className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{ background: "rgba(124,58,237,0.12)" }}>
                <IconUsers size={13} style={{ color: "var(--accent-purple)" }} />
              </div>
              <Title order={6} style={{ color: "var(--text-accent)" }}>Assigned Students</Title>
            </Group>
            <Badge color={batch.studentIds.length >= batch.capacity ? "red" : "green"}
              variant="light" size="sm" radius="xl">
              {batch.studentIds.length} / {batch.capacity}
            </Badge>
          </Group>
          <Divider mb="xs" style={{ borderColor: "var(--border-default)" }} />

          {batch.studentIds.length === 0 ? (
            <Stack align="center" py="xl" gap="sm">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-default)" }}>
                <IconUsers size={20} style={{ color: "var(--text-muted)" }} />
              </div>
              <Text size="sm" style={{ color: "var(--text-muted)" }}>No students assigned yet</Text>
            </Stack>
          ) : (
            <Stack gap={0} style={{ maxHeight: 380, overflowY: "auto" }}>
              {batch.studentIds.map((sid, idx) => (
                <AssignedRow key={sid} id={sid} index={idx}
                  canRemove={canEdit} onRemove={() => handleRemove(sid)} />
              ))}
            </Stack>
          )}
        </Paper>

        {/* RIGHT — All Students */}
        <Paper className="p-4"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)" }}>
          <Group gap="xs" mb="xs">
            <div className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: "rgba(59,130,246,0.12)" }}>
              <IconUser size={13} style={{ color: "#3b82f6" }} />
            </div>
            <Title order={6} style={{ color: "var(--text-accent)" }}>All Students</Title>
          </Group>
          <Divider mb="xs" style={{ borderColor: "var(--border-default)" }} />

          <TextInput
            placeholder="Search by name, standard, subject…"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.currentTarget.value)}
            leftSection={<IconSearch size={14} style={{ color: "var(--text-muted)" }} />}
            rightSection={search ? (
              <ActionIcon size="xs" variant="subtle" color="gray" onClick={() => setSearch("")}>
                <IconX size={12} />
              </ActionIcon>
            ) : null}
            mb="xs"
            styles={{
              input: { backgroundColor: "var(--bg-input)", border: "1px solid var(--border-default)", color: "var(--text-primary)", borderRadius: "10px", fontSize: "13px" },
              section: { color: "var(--text-muted)" },
              placeholder: { color: "var(--text-muted)" },
            }}
          />

          {candidates.length === 0 ? (
            <Stack align="center" py="lg" gap="sm">
              <Text size="sm" style={{ color: "var(--text-muted)" }}>No students found</Text>
            </Stack>
          ) : (
            <Stack gap={0} style={{ maxHeight: 380, overflowY: "auto" }}>
              {candidates.map(({ id: sid, eligible, reason }) => (
                <CandidateRow key={sid} id={sid}
                  eligible={eligible && canEdit}
                  reason={!canEdit ? "Batch is not active" : reason}
                  onAssign={() => handleAssign(sid)} />
              ))}
            </Stack>
          )}
        </Paper>

      </div>
    </Stack>
  );
};

export default BatchAssign;