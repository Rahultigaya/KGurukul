import { useEffect, useState } from "react";
import { WHATSAPP_NUMBER } from "../Constant";

import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const FloatingActions = () => {
    const [showTop, setShowTop] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setShowTop(window.scrollY > 300);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-center gap-3">

            {/* Scroll To Top — always mounted so it fades/scales in instead of popping in instantly */}
            <button
                onClick={scrollToTop}
                title="Back to top"
                className={`
          w-11 h-11 rounded-full
          bg-white border border-[#E8EAED] text-[#1A73E8]
          flex items-center justify-center
          shadow-md
          hover:bg-[#1A73E8] hover:text-white hover:-translate-y-1
          transition-all duration-300
          ${showTop ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"}
        `}
            >
                <ArrowUpwardRoundedIcon style={{ fontSize: 20 }} />
            </button>

            {/* WhatsApp — kept as WhatsApp's own brand green, not part of site theme */}
            <a
                href={`https://api.whatsapp.com/send?phone=91${WHATSAPP_NUMBER}&text=Hi`}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                className="relative flex-shrink-0 group"
            >
                {/* Quiet attention pulse, same treatment as the hero login button */}
                <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping" />

                <span
                    className="
              relative w-14 h-14 rounded-full
              bg-[#25D366] text-white
              flex items-center justify-center
              shadow-lg
              group-hover:bg-[#1DA851] group-hover:-translate-y-1 group-hover:scale-105
              transition-all duration-300
            "
                >
                    <WhatsAppIcon style={{ fontSize: 28 }} />
                </span>
            </a>
        </div>
    );
};

export default FloatingActions;