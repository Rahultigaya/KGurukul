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
    tag: "FOUNDER",
    tagColor: "bg-blue-600",
    photo: founder_img,
    name: "Santosh Chipdey",
    role: "Founder & Lead Educator",
    roleColor: "text-blue-600",
    accentColor: "bg-blue-600",
    stat: { Icon: StarIcon, value: "30+ Years", label: "of Experience" },
    statBg: "bg-blue-50",
    statValueColor: "text-blue-900",
    statIconColor: "#3b82f6",
    education: ["M.Sc. Computer Science", "B.Ed."],
    bio: "Experienced in teaching programming and computer science. Passionate about making complex concepts simple and engaging.",
    tags: [
      { Icon: CodeIcon, label: "Programming" },
      { Icon: AccountTreeIcon, label: "Data Structures" },
      { Icon: PublicIcon, label: "Web Development" },
      { Icon: MemoryIcon, label: "Algorithms" },
      { Icon: LightbulbIcon, label: "Problem Solving" },
      { Icon: GroupsIcon, label: "Mentorship" },
    ],
    tagColorClasses: "bg-blue-50 text-blue-700",
  },
  {
    tag: "CO-FOUNDER",
    tagColor: "bg-emerald-600",
    photo: co_founder_img,
    name: "Riya Chipdey",
    role: "Co-Founder & Management",
    roleColor: "text-emerald-600",
    accentColor: "bg-emerald-600",
    stat: { Icon: EmojiEventsIcon, value: "100%", label: "Results Track Record" },
    statBg: "bg-emerald-50",
    statValueColor: "text-emerald-900",
    statIconColor: "#f59e0b",
    education: ["M.Sc. Mathematics", "NET Qualified"],
    bio: "Expert in competitive exam preparation with a track record of 100% results. Specializes in calculus, algebra, and statistics.",
    tags: [
      { Icon: FunctionsIcon, label: "Mathematics" },
      { Icon: CalculateIcon, label: "Calculus" },
      { Icon: ExposureIcon, label: "Algebra" },
      { Icon: BarChartIcon, label: "Statistics" },
      { Icon: GpsFixedIcon, label: "Exam Strategy" },
      { Icon: AutoAwesomeIcon, label: "Concept Clarity" },
    ],
    tagColorClasses: "bg-emerald-50 text-emerald-700",
  },
];

function MentorCard({ mentor }: { mentor: any }) {
  const StatIcon = mentor.stat.Icon;
  return (
    <div className="relative bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-4 py-2">
        {/* Header: photo on the left, name/role/stat/education stacked on the right */}
        <div className="flex items-start gap-5 mb-5">
          <div className="relative w-44 h-52 shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md">
              <img
                src={mentor.photo}
                alt={mentor.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Diagonal corner-ribbon banner, sits above the photo mask so it isn't clipped */}
            <div
              className={`absolute z-10 ${mentor.tagColor} text-white text-[11px] font-bold tracking-wider text-center py-1.5 shadow-lg`}
              style={{
                width: "170px",
                top: "16px",
                left: "-48px",
                transform: "rotate(-45deg)",
                clipPath:
                  "polygon(0 50%, 10% 0, 100% 0, 100% 100%, 10% 100%)",
              }}
            >
              {mentor.tag}
            </div>
          </div>

          <div className="flex flex-col justify-center flex-1 pt-2">
            <h3 className="text-xl font-bold text-slate-900 leading-tight">
              {mentor.name}
            </h3>
            <p className={`text-sm font-semibold mt-1 ${mentor.roleColor}`}>
              {mentor.role}
            </p>
            <div className={`w-9 h-1 rounded-full mt-3 mb-4 ${mentor.accentColor}`} />

            {/* Stat box */}
            <div
              className={`flex items-center gap-3 ${mentor.statBg} rounded-xl px-4 py-1 mb-2`}
            >
              <StatIcon sx={{ fontSize: 28, color: mentor.statIconColor }} />
              <div>
                <p className={`text-base font-extrabold leading-none ${mentor.statValueColor}`}>
                  {mentor.stat.value}
                </p>
                <p className="text-xs text-slate-500 mt-1">{mentor.stat.label}</p>
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <SchoolIcon sx={{ fontSize: 17 }} className={mentor.roleColor} />
                <span className={`text-sm font-semibold ${mentor.roleColor}`}>
                  Education
                </span>
              </div>
              <ul className="space-y-1 pl-0.5">
                {mentor.education.map((item: string) => (
                  <li
                    key={item}
                    className="text-sm text-slate-600 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-slate-500 leading-relaxed mb-5">
          {mentor.bio}
        </p>

        {/* Tag pills */}
        <div className="grid grid-cols-3 gap-2">
          {mentor.tags.map((t: any) => {
            const TagIcon = t.Icon;
            return (
              <div
                key={t.label}
                className={`flex items-center justify-center gap-1.5 ${mentor.tagColorClasses} text-xs font-medium rounded-lg px-2 py-2`}
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
    <section id="mentors" className="">
      <div className="max-w-5xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-5">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            Meet Our <span className="text-blue-600">Expert Teachers</span>
          </h2>
          <p className="text-slate-500 text-sm">
            Experienced educators. Proven results. Your success is our mission.
          </p>
          <div className="w-14 h-1 bg-blue-600 rounded-full mx-auto mt-4" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {MENTORS.map((mentor) => (
            <MentorCard key={mentor.name} mentor={mentor} />
          ))}
        </div>
      </div>
    </section>
  );
}