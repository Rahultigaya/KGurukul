import GroupIcon from "@mui/icons-material/Group";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Groups2Icon from "@mui/icons-material/Groups2";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ForumIcon from "@mui/icons-material/Forum";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const FEATURES = [
  {
    icon: <GroupIcon sx={{ fontSize: 20 }} />,
    color: "#2563eb",
    bg: "#dbeafe",
    title: "30+ Yrs Expert Faculty",
    desc: "Learn directly from Prof. Santoush Chipdey with 30+ years of teaching legacy.",
  },
  {
    icon: <MenuBookIcon sx={{ fontSize: 20 }} />,
    color: "#16a34a",
    bg: "#dcfce7",
    title: "100% Practical Coding",
    desc: "Hands-on computer lab practice for real-world programming mastery.",
  },
  {
    icon: <Groups2Icon sx={{ fontSize: 20 }} />,
    color: "#f97316",
    bg: "#ffedd5",
    title: "Small Batch Size",
    desc: "Limited students per batch ensuring dedicated 1-on-1 attention.",
  },
  {
    icon: <AssignmentTurnedInIcon sx={{ fontSize: 20 }} />,
    color: "#ef4444",
    bg: "#fee2e2",
    title: "Regular Tests & Mocks",
    desc: "Weekly chapter tests, viva prep, and prelim exams for board top scores.",
  },
  {
    icon: <ForumIcon sx={{ fontSize: 20 }} />,
    color: "#7c3aed",
    bg: "#ede9fe",
    title: "Personalized Doubts",
    desc: "Continuous doubt clearing sessions until every concept is crystal clear.",
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 20 }} />,
    color: "#0d9488",
    bg: "#ccfbf1",
    title: "Proven 100% Results",
    desc: "Consistent 95%+ board scoring track record over decades in Thane.",
  },
];

export default function WhyChoose() {
  return (
    <section className="py-12 sm:py-16 bg-slate-50/30 border-y border-slate-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Heading */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Our Advantages
            </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight mt-3">
                Why Choose <span className="text-blue-600">KGurukul</span>?
            </h2>
            <p className="text-slate-500 text-base leading-relaxed max-w-sm">
              At KGurukul, we go beyond standard textbooks to nurture logic, problem-solving, and coding confidence. Through Prof. Santoush Chipdey's veteran pedagogy, personalized worksheets, and structured practical lab sessions, we bridge the gap between classroom theory and real-world execution.
            </p>
          </div>

          {/* Right Column: Compact Features Grid */}
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-x-6 gap-y-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group flex gap-3.5 items-start p-3.5 rounded-2xl bg-white border border-slate-100/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundColor: f.bg, color: f.color }}
                >
                  {f.icon}
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-blue-600 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    {f.desc}
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