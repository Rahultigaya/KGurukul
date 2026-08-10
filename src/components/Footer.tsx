import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import Product from "../Cources";

// 👇 USE THE SAME LOGO IMPORT/PATH THAT YOU USE IN NAVBAR
import logo from "../../logo-gurukul-new.png";

const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Courses", href: "#courses" },
  { label: "Our Teachers", href: "#mentors" },
  { label: "Success Stories", href: "#toppers" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact Us", href: "#contact" },
];

const SOCIALS = [
  {
    icon: <FacebookIcon sx={{ fontSize: 15 }} />,
    href: "#",
    label: "Facebook",
  },
  {
    icon: <InstagramIcon sx={{ fontSize: 15 }} />,
    href: "#",
    label: "Instagram",
  },
  {
    icon: <YouTubeIcon sx={{ fontSize: 15 }} />,
    href: "#",
    label: "YouTube",
  },
  {
    icon: <LinkedInIcon sx={{ fontSize: 15 }} />,
    href: "#",
    label: "LinkedIn",
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-7">

        {/* Main Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">

          {/* ================= BRAND ================= */}
          <div>
            {/* Logo */}
            <div className="flex items-center gap-2 mb-2">
              <img
                src={logo}
                alt="KGurukul"
                className="h-9 w-auto object-contain"
              />

              <div>
                <h3 className="text-white font-bold text-base leading-none">
                  KGurukul
                </h3>

                <p className="text-[12px] text-slate-500 mt-1 tracking-wide">
                  Learn. Code. Succeed.
                </p>
              </div>
            </div>

            <p className="text-[12px] leading-relaxed max-w-xs">
              Empowering students with quality computer education for a
              brighter tomorrow.
            </p>

            {/* Social Icons */}
            <div className="flex gap-1.5 mt-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="
                    w-6 h-6
                    rounded-full
                    bg-white/5
                    hover:bg-white/15
                    text-slate-400
                    hover:text-white
                    flex
                    items-center
                    justify-center
                    transition-colors
                  "
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ================= QUICK LINKS ================= */}
          <div>
            <p className="text-white font-semibold text-[12px] tracking-wide uppercase mb-2.5">
              Quick Links
            </p>

            <ul className="space-y-1.5 text-[12px]">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= COURSES ================= */}
          <div>
            <p className="text-white font-semibold text-[12px] tracking-wide uppercase mb-2.5">
              Courses
            </p>

            <ul className="space-y-1.5 text-[12px]">
              {Product.map((p, i) => (
                <li key={i}>
                  <a
                    href="#courses"
                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <span className="text-[8px] font-semibold text-slate-500 bg-white/5 px-1 py-0.5 rounded">
                      {p.class}
                    </span>

                    <span>{p.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= CONTACT ================= */}
          <div>
            <p className="text-white font-semibold text-[12px] tracking-wide uppercase mb-2.5">
              Contact Info
            </p>

            <ul className="space-y-2 text-[12px]">

              {/* Address */}
              <li className="flex items-start gap-1.5">
                <LocationOnIcon
                  sx={{ fontSize: 13 }}
                  className="mt-0.5 shrink-0"
                />

                <span className="leading-relaxed">
                  6, Kavita CHS, Opp. Pratap Cinema,
                  Kolbad Road, Thane West - 400601
                </span>
              </li>

              {/* Phone */}
              <li className="flex items-start gap-1.5">
                <PhoneIcon
                  sx={{ fontSize: 13 }}
                  className="mt-0.5 shrink-0"
                />

                <div className="flex flex-col">
                  <a
                    href="tel:+919967442515"
                    className="hover:text-white transition-colors"
                  >
                    +91 9967442515
                  </a>

                  <a
                    href="tel:+918879987836"
                    className="hover:text-white transition-colors"
                  >
                    +91 8879987836
                  </a>
                </div>
              </li>

              {/* Email */}
              <li className="flex items-start gap-1.5">
                <EmailIcon
                  sx={{ fontSize: 13 }}
                  className="mt-0.5 shrink-0"
                />

                <a
                  href="mailto:kgurukuls90@gmail.com"
                  className="hover:text-white transition-colors break-all"
                >
                  kgurukuls90@gmail.com
                </a>
              </li>

              {/* Timing */}
              <li className="flex items-start gap-1.5">
                <AccessTimeIcon
                  sx={{ fontSize: 13 }}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  Mon - Sat: 9:00 AM - 8:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-6 pt-3 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[12px] text-slate-500">
          <p>
            © {new Date().getFullYear()} KGurukul. All rights reserved.
          </p>

          <p className="flex items-center gap-1">
            Made with
            <span className="text-rose-400">♥</span>
            for future coders
          </p>
        </div>
      </div>
    </footer>
  );
}