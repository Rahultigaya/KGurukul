import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import CodeIcon from "@mui/icons-material/Code";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import heroIllustration from "../assets/hero-illustration.png";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
 
interface Step {
  title: string;
  icon: React.ReactElement<SvgIconProps>;
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

interface HeadlinePhrase {
  word1: string;
  word2: string;
}

const HEADLINE_PHRASES: HeadlinePhrase[] = [
  { word1: "Bright", word2: "Future" },
  { word1: "Tech", word2: "Career" },
  { word1: "Coding", word2: "Skills" },
];

const TYPING_SPEED_MS = 80;
const DELETING_SPEED_MS = 45;
const HOLD_MS = 1400;

function StepCard({ step, delay }: { step: Step; delay: number }) {
  return (
    <div
      className="step-card-in relative flex-1 min-w-0 sm:flex-none sm:w-[190px] md:w-[210px] lg:w-[200px] h-[48px] xs:h-[54px] sm:h-[60px]"
      style={{ animationDelay: `${delay}s` }}
    >
      <div
        className="absolute -inset-2 rounded-full opacity-30 blur-xl -z-10"
        style={{
          background: `radial-gradient(circle, ${step.to}, transparent 70%)`,
        }}
      />

      <div
        className="absolute inset-0 translate-x-1 translate-y-1 sm:translate-x-1.5 sm:translate-y-1.5 rounded-l-xl sm:rounded-l-2xl opacity-70 blur-[1px]"
        style={{
          clipPath: BANNER_CLIP,
          background: `linear-gradient(135deg, ${step.from}, ${step.to})`,
        }}
      />

      <div
        className="step-card-glow group relative h-full bg-white rounded-l-xl sm:rounded-l-2xl border border-slate-200"
        style={
          {
            clipPath: BANNER_CLIP,
            "--step-glow": step.glow,
          } as React.CSSProperties
        }
      >
        <div
          className="absolute inset-0 opacity-70 pointer-events-none rounded-l-xl sm:rounded-l-2xl"
          style={{
            clipPath: BANNER_CLIP,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0) 45%)",
          }}
        />

        <div
          className="absolute top-1.5 bottom-1.5 sm:top-2 sm:bottom-2 right-4 sm:right-6 w-[3px] sm:w-1 rounded-full opacity-80"
          style={{ background: `linear-gradient(${step.from}, ${step.to})` }}
        />

        <div className="relative flex items-center gap-1.5 sm:gap-3 h-full pl-2 sm:pl-4 pr-6 sm:pr-9">
          <div
            className="w-6 h-6 xs:w-7 xs:h-7 sm:w-10 sm:h-10 rounded-md sm:rounded-xl text-white flex items-center justify-center shrink-0 shadow-md ring-1 sm:ring-2 ring-white transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${step.from}, ${step.to})`,
            }}
          >
            {React.cloneElement(step.icon, {
              sx: { fontSize: 14 },
              className: "sm:!text-[20px]",
            })}
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-[10px] xs:text-[11px] sm:text-sm text-slate-900 tracking-wide leading-tight truncate uppercase">
              {step.title}
            </h3>
            <div
              className="hidden xs:block h-0.5 sm:h-1 rounded-full mt-0.5 sm:mt-1 w-5 sm:w-8 transition-all duration-300 group-hover:w-10"
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
      className="step-arrow shrink-0 sm:w-[26px] sm:h-[14px]"
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
  const word2Shown = shown.slice(spaceIndex + 1);

  return (
    <span className="inline-block whitespace-nowrap">
      <span className="text-blue-600">{word1Shown}</span>
      {word2Shown.length > 0 && " "}
      <span className="text-emerald-600">{word2Shown}</span>
      <span className="typing-cursor text-emerald-600 font-normal" aria-hidden="true">
        |
      </span>
    </span>
  );
}

