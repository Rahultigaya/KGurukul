// src/pages/admin/Master/Master.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  IconBuildingFactory,
  IconBuilding,
  IconBooks,
  IconArrowRight,
} from "@tabler/icons-react";
import { useTheme } from "../../../context/ThemeContext";

interface MasterCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const Master: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const masterCards: MasterCard[] = [
    {
      title: "Area",
      description: "Manage different geographic areas for your branches",
      icon: <IconBuildingFactory size={32} />,
      path: "/master/area",
      color: "text-blue-400",
      bgColor: "bg-blue-500/15",
      borderColor: "border-blue-500/25",
    },
    {
      title: "Branch",
      description: "Manage branches within your areas",
      icon: <IconBuilding size={32} />,
      path: "/master/branch",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/15",
      borderColor: "border-violet-500/25",
    },
    {
      title: "Standard",
      description: "Manage educational standards and grades",
      icon: <IconBooks size={32} />,
      path: "/master/standard",
      color: "text-orange-400",
      bgColor: "bg-orange-500/15",
      borderColor: "border-orange-500/25",
    },
    {
      title: "Subject",
      description: "Manage educational Subjects",
      icon: <IconBooks size={32} />,
      path: "/master/subject",
      color: "text-pink-400",
      bgColor: "bg-pink-500/15",
      borderColor: "border-pink-500/25",
    },
  ];

  return (
    <div className="p-6 space-y-6" style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: "var(--accent-purple)" }}
        >
          <IconBooks size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            Master Management
          </h1>
          <p className="text-sm opacity-60" style={{ color: "var(--text-secondary)" }}>
            Manage your organization's master data
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {masterCards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.path)}
            className={`rounded-2xl p-6 cursor-pointer transition-all duration-300
              hover:scale-105 hover:shadow-xl border ${card.borderColor}
              ${card.bgColor} ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
            style={{
              background: isDark ? "var(--bg-secondary)" : "var(--bg-card)",
              borderColor: `var(--border-default)`,
            }}
          >
            {/* Title */}
            <h3 className={`text-xl font-bold mb-2 ${card.color}`}>
              {card.title}
            </h3>

            {/* Description */}
            <p className="text-sm opacity-70 mb-4" style={{ color: "var(--text-secondary)" }}>
              {card.description}
            </p>

            {/* Arrow */}
            <div className={`flex items-center gap-2 ${card.color} font-medium text-sm`}>
              <span>Manage {card.title}</span>
              <IconArrowRight size={18} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Master;
