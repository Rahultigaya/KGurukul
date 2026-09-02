// src/pages/admin/Users/Student/components/StudentDetailsContent.tsx

import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  TextField,
  Avatar,
  IconButton,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import { IconUser, IconUpload, IconX } from "@tabler/icons-react";
import type { StudentRegistrationData, ValidationErrors } from "../types";
import { getAllStandards } from "../../../Master/masterStore";

interface StudentDetailsProps {
  formData: StudentRegistrationData;
  handleInputChange: (field: string, value: any) => void;
  handleImageUpload: (file: File | null) => void;
  setFormData: React.Dispatch<React.SetStateAction<StudentRegistrationData>>;
  errors: ValidationErrors;
}

interface Option {
  value: string;
  label: string;
}

const DEFAULT_STANDARDS: Option[] = Array.from({ length: 12 }, (_, i) => {
  const num = i + 1;
  const suffix =
    num === 1 ? "st" : num === 2 ? "nd" : num === 3 ? "rd" : "th";
  return {
    value: String(num),
    label: `${num}${suffix} Standard`,
  };
});

const inputSxSlate = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
  },
};

const formHelperSlotProps = { className: "!bg-transparent !m-0 !mt-1" };

const StudentDetailsContent = React.memo<StudentDetailsProps>(
  ({
    formData,
    handleInputChange,
    handleImageUpload,
    setFormData,
    errors,
  }) => {
    const [standards, setStandards] = useState<Option[]>(DEFAULT_STANDARDS);

    // Dynamic API fetch for Standards from backend masterStore
    useEffect(() => {
      let isMounted = true;
      const loadStandardsFromApi = async () => {
        try {
          const standardsData = await getAllStandards();
          if (isMounted && standardsData && standardsData.length > 0) {
            setStandards(standardsData.map((st: { id: string | number; name: string }) => ({ value: String(st.id), label: st.name })));
          }
        } catch (err) {
          console.error("Error fetching standards from API:", err);
        }
      };
      loadStandardsFromApi();
      return () => {
        isMounted = false;
      };
    }, []);

    return (
      <div className="space-y-6">
        {/* ── Personal Information ─────────────────────────────────── */}
        <Paper
          elevation={1}
          className="p-5 sm:p-7 bg-white border border-slate-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all space-y-6"
        >
          <div className="border-l-4 border-blue-600 pl-3">
            <Typography variant="h6" className="!font-bold !text-slate-800 !text-base sm:!text-lg">
              Personal Information
            </Typography>
            <Typography variant="caption" className="text-slate-500">
              Provide student's full name, contact, photo and address
            </Typography>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Photo Upload Container */}
            <div className="flex flex-col items-center space-y-3 shrink-0 w-full md:w-auto">
              {formData.photo ? (
                <div className="relative group">
                  <Avatar src={formData.photo} className="!w-28 !h-28 rounded-2xl object-cover shadow-sm border border-slate-200" />
                  <IconButton
                    color="error"
                    onClick={() => setFormData((prev) => ({ ...prev, photo: null }))}
                    className="!absolute -top-2 -right-2 !w-8 !h-8 bg-white shadow-md border border-red-200 text-red-600 hover:bg-red-50 transition-all"
                    title="Remove Photo"
                  >
                    <IconX size={18} />
                  </IconButton>
                </div>
              ) : (
                <Avatar
                  sx={{ bgcolor: "#eff6ff", color: "#2563eb" }}
                  className="!w-28 !h-28 rounded-full border-2 border-blue-200 shadow-sm"
                >
                  <IconUser size={48} />
                </Avatar>
              )}

              <label className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow cursor-pointer hover:scale-105">
                <IconUpload size={16} />
                <span>Upload Photo</span>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleImageUpload(file);
                  }}
                />
              </label>
              <Typography variant="caption" className="text-slate-500 text-center">
                Passport size photo (JPG/PNG)
              </Typography>
            </div>

            {/* Form Fields Grid */}
            <div className="w-full md:w-3/4 space-y-5">
              {/* Row 1: First Name | Middle Name | Surname */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <TextField
                    label="First Name *"
                    placeholder="Enter first name"
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formData.firstName || ""}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    error={Boolean(errors.firstName)}
                    helperText={errors.firstName}
                    slotProps={{ formHelperText: formHelperSlotProps }}
                    sx={inputSxSlate}
                  />
                </div>
                <div>
                  <TextField
                    label="Middle Name"
                    placeholder="Enter middle name"
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formData.middleName || ""}
                    onChange={(e) => handleInputChange("middleName", e.target.value)}
                    error={Boolean(errors.middleName)}
                    helperText={errors.middleName}
                    slotProps={{ formHelperText: formHelperSlotProps }}
                    sx={inputSxSlate}
                  />
                </div>
                <div>
                  <TextField
                    label="Surname *"
                    placeholder="Enter surname"
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formData.surname || ""}
                    onChange={(e) => handleInputChange("surname", e.target.value)}
                    error={Boolean(errors.surname)}
                    helperText={errors.surname}
                    slotProps={{ formHelperText: formHelperSlotProps }}
                    sx={inputSxSlate}
                  />
                </div>
              </div>

              {/* Row 2: Gender | Mobile No | Email */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
                <div>
                  <FormControl component="fieldset" fullWidth error={Boolean(errors.gender)}>
                    <FormLabel className="!text-xs !font-semibold !text-slate-700 mb-1 block">
                      Gender *
                    </FormLabel>
                    <RadioGroup
                      value={formData.gender || ""}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                      row
                      className="!flex !items-center !justify-start gap-4 pt-1"
                    >
                      <FormControlLabel
                        value="male"
                        control={<Radio size="small" color="primary" />}
                        label={<span className="text-xs sm:text-sm text-slate-700 font-medium">Male</span>}
                        className="!mr-0"
                      />
                      <FormControlLabel
                        value="female"
                        control={<Radio size="small" color="primary" />}
                        label={<span className="text-xs sm:text-sm text-slate-700 font-medium">Female</span>}
                        className="!mr-0"
                      />
                      <FormControlLabel
                        value="other"
                        control={<Radio size="small" color="primary" />}
                        label={<span className="text-xs sm:text-sm text-slate-700 font-medium">Other</span>}
                        className="!mr-0"
                      />
                    </RadioGroup>
                    {errors.gender && <FormHelperText error className="!bg-transparent !m-0 !mt-1">{errors.gender}</FormHelperText>}
                  </FormControl>
                </div>

                <div>
                  <TextField
                    label="Mobile No *"
                    placeholder="Enter mobile number"
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formData.contactNo || ""}
                    onChange={(e) => handleInputChange("contactNo", e.target.value.replace(/\D/g, ""))}
                    error={Boolean(errors.contactNo)}
                    helperText={errors.contactNo}
                    slotProps={{
                      htmlInput: { maxLength: 10 },
                      formHelperText: formHelperSlotProps,
                    }}
                    sx={inputSxSlate}
                  />
                </div>

                <div>
                  <TextField
                    label="Email *"
                    placeholder="student@example.com"
                    type="email"
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                    slotProps={{ formHelperText: formHelperSlotProps }}
                    sx={inputSxSlate}
                  />
                </div>
              </div>

              {/* Row 3: Address */}
              <div>
                <TextField
                  label="Address *"
                  placeholder="Enter full address"
                  multiline
                  rows={2}
                  size="small"
                  variant="outlined"
                  fullWidth
                  value={formData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  error={Boolean(errors.address)}
                  helperText={errors.address}
                  slotProps={{ formHelperText: formHelperSlotProps }}
                  sx={inputSxSlate}
                />
              </div>
            </div>
          </div>
        </Paper>

        {/* ── Academic Background ──────────────────────────────────── */}
        <Paper
          elevation={1}
          className="p-5 sm:p-7 bg-white border border-slate-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all space-y-5"
        >
          <div className="border-l-4 border-blue-600 pl-3">
            <Typography variant="h6" className="!font-bold !text-slate-800 !text-base sm:!text-lg">
              Academic Background
            </Typography>
            <Typography variant="caption" className="text-slate-500">
              Enter school or college name and current standard
            </Typography>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <TextField
                label="School / College Name *"
                placeholder="Enter school/college name"
                size="small"
                variant="outlined"
                fullWidth
                value={formData.schoolCollegeName || ""}
                onChange={(e) => handleInputChange("schoolCollegeName", e.target.value)}
                error={Boolean(errors.schoolCollegeName)}
                helperText={errors.schoolCollegeName}
                slotProps={{ formHelperText: formHelperSlotProps }}
                sx={inputSxSlate}
              />
            </div>

            {/* Standard Autocomplete Select (Dynamic API Data) */}
            <div>
              <Autocomplete
                options={standards}
                getOptionLabel={(option) => option.label}
                value={standards.find((s) => String(s.value) === String(formData.standard)) || null}
                onChange={(_e, newValue) =>
                  handleInputChange("standard", newValue ? newValue.value : "")
                }
                isOptionEqualToValue={(option, value) => String(option.value) === String(value.value)}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Standard *"
                    error={Boolean(errors.standard)}
                    helperText={errors.standard}
                    sx={inputSxSlate}
                  />
                )}
              />
            </div>
          </div>
        </Paper>
      </div>
    );
  }
);

export default StudentDetailsContent;