export default function Hero() {
  return (
    <section id="home" className="relative pt-2 sm:pt-4 lg:pt-6 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-slate-50/50 via-white to-slate-50/80">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-10" />
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-6 space-y-5">
            
            
            {/* Learn - Code - Succeed Banner Pills */}
            <div className="flex items-center gap-1 sm:gap-2.5 py-1">
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

            {/* Headline */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-[2.6rem] lg:text-4xl xl:text-5xl font-black text-slate-900 leading-tight tracking-tight whitespace-nowrap">
              Build Your <TypingHeadline phrases={HEADLINE_PHRASES} />
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
              Empowering ICSE, HSC, and ISC students with practical computer programming, 
              expert 1-on-1 guidance from 30+ year veteran faculty, and 100% board exam preparation.
            </p>

            {/* Key Stats Strip */}
            <div className="grid grid-cols-3 gap-3 pt-1 max-w-lg">
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-3 text-center shadow-sm">
                <p className="text-xl sm:text-2xl font-black text-blue-600">30+</p>
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Years Legacy</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-3 text-center shadow-sm">
                <p className="text-xl sm:text-2xl font-black text-emerald-600">6000+</p>
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Students Trained</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-3 text-center shadow-sm">
                <p className="text-xl sm:text-2xl font-black text-amber-500">100%</p>
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Practical Focus</p>
              </div>
            </div>

            {/* Dual CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <Button
                href="#courses"
                variant="contained"
                size="large"
                startIcon={<RocketLaunchIcon fontSize="small" />}
                endIcon={<ArrowForwardIcon fontSize="small" className="btn-arrow" />}
                className="w-full sm:w-auto"
                sx={{
                  borderRadius: 3,
                  px: 3.8,
                  py: 1.6,
                  fontSize: 15,
                  fontWeight: 700,
                  textTransform: "none",
                  color: "#fff",
                  background: "linear-gradient(135deg, #2563eb 55%, #16a34a 115%)",
                  boxShadow: "0 10px 25px -6px rgba(37,99,235,0.45)",
                  transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                  "& .btn-arrow": {
                    transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                  },
                  "&:hover": {
                    background: "linear-gradient(135deg, #1d4ed8 55%, #15803d 115%)",
                    boxShadow: "0 14px 32px -6px rgba(37,99,235,0.6)",
                    transform: "translateY(-2px)",
                    "& .btn-arrow": {
                      transform: "translateX(4px)",
                    },
                  },
                }}
              >
                Explore Courses
              </Button>

              <Button
                href="https://wa.me/919967442515"
                target="_blank"
                rel="noreferrer"
                variant="outlined"
                size="large"
                startIcon={<WhatsAppIcon fontSize="small" sx={{ color: "#16a34a" }} />}
                className="w-full sm:w-auto"
                sx={{
                  borderRadius: 3,
                  px: 3.8,
                  py: 1.6,
                  fontSize: 15,
                  fontWeight: 700,
                  textTransform: "none",
                  borderWidth: 1.5,
                  borderColor: "#cbd5e1",
                  color: "#334155",
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 12px rgba(15,23,42,0.05)",
                  transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                  "&:hover": {
                    borderWidth: 1.5,
                    borderColor: "#94a3b8",
                    backgroundColor: "#f8fafc",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 20px -6px rgba(15,23,42,0.12)",
                  },
                }}
              >
                Chat on WhatsApp
              </Button>
            </div>
          </div>

          {/* Right Column: Enlarged Hero Illustration */}
          <div className="lg:col-span-6 relative flex justify-center mt-4 lg:mt-0">
            <div className="relative w-full max-w-xl sm:max-w-2xl lg:max-w-none">
              {/* Background glow decoration */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/25 to-emerald-400/25 rounded-3xl blur-3xl -z-10" />
              <img
                src={heroIllustration}
                alt="Student learning computer programming at KGurukul"
                className="hero-illustration w-full h-auto object-contain drop-shadow-2xl sm:scale-105 lg:scale-115 xl:scale-120 transform transition-transform origin-center"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}