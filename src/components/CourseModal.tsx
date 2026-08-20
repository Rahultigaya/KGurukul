import Dialog from "@mui/material/Dialog";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "@mui/material/Button";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CodeIcon from "@mui/icons-material/Code";
import CalculateIcon from "@mui/icons-material/Calculate";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import LoopIcon from "@mui/icons-material/Loop";
import StorageIcon from "@mui/icons-material/Storage";
import SettingsIcon from "@mui/icons-material/Settings";
 import TargetIcon from "@mui/icons-material/MyLocation";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export interface CourseDetail {
  class: string;
  name: string;
  description: string;
  details: string;
  images: string[];
  duration?: string;
  prerequisites?: string;
  topics?: string[];
  showHighlights?: boolean;
}
interface CourseModalProps {
  course: CourseDetail | null;
  onClose: () => void;
  onEnroll: (courseName: string) => void;
}

const getHighlightSubtitle = (point: string) => {
  const p = point.toLowerCase().trim();
  if (p.includes("java fundamentals")) return "Basics of Java and OOP concepts";
  if (p.includes("programming basics")) return "Logic building and problem solving";
  if (p.includes("school exam")) return "Important questions & exam tips";
  if (p.includes("practical coding")) return "Hands-on coding and assignments";

  if (p.includes("advanced java")) return "Advanced Java & object-oriented programming";
  if (p.includes("oop concepts")) return "Classes, constructors, and encapsulation";
  if (p.includes("prelim exam") || p.includes("prelim mocks")) return "Full-length board pattern rehearsals";
  if (p.includes("board exam")) return "10-years papers practice & scoring tips";

  if (p.includes("programming fundamentals")) return "Core algorithms and syntax basics";
  if (p.includes("practical preparation")) return "Lab manual completion and test cases";
  if (p.includes("annual exam")) return "Revision lectures & prep sheets";
  if (p.includes("regular assessment")) return "Weekly tests to evaluate concept clarity";

  if (p.includes("advanced programming")) return "Complex logic, data structures & recursion";
  if (p.includes("mock board")) return "Full syllabus timed tests";
  if (p.includes("viva preparation") || p.includes("viva prep")) return "Confidence training for examiner viva";

  return "Comprehensive syllabus coverage & practice";
};

const getTopicInfo = (topic: string) => {
  const t = topic.toLowerCase();

  if (t.includes("introduction to java") || t.includes("basics of programming")) {
    return {
      sub: "Understand Java environment, classes, objects, and basic OOP principles.",
      icon: <CodeIcon fontSize="small" className="text-blue-600" />
    };
  }
  if (t.includes("data types") || t.includes("variables")) {
    return {
      sub: "Learn different data types, variables, declarations, and operators in Java.",
      icon: <CalculateIcon fontSize="small" className="text-emerald-600" />
    };
  }
  if (t.includes("control structures") || t.includes("decision")) {
    return {
      sub: "Implement decision making and branching using conditional statements.",
      icon: <AccountTreeIcon fontSize="small" className="text-amber-600" />
    };
  }
  if (t.includes("iterative constructs") || t.includes("loops")) {
    return {
      sub: "Use loops to solve real-world programming problems efficiently.",
      icon: <LoopIcon fontSize="small" className="text-indigo-600" />
    };
  }

  if (t.includes("array") || t.includes("data structures")) {
    return {
      sub: "Master arrays, lists, stacks, queues, and other linear data structures.",
      icon: <StorageIcon fontSize="small" className="text-purple-600" />
    };
  }
  if (t.includes("oop") || t.includes("class") || t.includes("method")) {
    return {
      sub: "Structure clean, reusable modules using methods, constructors, and classes.",
      icon: <CodeIcon fontSize="small" className="text-blue-600" />
    };
  }
  if (t.includes("board") || t.includes("exam") || t.includes("prelim") || t.includes("mock")) {
    return {
      sub: "Solve mock exam papers and board revision questions to build confidence.",
      icon: <CheckCircleIcon fontSize="small" className="text-rose-600" />
    };
  }

  return {
    sub: "Deep dive into code logic, concept reviews, and practical programming exercises.",
    icon: <SettingsIcon fontSize="small" className="text-slate-500" />
  };
};

export default function CourseModal({
  course,
  onClose,
  onEnroll,
}: CourseModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!course) return null;

  const points = course.details
    .split("|")
    .map((p) => p.trim())
    .filter(Boolean);

  const topicsList = course.topics || [
    "Core Theory & Fundamentals",
    "Hands-on Lab Coding Practice",
    "Previous Board Exam Papers & Solutions",
    "Weekly Chapter Tests & Mock Prelims",
  ];

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
                    {points.map((pt) => {
                      const subtitle = getHighlightSubtitle(pt);
                      return (
                        <div key={pt} className="flex items-start gap-2.5">
                          <CheckCircleIcon className="text-emerald-500 shrink-0 mt-0.5 !text-lg" />
                          <div>
                            <p className="text-xs font-black text-slate-800 leading-snug">{pt}</p>
                            <p className="text-[10px] font-bold text-slate-500 mt-0.5 leading-snug">{subtitle}</p>
                          </div>
                        </div>
                      );
                    })}
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
                  {topicsList.slice(0, 4).map((t, idx) => {
                    const topicInfo = getTopicInfo(t);
                    return (
                      <div
                        key={idx}
                        className="flex items-start justify-between gap-3 bg-white border border-slate-100 rounded-xl p-3 shadow-xs hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-black text-slate-800 leading-snug break-words">{t}</p>
                            <p className="text-[10px] font-bold text-slate-500 mt-0.5 leading-snug break-words">{topicInfo.sub}</p>
                          </div>
                        </div>

                        <div className="shrink-0 w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mt-0.5">
                          {topicInfo.icon}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Target highlight info bar */}
          <div className="flex items-center gap-3.5 p-3.5 bg-blue-50/40 border border-blue-100 rounded-2xl">
            <span className="w-10 h-10 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
              <TargetIcon fontSize="small" />
            </span>
            <div>
              <p className="text-xs font-black text-blue-900 leading-tight">
                {course.class === "ICSE"
                  ? "Build a Strong Foundation in Java Programming"
                  : "Build a Strong Foundation in Computer Science"}
              </p>
              <p className="text-[10px] font-bold text-blue-700/80 mt-0.5 leading-tight">
                Boost your logic, coding, and problem-solving skills for a successful future.
              </p>
            </div>
          </div>
        </div>

        {/* Sticky footer buttons area */}
        <div className="border-t border-slate-100 p-4 sm:p-6 bg-slate-50/60 flex justify-center sticky bottom-0 z-20">
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => {
              onClose();
              onEnroll(`${course.class} ${course.name}`);
            }}
          >
            Enroll Now
          </Button>
        </div>
      </div>
    </Dialog>
  );
}