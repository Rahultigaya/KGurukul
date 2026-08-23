import { motion } from "framer-motion";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
 import CodeIcon from "@mui/icons-material/Code";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PublicIcon from "@mui/icons-material/Public";
import MemoryIcon from "@mui/icons-material/Memory";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import GroupsIcon from "@mui/icons-material/Groups";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SchoolIcon from "@mui/icons-material/School";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PsychologyIcon from "@mui/icons-material/Psychology";
import founder_img from "../assets/Santoush_Chipdey.jpeg";
import co_founder_img from "../assets/Riyaa_Chipdey.jpeg";

const MENTORS = [
  {
    tag: "FOUNDER & LEAD EDUCATOR",
    tagColor: "bg-blue-600",
    photo: founder_img,
    name: "Santoush P Chipdey",
    role: "Founder & Lead Educator",
    roleColor: "text-blue-600",
    accentColor: "bg-blue-600",
    stat: { Icon: StarIcon, value: "30+ Years", label: "of Experience" },
    statBg: "bg-blue-50/50 border-blue-100/50",
    statValueColor: "text-blue-900",
    statIconColor: "#2563eb",
    education: ["MCA", "ADCSSA"],
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
    tag: "DIRECTOR",
    tagColor: "bg-emerald-600",
    photo: co_founder_img,
    name: "Riyaa Chipdey",
    role: "Director Of Admin",
    roleColor: "text-emerald-600",
    accentColor: "bg-emerald-600",
    stat: { Icon: EmojiEventsIcon, value: "100%", label: "Results Track Record" },
    statBg: "bg-emerald-50/50 border-emerald-100/50",
    statValueColor: "text-emerald-900",
    statIconColor: "#16a34a",
    education: ["B.Ed.", "M.Ed.", "ADCSSA"],
    bio: "Dedicated to effective administration and student development. Passionate about creating a supportive learning environment where every student can thrive.",
   tags: [
  { Icon: AdminPanelSettingsIcon, label: "Administration" },
  { Icon: SchoolIcon, label: "Student Development" },
  { Icon: SupportAgentIcon, label: "Remedial Learning" },
  { Icon: AssessmentIcon, label: "Academic Monitoring" },
  { Icon: EventNoteIcon, label: "Exam Strategy" },
  { Icon: PsychologyIcon, label: "Career Counselling" },
],
    tagColorClasses: "bg-emerald-50/60 text-emerald-700 border border-emerald-100/50",
  },
];

// Parent controls the whole sequence; children just declare hidden/show states.
// This avoids each child having its own whileInView (which caused the flicker/replay).
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.96 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: i * 0.15,
      staggerChildren: 0.08,
      delayChildren: i * 0.15 + 0.15,
    },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const scaleX = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const tagContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const tagItem = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

function MentorCard({ mentor, index }: { mentor: any; index: number }) {
  const StatIcon = mentor.stat.Icon;
  const ribbonText = mentor.tag.split(" ")[0]; // "FOUNDER" or "DIRECTOR"

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6 }}
      className="relative bg-white rounded-3xl border border-slate-150 shadow-xs overflow-hidden flex flex-col justify-between p-6 sm:p-8 transition-shadow duration-300 hover:shadow-xl"
    >
      {/* Corner Ribbon on Card */}
      <div className="absolute top-0 left-0 overflow-hidden w-36 h-36 pointer-events-none z-20">
        <motion.div
          variants={fadeIn}
          className={`absolute top-0 left-0 transform -rotate-45 -translate-x-[40px] translate-y-[26px] w-[160px] text-center text-[14px] font-black uppercase tracking-widest text-white py-1.5 shadow-md ${mentor.tagColor}`}
        >
          {ribbonText}
        </motion.div>
      </div>

      <div>
        {/* Header: Photo + Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-5">
          {/* Oval Profile Photo with Hover Zoom */}
          <div className="relative w-40 h-52 sm:w-44 sm:h-56 shrink-0 -mt-2 -ml-2 sm:-mt-4 sm:-ml-4 z-10">
            <motion.div
              variants={fadeIn}
              whileHover={{ scale: 1.04, rotate: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md ring-1 ring-slate-100 cursor-pointer"
            >
              <img
                src={mentor.photo}
                alt={mentor.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Details Column */}
          <div className="flex flex-col text-center sm:text-left flex-1 min-w-0">
            <motion.h3
              variants={fadeUp}
              className="text-3xl font-black font-serif-display text-slate-900 leading-none mb-1 [word-spacing:0.15em]"
            >
              {mentor.name}
            </motion.h3>

            <motion.p
              variants={fadeUp}
              className={`text-sm font-bold mt-1.5 leading-none ${mentor.roleColor}`}
            >
              {mentor.role}
            </motion.p>

            <motion.div
              variants={scaleX}
              style={{ transformOrigin: "left" }}
              className={`w-8 h-[3px] rounded-full mt-2.5 mb-4 mx-auto sm:mx-0 ${mentor.accentColor}`}
            />

            {/* Stat Box */}
            <motion.div
              variants={fadeUp}
              whileHover={{ scale: 1.02 }}
              className={`flex items-center gap-3 ${mentor.statBg} border rounded-2xl px-4 py-2.5 mb-4 shadow-2xs`}
            >
              <StatIcon sx={{ fontSize: 22, color: mentor.statIconColor }} className="shrink-0 animate-pulse" />
              <div>
                <p className={`text-base font-black leading-none ${mentor.statValueColor}`}>
                  {mentor.stat.value}
                </p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5 leading-none">{mentor.stat.label}</p>
              </div>
            </motion.div>

            {/* Qualifications / Education */}
            <motion.div variants={fadeUp} className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1.5">
                <SchoolIcon sx={{ fontSize: 16 }} className={mentor.roleColor} />
                <span className={`text-xs font-bold uppercase tracking-wider ${mentor.roleColor}`}>
                  Education
                </span>
              </div>

              <div className="space-y-1 pl-1">
                {mentor.education.map((item: string) => (
                  <p key={item} className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 justify-center sm:justify-start">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    {item}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bio paragraph description */}
        <motion.p
          variants={fadeUp}
          className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 text-center sm:text-left"
        >
          {mentor.bio}
        </motion.p>

        {/* Skill Tags */}
        <motion.div
          variants={tagContainer}
          className="grid grid-cols-2 sm:grid-cols-3 gap-2 items-stretch"
        >
          {mentor.tags.map((t: any) => {
            const TagIcon = t.Icon;
            return (
              <motion.div
                key={t.label}
                variants={tagItem}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className={`flex items-center justify-center gap-1.5 text-center ${mentor.tagColorClasses} text-xs font-bold rounded-xl px-2 py-2 cursor-default shadow-2xs min-h-[2.75rem]`}
              >
                <TagIcon sx={{ fontSize: 14 }} className="shrink-0" />
                <span className="leading-tight whitespace-normal break-words">{t.label}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Mentors() {
  return (
    <section id="mentors" className="py-12 sm:py-16 lg:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Leadership & Faculty
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight mt-3">
            Meet Our <span className="text-blue-600">Mentors</span>
          </h2>
          <p className="text-slate-500 mt-3 text-sm sm:text-base max-w-xl mx-auto">
            Decades of experience. Passion for teaching. Dedicated to your board success.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {MENTORS.map((mentor, index) => (
            <MentorCard key={mentor.name} mentor={mentor} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}