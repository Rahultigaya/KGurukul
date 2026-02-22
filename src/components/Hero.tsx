import React, { useState, useEffect } from "react";
import { STUDENTS } from "../Constant";

const Hero: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-scroll every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % STUDENTS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-[85vh] overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
            {/* MAIN CONTAINER */}
            <div className="mx-auto max-w-7xl px-6 pt-16 pb-28 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">

                {/* LEFT CONTENT */}
                <div className="max-w-xl">
                    <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight">
                        Learn Smarter <br />
                        With <span className="text-purple-500">KGurukul</span><span>'s</span>
                    </h1>

                    <p className="mt-6 text-slate-300 text-lg leading-relaxed">
                        Upgrade your skills with structured learning, top mentors,
                        and real-world preparation.
                    </p>

                    <div className="mt-6 md:mt-8">
                        {/* Programming Flow - Java -> Python -> Code -> Login */}
                        <div className="flex items-center justify-center gap-1.5 md:gap-3 flex-wrap">
                            {/* Java Badge */}
                            <div className="flex items-center">
                                <div className="px-2 py-1 md:px-4 md:py-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                                    <span className="text-white text-[10px] md:text-sm font-bold">Java</span>
                                </div>
                            </div>

                            {/* Connection Arrow 1 */}
                            <svg className="w-4 h-4 md:w-6 md:h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>

                            {/* Python Badge */}
                            <div className="flex items-center">
                                <div className="px-2 py-1 md:px-4 md:py-2 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-lg shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                    <span className="text-white text-[10px] md:text-sm font-bold">Python</span>
                                </div>
                            </div>

                            {/* Connection Arrow 2 */}
                            <svg className="w-4 h-4 md:w-6 md:h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>

                            {/* Code Symbol */}
                            <div className="flex items-center">
                                <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center shadow-lg transform -rotate-6 hover:rotate-0 transition-transform duration-300 border border-slate-500">
                                    <span className="text-white text-xs md:text-base font-bold">&lt;/&gt;</span>
                                </div>
                            </div>

                            {/* Connection Arrow 3 */}
                            <svg className="w-4 h-4 md:w-6 md:h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>

                            {/* Login Button */}
                            <button className="relative group flex-shrink-0">
                                {/* Button Glow Effect */}
                                <div className="absolute -inset-0.5 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500"></div>

                                {/* Main Button */}
                                <div className="relative flex items-center justify-center gap-1.5 md:gap-3 border rounded-lg border-2 border-400 hover:text-green-400 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 px-3 md:px-6 py-2 md:py-3 font-semibold text-white shadow-xl hover:shadow-2xl transition-all hover:rounded-full duration-300 hover:scale-105">
                                    {/* Button Text */}
                                    <span className="text-xs md:text-lg">Login</span>
                                    <i className="fa fa-long-arrow-right" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE - Royal Coverflow Slider */}
                <div className="relative w-full max-w-2xl lg:max-w-lg">
                    {/* Coverflow Container */}
                    <div className="relative h-[400px] md:h-[350px] flex items-center justify-center">
                        {STUDENTS.map((student, index) => {
                            const isCenter = index === currentIndex;
                            const isLeft = (currentIndex - index + STUDENTS.length) % STUDENTS.length === 1;
                            const isRight = (index - currentIndex + STUDENTS.length) % STUDENTS.length === 1;

                            // Calculate positions
                            let translateX = 0;
                            let translateZ = 0;
                            let scale = 1;
                            let opacity = 1;
                            let zIndex = 10;

                            if (isCenter) {
                                translateX = 0;
                                translateZ = 0;
                                scale = 1;
                                opacity = 1;
                                zIndex = 20; // Highest z-index for center card
                            } else if (isLeft) {
                                translateX = -120;
                                translateZ = -150;
                                scale = 0.8;
                                opacity = 0.4; // Much lower opacity for side cards
                                zIndex = 5;
                            } else if (isRight) {
                                translateX = 120;
                                translateZ = -150;
                                scale = 0.8;
                                opacity = 0.4; // Much lower opacity for side cards
                                zIndex = 5;
                            } else {
                                translateX = 0;
                                translateZ = -200;
                                scale = 0.6;
                                opacity = 0;
                                zIndex = 0;
                            }

                            return (
                                <div
                                    key={index}
                                    className="absolute w-72 md:w-80 transition-all duration-700 ease-in-out cursor-pointer"
                                    style={{
                                        transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale})`,
                                        opacity,
                                        zIndex,
                                        willChange: 'transform, opacity'
                                    }}
                                    onClick={() => setCurrentIndex(index)}
                                >
                                    {/* Royal Card Design */}
                                    <div className={`
                                        relative rounded-3xl overflow-hidden shadow-2xl
                                        ${isCenter ? 'border-2' : ''}
                                        transition-all duration-500
                                        ${!isCenter ? 'opacity-50' : ''}
                                    `}>
                                        {/* Card Background */}
                                        <div className={`
                                            absolute inset-0 bg-gradient-to-br
                                            ${isCenter
                                                ? 'from-green-900/90 via-yellow-900/90 to-pink-900/90'
                                                : 'from-blue-400/80 via-green-900/90 to-red-400/60 border'}
                                        `}></div>

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                                        {/* Card Content */}
                                        <div className="relative p-6 md:p-8 h-full flex flex-col items-center">
                                            {/* Large Avatar */}
                                            <div className="relative mb-6 md:mb-8 mt-4">
                                                <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-br border-2 p-0.5 shadow-2xl">
                                                    <img
                                                        src={student.image}
                                                        alt={student.name}
                                                        className="w-full h-full rounded-full object-cover border-1 border-white/80"
                                                    />
                                                </div>

                                                {/* Floating Rank Badge */}
                                                <div className="absolute -bottom-2 -right-[0] w-14 h-14 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-xl border-2 border-slate-900">
                                                    <span className="text-black font-bold text-base md:text-lg">{student.rank}</span>
                                                </div>
                                            </div>

                                            {/* Name */}
                                            <h2 className={`
                                                font-bold text-center mb-1 transition-all duration-300
                                                ${isCenter ? 'text-white text-xl md:text-2xl' : 'text-gray-400 text-lg md:text-xl'}
                                            `}>
                                                {student.name}
                                            </h2>

                                            {/* Stats Row - Only for Center Card */}
                                            {isCenter && (
                                                <div className="w-full space-y-2">
                                                    <div className="flex items-center justify-center gap-3 text-sm text-gray-200">
                                                        <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                                                            <span className="text-green-400">✓</span>
                                                            <span>Top Scorer</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Shine Effect for Center Card */}
                                            {isCenter && (
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-3xl pointer-events-none"></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Navigation Dots - Below Slider */}
                    <div className="flex justify-center gap-2 md:gap-3 mt-6">
                        {STUDENTS.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`
                                    h-2.5 rounded-full transition-all duration-300
                                    ${index === currentIndex
                                        ? "bg-gradient-to-r from-purple-400 to-blue-400 w-8 md:w-10"
                                        : "bg-white/20 hover:bg-white/40 w-2"
                                    }
                                `}
                                aria-label={`Go to student ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

            </div>

            {/* Marquee Banner - Admission Alert */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r py-3 overflow-hidden mt-[200]">
                <div className="flex animate-marquee whitespace-nowrap">
                    {/* Repeated text for infinite scroll effect */}
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 mx-8">
                            <span className="text-lg md:text-xl font-bold text-white drop-shadow-lg">
                                🎉 Hurry up! Next year batches admission starting soon 🎉 !!
                            </span>
                            {/* <span className="text-2xl">✨</span> */}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
