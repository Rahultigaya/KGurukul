import HowToRegIcon from "@mui/icons-material/HowToReg";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CodeIcon from "@mui/icons-material/Code";
import AssignmentIcon from "@mui/icons-material/Assignment";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const STEPS = [
  {
    n: 1,
    icon: <HowToRegIcon />,
    bg: "#dcfce7",
    color: "#16a34a",
    title: "Enroll",
    desc: "Join your course",
  },
  {
    n: 2,
    icon: <MenuBookIcon />,
    bg: "#dbeafe",
    color: "#2563eb",
    title: "Learn Fundamentals",
    desc: "Build strong basics",
  },
  {
    n: 3,
    icon: <CodeIcon />,
    bg: "#ffedd5",
    color: "#f97316",
    title: "Practice with Projects",
    desc: "Apply your knowledge",
  },
  {
    n: 4,
    icon: <AssignmentIcon />,
    bg: "#fee2e2",
    color: "#ef4444",
    title: "Weekly Assessments",
    desc: "Track your progress",
  },
  {
    n: 5,
    icon: <RocketLaunchIcon />,
    bg: "#ede9fe",
    color: "#7c3aed",
    title: "Build Confidence",
    desc: "Improve with guidance",
  },
  {
    n: 6,
    icon: <EmojiEventsIcon />,
    bg: "#dcfce7",
    color: "#16a34a",
    title: "Achieve Success",
    desc: "Shape your future",
  },
];

export default function LearningJourney() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-slate-900 mb-12">
          Your <span className="text-blue-600">Learning</span> Journey With
          Us
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-y-8">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center">
              <div className="relative w-32 sm:w-36 text-center px-2">
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                  {s.n}
                </span>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: s.bg, color: s.color }}
                >
                  {s.icon}
                </div>
                <p className="font-semibold text-slate-900 text-sm">
                  {s.title}
                </p>
                <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <ArrowForwardIcon
                  sx={{ color: "#cbd5e1", mx: { xs: 0.5, sm: 1 } }}
                  className="hidden sm:block"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
