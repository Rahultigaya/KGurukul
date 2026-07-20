import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";

const Footer = () => {
    const year = new Date().getFullYear();

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <footer className="relative mt-auto bg-white">
            {/* Four-color top edge, echoing the form card and the book stack */}
            <div className="h-1 flex">
                <span className="flex-1 bg-[#1A73E8]" />
                <span className="flex-1 bg-[#0F9D58]" />
                <span className="flex-1 bg-[#EA4335]" />
                <span className="flex-1 bg-[#F9AB00]" />
            </div>

            <div className="max-w-6xl mx-auto  py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="font-['Baloo_2'] font-bold text-lg text-[#202124]">
                        KGurukul<span className="text-[#1A73E8]">'s</span>
                    </span>
                    <span className="hidden md:inline text-[#DADCE0]">|</span>
                    <p className="text-[#5F6368] text-sm text-center">
                        © {year} All rights reserved.
                    </p>
                </div>

                <div className="flex items-center gap-5">
                    <p className="text-[#5F6368] text-sm">
                        Made with <span className="text-[#EA4335]">❤</span> in India
                    </p>

                    <button
                        onClick={scrollToTop}
                        aria-label="Back to top"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1A73E8]/10 text-[#1A73E8] hover:bg-[#1A73E8] hover:text-white transition-colors"
                    >
                        <ArrowUpwardRoundedIcon style={{ fontSize: 18 }} />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;