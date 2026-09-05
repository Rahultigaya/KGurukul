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
  School as SchoolIcon,
  Save as SaveIcon,
  CheckCircleOutlined as CheckCircleOutlinedIcon,
} from "@mui/icons-material";
import {
  getAllStandards,
  createStandard,
  updateStandard,
  type Standard,
} from "./masterStore";

const StandardPage: React.FC = () => {
  const navigate = useNavigate();

  const [standards, setStandards] = useState<Standard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStandard, setEditingStandard] = useState<Standard | null>(null);
  const [standardName, setStandardName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStandards();
  }, []);

  const loadStandards = async () => {
    try {
      setLoading(true);
      const data = await getAllStandards();
      setStandards(data);
    } catch (err: any) {
      console.error("Error loading standards:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (standard?: Standard) => {
    if (standard) {
      setEditingStandard(standard);
      setStandardName(standard.name);
      setIsActive(standard.is_active === 1);
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
    if (!standardName.trim()) {
      setNameError("Standard name is required");
      return;
    }
    if (standardName.trim().length < 2) {
      setNameError("Standard name must be at least 2 characters");
      return;
    }

    try {
      setSaving(true);
      if (editingStandard) {
        await updateStandard(editingStandard.id, {
          name: standardName.trim(),
          is_active: isActive ? 1 : 0,
        });
      } else {
        await createStandard({
          name: standardName.trim(),
          is_active: isActive ? 1 : 0,
        });
      }
      await loadStandards();
      handleCloseModal();
    } catch (err: any) {
      console.error("Error saving standard:", err);
    } finally {
      setSaving(false);
    }
  };

  const filteredStandards = standards.filter((standard) =>
    standard.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = standards.filter((s) => s.is_active === 1).length;
  const totalCount = standards.length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ── Page Header ────────────────────────────────────────────────── */}
      <PageHeader
        title="Standard Management"
        subtitle="Manage educational standards and grades"
        onBack={() => navigate("/master")}
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            className="!rounded-xl !px-5 !py-2.5 !font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Add Standard
          </Button>
        }
      />

      {/* ── Stats Card ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card elevation={1} className="bg-white border border-slate-200/60 rounded-2xl">
          <CardContent className="!p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                <SchoolIcon />
              </div>
              <div>
                <Typography variant="caption" className="text-slate-500 font-medium">
                  Total Standards
                </Typography>
                <Typography variant="h6" className="!font-bold text-slate-800">
                  {totalCount}
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card elevation={1} className="bg-white border border-slate-200/60 rounded-2xl">
          <CardContent className="!p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                <CheckCircleOutlinedIcon />
              </div>
              <div>
                <Typography variant="caption" className="text-slate-500 font-medium">
                  Active Standards
                </Typography>
                <Typography variant="h6" className="!font-bold text-slate-800">
                  {activeCount} ({Math.round((activeCount / (totalCount || 1)) * 100)}%)
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Main Content Card (Search & List) ─────────────────────────── */}
      <Card
        elevation={1}
        className="bg-white border border-slate-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all"
      >
        <CardContent className="!p-5 sm:!p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <Typography variant="h6" className="!font-bold text-slate-800">
              Standards List
            </Typography>
            <Chip
              label={`${filteredStandards.length} Standards`}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </div>

          {/* Search Box */}
          <TextField
            placeholder="Search standards by name..."
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

          {/* List Rows */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <CircularProgress size={36} color="primary" />
            </div>
          ) : filteredStandards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <SchoolIcon sx={{ fontSize: 48, opacity: 0.4 }} />
              <Typography variant="body1" className="font-semibold text-slate-600">
                No standards found
              </Typography>
              <Typography variant="caption" className="text-slate-400">
                {searchQuery
                  ? "Try a different search term"
                  : "Click 'Add Standard' to create your first standard"}
              </Typography>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredStandards.map((standard) => (
                <div
                  key={standard.id}
                  className="flex items-center justify-between py-3.5 px-2 hover:bg-slate-50 transition-colors rounded-xl"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                      <SchoolIcon />
                    </div>
                    <div>
                      <Typography variant="body1" className="!font-bold text-slate-800">
                        {standard.name}
                      </Typography>
                      <Chip
                        label={standard.is_active === 1 ? "Active" : "Inactive"}
                        color={standard.is_active === 1 ? "success" : "default"}
                        size="small"
                        sx={{ height: 20, fontSize: 10, fontWeight: 700, mt: 0.5 }}
                      />
                    </div>
                  </div>

                  <Tooltip title="Edit Standard">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenModal(standard)}
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
          <span>{editingStandard ? "Edit Standard" : "Add New Standard"}</span>
          <IconButton size="small" onClick={handleCloseModal}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent className="space-y-4 pt-2">
          <TextField
            label="Standard Name *"
            placeholder="Enter standard name (e.g., 10th, 12th Science)"
            value={standardName}
            onChange={(e) => {
              setStandardName(e.target.value);
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
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            className="!rounded-xl"
          >
            {editingStandard ? "Update Standard" : "Create Standard"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StandardPage;
