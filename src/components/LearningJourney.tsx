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
    title: "Enroll",
    desc: "Join your course",
  },
  {
    n: 2,
    Icon: MenuBookIcon,
    bg: "#dbeafe",
    color: "#2563eb",
    title: "Learn Fundamentals",
    desc: "Build strong basics",
  },
  {
    n: 3,
    Icon: CodeIcon,
    bg: "#fef3c7",
    color: "#d97706",
    title: "Practice with Projects",
    desc: "Apply your knowledge",
  },
  {
    n: 4,
    Icon: AssignmentIcon,
    bg: "#fee2e2",
    color: "#e11d48",
    title: "Weekly Assessments",
    desc: "Track your progress",
  },
  {
    n: 5,
    Icon: RocketLaunchIcon,
    bg: "#ede9fe",
    color: "#7c3aed",
    title: "Build Confidence",
    desc: "Improve with guidance",
  },
  {
    n: 6,
    Icon: EmojiEventsIcon,
    bg: "#fef9c3",
    color: "#ca8a04",
    title: "Achieve Success",
    desc: "Shape your future",
    finish: true,
  },
];

export default function LearningJourney() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 relative">
      <style>{`
   .lj-body { font-family: 'Inter', sans-serif; }
  @keyframes lj-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(202,138,4,0.35); }
    50% { box-shadow: 0 0 0 10px rgba(202,138,4,0); }
  }
  .lj-finish { animation: lj-pulse 2.2s ease-in-out infinite; }
  .lj-icon-wrap { transition: transform 0.3s ease; }
  .lj-card:hover .lj-icon-wrap { transform: scale(1.4); }
  .lj-card:hover .lj-title { color: #4f46e5; }
`}</style>
      <div className="max-w-8xl mx-auto px-5 sm:px-6 lg:px-8 lj-body relative z-10">
        {/* Eyebrow + heading */}
        <div className="text-center mb-16">

          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 leading-tight">
            Your <span className="text-blue-600">Learning Journey</span> With Us</h2>
          <p className="text-slate-500 mt-3 text-sm sm:text-base">
            A guided trail from your first login to a future you're proud of.
          </p>
        </div>

        {/* ===== Desktop / tablet: trail ===== */}
        <div className="hidden md:block relative pt-2 pb-4">
          {/* gently curving dashed trail, sits behind the waypoints */}
          <svg
            className="absolute left-0 right-0 top-8 w-full h-10 -z-0"
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M 40 30 C 220 -10, 340 70, 520 30 S 820 -10, 1000 30 S 1140 60, 1160 30"
              stroke="#c7d2fe"
              strokeWidth="2"
              strokeDasharray="7 7"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="relative flex items-start justify-between gap-2">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="lj-card group flex flex-col items-center text-center w-[16%] min-w-[110px]"
              >
                <div className="relative">
                  <span className="absolute -top-2 -right-2 z-10 w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    {s.n}
                  </span>
                  <div
                    className={`lj-icon-wrap w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-300 ${s.finish ? "lj-finish" : ""
                      }`}
                    style={{ backgroundColor: s.bg, color: s.color }}
                  >
                    <s.Icon sx={{ fontSize: "28px !important", width: 28, height: 28 }} />
                  </div>
                </div>
                <p className="lj-title font-semibold text-slate-900 text-sm mt-3 transition-colors duration-200">
                  {s.title}
                </p>
                <p className="text-xs text-slate-400 mt-1 leading-snug">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Mobile: vertical trail ===== */}
        <div className="md:hidden relative pl-9">
          <div
            className="absolute left-[19px] top-2 bottom-2 border-l-2 border-dashed"
            style={{ borderColor: "#c7d2fe" }}
          />
          <div className="flex flex-col gap-9">
            {STEPS.map((s) => (
              <div key={s.n} className="lj-card group relative flex items-start gap-4">
                <div className="relative shrink-0">
                  <span className="absolute -top-1.5 -right-1.5 z-10 w-4.5 h-4.5 w-[18px] h-[18px] rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    {s.n}
                  </span>
                  <div
                    className={`lj-icon-wrap w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300 ${s.finish ? "lj-finish" : ""
                      }`}
                    style={{ backgroundColor: s.bg, color: s.color }}
                  >
                    <s.Icon sx={{ fontSize: "22px !important", width: 22, height: 22 }} />
                  </div>
                </div>
                <div className="pt-1">
                  <p className="lj-title font-semibold text-slate-900 text-sm transition-colors duration-200">
                    {s.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">
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