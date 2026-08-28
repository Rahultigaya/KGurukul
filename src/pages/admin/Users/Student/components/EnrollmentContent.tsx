// src/pages/admin/Users/Student/components/EnrollmentContent.tsx

import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  FormHelperText,
  Autocomplete
} from "@mui/material";
import type { StudentRegistrationData, ValidationErrors } from "../types";
import { getAllBranches, getAllSubjects } from "../../../Master/masterStore";

interface EnrollmentProps {
  formData: StudentRegistrationData;
  handleInputChange: (field: string, value: any) => void;
  errors: ValidationErrors;
}

interface Option {
  value: string;
  label: string;
}

const ACADEMIC_YEARS: Option[] = [
  { value: "2023-2024", label: "2023-2024" },
  { value: "2024-2025", label: "2024-2025" },
  { value: "2025-2026", label: "2025-2026" },
  { value: "2026-2027", label: "2026-2027" },
];

const DEFAULT_SUBJECTS: Option[] = [
  { value: "1", label: "Computer Science" },
  { value: "2", label: "Mathematics" },
  { value: "3", label: "Physics" },
  { value: "4", label: "Chemistry" },
  { value: "5", label: "Biology" },
  { value: "6", label: "English" },
];

const DEFAULT_BRANCHES: Option[] = [
  { value: "1", label: "Main Branch" },
  { value: "2", label: "Thane Branch" },
  { value: "3", label: "Mulund Branch" },
  { value: "4", label: "Kalyan Branch" },
];

const inputSxSlate = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
  },
};

const formHelperSlotProps = { className: "!bg-transparent !m-0 !mt-1" };

const EnrollmentContent = React.memo<EnrollmentProps>(
  ({ formData, handleInputChange, errors }) => {
    const [branches, setBranches] = useState<Option[]>(DEFAULT_BRANCHES);
    const [subjects, setSubjects] = useState<Option[]>(DEFAULT_SUBJECTS);

    // Dynamic API fetch for Branches and Subjects from backend masterStore
    useEffect(() => {
      let isMounted = true;
      const loadOptionsFromApi = async () => {
        try {
          const [branchesData, subjectsData] = await Promise.all([
            getAllBranches(),
            getAllSubjects(),
          ]);

          if (isMounted) {
            if (branchesData && branchesData.length > 0) {
              setBranches(branchesData.map((b: { id: string | number; name: string }) => ({ value: String(b.id), label: b.name })));
            }
            if (subjectsData && subjectsData.length > 0) {
              setSubjects(subjectsData.map((s: { id: string | number; name: string }) => ({ value: String(s.id), label: s.name })));
            }
          }
        } catch (err) {
          console.error("Error fetching branches/subjects from API:", err);
        }
      };
      loadOptionsFromApi();
      return () => {
        isMounted = false;
      };
    }, []);

   const findOption = (options: Option[], value: string | undefined) =>
  options.find((o) => o.value === value?.trim()) || null;

    return (
      <Paper
        elevation={1}
        className="p-5 sm:p-7 bg-white border border-slate-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all space-y-6"
      >
        <div className="border-l-4 border-blue-600 pl-3">
          <Typography variant="h6" className="!font-bold !text-slate-800 !text-base sm:!text-lg">
            Enrollment Information
          </Typography>
          <Typography variant="caption" className="text-slate-500">
            Select academic year, branch, subject and course type
          </Typography>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {/* Row 1 — Item 1: Academic Year Dropdown */}
          <div>
            <Autocomplete
              options={ACADEMIC_YEARS}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.value === value.value}
value={findOption(ACADEMIC_YEARS, String(formData.academicYear ?? "").trim())}
              onChange={(_e, newValue) =>
                handleInputChange("academicYear", newValue ? newValue.value : "")
              }
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Academic Year *"
                  error={Boolean(errors.academicYear)}
                  helperText={errors.academicYear}
                   sx={inputSxSlate}
                />
              )}
            />

          </div>

          {/* Row 1 — Item 2: Registration Date */}
          <div>
            <TextField
              label="Registration Date *"
              type="date"
              size="small"
              variant="outlined"
              fullWidth
              value={formData.registrationDate || ""}
              onChange={(e) => handleInputChange("registrationDate", e.target.value)}
              error={Boolean(errors.registrationDate)}
              helperText={errors.registrationDate}
              slotProps={{
                inputLabel: { shrink: true },
                formHelperText: formHelperSlotProps,
              }}
              sx={inputSxSlate}
            />
          </div>

          {/* Row 1 — Item 3: Subject Dropdown (Dynamic API Data) */}
          <div>
           <Autocomplete
  options={subjects}
  getOptionLabel={(option) => option.label}
  value={subjects.find((s) => s.value === formData.subject) || null}
  onChange={(_e, newValue) => handleInputChange("subject", newValue ? newValue.value : "")}
  isOptionEqualToValue={(option, value) => option.value === value.value}
  size="small"
  renderInput={(params) => (
    <TextField
      {...params}
      label="Subject *"
      error={Boolean(errors.subject)}
      helperText={errors.subject}
      sx={inputSxSlate}
    />
  )}
/>
          </div>

          {/* Row 2 — Item 4: Branch Dropdown (Dynamic API Data) */}
          <div>
            <Autocomplete
              options={branches}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              value={findOption(branches, formData.branch)}
              onChange={(_e, newValue) =>
                handleInputChange("branch", newValue ? newValue.value : "")
              }
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Branch *"
                  error={Boolean(errors.branch)}
                  helperText={errors.branch}
                   sx={inputSxSlate}
                />
              )}
            />
          </div>

          {/* Row 2 — Item 5: Course Type Radio Group */}
          <div>
            <FormControl component="fieldset" fullWidth error={Boolean(errors.courseType)}>
              <FormLabel className="!text-xs !font-semibold !text-slate-700 mb-1 block">
                Course Type *
              </FormLabel>
              <RadioGroup
                value={formData.courseType || "Regular"}
                onChange={(e) => handleInputChange("courseType", e.target.value)}
                row
                className="!flex !w-full !items-center !justify-between pt-1"
              >
                <FormControlLabel
                  value="Regular"
                  control={<Radio size="small" color="primary" />}
                  label={<span className="text-xs sm:text-sm text-slate-700 font-medium">Regular</span>}
                />
                <FormControlLabel
                  value="Crash (Backlog)"
                  control={<Radio size="small" color="primary" />}
                  label={<span className="text-xs sm:text-sm text-slate-700 font-medium">Crash</span>}
                />
              </RadioGroup>
              {errors.courseType && <FormHelperText error className="!bg-transparent !m-0 !mt-1">{errors.courseType}</FormHelperText>}
            </FormControl>
          </div>

          {/* Row 2 — Item 6: Reference */}
          <div>
            <TextField
              label="Reference"
              placeholder="Enter reference (optional)"
              size="small"
              variant="outlined"
              fullWidth
              value={formData.reference || ""}
              onChange={(e) => handleInputChange("reference", e.target.value)}
              sx={inputSxSlate}
            />
          </div>
        </div>
      </Paper>
    );
  }
);

export default EnrollmentContent;
