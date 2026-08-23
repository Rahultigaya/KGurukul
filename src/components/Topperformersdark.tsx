"use client";
import { useEffect, useRef, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TopperCard from "./TopperCard";
// Your leaf/laurel ornament images — update the path if they live elsewhere.
import leftLeaves from "../assets/left-leaves.png";
import rightLeaves from "../assets/right-leaves.png";
import dummyUserPhoto from "../assets/dummy_user2.png";

// Dynamically load all topper photos from src/assets/toppers/
const topperPhotos = import.meta.glob("../assets/toppers/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export const getTopperPhoto = (photo: string): string => {
  if (!photo || photo.trim() === "") return dummyUserPhoto;
  if (photo.startsWith("http://") || photo.startsWith("https://") || photo.startsWith("data:")) {
    return photo;
  }
  const filename = photo.split("/").pop();
  for (const [path, url] of Object.entries(topperPhotos)) {
    if (path.endsWith(`/${filename}`)) {
      return url;
    }
  }
  return dummyUserPhoto;
};

interface Performer {
  rank: number;
  name: string;
  course: string;
  school: string;
  score: string;
  photo: string;
  batch: string;
}

// Performers data grouped by Academic Year key.
// To add new years (e.g. 2025, 2024), simply add a new year key to this object!
export const PERFORMERS_DATA_BY_YEAR: Record<string, Performer[]> = {
  "ICSE 2026": [
    { rank: 1, name: "Rama Jog", course: "Computer Application", school: "Singhania School", score: "100", photo: "rama_jog.png", batch: "" },
    { rank: 2, name: "Aarna Subramanian", course: "Computer Application", school: "", score: "100", photo: "", batch: "" },
    { rank: 3, name: "Aarohi Deshmukh", course: "Computer Application", school: "", score: "100", photo: "", batch: "" },
    { rank: 4, name: "Arnav Pachpande", course: "Computer Application", school: "", score: "100", photo: "", batch: "" },
    { rank: 5, name: "Diti Tembulkar", course: "Computer Application", school: "", score: "100", photo: "", batch: "" },
    { rank: 6, name: "Jiya Shah", course: "Computer Application", school: "", score: "100", photo: "", batch: "" },
    { rank: 7, name: "Kanish Mehta", course: "Computer Application", school: "", score: "100", photo: "", batch: "" },
    { rank: 8, name: "Vridha Pathare", course: "Computer Application", school: "", score: "100", photo: "", batch: "" },
    { rank: 9, name: "Sanay Joshi", course: "Computer Application", school: "", score: "100", photo: "", batch: "" },
    { rank: 10, name: "Sia Wani", course: "Computer Application", school: "", score: "100", photo: "", batch: "" },
  ],
  "ISC 2023": [
    { rank: 1, name: "Manav Gurnani", course: "Computer Application", school: "", score: "99", photo: "", batch: "" },
    { rank: 2, name: "Aarya Inamdar", course: "Computer Application", school: "", score: "98", photo: "", batch: "" },
    { rank: 3, name: "Prisha Vadhavkar", course: "Computer Application", school: "", score: "98", photo: "", batch: "" },
    { rank: 4, name: "Rian Pardal", course: "Computer Application", school: "", score: "98", photo: "", batch: "" },
    { rank: 5, name: "Rishaan Damani", course: "Computer Application", school: "", score: "97", photo: "", batch: "" },
    { rank: 6, name: "Dhruv Joshi", course: "Computer Application", school: "", score: "96", photo: "", batch: "" },
    { rank: 7, name: "Pranav Gajare", course: "Computer Application", school: "", score: "95", photo: "", batch: "" },
    { rank: 8, name: "Aayush Garg", course: "Computer Application", school: "", score: "94", photo: "", batch: "" },
    { rank: 9, name: "Megh Giri", course: "Computer Application", school: "", score: "93", photo: "", batch: "" },
    { rank: 10, name: "Ryan Pinto", course: "Computer Application", school: "", score: "91", photo: "", batch: "" }
  ],
  "HSC 2024": [
    { rank: 1, name: "Shreya Agarwal", course: "Computer Science", school: "", score: "200", photo: "shreya_agarwal.png", batch: "" },
    { rank: 2, name: "Arya Patil", course: "Computer Science", school: "", score: "200", photo: "arya_patil.png", batch: "" },
    { rank: 3, name: "Arnav Gawade", course: "Computer Science", school: "", score: "198", photo: "", batch: "" },
    { rank: 4, name: "Parth Jairam", course: "Computer Science", school: "", score: "198", photo: "", batch: "" },
    { rank: 5, name: "Vedant Mudras", course: "Computer Science", school: "", score: "194", photo: "", batch: "" },
    { rank: 6, name: "Anuj Vajha", course: "Computer Science", school: "", score: "193", photo: "", batch: "" },
    { rank: 7, name: "Riya Joglekar", course: "Computer Science", school: "", score: "193", photo: "", batch: "" },
    { rank: 8, name: "Shresht Khandpur", course: "Computer Science", school: "", score: "193", photo: "", batch: "" },
    { rank: 9, name: "Tanishk Tasgaonkar", course: "Computer Science", school: "", score: "192", photo: "", batch: "" },
    { rank: 10, name: "Arjun Vad", course: "Computer Science", school: "", score: "190", photo: "", batch: "" }
  ]
};

// Dynamically extract year keys as tabs
export const YEARS: string[] = Object.keys(PERFORMERS_DATA_BY_YEAR);

const VISIBLE_DESKTOP = 3; // cards shown at once on sm+ screens
const VISIBLE_MOBILE = 1; // cards shown at once on mobile

export default function TopPerformersDark() {
  const [year, setYear] = useState<string>(YEARS[0] || "HSC 2026");
  const [index, setIndex] = useState(0);
  const [withTransition, setWithTransition] = useState(true);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(VISIBLE_DESKTOP);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Track viewport width so the carousel shows 1 card on mobile, 3 from sm up.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => {
      setVisible(mq.matches ? VISIBLE_DESKTOP : VISIBLE_MOBILE);
      setWithTransition(false);
      setIndex(0);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Active year's student list
  const rawPerformers = PERFORMERS_DATA_BY_YEAR[year] || [];
  const performers = rawPerformers.map((p) => ({
    ...p,
    photo: getTopperPhoto(p.photo),
  }));
  const total = performers.length;
  const track = [...performers, ...performers.slice(0, visible)];

  // Changing year: snap straight back to the first card, no leftover slide.
  const selectYear = (y: string) => {
    if (y === year) return;
    setYear(y);
    setWithTransition(false);
    setIndex(0);
  };

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => i + 1);
    }, 3200);
    return () => clearInterval(timerRef.current);
  }, [paused, year]);

  // When we've slid past the last real card, wait for the slide transition
  // to finish, then jump back to 0 with no transition so it looks seamless.
  useEffect(() => {
    if (index === total) {
      const t = setTimeout(() => {
        setWithTransition(false);
        setIndex(0);
      }, 700);
      return () => clearTimeout(t);
    }
    if (!withTransition) {
      const t = requestAnimationFrame(() => setWithTransition(true));
      return () => cancelAnimationFrame(t);
    }
  }, [index, withTransition, total]);

  const goTo = (i: number) => {
    setWithTransition(true);
    setIndex(i);
  };
  const prev = () => goTo(index <= 0 ? total - 1 : index - 1);
  const next = () => goTo(index + 1);
  const activeDot = index % total;

  return (
    <section
      id="toppers"
      className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14 min-h-screen flex items-center box-border"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style>{`
        @keyframes floatCrown {
          0%, 100% { transform: translateY(0) rotate(-4deg); }
          50% { transform: translateY(-6px) rotate(4deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes drift {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(6px); }
          100% { transform: translateY(0) translateX(0); }
        }
       `}</style>

      <div className="max-w-7xl mx-auto w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1739] via-[#101d4a] to-[#132257] px-4 sm:px-10 pt-4 pb-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">

        <div className="relative z-10">
          {/* heading grid: left leaf | title + subtitle | right leaf.
              The leaves live in their own grid columns so they sit out near
              the edges (like the reference), instead of being squeezed
              right up against the text. On mobile the leaf ornaments are
              hidden and the heading collapses to a single centered column. */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex justify-center">
              <img
                src={leftLeaves}
                alt=""
                className="h-12 sm:h-16 md:h-20 w-auto opacity-90 shrink-0"
              />
            </div>

            <div className="text-center px-1">
              <div className="flex items-center justify-center gap-2">
                <StarIcon
                  sx={{ color: "#fbbf24", fontSize: 20 }}
                  className="drop-shadow-[0_0_6px_rgba(251,191,36,0.6)] shrink-0"
                />
                <h2 className="font-serif-display text-xl sm:text-3xl font-semibold text-white tracking-tight whitespace-nowrap">
                  Our <span className="text-amber-400">Top</span> Performers
                </h2>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm mt-2">
                Celebrating the success of our brilliant students.
              </p>

              {/* Academic year tabs — clicking swaps the whole student list below */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                {YEARS.map((y) => (
                  <button
                    key={y}
                    onClick={() => selectYear(y)}
                    className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${y === year
                      ? "bg-amber-400 text-slate-900 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                      : "bg-white/10 text-slate-200 hover:bg-white/20 ring-1 ring-white/15"
                      }`}
                  >
                    {y === year ? `Academic Year ${y}` : y}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden sm:flex justify-center">
              <img
                src={rightLeaves}
                alt=""
                className="h-12 sm:h-16 md:h-20 w-auto opacity-90 shrink-0"
              />
            </div>
          </div>
        </div>

        {/* carousel: 1 card visible on mobile, 3 on sm+, auto-advances one at a time */}
        <div className="relative z-10 mx-[6%] sm:mx-[8%] mt-6 sm:mt-2 flow-root">
          <div className="overflow-hidden" style={{ paddingTop: 50, marginTop: -50, pointerEvents: "none" }}>
            <div
              className="flex"
              style={{
                transform: `translateX(-${index * (100 / visible)}%)`,
                transition: withTransition ? "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
                pointerEvents: "auto",
              }}
            >
              {track.map((p, i) => (
                <div key={`${p.rank}-${i}`} className="shrink-0 px-1.5 sm:px-2" style={{ width: `${100 / visible}%` }}>
                  <TopperCard {...p} />
                </div>
              ))}
            </div>
          </div>
          {/* prev / next arrows — visible on mobile too, sitting just inside the card edges */}
          <button
            aria-label="Previous"
            onClick={prev}
            className="flex items-center justify-center absolute -left-3 sm:-left-12 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm ring-1 ring-white/20 transition-colors z-20"
          >
            <ChevronLeftIcon fontSize="small" />
          </button>
          <button
            aria-label="Next"
            onClick={next}
            className="flex items-center justify-center absolute -right-3 sm:-right-12 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm ring-1 ring-white/20 transition-colors z-20"
          >
            <ChevronRightIcon fontSize="small" />
          </button>
        </div>

        {/* dot indicators, one per real student */}
        <div className="relative z-10 mt-6 flex flex-wrap justify-center gap-1.5 px-6">
          {performers.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to student ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === activeDot ? "w-5 bg-amber-400" : "w-1.5 bg-white/25 hover:bg-white/40"
                }`}
            />
          ))}
        </div>

        {/* bottom banner — wraps to two centered lines on mobile, single line from sm up */}
        <div className="relative z-10 mt-8 flex justify-center px-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-white/5 backdrop-blur-sm px-4 sm:px-5 py-2.5 sm:py-2 text-slate-200 text-xs sm:text-sm max-w-full">
            <EmojiEventsIcon sx={{ color: "#fbbf24", fontSize: 18 }} className="shrink-0" />
            <span className="text-center sm:text-left leading-snug">
              Proud of our students. Inspired by their success.{" "}
              <span className="text-amber-300 sm:text-slate-200 block sm:inline">
                Committed to their future.
              </span>
            </span>
            <span className="text-amber-300/60 shrink-0">🌿</span>
          </div>
        </div>
      </div>
    </section>
  );
}