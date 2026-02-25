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

const datePickerStyles = {
  calendarHeader: { color: "white", backgroundColor: "#30345c" },
  calendarHeaderLevel: { color: "white" },
  calendarHeaderControl: { color: "white" },
  weekday: { color: "#cbd5e1" },
  day: { color: "white" },
};

const EnrollmentContent = React.memo<EnrollmentProps>(
  ({ formData, handleInputChange, errors }) => (
    <Stack gap="md">
      <Paper className="p-4 sm:p-6 border border-purple-500/30 bg-slate-700/50">
        <Title
          order={5}
          mb="md"
          className="text-purple-400 text-base sm:text-lg"
        >
          Enrollment Information
        </Title>
        <Grid gutter="md">
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
              classNames={{ label: "text-white mb-2" }}
              popoverProps={{
                styles: { dropdown: { backgroundColor: "#30345c" } },
              }}
              styles={datePickerStyles}
            />
          </Grid.Col>
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
              classNames={{ label: "text-white mb-2" }}
            />
          </Grid.Col>
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
              classNames={{ label: "text-white mb-2" }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <label className="text-white text-sm font-medium block mb-2">
              Course Type <span className="text-red-500">*</span>
            </label>
            <Radio.Group
              value={formData.courseType}
              onChange={(value) => handleInputChange("courseType", value)}
              required
              size="md"
            >
              <Stack gap="xs" className="sm:hidden">
                <Radio
                  value="Regular"
                  label="Regular"
                  color="violet"
                  classNames={{ label: "text-white" }}
                />
                <Radio
                  value="Crash (Backlog)"
                  label="Crash (Backlog)"
                  color="violet"
                  classNames={{ label: "text-white" }}
                />
              </Stack>
              <Group className="hidden sm:flex">
                <Radio
                  value="Regular"
                  label="Regular"
                  color="violet"
                  classNames={{ label: "text-white" }}
                />
                <Radio
                  value="Crash (Backlog)"
                  label="Crash (Backlog)"
                  color="violet"
                  classNames={{ label: "text-white" }}
                />
              </Group>
            </Radio.Group>
            {errors.courseType && (
              <Text size="xs" c="red" mt={4}>
                {errors.courseType}
              </Text>
            )}
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Reference"
              placeholder="Enter reference (optional)"
              value={formData.reference}
              onChange={(e) => handleInputChange("reference", e.target.value)}
              size="md"
              classNames={{ label: "text-white mb-2" }}
            />
          </Grid.Col>
        </Grid>
      </Paper>
    </Stack>
  ),
);

export default EnrollmentContent;
