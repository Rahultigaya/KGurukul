import { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Success Stories", href: "#toppers" },
  { label: "About Us", href: "#about" },
  { label: "Courses", href: "#courses" },
  { label: "Our Teachers", href: "#mentors" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact Us", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 lg:px-8 h-20">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 shrink-0">
          <img
            src="/logo-gurukul-new.png"
            alt="KGurukul logo"
            className="h-10 lg:h-11 w-auto object-contain"
          />
          <div className="leading-tight">
            <p className="text-xl font-bold text-blue-900 tracking-tight">
              KGurukul's
            </p>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-[15px] font-medium transition-colors ${i === 0
                ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                : "text-slate-600 hover:text-blue-600"
                }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon fontSize="small" className="btn-arrow" />}
          className="hidden lg:inline-flex normal-case"
          sx={{
            borderRadius: 2.5,
            px: 3.6,
            py: 1.5,
            fontSize: 15,
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

        <IconButton
          className="lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-5 pb-5 pt-2 flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-slate-700 font-medium py-1.5"
            >
              {link.label}
            </a>
          ))}
          <Button variant="contained" color="primary" sx={{ borderRadius: 999, mt: 1 }}>
            Enroll Now
          </Button>
        </div>
      )}
    </header>
  );
}
