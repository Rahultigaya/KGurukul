"use client";
import { useEffect, useRef, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TopperCard from "./TopperCard";

interface Performer {
  rank: number;
  name: string;
  course: string;
  school: string;
  score: string;
  photo: string;
}

const PERFORMERS: Performer[] = [
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

export default function TopPerformersDark() {
  const podium = PERFORMERS.slice(0, 3);
  const rest = PERFORMERS.slice(3);

  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  // Trigger the reveal only once this section actually scrolls into the viewport.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // animate once, don't replay on every scroll
        }
      },
      { threshold: 0.2 } // fire once ~20% of the section is visible
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14 min-h-screen flex items-center box-border"
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
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sparkle { animation: twinkle 2.4s ease-in-out infinite; }
        .drift-slow { animation: drift 7s ease-in-out infinite; }
        .fade-up { animation: fadeUp 1.4s ease-out both; }
        .fade-up-delay { animation: fadeUp 1.4s ease-out 0.9s both; }
      `}</style>

      <div className="max-w-8xl mx-auto w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1739] via-[#101d4a] to-[#132257] px-6 sm:px-10 pt-10 pb-9 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
        {/* ambient sparkles only run once the section is visible, so nothing flashes off-screen */}
        {inView && (
          <>
            <span className="sparkle absolute top-8 left-10 w-1.5 h-1.5 rounded-full bg-white/60" style={{ animationDelay: "0s" }} />
            <span className="sparkle absolute top-20 right-16 w-2 h-2 rounded-full bg-amber-300" style={{ animationDelay: "0.6s" }} />
            <span className="sparkle absolute bottom-8 left-1/4 w-1 h-1 rounded-full bg-white/50" style={{ animationDelay: "1.2s" }} />
            <span className="sparkle absolute bottom-12 right-10 w-1.5 h-1.5 rounded-full bg-white/60" style={{ animationDelay: "1.8s" }} />
            <span className="sparkle absolute top-1/2 left-6 w-1 h-1 rounded-full bg-amber-200/70" style={{ animationDelay: "0.9s" }} />
            <span className="sparkle absolute top-1/3 right-8 w-1 h-1 rounded-full bg-white/50" style={{ animationDelay: "1.5s" }} />
            <div className="drift-slow absolute -top-24 -left-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="drift-slow absolute -bottom-24 -right-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" style={{ animationDelay: "2s" }} />
          </>
        )}

        {/* corner laurels */}
        <span className="hidden sm:block absolute top-8 left-6 text-3xl text-amber-300/40 select-none">🌿</span>
        <span className="hidden sm:block absolute top-8 right-6 text-3xl text-amber-300/40 select-none -scale-x-100">🌿</span>

        <div className={`text-center relative z-10 ${inView ? "fade-up" : "opacity-0"}`}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="hidden sm:inline h-px w-16 bg-gradient-to-r from-transparent to-amber-300/50" />
            {[0, 1, 2].map((i) => (
              <StarIcon
                key={i}
                sx={{ color: "#fbbf24", fontSize: i === 1 ? 22 : 15 }}
                className={i === 1 ? "drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" : "opacity-70"}
              />
            ))}
            <span className="hidden sm:inline h-px w-16 bg-gradient-to-l from-transparent to-amber-300/50" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Top <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">10 Performers</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2">
            Celebrating excellence, hard work and outstanding achievements.
          </p>
        </div>

        {/* podium: 2nd / 1st / 3rd, with #1 raised */}
        <div className="relative z-10 grid grid-cols-3 gap-3 sm:gap-6 mt-9 sm:mt-12 max-w-3xl mx-auto items-end">
          <div className="translate-y-2 sm:translate-y-4">
            <TopperCard {...podium[1]} />
          </div>
          <div className="-translate-y-2 sm:-translate-y-4">
            <TopperCard {...podium[0]} />
          </div>
          <div className="translate-y-2 sm:translate-y-4">
            <TopperCard {...podium[2]} />
          </div>
        </div>

        {/* remaining performers */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 mt-10 sm:mt-14">
          {rest.map((p) => (
            <TopperCard key={p.rank} {...p} />
          ))}
        </div>

        {/* bottom banner */}
        <div className={`relative z-10 mt-8 flex justify-center ${inView ? "fade-up-delay" : "opacity-0"}`}>
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