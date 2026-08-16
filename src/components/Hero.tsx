import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import CodeIcon from "@mui/icons-material/Code";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import heroIllustration from "../assets/hero-illustration.png";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

interface Step {
  title: string;
  icon: React.ReactNode;
  from: string;
  to: string;
  glow: string;
  delay: number;
}

const STEPS: Step[] = [
  {
    title: "LEARN",
    icon: <MenuBookOutlinedIcon sx={{ fontSize: 22 }} />,
    from: "#4f46e5",
    to: "#2563eb",
    glow: "rgba(37,99,235,0.45)",
    delay: 0.2,
  },
  {
    title: "CODE",
    icon: <CodeIcon sx={{ fontSize: 22 }} />,
    from: "#fb923c",
    to: "#f97316",
    glow: "rgba(249,115,22,0.45)",
    delay: 0.7,
  },
  {
    title: "SUCCEED",
    icon: <GpsFixedIcon sx={{ fontSize: 22 }} />,
    from: "#22c55e",
    to: "#10b981",
    glow: "rgba(16,185,129,0.45)",
    delay: 1.3,
  },
];

const BANNER_CLIP = "polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%, 15% 50%)";

/* Rotating headline phrases — word1 stays blue, word2 stays green, always */
interface HeadlinePhrase {
  word1: string;
  word2: string;
}

const HEADLINE_PHRASES: HeadlinePhrase[] = [
  { word1: "bright", word2: "future" },
  { word1: "tech", word2: "career" },
  { word1: "coding", word2: "skills" },
];

const TYPING_SPEED_MS = 80; // ms per character while typing
const DELETING_SPEED_MS = 45; // ms per character while deleting
const HOLD_MS = 1400; // pause once fully typed before deleting

