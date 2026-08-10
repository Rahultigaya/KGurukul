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

interface Performer {
  rank: number;
  name: string;
  course: string;
  school: string;
  score: string;
  photo: string;
  batch: string;
}

// The last 4 academic years shown as tabs, newest first.
const YEARS = ["2025", "2024", "2023", "2022"] as const;
type AcademicYear = (typeof YEARS)[number];

// Base student list (photo/course/school stay put here for the demo).
// TODO: replace each of these four arrays with your real toppers list for
// that academic year. Right now they're distinct placeholder rosters just
// so you can see the year tabs actually swap the list.
const PERFORMERS_2025: Omit<Performer, "batch">[] = [
  { rank: 1, name: "Aditya Sharma", course: "Python Development", school: "Modern College, Pune", score: "92%", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces" },
  { rank: 2, name: "Priya Verma", course: "Web Development", school: "Fergusson College, Pune", score: "90%", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces" },
  { rank: 3, name: "Rahul Mehta", course: "Data Structures", school: "Garware College, Pune", score: "88%", photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=faces" },
  { rank: 4, name: "Sneha Iyer", course: "Java Programming", school: "BMCC, Pune", score: "87%", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces" },
  { rank: 5, name: "Karan Malhotra", course: "C / C++ Programming", school: "Modern College, Pune", score: "86%", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces" },
  { rank: 6, name: "Ananya Reddy", course: "Web Development", school: "Fergusson College, Pune", score: "85%", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces" },
  { rank: 7, name: "Vivaan Joshi", course: "Python Development", school: "Garware College, Pune", score: "84%", photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=faces" },
  { rank: 8, name: "Ishita Kapoor", course: "Tally with GST", school: "BMCC, Pune", score: "83%", photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=faces" },
  { rank: 9, name: "Rohan Desai", course: "Data Structures", school: "Modern College, Pune", score: "82%", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces" },
  { rank: 10, name: "Meera Nair", course: "Java Programming", school: "Fergusson College, Pune", score: "81%", photo: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=200&h=200&fit=crop&crop=faces" },
];

const PERFORMERS_2024: Omit<Performer, "batch">[] = [
  { rank: 1, name: "Arjun Kulkarni", course: "Web Development", school: "Fergusson College, Pune", score: "94%", photo: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=200&h=200&fit=crop&crop=faces" },
  { rank: 2, name: "Kavya Patil", course: "Python Development", school: "Modern College, Pune", score: "91%", photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop&crop=faces" },
  { rank: 3, name: "Nikhil Rao", course: "Data Structures", school: "BMCC, Pune", score: "89%", photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=faces" },
  { rank: 4, name: "Riya Deshmukh", course: "Java Programming", school: "Garware College, Pune", score: "88%", photo: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=200&h=200&fit=crop&crop=faces" },
  { rank: 5, name: "Aryan Gupta", course: "C / C++ Programming", school: "Fergusson College, Pune", score: "87%", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces" },
  { rank: 6, name: "Diya Kulkarni", course: "Web Development", school: "Modern College, Pune", score: "86%", photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop&crop=faces" },
  { rank: 7, name: "Yash Bhosale", course: "Python Development", school: "BMCC, Pune", score: "85%", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces" },
  { rank: 8, name: "Simran Chavan", course: "Tally with GST", school: "Garware College, Pune", score: "84%", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces" },
  { rank: 9, name: "Om Patwardhan", course: "Data Structures", school: "Fergusson College, Pune", score: "83%", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces" },
  { rank: 10, name: "Tanvi Joshi", course: "Java Programming", school: "Modern College, Pune", score: "82%", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces" },
];

const PERFORMERS_2023: Omit<Performer, "batch">[] = [
  { rank: 1, name: "Devansh Pawar", course: "Data Structures", school: "Garware College, Pune", score: "93%", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces" },
  { rank: 2, name: "Anushka More", course: "Web Development", school: "BMCC, Pune", score: "90%", photo: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=200&h=200&fit=crop&crop=faces" },
  { rank: 3, name: "Harsh Thakur", course: "Python Development", school: "Modern College, Pune", score: "89%", photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=faces" },
  { rank: 4, name: "Pooja Shinde", course: "Java Programming", school: "Fergusson College, Pune", score: "87%", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces" },
  { rank: 5, name: "Sarthak Jadhav", course: "C / C++ Programming", school: "Garware College, Pune", score: "86%", photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=faces" },
  { rank: 6, name: "Neha Kale", course: "Web Development", school: "BMCC, Pune", score: "85%", photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=faces" },
  { rank: 7, name: "Aniket Wagh", course: "Python Development", school: "Modern College, Pune", score: "84%", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces" },
  { rank: 8, name: "Vaishnavi Bhosale", course: "Tally with GST", school: "Fergusson College, Pune", score: "83%", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces" },
  { rank: 9, name: "Prathamesh Gaikwad", course: "Data Structures", school: "Garware College, Pune", score: "82%", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces" },
  { rank: 10, name: "Sakshi Naik", course: "Java Programming", school: "BMCC, Pune", score: "81%", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces" },
];

const PERFORMERS_2022: Omit<Performer, "batch">[] = [
  { rank: 1, name: "Rohit Bhagat", course: "Web Development", school: "Modern College, Pune", score: "91%", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces" },
  { rank: 2, name: "Shreya Kulkarni", course: "Python Development", school: "Fergusson College, Pune", score: "90%", photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop&crop=faces" },
  { rank: 3, name: "Aditya Pandit", course: "Data Structures", school: "BMCC, Pune", score: "88%", photo: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=200&h=200&fit=crop&crop=faces" },
  { rank: 4, name: "Isha Deshpande", course: "Java Programming", school: "Garware College, Pune", score: "87%", photo: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=200&h=200&fit=crop&crop=faces" },
  { rank: 5, name: "Kunal Salvi", course: "C / C++ Programming", school: "Modern College, Pune", score: "85%", photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop&crop=faces" },
  { rank: 6, name: "Radhika Jagtap", course: "Web Development", school: "Fergusson College, Pune", score: "84%", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces" },
  { rank: 7, name: "Siddharth Rane", course: "Python Development", school: "BMCC, Pune", score: "83%", photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=faces" },
  { rank: 8, name: "Gauri Tambe", course: "Tally with GST", school: "Garware College, Pune", score: "82%", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces" },
  { rank: 9, name: "Mihir Chaudhari", course: "Data Structures", school: "Modern College, Pune", score: "81%", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces" },
  { rank: 10, name: "Aditi Bane", course: "Java Programming", school: "Fergusson College, Pune", score: "80%", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces" },
];

// One batch label per year — edit these to match your real batch names.
const BATCH_BY_YEAR: Record<AcademicYear, string> = {
  "2025": "Batch A · Jan 2025",
  "2024": "Batch D · Jan 2024",
  "2023": "Batch G · Jan 2023",
  "2022": "Batch J · Jan 2022",
};

const ROSTER_BY_YEAR: Record<AcademicYear, Omit<Performer, "batch">[]> = {
  "2025": PERFORMERS_2025,
  "2024": PERFORMERS_2024,
  "2023": PERFORMERS_2023,
  "2022": PERFORMERS_2022,
};

const PERFORMERS_BY_YEAR: Record<AcademicYear, Performer[]> = YEARS.reduce(
  (acc, year) => {
    acc[year] = ROSTER_BY_YEAR[year].map((p) => ({ ...p, batch: BATCH_BY_YEAR[year] }));
    return acc;
  },
  {} as Record<AcademicYear, Performer[]>
);

const VISIBLE = 3; // cards shown at once, matching the reference layout

export default function TopPerformersDark() {
  const [year, setYear] = useState<AcademicYear>(YEARS[0]);
  const [index, setIndex] = useState(0);
  const [withTransition, setWithTransition] = useState(true);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // The active year's student list — swapping years swaps this whole array.
  const performers = PERFORMERS_BY_YEAR[year];
  const total = performers.length;
  // Duplicate the first VISIBLE cards onto the end so the track can advance
  // past the last real card and snap back to 0 invisibly (classic infinite-carousel trick).
  const track = [...performers, ...performers.slice(0, VISIBLE)];

  // Changing year: snap straight back to the first card, no leftover slide.
  const selectYear = (y: AcademicYear) => {
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

      <div className="max-w-7xl mx-auto w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1739] via-[#101d4a] to-[#132257] px-6 sm:px-10 pt-4 pb-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">

        <div className="relative z-10">
          {/* heading grid: left leaf | title + subtitle | right leaf.
              The leaves live in their own grid columns so they sit out near
              the edges (like the reference), instead of being squeezed
              right up against the text. */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
            <div className="flex justify-center">
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
                <h2 className="font-serif-display text-2xl sm:text-3xl font-semibold text-white tracking-tight whitespace-nowrap">
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
                    className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                      y === year
                        ? "bg-amber-400 text-slate-900 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                        : "bg-white/10 text-slate-200 hover:bg-white/20 ring-1 ring-white/15"
                    }`}
                  >
                    Academic Year {y}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <img
                src={rightLeaves}
                alt=""
                className="h-12 sm:h-16 md:h-20 w-auto opacity-90 shrink-0"
              />
            </div>
          </div>
        </div>

      {/* carousel: exactly 3 cards visible, auto-advances one at a time */}
        <div className="relative z-10 mx-[8%] mt-6 sm:mt-2 flow-root">
          <div className="overflow-hidden" style={{ paddingTop: 50, marginTop: -50, pointerEvents: "none" }}>
            <div
              className="flex"
              style={{
                transform: `translateX(-${index * (100 / VISIBLE)}%)`,
                transition: withTransition ? "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
                pointerEvents: "auto",
              }}
            >
              {track.map((p, i) => (
                <div key={`${p.rank}-${i}`} className="shrink-0 px-1.5 sm:px-2" style={{ width: `${100 / VISIBLE}%` }}>
                  <TopperCard {...p} />
                </div>
              ))}
            </div>
          </div>
          {/* prev / next arrows */}
          <button
            aria-label="Previous"
            onClick={prev}
            className="hidden sm:flex items-center justify-center absolute -left-12 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm ring-1 ring-white/20 transition-colors"
          >
            <ChevronLeftIcon fontSize="small" />
          </button>
          <button
            aria-label="Next"
            onClick={next}
            className="hidden sm:flex items-center justify-center absolute -right-12 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm ring-1 ring-white/20 transition-colors"
          >
            <ChevronRightIcon fontSize="small" />
          </button>
        </div>

        {/* dot indicators, one per real student */}
        <div className="relative z-10 mt-6 flex justify-center gap-1.5">
          {performers.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to student ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeDot ? "w-5 bg-amber-400" : "w-1.5 bg-white/25 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* bottom banner */}
        <div className="relative z-10 mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-white/5 backdrop-blur-sm px-5 py-2 text-slate-200 text-xs sm:text-sm">
            <EmojiEventsIcon sx={{ color: "#fbbf24", fontSize: 18 }} />
            <span>Proud of our students. Inspired by their success. Committed to their future.</span>
            <span className="text-amber-300/60">🌿</span>
          </div>
        </div>
      </div>
    </section>
  );
}