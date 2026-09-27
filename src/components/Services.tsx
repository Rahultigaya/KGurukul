import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Service { icon: string; title: string; desc: string; badge?: string; }
interface Step { step: string; icon: string; title: string; desc: string; }
interface Feature { icon: string; title: string; desc: string; }

// ── Data ──────────────────────────────────────────────────────────────────────
const SERVICES: Service[] = [
    {
        icon: "fa-search",
        title: "Search Your Route",
        desc: "Enter your pickup and drop location. We instantly show the best routes, estimated time, and fare — no hidden charges.",
        badge: "Most Used",
    },
    {
        icon: "fa-users",
        title: "Find a Ride Partner",
        desc: "Heading the same way? Match with co-passengers on your route and split the fare. Save money, make friends.",
        badge: "Popular",
    },
    {
        icon: "fa-car",
        title: "City Rides",
        desc: "Quick, reliable rides within Thane and Mumbai. Available 24/7 with verified drivers at your doorstep in minutes.",
    },
    {
        icon: "fa-road",
        title: "Outstation Trips",
        desc: "Planning a weekend getaway? Book one-way or round-trip outstation rides at fixed affordable prices.",
    },
    {
        icon: "fa-plane",
        title: "Airport Transfers",
        desc: "Stress-free airport pickups and drops. Flight tracking included — your driver waits even if your flight is delayed.",
    },
    {
        icon: "fa-briefcase",
        title: "Corporate Booking",
        desc: "Dedicated ride plans for offices and businesses. Centralized billing, priority support, and monthly reports.",
    },
    {
        icon: "fa-clock-o",
        title: "Hourly Rentals",
        desc: "Need a ride for multiple stops? Hire a driver by the hour for shopping, meetings, or errands — total flexibility.",
    },
    {
        icon: "fa-group",
        title: "Group Travel",
        desc: "Travelling with family or colleagues? Book SUVs and minivans for groups of up to 8 passengers comfortably.",
    },
];

const HOW_IT_WORKS: Step[] = [
    {
        step: "01",
        icon: "fa-map-marker",
        title: "Enter Your Route",
        desc: "Type your pickup point and destination. Our smart engine finds the best route instantly.",
    },
    {
        step: "02",
        icon: "fa-users",
        title: "Match or Solo Ride",
        desc: "Choose to ride solo or find a partner on the same route and split the cost.",
    },
    {
        step: "03",
        icon: "fa-check-circle",
        title: "Confirm & Relax",
        desc: "Confirm your booking, track your driver live, and enjoy a hassle-free ride.",
    },
    {
        step: "04",
        icon: "fa-star",
        title: "Rate Your Ride",
        desc: "Share your experience, rate your driver, and help build a better community.",
    },
];

const WHY_US: Feature[] = [
    { icon: "fa-bolt", title: "Instant Matching", desc: "Find a ride or partner in under 60 seconds." },
    { icon: "fa-lock", title: "Verified Drivers", desc: "Every driver is background-checked and licensed." },
    { icon: "fa-rupee", title: "Split Fare", desc: "Share rides and cut your travel cost in half." },
    { icon: "fa-map", title: "Live Tracking", desc: "Track your ride in real-time from pickup to drop." },
    { icon: "fa-bell", title: "Ride Alerts", desc: "Get SMS and app notifications at every step." },
    { icon: "fa-life-ring", title: "24/7 Support", desc: "Our support team is always one tap away." },
];

// ── Scroll animation hook ─────────────────────────────────────────────────────
const useVisible = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.1 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return { ref, visible };
};

// ── Section Header ────────────────────────────────────────────────────────────
const SectionHeader = ({ tag, title, sub, isDark }: { tag: string; title: React.ReactNode; sub?: string; isDark?: boolean }) => (
    <div className="mb-12 text-center">
        <span className="inline-block text-xs font-semibold tracking-widest text-amber-400 uppercase mb-3">{tag}</span>
        <h2 className={`text-3xl md:text-4xl font-bold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>{title}</h2>
        {sub && <p className={`mt-3 text-sm max-w-xl mx-auto leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{sub}</p>}
    </div>
);

