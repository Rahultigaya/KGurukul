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
import founder_img from "../assets/Santoush_Chipdey.jpeg";
import co_founder_img from "../assets/Riyaa_Chipdey.jpeg";

const MENTORS = [
  {
    tag: "FOUNDER & LEAD EDUCATOR",
    tagColor: "bg-blue-600",
    photo: founder_img,
    name: "Santoush Chipdey",
    role: "Founder & Lead Educator",
    roleColor: "text-blue-600",
    accentColor: "bg-blue-600",
    stat: { Icon: StarIcon, value: "30+ Years", label: "of Experience" },
    statBg: "bg-blue-50/50 border-blue-100/50",
    statValueColor: "text-blue-900",
    statIconColor: "#2563eb",
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
    tagColorClasses: "bg-blue-50/60 text-blue-700 border border-blue-100/50",
  },
  {
    tag: "DIRECTOR & MANAGEMENT",
    tagColor: "bg-emerald-600",
    photo: co_founder_img,
    name: "Riyaa Chipdey",
    role: "Director & Management",
    roleColor: "text-emerald-600",
    accentColor: "bg-emerald-600",
    stat: { Icon: EmojiEventsIcon, value: "100%", label: "Results Track Record" },
    statBg: "bg-emerald-50/50 border-emerald-100/50",
    statValueColor: "text-emerald-900",
    statIconColor: "#16a34a",
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
    tagColorClasses: "bg-emerald-50/60 text-emerald-700 border border-emerald-100/50",
  },
];

function MentorCard({ mentor }: { mentor: any }) {
  const StatIcon = mentor.stat.Icon;
  const ribbonText = mentor.tag.split(" ")[0]; // "FOUNDER" or "DIRECTOR"
  
  return (
    <div className="relative bg-white rounded-3xl border border-slate-150 shadow-xs overflow-hidden flex flex-col justify-between p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Corner Ribbon on Card (Overlaying photo and card) */}
      <div className="absolute top-0 left-0 overflow-hidden w-36 h-36 pointer-events-none z-20">
        <div className={`absolute top-0 left-0 transform -rotate-45 -translate-x-[40px] translate-y-[26px] w-[160px] text-center text-[14px] font-black uppercase tracking-widest text-white py-1.5 shadow-md ${mentor.tagColor}`}>
          {ribbonText}
        </div>
      </div>

      <div>
        {/* Header: Photo + Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-5">
          {/* Oval Profile Photo with Shadow & Ring (pulled up-left for ribbon overlay) */}
          <div className="relative w-40 h-52 sm:w-44 sm:h-56 shrink-0 -mt-2 -ml-2 sm:-mt-4 sm:-ml-4 z-10">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md ring-1 ring-slate-100">
              <img
                src={mentor.photo}
                alt={mentor.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details Column */}
          <div className="flex flex-col text-center sm:text-left flex-1 min-w-0">
            <h3 className="text-3xl font-black font-serif-display text-slate-900 leading-none">
              {mentor.name}
            </h3>
            
            <p className={`text-sm font-bold mt-1.5 leading-none ${mentor.roleColor}`}>
              {mentor.role}
            </p>
            
            <div className={`w-8 h-[3px] rounded-full mt-2.5 mb-4 mx-auto sm:mx-0 ${mentor.accentColor}`} />

            {/* Stat Box */}
            <div
              className={`flex items-center gap-3 ${mentor.statBg} border rounded-2xl px-4 py-2.5 mb-4`}
            >
              <StatIcon sx={{ fontSize: 22, color: mentor.statIconColor }} className="shrink-0" />
              <div>
                <p className={`text-base font-black leading-none ${mentor.statValueColor}`}>
                  {mentor.stat.value}
                </p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5 leading-none">{mentor.stat.label}</p>
              </div>
            </div>

            {/* Qualifications / Education */}
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1.5">
                <SchoolIcon sx={{ fontSize: 16 }} className={mentor.roleColor} />
                <span className={`text-xs font-bold uppercase tracking-wider ${mentor.roleColor}`}>
                  Education
                </span>
              </div>
              
              <div className="space-y-1 pl-1">
                {mentor.education.map((item: string) => (
                  <p key={item} className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 justify-center sm:justify-start">
                    <span className="h-1 w-1 rounded-full bg-slate-400" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bio paragraph description */}
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 text-center sm:text-left">
          {mentor.bio}
        </p>

        {/* Skill Tags */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {mentor.tags.map((t: any) => {
            const TagIcon = t.Icon;
            return (
              <div
                key={t.label}
                className={`flex items-center justify-center gap-1.5 ${mentor.tagColorClasses} text-xs font-bold rounded-xl px-2 py-2`}
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
      <div className="max-w-7xl mx-auto  ">
        <div className="text-center mb-5">
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