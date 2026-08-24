import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import logo from "../assets/kgurukuls-logo.png";

const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Success Stories", href: "#toppers" },
  { label: "About Us", href: "#about" },
  { label: "Courses", href: "#courses" },
  { label: "Our Mentors", href: "#mentors" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact Us", href: "#contact" },
];

const COURSES = [
  { class: "ICSE", name: "Std-IX (Basic Java)" },
  { class: "ICSE", name: "Std-X (Advanced Java)" },
  { class: "HSC", name: "Std-XI (CS1 + CS2)" },
  { class: "HSC", name: "Std-XII (CS1 + CS2)" },
  { class: "ISC", name: "Std-XI (Computer Application)" },
  { class: "ISC", name: "Std-XII (Computer Application)" },
];

const SOCIALS = [
  { icon: <FacebookIcon sx={{ fontSize: 16 }} />, href: "#", label: "Facebook" },
  { icon: <InstagramIcon sx={{ fontSize: 16 }} />, href: "#", label: "Instagram" },
  { icon: <YouTubeIcon sx={{ fontSize: 16 }} />, href: "#", label: "YouTube" },
  { icon: <LinkedInIcon sx={{ fontSize: 16 }} />, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-slate-800">

          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <a href="#home" className="flex items-center gap-3">
              <div className="shrink-0 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={logo}
                  alt="KGurukul logo"
                  className="h-10 sm:h-14 lg:h-13 w-auto object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif-display text-white font-bold text-3xl leading-none underline">
                  KGurukul<span className="text-blue-500">'s</span>
                </h3>
              </div>
            </a>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm text-justify">
              KGurukul is Thane's leading computer education institute specializing in ICSE, HSC, and ISC board computer science, Java, C++, and practical lab training.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-1">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 hover:border-blue-500 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-blue-400 transition-colors inline-block py-0.5"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Course Menu */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Our Board Programs
            </h4>
            <ul className="space-y-2 text-xs">
              {COURSES.map((c, i) => (
                <li key={i}>
                  <a
                    href="#courses"
                    className="flex items-center gap-2 hover:text-blue-400 transition-colors py-0.5"
                  >
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800/60">
                      {c.class}
                    </span>
                    <span>{c.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Institute Address
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <LocationOnIcon sx={{ fontSize: 16 }} className="text-blue-500 mt-0.5 shrink-0" />
                <span className="leading-relaxed">
                  6, Kavita CHS, Opp. Pratap Cinema, Kolbad Road, Thane West - 400601
                </span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneIcon sx={{ fontSize: 16 }} className="text-emerald-500 shrink-0" />
                <a href="tel:+919967442515" className="hover:text-white transition-colors">
                  +91 9967442515, +91 9930776829
                </a>
              </li>
              <li className="flex items-center gap-2">
                <EmailIcon sx={{ fontSize: 16 }} className="text-amber-500 shrink-0" />
                <a href="mailto:kgurukuls09@gmail.com" className="hover:text-white transition-colors">
                  kgurukuls09@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <AccessTimeIcon sx={{ fontSize: 16 }} className="text-purple-500 shrink-0" />
                <span>Mon - Sat: 11:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} KGurukul. All rights reserved.</p>
          {/* <p className="flex items-center gap-1">
            Empowering Thane's future programmers <span className="text-rose-500">♥</span>
          </p> */}
        </div>

      </div>
    </footer>
  );
}