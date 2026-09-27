import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { EMAIL, CONTACT_NUMBERS, BRANCH_ADDRESS } from "../Constant";

const Footer: React.FC = () => {
    const year = new Date().getFullYear();
    const navigate = useNavigate();
    const location = useLocation();

    const quickLinks = [
        { label: "Home", target: "Home" },
        { label: "Services", target: "Courses" },
        { label: "About Us", target: "About" },
        { label: "Contact Us", target: "Contact" },
    ];

    const services = [
        { label: "City Rides", target: "Courses" },
        { label: "Outstation Trips", target: "Courses" },
        { label: "Airport Transfers", target: "Courses" },
        { label: "Corporate Booking", target: "Courses" },
        { label: "Hourly Rentals", target: "Courses" },
        { label: "Group Travel", target: "Courses" },
    ];

    const socials = [
        { icon: "fa-facebook", href: "#", label: "Facebook" },
        { icon: "fa-instagram", href: "#", label: "Instagram" },
        { icon: "fa-twitter", href: "#", label: "Twitter" },
        { icon: "fa-whatsapp", href: "#", label: "WhatsApp" },
    ];

    const scrollTo = (targetId: string) => {
        if (targetId === "Contact Us" || targetId === "Contact") {
            navigate("/contact");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (location.pathname !== "/") {
            navigate("/");
            setTimeout(() => {
                const element = document.getElementById(targetId);
                element?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        } else {
            const element = document.getElementById(targetId);
            element?.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <footer className="w-full bg-[#0F172A] border-t border-slate-800 text-slate-300 mt-auto">

            {/* ── Top CTA Strip ── */}
            <div className="bg-[#09090B] border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                        <p className="text-white font-bold text-lg leading-tight">Ready for your next ride ?</p>
                        <p className="text-slate-400 text-sm">Book now and enjoy safe, reliable transportation.</p>
                    </div>
                    <button
                        onClick={() => scrollTo("Contact")}
                        className="shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-sm px-6 py-2.5 rounded-xl transition shadow-md"
                    >
                        Book a Ride &nbsp;<i className="fa fa-arrow-right" />
                    </button>
                </div>
            </div>

            {/* ── Main Footer Grid ── */}
            <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                {/* Brand */}
                <div className="space-y-4 lg:col-span-1">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-white font-mono">SayOne</span>
                        <span className="text-[10px] font-semibold bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded-md tracking-wide">RIDES</span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
                        Thane's trusted ride-sharing platform connecting passengers with safe, affordable, and reliable drivers across the city.
                    </p>
                    {/* Socials */}
                    <div className="flex gap-2 pt-1">
                        {socials.map(s => (
                            <a
                                key={s.label}
                                href={s.href}
                                aria-label={s.label}
                                className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-400/40 transition text-sm"
                            >
                                <i className={`fa ${s.icon}`} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-white text-sm font-semibold mb-5 flex items-center gap-2">
                        <span className="w-4 h-[2px] bg-amber-400 inline-block"></span>
                        Quick Links
                    </h4>
                    <ul className="space-y-3">
                        {quickLinks.map(link => (
                            <li key={link.label}>
                                <button
                                    onClick={() => scrollTo(link.target)}
                                    className="text-sm text-slate-400 hover:text-amber-400 transition flex items-center gap-2 group"
                                >
                                    <i className="fa fa-chevron-right text-[10px] text-amber-400/0 group-hover:text-amber-400 transition" />
                                    {link.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Our Services */}
                <div>
                    <h4 className="text-white text-sm font-semibold mb-5 flex items-center gap-2">
                        <span className="w-4 h-[2px] bg-amber-400 inline-block"></span>
                        Our Services
                    </h4>
                    <ul className="space-y-3">
                        {services.map(s => (
                            <li key={s.label}>
                                <button
                                    onClick={() => scrollTo(s.target)}
                                    className="text-sm text-slate-400 hover:text-amber-400 transition flex items-center gap-2 group"
                                >
                                    <i className="fa fa-chevron-right text-[10px] text-amber-400/0 group-hover:text-amber-400 transition" />
                                    {s.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="text-white text-sm font-semibold mb-5 flex items-center gap-2">
                        <span className="w-4 h-[2px] bg-amber-400 inline-block"></span>
                        Contact Us
                    </h4>
                    <ul className="space-y-4">
                        <li className="flex gap-3">
                            <i className="fa fa-map-marker text-amber-400 mt-0.5 shrink-0" />
                            <span className="text-sm text-slate-400 leading-relaxed">
                                {BRANCH_ADDRESS}
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <i className="fa fa-phone text-amber-400 mt-0.5 shrink-0" />
                            <div className="space-y-1">
                                <a href={`tel:${CONTACT_NUMBERS}`} className="block text-sm text-slate-400 hover:text-amber-400 transition">
                                    {CONTACT_NUMBERS}
                                </a>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <i className="fa fa-envelope text-amber-400 mt-0.5 shrink-0" />
                            <a href={`mailto:${EMAIL}`} className="text-sm text-slate-400 hover:text-amber-400 transition break-all">
                                {EMAIL}
                            </a>
                        </li>
                        <li className="flex gap-3">
                            <i className="fa fa-clock-o text-amber-400 mt-0.5 shrink-0" />
                            <span className="text-sm text-slate-400">
                                Mon – Sat: 07:00 AM – 08:00 PM
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* ── Bottom Strip ── */}
            <div className="border-t border-slate-800" />
            <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-md text-center md:text-left text-slate-400">
                    © {year} <span className="text-white font-medium">SayOne, </span> All rights reserved.
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                    <a href="#" className="hover:text-amber-400 transition">Privacy Policy</a>
                    <span>·</span>
                    <a href="#" className="hover:text-amber-400 transition">Terms of Service</a>
                    <span>·</span>
                    <a href="#" className="hover:text-amber-400 transition">Safety</a>
                </div>

                <p className="text-md text-center md:text-right cursor-pointer hover:text-amber-400 hover:underline text-slate-400">
                    Made With ❤️ in India
                </p>
            </div>

        </footer>
    );
};

export default Footer;