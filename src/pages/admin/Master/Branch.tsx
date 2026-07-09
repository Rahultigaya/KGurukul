// src/pages/admin/Master/Branch.tsx

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  IconBuilding,
  IconPlus,
  IconEdit,
  IconSearch,
  IconArrowLeft,
  IconCircleCheck,
  IconFilter,
} from "@tabler/icons-react";
import { Modal, TextInput, Select, ActionIcon, Group } from "@mantine/core";
import { useTheme } from "../../../context/ThemeContext";
import {
  getAllAreas,
  getAllBranches,
  getBranchesByArea,
  createBranch,
  updateBranch,
  type Branch,
  type Area,
} from "./masterStore";

const BranchPage: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedAreaId = searchParams.get("areaId");

  const [branches, setBranches] = useState<Branch[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>(preselectedAreaId || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [branchName, setBranchName] = useState("");
  const [areaId, setAreaId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [nameError, setNameError] = useState("");
  const [areaError, setAreaError] = useState("");
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState("");

  useEffect(() => {
    loadAreas();
    loadBranches();
  }, [selectedArea]);

  const loadAreas = async () => {
    try {
      const data = await getAllAreas();
      setAreas(data);
    } catch (err: any) {
      console.error("Error loading areas:", err);
    }
  };

  const loadBranches = async () => {
    try {
      setLoading(true);
      setError("");
      let data;
      if (selectedArea) {
        data = await getBranchesByArea(selectedArea);
      } else {
        data = await getAllBranches();
      }
      setBranches(data);
    } catch (err: any) {
      console.error("Error loading branches:", err);
      setError(err.message || "Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (branch?: Branch) => {
    if (branch) {
      setEditingBranch(branch);
      setBranchName(branch.name);
      setAreaId(String(branch.area_id));
      setIsActive(branch.is_active === 1); // Convert number to boolean
    } else {
      setEditingBranch(null);
      setBranchName("");
      setAreaId(selectedArea || "");
      setIsActive(true);
    }
    setNameError("");
    setAreaError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBranch(null);
    setBranchName("");
    setAreaId("");
    setIsActive(true);
    setNameError("");
    setAreaError("");
  };

  const handleSubmit = async () => {
    // Validation
    let isValid = true;

    if (!branchName.trim()) {
      setNameError("Branch name is required");
      isValid = false;
    } else if (branchName.trim().length < 2) {
      setNameError("Branch name must be at least 2 characters");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!areaId) {
      setAreaError("Please select an area");
      isValid = false;
    } else {
      setAreaError("");
    }

    if (!isValid) return;

    try {
      setLoading(true);
      setError("");

      if (editingBranch) {
        // Update existing branch
        await updateBranch(editingBranch.id, {
          name: branchName.trim(),
          area_id: areaId,
          is_active: isActive ? 1 : 0, // Convert boolean to number
        });
      } else {
        // Create new branch
        await createBranch({
          name: branchName.trim(),
          area_id: areaId,
          is_active: isActive ? 1 : 0, // Convert boolean to number
        });
      }

      await loadBranches();
      handleCloseModal();
    } catch (err: any) {
      console.error("Error saving branch:", err);
      setError(err.message || "Failed to save branch");
    } finally {
      setLoading(false);
    }
  };

  const handleAreaFilterChange = (value: string) => {
    setSelectedArea(value);
  };

  const filteredBranches = branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (branch.area_name && branch.area_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeCount = branches.filter((b) => b.is_active === 1).length;
  const totalCount = branches.length;

  const areaOptions = areas
    .filter((area) => area.is_active === 1) // Only show active areas
    .map((area) => ({
      value: String(area.id),
      label: area.name,
    }));

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
          <IconBuilding size={28} className="text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            Branch Management
          </h1>
          <p className="text-sm opacity-60" style={{ color: "var(--text-secondary)" }}>
            Manage branches within your areas
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          icon={<IconBuilding size={20} className="text-violet-400" />}
          label="Total Branches"
          value={totalCount}
          color="text-violet-400"
        />
        <StatCard
          icon={<IconCircleCheck size={20} className="text-green-400" />}
          label="Active Branches"
          value={`${activeCount} (${Math.round((activeCount / totalCount || 1) * 100)}%)`}
          color="text-green-400"
        />
      </div>

      {/* Actions Bar */}
      <div
        className="rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)" }}
      >
        <div className="flex flex-wrap gap-4 items-center flex-1">
          {/* Search */}
          <div className="flex items-center gap-2 min-w-[200px]">
            <IconSearch size={20} className="opacity-50" />
            <input
              type="text"
              placeholder="Search branches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none"
              style={{ color: "var(--text-primary)" }}
            />
          </div>

          {/* Area Filter */}
          <div className="flex items-center gap-2">
            <IconFilter size={20} className="opacity-50" />
            <Select
              placeholder="All Areas"
              value={selectedArea}
              onChange={(value) => handleAreaFilterChange(value || "")}
              data={[
                { value: "", label: "All Areas" },
                ...areaOptions
              ]}
              styles={{
                input: {
                  background: "var(--bg-tertiary)",
                  borderColor: "var(--border-default)",
                  color: "var(--text-primary)",
                  minWidth: 150,
                },
              }}
              clearable
            />
          </div>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          style={{ background: "var(--accent-purple)", color: "white" }}
        >
          <IconPlus size={18} />
          Add Branch
        </button>
      </div>

      {/* Branches List */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--border-default)" }}
      >
        {filteredBranches.length === 0 ? (
          <div className="p-12 text-center" style={{ color: "var(--text-secondary)" }}>
            <IconBuilding size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold mb-2">No branches found</p>
            <p className="text-sm opacity-60 mb-4">
              {searchQuery || selectedArea
                ? "Try different filters or search terms"
                : "Get started by adding your first branch"}
            </p>
            {!(searchQuery || selectedArea) && (
              <button
                onClick={() => handleOpenModal()}
                className="px-4 py-2 rounded-lg inline-flex items-center gap-2"
                style={{ background: "var(--accent-purple)", color: "white" }}
              >
                <IconPlus size={18} />
                Add First Branch
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border-default)" }}>
            {filteredBranches.map((branch) => (
              <div
                key={branch.id}
                className="p-4 flex items-center gap-4 transition-colors hover:bg-white/5"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-violet-500/15">
                  <IconBuilding size={24} className="text-violet-400" />
                </div>

                {/* Name & Details */}
                <div className="flex-1">
                  <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    {branch.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${branch.is_active === 1 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        }`}
                    >
                      {branch.is_active === 1 ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <Group gap="xs">
                  {/* <ActionIcon
                    variant="light"
                    color={branch.is_active === 1 ? "red" : "green"}
                    onClick={() => handleToggleActive(branch.id)}
                    title={branch.is_active === 1 ? "Deactivate" : "Activate"}
                  >
                    {branch.is_active === 1 ? <IconCircleX size={18} /> : <IconCircleCheck size={18} />}
                  </ActionIcon> */}
                  <ActionIcon
                    variant="light"
                    color="blue"
                    onClick={() => handleOpenModal(branch)}
                    title="Edit"
                  >
                    <IconEdit size={24} />
                  </ActionIcon>
                  {/* <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => handleDelete(branch.id, branch.name)}
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
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "1.1rem"
          }}>
            {editingBranch ? "Edit Branch" : "Add New Branch"}
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
          {/* Area Selection */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>
              Area *
            </label>
            <Select
              placeholder="Select an area"
              value={areaId}
              onChange={(value) => {
                setAreaId(value || "");
                setAreaError("");
              }}
              data={areaOptions}
              error={areaError}
              styles={{
                input: {
                  background: "var(--bg-tertiary)",
                  borderColor: "var(--border-default)",
                  color: "var(--text-primary)",
                },
              }}
              disabled={!!editingBranch} // Don't allow changing area when editing
            />
            {editingBranch && (
              <p className="text-xs mt-1 opacity-60" style={{ color: "var(--text-secondary)" }}>
                Area cannot be changed when editing
              </p>
            )}
          </div>

          {/* Branch Name */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>
              Branch Name *
            </label>
            <TextInput
              placeholder="Enter branch name (e.g., Thane West)"
              value={branchName}
              onChange={(e) => {
                setBranchName(e.target.value);
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
              {editingBranch ? "Update" : "Create"}
            </button>
          </Group>
        </div>
      </Modal>
    </div>
  );
};

export default BranchPage;
