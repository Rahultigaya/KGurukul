// src\pages\admin\Users\Student\components\EnrollmentContent.tsx

import React, { useState, useEffect } from "react";
import { Stack, Paper, Title, Grid, Text, Radio, Select } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { getAllSubjects, getAllBranches } from "../../../Master/masterStore";
import type { Subject, Branch } from "../../../Master/masterStore";
import type { StudentRegistrationData, ValidationErrors } from "../types";

interface EnrollmentProps {
  formData: StudentRegistrationData;
  handleInputChange: (field: string, value: any) => void;
  errors: ValidationErrors;
}

// ── Generate academic year options ────────────────────────────────────────────
// Academic year runs June → May, e.g. "2024-25", "2025-26"
function getAcademicYears(): { value: string; label: string }[] {
  const currentYear = new Date().getFullYear();
  const years: { value: string; label: string }[] = [];
  // show 2 past + current + 1 future
  for (let y = currentYear; y <= currentYear + 2; y++) {
    const short = String(y + 1).slice(2); // "25" from 2025
    const value = `${y}-${short}`;
    const label = `${y}–${short} (Jun ${y} – May ${y + 1})`;
    years.push({ value, label });
  }
  return years; // newest first
}

const ACADEMIC_YEARS = getAcademicYears();

const selectStyles = {
  styles: {
    label: { color: "var(--text-primary)", marginBottom: 6 },
    input: { backgroundColor: "var(--bg-input)", color: "var(--text-primary)", borderColor: "var(--border-default)" },
    section: { color: "var(--text-muted)" },
    option: { color: "var(--text-primary)", backgroundColor: "var(--bg-secondary)" },
    placeholder: { color: "var(--text-muted)" },
    error: { color: "#f87171" },
  },
  comboboxProps: {
    styles: {
      dropdown: {
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-accent)",
        color: "var(--text-primary)",
      },
    },
  },
};

const inputStyles = {
  label: { color: "var(--text-primary)", marginBottom: 6 },
  input: {
    backgroundColor: "var(--bg-input)",
    color: "var(--text-primary)",
    borderColor: "var(--border-default)",
  },
  placeholder: { color: "var(--text-muted)" },
};

const EnrollmentContent = React.memo<EnrollmentProps>(
  ({ formData, handleInputChange, errors }) => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);

    useEffect(() => {
      const loadDropdownData = async () => {
        try {
          const [subjectsData, branchesData] = await Promise.all([
            getAllSubjects(),
            getAllBranches(),
          ]);
          // Filter only active records
          setSubjects(subjectsData.filter((s) => s.is_active === 1));
          setBranches(branchesData.filter((b) => b.is_active === 1));
        } catch (error) {
          console.error("Error loading subject/branch data:", error);
        }
      };
      loadDropdownData();
    }, []);

    const subjectOptions = subjects.map((s) => ({ value: String(s.id), label: s.name }));
    const branchOptions = branches.map((b) => ({ value: String(b.id), label: b.name }));

    return (
      <Stack gap="md">
        <Paper
          className="p-4 sm:p-6"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-accent)",
          }}
        >
          <Title
            order={5}
            mb="md"
            style={{ color: "var(--text-accent)", fontSize: "clamp(14px, 2vw, 18px)" }}
          >
            Enrollment Information
          </Title>

          <Grid gutter="md">

            {/* Academic Year */}
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Select
                label="Academic Year"
                placeholder="Select academic year"
                value={formData.academicYear ?? null}
                onChange={(value) => handleInputChange("academicYear", value)}
                data={ACADEMIC_YEARS}
                required
                withAsterisk
                error={errors.academicYear}
                {...selectStyles}
              />
            </Grid.Col>

            {/* Registration Date */}
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <DateInput
                label="Registration Date"
                placeholder="Select date"
                value={formData.registrationDate}
                onChange={(value) => handleInputChange("registrationDate", value)}
                required
                withAsterisk
                error={errors.registrationDate}
                onKeyDown={(e) => e.preventDefault()}
                size="md"
                // Show only month + year in the header; user picks a day
                // This is native DateInput — restrict to month/year level if needed
                popoverProps={{
                  styles: {
                    dropdown: { backgroundColor: "var(--bg-secondary)" },
                  },
                }}
                styles={{
                  label: { color: "var(--text-primary)", marginBottom: 6 },
                  input: { backgroundColor: "var(--bg-input)", color: "var(--text-primary)", borderColor: "var(--border-default)" },
                  calendarHeader: { color: "var(--text-primary)", backgroundColor: "var(--bg-secondary)" },
                  calendarHeaderLevel: { color: "var(--text-primary)" },
                  calendarHeaderControl: { color: "var(--text-primary)" },
                  weekday: { color: "var(--text-secondary)" },
                  day: { color: "var(--text-primary)" },
                }}
              />
            </Grid.Col>

            {/* Subject */}
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Select
                label="Subject"
                placeholder="Select subject"
                value={formData.subject ?? null}
                onChange={(value) => handleInputChange("subject", value)}
                data={subjectOptions}
                required
                withAsterisk
                error={errors.subject}
                searchable
                clearable
                {...selectStyles}
              />
            </Grid.Col>

            {/* Branch */}
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Select
                label="Branch"
                placeholder="Select branch"
                value={formData.branch ?? null}
                onChange={(value) => handleInputChange("branch", value)}
                data={branchOptions}
                required
                withAsterisk
                error={errors.branch}
                searchable
                clearable
                {...selectStyles}
              />
            </Grid.Col>

            {/* Course Type */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <label
                className="text-sm font-medium block mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Course Type <span className="text-red-500">*</span>
              </label>
              <Radio.Group
                value={formData.courseType}
                onChange={(value) => handleInputChange("courseType", value)}
                required
                size="md"
              >
                <Stack gap="xs">
                  <Radio value="Regular" label="Regular" color="violet" styles={{ label: { color: "var(--text-primary)" } }} />
                  <Radio value="Crash (Backlog)" label="Crash (Backlog)" color="violet" styles={{ label: { color: "var(--text-primary)" } }} />
                </Stack>
              </Radio.Group>
              {errors.courseType && (
                <Text size="xs" c="red" mt={4}>{errors.courseType}</Text>
              )}
            </Grid.Col>

            {/* Reference */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Reference"
                placeholder="Enter reference (optional)"
                value={formData.reference}
                onChange={(e) => handleInputChange("reference", e.target.value)}
                size="md"
                styles={inputStyles}
              />
            </Grid.Col>

          </Grid>
        </Paper>
      </Stack>
    );
  }
);

export default EnrollmentContent;
