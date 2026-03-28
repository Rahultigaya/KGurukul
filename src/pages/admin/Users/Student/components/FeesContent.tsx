// src\pages\admin\Users\Student\components\FeesContent.tsx

import React from "react";
import {
  Stack, Paper, Title, Grid, Text, Group,
  Radio, TextInput, NumberInput, Select, Divider, Badge,
} from "@mantine/core";
import { IconCurrencyRupee } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import type { Installment, StudentRegistrationData, ValidationErrors } from "../types";

interface FeesProps {
  formData: StudentRegistrationData;
  handleInputChange: (field: string, value: any) => void;
  handleFullPaymentChange: (field: string, value: string | Date | null) => void;
  handleInstallmentChange: (index: number, field: keyof Installment, value: string | Date | null) => void;
  calculateDiscountPercentage: () => string | number;
  calculateFinalAmount: () => string;
  calculateInstallmentTotal: () => string;
  errors: ValidationErrors;
}

// ── Shared style builders (read CSS vars at render time) ──────────────────────

const inputStyles = {
  label: { color: "var(--text-primary)",   marginBottom: 6 },
  input: { backgroundColor: "var(--bg-input)", color: "var(--text-primary)", borderColor: "var(--border-default)" },
};

const dateStyles = {
  ...inputStyles,
  calendarHeader:        { color: "var(--text-primary)", backgroundColor: "var(--bg-secondary)" },
  calendarHeaderLevel:   { color: "var(--text-primary)" },
  calendarHeaderControl: { color: "var(--text-primary)" },
  weekday:               { color: "var(--text-secondary)" },
  day:                   { color: "var(--text-primary)"  },
};

const datePopover = {
  styles: { dropdown: { backgroundColor: "var(--bg-secondary)" } },
};

const selectDropdownStyles = {
  comboboxProps: {
    styles: {
      dropdown: {
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-accent)",
        color: "var(--text-primary)",
      },
    },
  },
  styles: {
    ...inputStyles,
    option: { color: "var(--text-primary)", backgroundColor: "var(--bg-secondary)" },
  },
};

const radioLabel = { styles: { label: { color: "var(--text-primary)" } } };

// ── Component ─────────────────────────────────────────────────────────────────

