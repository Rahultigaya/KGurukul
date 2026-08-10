import GroupIcon from "@mui/icons-material/Group";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Groups2Icon from "@mui/icons-material/Groups2";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ForumIcon from "@mui/icons-material/Forum";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const FEATURES = [
  {
    icon: <GroupIcon sx={{ fontSize: 44 }} />,
    color: "#2563eb",
    title: "Expert Faculty",
    desc: "Learn from experienced and certified instructors.",
  },
  {
    icon: <MenuBookIcon sx={{ fontSize: 44 }} />,
    color: "#16a34a",
    title: "Practical Learning",
    desc: "Hands-on projects for real world skills.",
  },
  {
    icon: <Groups2Icon sx={{ fontSize: 44 }} />,
    color: "#f97316",
    title: "Small Batch Size",
    desc: "Individual attention for every student.",
  },
  {
    icon: <AssignmentTurnedInIcon sx={{ fontSize: 44 }} />,
    color: "#ef4444",
    title: "Regular Tests",
    desc: "Weekly assessments and performance tracking.",
  },
  {
    icon: <ForumIcon sx={{ fontSize: 44 }} />,
    color: "#7c3aed",
    title: "Doubt Solving",
    desc: "Personalized doubt clearing sessions.",
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 44 }} />,
    color: "#0d9488",
    title: "Career Guidance",
    desc: "Guidance for future career and placements.",
  },
];

export default function WhyChoose() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">      
<div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
        <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 leading-tight">
          Why Choose <span className="text-blue-600">KGurukul's</span>?
        </h2>
        <p className="text-slate-500 mt-3 text-sm sm:text-base max-w-xl mx-auto">
          What makes our teaching different.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="group relative rounded-2xl border border-slate-100 bg-white hover:border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 px-5 py-7 text-center overflow-hidden"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(160deg, ${f.color}22 0%, transparent 60%)`,
              }}
            />

            <div
              className="relative mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{ color: f.color }}
            >
              {f.icon}
            </div>
            <p className="relative font-semibold text-slate-900 mb-1.5">
              {f.title}
            </p>
            <p className="relative  text-slate-500 leading-snug">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
    </section>
  );
}