// ── Route Search Demo ─────────────────────────────────────────────────────────
const RouteSearchDemo = ({ isDark }: { isDark: boolean }) => {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [mode, setMode] = useState<"solo" | "partner">("solo");

    return (
        <div className={`rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl border transition-colors ${
            isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 text-slate-800"
        }`}>
            <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>Live Route Search</span>
            </div>

            {/* From / To */}
            <div className="space-y-3 relative">
                {/* Connector line */}
                <div className={`absolute left-[17px] top-10 bottom-10 w-[2px] z-0 ${isDark ? "bg-slate-700" : "bg-slate-300"}`} />

                <div className="relative z-10 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center shrink-0">
                        <i className="fa fa-circle text-emerald-400 text-[8px]" />
                    </span>
                    <input
                        type="text"
                        placeholder="Pickup — Station / Gate 2"
                        value={from}
                        onChange={e => setFrom(e.target.value)}
                        className={`flex-1 rounded-xl px-4 py-3 text-sm outline-none border transition ${
                            isDark
                                ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-amber-400"
                                : "bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500"
                        }`}
                    />
                </div>

                <div className="relative z-10 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center shrink-0">
                        <i className="fa fa-map-marker text-red-400 text-xs" />
                    </span>
                    <input
                        type="text"
                        placeholder="Drop — City Destination"
                        value={to}
                        onChange={e => setTo(e.target.value)}
                        className={`flex-1 rounded-xl px-4 py-3 text-sm outline-none border transition ${
                            isDark
                                ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-amber-400"
                                : "bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500"
                        }`}
                    />
                </div>
            </div>

            {/* Mode Toggle */}
            <div className="grid grid-cols-2 gap-3">
                {([
                    { key: "solo", icon: "fa-user", label: "Solo Ride", fare: "₹180" },
                    { key: "partner", icon: "fa-users", label: "Find Partner", fare: "₹90" },
                ] as const).map(opt => (
                    <button
                        key={opt.key}
                        onClick={() => setMode(opt.key)}
                        className={`flex flex-col items-center gap-1 py-3 px-4 rounded-xl border text-sm font-medium transition
                            ${mode === opt.key
                                ? "bg-amber-400/10 border-amber-400 text-amber-400 font-bold"
                                : isDark
                                    ? "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                                    : "bg-slate-100 border-slate-200 text-slate-600 hover:border-slate-300"}`}
                    >
                        <i className={`fa ${opt.icon} text-base`} />
                        <span>{opt.label}</span>
                        <span className={`text-xs font-bold ${mode === opt.key ? "text-amber-400" : isDark ? "text-slate-500" : "text-slate-400"}`}>
                            Est. {opt.fare}
                        </span>
                    </button>
                ))}
            </div>

            {/* Search Button */}
            <button className="w-full py-3.5 bg-amber-400 text-slate-900 font-bold text-sm rounded-xl hover:bg-amber-300 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20">
                <i className="fa fa-search" />
                Search Available Rides
            </button>

            {/* Quick chips */}
            <div>
                <p className={`text-xs mb-2 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Popular routes</p>
                <div className="flex flex-wrap gap-2">
                    {["City Center → Dadar", "Station → BKC", "City → Airport", "Thane → Powai"].map(r => (
                        <span
                            key={r}
                            className={`text-xs px-3 py-1 rounded-full border cursor-pointer transition ${
                                isDark
                                    ? "bg-slate-800 border-slate-700 text-slate-400 hover:border-amber-400 hover:text-amber-400"
                                    : "bg-slate-100 border-slate-300 text-slate-600 hover:border-amber-500 hover:text-amber-600"
                            }`}
                        >
                            {r}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const Services = () => {
    const { isDark } = useTheme();
    const hero = useVisible();
    const cards = useVisible();
    const howto = useVisible();
    const whyus = useVisible();

    return (
        <div id="Services" className={`overflow-hidden transition-colors duration-500 ${
            isDark
                ? "bg-gradient-to-br from-[#0F172A] via-slate-900 to-black text-white"
                : "bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900"
        }`}>

            {/* ── 1. HERO ─────────────────────────────────────────────────── */}
            <section className="relative px-6 py-20 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

                <div
                    ref={hero.ref}
                    className={`relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center
                        transition-all duration-700 ${hero.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    {/* Left */}
                    <div className="space-y-6">
                        <span className="inline-block text-xs font-semibold tracking-widest text-amber-400 uppercase">
                            What We Offer
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Find Your Route.<br />
                            <span className="text-amber-400">Find Your Partner.</span><br />
                            Ride Hassle-Free.
                        </h1>
                        <p className={`text-base leading-relaxed max-w-md ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                            Whether you're commuting daily or planning a trip, SayOne makes it effortless.
                            Search your route, match with co-passengers, and ride smarter — all in seconds.
                        </p>

                        {/* Mini stats */}
                        <div className="grid grid-cols-3 gap-4 pt-2">
                            {[
                                { val: "60s", lbl: "Match Time" },
                                { val: "50%", lbl: "Fare Saved" },
                                { val: "24/7", lbl: "Available" },
                            ].map(s => (
                                <div key={s.lbl} className={`border rounded-2xl p-4 text-center ${
                                    isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
                                }`}>
                                    <p className="text-xl font-bold text-amber-400">{s.val}</p>
                                    <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{s.lbl}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Route Search Demo */}
                    <RouteSearchDemo isDark={isDark} />
                </div>
            </section>

            {/* ── 2. SERVICE CARDS ────────────────────────────────────────── */}
            <section className={`border-y px-6 py-20 ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-100/70 border-slate-200"}`}>
                <div
                    ref={cards.ref}
                    className={`max-w-6xl mx-auto transition-all duration-700
                        ${cards.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    <SectionHeader
                        isDark={isDark}
                        tag="Our Services"
                        title={<>Everything You Need,<br /><span className="text-amber-400">In One App</span></>}
                        sub="From a quick city hop to a long outstation trip — we've got a ride for every need."
                    />

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {SERVICES.map((s, i) => (
                            <div
                                key={s.title}
                                className={`group relative border rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
                                    isDark
                                        ? "bg-slate-900/90 border-slate-800 hover:border-amber-400/50"
                                        : "bg-white border-slate-200 hover:border-amber-400/80 hover:shadow-lg"
                                }`}
                                style={{ transitionDelay: `${i * 60}ms` }}
                            >
                                {s.badge && (
                                    <span className="absolute top-4 right-4 text-[10px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded-full">
                                        {s.badge}
                                    </span>
                                )}
                                <div className="w-11 h-11 rounded-xl bg-amber-400/10 flex items-center justify-center mb-4 group-hover:bg-amber-400/20 transition">
                                    <i className={`fa ${s.icon} text-amber-400 text-lg`} />
                                </div>
                                <h3 className={`font-semibold mb-2 group-hover:text-amber-400 transition ${isDark ? "text-white" : "text-slate-900"}`}>{s.title}</h3>
                                <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{s.desc}</p>
                                <div className="mt-4 flex items-center gap-1 text-amber-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition">
                                    Learn more <i className="fa fa-arrow-right text-[10px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 3. HOW IT WORKS ─────────────────────────────────────────── */}
            <section className="px-6 py-20">
                <div
                    ref={howto.ref}
                    className={`max-w-6xl mx-auto transition-all duration-700
                        ${howto.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    <SectionHeader
                        isDark={isDark}
                        tag="How It Works"
                        title={<>Ride in <span className="text-amber-400">4 Simple Steps</span></>}
                        sub="No complicated process. Just open the app, search, match, and go."
                    />

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                        {/* Connector line desktop */}
                        <div className={`hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-[2px] z-0 ${
                            isDark ? "bg-gradient-to-r from-slate-800 via-amber-400/40 to-slate-800" : "bg-gradient-to-r from-slate-300 via-amber-400/60 to-slate-300"
                        }`} />

                        {HOW_IT_WORKS.map((step, i) => (
                            <div
                                key={step.step}
                                className="relative z-10 text-center space-y-4"
                                style={{ transitionDelay: `${i * 100}ms` }}
                            >
                                {/* Circle */}
                                <div className={`w-20 h-20 rounded-full border-2 transition mx-auto flex flex-col items-center justify-center gap-1 group cursor-default ${
                                    isDark
                                        ? "bg-slate-900 border-slate-700 hover:border-amber-400"
                                        : "bg-white border-slate-300 hover:border-amber-400 shadow-md"
                                }`}>
                                    <i className={`fa ${step.icon} text-amber-400 text-xl`} />
                                    <span className={`text-[10px] font-bold ${isDark ? "text-slate-500" : "text-slate-400"}`}>{step.step}</span>
                                </div>
                                <h4 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{step.title}</h4>
                                <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 4. WHY CHOOSE US ────────────────────────────────────────── */}
            <section className={`border-t px-6 py-20 ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-100/70 border-slate-200"}`}>
                <div
                    ref={whyus.ref}
                    className={`max-w-6xl mx-auto transition-all duration-700
                        ${whyus.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    <SectionHeader
                        isDark={isDark}
                        tag="Why SayOne"
                        title={<>Built for <span className="text-amber-400">Real Commuters</span></>}
                        sub="We obsess over the small things so your ride is always smooth, safe, and affordable."
                    />

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {WHY_US.map((f, i) => (
                            <div
                                key={f.title}
                                className={`flex gap-4 border rounded-2xl p-5 transition group ${
                                    isDark
                                        ? "bg-slate-900/90 border-slate-800 hover:border-amber-400/40"
                                        : "bg-white border-slate-200 hover:border-amber-400/60 hover:shadow-md"
                                }`}
                                style={{ transitionDelay: `${i * 60}ms` }}
                            >
                                <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center shrink-0 group-hover:bg-amber-400/20 transition">
                                    <i className={`fa ${f.icon} text-amber-400`} />
                                </div>
                                <div>
                                    <h4 className={`font-semibold text-sm mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>{f.title}</h4>
                                    <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 5. CTA BANNER ───────────────────────────────────────────── */}
            <section className="px-6 py-16">
                <div className={`max-w-5xl mx-auto border rounded-3xl px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6 ${
                    isDark
                        ? "bg-gradient-to-br from-amber-400/10 via-slate-900 to-slate-900 border-amber-400/20"
                        : "bg-gradient-to-br from-amber-50 via-white to-amber-50 border-amber-300/50 shadow-xl"
                }`}>
                    <div>
                        <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                            Your route is waiting. <span className="text-amber-400">Say One!</span>
                        </h3>
                        <p className={`text-sm max-w-md ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                            Search your route now and find the best ride or partner in under 60 seconds.
                        </p>
                    </div>
                    <div className="flex gap-3 shrink-0 flex-wrap">
                        <button
                            onClick={() => window.location.href = "/contact"}
                            className="px-7 py-3 bg-amber-400 text-slate-900 font-bold text-sm rounded-xl hover:bg-amber-300 transition hover:shadow-lg hover:shadow-amber-400/20 flex items-center gap-2"
                        >
                            <i className="fa fa-search" /> Search a Ride
                        </button>
                        <button
                            onClick={() => window.location.href = "/about"}
                            className={`px-7 py-3 border font-semibold text-sm rounded-xl transition ${
                                isDark
                                    ? "border-slate-700 text-slate-300 hover:border-amber-400 hover:text-amber-400"
                                    : "border-slate-300 text-slate-700 hover:border-amber-500 hover:text-amber-600 bg-white"
                            }`}
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Services;