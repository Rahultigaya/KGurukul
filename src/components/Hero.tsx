import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { TextRoll } from "@/components/core/text-roll";
import { UberMap } from "./UberMap";

const Hero: React.FC = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();

    return (
        <section className={`relative min-h-[85vh] overflow-hidden transition-colors duration-500 ${isDark
            ? "bg-gradient-to-br from-[#0F172A] via-slate-900 to-black text-white"
            : "bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900"
            }`}>
            {/* MAIN CONTAINER */}
            <div className="mx-auto max-w-7xl px-6 pt-12 pb-24 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

                {/* LEFT CONTENT */}
                <div className="max-w-xl w-full">
                    {/* Rolling Slogans Title */}
                    <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight">
                        <TextRoll
                            items={["Share the Ride", "Save the Money", "Request a Ride"]}
                            className="text-purple-500 drop-shadow-md"
                        />
                        <br />
                        With <span className="text-amber-400">SayOne</span>
                    </h1>

                    <p className={`mt-6 text-base sm:text-lg leading-relaxed transition-colors duration-500 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                        Connect with verified co-travelers, cut your daily commute costs,
                        and enjoy comfortable point-to-point rides across the city.
                    </p>

                    {/* Action Flow Badges */}
                    <div className="mt-8">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            {/* Ride Badge */}
                            <div className="flex items-center">
                                <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                                    <span className="text-white text-xs sm:text-sm font-bold">🚗 Daily Rides</span>
                                </div>
                            </div>

                            {/* Connection Arrow 1 */}
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>

                            {/* Savings Badge */}
                            <div className="flex items-center">
                                <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-300">
                                    <span className="text-white text-xs sm:text-sm font-bold">💰 Save 50%</span>
                                </div>
                            </div>

                            {/* Connection Arrow 2 */}
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>

                            {/* Safety Symbol */}
                            <div className="flex items-center">
                                <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl flex items-center justify-center shadow-lg border transform -rotate-1 hover:rotate-0 transition-all duration-300 ${isDark ? "bg-slate-800 border-slate-700 text-amber-300" : "bg-white border-slate-300 text-amber-600"}`}>
                                    <span className="text-xs sm:text-sm font-bold">🛡️ Verified</span>
                                </div>
                            </div>

                            {/* Connection Arrow 3 */}
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>

                            {/* CTA Button */}
                            <button
                                className="relative group flex-shrink-0"
                                onClick={() => navigate('/auth/login')}
                            >
                                <div className="absolute -inset-0.5 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-500 bg-amber-400"></div>

                                <div className="relative flex items-center justify-center gap-2 border rounded-xl border-amber-400 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 px-4 sm:px-6 py-2 sm:py-2.5 font-bold text-slate-900 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                                    <span className="text-xs sm:text-sm font-extrabold">Book Ride</span>
                                    <i className="fa fa-long-arrow-right" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE - Uber Style Interactive Live Map */}
                <div className="w-full max-w-xl lg:max-w-lg shrink-0">
                    <UberMap />
                </div>

            </div>
        </section>
    );
};

export default Hero;