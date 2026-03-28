// src\pages\admin\Users\Student\components\EnrollmentContent.tsx

import React from "react";
import { Stack, Paper, Title, Grid, Text, Group, Radio } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import type { StudentRegistrationData, ValidationErrors } from "../types";

interface EnrollmentProps {
  formData: StudentRegistrationData;
  handleInputChange: (field: string, value: any) => void;
  errors: ValidationErrors;
}

const EnrollmentContent = React.memo<EnrollmentProps>(
  ({ formData, handleInputChange, errors }) => (
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
              popoverProps={{
                styles: {
                  dropdown: { backgroundColor: "var(--bg-secondary)" },
                },
              }}
              styles={{
                label:                    { color: "var(--text-primary)",   marginBottom: 6 },
                input:                    { backgroundColor: "var(--bg-input)", color: "var(--text-primary)", borderColor: "var(--border-default)" },
                calendarHeader:           { color: "var(--text-primary)",   backgroundColor: "var(--bg-secondary)"  },
                calendarHeaderLevel:      { color: "var(--text-primary)"  },
                calendarHeaderControl:    { color: "var(--text-primary)"  },
                weekday:                  { color: "var(--text-secondary)" },
                day:                      { color: "var(--text-primary)"  },
              }}
            />
          </Grid.Col>

          {/* Subject */}
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <TextInput
              label="Subject"
              placeholder="Enter subject"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              required
              withAsterisk
              size="md"
              error={errors.subject}
              styles={{
                label: { color: "var(--text-primary)", marginBottom: 6 },
                input: { backgroundColor: "var(--bg-input)", color: "var(--text-primary)", borderColor: "var(--border-default)" },
              }}
            />
          </Grid.Col>

          {/* Branch */}
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <TextInput
              label="Branch"
              placeholder="Enter branch"
              value={formData.branch}
              onChange={(e) => handleInputChange("branch", e.target.value)}
              required
              withAsterisk
              size="md"
              error={errors.branch}
              styles={{
                label: { color: "var(--text-primary)", marginBottom: 6 },
                input: { backgroundColor: "var(--bg-input)", color: "var(--text-primary)", borderColor: "var(--border-default)" },
              }}
            />
          </Grid.Col>

          {/* Course Type */}
          <Grid.Col span={{ base: 12, md: 6 }}>
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
              {/* Mobile — stack */}
              <Stack gap="xs" className="sm:hidden">
                <Radio value="Regular"        label="Regular"        color="violet" styles={{ label: { color: "var(--text-primary)" } }} />
                <Radio value="Crash (Backlog)" label="Crash (Backlog)" color="violet" styles={{ label: { color: "var(--text-primary)" } }} />
              </Stack>
              {/* Desktop — row */}
              <Group className="hidden sm:flex">
                <Radio value="Regular"        label="Regular"        color="violet" styles={{ label: { color: "var(--text-primary)" } }} />
                <Radio value="Crash (Backlog)" label="Crash (Backlog)" color="violet" styles={{ label: { color: "var(--text-primary)" } }} />
              </Group>
            </Radio.Group>
            {errors.courseType && (
              <Text size="xs" c="red" mt={4}>{errors.courseType}</Text>
            )}
          </Grid.Col>

          {/* Reference */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Reference"
              placeholder="Enter reference (optional)"
              value={formData.reference}
              onChange={(e) => handleInputChange("reference", e.target.value)}
              size="md"
              styles={{
                label: { color: "var(--text-primary)", marginBottom: 6 },
                input: { backgroundColor: "var(--bg-input)", color: "var(--text-primary)", borderColor: "var(--border-default)" },
              }}
            />
          </Grid.Col>
        </Grid>
      </Paper>
    </Stack>
  ),
);

export default EnrollmentContent;