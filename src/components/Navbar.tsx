import { useState, useEffect, useRef } from "react";
import { LOGO } from "../Constant";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const menuItems = [
        { label: "Home", icon: "fa-home" },
        { label: "About", icon: "fa-user" },
        { label: "Courses", icon: "fa-book" },
        { label: "Contact", icon: "fa-phone" },
        { label: "Blog", icon: "fa-th-large" },
    ];

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
        });
        setOpen(false);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    return (
        <nav className="w-full text-[#e8ecc0ff] border-b border-[#648DB3] mb-auto relative" ref={menuRef}>
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3 text-white font-mono">
                    <img src={LOGO} alt="Logo" className="w-14 h-14" />
                    <span className="text-2xl font-semibold">KGurukul&apos;s Computer Classes</span>
                </div>


                <ul className="hidden md:flex items-center gap-12 text-lg">
                    {menuItems.map((item) => (
                        <li
                            key={item.label} onClick={() => scrollToSection(item.label)}
                            className="flex items-center gap-3 cursor-pointer hover:text-yellow-400 transition"
                        >
                            <i className={`fa ${item.icon} text-[32px]`} title={item.label}></i>
                            {/* <span>{item.label}</span> */}
                        </li>
                    ))}
                    <li>
                        {/* <button
                            className="
    bg-purple-700
    px-5 py-2
    font-semibold
    rounded-lg
    border-2 border-400
    transition-all duration-100
    hover:bg-transparent
    hover:text-green-400
    hover:border-400
    hover:rounded-full
  "
                        >
                            Login
                        </button> */}
                    </li>
                </ul>


                {/* Desktop Menu */}
                {/* <ul className="hidden md:flex gap-8 text-lg">
                    {["Home", "About", "Courses", "Blog", "Contact"].map((item) => (
                        <li
                            key={item}
                            className="cursor-pointer hover:text-yellow-400 transition"
                        >
                            {item}
                        </li>
                    ))}
                </ul> */}

                {/* Mobile Button */}
                <button
                    className="md:hidden flex flex-col gap-1.5 relative z-50"
                    onClick={() => setOpen(!open)}
                >
                    <span className={`w-6 h-[2px] bg-orange-400 transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`w-6 h-[2px] bg-yellow-400 transition-all duration-300 ${open ? 'opacity-0' : ''}`}></span>
                    <span className={`w-6 h-[2px] bg-green-400 transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>
            </div>

            {/* Mobile Menu with Smooth Animation */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <ul className="bg-slate-800/95 backdrop-blur-sm px-6 py-4 space-y-4 text-lg border-t border-slate-700">
                    {menuItems.map((item, index) => (
                        <li
                            key={item.label}
                            className="cursor-pointer hover:text-yellow-400 transition flex items-center gap-3 transform transition-all duration-300"
                            style={{
                                transitionDelay: open ? `${index * 50}ms` : '0ms',
                                opacity: open ? '1' : '0',
                                transform: open ? 'translateX(0)' : 'translateX(-20px)'
                            }}
                            onClick={() => scrollToSection(item.label)}
                        >
                            <i className={`fa ${item.icon} text-xl`}></i>
                            <span>{item.label}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </nav >
    );
};

export default Navbar;