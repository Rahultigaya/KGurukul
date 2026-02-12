import { useEffect, useState } from "react";
import { WHATSAPP_NUMBER } from "../Constant";

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
        <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-4">

            {/* Scroll To Top */}
            {showTop && (
                <button
                    onClick={scrollToTop}
                    className="
            w-12 h-12 rounded-xl
            bg-[#2872A1] text-white text-xl
            flex items-center justify-center
            shadow-lg
            hover:bg-[#CBBDE9] hover:-translate-y-1
            transition-all duration-300
          "
                    title="Back to top"
                >
                    <i className="fa fa-long-arrow-up" />
                </button>
            )}

            {/* WhatsApp */}
            <a
                href={`https://api.whatsapp.com/send?phone=91${WHATSAPP_NUMBER}&text=Hi`}
                target="_blank"
                // rel="noopener noreferrer"
                title="Chat on WhatsApp"
                className="
          w-12 h-12 rounded-xl
          bg-green-500 text-white text-2xl
          flex items-center justify-center
          shadow-lg
          hover:bg-green-600 hover:-translate-y-1
          transition-all duration-300
        "
            >
                <i className="fa fa-whatsapp" />
            </a>
        </div>
    );
};

export default FloatingActions;