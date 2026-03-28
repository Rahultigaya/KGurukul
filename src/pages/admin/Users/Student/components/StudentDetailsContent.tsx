// src\pages\admin\Users\Student\components\StudentDetailsContent.tsx

import React from "react";
import {
  Stack, Paper, Title, Grid, Text, Group,
  Radio, TextInput, Textarea, Avatar, ActionIcon, FileInput,
} from "@mantine/core";
import { IconUpload, IconX, IconUser } from "@tabler/icons-react";
import type { StudentRegistrationData, ValidationErrors } from "../types";

interface StudentDetailsProps {
  formData: StudentRegistrationData;
  handleInputChange: (field: string, value: any) => void;
  handleImageUpload: (file: File | null) => void;
  setFormData: React.Dispatch<React.SetStateAction<StudentRegistrationData>>;
  errors: ValidationErrors;
}

const inputStyles = {
  label: { color: "var(--text-primary)", marginBottom: 6 },
  input: {
    backgroundColor: "var(--bg-input)",
    color: "var(--text-primary)",
    borderColor: "var(--border-default)",
  },
};

const radioLabel = { styles: { label: { color: "var(--text-primary)" } } };

const StudentDetailsContent = React.memo<StudentDetailsProps>(
  ({ formData, handleInputChange, handleImageUpload, setFormData, errors }) => (
    <Stack gap="md">

      {/* ── Personal Information ─────────────────────────────────── */}
      <Paper
        className="p-4 sm:p-6"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)" }}
      >
        <Title
          order={5} mb="md"
          style={{ color: "var(--text-accent)", fontSize: "clamp(14px,2vw,18px)" }}
        >
          Personal Information
        </Title>

        <Grid gutter="md">
          {/* Photo Upload */}
          <Grid.Col span={{ base: 12, md: 3 }}>
            <div className="flex flex-col items-center gap-3">
              {formData.photo ? (
                <>
                  <Avatar src={formData.photo} size={100} radius="md" />
                  <ActionIcon
                    color="red" variant="light"
                    onClick={() => setFormData((prev) => ({ ...prev, photo: null }))}
                  >
                    <IconX size={16} />
                  </ActionIcon>
                </>
              ) : (
                <Avatar
                  size={100} radius="md"
                  style={{ background: "var(--bg-tertiary)" }}
                >
                  <IconUser size={40} style={{ color: "var(--text-muted)" }} />
                </Avatar>
              )}

              <div className="w-full max-w-[160px]">
                <FileInput
                  label="Photo"
                  placeholder="Upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  leftSection={<IconUpload size={14} style={{ color: "var(--text-muted)" }} />}
                  size="md"
                  styles={{
                    label: { color: "var(--text-primary)", marginBottom: 6 },
                    input: {
                      backgroundColor: "var(--bg-input)",
                      color: "var(--text-primary)",
                      borderColor: "var(--border-default)",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    },
                  }}
                />
              </div>

              <Text size="xs" ta="center" style={{ color: "var(--text-muted)" }}>
                Upload student passport size photo
              </Text>
            </div>
          </Grid.Col>

          {/* Name & Contact fields */}
          <Grid.Col span={{ base: 12, md: 9 }}>
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput
                  label="First Name" placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required withAsterisk size="md"
                  error={errors.firstName} styles={inputStyles}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput
                  label="Middle Name" placeholder="Enter middle name"
                  value={formData.middleName}
                  onChange={(e) => handleInputChange("middleName", e.target.value)}
                  size="md" error={errors.middleName} styles={inputStyles}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput
                  label="Surname" placeholder="Enter surname"
                  value={formData.surname}
                  onChange={(e) => handleInputChange("surname", e.target.value)}
                  required withAsterisk size="md"
                  error={errors.surname} styles={inputStyles}
                />
              </Grid.Col>

              {/* Gender */}
              <Grid.Col span={{ base: 12, md: 4 }}>
                <label className="text-sm font-medium block mb-2" style={{ color: "var(--text-primary)" }}>
                  Gender <span className="text-red-500">*</span>
                </label>
                <Radio.Group
                  value={formData.gender}
                  onChange={(value) => handleInputChange("gender", value)}
                  required size="md" error={errors.gender}
                >
                  <Group gap="md">
                    <Radio value="male"   label="Male"   color="violet" {...radioLabel} />
                    <Radio value="female" label="Female" color="violet" {...radioLabel} />
                    <Radio value="other"  label="Other"  color="violet" {...radioLabel} />
                  </Group>
                </Radio.Group>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput
                  label="Mobile No" type="text" placeholder="Enter mobile number"
                  value={formData.contactNo} maxLength={10}
                  onChange={(e) => handleInputChange("contactNo", e.target.value)}
                  required withAsterisk size="md"
                  error={errors.contactNo} styles={inputStyles}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput
                  label="Email" type="email" placeholder="student@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required withAsterisk size="md"
                  error={errors.email} styles={inputStyles}
                />
              </Grid.Col>

              <Grid.Col span={12}>
                <Textarea
                  label="Address" placeholder="Enter full address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  minRows={4} required withAsterisk size="md"
                  error={errors.address}
                  styles={{
                    label: { color: "var(--text-primary)", marginBottom: 6 },
                    input: {
                      backgroundColor: "var(--bg-input)",
                      color: "var(--text-primary)",
                      borderColor: "var(--border-default)",
                    },
                  }}
                />
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
      </Paper>

      {/* ── Academic Background ──────────────────────────────────── */}
      <Paper
        className="p-4 sm:p-6"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)" }}
      >
        <Title
          order={5} mb="md"
          style={{ color: "var(--text-accent)", fontSize: "clamp(14px,2vw,18px)" }}
        >
          Academic Background
        </Title>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="School / College Name" placeholder="Enter school/college name"
              value={formData.schoolCollegeName}
              onChange={(e) => handleInputChange("schoolCollegeName", e.target.value)}
              required withAsterisk size="md"
              error={errors.schoolCollegeName} styles={inputStyles}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Standard" placeholder="e.g., 10th, 12th, BCA"
              value={formData.standard}
              onChange={(e) => handleInputChange("standard", e.target.value)}
              required withAsterisk size="md"
              error={errors.standard} styles={inputStyles}
            />
          </Grid.Col>
        </Grid>
      </Paper>

    </Stack>
  ),
);

export default StudentDetailsContent;