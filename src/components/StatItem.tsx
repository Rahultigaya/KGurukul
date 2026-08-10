interface StatItemProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  value: React.ReactNode;
  label: string;
  variant?: "row" | "card";
}

export default function StatItem({ icon, iconBg, iconColor, value, label, variant = "row" }: StatItemProps) {
  if (variant === "card") {
    return (
      <div className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          {icon}
        </div>
        <div className="leading-tight">
          <p className="text-xl font-bold text-slate-900">{value}</p>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        {icon}
      </div>
      <div className="leading-tight">
        <p className="text-lg font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}
