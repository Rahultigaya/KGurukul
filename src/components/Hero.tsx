import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { TextScramble } from "@/components/core/text-scramble";
import { UberMap } from "./UberMap";

interface Prediction {
    description: string;
    main_text: string;
}

const Hero: React.FC = () => {
    const { isDark } = useTheme();
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [mode, setMode] = useState<"solo" | "partner">("solo");
    const [activeSearch, setActiveSearch] = useState("Ajmer, Rajasthan");

    // Autocomplete states
    const [activeInput, setActiveInput] = useState<"from" | "to" | null>(null);
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const searchLocation = to || from || "Ajmer, Rajasthan";
        setActiveSearch(searchLocation);
        setActiveInput(null);
    };

    const handleChipClick = (route: string) => {
        const parts = route.split(" → ");
        if (parts.length === 2) {
            setFrom(parts[0]);
            setTo(parts[1]);
            setActiveSearch(parts[1]);
        }
    };

    // Close autocomplete dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setActiveInput(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch places predictions from Rapido API (or fallback)
    useEffect(() => {
        const query = activeInput === "from" ? from : activeInput === "to" ? to : "";
        if (!query || query.trim().length < 2) {
            setPredictions([]);
            return;
        }

        const controller = new AbortController();
        const fetchPlaces = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://www.rapido.bike/places/autocomplete?query=${encodeURIComponent(query)}`, {
                    signal: controller.signal
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && Array.isArray(data.predictions)) {
                        setPredictions(data.predictions);
                    } else {
                        setPredictions([]);
                    }
                } else {
                    throw new Error("Non-200 status");
                }
            } catch (err: any) {
                if (err.name === "AbortError") return;

                // Fallback places database including exact Sankalp results
                const samplePlaces: Prediction[] = [
                    {
                        description: "Sankalp Bhawan, Kasturba Gandhi Marg, 1688 Barracks, New Delhi, Delhi, India",
                        main_text: "Sankalp Bhawan"
                    },
                    {
                        description: "Sankalp International School, Nikol, Ahmedabad, Gujarat, India",
                        main_text: "Sankalp International School"
                    },
                    {
                        description: "Sankalp Iconic Tower, Iskcon Cross Road, Sanidhya, Ahmedabad, Gujarat, India",
                        main_text: "Sankalp Iconic Tower"
                    },
                    {
                        description: "Sankalp Square 3B, Sindhu Bhavan Road, PRL Colony, Thaltej, Ahmedabad, Gujarat, India",
                        main_text: "Sankalp Square 3B"
                    },
                    {
                        description: "Sankalp Garden Mangal Karyalaya, Alandi Road, Wadmukhwadi, Charholi Budruk, Pimpri-Chinchwad, Pune, Maharashtra, India",
                        main_text: "Sankalp Garden Mangal Karyalaya"
                    },
                    {
                        description: "Ajmer Junction Railway Station, Topdara, Ajmer, Rajasthan, India",
                        main_text: "Ajmer Junction Railway Station"
                    },
                    {
                        description: "Dargah Sharif, Diggi Bazaar, Ajmer, Rajasthan, India",
                        main_text: "Dargah Sharif Ajmer"
                    },
                    {
                        description: "Bandra Kurla Complex (BKC), Mumbai, Maharashtra, India",
                        main_text: "Bandra Kurla Complex"
                    },
                    {
                        description: "Chhatrapati Shivaji Maharaj International Airport, Mumbai, Maharashtra, India",
                        main_text: "Mumbai International Airport"
                    }
                ];

                const filtered = samplePlaces.filter(
                    (p) =>
                        p.main_text.toLowerCase().includes(query.toLowerCase()) ||
                        p.description.toLowerCase().includes(query.toLowerCase())
                );
                setPredictions(filtered);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchPlaces, 250);
        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [from, to, activeInput]);

    const handleSelectPrediction = (pred: Prediction, type: "from" | "to") => {
        if (type === "from") {
            setFrom(pred.main_text);
        } else {
            setTo(pred.main_text);
        }
        setActiveSearch(pred.description);
        setActiveInput(null);
    };

    return (
        <section
            className={`relative overflow-hidden transition-colors duration-500 ${isDark
                ? "bg-gradient-to-br from-[#0F172A] via-slate-900 to-black text-white"
                : "bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900"
                }`}
        >
            {/* Background Glow Accents */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* MAIN CONTAINER — 30% / 70% Desktop Grid Split */}
            <div className="relative z-10 mx-auto max-w-[1440px] px-6 pt-6 pb-12 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
                {/* LEFT CONTENT — 30% width on Desktop */}
                <motion.div
                    className="w-full lg:w-[32%] shrink-0 flex flex-col justify-center"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    {/* Main Scrambled Slogan Heading */}
                    <div className="space-y-1">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-amber-400 drop-shadow-sm">
                            <TextScramble
                                items={["Share the Ride", "Save the Money", "Request a Ride"]}
                                className="font-sans tracking-tight"
                            />
                        </h1>
                    </div>

                    {/* LIVE ROUTE SEARCH */}
                    <motion.form
                        onSubmit={handleSearch}
                        className={`mt-4 rounded-3xl p-5 md:p-6 space-y-4 shadow-2xl border transition-all duration-300 ${isDark
                            ? "bg-slate-900/90 border-slate-800/80 shadow-black/40 text-white"
                            : "bg-white/95 border-slate-200/80 shadow-slate-300/60 text-slate-800"
                            }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                    Search For Route
                                </span>
                            </div>
                        </div>

                        {/* From / To Inputs with Autocomplete Dropdown */}
                        <div className="space-y-3 relative" ref={dropdownRef}>
                            {/* Connector line */}
                            <div className={`absolute left-[17px] top-10 bottom-10 w-[2px] z-0 ${isDark ? "bg-slate-700" : "bg-slate-300"}`} />

                            {/* PICKUP INPUT */}
                            <div className="relative z-20 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center shrink-0">
                                    <i className="fa fa-circle text-emerald-400 text-[8px]" />
                                </span>
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder="Pickup — e.g. Sankalp Bhawan..."
                                        value={from}
                                        onFocus={() => setActiveInput("from")}
                                        onChange={(e) => {
                                            setFrom(e.target.value);
                                            setActiveInput("from");
                                        }}
                                        className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none border transition ${isDark
                                            ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-amber-400"
                                            : "bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500"
                                            }`}
                                    />
                                    {/* Pickup Dropdown */}
                                    {activeInput === "from" && (predictions.length > 0 || loading) && (
                                        <div
                                            className={`absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border shadow-2xl max-h-56 overflow-y-auto ${isDark
                                                ? "bg-slate-900 border-slate-700 text-white divide-slate-800"
                                                : "bg-white border-slate-200 text-slate-900 divide-slate-100"
                                                } divide-y`}
                                        >
                                            {loading && predictions.length === 0 ? (
                                                <div className="px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                                                    <i className="fa fa-circle-o-notch animate-spin text-amber-400" />
                                                    Searching locations...
                                                </div>
                                            ) : (
                                                predictions.map((pred, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => handleSelectPrediction(pred, "from")}
                                                        className={`px-3.5 py-2.5 cursor-pointer text-left transition flex items-start gap-2.5 ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"
                                                            }`}
                                                    >
                                                        <i className="fa fa-map-marker text-amber-400 mt-0.5 shrink-0 text-xs" />
                                                        <div>
                                                            <p className="text-xs font-bold leading-tight">{pred.main_text}</p>
                                                            <p className={`text-[10px] mt-0.5 leading-snug line-clamp-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                                                {pred.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* DROP INPUT */}
                            <div className="relative z-10 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center shrink-0">
                                    <i className="fa fa-map-marker text-red-400 text-xs" />
                                </span>
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder="Drop — City Destination"
                                        value={to}
                                        onFocus={() => setActiveInput("to")}
                                        onChange={(e) => {
                                            setTo(e.target.value);
                                            setActiveInput("to");
                                        }}
                                        className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none border transition ${isDark
                                            ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-amber-400"
                                            : "bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500"
                                            }`}
                                    />
                                    {/* Drop Dropdown */}
                                    {activeInput === "to" && (predictions.length > 0 || loading) && (
                                        <div
                                            className={`absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border shadow-2xl max-h-56 overflow-y-auto ${isDark
                                                ? "bg-slate-900 border-slate-700 text-white divide-slate-800"
                                                : "bg-white border-slate-200 text-slate-900 divide-slate-100"
                                                } divide-y`}
                                        >
                                            {loading && predictions.length === 0 ? (
                                                <div className="px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                                                    <i className="fa fa-circle-o-notch animate-spin text-amber-400" />
                                                    Searching locations...
                                                </div>
                                            ) : (
                                                predictions.map((pred, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => handleSelectPrediction(pred, "to")}
                                                        className={`px-3.5 py-2.5 cursor-pointer text-left transition flex items-start gap-2.5 ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"
                                                            }`}
                                                    >
                                                        <i className="fa fa-map-marker text-amber-400 mt-0.5 shrink-0 text-xs" />
                                                        <div>
                                                            <p className="text-xs font-bold leading-tight">{pred.main_text}</p>
                                                            <p className={`text-[10px] mt-0.5 leading-snug line-clamp-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                                                {pred.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mode Toggle */}
                        <div className="grid grid-cols-2 gap-3">
                            {([
                                { key: "solo", icon: "fa-user", label: "Solo Ride", fare: "₹180" },
                                { key: "partner", icon: "fa-users", label: "Find Partner", fare: "₹90" },
                            ] as const).map((opt) => (
                                <button
                                    type="button"
                                    key={opt.key}
                                    onClick={() => setMode(opt.key)}
                                    className={`flex flex-col items-center gap-1 py-2.5 px-3 rounded-xl border text-xs font-medium transition active:scale-95 ${mode === opt.key
                                        ? "bg-amber-400/10 border-amber-400 text-amber-400 font-bold shadow-md shadow-amber-400/10"
                                        : isDark
                                            ? "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                                            : "bg-slate-100 border-slate-200 text-slate-600 hover:border-slate-300"
                                        }`}
                                >
                                    <i className={`fa ${opt.icon} text-sm`} />
                                    <span>{opt.label}</span>
                                    <span
                                        className={`text-[10px] font-bold ${mode === opt.key
                                            ? "text-amber-400"
                                            : isDark
                                                ? "text-slate-500"
                                                : "text-slate-400"
                                            }`}
                                    >
                                        Est. {opt.fare}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Search Button */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 bg-amber-400 text-slate-900 font-bold text-xs sm:text-sm rounded-xl hover:bg-amber-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/25 cursor-pointer"
                        >
                            <i className="fa fa-search text-xs" />
                            Search Available Rides
                        </motion.button>

                        {/* Quick Route Chips */}
                        <div>
                            <p className={`text-[11px] mb-1.5 font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                Popular routes
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {["City Center → Dadar", "Station → BKC", "City → Airport", "Thane → Powai"].map((r) => (
                                    <span
                                        key={r}
                                        onClick={() => handleChipClick(r)}
                                        className={`text-[11px] px-2.5 py-0.5 rounded-full border cursor-pointer transition-all ${isDark
                                            ? "bg-slate-800/80 border-slate-700 text-slate-300 hover:border-amber-400 hover:text-amber-400 hover:bg-slate-800"
                                            : "bg-slate-100 border-slate-300 text-slate-700 hover:border-amber-500 hover:text-amber-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        {r}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.form>
                </motion.div>

                {/* RIGHT SIDE — 70% Width on Desktop with Compact Map Height */}
                <motion.div
                    className="w-full lg:w-[68%] shrink-0 flex items-center"
                    initial={{ opacity: 0, x: 30, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                    <UberMap origin={from} destination={to} searchQuery={activeSearch} />
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;