const FeesContent = React.memo<FeesProps>(({
  formData, handleInputChange, handleFullPaymentChange,
  handleInstallmentChange, calculateDiscountPercentage,
  calculateFinalAmount, calculateInstallmentTotal, errors,
}) => (
  <Stack gap="md">

    {/* ── Fees Structure ──────────────────────────────────────────── */}
    <Paper className="p-4 sm:p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)" }}>
      <Title order={5} mb="md" style={{ color: "var(--text-accent)", fontSize: "clamp(14px,2vw,18px)" }}>
        Fees Structure
      </Title>

      <Grid gutter="md">
        {/* Total Fees */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <NumberInput
            label="Total Fees"
            placeholder="Enter total fees"
            value={formData.totalFees}
            onChange={(value) => handleInputChange("totalFees", value.toString())}
            leftSection={<IconCurrencyRupee size={16} style={{ color: "var(--text-muted)" }} />}
            min={0} required withAsterisk size="md" thousandSeparator=","
            error={errors.totalFees} styles={inputStyles}
          />
        </Grid.Col>

        {/* Discount Amount */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <NumberInput
            label="Discount Amount"
            placeholder="Enter discount"
            value={formData.discountAmount}
            onChange={(value) => handleInputChange("discountAmount", value.toString())}
            leftSection={<IconCurrencyRupee size={16} style={{ color: "var(--text-muted)" }} />}
            min={0} size="md" thousandSeparator=","
            error={errors.discountAmount} styles={inputStyles}
          />
        </Grid.Col>

        {/* Discount % — read-only highlight */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <TextInput
            label="Discount Percentage"
            value={`${calculateDiscountPercentage()}%`}
            readOnly size="md"
            styles={{
              label: { color: "var(--text-primary)", marginBottom: 6 },
              input: {
                backgroundColor: "rgba(124,58,237,0.08)",
                borderColor: "rgba(124,58,237,0.35)",
                color: "var(--text-accent)",
                fontWeight: 700,
              },
            }}
          />
        </Grid.Col>
      </Grid>

      {/* Final amount banner */}
      {formData.totalFees && (
        <Paper className="p-4 mt-4" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.35)" }}>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Text className="font-medium text-base sm:text-lg" style={{ color: "var(--text-primary)" }}>
              Final Amount to Pay:
            </Text>
            <Text className="text-lg sm:text-xl font-bold text-green-500">
              ₹{calculateFinalAmount()}
            </Text>
          </div>
        </Paper>
      )}

      <Divider my="lg" color="var(--border-accent)" />

      {/* Payment Type radio */}
      <div className="mb-3">
        <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          Payment Type <span className="text-red-500">*</span>
        </label>
      </div>
      <Radio.Group
        value={formData.paymentType}
        onChange={(value) => handleInputChange("paymentType", value as "full" | "installment" | "later")}
        required size="md"
      >
        <Stack gap="xs" className="sm:hidden">
          <Radio value="full"        label="Full Payment"   color="violet" {...radioLabel} />
          <Radio value="installment" label="3 Installments" color="violet" {...radioLabel} />
          <Radio value="later"       label="Pay Later"      color="violet" {...radioLabel} />
        </Stack>
        <Group className="hidden sm:flex">
          <Radio value="full"        label="Full Payment"   color="violet" {...radioLabel} />
          <Radio value="installment" label="3 Installments" color="violet" {...radioLabel} />
          <Radio value="later"       label="Pay Later"      color="violet" {...radioLabel} />
        </Group>
      </Radio.Group>

      {/* Pay later notice */}
      {formData.paymentType === "later" && (
        <Paper className="p-4 mt-4" style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.35)" }}>
          <Text size="sm" style={{ color: "#eab308" }}>
            ⏳ Payment details can be added later. You can proceed with registration now.
          </Text>
        </Paper>
      )}
    </Paper>

    {/* ── Full Payment ────────────────────────────────────────────── */}
    {formData.paymentType === "full" && (
      <Paper className="p-4 sm:p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)" }}>
        <Title order={5} mb="md" style={{ color: "var(--text-accent)", fontSize: "clamp(14px,2vw,18px)" }}>
          Payment Details
        </Title>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Amount" placeholder="Enter amount"
              value={formData.fullPayment.amount}
              onChange={(value) => handleFullPaymentChange("amount", value.toString())}
              leftSection={<IconCurrencyRupee size={16} style={{ color: "var(--text-muted)" }} />}
              required withAsterisk size="md" thousandSeparator=","
              error={errors["full_amount"]} styles={inputStyles}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <DateInput
              label="Payment Date" placeholder="Select date"
              value={formData.fullPayment.date}
              onChange={(value) => handleFullPaymentChange("date", value)}
              required withAsterisk size="md"
              error={errors["full_date"]} onKeyDown={(e) => e.preventDefault()}
              popoverProps={datePopover} styles={dateStyles}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Select
              label="Payment Mode" placeholder="Select Mode"
              value={formData.fullPayment.mode}
              onChange={(value) => handleFullPaymentChange("mode", value || "")}
              data={[{ value: "Cash", label: "Cash" }, { value: "Cheque", label: "Cheque" }, { value: "Online", label: "Online" }]}
              required withAsterisk size="md"
              error={errors["full_mode"]} {...selectDropdownStyles}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              label="Bank Name" placeholder="Enter bank name (if applicable)"
              value={formData.fullPayment.bankName}
              onChange={(e) => handleFullPaymentChange("bankName", e.target.value)}
              size="md" styles={inputStyles}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Select
              label="Paid To" placeholder="Select Account"
              value={formData.fullPayment.paidTo}
              onChange={(value) => handleFullPaymentChange("paidTo", value || "")}
              data={[{ value: "Sir Account", label: "Sir Account" }, { value: "Ma'am Account", label: "Ma'am Account" }]}
              required withAsterisk size="md"
              error={errors["full_paidTo"]} {...selectDropdownStyles}
            />
          </Grid.Col>
        </Grid>
      </Paper>
    )}

    {/* ── Installments ────────────────────────────────────────────── */}
    {formData.paymentType === "installment" && (
      <Stack gap="md">
        {/* Hint banner */}
        <Paper className="p-3" style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.3)" }}>
          <Text size="sm" style={{ color: "#60a5fa" }}>
            💡 At least 1 installment is required. Installments 2 and 3 are optional — only fill them if payment has been made.
          </Text>
        </Paper>

        {formData.installments.map((installment, index) => (
          <Paper key={index} className="p-4 sm:p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Title order={5} style={{ color: "var(--text-accent)", fontSize: "clamp(14px,2vw,18px)" }}>
                Installment {index + 1}
              </Title>
              {index === 0
                ? <Badge color="red"  size="sm" variant="light">Required</Badge>
                : <Badge color="gray" size="sm" variant="light">Optional</Badge>
              }
            </div>

            <Grid gutter="md" mt="xs">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <NumberInput
                  label="Amount" placeholder="Enter amount"
                  value={installment.amount}
                  onChange={(value) => handleInstallmentChange(index, "amount", value.toString())}
                  leftSection={<IconCurrencyRupee size={16} style={{ color: "var(--text-muted)" }} />}
                  required={index === 0} withAsterisk={index === 0} size="md" thousandSeparator=","
                  error={errors[`inst_${index}_amount`]} styles={inputStyles}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <DateInput
                  label="Payment Date" placeholder="Select date"
                  value={installment.date}
                  onChange={(value) => handleInstallmentChange(index, "date", value)}
                  required={index === 0} withAsterisk={index === 0} size="md"
                  error={errors[`inst_${index}_date`]} onKeyDown={(e) => e.preventDefault()}
                  popoverProps={datePopover} styles={dateStyles}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Select
                  label="Payment Mode" placeholder="Select Mode"
                  value={installment.mode}
                  onChange={(value) => handleInstallmentChange(index, "mode", value || "")}
                  data={[{ value: "Cash", label: "Cash" }, { value: "Cheque", label: "Cheque" }, { value: "Online", label: "Online" }]}
                  required={index === 0} withAsterisk={index === 0} size="md"
                  error={errors[`inst_${index}_mode`]} {...selectDropdownStyles}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput
                  label="Bank Name" placeholder="Bank name (if applicable)"
                  value={installment.bankName}
                  onChange={(e) => handleInstallmentChange(index, "bankName", e.target.value)}
                  size="md" styles={inputStyles}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Select
                  label="Paid To" placeholder="Select Account"
                  value={installment.paidTo}
                  onChange={(value) => handleInstallmentChange(index, "paidTo", value || "")}
                  data={[{ value: "Sir Account", label: "Sir Account" }, { value: "Ma'am Account", label: "Ma'am Account" }]}
                  required={index === 0} withAsterisk={index === 0} size="md"
                  error={errors[`inst_${index}_paidTo`]} {...selectDropdownStyles}
                />
              </Grid.Col>
            </Grid>
          </Paper>
        ))}

        {/* Installment total banner */}
        <Paper className="p-4" style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.4)" }}>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Text className="font-medium text-base sm:text-lg" style={{ color: "var(--text-primary)" }}>
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
));

export default FeesContent;