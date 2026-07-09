// src/pages/admin/Master/Area.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconBuildingFactory,
  IconPlus,
  IconEdit,
  IconSearch,
  IconArrowLeft,
  IconCircleCheck,
} from "@tabler/icons-react";
import { Modal, TextInput, ActionIcon, Group } from "@mantine/core";
import { useTheme } from "../../../context/ThemeContext";
import {
  getAllAreas,
  createArea,
  updateArea,
  type Area,
} from "./masterStore";

const AreaPage: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [areas, setAreas] = useState<Area[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [areaName, setAreaName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [nameError, setNameError] = useState("");
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState("");

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllAreas();
      setAreas(data);
    } catch (err: any) {
      console.error("Error loading areas:", err);
      setError(err.message || "Failed to load areas");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (area?: Area) => {
    if (area) {
      setEditingArea(area);
      setAreaName(area.name);
      setIsActive(area.is_active === 1); // Convert number to boolean
    } else {
      setEditingArea(null);
      setAreaName("");
      setIsActive(true);
    }
    setNameError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingArea(null);
    setAreaName("");
    setIsActive(true);
    setNameError("");
  };

  const handleSubmit = async () => {
    // Validation
    if (!areaName.trim()) {
      setNameError("Area name is required");
      return;
    }

    if (areaName.trim().length < 2) {
      setNameError("Area name must be at least 2 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (editingArea) {
        // Update existing area
        await updateArea(editingArea.id, {
          name: areaName.trim(),
          is_active: isActive ? 1 : 0, // Convert boolean to number
        });
      } else {
        // Create new area
        await createArea({
          name: areaName.trim(),
          is_active: isActive ? 1 : 0, // Convert boolean to number
        });
      }

      await loadAreas();
      handleCloseModal();
    } catch (err: any) {
      console.error("Error saving area:", err);
      setError(err.message || "Failed to save area");
    } finally {
      setLoading(false);
    }
  };

  const filteredAreas = areas.filter(
    (area) =>
      area.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = areas.filter((a) => a.is_active === 1).length;
  const totalCount = areas.length;

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
          <IconBuildingFactory size={28} className="text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            Area Management
          </h1>
          <p className="text-sm opacity-60" style={{ color: "var(--text-secondary)" }}>
            Manage geographic areas for your branches
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          icon={<IconBuildingFactory size={20} className="text-blue-400" />}
          label="Total Areas"
          value={totalCount}
          color="text-blue-400"
        />
        <StatCard
          icon={<IconCircleCheck size={20} className="text-green-400" />}
          label="Active Areas"
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
            placeholder="Search areas..."
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
          Add Area
        </button>
      </div>

      {/* Areas List */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--border-default)" }}
      >
        {filteredAreas.length === 0 ? (
          <div className="p-12 text-center" style={{ color: "var(--text-secondary)" }}>
            <IconBuildingFactory size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold mb-2">No areas found</p>
            <p className="text-sm opacity-60 mb-4">
              {searchQuery ? "Try a different search term" : "Get started by adding your first area"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => handleOpenModal()}
                className="px-4 py-2 rounded-lg inline-flex items-center gap-2"
                style={{ background: "var(--accent-purple)", color: "white" }}
              >
                <IconPlus size={18} />
                Add First Area
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border-default)" }}>
            {filteredAreas.map((area) => (
              <div
                key={area.id}
                className="p-4 flex items-center gap-4 transition-colors hover:bg-white/5"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-500/15">
                  <IconBuildingFactory size={24} className="text-blue-400" />
                </div>

                {/* Name & Status */}
                <div className="flex-1">
                  <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    {area.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${area.is_active === 1 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        }`}
                    >
                      {area.is_active === 1 ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <Group gap="xs">
                  {/* <ActionIcon
                    variant="light"
                    color={area.is_active === 1 ? "red" : "green"}
                    onClick={() => handleToggleActive(area.id)}
                    title={area.is_active === 1 ? "Deactivate" : "Activate"}
                  >
                    {area.is_active === 1 ? <IconCircleX size={18} /> : <IconCircleCheck size={18} />}
                  </ActionIcon> */}
                  <ActionIcon
                    variant="light"
                    color="blue"
                    onClick={() => handleOpenModal(area)}
                    title="Edit"
                  >
                    <IconEdit size={24} />
                  </ActionIcon>
                  {/* <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => handleDelete(area.id, area.name)}
                    title="Delete"
                  >
                    <IconTrash size={18} />
                  </ActionIcon> */}
                  {/* <ActionIcon
                    variant="light"
                    color="violet"
                    onClick={() => navigate(`/master/branch?areaId=${area.id}`)}
                    title="View Branches"
                  >
                    <IconChevronRight size={18} />
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
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "1.1rem"
          }}>
            {editingArea ? "Edit Area" : "Add New Area"}
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
          {/* Area Name */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>
              Area Name *
            </label>
            <TextInput
              placeholder="Enter area name (e.g., Thane, Mulund)"
              value={areaName}
              onChange={(e) => {
                setAreaName(e.target.value);
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
              {editingArea ? "Update" : "Create"}
            </button>
          </Group>
        </div>
      </Modal>
    </div>
  );
};

export default AreaPage;
