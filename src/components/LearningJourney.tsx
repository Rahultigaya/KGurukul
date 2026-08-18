import HowToRegIcon from "@mui/icons-material/HowToReg";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CodeIcon from "@mui/icons-material/Code";
import AssignmentIcon from "@mui/icons-material/Assignment";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const STEPS = [
  {
    n: 1,
    Icon: HowToRegIcon,
    bg: "#d1fae5",
    color: "#059669",
    title: "Enroll & Orientation",
    desc: "Select your course batch",
  },
  {
    n: 2,
    Icon: MenuBookIcon,
    bg: "#dbeafe",
    color: "#2563eb",
    title: "Master Fundamentals",
    desc: "Build strong core concepts",
  },
  {
    n: 3,
    Icon: CodeIcon,
    bg: "#fef3c7",
    color: "#d97706",
    title: "Hands-on Practical Labs",
    desc: "Write real code & programs",
  },
  {
    n: 4,
    Icon: AssignmentIcon,
    bg: "#fee2e2",
    color: "#e11d48",
    title: "Weekly Mock Tests",
    desc: "Track chapter performance",
  },
  {
    n: 5,
    Icon: RocketLaunchIcon,
    bg: "#ede9fe",
    color: "#7c3aed",
    title: "Prelim Exam Series",
    desc: "Practice board exam papers",
  },
  {
    n: 6,
    Icon: EmojiEventsIcon,
    bg: "#fef9c3",
    color: "#ca8a04",
    title: "Board Top Scores",
    desc: "100% Academic Excellence",
    finish: true,
  },
];

export default function LearningJourney() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 relative bg-white overflow-hidden">
      <style>{`
        @keyframes lj-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(202,138,4,0.35); }
          50% { box-shadow: 0 0 0 12px rgba(202,138,4,0); }
        }
        .lj-finish { animation: lj-pulse 2.2s ease-in-out infinite; }
        .lj-icon-wrap { transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
        .lj-card:hover .lj-icon-wrap { transform: scale(1.15) rotate(4deg); }
        .lj-card:hover .lj-title { color: #2563eb; }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Structured Roadmap
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight mt-3">
            Your <span className="text-blue-600">Learning Journey</span> With Us
          </h2>
          <p className="text-slate-500 mt-3 text-sm sm:text-base max-w-xl mx-auto">
            A step-by-step guided trail from enrollment to 95%+ board examination success.
          </p>
        </div>

        {/* ===== Desktop / tablet: trail ===== */}
        <div className="hidden lg:block relative pt-4 pb-6">
          {/* Connecting SVG line */}
          <svg
            className="absolute left-0 right-0 top-12 w-full h-12 -z-0"
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M 60 30 C 240 -10, 360 70, 540 30 S 840 -10, 1020 30 S 1140 60, 1160 30"
              stroke="#93c5fd"
              strokeWidth="2.5"
              strokeDasharray="8 8"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="relative flex items-start justify-between gap-4">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="lj-card group flex flex-col items-center text-center w-[15%]"
              >
                <div className="relative">
                  <span className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center ring-2 ring-white shadow-md">
                    {s.n}
                  </span>
                  <div
                    className={`lj-icon-wrap w-16 h-16 rounded-2xl flex items-center justify-center shadow-md ${
                      s.finish ? "lj-finish ring-2 ring-amber-400" : ""
                    }`}
                    style={{ backgroundColor: s.bg, color: s.color }}
                  >
                    <s.Icon sx={{ fontSize: "30px !important" }} />
                  </div>
                </div>
                <p className="lj-title font-bold text-slate-900 text-sm mt-4 transition-colors duration-200 leading-snug">
                  {s.title}
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Mobile & Tablet: vertical trail ===== */}
        <div className="lg:hidden relative pl-8 sm:pl-10">
          <div
            className="absolute left-[19px] sm:left-[23px] top-3 bottom-3 border-l-2 border-dashed border-blue-300"
          />
          <div className="flex flex-col gap-8">
            {STEPS.map((s) => (
              <div key={s.n} className="lj-card group relative flex items-start gap-4">
                <div className="relative shrink-0">
                  <span className="absolute -top-2 -right-2 z-10 w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white shadow-xs">
                    {s.n}
                  </span>
                  <div
                    className={`lj-icon-wrap w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                      s.finish ? "lj-finish" : ""
                    }`}
                    style={{ backgroundColor: s.bg, color: s.color }}
                  >
                    <s.Icon sx={{ fontSize: "22px !important" }} />
                  </div>
                </div>
                <div className="pt-1">
                  <p className="lj-title font-bold text-slate-900 text-base transition-colors duration-200">
                    {s.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}