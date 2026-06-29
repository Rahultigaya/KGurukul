// src/pages/admin/Master/Standard.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconBooks,
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconArrowLeft,
  IconCircleCheck,
  IconCircleX,
} from "@tabler/icons-react";
import { Modal, TextInput, ActionIcon, Group } from "@mantine/core";
import { useTheme } from "../../../context/ThemeContext";
import {
  getAllStandards,
  createStandard,
  updateStandard,
  deleteStandard,
  toggleStandardActive,
  type Standard,
} from "./masterStore";

const Standard: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [standards, setStandards] = useState<Standard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStandard, setEditingStandard] = useState<Standard | null>(null);
  const [standardName, setStandardName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStandards();
  }, []);

  const loadStandards = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllStandards();
      setStandards(data);
    } catch (err: any) {
      console.error("Error loading standards:", err);
      setError(err.message || "Failed to load standards");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (standard?: Standard) => {
    if (standard) {
      setEditingStandard(standard);
      setStandardName(standard.name);
      setIsActive(standard.is_active === 1); // Convert number to boolean
    } else {
      setEditingStandard(null);
      setStandardName("");
      setIsActive(true);
    }
    setNameError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStandard(null);
    setStandardName("");
    setIsActive(true);
    setNameError("");
  };

  const handleSubmit = async () => {
    // Validation
    if (!standardName.trim()) {
      setNameError("Standard name is required");
      return;
    }

    if (standardName.trim().length < 2) {
      setNameError("Standard name must be at least 2 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (editingStandard) {
        // Update existing standard
        await updateStandard(editingStandard.id, {
          name: standardName.trim(),
          is_active: isActive ? 1 : 0, // Convert boolean to number
        });
      } else {
        // Create new standard
        await createStandard({
          name: standardName.trim(),
          is_active: isActive ? 1 : 0, // Convert boolean to number
        });
      }

      await loadStandards();
      handleCloseModal();
    } catch (err: any) {
      console.error("Error saving standard:", err);
      setError(err.message || "Failed to save standard");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        setLoading(true);
        setError("");
        await deleteStandard(id);
        await loadStandards();
      } catch (err: any) {
        console.error("Error deleting standard:", err);
        setError(err.message || "Failed to delete standard");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleActive = async (id: string | number) => {
    try {
      setLoading(true);
      setError("");
      await toggleStandardActive(id);
      await loadStandards();
    } catch (err: any) {
      console.error("Error toggling standard status:", err);
      setError(err.message || "Failed to toggle standard status");
    } finally {
      setLoading(false);
    }
  };

  const filteredStandards = standards.filter(
    (standard) =>
      standard.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = standards.filter((s) => s.is_active === 1).length;
  const totalCount = standards.length;

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
          <IconBooks size={28} className="text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            Standard Management
          </h1>
          <p className="text-sm opacity-60" style={{ color: "var(--text-secondary)" }}>
            Manage educational standards and grades
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          icon={<IconBooks size={20} className="text-orange-400" />}
          label="Total Standards"
          value={totalCount}
          color="text-orange-400"
        />
        <StatCard
          icon={<IconCircleCheck size={20} className="text-green-400" />}
          label="Active Standards"
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
            placeholder="Search standards..."
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
          Add Standard
        </button>
      </div>

      {/* Standards List */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--border-default)" }}
      >
        {filteredStandards.length === 0 ? (
          <div className="p-12 text-center" style={{ color: "var(--text-secondary)" }}>
            <IconBooks size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold mb-2">No standards found</p>
            <p className="text-sm opacity-60 mb-4">
              {searchQuery ? "Try a different search term" : "Get started by adding your first standard"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => handleOpenModal()}
                className="px-4 py-2 rounded-lg inline-flex items-center gap-2"
                style={{ background: "var(--accent-purple)", color: "white" }}
              >
                <IconPlus size={18} />
                Add First Standard
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border-default)" }}>
            {filteredStandards.map((standard) => (
              <div
                key={standard.id}
                className="p-4 flex items-center gap-4 transition-colors hover:bg-white/5"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-500/15">
                  <IconBooks size={24} className="text-orange-400" />
                </div>

                {/* Name & Status */}
                <div className="flex-1">
                  <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    {standard.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        standard.is_active === 1 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {standard.is_active === 1 ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <Group gap="xs">
                  {/* <ActionIcon
                    variant="light"
                    color={standard.is_active === 1 ? "red" : "green"}
                    onClick={() => handleToggleActive(standard.id)}
                    title={standard.is_active === 1 ? "Deactivate" : "Activate"}
                  >
                    {standard.is_active === 1 ? <IconCircleX size={18} /> : <IconCircleCheck size={18} />}
                  </ActionIcon> */}
                  <ActionIcon
                    variant="light"
                    color="blue"
                    onClick={() => handleOpenModal(standard)}
                    title="Edit"
                  >
                    <IconEdit size={24} />
                  </ActionIcon>
                  {/* <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => handleDelete(standard.id, standard.name)}
                    title="Delete"
                  >
                    <IconTrash size={18} />
                  </ActionIcon> */}
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
            color: isDark ?  "#1e293b" :"#ffffff",
            fontWeight: 600,
            fontSize: "1.1rem"
          }}>
            {editingStandard ? "Edit Standard" : "Add New Standard"}
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
          {/* Standard Name */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>
              Standard Name *
            </label>
            <TextInput
              placeholder="Enter standard name (e.g., 8th Standard)"
              value={standardName}
              onChange={(e) => {
                setStandardName(e.target.value);
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
              {editingStandard ? "Update" : "Create"}
            </button>
          </Group>
        </div>
      </Modal>
    </div>
  );
};

export default Standard;
