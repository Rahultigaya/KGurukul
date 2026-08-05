import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Courses", href: "#courses" },
  { label: "Our Teachers", href: "#mentors" },
  { label: "Success Stories", href: "#toppers" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact Us", href: "#contact" },
];

const COURSE_LINKS = [
  "Python Programming",
  "Web Development",
  "Java Programming",
  "C / C++ Programming",
  "Data Structures & Algorithms",
  "Tally with GST",
];

const SOCIALS = [
  { icon: <FacebookIcon fontSize="small" />, href: "#" },
  { icon: <InstagramIcon fontSize="small" />, href: "#" },
  { icon: <YouTubeIcon fontSize="small" />, href: "#" },
  { icon: <LinkedInIcon fontSize="small" />, href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 via-violet-500 to-orange-400 flex items-center justify-center text-white font-extrabold text-sm">
              K
            </div>
            <div>
              <p className="text-white font-bold">KGurukul</p>
              <p className="text-[10px] text-slate-500 -mt-0.5">
                Learn. Code. Succeed.
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed">
            Empowering students with quality computer education for a
            brighter tomorrow.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <p className="text-white font-semibold mb-4">Quick Links</p>
          <ul className="space-y-2 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="hover:text-white transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Courses */}
        <div>
          <p className="text-white font-semibold mb-4">Courses</p>
          <ul className="space-y-2 text-sm">
            {COURSE_LINKS.map((c) => (
              <li key={c}>
                <a href="#courses" className="hover:text-white transition-colors">
                  {c}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + Socials */}
        <div>
          <p className="text-white font-semibold mb-4">Contact Info</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <LocationOnIcon sx={{ fontSize: 17 }} className="mt-0.5" />
              6, Kavita CHS, Opp. Pratap Cinema, Kolbad Road, Thane West -
              400601
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon sx={{ fontSize: 17 }} /> +91 9967442515, 8879987836
            </li>
            <li className="flex items-center gap-2">
              <EmailIcon sx={{ fontSize: 17 }} /> kgurukuls90@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <AccessTimeIcon sx={{ fontSize: 17 }} /> Mon - Sat: 9:00 AM -
              8:00 PM
            </li>
          </ul>

          <p className="text-white font-semibold mt-5 mb-3">Stay Connected</p>
          <div className="flex gap-2">
            {SOCIALS.map((s, i) => (
              <a
                key={i}
                href={s.href}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 mt-10 pt-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} KGurukul. All rights reserved.
      </div>
    </footer>
  );
}
