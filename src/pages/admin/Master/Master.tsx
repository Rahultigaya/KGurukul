// src/pages/admin/Master/Master.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../../components/PageHeader";
import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

interface MasterCard {
  title: string;
  manageText: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  iconBg: string;
}

const Master: React.FC = () => {
  const navigate = useNavigate();

  const masterCards: MasterCard[] = [
    {
      title: "Area Management",
      manageText: "Manage Area",
      description: "Manage different geographic areas for your branches",
      icon: <LocationOnIcon />,
      path: "/master/area",
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
    },
    {
      title: "Branch Management",
      manageText: "Manage Branch",
      description: "Manage branches within your areas",
      icon: <BusinessIcon />,
      path: "/master/branch",
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
    },
    {
      title: "Standard Management",
      manageText: "Manage Standard",
      description: "Manage educational standards and grades",
      icon: <SchoolIcon />,
      path: "/master/standard",
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
    },
    {
      title: "Subject Management",
      manageText: "Manage Subject",
      description: "Manage educational subjects and courses",
      icon: <MenuBookIcon />,
      path: "/master/subject",
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ── Page Header ────────────────────────────────────────────────── */}
      <PageHeader
        title="Master Management"
        subtitle="Manage your organization's master data (Areas, Branches, Standards, and Subjects)"
      />

      {/* ── Cards Grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {masterCards.map((card) => (
          <Card
            key={card.title}
            elevation={1}
            className="bg-white border border-slate-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            <CardContent className="!p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Heading against Icon */}
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}>
                    {card.icon}
                  </div>
                  <Typography
                    variant="h6"
                    className="!font-bold text-slate-800 !text-base leading-snug"
                  >
                    {card.title}
                  </Typography>
                </div>

                {/* Description */}
                <Typography variant="body2" className="text-slate-500 text-xs leading-relaxed">
                  {card.description}
                </Typography>
              </div>

              {/* Bottom Action Button (Redirects only on click) */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => navigate(card.path)}
                  className="flex items-center justify-between w-full text-blue-600 hover:text-blue-700 font-semibold text-sm group/btn transition-colors cursor-pointer"
                >
                  <span>{card.manageText}</span>
                  <ArrowForwardIcon fontSize="small" className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Master;
