//src\pages\admin\Users\Student\components\GuardianContent.tsx

import React from "react";
import {
  Stack,
  Paper,
  Title,
  Grid,
  Card,
  Badge,
  ActionIcon,
  Button,
  TextInput,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import type {
    GuardianDetails,
    StudentRegistrationData,
    ValidationErrors,
} from "../types";

interface GuardianProps {
  formData: StudentRegistrationData;
  handleGuardianChange: (
    id: string,
    field: keyof GuardianDetails,
    value: string,
  ) => void;
  addGuardian: () => void;
  removeGuardian: (id: string) => void;
  errors: ValidationErrors;
}

const GuardianContent = React.memo<GuardianProps>(
  ({ formData, handleGuardianChange, addGuardian, removeGuardian, errors }) => (
    <Stack gap="md">
      <Paper className="p-4 sm:p-6 border border-purple-500/30 bg-slate-700/50">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <Title order={5} className="text-purple-400 text-base sm:text-lg">
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

        <Stack gap="md">
          {formData.guardians.map((guardian, index) => (
            <Card
              key={guardian.id}
              className="p-4 sm:p-6 border border-purple-500/30 bg-slate-700/30"
            >
              <div className="flex justify-between items-start mb-4 gap-2">
                <Badge
                  color={index === 0 ? "violet" : "gray"}
                  size="lg"
                  variant="light"
                  className="text-xs sm:text-sm"
                >
                  {index === 0
                    ? "Guardian 1 (Required)"
                    : "Guardian 2 (Optional)"}
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

              <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Guardian Name"
                    placeholder="Enter name"
                    value={guardian.name}
                    onChange={(e) =>
                      handleGuardianChange(guardian.id, "name", e.target.value)
                    }
                    required={index === 0}
                    withAsterisk={index === 0}
                    size="md"
                    error={
                      index === 0
                        ? errors["guardian_0_name"]
                        : errors["guardian_1_name"]
                    }
                    classNames={{ label: "text-white mb-2" }}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Relation"
                    placeholder="Enter relation"
                    value={guardian.relation}
                    onChange={(e) =>
                      handleGuardianChange(
                        guardian.id,
                        "relation",
                        e.target.value,
                      )
                    }
                    required={index === 0}
                    withAsterisk={index === 0}
                    size="md"
                    error={
                      index === 0
                        ? errors["guardian_0_relation"]
                        : errors["guardian_1_relation"]
                    }
                    classNames={{ label: "text-white mb-2" }}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Mobile No"
                    type="text"
                    placeholder="Enter mobile number"
                    value={guardian.contact}
                    onChange={(e) =>
                      handleGuardianChange(
                        guardian.id,
                        "contact",
                        e.target.value,
                      )
                    }
                    required={index === 0}
                    withAsterisk={index === 0}
                    size="md"
                    maxLength={10}
                    error={
                      index === 0
                        ? errors["guardian_0_contact"]
                        : errors["guardian_1_contact"]
                    }
                    classNames={{ label: "text-white mb-2" }}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Email"
                    type="email"
                    placeholder="parent@example.com"
                    value={guardian.email}
                    onChange={(e) =>
                      handleGuardianChange(guardian.id, "email", e.target.value)
                    }
                    required={index === 0}
                    withAsterisk={index === 0}
                    size="md"
                    error={
                      index === 0
                        ? errors["guardian_0_email"]
                        : errors["guardian_1_email"]
                    }
                    classNames={{ label: "text-white mb-2" }}
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
