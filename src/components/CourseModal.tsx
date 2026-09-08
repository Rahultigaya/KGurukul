import Dialog from "@mui/material/Dialog";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "@mui/material/Button";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
 import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import type { ComponentType } from "react";

export interface HighlightItem {
  title: string;
  subtitle: string;
}

export interface TopicItem {
  title: string;
  subtitle: string;
  icon: ComponentType<{ fontSize?: "small" | "medium" | "large"; className?: string }>;
  iconColor?: string;
}

export interface CourseDetail {
  class: string;
  name: string;
  description: string;
   highlights: HighlightItem[];
  images: string[];
  duration?: string;
  prerequisites?: string;
  topics: TopicItem[];
  showHighlights?: boolean;
}

interface CourseModalProps {
  course: CourseDetail | null;
  onClose: () => void;
  onEnroll: (courseName: string) => void;
}

export default function CourseModal({
  course,
  onClose,
  onEnroll,
}: CourseModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!course) return null;

  // Hide the highlights panel specifically for ICSE Class 9
  const hideHighlights = course.showHighlights === false;

  return (
    <Dialog
      open={Boolean(course)}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      slotProps={{
        paper: {
          sx: {
            borderRadius: isMobile ? 0 : 6,
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
            maxHeight: isMobile ? "100vh" : "92vh",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <div className="relative bg-white flex-1 flex flex-col min-h-0">
        {/* Top Close Button */}
        <IconButton
          onClick={onClose}
          aria-label="Close dialog"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "#64748b",
            bgcolor: "#f8fafc",
            border: "1px solid #f1f5f9",
            zIndex: 30,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            "&:hover": { bgcolor: "#f1f5f9" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-5 sm:p-8 pb-4 space-y-6 min-h-0">
          {/* Top Header Row */}
          <div className="grid md:grid-cols-12 gap-6 items-center pt-2">
            {/* Left information */}
            <div className="md:col-span-7 space-y-3.5">
              <div>
                <span className="inline-flex text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full text-white bg-blue-600">
                  {course.class} BOARD CURRICULUM
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black font-serif-display text-slate-900 leading-none">
                {course.name}
              </h3>

              <p className="text-base sm:text-lg font-bold text-blue-600 leading-none mt-1">
                {course.description.replace(/[()]/g, "")}
              </p>

              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                {course.class === "ICSE"
                  ? `A complete foundation course designed for ICSE ${course.name} students to build strong programming basics using Java.`
                  : `A comprehensive computer science course aligned with the board syllabus to excel in theory, practical labs, and boards.`}
              </p>
            </div>

            {/* Right illustration showcase */}
            <div className="md:col-span-5 flex justify-center items-center relative">
              <div className="absolute w-48 h-48 bg-blue-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />
              <img
                src={course.images[0]}
                alt={course.name}
                className="w-full max-w-[200px] sm:max-w-[240px] h-auto object-contain drop-shadow-xl transform transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* Banner badges block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-slate-100 rounded-2xl p-4 bg-slate-50/20">
            <div className="flex items-center gap-3 bg-white border border-slate-100/80 rounded-xl p-3 shadow-xs">
              <span className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <CalendarMonthIcon fontSize="small" />
              </span>
              <div>
                <p className="text-xs font-black text-slate-900 leading-tight">Full Academic Year Batch</p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">Covers complete syllabus</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white border border-slate-100/80 rounded-xl p-3 shadow-xs">
              <span className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MenuBookIcon fontSize="small" />
              </span>
              <div>
                <p className="text-xs font-black text-slate-900 leading-tight">{course.class} / Board Aligned</p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">Strictly as per board curriculum</p>
              </div>
            </div>
          </div>

          {/* Side-by-side details layout */}
          <div className="grid md:grid-cols-12 gap-6 items-stretch">
            {/* Left panel: highlights (hidden for ICSE Class 9) */}
            {!hideHighlights && (
              <div className="md:col-span-5 border border-slate-100 bg-slate-50/10 rounded-3xl p-5 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-600 mb-5 relative inline-block">
                    Key Highlights
                    <span className="absolute bottom-[-6px] left-0 h-[2px] w-8 bg-emerald-500 rounded" />
                  </h4>

                  <div className="space-y-4">
                    {course.highlights.map((h) => (
                      <div key={h.title} className="flex items-start gap-2.5">
                        <CheckCircleIcon className="text-emerald-500 shrink-0 mt-0.5 !text-lg" />
                        <div>
                          <p className="text-xs font-black text-slate-800 leading-snug">{h.title}</p>
                          <p className="text-[10px] font-bold text-slate-500 mt-0.5 leading-snug">{h.subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decorative dot array in the corner */}
                <div className="flex justify-end opacity-20 mt-6 pointer-events-none">
                  <div className="grid grid-cols-4 gap-[4px]">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <span key={i} className="h-[2.5px] w-[2.5px] rounded-full bg-slate-400" />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Right panel: syllabus stack */}
            <div className={hideHighlights ? "md:col-span-12 space-y-4" : "md:col-span-7 space-y-4"}>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-blue-600 mb-5 relative inline-block">
                  What Students Learn & Practice
                  <span className="absolute bottom-[-6px] left-0 h-[2px] w-8 bg-blue-500 rounded" />
                </h4>

                <div className="space-y-2.5">
                  {course.topics.map((t, idx) => {
                    const TopicIcon = t.icon;
                    return (
                      <div
                        key={t.title}
                        className="flex items-start justify-between gap-3 bg-white border border-slate-100 rounded-xl p-3 shadow-xs hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-black text-slate-800 leading-snug break-words">{t.title}</p>
                            <p className="text-[10px] font-bold text-slate-500 mt-0.5 leading-snug break-words">{t.subtitle}</p>
                          </div>
                        </div>

                        <div className="shrink-0 w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mt-0.5">
                          <TopicIcon fontSize="small" className={t.iconColor ?? "text-slate-500"} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          
        </div>

        {/* Sticky footer buttons area */}
        <div className="border-t border-slate-100 p-4 sm:p-6 bg-slate-50/60 flex justify-center sticky bottom-0 z-20">
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon sx={{ color: "#fff" }} />}
            onClick={() => {
              onClose();
              onEnroll(`${course.class} ${course.name}`);
            }}
            sx={{
              color: "#fff",
              "& .MuiButton-startIcon, & .MuiButton-endIcon": {
                color: "#fff",
              },
            }}
          >
            Enroll Now
          </Button>
        </div>
      </div>
    </Dialog>
  );
}