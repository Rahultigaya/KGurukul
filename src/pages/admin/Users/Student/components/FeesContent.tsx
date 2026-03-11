// src\pages\admin\Users\Student\components\FeesContent.tsx

import React from "react";
import {
  Stack,
  Paper,
  Title,
  Grid,
  Text,
  Group,
  Radio,
  TextInput,
  NumberInput,
  Select,
  Divider,
  Badge,
} from "@mantine/core";
import { IconCurrencyRupee } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import type {
    Installment,
    StudentRegistrationData,
    ValidationErrors,
} from "../types";
import { selectDropdownStyles } from "../../../../../utils/dtStyles";

interface FeesProps {
  formData: StudentRegistrationData;
  handleInputChange: (field: string, value: any) => void;
  handleFullPaymentChange: (field: string, value: string | Date | null) => void;
  handleInstallmentChange: (
    index: number,
    field: keyof Installment,
    value: string | Date | null,
  ) => void;
  calculateDiscountPercentage: () => string | number;
  calculateFinalAmount: () => string;
  calculateInstallmentTotal: () => string;
  errors: ValidationErrors;
}

const datePickerStyles = {
  calendarHeader: { color: "white", backgroundColor: "#30345c" },
  calendarHeaderLevel: { color: "white" },
  calendarHeaderControl: { color: "white" },
  weekday: { color: "#cbd5e1" },
  day: { color: "white" },
};


