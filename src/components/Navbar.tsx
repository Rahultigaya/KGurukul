import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PhoneIcon from "@mui/icons-material/Phone";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import logo from "../assets/logo-gurukul-new.png";

const ADMISSION_YEAR = 2027;

const ACADEMIC_YEAR = `${ADMISSION_YEAR}-${String(
  ADMISSION_YEAR + 1
).slice(-2)}`;

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Success Stories", href: "#toppers" },
  { label: "About Us", href: "#about" },
  { label: "Courses", href: "#courses" },
  { label: "Our Mentors", href: "#mentors" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact Us", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Section scroll spy
      const sections = NAV_LINKS.map((link) => link.href.substring(1));
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Announcement Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-emerald-900 text-white text-[11px] sm:text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-white/10 shadow-inner">
        <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
          <LocalOfferIcon sx={{ fontSize: 11 }} /> Admissions Open
        </span>
        <span className="truncate">
          Enrollments open for {ACADEMIC_YEAR} ICSE, HSC & ISC Computer Science Batches!        </span>
        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-1 text-amber-300 font-bold hover:underline shrink-0 ml-1"
        >
          Enroll Now →
        </a>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? "glass-nav border-b border-slate-200/80 shadow-sm py-0"
          : "bg-white/95 backdrop-blur-md border-b border-slate-100 py-0.5"
          }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 shrink-0 group">
            <div className="relative p-1 rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 border border-slate-100 group-hover:scale-105 transition-transform duration-300">
              <img
                src={logo}
                alt="KGurukul logo"
                className="h-10 lg:h-11 w-auto object-contain"
              />
            </div>
            <div className="leading-none">
              <p className="text-xl lg:text-2xl font-black text-blue-600 font-extrabold tracking-tight flex items-center gap-1">
                KGurukul's
              </p>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">
                Computer Education
              </p>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`text-[14px] font-semibold transition-all duration-200 relative py-1 ${isActive
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-blue-600"
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full animate-pulse" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Header Action CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+919967442515"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <PhoneIcon sx={{ fontSize: 16 }} className="text-emerald-600" />
              <span>+91 9967442515</span>
            </a>

            <Button
              href="#contact"
              variant="contained"
              endIcon={<ArrowForwardIcon fontSize="small" className="btn-arrow" />}
              sx={{
                borderRadius: 2.5,
                px: 3.2,
                py: 1.2,
                fontSize: 14,
                fontWeight: 700,
                textTransform: "none",
                color: "#fff",
                background: "linear-gradient(135deg, #2563eb 55%, #16a34a 115%)",
                boxShadow: "0 8px 20px -6px rgba(37,99,235,0.45)",
                transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                "& .btn-arrow": {
                  transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                },
                "&:hover": {
                  background: "linear-gradient(135deg, #1d4ed8 55%, #15803d 115%)",
                  boxShadow: "0 12px 28px -6px rgba(37,99,235,0.55)",
                  transform: "translateY(-2px)",
                  "& .btn-arrow": {
                    transform: "translateX(3px)",
                  },
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              Enroll Now
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <div className="lg:hidden">
            <IconButton
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              sx={{
                color: "#1e293b",
                bgcolor: "#f1f5f9",
                "&:hover": { bgcolor: "#e2e8f0" },
              }}
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </div>
        </div>

        {/* Mobile nav Drawer */}
        {open && (
          <div className="lg:hidden fixed inset-x-0 top-28 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-2xl px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300 z-50 max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`text-slate-800 text-base font-semibold py-2.5 px-3 rounded-xl transition-all ${isActive
                      ? "bg-blue-50 text-blue-600 font-bold"
                      : "hover:bg-slate-100"
                      }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
              <a
                href="tel:+919967442515"
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 font-bold text-slate-800 text-sm"
              >
                <PhoneIcon fontSize="small" className="text-emerald-600" /> Call +91 9967442515
              </a>
              <Button
                href="#contact"
                onClick={() => setOpen(false)}
                variant="contained"
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: 15,
                  textTransform: "none",
                  background: "linear-gradient(135deg, #2563eb, #16a34a)",
                  boxShadow: "0 8px 20px -6px rgba(37,99,235,0.45)",
                }}
              >
                Enroll Now
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
