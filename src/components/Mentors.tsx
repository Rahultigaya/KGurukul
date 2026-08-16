import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SchoolIcon from "@mui/icons-material/School";
import CodeIcon from "@mui/icons-material/Code";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PublicIcon from "@mui/icons-material/Public";
import MemoryIcon from "@mui/icons-material/Memory";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import GroupsIcon from "@mui/icons-material/Groups";
import FunctionsIcon from "@mui/icons-material/Functions";
import CalculateIcon from "@mui/icons-material/Calculate";
import ExposureIcon from "@mui/icons-material/Exposure";
import BarChartIcon from "@mui/icons-material/BarChart";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import founder_img from "../assets/Santosh Chipdey.jpeg";
import co_founder_img from "../assets/Riya Chipdey.jpeg";

const MENTORS = [
  {
    tag: "FOUNDER & LEAD EDUCATOR",
    tagColor: "bg-blue-600",
    photo: founder_img,
    name: "Prof. Santosh Chipdey",
    role: "Founder & Lead Computer Faculty",
    roleColor: "text-blue-600",
    accentColor: "bg-blue-600",
    stat: { Icon: StarIcon, value: "30+ Years", label: "Teaching Experience" },
    statBg: "bg-blue-50 border-blue-100",
    statValueColor: "text-blue-900",
    statIconColor: "#2563eb",
    education: ["M.Sc. Computer Science", "B.Ed. Education"],
    bio: "Pioneer in computer science education in Thane. Specialized in teaching Java, C++, Data Structures, and preparing ICSE and HSC board exam toppers.",
    tags: [
      { Icon: CodeIcon, label: "Java & C++" },
      { Icon: AccountTreeIcon, label: "Data Structures" },
      { Icon: PublicIcon, label: "Web Tech" },
      { Icon: MemoryIcon, label: "Algorithms" },
      { Icon: LightbulbIcon, label: "Problem Solving" },
      { Icon: GroupsIcon, label: "Board Mentorship" },
    ],
    tagColorClasses: "bg-blue-50 text-blue-700 border border-blue-100",
  },
  {
    tag: "DIRECTOR & MATHEMATICS FACULTY",
    tagColor: "bg-emerald-600",
    photo: co_founder_img,
    name: "Prof. Riya Chipdey",
    role: "Director & Academic Head",
    roleColor: "text-emerald-600",
    accentColor: "bg-emerald-600",
    stat: { Icon: EmojiEventsIcon, value: "100%", label: "Scoring Track Record" },
    statBg: "bg-emerald-50 border-emerald-100",
    statValueColor: "text-emerald-900",
    statIconColor: "#16a34a",
    education: ["M.Sc. Mathematics", "NET Qualified"],
    bio: "Expert mathematician & strategist with a proven track record of student academic perfection. Specializes in advanced calculus, algebra, and exam strategies.",
    tags: [
      { Icon: FunctionsIcon, label: "Mathematics" },
      { Icon: CalculateIcon, label: "Calculus" },
      { Icon: ExposureIcon, label: "Algebra" },
      { Icon: BarChartIcon, label: "Statistics" },
      { Icon: GpsFixedIcon, label: "Exam Strategy" },
      { Icon: AutoAwesomeIcon, label: "Concept Clarity" },
    ],
    tagColorClasses: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  },
];

function MentorCard({ mentor }: { mentor: any }) {
  const StatIcon = mentor.stat.Icon;
  return (
    <div className="relative bg-white rounded-3xl border border-slate-200/80 shadow-lg overflow-hidden flex flex-col justify-between p-6 sm:p-7 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div>
        {/* Header: Photo + Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
          <div className="relative w-40 h-40 sm:w-44 sm:h-44 shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl ring-2 ring-slate-200/60">
              <img
                src={mentor.photo}
                alt={mentor.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Tag Badge */}
            <div
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${mentor.tagColor} text-white text-[10px] font-black tracking-wider text-center py-1 px-3 rounded-full shadow-md whitespace-nowrap`}
            >
              {mentor.tag}
            </div>
          </div>

          <div className="flex flex-col text-center sm:text-left flex-1">
            <h3 className="text-2xl font-bold font-serif-display text-slate-900 leading-tight">
              {mentor.name}
            </h3>
            <p className={`text-sm font-bold mt-1 ${mentor.roleColor}`}>
              {mentor.role}
            </p>
            <div className={`w-12 h-1 rounded-full mt-2 mb-4 mx-auto sm:mx-0 ${mentor.accentColor}`} />

            {/* Stat Box */}
            <div
              className={`flex items-center gap-3 ${mentor.statBg} border rounded-2xl px-4 py-2.5 mb-3`}
            >
              <StatIcon sx={{ fontSize: 26, color: mentor.statIconColor }} />
              <div>
                <p className={`text-base font-extrabold leading-none ${mentor.statValueColor}`}>
                  {mentor.stat.value}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-1">{mentor.stat.label}</p>
              </div>
            </div>

            {/* Education */}
            <div className="mt-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1.5">
                <SchoolIcon sx={{ fontSize: 16 }} className={mentor.roleColor} />
                <span className={`text-xs font-bold uppercase tracking-wider ${mentor.roleColor}`}>
                  Qualifications
                </span>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                {mentor.education.map((item: string) => (
                  <span
                    key={item}
                    className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-slate-600 leading-relaxed mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
          "{mentor.bio}"
        </p>

        {/* Skill Tags */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {mentor.tags.map((t: any) => {
            const TagIcon = t.Icon;
            return (
              <div
                key={t.label}
                className={`flex items-center justify-center gap-1.5 ${mentor.tagColorClasses} text-xs font-bold rounded-xl px-2.5 py-2`}
              >
                <TagIcon sx={{ fontSize: 14 }} className="shrink-0" />
                <span className="truncate">{t.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Mentors() {
  return (
    <section id="mentors" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Leadership & Faculty
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight mt-3">
            Meet Our <span className="text-blue-600">Expert Teachers</span>
          </h2>
          <p className="text-slate-500 mt-3 text-sm sm:text-base max-w-xl mx-auto">
            Decades of experience. Passion for teaching. Dedicated to your board success.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {MENTORS.map((mentor) => (
            <MentorCard key={mentor.name} mentor={mentor} />
          ))}
        </div>
      </div>
    </section>
  );
}