function StepCard({ step, delay }: { step: Step; delay: number }) {
  return (
    <div
      className="step-card-in relative flex-1 min-w-0 sm:flex-none sm:w-[225px] lg:w-[210px] h-[52px] xs:h-[58px] sm:h-[65px] lg:h-[60px]"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* soft ambient glow — tight, localized per card */}
      <div
        className="absolute -inset-2 rounded-full opacity-30 blur-xl -z-10"
        style={{
          background: `radial-gradient(circle, ${step.to}, transparent 70%)`,
        }}
      />

      {/* layered backing card for depth (slightly offset, rounded, softly blurred edge) */}
      <div
        className="absolute inset-0 translate-x-1 translate-y-1 sm:translate-x-1.5 sm:translate-y-1.5 rounded-l-xl sm:rounded-l-2xl opacity-70 blur-[1px]"
        style={{
          clipPath: BANNER_CLIP,
          background: `linear-gradient(135deg, ${step.from}, ${step.to})`,
        }}
      />

      {/* main white banner: real rounded left corners + sharp point, glows + lifts + tilts on hover */}
      <div
        className="step-card-glow group relative h-full bg-white rounded-l-xl sm:rounded-l-2xl border border-slate-200"
        style={
          {
            clipPath: BANNER_CLIP,
            "--step-glow": step.glow,
          } as React.CSSProperties
        }
      >
        {/* glossy top highlight */}
        <div
          className="absolute inset-0 opacity-70 pointer-events-none rounded-l-xl sm:rounded-l-2xl"
          style={{
            clipPath: BANNER_CLIP,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0) 45%)",
          }}
        />

        {/* colored accent stripe just before the point */}
        <div
          className="absolute top-1.5 bottom-1.5 sm:top-2 sm:bottom-2 right-4 sm:right-6 w-[3px] sm:w-1 rounded-full opacity-80"
          style={{ background: `linear-gradient(${step.from}, ${step.to})` }}
        />

        <div className="relative flex items-center gap-1.5 sm:gap-3 h-full pl-2 sm:pl-4 pr-6 sm:pr-9">
          <div
            className="w-6 h-6 xs:w-7 xs:h-7 sm:w-12 sm:h-12 rounded-md sm:rounded-xl text-white flex items-center justify-center shrink-0 shadow-md ring-1 sm:ring-2 ring-white transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${step.from}, ${step.to})`,
            }}
          >
            {React.cloneElement(step.icon as React.ReactElement, {
              sx: { fontSize: 14 },
              className: "sm:!text-[22px]",
            })}
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-[10px] xs:text-[11px] sm:text-base text-slate-900 tracking-wide leading-tight truncate uppercase">
              {step.title}
            </h3>
            <div
              className="hidden xs:block h-0.5 sm:h-1 rounded-full mt-1 sm:mt-1.5 w-5 sm:w-9 transition-all duration-300 group-hover:w-11"
              style={{
                background: `linear-gradient(90deg, ${step.from}, ${step.to})`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
function Connector({
  from,
  to,
  delay,
}: {
  from: string;
  to: string;
  delay: number;
}) {
  const gradId = `arrowGrad-${from.replace("#", "")}-${to.replace("#", "")}`;
  return (
    <svg
      width="18"
      height="12"
      viewBox="0 0 52 18"
      className="step-arrow shrink-0 sm:w-[30px] sm:h-[16px]"
      style={{ animationDelay: `${delay}s` }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={from} stopOpacity="0.7" />
          <stop offset="100%" stopColor={to} stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path
        d="M2 9H45"
        stroke={`url(#${gradId})`}
        strokeWidth="2.5"
        strokeDasharray="5 5"
      />
      <path
        d="M39 2L48 9L39 16"
        stroke={to}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Typewriter for a two-word phrase, word1 in blue then word2 in green,
 * typed out character by character, held, then deleted, then moves to next phrase.
 */
function TypingHeadline({ phrases }: { phrases: HeadlinePhrase[] }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [mode, setMode] = useState<"typing" | "holding" | "deleting">("typing");

  const current = phrases[phraseIndex];
  const fullText = `${current.word1} ${current.word2}`;

  useEffect(() => {
    if (mode === "typing") {
      if (charCount < fullText.length) {
        const t = setTimeout(() => setCharCount((c) => c + 1), TYPING_SPEED_MS);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setMode("holding"), HOLD_MS);
      return () => clearTimeout(t);
    }

    if (mode === "holding") {
      const t = setTimeout(() => setMode("deleting"), HOLD_MS / 2);
      return () => clearTimeout(t);
    }

    if (mode === "deleting") {
      if (charCount > 0) {
        const t = setTimeout(
          () => setCharCount((c) => c - 1),
          DELETING_SPEED_MS,
        );
        return () => clearTimeout(t);
      }
      setPhraseIndex((i) => (i + 1) % phrases.length);
      setMode("typing");
    }
  }, [mode, charCount, fullText, phrases.length]);

  const shown = fullText.slice(0, charCount);
  const spaceIndex = current.word1.length;
  const word1Shown = shown.slice(0, spaceIndex);
  const word2Shown = shown.slice(spaceIndex + 1); // +1 skips the space char

  return (
    <span className="inline-block whitespace-nowrap">
      <span className="text-blue-600">{word1Shown}</span>
      {word2Shown.length > 0 && " "}
      <span className="text-green-600">{word2Shown}</span>
      <span className="typing-cursor" aria-hidden="true">
        |
      </span>
    </span>
  );
}

export default function Hero() {
  return (
    <section className="relative  py-12 sm:py-16 lg:py-20 px-5 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10" />
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl -z-10" />
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl lg:max-w-3xl mx-auto lg:mx-0">
          <div className="flex items-center gap-1 sm:gap-2.5 py-3 sm:py-4 -my-1 sm:-my-2">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.title}>
                <StepCard step={s} delay={s.delay} />
                {i < STEPS.length - 1 && (
                  <Connector
                    from={s.to}
                    to={STEPS[i + 1].from}
                    delay={s.delay + 0.2}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          {/* "Build your" on its own line on mobile, headline wraps below it */}
          <h1 className="text-5xl sm:text-5xl lg:text-6xl font-black mt-10 text-slate-900 leading-tight">
            Build your
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> </span>
            <TypingHeadline phrases={HEADLINE_PHRASES} />
          </h1>

          <p className="text-slate-500 mt-5 max-w-xl sm:text-base leading-relaxed">
            Learn computer fundamentals, programming, and software through
            practical sessions, experienced faculty, and structured learning
            programs.
          </p>
          {/* Buttons: stacked & full-width on mobile, inline & auto-width from sm breakpoint up */}
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4">
            <Button
              variant="contained"
              size="large"
              startIcon={<RocketLaunchIcon fontSize="small" />}
              endIcon={
                <ArrowForwardIcon fontSize="small" className="btn-arrow" />
              }
              className="w-full sm:w-auto"
              sx={{
                borderRadius: 2.5,
                px: 3.6,
                py: 1.5,
                fontSize: 15,
                fontWeight: 700,
                textTransform: "none",
                color: "#fff",
                background:
                  "linear-gradient(135deg, #2563eb 55%, #16a34a 115%)",
                boxShadow: "0 8px 20px -6px rgba(37,99,235,0.45)",
                transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                "& .btn-arrow": {
                  transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                },
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #1d4ed8 55%, #15803d 115%)",
                  boxShadow: "0 12px 28px -6px rgba(37,99,235,0.55)",
                  transform: "translateY(-2px)",
                  "& .btn-arrow": {
                    transform: "translateX(3px)",
                  },
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              Explore Courses
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={
                <WhatsAppIcon fontSize="small" sx={{ color: "#16a34a" }} />
              }
              className="w-full sm:w-auto"
              sx={{
                borderRadius: 2.5,
                px: 3.6,
                py: 1.5,
                fontSize: 15,
                fontWeight: 700,
                textTransform: "none",
                borderWidth: 1.5,
                borderColor: "#e2e8f0",
                color: "#334155",
                backgroundColor: "#fff",
                transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                "&:hover": {
                  borderWidth: 1.5,
                  borderColor: "#cbd5e1",
                  backgroundColor: "#f8fafc",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 20px -8px rgba(15,23,42,0.12)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              Contact Us
            </Button>
          </div>
        </div>

        {/* Right column: illustration — unchanged sizing/positioning */}
        <div className="relative lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 flex justify-center mt-12 lg:mt-0">
          <img
            src={heroIllustration}
            alt="Student learning to code"
            className="hero-illustration w-full max-w-xl lg:w-[42vw] lg:max-w-none object-contain"
          />
        </div>
      </div>
    </section >
  );
}