import { useEffect, useRef, useState } from "react";

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
    messages: [
      "Good afternoon Ma'am I got 98 in computer science and 94.7%!☺️",
    ],
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

/* =========================================================
   INITIALS
========================================================= */

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

/* =========================================================
   MESSAGE BUBBLE TAIL
========================================================= */

function BubbleTail() {
  return (
    <div
      className="absolute -left-[6px] top-0 h-0 w-0"
      style={{
        borderTop: "8px solid #ffffff",
        borderLeft: "8px solid transparent",
      }}
    />
  );
}

/* =========================================================
   CHAT CARD
========================================================= */

function ChatCard({
  t,
}: {
  t: (typeof TESTIMONIALS)[number];
}) {
  return (
    <div
      className="
        w-[calc(100vw-64px)]
        max-w-[300px]
        sm:w-[280px]
        lg:w-[250px]
        xl:w-[260px]

        h-[330px]
        sm:h-[340px]

        shrink-0

        flex
        flex-col

        overflow-hidden
        rounded-[18px]

        border
        border-slate-200

        bg-black

        shadow-md
        sm:shadow-lg
      "
    >
      {/* =====================================================
          WHATSAPP HEADER
      ===================================================== */}

      <div
        className="
          flex
          shrink-0
          items-center
          gap-2
          bg-[#075E54]
          px-3
          py-2.5
        "
      >
        {/* Back */}
        <ArrowBackIcon
          sx={{
            color: "#fff",
            fontSize: 18,
          }}
        />

        {/* Avatar */}
        <div
          className="
            relative
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-gradient-to-br
            from-violet-400
            to-violet-600
            text-[10px]
            font-semibold
            text-white
            ring-2
            ring-white/20
          "
        >
          {initials(t.name)}
        </div>

        {/* Name */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-white">
            {t.name}
          </p>

          <p className="truncate text-[11px] text-emerald-100/90">
            online
          </p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          <VideocamIcon
            sx={{
              color: "#fff",
              fontSize: 17,
            }}
          />

          <CallIcon
            sx={{
              color: "#fff",
              fontSize: 15,
            }}
          />

          <MoreVertIcon
            sx={{
              color: "#fff",
              fontSize: 17,
            }}
          />
        </div>
      </div>

      {/* =====================================================
          CHAT AREA
      ===================================================== */}

      <div
        className="
          relative
          min-h-0
          flex-1
          px-2
          py-2.5
        "
        style={{
          backgroundImage: `url(${whatsappBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#e5ddd5",
        }}
      >
        <div
          className="
            flex
            h-full
            flex-col
            items-start
            gap-1.5

            overflow-y-auto

            pr-1

            scrollbar-thin
            scrollbar-thumb-slate-300/70
          "
        >
          {t.messages.map((message, messageIndex) => (
            <div
              key={messageIndex}
              className="
                relative
                max-w-[92%]
                shrink-0

                rounded-lg
                rounded-tl-none

                bg-white

                px-2.5
                py-2

                shadow-sm
              "
            >
              <BubbleTail />

              <p
                className="
                  break-words
                  whitespace-pre-wrap

                  text-[13px]
                  leading-[1.35]
                  text-slate-800
                "
              >
                {message}
              </p>

              <div className="mt-1 flex items-center justify-end">
                <span className="text-[10px] text-slate-400">
                  {t.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   TESTIMONIAL SECTION
========================================================= */

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isPaused, setIsPaused] = useState(false);

  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  /*
    We always render 3 copies of the list so we get a seamless
    infinite loop, on every screen size, in a single row.
  */
  const loopedTestimonials = [
    ...TESTIMONIALS,
    ...TESTIMONIALS,
    ...TESTIMONIALS,
  ];

  /* =======================================================
     START IN THE MIDDLE COPY
     (gives room to scroll both directions before we
     silently jump back a set)
  ======================================================= */

  useEffect(() => {
    const el = scrollRef.current;

    if (!el) return;

    const oneSetWidth = el.scrollWidth / 3;

    el.scrollLeft = oneSetWidth;
  }, []);

  /* =======================================================
     AUTO SCROLL (runs on all screen sizes)
  ======================================================= */

  useEffect(() => {
    const el = scrollRef.current;

    if (!el) return;

    let frameId: number;

    const step = () => {
      if (!isPaused && el) {
        el.scrollLeft += 0.45;

        const oneSetWidth = el.scrollWidth / 3;

        /*
          When we reach the third section,
          jump back by one complete set.
        */

        if (el.scrollLeft >= oneSetWidth * 2) {
          el.scrollLeft -= oneSetWidth;
        }

        /*
          Safety for reverse movement (manual drag past the start).
        */

        if (el.scrollLeft <= 0) {
          el.scrollLeft += oneSetWidth;
        }
      }

      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isPaused]);

  /* =======================================================
     PAUSE + RESUME
     Manual interaction (drag, wheel, arrow click) pauses
     auto-scroll briefly, then it resumes on its own.
  ======================================================= */

  const pauseThenResume = () => {
    setIsPaused(true);

    if (resumeTimeout.current) {
      clearTimeout(resumeTimeout.current);
    }

    resumeTimeout.current = setTimeout(() => {
      setIsPaused(false);
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (resumeTimeout.current) {
        clearTimeout(resumeTimeout.current);
      }
    };
  }, []);

  /* =======================================================
     ARROW SCROLL
  ======================================================= */

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollRef.current;

    if (!el) return;

    pauseThenResume();

    const firstCard = el.querySelector<HTMLElement>(
      "[data-testimonial-card]"
    );

    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;

    el.scrollBy({
      left: direction * (cardWidth + 16),
      behavior: "smooth",
    });
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      id="testimonials"
      className="
        bg-slate-50

        px-4
        py-12

        sm:px-6
        sm:py-16

        lg:px-10
        lg:py-20
      "
    >
      {/* =====================================================
          CUSTOM BEAUTIFUL SCROLLBAR
      ===================================================== */}

      <style>{`
        .chat-scroll-row::-webkit-scrollbar {
          height: 6px;
        }

        .chat-scroll-row::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 999px;
        }

        .chat-scroll-row::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 999px;
        }

        .chat-scroll-row::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .chat-scroll-row {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
      `}</style>

      {/* =====================================================
          HEADING
      ===================================================== */}

      <div className="mb-6 text-center sm:mb-8">
        <h2
          className="
            font-serif-display
            text-3xl
            font-semibold
            leading-tight
            text-slate-900

            sm:text-4xl

            lg:text-[2.75rem]
          "
        >
          What{" "}
          <span className="text-blue-600">
            Parents & Students
          </span>{" "}
          Say
        </h2>

        <p
          className="
            mx-auto
            mt-3
            max-w-xl

            text-sm
            leading-relaxed
            text-slate-500

            sm:text-base
          "
        >
          Real messages from real families — hear how our
          students grew in confidence and results at KGurukuls.
        </p>
      </div>

      {/* =====================================================
          TESTIMONIAL CONTAINER
      ===================================================== */}

      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* ===================================================
            LEFT ARROW (all screen sizes)
        =================================================== */}

        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Scroll testimonials left"
          className="
            absolute
            left-1
            top-1/2
            z-20

            flex
            h-8
            w-8
            -translate-y-1/2

            items-center
            justify-center

            rounded-full
            border
            border-slate-200

            bg-white

            shadow-md

            transition

            hover:scale-105
            hover:bg-slate-50

            sm:h-9
            sm:w-9
          "
        >
          <ChevronLeftIcon
            sx={{
              color: "#075E54",
              fontSize: 20,
            }}
          />
        </button>

        {/* ===================================================
            RIGHT ARROW (all screen sizes)
        =================================================== */}

        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Scroll testimonials right"
          className="
            absolute
            right-1
            top-1/2
            z-20

            flex
            h-8
            w-8
            -translate-y-1/2

            items-center
            justify-center

            rounded-full
            border
            border-slate-200

            bg-white

            shadow-md

            transition

            hover:scale-105
            hover:bg-slate-50

            sm:h-9
            sm:w-9
          "
        >
          <ChevronRightIcon
            sx={{
              color: "#075E54",
              fontSize: 20,
            }}
          />
        </button>

        {/* LEFT FADE */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            left-0
            top-0
            z-10
            w-10
            bg-gradient-to-r
            from-slate-50
            to-transparent
            sm:w-12
          "
        />

        {/* RIGHT FADE */}

        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            right-0
            top-0
            z-10
            w-10
            bg-gradient-to-l
            from-slate-50
            to-transparent
            sm:w-12
          "
        />

        {/* ===================================================
            SCROLL ROW (single row, always, all breakpoints)
        =================================================== */}

        <div
          ref={scrollRef}
          className="
            chat-scroll-row

            flex
            flex-nowrap
            gap-4

            overflow-x-auto

            scroll-smooth

            py-3

            px-10
            sm:px-12
          "
          onWheel={pauseThenResume}
          onTouchStart={pauseThenResume}
          onPointerDown={pauseThenResume}
        >
          {loopedTestimonials.map((t, index) => (
            <div
              key={`${t.name}-${index}`}
              data-testimonial-card
            >
              <ChatCard t={t} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}