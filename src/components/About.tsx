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
      className="flex-1 transition-all duration-700 ease-out"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
      }}
    >
      <div
        className="group relative flex flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl p-4 sm:p-5 text-center shadow-sm ring-1 ring-slate-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div
          className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full opacity-20 blur-xl transition-opacity duration-300 group-hover:opacity-40"
          style={{ backgroundColor: stat.iconColor }}
        />

        <span
          className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{
            backgroundColor: stat.iconBg,
            color: stat.iconColor,
          }}
        >
          {stat.icon}
        </span>

        <div className="relative mt-1">
          <p
            className="text-2xl sm:text-3xl lg:text-4xl font-black leading-none tracking-tight"
            style={{ color: stat.iconColor }}
          >
            {displayValue}
          </p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 leading-tight">
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
    <section id="about" ref={sectionRef} className="relative overflow-hidden py-12 sm:py-16 lg:py-20 bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Image showcase */}
          <div
            className="lg:col-span-5 relative transition-all duration-700 ease-out"
            style={{
              opacity: sectionInView ? 1 : 0,
              transform: sectionInView ? "translateX(0)" : "translateX(-24px)",
            }}
          >
            <div className="relative rounded-3xl shadow-xl overflow-hidden bg-slate-900 border border-slate-200/80">
              <img
                src={aboutUsImage}
                alt="About KGurukul Computer Education"
                className="w-full h-[320px] sm:h-[400px] object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            </div>

            {/* Badge strip under image */}
            <div
              className="mx-auto -mt-6 flex w-fit items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xl border border-slate-700 relative text-center"
              style={{
                transitionDelay: "400ms",
                opacity: sectionInView ? 1 : 0,
                transform: sectionInView ? "translateY(0)" : "translateY(10px)",
              }}
            >
              <SchoolIcon fontSize="small" className="text-amber-400" />
              <span>Practical Labs &nbsp;|&nbsp; Board Exam Preparation &nbsp;|&nbsp; 100% Results</span>
            </div>
          </div>

          {/* Right Column: Copy & Stats */}
          <div
            className="lg:col-span-7 space-y-6 transition-all duration-700 ease-out"
            style={{
              transitionDelay: "150ms",
              opacity: sectionInView ? 1 : 0,
              transform: sectionInView ? "translateY(0)" : "translateY(16px)",
            }}
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                About Our Institute
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight mt-3">
                Empowering Coders at <span className="text-blue-600">KGurukul's</span>
              </h2>
            </div>

            <p className="text-slate-600 text-base leading-relaxed">
              KGurukul is a premier computer education institute in Thane dedicated to equipping 
              ICSE, HSC, and ISC students with foundational and advanced computer programming skills. 
              With over 30 years of teaching excellence, we combine structured board syllabi with hands-on 
              practical lab coding.
            </p>

            {/* Features checkmarks */}
            <div className="grid sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
                <CheckCircleIcon fontSize="small" className="text-emerald-600" />
                <span>ICSE & HSC Board Aligned Curriculum</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
                <CheckCircleIcon fontSize="small" className="text-emerald-600" />
                <span>Dedicated 1-on-1 Practical Lab Sessions</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
                <CheckCircleIcon fontSize="small" className="text-emerald-600" />
                <span>Weekly Assessment & Prelim Mocks</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
                <CheckCircleIcon fontSize="small" className="text-emerald-600" />
                <span>Small Batch Size for Personal Attention</span>
              </div>
            </div>

            {/* Pull Quote */}
            <div className="flex gap-3.5 rounded-2xl border-l-4 border-blue-600 bg-blue-50/70 p-4">
              <FormatQuoteIcon className="shrink-0 text-blue-600" fontSize="medium" />
              <p className="text-sm font-bold text-slate-800 leading-relaxed italic">
                "Our mission is to make computer science intuitive, enjoyable, and scoring for every single student."
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {STATS.map((s, i) => (
                <AnimatedStat key={s.label} stat={s} inView={sectionInView} delay={i * 120} />
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}