import { useEffect, useRef, useState, useCallback } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import whatsappBg from "../assets/whatsapp-bg-img.jpg";
 
const TESTIMONIALS = [
  {
    messages: [
      "Hello ma'am. This is Samaira from Billabong. I got 98/100 in computer for term finals.",
      "Thank you for your guidance!",
    ],
    name: "Samaira Mehta",
    role: "Student",
    time: "10:24 AM",
  },
  {
    messages: ["Good afternoon Ma'am I got 98 in computer science and 94.7%!☺️"],
    name: "Aarav Shah",
    role: "Student",
    time: "9:12 AM",
  },
  {
    messages: [
      "Hello Ma'am, Parimita here. I got 100 in comp and 98% in boards.",
      "Thank you so much for all the help and support by you and Chipdey sir. It was truly extremely helpful. Everything that sir said would come, came — and it was very, very helpful.",
    ],
    name: "Parimita Rao",
    role: "Student",
    time: "8:47 PM",
  },
  {
    messages: [
      "Hello Ma'am! I got 96 in Computer Science in my finals.",
      "Thank you so much for all your guidance and support. Your explanations made everything so much easier to understand. 😊",
    ],
    name: "Ananya Kulkarni",
    role: "Student",
    time: "7:42 PM",
  },
  {
    messages: [
      "Good evening Ma'am. I just wanted to tell you that I scored 99 in Computer Science!",
      "Really happy with my result. Thank you for always clearing my doubts and helping me whenever I needed it. ❤️",
    ],
    name: "Rohan Deshmukh",
    role: "Student",
    time: "6:18 PM",
  },
  {
    messages: [
      "Hello Ma'am, I got 95 in Computer Science and 92.4% overall.",
      "Thank you so much Ma'am and Chipdey Sir for all the guidance. The practice and revision really helped me a lot during the exams.",
    ],
    name: "Sneha Joshi",
    role: "Student",
    time: "5:36 PM",
  },
  {
    messages: [
      "Ma'am I got 100/100 in Computer Science!! 😭❤️",
      "Thank you so much for teaching us so patiently and making even the difficult topics easy.",
      "All the practice questions were really helpful for the exams.",
    ],
    name: "Vedant Patil",
    role: "Student",
    time: "4:51 PM",
  },
  {
    messages: [
      "Hello Ma'am! I got 97 in Computer Science in my board exams.",
      "I honestly couldn't have done it without your guidance and Sir's support.",
      "Thank you both so much for believing in me and always motivating me! 😊",
    ],
    name: "Ishita Shah",
    role: "Student",
    time: "3:24 PM",
  },
  {
    messages: [
      "Good afternoon Ma'am. I got 98 in Computer Science and 95.2% overall!",
      "So happy with my result. Thank you so much for all the support, especially during the last few weeks before exams.",
      "Your revision and guidance helped me gain a lot of confidence.",
    ],
    name: "Aditya Mehta",
    role: "Student",
    time: "2:15 PM",
  },
  {
    messages: [
      "Hello Ma'am, I got 100 in Computer Science! 🎉",
      "I just wanted to thank you and Chipdey Sir for all the effort you put into teaching us.",
      "The way you explained every concept and made us practice so much really helped me during the exam. I am extremely thankful for all your guidance and support. ❤️",
    ],
    name: "Mrs. Neha Sharma",
    role: "Parent",
    time: "1:08 PM",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function BubbleTail() {
  return (
    <div
      className="absolute -left-[6px] top-0 w-0 h-0"
      style={{
        borderTop: "8px solid #ffffff",
        borderLeft: "8px solid transparent",
      }}
    />
  );
}
function ChatCard({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <div className="w-[210px] sm:w-[250px] shrink-0 h-[300px] sm:h-[350px] flex flex-col rounded-[18px] overflow-hidden shadow-lg border border-slate-200 bg-black snap-center">
        {/* WhatsApp Header */}
      <div className="bg-[#075E54] px-2.5 py-2 flex items-center gap-2 shrink-0">
        <ArrowBackIcon sx={{ color: "#fff", fontSize: 16 }} />

        <div className="relative w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white text-[10px] font-semibold shrink-0 ring-2 ring-white/20">
          {initials(t.name)}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white text-[14px] font-semibold truncate">{t.name}</p>
          <p className="text-emerald-100/90 text-[12px] truncate">online</p>
        </div>

        <div className="flex items-center gap-1.5">
          <VideocamIcon sx={{ color: "#fff", fontSize: 16 }} />
          <CallIcon sx={{ color: "#fff", fontSize: 14 }} />
          <MoreVertIcon sx={{ color: "#fff", fontSize: 16 }} />
        </div>
      </div>

      {/* Chat Area */}
      <div
        className="flex-1 min-h-0 px-2 py-2.5 relative"
        style={{
          backgroundImage: `url(${whatsappBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#e5ddd5",
        }}
      >
        <div className="h-full overflow-y-auto pr-1 flex flex-col items-start gap-1.5 scrollbar-thin scrollbar-thumb-slate-300/70">
          {t.messages.map((message, messageIndex) => (
            <div
              key={messageIndex}
              className="relative max-w-[90%] bg-white rounded-lg rounded-tl-none px-2 py-1.5 shadow-md shrink-0"
            >
              <BubbleTail />
              <p className="text-[13px] text-slate-800 leading-snug whitespace-pre-wrap break-words">
                {message}
              </p>
              <div className="flex items-center justify-end mt-0.5">
                <span className="text-[11px] text-slate-400">{t.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
const CARD_WIDTH_MOBILE = 210;
const CARD_WIDTH_DESKTOP = 250;
const GAP = 16; // matches gap-4

export default function Testimonials() {
  const outerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [shouldLoop, setShouldLoop] = useState(false);
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

const getCardWidth = () =>
    typeof window !== "undefined" && window.innerWidth < 640
      ? CARD_WIDTH_MOBILE
      : CARD_WIDTH_DESKTOP;

  const singleSetWidth = TESTIMONIALS.length * (getCardWidth() + GAP) - GAP;

  const measure = useCallback(() => {
    const visibleWidth = outerRef.current?.offsetWidth ?? 0;
    setShouldLoop(singleSetWidth > visibleWidth + 40);
  }, [singleSetWidth]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const loopedTestimonials = shouldLoop
    ? [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS]
    : TESTIMONIALS;

  useEffect(() => {
    if (!shouldLoop) return;
    const el = scrollRef.current;
    if (el) el.scrollLeft = singleSetWidth + GAP;
  }, [shouldLoop, singleSetWidth]);

  useEffect(() => {
    if (!shouldLoop) return;
    const el = scrollRef.current;
    if (!el) return;

    let frameId: number;
    const step = () => {
      if (!isPaused && el) {
        el.scrollLeft += 0.5;
        if (el.scrollLeft >= singleSetWidth * 2) {
          el.scrollLeft -= singleSetWidth;
        } else if (el.scrollLeft <= 0) {
          el.scrollLeft += singleSetWidth;
        }
      }
      frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [isPaused, singleSetWidth, shouldLoop]);

  const pauseThenResume = () => {
    if (!shouldLoop) return;
    setIsPaused(true);
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => setIsPaused(false), 2500);
  };
const scrollByCard = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    pauseThenResume();
    el.scrollBy({ left: direction * (getCardWidth() + GAP), behavior: "smooth" });
  };

  return (
<section id="testimonials" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-10">      <style>{`
        .chat-scroll-row::-webkit-scrollbar { display: none; }
        .chat-scroll-row { scrollbar-width: none; -ms-overflow-style: none; }
       `}</style>

      {/* Heading — matches the Learning Journey section's eyebrow + gradient-display style */}
      <div className="text-center mb-2">
       <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 leading-tight">
What <span className="text-blue-600">Parents & Students</span> Say</h2> <p className="text-slate-500 mt-3 text-sm sm:text-base max-w-xl mx-auto">
          Real messages from real families — hear how our students grew in
          confidence and results at KGurukuls.
        </p>
      </div>

      <div
        ref={outerRef}
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {shouldLoop && (
          <>
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Scroll testimonials left"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:scale-105 transition"
            >
              <ChevronLeftIcon sx={{ color: "#075E54", fontSize: 18 }} />
            </button>

            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Scroll testimonials right"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:scale-105 transition"
            >
              <ChevronRightIcon sx={{ color: "#075E54", fontSize: 18 }} />
            </button>

            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white to-transparent z-[5]" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white to-transparent z-[5]" />
          </>
        )}

        <div
          ref={scrollRef}
        className={`chat-scroll-row flex gap-4 py-2 ${
            shouldLoop
              ? "overflow-x-auto scroll-smooth px-6 sm:px-10"
              : "overflow-visible justify-center flex-wrap"
          }`}
          onWheel={pauseThenResume}
          onTouchStart={pauseThenResume}
        >
          {loopedTestimonials.map((t, index) => (
            <ChatCard key={`${t.name}-${index}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}