const FeesContent = React.memo<FeesProps>(
  ({
    formData,
    handleInputChange,
    handleFullPaymentChange,
    handleInstallmentChange,
    calculateDiscountPercentage,
    calculateFinalAmount,
    calculateInstallmentTotal,
    errors,
  }) => (
    <Stack gap="md">
      {/* Fees Structure */}
      <Paper className="p-4 sm:p-6 border border-purple-500/30 bg-slate-700/50">
        <Title
          order={5}
          mb="md"
          className="text-purple-400 text-base sm:text-lg"
        >
          Fees Structure
        </Title>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <NumberInput
              label="Total Fees"
              placeholder="Enter total fees"
              value={formData.totalFees}
              onChange={(value) =>
                handleInputChange("totalFees", value.toString())
              }
              leftSection={<IconCurrencyRupee size={16} />}
              min={0}
              required
              withAsterisk
              size="md"
              thousandSeparator=","
              error={errors.totalFees}
              classNames={{ label: "text-white mb-2" }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <NumberInput
              label="Discount Amount"
              placeholder="Enter discount"
              value={formData.discountAmount}
              onChange={(value) =>
                handleInputChange("discountAmount", value.toString())
              }
              leftSection={<IconCurrencyRupee size={16} />}
              min={0}
              size="md"
              error={errors.discountAmount}
              thousandSeparator=","
              classNames={{ label: "text-white mb-2" }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              label="Discount Percentage"
              value={`${calculateDiscountPercentage()}%`}
              readOnly
              size="md"
              classNames={{
                label: "text-white mb-2",
                input:
                  "bg-purple-500/10 border-purple-500/50 font-bold text-purple-300",
              }}
            />
          </Grid.Col>
        </Grid>

        {formData.totalFees && (
          <Paper className="p-4 mt-4 border border-green-500/50 bg-green-500/10">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <Text className="font-medium text-base sm:text-lg text-white">
                Final Amount to Pay:
              </Text>
              <Text className="text-lg sm:text-xl font-bold text-green-400">
                ₹{calculateFinalAmount()}
              </Text>
            </div>
          </Paper>
        )}

        <Divider my="lg" color="violet" />

        <div className="mb-3">
          <label className="text-white text-sm font-medium">
            Payment Type <span className="text-red-500">*</span>
          </label>
        </div>
        <Radio.Group
          value={formData.paymentType}
          onChange={(value) =>
            handleInputChange(
              "paymentType",
              value as "full" | "installment" | "later",
            )
          }
          required
          size="md"
        >
          <Stack gap="xs" className="sm:hidden">
            <Radio
              value="full"
              label="Full Payment"
              color="violet"
              classNames={{ label: "text-white" }}
            />
            <Radio
              value="installment"
              label="3 Installments"
              color="violet"
              classNames={{ label: "text-white" }}
            />
            <Radio
              value="later"
              label="Pay Later"
              color="violet"
              classNames={{ label: "text-white" }}
            />
          </Stack>
          <Group className="hidden sm:flex">
            <Radio
              value="full"
              label="Full Payment"
              color="violet"
              classNames={{ label: "text-white" }}
            />
            <Radio
              value="installment"
              label="3 Installments"
              color="violet"
              classNames={{ label: "text-white" }}
            />
            <Radio
              value="later"
              label="Pay Later"
              color="violet"
              classNames={{ label: "text-white" }}
            />
          </Group>
        </Radio.Group>

        {formData.paymentType === "later" && (
          <Paper className="p-4 mt-4 border border-yellow-500/50 bg-yellow-500/10">
            <Text className="text-yellow-300 text-sm">
              ⏳ Payment details can be added later. You can proceed with
              registration now.
            </Text>
          </Paper>
        )}
      </Paper>

      {/* Full Payment */}
      {formData.paymentType === "full" && (
        <Paper className="p-4 sm:p-6 border border-purple-500/30 bg-slate-700/50">
          <Title
            order={5}
            mb="md"
            className="text-purple-400 text-base sm:text-lg"
          >
            Payment Details
          </Title>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Amount"
                placeholder="Enter amount"
                value={formData.fullPayment.amount}
                onChange={(value) =>
                  handleFullPaymentChange("amount", value.toString())
                }
                leftSection={<IconCurrencyRupee size={16} />}
                required
                withAsterisk
                size="md"
                thousandSeparator=","
                error={errors["full_amount"]}
                classNames={{ label: "text-white mb-2" }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <DateInput
                label="Payment Date"
                placeholder="Select date"
                value={formData.fullPayment.date}
                onChange={(value) => handleFullPaymentChange("date", value)}
                required
                withAsterisk
                size="md"
                error={errors["full_date"]}
                onKeyDown={(e) => e.preventDefault()}
                classNames={{ label: "text-white mb-2" }}
                popoverProps={{
                  styles: { dropdown: { backgroundColor: "#30345c" } },
                }}
                styles={datePickerStyles}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Payment Mode"
                placeholder="Select Mode"
                value={formData.fullPayment.mode}
                onChange={(value) =>
                  handleFullPaymentChange("mode", value || "")
                }
                data={[
                  { value: "Cash", label: "Cash" },
                  { value: "Cheque", label: "Cheque" },
                  { value: "Online", label: "Online" },
                ]}
                required
                withAsterisk
                size="md"
                error={errors["full_mode"]}
                classNames={{ label: "text-white mb-2" }}
                {...selectDropdownStyles}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Bank Name"
                placeholder="Enter bank name (if applicable)"
                value={formData.fullPayment.bankName}
                onChange={(e) =>
                  handleFullPaymentChange("bankName", e.target.value)
                }
                size="md"
                classNames={{ label: "text-white mb-2" }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Paid To"
                placeholder="Select Account"
                value={formData.fullPayment.paidTo}
                onChange={(value) =>
                  handleFullPaymentChange("paidTo", value || "")
                }
                data={[
                  { value: "Sir Account", label: "Sir Account" },
                  { value: "Ma'am Account", label: "Ma'am Account" },
                ]}
                required
                withAsterisk
                size="md"
                error={errors["full_paidTo"]}
                classNames={{ label: "text-white mb-2" }}
                {...selectDropdownStyles}
              />
            </Grid.Col>
          </Grid>
        </Paper>
      )}

      {/* Installments */}
      {formData.paymentType === "installment" && (
        <Stack gap="md">
          <Paper className="p-3 border border-blue-500/30 bg-blue-500/10">
            <Text size="sm" className="text-blue-300">
              💡 At least 1 installment is required. Installments 2 and 3 are
              optional — only fill them if payment has been made.
            </Text>
          </Paper>

          {formData.installments.map((installment, index) => (
            <Paper
              key={index}
              className="p-4 sm:p-6 border border-purple-500/30 bg-slate-700/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Title
                  order={5}
                  className="text-purple-400 text-base sm:text-lg"
                >
                  Installment {index + 1}
                </Title>
                {index === 0 ? (
                  <Badge color="red" size="sm" variant="light">
                    Required
                  </Badge>
                ) : (
                  <Badge color="gray" size="sm" variant="light">
                    Optional
                  </Badge>
                )}
              </div>
              <Grid gutter="md" mt="xs">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Amount"
                    placeholder="Enter amount"
                    value={installment.amount}
                    onChange={(value) =>
                      handleInstallmentChange(index, "amount", value.toString())
                    }
                    leftSection={<IconCurrencyRupee size={16} />}
                    required={index === 0}
                    withAsterisk={index === 0}
                    size="md"
                    thousandSeparator=","
                    error={errors[`inst_${index}_amount`]}
                    classNames={{ label: "text-white mb-2" }}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <DateInput
                    label="Payment Date"
                    placeholder="Select date"
                    value={installment.date}
                    onChange={(value) =>
                      handleInstallmentChange(index, "date", value)
                    }
                    required={index === 0}
                    withAsterisk={index === 0}
                    size="md"
                    error={errors[`inst_${index}_date`]}
                    onKeyDown={(e) => e.preventDefault()}
                    classNames={{ label: "text-white mb-2" }}
                    popoverProps={{
                      styles: { dropdown: { backgroundColor: "#30345c" } },
                    }}
                    styles={datePickerStyles}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Select
                    label="Payment Mode"
                    placeholder="Select Mode"
                    value={installment.mode}
                    onChange={(value) =>
                      handleInstallmentChange(index, "mode", value || "")
                    }
                    data={[
                      { value: "Cash", label: "Cash" },
                      { value: "Cheque", label: "Cheque" },
                      { value: "Online", label: "Online" },
                    ]}
                    required={index === 0}
                    withAsterisk={index === 0}
                    size="md"
                    error={errors[`inst_${index}_mode`]}
                    classNames={{ label: "text-white mb-2" }}
                    {...selectDropdownStyles}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Bank Name"
                    placeholder="Bank name (if applicable)"
                    value={installment.bankName}
                    onChange={(e) =>
                      handleInstallmentChange(index, "bankName", e.target.value)
                    }
                    size="md"
                    classNames={{ label: "text-white mb-2" }}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Select
                    label="Paid To"
                    placeholder="Select Account"
                    value={installment.paidTo}
                    onChange={(value) =>
                      handleInstallmentChange(index, "paidTo", value || "")
                    }
                    data={[
                      { value: "Sir Account", label: "Sir Account" },
                      { value: "Ma'am Account", label: "Ma'am Account" },
                    ]}
                    required={index === 0}
                    withAsterisk={index === 0}
                    size="md"
                    error={errors[`inst_${index}_paidTo`]}
                    classNames={{ label: "text-white mb-2" }}
                    {...selectDropdownStyles}
                  />
                </Grid.Col>
              </Grid>
            </Paper>
          ))}

          <Paper className="p-4 border border-blue-500/50 bg-blue-500/10">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <Text className="font-medium text-white text-base sm:text-lg">
                Total from Installments:
              </Text>
              <Text className="text-lg sm:text-xl font-bold text-blue-400">
                ₹{calculateInstallmentTotal()}
              </Text>
            </div>
          </Paper>
        </Stack>
      )}
    </Stack>
  ),
);

export default FeesContent;
