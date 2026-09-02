// src/pages/admin/Users/Student/components/FeesContent.tsx

import React from "react";
import {
  Paper,
  Typography,
  TextField,
  Chip,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import { IconCurrencyRupee, IconCreditCard, IconCalendar, IconClock } from "@tabler/icons-react";
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

interface Option {
  value: string;
  label: string;
}

const PAYMENT_MODE_OPTIONS: Option[] = [
  { value: "Cash", label: "Cash" },
  { value: "Cheque", label: "Cheque" },
  { value: "Online", label: "Online" },
];

const PAID_TO_OPTIONS: Option[] = [
  { value: "Sir Account", label: "Sir Account" },
  { value: "Ma'am Account", label: "Ma'am Account" },
];

const inputSxSlate = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
  },
};

const inputSxWhite = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
  },
};

const formHelperSlotProps = { className: "!bg-transparent !m-0 !mt-1" };

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
  }) => {
    const formatDateForInput = (d: Date | string | null) => {
      if (!d) return "";
      if (typeof d === "string") return d.split("T")[0];
      return d.toISOString().split("T")[0];
    };

    return (
      <div className="space-y-6">
        {/* ── Fees Structure ──────────────────────────────────────────── */}
        <Paper
          elevation={1}
          className="p-5 sm:p-7 bg-white border border-slate-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all space-y-6"
        >
          <div className="border-l-4 border-blue-600 pl-3">
            <Typography variant="h6" className="!font-bold !text-slate-800 !text-base sm:!text-lg">
              Fees Structure
            </Typography>
            <Typography variant="caption" className="text-slate-500">
              Set total course fees, discount, and select payment model
            </Typography>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end">
            {/* 1. Total Fees */}
            <div>
              <TextField
                label="Total Fees *"
                placeholder="Enter total fees"
                type="number"
                size="small"
                variant="outlined"
                fullWidth
                value={formData.totalFees || ""}
                onChange={(e) => handleInputChange("totalFees", e.target.value)}
                error={Boolean(errors.totalFees)}
                helperText={errors.totalFees}
                slotProps={{
                  formHelperText: formHelperSlotProps,
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconCurrencyRupee size={16} className="text-slate-400" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={inputSxSlate}
              />
            </div>

            {/* 2. Discount Amount with % Badge on top right */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-700">Discount Amount</span>
                {Number(calculateDiscountPercentage()) > 0 && (
                  <span className="text-xs font-extrabold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200 shadow-sm">
                    {parseFloat(Number(calculateDiscountPercentage()).toFixed(2))}% OFF
                  </span>
                )}
              </div>
              <TextField
                placeholder="Enter discount"
                type="number"
                size="small"
                variant="outlined"
                fullWidth
                value={formData.discountAmount || ""}
                onChange={(e) => handleInputChange("discountAmount", e.target.value)}
                error={Boolean(errors.discountAmount)}
                helperText={errors.discountAmount}
                slotProps={{
                  formHelperText: formHelperSlotProps,
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconCurrencyRupee size={16} className="text-slate-400" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={inputSxSlate}
              />
            </div>

            {/* 3. Net Payable Amount Card Block */}
            <div>
              <div className="p-2.5 sm:p-3 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                    Net Payable Amount
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold text-emerald-700 leading-none mt-1">
                    ₹{calculateFinalAmount()}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-200/60 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-300/60">
                  ₹
                </div>
              </div>
            </div>
          </div>

          {/* ── Payment Type Selection Compact Card Buttons ─────────────────────────────── */}
          <div className="pt-2">
            <Typography variant="body2" className="!font-bold !text-slate-700 mb-2.5 block">
              Payment Type Selection *
            </Typography>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Full Payment Card Button */}
              <div
                onClick={() => handleInputChange("paymentType", "full")}
                className={`px-3.5 py-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  formData.paymentType === "full"
                    ? "border-blue-600 bg-blue-50/90 shadow-sm ring-1 ring-blue-200"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    formData.paymentType === "full"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <IconCreditCard size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-xs leading-tight ${formData.paymentType === "full" ? "text-blue-700" : "text-slate-800"}`}>
                    Full Payment
                  </div>
                  <div className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
                    Pay complete net amount
                  </div>
                </div>
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                    formData.paymentType === "full" ? "border-blue-600 bg-blue-600" : "border-slate-300"
                  }`}
                >
                  {formData.paymentType === "full" && <span className="w-1 h-1 rounded-full bg-white" />}
                </span>
              </div>

              {/* 3 Installments Card Button */}
              <div
                onClick={() => handleInputChange("paymentType", "installment")}
                className={`px-3.5 py-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  formData.paymentType === "installment"
                    ? "border-blue-600 bg-blue-50/90 shadow-sm ring-1 ring-blue-200"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    formData.paymentType === "installment"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <IconCalendar size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-xs leading-tight ${formData.paymentType === "installment" ? "text-blue-700" : "text-slate-800"}`}>
                    3 Installments
                  </div>
                  <div className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
                    Split into 3 payments
                  </div>
                </div>
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                    formData.paymentType === "installment" ? "border-blue-600 bg-blue-600" : "border-slate-300"
                  }`}
                >
                  {formData.paymentType === "installment" && <span className="w-1 h-1 rounded-full bg-white" />}
                </span>
              </div>

              {/* Pay Later Card Button */}
              <div
                onClick={() => handleInputChange("paymentType", "later")}
                className={`px-3.5 py-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  formData.paymentType === "later"
                    ? "border-blue-600 bg-blue-50/90 shadow-sm ring-1 ring-blue-200"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    formData.paymentType === "later"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <IconClock size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-xs leading-tight ${formData.paymentType === "later" ? "text-blue-700" : "text-slate-800"}`}>
                    Pay Later
                  </div>
                  <div className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
                    Collect payment later
                  </div>
                </div>
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                    formData.paymentType === "later" ? "border-blue-600 bg-blue-600" : "border-slate-300"
                  }`}
                >
                  {formData.paymentType === "later" && <span className="w-1 h-1 rounded-full bg-white" />}
                </span>
              </div>
            </div>
          </div>
        </Paper>

        {/* ── Full Payment Details ──────────────────────────────────────── */}
        {formData.paymentType === "full" && (
          <Paper
            elevation={1}
            className="p-5 sm:p-7 bg-white border border-slate-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all space-y-5"
          >
            <div className="border-l-4 border-blue-600 pl-3">
              <Typography variant="h6" className="!font-bold !text-slate-800 !text-base sm:!text-lg">
                Full Payment Details
              </Typography>
              <Typography variant="caption" className="text-slate-500">
                Enter payment amount, mode, date and receiver account
              </Typography>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <TextField
                    label="Amount *"
                    type="number"
                    placeholder="Enter amount"
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formData.fullPayment.amount || ""}
                    onChange={(e) => handleFullPaymentChange("amount", e.target.value)}
                    error={Boolean(errors["full_amount"])}
                    helperText={errors["full_amount"]}
                    slotProps={{
                      formHelperText: formHelperSlotProps,
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconCurrencyRupee size={16} className="text-slate-400" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={inputSxSlate}
                  />
                </div>

                <div>
                  <TextField
                    label="Payment Date *"
                    type="date"
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formatDateForInput(formData.fullPayment.date)}
                    onChange={(e) =>
                      handleFullPaymentChange("date", e.target.value ? new Date(e.target.value) : null)
                    }
                    error={Boolean(errors["full_date"])}
                    helperText={errors["full_date"]}
                    slotProps={{
                      inputLabel: { shrink: true },
                      formHelperText: formHelperSlotProps,
                    }}
                    sx={inputSxSlate}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Payment Mode Autocomplete Dropdown */}
                <div>
                  <Autocomplete
                    options={PAYMENT_MODE_OPTIONS}
                    getOptionLabel={(option) => option.label}
                    value={PAYMENT_MODE_OPTIONS.find((opt) => opt.value === formData.fullPayment.mode) || null}
                    onChange={(_e, newValue) =>
                      handleFullPaymentChange("mode", newValue ? newValue.value : "")
                    }
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Payment Mode *"
                        error={Boolean(errors["full_mode"])}
                        helperText={errors["full_mode"]}
                        sx={inputSxSlate}
                      />
                    )}
                  />
                </div>

                <div>
                  <TextField
                    label="Bank Name"
                    placeholder="Enter bank name (if applicable)"
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={formData.fullPayment.bankName || ""}
                    onChange={(e) => handleFullPaymentChange("bankName", e.target.value)}
                    sx={inputSxSlate}
                  />
                </div>

                {/* Paid To Autocomplete Dropdown */}
                <div>
                  <Autocomplete
                    options={PAID_TO_OPTIONS}
                    getOptionLabel={(option) => option.label}
                    value={PAID_TO_OPTIONS.find((opt) => opt.value === formData.fullPayment.paidTo) || null}
                    onChange={(_e, newValue) =>
                      handleFullPaymentChange("paidTo", newValue ? newValue.value : "")
                    }
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Paid To *"
                        error={Boolean(errors["full_paidTo"])}
                        helperText={errors["full_paidTo"]}
                        sx={inputSxSlate}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </Paper>
        )}

        {/* ── Installments Card Container ─────────────────────────────── */}
        {formData.paymentType === "installment" && (
          <Paper
            elevation={1}
            className="p-5 sm:p-7 bg-white border border-slate-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all space-y-6"
          >
            {/* Card Header & Embedded Notice Banner */}
            <div className="space-y-3">
              <div className="border-l-4 border-blue-600 pl-3">
                <Typography variant="h6" className="!font-bold !text-slate-800 !text-base sm:!text-lg">
                  Installment Payment Plan
                </Typography>
                <Typography variant="caption" className="text-slate-500">
                  Fill collected installment details below
                </Typography>
              </div>

              {/* Notice tip box embedded inside the card */}
              <div className="p-3.5 bg-blue-50/80 border border-blue-200/90 rounded-xl flex items-start gap-2.5">
                <span className="text-base">💡</span>
                <p className="text-xs sm:text-sm text-blue-900 leading-snug font-normal">
                  <strong className="font-semibold text-blue-950">At least 1 installment is required.</strong>{" "}
                  Installments 2 and 3 are optional — fill them if payment has been collected.
                </p>
              </div>
            </div>

            {/* Installments forms inside card */}
            <div className="space-y-5">
              {formData.installments.map((installment, index) => (
                <div
                  key={index}
                  className="p-4 sm:p-5 bg-slate-50/80 border border-slate-200/90 rounded-xl space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Typography variant="h6" className="!font-bold !text-slate-800 !text-sm sm:!text-base">
                      Installment {index + 1}
                    </Typography>
                    <Chip
                      label={index === 0 ? "Required" : "Optional"}
                      color={index === 0 ? "error" : "default"}
                      size="small"
                      variant="outlined"
                      className="!font-semibold !text-[11px]"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <TextField
                          label={`Amount ${index === 0 ? "*" : ""}`}
                          type="number"
                          placeholder="Enter amount"
                          size="small"
                          variant="outlined"
                          fullWidth
                          value={installment.amount || ""}
                          onChange={(e) => handleInstallmentChange(index, "amount", e.target.value)}
                          error={Boolean(errors[`inst_${index}_amount`])}
                          helperText={errors[`inst_${index}_amount`]}
                          slotProps={{
                            formHelperText: formHelperSlotProps,
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <IconCurrencyRupee size={16} className="text-slate-400" />
                                </InputAdornment>
                              ),
                            },
                          }}
                          sx={inputSxWhite}
                        />
                      </div>

                      <div>
                        <TextField
                          label={`Payment Date ${index === 0 ? "*" : ""}`}
                          type="date"
                          size="small"
                          variant="outlined"
                          fullWidth
                          value={formatDateForInput(installment.date)}
                          onChange={(e) =>
                            handleInstallmentChange(
                              index,
                              "date",
                              e.target.value ? new Date(e.target.value) : null
                            )
                          }
                          error={Boolean(errors[`inst_${index}_date`])}
                          helperText={errors[`inst_${index}_date`]}
                          slotProps={{
                            inputLabel: { shrink: true },
                            formHelperText: formHelperSlotProps,
                          }}
                          sx={inputSxWhite}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Payment Mode Autocomplete Dropdown */}
                      <div>
                        <Autocomplete
                          options={PAYMENT_MODE_OPTIONS}
                          getOptionLabel={(option) => option.label}
                          value={PAYMENT_MODE_OPTIONS.find((opt) => opt.value === installment.mode) || null}
                          onChange={(_e, newValue) =>
                            handleInstallmentChange(index, "mode", newValue ? newValue.value : "")
                          }
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          size="small"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={`Payment Mode ${index === 0 ? "*" : ""}`}
                              error={Boolean(errors[`inst_${index}_mode`])}
                              helperText={errors[`inst_${index}_mode`]}
                              sx={inputSxWhite}
                            />
                          )}
                        />
                      </div>

                      <div>
                        <TextField
                          label="Bank Name"
                          placeholder="Bank name (if applicable)"
                          size="small"
                          variant="outlined"
                          fullWidth
                          value={installment.bankName || ""}
                          onChange={(e) => handleInstallmentChange(index, "bankName", e.target.value)}
                          sx={inputSxWhite}
                        />
                      </div>

                      {/* Paid To Autocomplete Dropdown */}
                      <div>
                        <Autocomplete
                          options={PAID_TO_OPTIONS}
                          getOptionLabel={(option) => option.label}
                          value={PAID_TO_OPTIONS.find((opt) => opt.value === installment.paidTo) || null}
                          onChange={(_e, newValue) =>
                            handleInstallmentChange(index, "paidTo", newValue ? newValue.value : "")
                          }
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          size="small"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={`Paid To ${index === 0 ? "*" : ""}`}
                              error={Boolean(errors[`inst_${index}_paidTo`])}
                              helperText={errors[`inst_${index}_paidTo`]}
                              sx={inputSxWhite}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Total Summary Banner */}
            <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-xl flex justify-between items-center shadow-sm">
              <span className="text-slate-800 font-semibold text-sm">
                Total Collected from Installments:
              </span>
              <span className="text-blue-700 font-bold text-lg">
                ₹{calculateInstallmentTotal()}
              </span>
            </div>
          </Paper>
        )}
      </div>
    );
  }
);

export default FeesContent;
