import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// ── Types ─────────────────────────────────────────────────────────────────────
interface StatItem { value: string; label: string; icon: string; }
interface TeamMember { name: string; role: string; emoji: string; bio: string; }
interface Timeline { year: string; title: string; desc: string; }

// ── Data ──────────────────────────────────────────────────────────────────────
const STATS: StatItem[] = [
    { value: "50K+", label: "Rides Completed", icon: "fa-car" },
    { value: "12K+", label: "Happy Passengers", icon: "fa-smile-o" },
    { value: "800+", label: "Verified Drivers", icon: "fa-id-card-o" },
    { value: "4.9★", label: "Average Rating", icon: "fa-star" },
];

const TEAM: TeamMember[] = [
    {
        name: "Rahul Tigaya",
        role: "Founder & CEO",
        emoji: "👨‍💼",
        bio: "10+ years in logistics. Passionate about making city travel safe and affordable for everyone.",
    },
    {
        name: "Priya Mehta",
        role: "Head of Operations",
        emoji: "👩‍💻",
        bio: "Ex-Ola operations lead. Ensures every ride meets our quality and safety standards.",
    },
    {
        name: "Arjun Nair",
        role: "Lead Engineer",
        emoji: "👨‍🔧",
        bio: "Full-stack developer building the tech that powers seamless bookings and real-time tracking.",
    },
    {
        name: "Sneha Joshi",
        role: "Customer Experience",
        emoji: "👩‍🎤",
        bio: "Dedicated to making every passenger feel heard, valued, and safe throughout their journey.",
    },
];

const TIMELINE: Timeline[] = [
    {
        year: "2020",
        title: "The Idea",
        desc: "SayOne was born in India — a small team frustrated with unreliable, overpriced rides decided to build something better.",
    },
    {
        year: "2021",
        title: "First 100 Rides",
        desc: "Launched our beta with 20 drivers and completed our first 100 rides within the first month of operations.",
    },
    {
        year: "2022",
        title: "City Expansion",
        desc: "Expanded across Mumbai Metropolitan Region. Crossed 10,000 rides and onboarded 200+ verified drivers.",
    },
    {
        year: "2023",
        title: "App Launch",
        desc: "Launched iOS and Android apps with real-time tracking, SOS safety feature, and in-app payments.",
    },
    {
        year: "2024",
        title: "50K Rides & Beyond",
        desc: "Crossed 50,000 rides. Introduced corporate plans, outstation trips, and airport transfer packages.",
    },
];

const VALUES = [
    { icon: "fa-shield", label: "Safety First", desc: "Every driver is verified with background checks, license validation, and ratings." },
    { icon: "fa-rupee", label: "Fair Pricing", desc: "Transparent fares, no surge pricing surprises. What you see is what you pay." },
    { icon: "fa-leaf", label: "Eco Friendly", desc: "Promoting carpooling and EVs to reduce carbon footprint across the city." },
    { icon: "fa-clock-o", label: "Always On Time", desc: "98% on-time pick-up rate backed by real-time driver tracking." },
];

// ── Animate on scroll hook ────────────────────────────────────────────────────
const useVisible = (threshold = 0.1) => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, visible };
};

