import React from "react";
import { STUDENTS } from "../Constant";

const Hero: React.FC = () => {
    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
            {/* MAIN CONTAINER */}
            <div className="mx-auto max-w-7xl px-6 pt-16 pb-20 flex flex-col lg:flex-row items-center justify-between gap-16">

                {/* LEFT CONTENT */}
                <div className="max-w-xl">
                    <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight">
                        Learn Smarter <br />
                        With <span className="text-purple-500">KGurukul</span>
                    </h1>

                    <p className="mt-6 text-slate-300 text-lg leading-relaxed">
                        Upgrade your skills with structured learning, top mentors,
                        and real-world preparation.
                    </p>

                    <div className="mt-8 flex gap-4">
                        <button className="rounded-full bg-purple-600 px-7 py-3 font-semibold hover:bg-purple-700 transition">
                            Get Started
                        </button>
                        <button className="rounded-full border border-slate-500 px-7 py-3 hover:bg-white/10 transition">
                            Watch Demo
                        </button>
                    </div>
                </div>

                {/* RIGHT DASHBOARD */}
                <div className="relative w-full max-w-xl animate-float">
                    <img
                        src="/dashboard.png"
                        alt="Dashboard"
                        className="w-full"
                    />

                    {/* LOGIN BUTTON INSIDE SCREEN */}
                    <button className="absolute bottom-[65%] right-[55%] rounded-full bg-green-400 px-6 py-2 font-semibold text-black shadow-lg hover:bg-green-500 transition">
                        Login
                    </button>
                </div>
            </div>

            {/* TOP STUDENTS */}
            <div className="absolute bottom-10 left-10 hidden md:flex gap-4">
                {STUDENTS.slice(0, 3).map((s, i) => (
                    <div
                        key={i}
                        className="w-28 rounded-xl bg-white/10 backdrop-blur-md p-3 text-center shadow-lg"
                    >
                        <img
                            src={s.image}
                            alt={s.name}
                            className="h-16 w-full rounded-lg object-cover mb-2"
                        />
                        <p className="text-xs font-semibold">{s.name}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Hero;