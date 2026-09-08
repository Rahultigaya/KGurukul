// src/pages/admin/Users/Student/components/GuardianContent.tsx

import React from "react";
import {
  Paper,
  Typography,
  TextField,
  Chip,
  Button,
} from "@mui/material";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import type { GuardianDetails, StudentRegistrationData, ValidationErrors } from "../types";

interface GuardianProps {
  formData: StudentRegistrationData;
  handleGuardianChange: (id: string, field: keyof GuardianDetails, value: string) => void;
  addGuardian: () => void;
  removeGuardian: (id: string) => void;
  errors: ValidationErrors;
}

const inputSxWhite = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
  },
};

const formHelperSlotProps = { className: "!bg-transparent !m-0 !mt-1" };

const GuardianContent = React.memo<GuardianProps>(
  ({ formData, handleGuardianChange, addGuardian, removeGuardian, errors }) => (
    <Paper
      elevation={1}
      className="p-5 sm:p-7 bg-white border border-slate-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-l-4 border-blue-600 pl-3">
        <div>
          <Typography variant="h6" className="!font-bold !text-slate-800 !text-base sm:!text-lg">
            Parent / Guardian Information
          </Typography>
          <Typography variant="caption" className="text-slate-500">
            Provide contact info for primary guardian (Father/Mother) and optional secondary guardian
          </Typography>
        </div>

        {formData.guardians.length < 2 && (
          <Button
            type="button"
            variant="contained"
            color="primary"
            startIcon={<IconPlus size={16} />}
            onClick={addGuardian}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md transition-all hover:scale-105 !normal-case"
          >
            Add Secondary Guardian
          </Button>
        )}
      </div>

      {/* Guardian cards — Styled exactly like Installment 1 / 2 cards */}
      <div className="space-y-5">
        {formData.guardians.map((guardian, index) => (
          <div
            key={guardian.id}
            className="p-4 sm:p-5 bg-slate-50/80 border border-slate-200/90 rounded-xl space-y-4"
          >
            {/* Card Section Header with Numbered Badge & Icons */}
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/90">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
                    index === 0
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {index + 1}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">
                    {index === 0 ? "Primary Parent / Guardian" : "Secondary Parent / Guardian"}
                  </span>
                  <Chip
                    label={index === 0 ? "Required" : "Optional"}
                    color={index === 0 ? "error" : "default"}
                    size="small"
                    variant="outlined"
                    className="!font-semibold !text-[11px]"
                  />
                </div>
              </div>

              {index > 0 && (
                <Button
                  type="button"
                  variant="outlined"
                  color="error"
                  startIcon={<IconTrash size={14} />}
                  onClick={() => removeGuardian(guardian.id)}
                  className="!bg-white hover:!bg-rose-50 !text-rose-600 !border-rose-200 !text-xs !font-semibold !px-2.5 !py-1 !rounded-lg transition-all !normal-case shadow-sm"
                  title="Remove Guardian"
                >
                  Remove
                </Button>
              )}
            </div>

            {/* Fields Grid — 4 inputs in 1 row on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <TextField
                  label={`Guardian Name ${index === 0 ? "*" : ""}`}
                  placeholder="Full name (e.g. Ramesh Patil)"
                  size="small"
                  variant="outlined"
                  fullWidth
                  value={guardian.name}
                  onChange={(e) => handleGuardianChange(guardian.id, "name", e.target.value)}
                  error={Boolean(errors[index === 0 ? "guardian_0_name" : "guardian_1_name"])}
                  helperText={errors[index === 0 ? "guardian_0_name" : "guardian_1_name"]}
                  slotProps={{ formHelperText: formHelperSlotProps }}
                  sx={inputSxWhite}
                />
              </div>

              <div>
                <TextField
                  label={`Relation ${index === 0 ? "*" : ""}`}
                  placeholder="Father / Mother / Guardian"
                  size="small"
                  variant="outlined"
                  fullWidth
                  value={guardian.relation}
                  onChange={(e) => handleGuardianChange(guardian.id, "relation", e.target.value)}
                  error={Boolean(errors[index === 0 ? "guardian_0_relation" : "guardian_1_relation"])}
                  helperText={errors[index === 0 ? "guardian_0_relation" : "guardian_1_relation"]}
                  slotProps={{ formHelperText: formHelperSlotProps }}
                  sx={inputSxWhite}
                />
              </div>

              <div>
                <TextField
                  label={`Mobile No ${index === 0 ? "*" : ""}`}
                  placeholder="10 digit mobile number"
                  size="small"
                  variant="outlined"
                  fullWidth
                  value={guardian.contact}
                  onChange={(e) => handleGuardianChange(guardian.id, "contact", e.target.value.replace(/\D/g, ""))}
                  error={Boolean(errors[index === 0 ? "guardian_0_contact" : "guardian_1_contact"])}
                  helperText={errors[index === 0 ? "guardian_0_contact" : "guardian_1_contact"]}
                  slotProps={{
                    htmlInput: { maxLength: 10 },
                    formHelperText: formHelperSlotProps,
                  }}
                  sx={inputSxWhite}
                />
              </div>

              <div>
                <TextField
                  label={`Email ${index === 0 ? "*" : ""}`}
                  placeholder="parent@example.com"
                  type="email"
                  size="small"
                  variant="outlined"
                  fullWidth
                  value={guardian.email}
                  onChange={(e) => handleGuardianChange(guardian.id, "email", e.target.value)}
                  error={Boolean(errors[index === 0 ? "guardian_0_email" : "guardian_1_email"])}
                  helperText={errors[index === 0 ? "guardian_0_email" : "guardian_1_email"]}
                  slotProps={{ formHelperText: formHelperSlotProps }}
                  sx={inputSxWhite}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Paper>
  )
);

export default GuardianContent;
