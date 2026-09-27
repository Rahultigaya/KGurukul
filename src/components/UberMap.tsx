import React from "react";
import { useTheme } from "../context/ThemeContext";

interface UberMapProps {
  className?: string;
  origin?: string;
  destination?: string;
  searchQuery?: string;
}

export const UberMap: React.FC<UberMapProps> = ({
  className = "",
  origin,
  destination,
  searchQuery,
}) => {
  const { isDark } = useTheme();

  // Compute map URL: if both source (origin) and destination (drop) are provided, plot route/directions!
  const getMapUrl = () => {
    const cleanOrigin = origin?.trim();
    const cleanDest = destination?.trim();

    if (cleanOrigin && cleanDest) {
      return `https://maps.google.com/maps?saddr=${encodeURIComponent(cleanOrigin)}&daddr=${encodeURIComponent(cleanDest)}&t=m&z=12&output=embed`;
    }
    if (cleanOrigin) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(cleanOrigin)}&t=m&z=13&output=embed`;
    }
    if (cleanDest) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(cleanDest)}&t=m&z=13&output=embed`;
    }
    const fallbackQuery = searchQuery && searchQuery.trim() !== "" ? searchQuery : "Ajmer, Rajasthan";
    return `https://maps.google.com/maps?q=${encodeURIComponent(fallbackQuery)}&t=m&z=13&output=embed`;
  };

  const mapUrl = getMapUrl();
  const hasRoute = Boolean(origin?.trim() && destination?.trim());

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden shadow-2xl border transition-all duration-500 ${isDark
        ? "bg-slate-900/90 border-slate-800 text-white shadow-purple-950/20"
        : "bg-white/95 border-slate-200 text-slate-800 shadow-slate-300/50"
        } ${className}`}
    >
      {/* Route Info Badge Overlay when Source & Destination are set */}
      {hasRoute && (
        <div className="absolute top-4 left-4 right-4 backdrop-blur-md bg-slate-900/90 text-white border border-slate-700/80 px-4 py-2.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 z-10 animate-fadeIn">
          <div className="flex items-center gap-2 overflow-hidden text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="font-semibold truncate max-w-[140px] sm:max-w-[200px] text-emerald-300">{origin}</span>
            <i className="fa fa-arrow-right text-amber-400 text-xs shrink-0 px-1" />
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0" />
            <span className="font-semibold truncate max-w-[140px] sm:max-w-[200px] text-red-300">{destination}</span>
          </div>
          <span className="text-[10px] font-bold bg-amber-400 text-slate-900 px-2.5 py-1 rounded-full shrink-0 uppercase tracking-wider shadow">
            Route Plotted
          </span>
        </div>
      )}

      {/* COMPACT & SLEEK MAP IFRAME CONTAINER */}
      <div className="relative h-[420px] sm:h-[480px] lg:h-[500px] w-full overflow-hidden">
        <iframe
          key={mapUrl}
          title="Live Map"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={mapUrl}
          className="w-full h-full border-0 transition-all duration-500"
        />
      </div>
    </div>
  );
};

export default UberMap;
