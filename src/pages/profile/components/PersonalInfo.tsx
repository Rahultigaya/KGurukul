// src/pages/profile/components/PersonalInfo.tsx
//
// Reusable section card with labeled info rows.
// Used by Admin, Student, Teacher profile pages for any section of details.

import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// InfoRow — single key/value row
// ─────────────────────────────────────────────────────────────────────────────

interface InfoRowProps {
  label: string;
  value: string;
  valueClass?: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  valueClass = "text-white",
}) => (
  <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-700/30 last:border-0">
    <span className="text-slate-500 text-xs font-medium uppercase tracking-wide shrink-0 mt-0.5">
      {label}
    </span>
    <span className={`text-sm font-medium text-right ${valueClass}`}>
      {value || "—"}
    </span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SectionCard — card wrapper with header icon + title
// ─────────────────────────────────────────────────────────────────────────────

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  iconColor?: string;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  icon,
  title,
  iconColor = "text-orange-400",
  children,
}) => (
  <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 overflow-hidden">
    <div className="px-5 py-3.5 border-b border-slate-700/50 flex items-center gap-2.5">
      <span className={iconColor}>{icon}</span>
      <h4 className="text-white font-semibold text-sm">{title}</h4>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PersonalInfo — convenience wrapper that renders a SectionCard with InfoRows
// ─────────────────────────────────────────────────────────────────────────────

export interface InfoField {
  label: string;
  value: string;
  valueClass?: string;
}

interface PersonalInfoProps {
  icon: React.ReactNode;
  title: string;
  iconColor?: string;
  fields: InfoField[];
  children?: React.ReactNode; // for extra custom content below the rows
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  icon,
  title,
  iconColor,
  fields,
  children,
}) => (
  <SectionCard icon={icon} title={title} iconColor={iconColor}>
    {fields.map((f) => (
      <InfoRow
        key={f.label}
        label={f.label}
        value={f.value}
        valueClass={f.valueClass}
      />
    ))}
    {children}
  </SectionCard>
);

export default PersonalInfo;
