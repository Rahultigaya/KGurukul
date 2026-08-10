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

// Map rank -> medal image path. Update these paths to match wherever
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
}
// Fallback badge image for every rank outside the top 3 (4, 5, ...10, etc).
const DEFAULT_MEDAL_IMAGE = "/medals/default-medal.png";

const PHOTO_SIZE = 150;
// How much of the photo pokes out above the card. 0.5 = half circle (old
// look), 0.25 = only a quarter of the photo shows above the card edge.
const OVERLAP_RATIO = 0.25;
const OVERLAP = PHOTO_SIZE * OVERLAP_RATIO; // amount poking above the card
const INSIDE = PHOTO_SIZE - OVERLAP; // amount sitting inside the card

// Medal badge size — bumped up from the old 44px.
const MEDAL_SIZE = 60;

export default function TopperCard({ rank, name, course, school, score, photo, batch }: TopperCardProps) {
  const medalSrc = MEDAL_IMAGE[rank] ?? DEFAULT_MEDAL_IMAGE;

  return (
    <div style={{ position: "relative", width: "100%", paddingTop: OVERLAP, boxSizing: "border-box" }}>
      {/* photo circle — only OVERLAP_RATIO of it pokes above the card */}
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
          border: "5px solid #ffffff",
          boxShadow: "0 8px 20px -6px rgba(0,0,0,0.35)",
          zIndex: 20,
        }}
      >
        <img
          src={photo}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>

      {/* card */}
      <div
        className="relative w-full h-full flex flex-col items-center rounded-2xl bg-white shadow-md ring-1 ring-slate-100 px-4 pb-5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
        style={{ paddingTop: INSIDE + 20 }}
      >
        {/* medal badge — bigger now */}
        <img
          src={medalSrc}
          alt={`Rank ${rank}`}
          style={{
            position: "absolute",
            top: 10,
            left: 16,
            width: MEDAL_SIZE,
            height: MEDAL_SIZE,
            objectFit: "contain",
            zIndex: 30,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
          }}
        />

        <h3 className="w-full font-bold text-slate-900 text-center leading-tight truncate text-base">
          {name}
        </h3>
        <p className="mt-1 font-extrabold text-blue-600 text-xl leading-none">{score}</p>
        <p className="mt-2 w-full text-center text-slate-500 text-sm truncate">{course}</p>
        <p className="mt-0.5 w-full text-center text-slate-400 text-xs truncate">{school}</p>
        {batch && (
          <span className="mt-2 inline-block max-w-full truncate rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600">
            {batch}
          </span>
        )}
      </div>
    </div>
  );
}