import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

interface UberMapProps {
  className?: string;
}

export const UberMap: React.FC<UberMapProps> = ({ className = "" }) => {
  const { isDark } = useTheme();
  const [selectedRide, setSelectedRide] = useState<"share" | "go" | "bike">("share");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("Indira Gandhi Intl Airport (DEL)");

  const RIDE_OPTIONS = [
    {
      id: "share" as const,
      name: "SayOne Share",
      eta: "2 min away",
      price: "₹120",
      icon: "🚗",
      badge: "Save 40%",
    },
    {
      id: "go" as const,
      name: "SayOne Go",
      eta: "4 min away",
      price: "₹195",
      icon: "🚘",
      badge: "Fastest",
    },
    {
      id: "bike" as const,
      name: "SayOne Moto",
      eta: "1 min away",
      price: "₹65",
      icon: "🏍️",
      badge: "Solo",
    },
  ];

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden shadow-2xl border transition-all duration-500 ${isDark
        ? "bg-slate-900/90 border-slate-800 text-white shadow-purple-950/20"
        : "bg-white/95 border-slate-200 text-slate-800 shadow-slate-300/50"
        } ${className}`}
    >
      {/* REAL GOOGLE MAP IFRAME CONTAINER */}
      <div className="relative h-[320px] sm:h-[360px] w-full overflow-hidden">
        <iframe
          title="Live Google Map"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src="https://maps.google.com/maps?q=Connaught%20Place,%20New%20Delhi&t=&z=13&ie=UTF8&iwloc=&output=embed"
          className={`w-full h-full border-0 transition-all duration-500 ${isDark ? "invert-[90%] hue-rotate-180 contrast-125 brightness-90 grayscale-[20%]" : ""
            }`}
        />
      </div>

      {/* RIDE BOOKING QUICK PANEL */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* Destination Inputs */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/90 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <span className="text-emerald-500 font-bold text-sm">🟢</span>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Pickup Location"
              className="w-full bg-transparent text-xs sm:text-sm font-medium outline-none text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/90 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <span className="text-purple-500 font-bold text-sm">📍</span>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where to?"
              className="w-full bg-transparent text-xs sm:text-sm font-medium outline-none text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        {/* RIDE SELECTION TILES */}
        <div className="grid grid-cols-3 gap-2">
          {RIDE_OPTIONS.map((opt) => {
            const isSelected = selectedRide === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedRide(opt.id)}
                type="button"
                className={`p-2.5 sm:p-3 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between ${isSelected
                  ? "bg-purple-600/10 border-purple-500 text-purple-600 dark:text-purple-300 shadow-md scale-[1.02]"
                  : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl">{opt.icon}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-900">
                    {opt.badge}
                  </span>
                </div>
                <div className="mt-2">
                  <h4 className="text-xs sm:text-sm font-bold truncate">{opt.name}</h4>
                  <p className="text-[10px] opacity-70">{opt.eta}</p>
                  <p className="text-xs sm:text-sm font-extrabold mt-1">{opt.price}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* REQUEST RIDE CTA */}
        <button
          type="button"
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-purple-600/25 hover:shadow-purple-600/40 transition-all duration-300 transform hover:scale-[1.01]"
        >
          Confirm {RIDE_OPTIONS.find((r) => r.id === selectedRide)?.name}
        </button>
      </div>
    </div>
  );
};

export default UberMap;
