import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { STUDENTS } from "../Constant";

import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";

const ROTATE_INTERVAL_MS = 4000;

const ArrowIcon = () => (
    <KeyboardArrowRightRoundedIcon className="text-[#1A73E8]" style={{ fontSize: 22 }} />
);

// Java/Python keep their own real-world brand colors — the language identity matters more here than the site palette
const SKILL_BADGES = [
    { label: "Java", gradient: "from-orange-500 to-red-600", rotate: "-rotate-3" },
    { label: "Python", gradient: "from-blue-500 to-yellow-500", rotate: "rotate-3" },
];

const Hero: React.FC = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-rotate the student coverflow
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % STUDENTS.length);
        }, ROTATE_INTERVAL_MS);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-[85vh] overflow-hidden bg-white text-[#202124]">
            <div className="mx-auto max-w-7xl px-6 pt-16 pb-28 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">

                {/* LEFT CONTENT */}
                <div className="max-w-xl">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-[#1A73E8] shadow-sm border border-[#E8EAED] mb-6">
                        <AutoAwesomeRoundedIcon style={{ fontSize: 16 }} />
                        Trusted by 500+ Students
                    </span>

                    <h1 className="font-['Baloo_2'] text-4xl md:text-5xl xl:text-6xl font-bold leading-tight">
                        Learn Smarter <br />
                        With <span className="text-[#1A73E8]">KGurukul</span>'s
                    </h1>
                    {/* Signature squiggle — same motif used across the site */}
                    <svg width="140" height="14" viewBox="0 0 140 14" fill="none" className="mt-2">
                        <path d="M2 10C25 2 45 2 68 8C91 14 111 6 138 4"
                            stroke="url(#hero-underline-grad)" strokeWidth="3" strokeLinecap="round" />
                        <defs>
                            <linearGradient id="hero-underline-grad" x1="0" y1="0" x2="140" y2="0">
                                <stop offset="0%" stopColor="#1A73E8" />
                                <stop offset="35%" stopColor="#0F9D58" />
                                <stop offset="65%" stopColor="#EA4335" />
                                <stop offset="100%" stopColor="#F9AB00" />
                            </linearGradient>
                        </defs>
                    </svg>

                    <p className="mt-6 text-[#5F6368] text-lg leading-relaxed">
                        Upgrade your skills with structured learning, top mentors,
                        and real-world preparation.
                    </p>

                    {/* Programming Flow: Java -> Python -> Code -> Login */}
                    <div className="mt-6 md:mt-8 flex items-center justify-center lg:justify-start gap-1.5 md:gap-3 flex-wrap">
                        {SKILL_BADGES.map((badge) => (
                            <React.Fragment key={badge.label}>
                                <div className={`px-2 py-1 md:px-4 md:py-2 bg-gradient-to-r ${badge.gradient} rounded-lg shadow-lg transform ${badge.rotate} hover:rotate-0 transition-transform duration-300`}>
                                    <span className="text-white text-[10px] md:text-sm font-bold">{badge.label}</span>
                                </div>
                                <ArrowIcon />
                            </React.Fragment>
                        ))}

                        {/* Code Symbol */}
                        <div className="w-8 h-8 md:w-12 md:h-12 bg-[#202124] rounded-lg flex items-center justify-center shadow-lg transform -rotate-6 hover:rotate-0 transition-transform duration-300 border border-[#DADCE0]">
                            <span className="text-white text-xs md:text-base font-bold">&lt;/&gt;</span>
                        </div>
                        <ArrowIcon />

                        {/* Login Button - same square shape as badges, stands out via color/glow/motion instead */}
                        <button
                            onClick={() => navigate("/auth/login")}
                            className="rotate-3 relative flex-shrink-0 group"
                        >
                            {/* Quiet attention pulse — softened so it doesn't fight the badges for focus */}
                            <span className="rotate-3 absolute inset-0 rounded-lg bg-[#1A73E8] opacity-30 animate-ping" />

                            {/* Actual button */}
                            <span className="rotate-3 relative flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-1.5 md:py-3 bg-[#1A73E8] group-hover:bg-[#1765CC] rounded-lg shadow-lg shadow-[#1A73E8]/40 group-hover:scale-105 transition-all duration-300">
                                <span className="text-white text-xs md:text-base font-bold">Login</span>
                                <ArrowForwardRoundedIcon style={{ fontSize: 16 }} className="text-white" />
                            </span>
                        </button>
                    </div>
                </div>

                {/* RIGHT SIDE - Coverflow Slider */}
                <div className="relative w-full max-w-2xl lg:max-w-lg">
                    <div className="relative h-[400px] md:h-[350px] flex items-center justify-center">
                        {STUDENTS.map((student, index) => {
                            const isCenter = index === currentIndex;
                            const isLeft = (currentIndex - index + STUDENTS.length) % STUDENTS.length === 1;
                            const isRight = (index - currentIndex + STUDENTS.length) % STUDENTS.length === 1;

                            let translateX = 0;
                            let translateZ = -200;
                            let scale = 0.6;
                            let opacity = 0;
                            let zIndex = 0;

                            if (isCenter) {
                                translateZ = 0;
                                scale = 1;
                                opacity = 1;
                                zIndex = 20;
                            } else if (isLeft) {
                                translateX = -120;
                                translateZ = -150;
                                scale = 0.8;
                                opacity = 0.4;
                                zIndex = 5;
                            } else if (isRight) {
                                translateX = 120;
                                translateZ = -150;
                                scale = 0.8;
                                opacity = 0.4;
                                zIndex = 5;
                            }

                            return (
                                <div
                                    key={index}
                                    className="absolute w-72 md:w-80 transition-all duration-700 ease-in-out cursor-pointer"
                                    style={{
                                        transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale})`,
                                        opacity,
                                        zIndex,
                                        willChange: "transform, opacity",
                                    }}
                                    onClick={() => setCurrentIndex(index)}
                                >
                                    <div className={`
                                        relative rounded-3xl overflow-hidden shadow-[0_1px_3px_rgba(60,64,67,0.15),0_1px_2px_rgba(60,64,67,0.1)]
                                        ${isCenter ? "border-2 border-[#1A73E8]" : "border border-[#E8EAED]"}
                                        transition-all duration-500
                                        ${!isCenter ? "opacity-50" : ""}
                                    `}>
                                        <div className="absolute inset-0 bg-white" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                        <div className="relative p-6 md:p-8 h-full flex flex-col items-center">
                                            {/* Avatar */}
                                            <div className="relative mb-6 md:mb-8 mt-4">
                                                <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-white border-2 border-[#1A73E8] p-0.5 shadow-xl">
                                                    <img
                                                        src={student.image}
                                                        alt={student.name}
                                                        className="w-full h-full rounded-full object-cover border border-white"
                                                    />
                                                </div>

                                                <div className="absolute -bottom-2 -right-0 w-14 h-14 md:w-12 md:h-12 bg-[#F9AB00] rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                                                    <span className="text-[#202124] font-bold text-base md:text-lg">{student.rank}</span>
                                                </div>
                                            </div>

                                            <h2 className={`font-bold text-center mb-1 transition-all duration-300 ${isCenter ? "text-white text-xl md:text-2xl" : "text-white/70 text-lg md:text-xl"}`}>
                                                {student.name}
                                            </h2>

                                            {isCenter && (
                                                <div className="flex items-center justify-center gap-3 text-sm text-white">
                                                    <div className="flex items-center gap-1.5 bg-[#0F9D58] px-3 py-1 rounded-full">
                                                        <CheckCircleRoundedIcon style={{ fontSize: 16 }} />
                                                        <span>Top Scorer</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex justify-center gap-2 md:gap-3 mt-6">
                        {STUDENTS.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-[#1A73E8] w-8 md:w-10" : "bg-[#DADCE0] hover:bg-[#BDC1C6] w-2"}`}
                                aria-label={`Go to student ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

            </div>

            {/* Marquee Banner - Admission Alert */}
            <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
                 

                <div className="bg-gradient-to-r from-[#1A73E8] to-[#1765CC] py-3 flex items-center gap-4 pl-6">
                    <span className="hidden sm:inline-flex shrink-0 items-center gap-1.5 bg-white/15 text-white text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full">
                        <CelebrationRoundedIcon style={{ fontSize: 14 }} />
                        Admissions Open
                    </span>

                    <div className="flex-1 overflow-hidden">
                        <div className="flex animate-marquee whitespace-nowrap">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <span key={i} className="flex items-center gap-3 text-base md:text-lg font-semibold text-white mx-6">
                                  🎉 Admissions Open for Next Year's Batches • Limited Seats Available • Enroll Today! 🚀💻
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#F9AB00]" />
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;