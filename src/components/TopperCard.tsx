"use client";
import medal1 from "../assets/1-medal.png";
import medal2 from "../assets/2-medal.png";
import medal3 from "../assets/3-medal.png";
import medal4 from "../assets/4-medal.png";
import medal5 from "../assets/5-medal.png";
import medal6 from "../assets/6-medal.png";
import medal7 from "../assets/7-medal.png";
import medal8 from "../assets/8-medal.png";
import medal9 from "../assets/9-medal.png";
import medal10 from "../assets/10-medal.png";

interface TopperCardProps {
  rank: number;
  name: string;
  course: string;
  school: string;
  score: string;
  photo: string;
  batch?: string;
}

const MEDAL_IMAGE: Record<number, string> = {
  1: medal1,
  2: medal2,
  3: medal3,
  4: medal4,
  5: medal5,
  6: medal6,
  7: medal7,
  8: medal8,
  9: medal9,
  10: medal10,
};

const PHOTO_SIZE = 140;
const OVERLAP_RATIO = 0.25;
const OVERLAP = PHOTO_SIZE * OVERLAP_RATIO;
const INSIDE = PHOTO_SIZE - OVERLAP;

export default function TopperCard({
  rank,
  name,
  course,
  school,
  score,
  photo,
  batch,
}: TopperCardProps) {
  const medalSrc = MEDAL_IMAGE[rank] ?? medal10;
  const isTopThree = rank <= 3;

  return (
    <div style={{ position: "relative", width: "100%", paddingTop: OVERLAP, boxSizing: "border-box" }}>
      {/* Student Photo Circle */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: PHOTO_SIZE,
          height: PHOTO_SIZE,
          borderRadius: "9999px",
          overflow: "hidden",
          background: "#f1f5f9",
          border: isTopThree ? "4px solid #fbbf24" : "4px solid #ffffff",
          boxShadow: isTopThree
            ? "0 0 20px rgba(251, 191, 36, 0.4), 0 8px 20px -6px rgba(0,0,0,0.4)"
            : "0 8px 20px -6px rgba(0,0,0,0.35)",
          zIndex: 20,
        }}
      >
        <img
          src={photo}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>

      {/* Card Content Container */}
      <div
        className="relative w-full h-full flex flex-col items-center rounded-2xl bg-white shadow-lg ring-1 ring-slate-100 px-4 pb-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group"
        style={{ paddingTop: INSIDE + 16 }}
      >
        {/* Medal Badge */}
        <img
          src={medalSrc}
          alt={`Rank ${rank}`}
          style={{
            position: "absolute",
            top: 10,
            left: 14,
            width: 54,
            height: 54,
            objectFit: "contain",
            zIndex: 30,
            filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))",
          }}
        />

        {/* Score Badge below image */}
        <div className="inline-flex items-center justify-center bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-sm px-3 py-1 rounded-full shadow-sm">
          {score}
        </div>

        <h3 className="w-full font-bold text-slate-900 text-center leading-tight truncate text-base group-hover:text-blue-600 transition-colors mt-2">
          {name}
        </h3>
        
        <p className="mt-1 w-full text-center text-blue-600 font-semibold text-xs truncate">
          {course}
        </p>
        
        <p className="mt-0.5 w-full text-center text-slate-500 text-[11px] truncate">
          {school}
        </p>

        {batch && (
          <span className="mt-2.5 inline-block max-w-full truncate rounded-full bg-slate-100 px-3 py-0.5 text-[10px] font-bold text-slate-600">
            {batch}
          </span>
        )}
      </div>
    </div>
  );
}