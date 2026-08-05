"use client";
import { useEffect, useRef, useState } from "react";
import SchoolIcon from "@mui/icons-material/School";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

interface TopperCardProps {
  rank: number;
  name: string;
  course: string;
  school: string;
  score: string;
  photo: string;
}

// Visual identity per podium tier. 1–3 get medal treatment, 4+ get a quiet blue accent.
const TIER = {
  1: {
    ribbon: "linear-gradient(180deg,#fde68a 0%,#f5b400 55%,#c9880a 100%)",
    ribbonText: "#4a2e02",
    ring: "ring-amber-300",
    glow: "shadow-[0_0_0_1px_rgba(245,180,0,0.35),0_18px_40px_-12px_rgba(245,180,0,0.55)]",
    scoreBg: "linear-gradient(90deg,#fde68a,#f5b400)",
    scoreText: "#4a2e02",
    laurel: "text-amber-400",
  },
  2: {
    ribbon: "linear-gradient(180deg,#f1f5f9 0%,#cbd5e1 55%,#94a3b8 100%)",
    ribbonText: "#1e293b",
    ring: "ring-slate-300",
    glow: "shadow-[0_0_0_1px_rgba(203,213,225,0.35),0_14px_30px_-12px_rgba(148,163,184,0.5)]",
    scoreBg: "linear-gradient(90deg,#f1f5f9,#cbd5e1)",
    scoreText: "#1e293b",
    laurel: "text-slate-300",
  },
  3: {
    ribbon: "linear-gradient(180deg,#f3c89a 0%,#c8763a 55%,#96501f 100%)",
    ribbonText: "#3a1c05",
    ring: "ring-orange-300",
    glow: "shadow-[0_0_0_1px_rgba(200,118,58,0.35),0_14px_30px_-12px_rgba(200,118,58,0.5)]",
    scoreBg: "linear-gradient(90deg,#f3c89a,#c8763a)",
    scoreText: "#3a1c05",
    laurel: "text-orange-300",
  },
  default: {
    ribbon: "linear-gradient(180deg,#1e3a8a 0%,#0c1636 100%)",
    ribbonText: "#ffffff",
    ring: "ring-slate-100",
    glow: "shadow-md",
    scoreBg: "#eff6ff",
    scoreText: "#0c1636",
    laurel: "text-slate-200",
  },
} as const;

export default function TopperCard({ rank, name, course, school, score, photo }: TopperCardProps) {
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isPodium = rank <= 3;
  const isFirst = rank === 1;
  const tier = TIER[rank as 1 | 2 | 3] ?? TIER.default;

  // Each card watches itself, so rows further down the page only animate once
  // you've actually scrolled far enough to see them — not the instant the
  // section container first enters the viewport.
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutId = setTimeout(() => setVisible(true), 120 + (rank % 3) * 150);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [rank]);

  return (
    <div
      ref={cardRef}
      className={`group relative flex flex-col items-center w-full h-full min-w-0 rounded-3xl bg-white
        ring-1 ${tier.ring} transition-all duration-[1100ms] ease-out overflow-visible
        hover:-translate-y-2 hover:shadow-xl ${tier.glow}
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 scale-95"}
        ${isFirst ? "sm:scale-[1.06] z-10" : ""}`}
    >
      {/* crown for #1 */}
      {isFirst && (
        <span
          className="absolute -top-7 left-1/2 -translate-x-1/2 text-3xl select-none drop-shadow-[0_2px_4px_rgba(245,180,0,0.5)]"
          style={{ animation: "floatCrown 2.6s ease-in-out infinite" }}
        >
          👑
        </span>
      )}

      {/* ribbon rank badge, top-left corner */}
      <div className="absolute top-0 left-5 z-20 drop-shadow-sm">
        <div
          className="w-9 h-11 sm:w-10 sm:h-12 flex items-start justify-center pt-2 rounded-t-sm"
          style={{
            background: tier.ribbon,
            clipPath: "polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)",
          }}
        >
          <span className="font-extrabold text-base sm:text-lg leading-none" style={{ color: tier.ribbonText }}>
            {rank}
          </span>
        </div>
      </div>

      <div className={`flex flex-col items-center w-full min-w-0 px-3 ${isFirst ? "pt-9 pb-5" : "pt-8 pb-5"}`}>
        <div className="relative flex items-center justify-center">
          {isPodium && (
            <span className={`hidden xs:inline absolute -left-7 sm:-left-8 text-lg sm:text-xl ${tier.laurel} opacity-70 select-none`}>
              🌿
            </span>
          )}
          <div
            className={`shrink-0 rounded-full ring-4 overflow-hidden bg-slate-50 transition-transform duration-300 group-hover:scale-105
              ${isFirst ? "w-24 h-24 sm:w-28 sm:h-28 ring-amber-300" : isPodium ? "w-20 h-20 sm:w-24 sm:h-24" : "w-16 h-16 sm:w-20 sm:h-20"}
              ${!isFirst ? tier.ring : ""}`}
          >
            <img src={photo} alt={name} className="h-full w-full object-cover" />
          </div>
          {isPodium && (
            <span className={`hidden xs:inline absolute -right-7 sm:-right-8 text-lg sm:text-xl ${tier.laurel} opacity-70 select-none -scale-x-100`}>
              🌿
            </span>
          )}
        </div>

        <h3
          className={`mt-3 w-full font-bold text-[#0c1636] text-center leading-tight truncate
            ${isFirst ? "text-lg sm:text-xl" : isPodium ? "text-base sm:text-lg" : "text-sm sm:text-base"}`}
        >
          {name}
        </h3>

        <span
          className={`relative mt-2 overflow-hidden rounded-full font-bold px-4 sm:px-5 py-1 whitespace-nowrap
            ${isFirst ? "text-base sm:text-lg" : "text-xs sm:text-sm"}`}
          style={{ background: tier.scoreBg, color: tier.scoreText }}
        >
          {score}
          {isFirst && (
            <span
              className="absolute inset-0 -translate-x-full"
              style={{
                background: "linear-gradient(115deg,transparent 40%,rgba(255,255,255,0.7) 50%,transparent 60%)",
                animation: visible ? "shine 2.8s ease-in-out infinite" : "none",
              }}
            />
          )}
        </span>

        <div className={`mt-3 w-full space-y-1 ${isPodium ? "block" : "hidden sm:block"}`}>
          <div className="flex items-center gap-1.5 min-w-0 text-slate-500 text-[11px] sm:text-xs border-t border-slate-100 pt-1.5 first:border-t-0 first:pt-0">
            <SchoolIcon sx={{ fontSize: 13 }} className="shrink-0" />
            <span className="truncate">{course}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0 text-slate-500 text-[11px] sm:text-xs border-t border-slate-100 pt-1.5">
            <AccountBalanceIcon sx={{ fontSize: 13 }} className="shrink-0" />
            <span className="truncate">{school}</span>
          </div>
        </div>
      </div>

      {/* podium base glow for #1 */}
      {isFirst && (
        <span
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2/3 h-4 rounded-full bg-amber-300/40 blur-md"
          style={{ animation: visible ? "pulseGlow 2.6s ease-in-out infinite" : "none" }}
        />
      )}

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-120%); }
          45%, 100% { transform: translateX(220%); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.35; transform: translate(-50%, 0) scaleX(1); }
          50% { opacity: 0.6; transform: translate(-50%, 0) scaleX(1.15); }
        }
      `}</style>
    </div>
  );
}