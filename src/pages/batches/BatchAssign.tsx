// src/pages/batches/BatchAssign.tsx
// Route: { path: "batches/:id/assign", element: <BatchAssign /> }

import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ActionIcon,
  Tooltip,
  Badge,
  Card,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Divider,
  Avatar,
  TextInput,
  Progress,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconSearch,
  IconUserPlus,
  IconUserMinus,
  IconUsers,
  IconUser,
  IconAlertCircle,
  IconCircleCheck,
  IconX,
} from "@tabler/icons-react";
import {
  getBatchById,
  getAllBatches,
  canAssignStudent,
  assignStudentToBatch,
  removeStudentFromBatch,
  BATCH_TYPE_META,
  BATCH_STATUS_META,
} from "./batchStore";
import { studentStore } from "../admin/Users/Student/studentStore";

// ── helpers ───────────────────────────────────────────────────────────────────

function getStudentName(id: string): string {
  const s = studentStore[id];
  if (!s) return `Student #${id}`;
  return `${s.firstName} ${s.surname}`;
}

function getStudentStandard(id: string): string {
  return studentStore[id]?.standard ?? "–";
}

function getStudentSubject(id: string): string {
  return studentStore[id]?.subject ?? "–";
}

function getInitials(id: string): string {
  const s = studentStore[id];
  if (!s) return id.slice(0, 2).toUpperCase();
  return `${s.firstName[0]}${s.surname[0]}`.toUpperCase();
}

// ── StudentRow — assigned list ────────────────────────────────────────────────

const AssignedRow: React.FC<{
  id: string;
  index: number;
  canRemove: boolean;
  onRemove: () => void;
}> = ({ id, index, canRemove, onRemove }) => (
  <Group
    gap="sm"
    px="sm"
    py="xs"
    style={{ borderBottom: "1px solid rgba(71,85,105,0.3)" }}
    className="last:border-0 group hover:bg-slate-800/30 rounded-xl transition-colors"
  >
    <Avatar
      size="sm"
      radius="md"
      color="orange"
      variant="light"
      styles={{ root: { fontSize: 11, fontWeight: 700 } }}
    >
      {index + 1}
    </Avatar>
    <div style={{ flex: 1, minWidth: 0 }}>
      <Text size="sm" fw={500} c="white" truncate>
        {getStudentName(id)}
      </Text>
      <Text size="xs" c="dimmed">
        {getStudentStandard(id)} · {getStudentSubject(id)}
      </Text>
    </div>
    {canRemove && (
      <Tooltip label="Remove from batch" withArrow>
        <ActionIcon
          size="sm"
          variant="subtle"
          color="red"
          radius="md"
          onClick={onRemove}
        >
          <IconUserMinus size={14} />
        </ActionIcon>
      </Tooltip>
    )}
  </Group>
);

// ── CandidateRow — available to add ──────────────────────────────────────────

function getReasonTag(reason?: string): { label: string; color: string } {
  if (!reason) return { label: "", color: "gray" };
  if (reason.includes("already assigned"))
    return { label: "Already in batch", color: "gray" };
  if (reason.includes("full capacity"))
    return { label: "Batch full", color: "red" };
  if (reason.includes("inactive") || reason.includes("completed"))
    return { label: "Batch inactive", color: "yellow" };
  if (reason.includes("Regular batch"))
    return { label: "Regular conflict", color: "blue" };
  if (reason.includes("Backlog batch"))
    return { label: "Backlog conflict", color: "orange" };
  return { label: "Cannot assign", color: "red" };
}

