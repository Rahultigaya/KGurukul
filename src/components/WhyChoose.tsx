import GroupIcon from "@mui/icons-material/Group";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Groups2Icon from "@mui/icons-material/Groups2";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ForumIcon from "@mui/icons-material/Forum";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const FEATURES = [
  {
    icon: <GroupIcon sx={{ fontSize: { xs: 28, sm: 36 } }} />,
    color: "#2563eb",
    bg: "#dbeafe",
    title: "30+ Yrs Expert Faculty",
    desc: "Learn directly from senior educator Prof. Santosh Chipdey with 30+ years of expertise.",
  },
  {
    icon: <MenuBookIcon sx={{ fontSize: { xs: 28, sm: 36 } }} />,
    color: "#16a34a",
    bg: "#dcfce7",
    title: "100% Practical Coding",
    desc: "Hands-on computer lab practice for real-world programming mastery.",
  },
  {
    icon: <Groups2Icon sx={{ fontSize: { xs: 28, sm: 36 } }} />,
    color: "#f97316",
    bg: "#ffedd5",
    title: "Small Batch Size",
    desc: "Limited students per batch ensuring dedicated 1-on-1 attention.",
  },
  {
    icon: <AssignmentTurnedInIcon sx={{ fontSize: { xs: 28, sm: 36 } }} />,
    color: "#ef4444",
    bg: "#fee2e2",
    title: "Regular Tests & Mock Boards",
    desc: "Weekly chapter tests, viva prep, and prelim exams for board top scores.",
  },
  {
    icon: <ForumIcon sx={{ fontSize: { xs: 28, sm: 36 } }} />,
    color: "#7c3aed",
    bg: "#ede9fe",
    title: "Personalized Doubt Solving",
    desc: "Continuous doubt clearing sessions until every concept is crystal clear.",
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: { xs: 28, sm: 36 } }} />,
    color: "#0d9488",
    bg: "#ccfbf1",
    title: "Proven 100% Results",
    desc: "Consistent 95%+ board scoring track record over decades in Thane.",
  },
];

export default function WhyChoose() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Our Key Advantages
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight mt-3">
            Why Choose <span className="text-blue-600">KGurukul's</span>?
          </h2>
          <p className="text-slate-500 mt-3 text-sm sm:text-base max-w-xl mx-auto">
            What sets our computer education methodology apart and guarantees student success.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group relative rounded-2xl border border-slate-100 bg-white p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between"
            >
              {/* Subtle color highlight in corner */}
              <div
                className="pointer-events-none absolute -top-12 -right-12 h-28 w-28 rounded-full opacity-10 group-hover:opacity-25 transition-opacity duration-300"
                style={{ backgroundColor: f.color }}
              />

              <div>
                {/* Icon box */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xs"
                  style={{ backgroundColor: f.bg, color: f.color }}
                >
                  {f.icon}
                </div>

                <h3 className="font-bold text-slate-900 text-lg mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {f.title}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>

              {/* Bottom accent stripe */}
              <div
                className="h-1 w-8 rounded-full mt-6 transition-all duration-300 group-hover:w-16"
                style={{ backgroundColor: f.color }}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}