// ── Section Header ────────────────────────────────────────────────────────────
const SectionHeader = ({ tag, title, sub, isDark }: { tag: string; title: React.ReactNode; sub?: string; isDark?: boolean }) => (
    <div className="mb-12 text-center">
        <span className="inline-block text-xs font-semibold tracking-widest text-amber-400 uppercase mb-3">{tag}</span>
        <h2 className={`text-3xl md:text-4xl font-bold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>{title}</h2>
        {sub && <p className={`mt-3 text-sm max-w-xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>{sub}</p>}
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const About = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();

    const hero = useVisible(0.1);
    const stats = useVisible(0.15);
    const mission = useVisible(0.15);
    const timeline = useVisible(0.1);
    const team = useVisible(0.15);
    const values = useVisible(0.15);
    const cta = useVisible(0.15);

    const scrollToSection = (id: string) => {
        if (id === "Contact") {
            navigate("/contact");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        if (id === "Services") {
            navigate("/services");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        const el = document.getElementById(id) || document.getElementById(id.toLowerCase());
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div id="About" className={`overflow-hidden scroll-mt-16 transition-colors duration-500 ${
            isDark
                ? "bg-gradient-to-br from-[#0F172A] via-slate-900 to-black text-white"
                : "bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900"
        }`}>

            {/* ── 1. HERO ─────────────────────────────────────────────────── */}
            <section className="relative min-h-[70vh] flex items-center px-6 py-24">
                {/* Blobs */}
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

                <div
                    ref={hero.ref}
                    className="relative z-10 max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center"
                >
                    {/* Text */}
                    <div className={`space-y-6 transition-all duration-1000 transform ${hero.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
                        <span className="inline-block text-xs font-semibold tracking-widest text-amber-400 uppercase">
                            About SayOne
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Moving ,<br />
                            <span className="text-amber-400">One Ride at a Time.</span>
                        </h1>
                        <p className={`text-base leading-relaxed max-w-md ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                            SayOne is homegrown ride-sharing platform built on trust, safety, and community.
                            We connect everyday commuters with reliable drivers — making city travel smarter,
                            cheaper, and greener.
                        </p>
                        <div className="flex gap-3 flex-wrap">
                            <button
                                onClick={() => scrollToSection("Contact")}
                                className="px-6 py-3 bg-amber-400 text-slate-900 font-bold text-sm rounded-xl hover:bg-amber-300 transition hover:shadow-lg hover:shadow-amber-400/20"
                            >
                                Book a Ride &nbsp;<i className="fa fa-arrow-right" />
                            </button>
                            <button
                                onClick={() => scrollToSection("Services")}
                                className={`px-6 py-3 border font-semibold text-sm rounded-xl transition ${
                                    isDark
                                        ? "border-slate-700 text-slate-300 hover:border-amber-400 hover:text-amber-400"
                                        : "border-slate-300 text-slate-700 hover:border-amber-500 hover:text-amber-600 bg-white"
                                }`}
                            >
                                Our Services
                            </button>
                        </div>
                    </div>

                    {/* Visual card */}
                    <div className={`relative transition-all duration-1000 delay-300 transform ${hero.visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"}`}>
                        <div className={`border rounded-3xl p-8 space-y-5 shadow-2xl ${
                            isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 text-slate-900"
                        }`}>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-3xl">🚗</span>
                                <div>
                                    <p className="font-bold text-lg">SayOne Rides</p>
                                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Thane · Mumbai · MMR</p>
                                </div>
                                <span className="ml-auto text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    Live
                                </span>
                            </div>
                            {[
                                { label: "Active Drivers", value: "800+", color: "bg-amber-400" },
                                { label: "Rides Today", value: "1,240", color: "bg-emerald-400" },
                                { label: "Avg Wait Time", value: "3 min", color: "bg-blue-400" },
                                { label: "Safety Score", value: "99.2%", color: "bg-purple-400" },
                            ].map(item => (
                                <div key={item.label} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${item.color}`} />
                                        <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>{item.label}</span>
                                    </div>
                                    <span className="font-semibold text-sm">{item.value}</span>
                                </div>
                            ))}
                        </div>
                        {/* Floating badge */}
                        <div className="absolute -bottom-4 -right-4 bg-amber-400 text-slate-900 rounded-2xl px-4 py-2 text-xs font-bold shadow-lg shadow-amber-400/20">
                            Since 2020 🏆
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 2. STATS ────────────────────────────────────────────────── */}
            <section className={`border-y px-6 py-14 ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-100/70 border-slate-200"}`}>
                <div
                    ref={stats.ref}
                    className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {STATS.map((s, i) => (
                        <div
                            key={s.label}
                            className={`text-center p-6 rounded-2xl border transition-all duration-700 transform group ${
                                isDark
                                    ? "bg-slate-900/90 border-slate-800 hover:border-amber-400/40"
                                    : "bg-white border-slate-200 hover:border-amber-400/60 shadow-sm"
                            } ${stats.visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"}`}
                            style={{ transitionDelay: `${i * 120}ms` }}
                        >
                            <i className={`fa ${s.icon} text-amber-400 text-2xl mb-3 block group-hover:scale-110 transition-transform duration-300`} />
                            <p className="text-3xl font-bold mb-1">{s.value}</p>
                            <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── 3. MISSION & VISION ─────────────────────────────────────── */}
            <section className="px-6 py-20">
                <div
                    ref={mission.ref}
                    className="max-w-6xl mx-auto"
                >
                    <div className={`transition-all duration-700 transform ${mission.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <SectionHeader
                            isDark={isDark}
                            tag="Why We Exist"
                            title={<>Our <span className="text-amber-400">Mission & Vision</span></>}
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                icon: "fa-rocket",
                                head: "Our Mission",
                                text: "To make daily commuting in affordable, safe, and reliable for every passenger — whether it's a 5-minute local trip or a long outstation journey.",
                            },
                            {
                                icon: "fa-eye",
                                head: "Our Vision",
                                text: "To become the most trusted ride-sharing platform in Maharashtra, reducing traffic congestion through smart carpooling and transitioning to a fully electric fleet by 2027.",
                            },
                        ].map((item, i) => (
                            <div
                                key={item.head}
                                className={`border rounded-3xl p-8 transition-all duration-700 transform group ${
                                    isDark
                                        ? "bg-slate-900/90 border-slate-800 hover:border-amber-400/30"
                                        : "bg-white border-slate-200 hover:border-amber-400/60 shadow-md"
                                } ${mission.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                                style={{ transitionDelay: `${200 + i * 150}ms` }}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center mb-5 group-hover:bg-amber-400/20 group-hover:scale-110 transition-all duration-300">
                                    <i className={`fa ${item.icon} text-amber-400 text-xl`} />
                                </div>
                                <h3 className="font-bold text-xl mb-3">{item.head}</h3>
                                <p className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 4. VALUES ───────────────────────────────────────────────── */}
            <section className={`border-y px-6 py-20 ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-100/70 border-slate-200"}`}>
                <div
                    ref={values.ref}
                    className="max-w-6xl mx-auto"
                >
                    <div className={`transition-all duration-700 transform ${values.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <SectionHeader
                            isDark={isDark}
                            tag="What Drives Us"
                            title={<>Our Core <span className="text-amber-400">Values</span></>}
                            sub="Everything we build and every decision we make is guided by these four principles."
                        />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {VALUES.map((v, i) => (
                            <div
                                key={v.label}
                                className={`border rounded-2xl p-6 transition-all duration-700 transform group ${
                                    isDark
                                        ? "bg-slate-900/90 border-slate-800 hover:border-amber-400/40"
                                        : "bg-white border-slate-200 hover:border-amber-400/60 shadow-sm"
                                } ${values.visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"}`}
                                style={{ transitionDelay: `${i * 100}ms` }}
                            >
                                <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center mb-4 group-hover:bg-amber-400/20 group-hover:scale-110 transition-all duration-300">
                                    <i className={`fa ${v.icon} text-amber-400`} />
                                </div>
                                <h4 className="font-semibold mb-2">{v.label}</h4>
                                <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 5. TIMELINE ─────────────────────────────────────────────── */}
            <section className="px-6 py-20">
                <div
                    ref={timeline.ref}
                    className="max-w-4xl mx-auto"
                >
                    <div className={`transition-all duration-700 transform ${timeline.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <SectionHeader
                            isDark={isDark}
                            tag="Our Journey"
                            title={<>From Idea to <span className="text-amber-400">50K Rides</span></>}
                            sub="Every great ride starts somewhere. Here's ours."
                        />
                    </div>
                    <div className="relative">
                        {/* Vertical line */}
                        <div className={`absolute left-[18px] md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 ${isDark ? "bg-slate-800" : "bg-slate-300"}`} />

                        <div className="space-y-10">
                            {TIMELINE.map((item, i) => (
                                <div
                                    key={item.year}
                                    className={`relative flex gap-6 md:gap-0 items-start transition-all duration-700 transform ${timeline.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"} ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                                    style={{ transitionDelay: `${i * 120}ms` }}
                                >
                                    {/* Dot */}
                                    <div className={`absolute left-0 md:left-1/2 -translate-x-1/2 w-9 h-9 rounded-full border-2 border-amber-400 flex items-center justify-center z-10 shrink-0 shadow-lg ${
                                        isDark ? "bg-slate-900 shadow-amber-400/10" : "bg-white shadow-amber-400/20"
                                    }`}>
                                        <span className="text-amber-400 text-xs font-bold">{item.year.slice(2)}</span>
                                    </div>

                                    {/* Card */}
                                    <div className={`ml-12 md:ml-0 md:w-[45%] ${i % 2 === 0 ? "md:mr-auto md:pr-10" : "md:ml-auto md:pl-10"}`}>
                                        <div className={`border rounded-2xl p-5 transition hover:scale-[1.02] duration-300 ${
                                            isDark
                                                ? "bg-slate-900/90 border-slate-800 hover:border-amber-400/30"
                                                : "bg-white border-slate-200 hover:border-amber-400/60 shadow-md"
                                        }`}>
                                            <span className="text-amber-400 text-xs font-bold">{item.year}</span>
                                            <h4 className="font-semibold mt-1 mb-2">{item.title}</h4>
                                            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 6. TEAM ─────────────────────────────────────────────────── */}
            <section className={`border-t px-6 py-20 ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-100/70 border-slate-200"}`}>
                <div
                    ref={team.ref}
                    className="max-w-6xl mx-auto"
                >
                    <div className={`transition-all duration-700 transform ${team.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        <SectionHeader
                            isDark={isDark}
                            tag="The People"
                            title={<>Meet the <span className="text-amber-400">Team</span></>}
                            sub="A small, passionate team building the future of local transportation."
                        />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TEAM.map((member, i) => (
                            <div
                                key={member.name}
                                className={`border rounded-2xl p-6 text-center transition-all duration-700 transform group ${
                                    isDark
                                        ? "bg-slate-900/90 border-slate-800 hover:border-amber-400/40"
                                        : "bg-white border-slate-200 hover:border-amber-400/60 shadow-sm"
                                } ${team.visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"}`}
                                style={{ transitionDelay: `${i * 100}ms` }}
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 transition ${
                                    isDark ? "bg-slate-800 group-hover:bg-amber-400/10" : "bg-slate-100 group-hover:bg-amber-50"
                                }`}>
                                    {member.emoji}
                                </div>
                                <h4 className="font-semibold">{member.name}</h4>
                                <p className="text-amber-400 text-xs font-medium mt-1 mb-3">{member.role}</p>
                                <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 7. BOTTOM CTA ───────────────────────────────────────────── */}
            <section ref={cta.ref} className="px-6 py-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-amber-400/3 pointer-events-none" />
                <div className={`relative z-10 max-w-xl mx-auto space-y-5 transition-all duration-1000 transform ${cta.visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"}`}>
                    <span className="text-4xl inline-block animate-bounce">🚀</span>
                    <h2 className="text-3xl font-bold">
                        Ready to ride with us?
                    </h2>
                    <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Join thousands of happy passengers across India. Your next ride is just one tap away.
                    </p>
                    <div className="flex gap-3 justify-center flex-wrap">
                        <button
                            onClick={() => scrollToSection("Contact")}
                            className="px-8 py-3 bg-amber-400 text-slate-900 font-bold text-sm rounded-xl hover:bg-amber-300 transition hover:shadow-lg hover:shadow-amber-400/20 hover:scale-105"
                        >
                            Book Now &nbsp;<i className="fa fa-car" />
                        </button>
                        <button
                            onClick={() => scrollToSection("Services")}
                            className={`px-8 py-3 border font-semibold text-sm rounded-xl transition hover:scale-105 ${
                                isDark
                                    ? "border-slate-700 text-slate-300 hover:border-amber-400 hover:text-amber-400"
                                    : "border-slate-300 text-slate-700 hover:border-amber-500 hover:text-amber-600 bg-white"
                            }`}
                        >
                            View Services
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default About;