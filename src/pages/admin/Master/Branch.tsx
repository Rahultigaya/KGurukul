// src/pages/admin/Master/Branch.tsx

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader } from "../../../components/PageHeader";
import {
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  CircularProgress,
  Tooltip,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import {
  getAllAreas,
  getAllBranches,
  getBranchesByArea,
  createBranch,
  updateBranch,
  type Branch,
  type Area,
} from "./masterStore";

const DUMMY_BRANCH: Branch = {
  id: "dummy-branch-1",
  name: "Khopat Branch",
  area_id: "dummy-area-1",
  area_name: "Thane West",
  is_active: 1,
  created_at: new Date().toISOString(),
};

const DUMMY_AREA: Area = {
  id: "dummy-area-1",
  name: "Thane West",
  is_active: 1,
  created_at: new Date().toISOString(),
};

const BranchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedAreaId = searchParams.get("areaId");

  const [branches, setBranches] = useState<Branch[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>(preselectedAreaId || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [branchName, setBranchName] = useState("");
  const [areaId, setAreaId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [nameError, setNameError] = useState("");
  const [areaError, setAreaError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAreas();
    loadBranches();
  }, [selectedArea]);

  const loadAreas = async () => {
    try {
      const data = await getAllAreas();
      setAreas(data && data.length > 0 ? data : [DUMMY_AREA]);
    } catch (err: any) {
      console.error("Error loading areas:", err);
      setAreas([DUMMY_AREA]);
    }
  };

  const loadBranches = async () => {
    try {
      setLoading(true);
      setApiError(null);
      let data;
      if (selectedArea) {
        data = await getBranchesByArea(selectedArea);
      } else {
        data = await getAllBranches();
      }
      if (data && data.length > 0) {
        setBranches(data);
      } else {
        setBranches([DUMMY_BRANCH]);
      }
    } catch (err: any) {
      console.error("Error loading branches:", err);
      setApiError(err?.message || "Failed to fetch");
      setBranches([DUMMY_BRANCH]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (branch?: Branch) => {
    if (branch) {
      setEditingBranch(branch);
      setBranchName(branch.name);
      setAreaId(String(branch.area_id));
      setIsActive(branch.is_active === 1);
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
      setSaving(true);

      if (editingBranch) {
        await updateBranch(editingBranch.id, {
          name: branchName.trim(),
          area_id: areaId,
          is_active: isActive ? 1 : 0,
        });
      } else {
        await createBranch({
          name: branchName.trim(),
          area_id: areaId,
          is_active: isActive ? 1 : 0,
        });
      }

      await loadBranches();
      handleCloseModal();
    } catch (err: any) {
      console.error("Error saving branch:", err);
    } finally {
      setSaving(false);
    }
  };

  const filteredBranches = branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (branch.area_name && branch.area_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeAreas = areas.filter((area) => area.is_active === 1);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ── Page Header ────────────────────────────────────────────────── */}
      <PageHeader
        title="Branch Management"
        subtitle="Manage branches and center locations within your areas"
        onBack={() => navigate("/master")}
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon className="!text-white" />}
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md transition-all hover:scale-105"
          >
            Add Branch
          </Button>
        }
      />

      {/* Offline Alert Banner */}
      {apiError && (
        <div className="flex items-center justify-between px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
          <span className="flex items-center gap-1.5">
            ⚠️ API connection failed ({apiError}). Showing 1 dummy branch for offline preview.
          </span>
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              loadAreas();
              loadBranches();
            }}
            className="!px-3 !py-1 !bg-blue-600 hover:!bg-blue-700 !text-white !text-xs !font-medium !rounded-lg !normal-case transition-colors"
          >
            Retry API
          </Button>
        </div>
      )}

      {/* ── Main Content Card (Search & List) ─────────────────────────── */}
      <Card
        elevation={1}
        className="bg-white border border-slate-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all"
      >
        <CardContent className="!p-5 sm:!p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
            <Typography variant="h6" className="!font-bold text-slate-800">
              Branches List
            </Typography>
            <Chip
              label={`${filteredBranches.length} Branches`}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </div>

          {/* Search Box & Area Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <TextField
                placeholder="Search branches by name or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                fullWidth
                autoComplete="off"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon className="text-slate-400" fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery ? (
                      <IconButton size="small" onClick={() => setSearchQuery("")}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    ) : null,
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f8fafc",
                    borderRadius: "12px",
                  },
                }}
              />
            </div>

            <div>
              <TextField
                select
                label="Filter by Area"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                size="small"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f8fafc",
                    borderRadius: "12px",
                  },
                }}
              >
                <MenuItem value="">All Areas</MenuItem>
                {areas.map((a) => (
                  <MenuItem key={a.id} value={String(a.id)}>
                    {a.name}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>

          {/* List Rows */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <CircularProgress size={36} color="primary" />
            </div>
          ) : filteredBranches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <BusinessIcon sx={{ fontSize: 48, opacity: 0.4 }} />
              <Typography variant="body1" className="font-semibold text-slate-600">
                No branches found
              </Typography>
              <Typography variant="caption" className="text-slate-400">
                {searchQuery || selectedArea
                  ? "Try adjusting your search or area filter"
                  : "Click 'Add Branch' to create your first branch location"}
              </Typography>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredBranches.map((branch) => (
                <div
                  key={branch.id}
                  className="flex items-center justify-between py-3.5 px-2 hover:bg-slate-50 transition-colors rounded-xl"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                      <BusinessIcon />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Typography variant="body1" className="!font-bold text-slate-800">
                          {branch.name}
                        </Typography>
                        {branch.area_name && (
                          <Chip
                            label={`Area: ${branch.area_name}`}
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: 10, fontWeight: 700 }}
                          />
                        )}
                      </div>
                      <Chip
                        label={branch.is_active === 1 ? "Active" : "Inactive"}
                        color={branch.is_active === 1 ? "success" : "default"}
                        size="small"
                        sx={{ height: 20, fontSize: 10, fontWeight: 700, mt: 0.5 }}
                      />
                    </div>
                  </div>

                  <Tooltip title="Edit Branch">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenModal(branch)}
                      className="hover:bg-blue-50"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Add / Edit Dialog ─────────────────────────────────────────── */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            className: "rounded-2xl p-2",
          },
        }}
      >
        <DialogTitle className="!font-bold text-slate-800 flex items-center justify-between">
          <span>{editingBranch ? "Edit Branch" : "Add New Branch"}</span>
          <IconButton size="small" onClick={handleCloseModal}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent className="space-y-4 pt-2">
          <TextField
            label="Branch Name *"
            placeholder="Enter branch name (e.g., Naupada, Panchpakhadi)"
            value={branchName}
            onChange={(e) => {
              setBranchName(e.target.value);
              setNameError("");
            }}
            error={!!nameError}
            helperText={nameError}
            fullWidth
            size="small"
            autoFocus
            sx={{ mt: 1 }}
          />

          <TextField
            select
            label="Area *"
            value={areaId}
            onChange={(e) => {
              setAreaId(e.target.value);
              setAreaError("");
            }}
            error={!!areaError}
            helperText={areaError}
            fullWidth
            size="small"
          >
            <MenuItem value="">Select an Area</MenuItem>
            {activeAreas.map((a) => (
              <MenuItem key={a.id} value={String(a.id)}>
                {a.name}
              </MenuItem>
            ))}
          </TextField>

          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                color="primary"
              />
            }
            label="Active Status"
          />
        </DialogContent>
        <DialogActions className="!px-6 !pb-4">
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            color="inherit"
            startIcon={<CloseIcon />}
            className="!rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon className="!text-white" style={{ color: "#ffffff" }} />}
            className="!rounded-xl"
          >
            {editingBranch ? "Update Branch" : "Create Branch"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BranchPage;
