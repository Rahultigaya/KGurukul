import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LOGO } from "../Constant";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const MENU_ITEMS = [
    { label: "Home", Icon: HomeRoundedIcon },
    { label: "About", Icon: PersonRoundedIcon },
    { label: "Courses", Icon: MenuBookRoundedIcon },
    { label: "Contact", Icon: CallRoundedIcon },
    { label: "Blog", Icon: ArticleRoundedIcon },
];

const Navbar = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setOpen(false);
    };

    // Close menu when clicking outside
    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
        <nav
            className="w-full bg-white/90 backdrop-blur-md text-[#202124] shadow-[0_1px_2px_rgba(60,64,67,0.15)]"
            ref={menuRef}
        >
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <img src={LOGO} alt="Logo" className="w-11 h-11" />
                    <div className="leading-tight">
                        <p className="font-['Baloo_2'] font-bold text-xl text-[#202124]">
                            KGurukul<span className="text-[#1A73E8]">'s</span>
                        </p>
                        <p className="text-xs text-[#5F6368] tracking-wide">Computer Classes</p>
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <ul className="flex items-center gap-8 text-sm font-medium">
                        {MENU_ITEMS.map(({ label, Icon }) => (
                            <li
                                key={label}
                                onClick={() => scrollToSection(label)}
                                className="group relative flex items-center gap-2 cursor-pointer text-[#5F6368] hover:text-[#1A73E8] transition py-1"
                            >
                                <Icon style={{ fontSize: 18 }} />
                                <span>{label}</span>
                                <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-[#1A73E8] rounded-full transition-all duration-300 group-hover:w-full" />
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => navigate("/auth/login")}
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-[#1A73E8] hover:bg-[#1765CC] rounded-full shadow-sm hover:shadow-md hover:scale-[1.03] transition-all duration-300"
                    >
                        <span className="text-white text-sm font-semibold">Login</span>
                        <ArrowForwardRoundedIcon style={{ fontSize: 16 }} className="text-white" />
                    </button>
                </div>

                {/* Mobile Toggle Button */}
                <button
                    className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-[#1A73E8] relative z-50"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-label="Toggle menu"
                >
                    {open ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
                </button>
            </div>

            {/* Four-color strip, echoing the footer */}
            <div className="h-1 flex">
                <span className="flex-1 bg-[#1A73E8]" />
                <span className="flex-1 bg-[#0F9D58]" />
                <span className="flex-1 bg-[#EA4335]" />
                <span className="flex-1 bg-[#F9AB00]" />
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                <ul className="bg-white shadow-lg px-6 py-4 space-y-1 text-base border-t border-[#E8EAED]">
                    {MENU_ITEMS.map(({ label, Icon }, index) => (
                        <li
                            key={label}
                            className="cursor-pointer text-[#5F6368] hover:text-[#1A73E8] hover:bg-[#1A73E8]/5 transition flex items-center gap-3 rounded-xl px-3 py-2.5"
                            style={{
                                transitionDelay: open ? `${index * 50}ms` : "0ms",
                                opacity: open ? 1 : 0,
                                transform: open ? "translateX(0)" : "translateX(-20px)",
                            }}
                            onClick={() => scrollToSection(label)}
                        >
                            <Icon style={{ fontSize: 20 }} />
                            <span className="font-medium">{label}</span>
                        </li>
                    ))}

                    <li
                        className="pt-2"
                        style={{
                            transitionDelay: open ? `${MENU_ITEMS.length * 50}ms` : "0ms",
                            opacity: open ? 1 : 0,
                            transform: open ? "translateX(0)" : "translateX(-20px)",
                        }}
                    >
                        <button
                            onClick={() => {
                                setOpen(false);
                                navigate("/auth/login");
                            }}
                            className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#1A73E8] hover:bg-[#1765CC] rounded-full shadow-md transition-all duration-300"
                        >
                            <span className="text-white text-sm font-semibold">Login</span>
                            <ArrowForwardRoundedIcon style={{ fontSize: 16 }} className="text-white" />
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;