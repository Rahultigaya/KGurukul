// src/pages/admin/Master/Subject.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconBook,
  IconPlus,
  IconEdit,
  IconSearch,
  IconArrowLeft,
  IconCircleCheck,
  IconCircleX,
} from "@tabler/icons-react";
import { Modal, TextInput, ActionIcon, Group } from "@mantine/core";
import { useTheme } from "../../../context/ThemeContext";
import {
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  toggleSubjectActive,
  type Subject,
} from "./masterStore";

const Subject: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectName, setSubjectName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllSubjects();
      setSubjects(data);
    } catch (err: any) {
      console.error("Error loading subjects:", err);
      setError(err.message || "Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setSubjectName(subject.name);
      setIsActive(subject.is_active === 1);
    } else {
      setEditingSubject(null);
      setSubjectName("");
      setIsActive(true);
    }
    setNameError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
    setSubjectName("");
    setIsActive(true);
    setNameError("");
  };

  const handleSubmit = async () => {
    if (!subjectName.trim()) {
      setNameError("Subject name is required");
      return;
    }

    if (subjectName.trim().length < 2) {
      setNameError("Subject name must be at least 2 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (editingSubject) {
        await updateSubject(editingSubject.id, {
          name: subjectName.trim(),
          is_active: isActive ? 1 : 0,
        });
      } else {
        await createSubject({
          name: subjectName.trim(),
          is_active: isActive ? 1 : 0,
        });
      }

      await loadSubjects();
      handleCloseModal();
    } catch (err: any) {
      console.error("Error saving subject:", err);
      setError(err.message || "Failed to save subject");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        setLoading(true);
        setError("");
        await deleteSubject(id);
        await loadSubjects();
      } catch (err: any) {
        console.error("Error deleting subject:", err);
        setError(err.message || "Failed to delete subject");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleActive = async (id: string | number) => {
    try {
      setLoading(true);
      setError("");
      await toggleSubjectActive(id);
      await loadSubjects();
    } catch (err: any) {
      console.error("Error toggling subject status:", err);
      setError(err.message || "Failed to toggle subject status");
    } finally {
      setLoading(false);
    }
  };

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = subjects.filter((s) => s.is_active === 1).length;
  const totalCount = subjects.length;

  const StatCard = ({ icon, label, value, color }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
  }) => (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "var(--bg-tertiary)" }}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm opacity-60" style={{ color: "var(--text-secondary)" }}>{label}</p>
        <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6" style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/master")}
          className="p-2 rounded-lg transition-colors"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)" }}
        >
          <IconArrowLeft size={20} />
        </button>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--accent-purple)" }}>
          <IconBook size={28} className="text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            Subject Management
          </h1>
          <p className="text-sm opacity-60" style={{ color: "var(--text-secondary)" }}>
            Manage subjects for your branches
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          icon={<IconBook size={20} className="text-blue-400" />}
          label="Total Subjects"
          value={totalCount}
          color="text-blue-400"
        />
        <StatCard
          icon={<IconCircleCheck size={20} className="text-green-400" />}
          label="Active Subjects"
          value={`${activeCount} (${Math.round((activeCount / totalCount || 1) * 100)}%)`}
          color="text-green-400"
        />
      </div>

      {/* Actions Bar */}
      <div
        className="rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)" }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <IconSearch size={20} className="opacity-50" />
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none"
            style={{ color: "var(--text-primary)" }}
          />
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          style={{ background: "var(--accent-purple)", color: "white" }}
        >
          <IconPlus size={18} />
          Add Subject
        </button>
      </div>

      {/* Subjects List */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--border-default)" }}
      >
        {filteredSubjects.length === 0 ? (
          <div className="p-12 text-center" style={{ color: "var(--text-secondary)" }}>
            <IconBook size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold mb-2">No subjects found</p>
            <p className="text-sm opacity-60 mb-4">
              {searchQuery ? "Try a different search term" : "Get started by adding your first subject"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => handleOpenModal()}
                className="px-4 py-2 rounded-lg inline-flex items-center gap-2"
                style={{ background: "var(--accent-purple)", color: "white" }}
              >
                <IconPlus size={18} />
                Add First Subject
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border-default)" }}>
            {filteredSubjects.map((subject) => (
              <div
                key={subject.id}
                className="p-4 flex items-center gap-4 transition-colors hover:bg-white/5"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-500/15">
                  <IconBook size={24} className="text-blue-400" />
                </div>

                {/* Name & Status */}
                <div className="flex-1">
                  <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    {subject.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${subject.is_active === 1 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        }`}
                    >
                      {subject.is_active === 1 ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <Group gap="xs">
                  {/* <ActionIcon
                    variant="light"
                    color={subject.is_active === 1 ? "red" : "green"}
                    onClick={() => handleToggleActive(subject.id)}
                    title={subject.is_active === 1 ? "Deactivate" : "Activate"}
                  >
                    {subject.is_active === 1 ? <IconCircleX size={18} /> : <IconCircleCheck size={18} />}
                  </ActionIcon> */}
                  <ActionIcon
                    variant="light"
                    color="blue"
                    onClick={() => handleOpenModal(subject)}
                    title="Edit"
                  >
                    <IconEdit size={24} />
                  </ActionIcon>
                </Group>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        opened={isModalOpen}
        onClose={handleCloseModal}
        title={
          <span style={{
            color: isDark ? "#1e293b" : "#ffffff",
            fontWeight: 600,
            fontSize: "1.1rem"
          }}>
            {editingSubject ? "Edit Subject" : "Add New Subject"}
          </span>
        }
        centered
        styles={{
          content: {
            background: isDark ? "#1e293b" : "white",
          },
          header: {
            borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
            paddingBottom: "0.75rem",
          },
          title: {
            fontWeight: 600,
          },
          body: {
            padding: "1.5rem",
          },
        }}
      >
        <div className="space-y-4">
          {/* Subject Name */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>
              Subject Name *
            </label>
            <TextInput
              placeholder="Enter subject name (e.g., Mathematics, Science)"
              value={subjectName}
              onChange={(e) => {
                setSubjectName(e.target.value);
                setNameError("");
              }}
              error={nameError}
              styles={{
                input: {
                  background: "var(--bg-tertiary)",
                  borderColor: "var(--border-default)",
                  color: "var(--text-primary)",
                },
              }}
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                Active
              </span>
            </label>
          </div>

          {/* Actions */}
          <Group justify="flex-end" mt="md">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 rounded-lg transition-colors"
              style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg transition-colors"
              style={{ background: "var(--accent-purple)", color: "white" }}
            >
              {editingSubject ? "Update" : "Create"}
            </button>
          </Group>
        </div>
      </Modal>
    </div>
  );
};

export default Subject;