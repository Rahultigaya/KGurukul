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

// Ribbon + score-pill colors per rank. Only the accents differ — every
// card is otherwise the same size and layout.
const TIER = {
  1: {
    ribbon: "linear-gradient(180deg,#fde68a 0%,#f5b400 55%,#c9880a 100%)",
    ribbonText: "#4a2e02",
    ring: "#f5b400",
    ringTw: "ring-amber-300",
    scoreBg: "linear-gradient(90deg,#fde68a,#f5b400)",
    scoreText: "#4a2e02",
  },
  2: {
    ribbon: "linear-gradient(180deg,#f1f5f9 0%,#cbd5e1 55%,#94a3b8 100%)",
    ribbonText: "#1e293b",
    ring: "#cbd5e1",
    ringTw: "ring-slate-300",
    scoreBg: "linear-gradient(90deg,#f1f5f9,#cbd5e1)",
    scoreText: "#1e293b",
  },
  3: {
    ribbon: "linear-gradient(180deg,#f3c89a 0%,#c8763a 55%,#96501f 100%)",
    ribbonText: "#3a1c05",
    ring: "#c8763a",
    ringTw: "ring-orange-300",
    scoreBg: "linear-gradient(90deg,#f3c89a,#c8763a)",
    scoreText: "#3a1c05",
  },default: {
    ribbon: "linear-gradient(180deg,#1e3a8a 0%,#0c1636 100%)",
    ribbonText: "#ffffff",
    ring: "#cbd5e1",
    ringTw: "ring-slate-100",
    scoreBg: "linear-gradient(90deg,#dbeafe,#bfdbfe)",
    scoreText: "#0c1636",
  },
} as const;

export default function TopperCard({ rank, name, course, school, score, photo }: TopperCardProps) {
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isFirst = rank === 1;
  const tier = TIER[rank as 1 | 2 | 3] ?? TIER.default;

  // Row 1 (ranks 1–5) slides in from the right, row 2 (ranks 6–10) from the left.
  const fromRight = rank <= 5;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const posInRow = fromRight ? rank - 1 : rank - 6; // 0..4 within its row
          // Slower, more spaced-out stagger so cards arrive one-by-one like train cars.
          timeoutId = setTimeout(() => setVisible(true), 250 + posInRow * 260);
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
  }, [rank, fromRight]);

  return (
    <div
      ref={cardRef}
      className={`group relative flex flex-col items-center w-full h-full min-w-0 min-h-[300px] sm:min-h-[30px] rounded-3xl bg-white
        ring-1 ${tier.ringTw} transition-all duration-[1600ms] ease-out overflow-visible
        hover:-translate-y-2 hover:shadow-xl shadow-md
        ${visible ? "opacity-100 translate-x-0" : `opacity-0 ${fromRight ? "translate-x-24" : "-translate-x-24"}`}`}
      style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
    >
      {/* crown for #1 */}
      {isFirst && (
        <span
          className="absolute -top-9 left-1/2 -translate-x-1/2 text-4xl sm:text-5xl select-none drop-shadow-[0_2px_4px_rgba(245,180,0,0.5)] z-30"
          style={{ animation: "floatCrown 2.6s ease-in-out infinite" }}
        >
          👑
        </span>
      )}

      {/* ribbon rank badge, top-left corner */}
      <div className="absolute top-0 left-6 z-20 drop-shadow-sm">
        <div
          className="w-10 h-12 flex items-start justify-center pt-2.5 rounded-t-sm"
          style={{
            background: tier.ribbon,
            clipPath: "polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)",
          }}
        >
          <span className="font-extrabold text-lg leading-none" style={{ color: tier.ribbonText }}>
            {rank}
          </span>
        </div>
      </div>

      {/* score pill, top-right corner, mirroring the rank ribbon */}
      <span
        className="absolute top-3 right-3 z-20 overflow-hidden rounded-full font-bold px-3 py-1 whitespace-nowrap text-xs sm:text-sm shadow-sm"
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

      <div className="flex flex-col items-center w-full h-full min-w-0 px-5 pt-5 pb-5">
        {/* large arch-shaped photo frame with a thick gold/tier-colored border */}
        <div
          className="shrink-0 sm:h-36 rounded-t-full rounded-b-2xl overflow-hidden bg-slate-50 transition-transform duration-300 group-hover:scale-105"
          style={{
            border: `4px solid ${tier.ring}`,
            boxShadow: `0 0 0 1px rgba(0,0,0,0.03)`,
          }}
        >
          <img src={photo} alt={name} className="h-full w-full object-cover" />
        </div>

        <h3 className="mt-1 w-full font-bold text-[#0c1636] text-center leading-tight truncate text-base sm:text-m">
          {name}
        </h3>

        <div className="mt-5 w-full flex-1 flex flex-col">
          <div className="flex items-center gap-1.5 min-w-0 text-black text-xs sm:text-sm border-t border-slate-100 pt-2 first:border-t-0 first:pt-0">
            <SchoolIcon sx={{ fontSize: 15 }} className="shrink-0" />
            <span className="truncate">{course}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0 text-black text-xs sm:text-sm border-t border-slate-100 pt-2">
            <AccountBalanceIcon sx={{ fontSize: 15 }} className="shrink-0" />
            <span className="truncate">{school}</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-120%); }
          45%, 100% { transform: translateX(220%); }
        }
      `}</style>
    </div>
  );
}