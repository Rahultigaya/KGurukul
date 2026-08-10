import { useEffect, useRef, useState } from "react";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import aboutUsImage from "../assets/about-us.png";
const STATS = [
  {
    icon: <SchoolIcon fontSize="small" />,
    iconBg: "#dbeafe",
    iconColor: "#2563eb", // blue
    value: 30,
    suffix: "+",
    label: "Years of Experience",
  },
  {
    icon: <GroupsIcon fontSize="small" />,
    iconBg: "#ffedd5",
    iconColor: "#ea580c", // orange
    value: 1000,
    suffix: "+",
    label: "Students Trained",
  },
  {
    icon: <EmojiEventsIcon fontSize="small" />,
    iconBg: "#dcfce7",
    iconColor: "#16a34a", // green
    value: 100,
    suffix: "%",
    label: "Success Rate",
  },
];

// Fires once when the wrapped element scrolls into view
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

// Counts a number up from 0 once `start` becomes true
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
  const displayValue = stat.value == null ? stat.text : `${count}${stat.suffix}`;

  return (
    <div
      className="flex-1 max-h-[170px] transition-all duration-700 ease-out"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(16px)",
      }}
    >
      <div
        className="group relative flex h-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl px-4 py-6 text-center shadow-md ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        style={{
          background: `linear-gradient(135deg, ${stat.iconBg} 0%, #ffffff 65%)`,
          borderColor: `${stat.iconColor}33`,
        }}
      >
        {/* Bold accent glow in the corner */}
        <div
          className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full opacity-40 blur-2xl transition-opacity duration-300 group-hover:opacity-60"
          style={{ backgroundColor: stat.iconColor }}
        />

        {/* Icon with strong ring */}
        <span
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{
            backgroundColor: stat.iconColor,
            color: "#ffffff",
            boxShadow: `0 6px 18px -4px ${stat.iconColor}99`,
          }}
        >
          {stat.icon}
        </span>

        <div className="relative">
          <p
            className="text-4xl sm:text-5xl font-black leading-none tracking-tight"
            style={{ color: stat.iconColor }}
          >
            {displayValue}
          </p>
          <p className="mt-2 text-sm font-bold uppercase tracking-wide text-slate-700">
            {stat.label}
          </p>
        </div>

        {/* Bold accent underline */}
        <span
          className="h-1 w-8 rounded-full transition-all duration-300 group-hover:w-14"
          style={{ backgroundColor: stat.iconColor }}
        />
      </div>
    </div>
  );
}


export default function About() {
  const [sectionRef, sectionInView] = useInView(0.15);

  return (
    <section id="about" ref={sectionRef} className="relative overflow-hidden py-12 sm:py-16 lg:py-20">     
<div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid lg:grid-cols-[1.1fr_1fr_0.28fr] gap-10 items-stretch">      {/* Illustration */}
      <div
        className="relative flex flex-col transition-all duration-700 ease-out"
        style={{
          opacity: sectionInView ? 1 : 0,
          transform: sectionInView ? "translateX(0)" : "translateX(-24px)",
        }}
      >
        <div className="relative rounded-2xl shadow-xl overflow-hidden flex-1">
          <img
            src={aboutUsImage}
            alt="About KGurukul"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>

        {/* Badge strip under the image */}
        <div
          className="mx-auto -mt-5 flex w-fit items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-medium text-white shadow-lg transition-all duration-700 relative"
          style={{
            transitionDelay: "500ms",
            opacity: sectionInView ? 1 : 0,
            transform: sectionInView ? "translateY(0)" : "translateY(10px)",
          }}
        >
          <SchoolIcon fontSize="small" />
          <span>Practical Learning&nbsp;|&nbsp;Expert Guidance&nbsp;|&nbsp;Real Results</span>
        </div>
      </div>

      {/* Copy */}
      <div
        className="transition-all duration-700 ease-out"
        style={{
          transitionDelay: "150ms",
          opacity: sectionInView ? 1 : 0,
          transform: sectionInView ? "translateY(0)" : "translateY(16px)",
        }}
      >
        <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 leading-tight">
          About <span className="text-blue-600">KGurukul's</span>
        </h2>
        <p className="mt-5 text-slate-500 leading-relaxed">
          KGurukul is a trusted computer education institute committed to shaping future-ready professionals through quality, practical, and industry-focused learning.
          With years of experience in computer education, we provide a supportive environment where students build strong technical foundations, develop problem-solving skills,
          and gain the confidence to succeed in today's rapidly evolving digital world.
        </p>
        <p className="mt-5 text-slate-500 leading-relaxed">
          Our programs are designed to bridge the gap between academic knowledge and real-world applications by combining structured learning with hands-on practice.
          At KGurukul, we believe that every student has the potential to achieve more with the right guidance, dedication, and opportunities.
          Our mission is to inspire lifelong learning, nurture talent, and empower individuals to build successful careers in technology.
        </p>

        {/* Pull quote */}
        <div
          className="mt-6 flex gap-3 rounded-lg border-l-4 border-blue-600 bg-blue-50/60 px-4 py-3.5 transition-all duration-700"
          style={{
            transitionDelay: "650ms",
            opacity: sectionInView ? 1 : 0,
            transform: sectionInView ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <FormatQuoteIcon className="shrink-0 text-blue-600" fontSize="small" />
          <p className="text-sm font-bold text-slate-700 leading-relaxed">
            Our mission is to empower students with the skills, confidence
            and mindset to excel in the digital world.
          </p>
        </div>

      </div>

      <div className="flex h-full flex-col justify-center gap-4">
        {STATS.map((s, i) => (
          <AnimatedStat key={s.label} stat={s} inView={sectionInView} delay={i * 120} />
        ))}
      </div>
    </div>
    </section>
  );
}