import { useState } from "react";
import { LOGO } from "../Constant";

const Navbar = () => {
    const [open, setOpen] = useState(false);

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
    };

    return (
        <nav className="w-full text-[#e8ecc0ff] border-b border-[#648DB3] mb-auto">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3 text-white font-mono">
                    <img src={LOGO} alt="Logo" className="w-14 h-14" />
                    <span className="text-2xl font-semibold">KGurukul&apos;s Computer Classes</span>
                </div>


                <ul className="hidden md:flex gap-12 text-lg">
                    {menuItems.map((item) => (
                        <li
                            key={item.label} onClick={() => scrollToSection(item.label)}
                            className="flex items-center gap-3 cursor-pointer hover:text-yellow-400 transition"
                        >
                            <i className={`fa ${item.icon} text-[32px]`} title={item.label}></i>
                            {/* <span>{item.label}</span> */}
                        </li>
                    ))}
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
                    className="md:hidden flex flex-col gap-1.5"
                    onClick={() => setOpen(!open)}
                >
                    <span className="w-6 h-[2px] bg-orange-400"></span>
                    <span className="w-6 h-[2px] bg-yellow-400"></span>
                    <span className="w-6 h-[2px] bg-green-400"></span>
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
                <ul className="md:hidden bg-slate-800 px-6 py-4 space-y-4 text-lg">
                    {["Home", "About", "Courses", "Blog", "Contact"].map((item) => (
                        <li
                            key={item}
                            className="cursor-pointer hover:text-yellow-400 transition"
                            onClick={() => setOpen(false)}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
};

export default Navbar;