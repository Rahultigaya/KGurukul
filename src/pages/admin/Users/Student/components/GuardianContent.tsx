// src\pages\admin\Users\Student\components\GuardianContent.tsx

import React from "react";
import {
  Stack, Paper, Title, Grid, Card,
  Badge, ActionIcon, Button, TextInput,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import type { GuardianDetails, StudentRegistrationData, ValidationErrors } from "../types";

interface GuardianProps {
  formData: StudentRegistrationData;
  handleGuardianChange: (id: string, field: keyof GuardianDetails, value: string) => void;
  addGuardian: () => void;
  removeGuardian: (id: string) => void;
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

const GuardianContent = React.memo<GuardianProps>(
  ({ formData, handleGuardianChange, addGuardian, removeGuardian, errors }) => (
    <Stack gap="md">
      <Paper
        className="p-4 sm:p-6"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-accent)",
        }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <Title
            order={5}
            style={{ color: "var(--text-accent)", fontSize: "clamp(14px,2vw,18px)" }}
          >
            Parent / Guardian Details
          </Title>

          {formData.guardians.length < 2 && (
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={addGuardian}
              color="green"
              variant="light"
              size="sm"
              fullWidth
              className="sm:w-auto"
            >
              Add Guardian
            </Button>
          )}
        </div>

        {/* Guardian cards */}
        <Stack gap="md">
          {formData.guardians.map((guardian, index) => (
            <Card
              key={guardian.id}
              className="p-4 sm:p-6"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-accent)",
              }}
            >
              {/* Card header — badge + remove button */}
              <div className="flex justify-between items-start mb-4 gap-2">
                <Badge
                  color={index === 0 ? "violet" : "gray"}
                  size="lg"
                  variant="light"
                  className="text-xs sm:text-sm"
                >
                  {index === 0 ? "Guardian 1 (Required)" : "Guardian 2 (Optional)"}
                </Badge>

                {index > 0 && (
                  <ActionIcon
                    color="red"
                    variant="light"
                    size="lg"
                    onClick={() => removeGuardian(guardian.id)}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                )}
              </div>

              {/* Fields */}
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Guardian Name"
                    placeholder="Enter name"
                    value={guardian.name}
                    onChange={(e) => handleGuardianChange(guardian.id, "name", e.target.value)}
                    required={index === 0}
                    withAsterisk={index === 0}
                    size="md"
                    error={errors[index === 0 ? "guardian_0_name" : "guardian_1_name"]}
                    styles={inputStyles}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Relation"
                    placeholder="Enter relation"
                    value={guardian.relation}
                    onChange={(e) => handleGuardianChange(guardian.id, "relation", e.target.value)}
                    required={index === 0}
                    withAsterisk={index === 0}
                    size="md"
                    error={errors[index === 0 ? "guardian_0_relation" : "guardian_1_relation"]}
                    styles={inputStyles}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Mobile No"
                    type="text"
                    placeholder="Enter mobile number"
                    value={guardian.contact}
                    onChange={(e) => handleGuardianChange(guardian.id, "contact", e.target.value)}
                    required={index === 0}
                    withAsterisk={index === 0}
                    size="md"
                    maxLength={10}
                    error={errors[index === 0 ? "guardian_0_contact" : "guardian_1_contact"]}
                    styles={inputStyles}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Email"
                    type="email"
                    placeholder="parent@example.com"
                    value={guardian.email}
                    onChange={(e) => handleGuardianChange(guardian.id, "email", e.target.value)}
                    required={index === 0}
                    withAsterisk={index === 0}
                    size="md"
                    error={errors[index === 0 ? "guardian_0_email" : "guardian_1_email"]}
                    styles={inputStyles}
                  />
                </Grid.Col>
              </Grid>
            </Card>
          ))}
        </Stack>
      </Paper>
    </Stack>
  ),
);

export default GuardianContent;