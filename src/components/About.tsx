import { useEffect, useRef, useState } from "react";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import aboutUsImage from "../assets/about-us.png";

const STATS = [
  {
    icon: <SchoolIcon fontSize="small" />,
    iconBg: "#dbeafe",
    iconColor: "#2563eb",
    value: 30,
    suffix: "+",
    label: "Years Experience",
  },
  {
    icon: <GroupsIcon fontSize="small" />,
    iconBg: "#ffedd5",
    iconColor: "#ea580c",
    value: 6000,
    suffix: "+",
    label: "Students Trained",
  },
  {
    icon: <EmojiEventsIcon fontSize="small" />,
    iconBg: "#dcfce7",
    iconColor: "#16a34a",
    value: 100,
    suffix: "%",
    label: "Success Rate",
  },
];

function useInView(threshold = 0.25) {
  const ref = useRef<any>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

function useCountUp(target: number, start: boolean, duration: number = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start || target == null) return;
    let frame: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target, duration]);

  return value;
}

function AnimatedStat({ stat, inView, delay }: { stat: any; inView: boolean; delay: number }) {
  const count = useCountUp(stat.value, inView);
  const displayValue = `${count}${stat.suffix}`;

  return (
    <div
      className="w-full transition-all duration-700 ease-out"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
      }}
    >
      <div
        className="group relative flex items-center gap-3 overflow-hidden rounded-xl p-2.5 px-3.5 shadow-sm border-l-4 bg-white transition-all duration-300 hover:translate-x-1.5 hover:shadow-md"
        style={{ borderLeftColor: stat.iconColor }}
      >
        <div
          className="pointer-events-none absolute -top-8 -right-8 h-16 w-16 rounded-full opacity-10 blur-xl transition-opacity duration-300 group-hover:opacity-20"
          style={{ backgroundColor: stat.iconColor }}
        />

        <span
          className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
          style={{
            backgroundColor: stat.iconBg,
            color: stat.iconColor,
          }}
        >
          {stat.icon}
        </span>

        <div className="relative min-w-0">
          <p
            className="text-base sm:text-lg font-black leading-none tracking-tight"
            style={{ color: stat.iconColor }}
          >
            {displayValue}
          </p>
          <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500 leading-tight truncate">
            {stat.label}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const [sectionRef, sectionInView] = useInView(0.15);

  return (
    <section id="about" ref={sectionRef} className="relative overflow-hidden py-10 lg:py-0 lg:h-screen lg:min-h-[640px] xl:min-h-[760px] lg:flex lg:items-center bg-slate-50/60">
      <div className="max-w-7xl mx-auto   w-full">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left Column: Image showcase */}
          <div
            className="lg:col-span-5 relative transition-all duration-700 ease-out"
            style={{
              opacity: sectionInView ? 1 : 0,
              transform: sectionInView ? "translateX(0)" : "translateX(-24px)",
            }}
          >
            <div className="relative rounded-2xl shadow-lg overflow-hidden bg-slate-900 border border-slate-200/80">
              <img
                src={aboutUsImage}
                alt="About KGurukul Computer Education"
                className="w-full h-[260px] sm:h-[320px] lg:h-[340px] xl:h-[400px] object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            </div>

            {/* Badge strip under image */}
            <div
              className="mx-auto -mt-4 flex w-fit items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-[10px] sm:text-xs font-semibold text-white shadow-xl border border-slate-700 relative text-center"
              style={{
                transitionDelay: "400ms",
                opacity: sectionInView ? 1 : 0,
                transform: sectionInView ? "translateY(0)" : "translateY(10px)",
              }}
            >
              <SchoolIcon fontSize="small" className="text-amber-400 !text-sm sm:!text-base" />
              <span>Practical Labs &nbsp;|&nbsp; Board Prep &nbsp;|&nbsp; 100% Results</span>
            </div>
          </div>

          {/* Right Column: Copy & Stats */}
          <div
            className="lg:col-span-7 space-y-4 transition-all duration-700 ease-out"
            style={{
              transitionDelay: "150ms",
              opacity: sectionInView ? 1 : 0,
              transform: sectionInView ? "translateY(0)" : "translateY(16px)",
            }}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                About Our Institute
              </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight mt-3">
                Empowering Coders at <span className="text-blue-600">KGurukul's</span>
              </h2>
            </div>

            {/* Sub-grid: Paragraphs on the left, Stats on the right */}
            <div className="grid md:grid-cols-12 gap-5 items-center pt-0.5">
              <div className="md:col-span-8 space-y-3">
                <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
                  KGurukul is a premier computer education institute in Thane dedicated to equipping 
                  ICSE, HSC, and ISC students with foundational and advanced computer programming skills. 
                  With over 30 years of teaching excellence, we combine structured board syllabi with hands-on 
                  practical lab coding.
                </p>
                <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
                  Our unique pedagogy focuses on logic building and deep conceptual understanding, moving away 
                  from rote memorization. Through customized study materials, topic-wise worksheets, and regular 
                  mock exams, we build the confidence and skills required to excel in school board exams and beyond.
                </p>
              </div>
              <div className="md:col-span-4 flex flex-col gap-2.5">
                {STATS.map((s, i) => (
                  <AnimatedStat key={s.label} stat={s} inView={sectionInView} delay={i * 120} />
                ))}
              </div>
            </div>

            {/* Features checkmarks */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-0.5">
              <div className="flex items-center gap-1.5 text-base font-semibold text-slate-800">
                <CheckCircleIcon className="text-emerald-600 !text-base shrink-0" />
                <span className="truncate">ICSE & HSC Curriculum</span>
              </div>
              <div className="flex items-center gap-1.5 text-base font-semibold text-slate-800">
                <CheckCircleIcon className="text-emerald-600 !text-base shrink-0" />
                <span className="truncate">1-on-1 Practical Labs</span>
              </div>
              <div className="flex items-center gap-1.5 text-base font-semibold text-slate-800">
                <CheckCircleIcon className="text-emerald-600 !text-base shrink-0" />
                <span className="truncate">Weekly Assessments</span>
              </div>
              <div className="flex items-center gap-1.5 text-base font-semibold text-slate-800">
                <CheckCircleIcon className="text-emerald-600 !text-base shrink-0" />
                <span className="truncate">Personal Attention Batches</span>
              </div>
            </div>

            {/* Pull Quote */}
            <div className="flex gap-2 rounded-lg border-l-2 border-blue-600 bg-blue-50/60 p-2.5">
              <FormatQuoteIcon className="shrink-0 text-blue-600 !text-lg" />
              <p className="text-base font-semibold text-slate-700 italic leading-snug">
                "Our mission is to make computer science intuitive, enjoyable, and scoring for every single student."
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}