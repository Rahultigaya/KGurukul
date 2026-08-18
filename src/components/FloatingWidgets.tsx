import { useEffect, useState } from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function FloatingWidgets() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Scroll to Top button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="pointer-events-auto w-11 h-11 rounded-full bg-slate-900 text-white shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 hover:scale-110 active:scale-95 border border-slate-700/50 group"
        >
          <KeyboardArrowUpIcon className="group-hover:-translate-y-0.5 transition-transform duration-200" />
        </button>
      )}

      {/* Floating WhatsApp CTA */}
      <a
        href="https://wa.me/919967442515?text=Hi%20KGurukul!%20I%20want%20to%20know%20more%20about%20your%20courses."
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="pointer-events-auto group relative flex items-center gap-2.5 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-[0_8px_25px_-5px_rgba(37,211,102,0.5)] hover:bg-[#20bd5a] hover:shadow-[0_12px_30px_-5px_rgba(37,211,102,0.7)] hover:scale-105 transition-all duration-300 active:scale-95"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <WhatsAppIcon className="text-white text-2xl" />
        <span className="hidden sm:inline font-bold text-xs tracking-wide">
          Quick Inquiry
        </span>
      </a>
    </div>
  );
}
