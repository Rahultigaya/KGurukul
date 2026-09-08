import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  LocationOn as LocationOnIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import {
  getAllAreas,
  createArea,
  updateArea,
  type Area,
} from "./masterStore";

const DUMMY_AREA: Area = {
  id: "dummy-area-1",
  name: "Thane West",
  is_active: 1,
  created_at: new Date().toISOString(),
};

const AreaPage: React.FC = () => {
  const navigate = useNavigate();

  const [areas, setAreas] = useState<Area[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [areaName, setAreaName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      setLoading(true);
      setApiError(null);
      const data = await getAllAreas();
      if (data && data.length > 0) {
        setAreas(data);
      } else {
        setAreas([DUMMY_AREA]);
      }
    } catch (err: any) {
      console.error("Error loading areas:", err);
      setApiError(err?.message || "Failed to fetch");
      setAreas([DUMMY_AREA]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (area?: Area) => {
    if (area) {
      setEditingArea(area);
      setAreaName(area.name);
      setIsActive(area.is_active === 1);
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
    if (!areaName.trim()) {
      setNameError("Area name is required");
      return;
    }
    if (areaName.trim().length < 2) {
      setNameError("Area name must be at least 2 characters");
      return;
    }

    try {
      setSaving(true);
      if (editingArea) {
        await updateArea(editingArea.id, {
          name: areaName.trim(),
          is_active: isActive ? 1 : 0,
        });
      } else {
        await createArea({
          name: areaName.trim(),
          is_active: isActive ? 1 : 0,
        });
      }
      await loadAreas();
      handleCloseModal();
    } catch (err: any) {
      console.error("Error saving area:", err);
    } finally {
      setSaving(false);
    }
  };

  const filteredAreas = areas.filter((area) =>
    area.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ── Page Header ────────────────────────────────────────────────── */}
      <PageHeader
        title="Area Management"
        subtitle="Manage geographic areas for center allocations"
        onBack={() => navigate("/master")}
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon className="!text-white" />}
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md transition-all hover:scale-105"
          >
            Add Area
          </Button>
        }
      />

      {/* Offline Alert Banner */}
      {apiError && (
        <div className="flex items-center justify-between px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
          <span className="flex items-center gap-1.5">
            ⚠️ API connection failed ({apiError}). Showing 1 dummy area for offline preview.
          </span>
          <Button
            size="small"
            variant="contained"
            onClick={loadAreas}
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
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <Typography variant="h6" className="!font-bold text-slate-800">
              Areas List
            </Typography>
            <Chip
              label={`${filteredAreas.length} Areas`}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </div>

          {/* Search Box */}
          <TextField
            placeholder="Search areas by name..."
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

          {/* List Area Rows */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <CircularProgress size={36} color="primary" />
            </div>
          ) : filteredAreas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <LocationOnIcon sx={{ fontSize: 48, opacity: 0.4 }} />
              <Typography variant="body1" className="font-semibold text-slate-600">
                No areas found
              </Typography>
              <Typography variant="caption" className="text-slate-400">
                {searchQuery
                  ? "Try a different search term"
                  : "Click 'Add Area' to create your first geographic area"}
              </Typography>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredAreas.map((area) => (
                <div
                  key={area.id}
                  className="flex items-center justify-between py-3.5 px-2 hover:bg-slate-50 transition-colors rounded-xl"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                      <LocationOnIcon />
                    </div>
                    <div>
                      <Typography variant="body1" className="!font-bold text-slate-800">
                        {area.name}
                      </Typography>
                      <Chip
                        label={area.is_active === 1 ? "Active" : "Inactive"}
                        color={area.is_active === 1 ? "success" : "default"}
                        size="small"
                        sx={{ height: 20, fontSize: 10, fontWeight: 700, mt: 0.5 }}
                      />
                    </div>
                  </div>

                  <Tooltip title="Edit Area">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenModal(area)}
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
          <span>{editingArea ? "Edit Area" : "Add New Area"}</span>
          <IconButton size="small" onClick={handleCloseModal}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent className="space-y-4 pt-2">
          <TextField
            label="Area Name *"
            placeholder="Enter area name (e.g., Thane, Mulund)"
            value={areaName}
            onChange={(e) => {
              setAreaName(e.target.value);
              setNameError("");
            }}
            error={!!nameError}
            helperText={nameError}
            fullWidth
            size="small"
            autoFocus
            sx={{ mt: 1 }}
          />

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
            {editingArea ? "Update Area" : "Create Area"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AreaPage;