const CandidateRow: React.FC<{
  id: string;
  eligible: boolean;
  reason?: string;
  onAssign: () => void;
}> = ({ id, eligible, reason, onAssign }) => {
  const tag = !eligible ? getReasonTag(reason) : null;
  return (
    <Group
      gap="sm"
      px="sm"
      py="xs"
      style={{ borderBottom: "1px solid rgba(71,85,105,0.3)" }}
      className="last:border-0 hover:bg-slate-800/30 rounded-xl transition-colors"
    >
      <Avatar
        size="sm"
        radius="md"
        color={eligible ? "blue" : "gray"}
        variant="light"
        styles={{ root: { fontSize: 10, fontWeight: 700 } }}
      >
        {getInitials(id)}
      </Avatar>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Group gap="xs" align="center">
          <Text size="sm" fw={500} c={eligible ? "white" : "dimmed"} truncate>
            {getStudentName(id)}
          </Text>
          {tag && (
            <Badge
              size="xs"
              color={tag.color}
              variant="light"
              radius="sm"
              style={{ flexShrink: 0 }}
            >
              {tag.label}
            </Badge>
          )}
        </Group>
        <Text size="xs" c="dimmed">
          {getStudentStandard(id)} · {getStudentSubject(id)}
        </Text>
        {!eligible && reason && (
          <Text size="xs" c="red.4" style={{ marginTop: 1 }} lineClamp={2}>
            {reason}
          </Text>
        )}
      </div>
      <Tooltip
        label={eligible ? "Assign to batch" : (reason ?? "Cannot assign")}
        withArrow
        multiline
        w={240}
      >
        <ActionIcon
          size="sm"
          variant="light"
          color={eligible ? "green" : "gray"}
          radius="md"
          disabled={!eligible}
          onClick={onAssign}
        >
          <IconUserPlus size={14} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};

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

  // Students NOT yet in this batch
  const candidates = useMemo(() => {
    const q = search.toLowerCase();
    return allStudentIds
      .filter((sid) => !batch?.studentIds.includes(sid))
      .filter((sid) => {
        if (!q) return true;
        return (
          getStudentName(sid).toLowerCase().includes(q) ||
          getStudentStandard(sid).toLowerCase().includes(q) ||
          getStudentSubject(sid).toLowerCase().includes(q)
        );
      })
      .map((sid) => {
        if (!batch)
          return { id: sid, eligible: false, reason: "Batch not found" };
        const result = canAssignStudent(sid, batch, allBatches);
        return {
          id: sid,
          eligible: result.ok,
          reason: result.ok ? undefined : result.reason,
        };
      });
  }, [search, batch, allBatches, allStudentIds]);

  const handleAssign = (studentId: string) => {
    if (!id) return;
    const result = assignStudentToBatch(studentId, id);
    if (result.ok) {
      showToast(`${getStudentName(studentId)} assigned successfully.`, true);
    } else {
      showToast(result.reason, false);
    }
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
        <Text c="dimmed">Batch not found.</Text>
        <button
          onClick={() => navigate("/batches")}
          className="text-orange-400 text-sm flex items-center gap-1"
        >
          <IconArrowLeft size={15} /> Back to Batches
        </button>
      </div>
    );

  const typeMeta = BATCH_TYPE_META[batch.type];
  const statusMeta = BATCH_STATUS_META[batch.status];
  const fillPct = Math.min(
    (batch.studentIds.length / batch.capacity) * 100,
    100,
  );
  const fillColor =
    batch.studentIds.length >= batch.capacity
      ? "red"
      : fillPct >= 80
        ? "yellow"
        : "green";
  const canEdit = batch.status === "Active";

  return (
    <Stack gap="md" maw={960} mx="auto" pb="xl" px={{ base: "xs", sm: "md" }}>
      {/* ── Toast ──────────────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl transition-all ${
            toast.ok
              ? "bg-green-500/15 border-green-500/30 text-green-400"
              : "bg-red-500/15 border-red-500/30 text-red-400"
          }`}
        >
          {toast.ok ? (
            <IconCircleCheck size={16} />
          ) : (
            <IconAlertCircle size={16} />
          )}
          <span className="text-sm font-medium">{toast.msg}</span>
          <button onClick={() => setToast(null)}>
            <IconX size={13} />
          </button>
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────────── */}
      <Group justify="space-between">
        <Group gap="sm">
          <Tooltip label="Back to Batch" position="right" withArrow>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              radius="lg"
              onClick={() => navigate(`/batches/${id}`)}
              styles={{ root: { color: "#94a3b8" } }}
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
          </Tooltip>
          <div>
            <Text size="xl" fw={700} c="white">
              Assign Students
            </Text>
            <Text size="xs" c="dimmed">
              {batch.name}
            </Text>
          </div>
        </Group>
      </Group>

      {/* ── Batch summary banner ───────────────────────────────────── */}
      <Card
        radius="xl"
        p="md"
        style={{
          background: "rgba(30,41,59,0.5)",
          border: "1px solid rgba(71,85,105,0.5)",
        }}
      >
        <Group justify="space-between" wrap="wrap" gap="md">
          <Group gap="sm">
            <ThemeIcon
              size={40}
              radius="xl"
              variant="light"
              color={typeMeta.color}
            >
              <IconUsers size={18} />
            </ThemeIcon>
            <div>
              <Group gap="xs" mb={2}>
                <Badge color={typeMeta.color} variant="light" size="xs">
                  {batch.type}
                </Badge>
                <Badge color={statusMeta.color} variant="light" size="xs">
                  {batch.status}
                </Badge>
                <Badge color="gray" variant="outline" size="xs">
                  {batch.subject} · {batch.standard}
                </Badge>
              </Group>
              <Text size="sm" fw={600} c="white">
                {batch.name}
              </Text>
              <Text size="xs" c="dimmed">
                {batch.teacherName} · {batch.day} · {batch.timeSlot}
              </Text>
            </div>
          </Group>
          <Stack gap={4} align="flex-end" style={{ flexShrink: 0 }}>
            <Group gap={4} align="baseline">
              <Text fw={700} size="lg" c="white">
                {batch.studentIds.length}
              </Text>
              <Text size="sm" c="dimmed">
                / {batch.capacity}
              </Text>
            </Group>
            <Progress
              value={fillPct}
              color={fillColor}
              size="sm"
              radius="xl"
              w={100}
              styles={{ root: { backgroundColor: "rgba(71,85,105,0.4)" } }}
            />
          </Stack>
        </Group>

        {/* Type rule hint */}
        <div className="mt-3 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/40">
          <Text size="xs" c="dimmed">
            <span className={`font-semibold text-${typeMeta.color}-400`}>
              {batch.type} Rule:{" "}
            </span>
            {typeMeta.description}
          </Text>
        </div>

        {!canEdit && (
          <div className="mt-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/25">
            <Text size="xs" c="yellow.4">
              This batch is <strong>{batch.status}</strong> — student
              assignments are locked.
            </Text>
          </div>
        )}
      </Card>

      {/* ── Two panels ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* LEFT — Assigned students */}
        <Card
          radius="xl"
          p="lg"
          style={{
            background: "rgba(71,85,105,0.25)",
            border: "1px solid rgba(139,92,246,0.3)",
          }}
        >
          <Group justify="space-between" mb="sm">
            <Group gap="xs">
              <ThemeIcon size="sm" variant="light" color="grape" radius="md">
                <IconUsers size={13} />
              </ThemeIcon>
              <Text size="sm" fw={600} c="grape.3">
                Assigned Students
              </Text>
            </Group>
            <Badge color={fillColor} variant="light" size="sm" radius="xl">
              {batch.studentIds.length} / {batch.capacity}
            </Badge>
          </Group>
          <Divider color="rgba(71,85,105,0.4)" mb="xs" />

          {batch.studentIds.length === 0 ? (
            <Stack align="center" py="xl" gap="sm">
              <ThemeIcon size={44} radius="xl" variant="light" color="gray">
                <IconUsers size={20} />
              </ThemeIcon>
              <Text size="sm" c="dimmed">
                No students assigned yet
              </Text>
            </Stack>
          ) : (
            <Stack gap={0}>
              {batch.studentIds.map((sid, idx) => (
                <AssignedRow
                  key={sid}
                  id={sid}
                  index={idx}
                  canRemove={canEdit}
                  onRemove={() => handleRemove(sid)}
                />
              ))}
            </Stack>
          )}
        </Card>

        {/* RIGHT — Available students */}
        <Card
          radius="xl"
          p="lg"
          style={{
            background: "rgba(71,85,105,0.25)",
            border: "1px solid rgba(139,92,246,0.3)",
          }}
        >
          <Group gap="xs" mb="sm">
            <ThemeIcon size="sm" variant="light" color="blue" radius="md">
              <IconUser size={13} />
            </ThemeIcon>
            <Text size="sm" fw={600} c="blue.3">
              All Students
            </Text>
          </Group>
          <Divider color="rgba(71,85,105,0.4)" mb="xs" />

          <TextInput
            placeholder="Search by name, standard, subject…"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.currentTarget.value)
            }
            leftSection={<IconSearch size={14} className="text-slate-500" />}
            rightSection={
              search ? (
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  color="gray"
                  onClick={() => setSearch("")}
                >
                  <IconX size={12} />
                </ActionIcon>
              ) : null
            }
            mb="xs"
            styles={{
              input: {
                backgroundColor: "rgba(30,41,59,0.8)",
                border: "1px solid rgba(71,85,105,0.5)",
                color: "white",
                borderRadius: "10px",
                fontSize: "13px",
              },
              section: { color: "#94a3b8" },
            }}
          />

          {candidates.length === 0 ? (
            <Stack align="center" py="lg" gap="sm">
              <Text size="sm" c="dimmed">
                No students found
              </Text>
            </Stack>
          ) : (
            <Stack gap={0} style={{ maxHeight: 380, overflowY: "auto" }}>
              {candidates.map(({ id: sid, eligible, reason }) => (
                <CandidateRow
                  key={sid}
                  id={sid}
                  eligible={eligible && canEdit}
                  reason={!canEdit ? "Batch is not active" : reason}
                  onAssign={() => handleAssign(sid)}
                />
              ))}
            </Stack>
          )}
        </Card>
      </div>
    </Stack>
  );
};

export default BatchAssign;
