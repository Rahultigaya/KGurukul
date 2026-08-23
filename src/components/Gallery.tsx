import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ZoomInIcon from "@mui/icons-material/ZoomIn";

const galleryModules = import.meta.glob(
  "../assets/gallery/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}",
  { eager: true, import: "default" }
);

export const GALLERY_IMAGES: string[] = Object.values(
  galleryModules
) as string[];

const IMAGE_WIDTH_MOBILE = 220;
const IMAGE_WIDTH_DESKTOP = 300;
const GAP = 16;

// Cap the stagger delay so a 12-image row doesn't take forever to finish
// revealing — later cards share the same short delay instead of queuing up.
const MAX_STAGGER_INDEX = 6;
const STAGGER_STEP = 0.07;

interface GalleryProps {
  onOpenLightbox?: (index: number) => void;
}

export default function Gallery({ onOpenLightbox }: GalleryProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollByImage = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const width = window.innerWidth < 640 ? IMAGE_WIDTH_MOBILE : IMAGE_WIDTH_DESKTOP;
    el.scrollBy({
      left: direction * (width + GAP),
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="py-12 sm:py-16 lg:py-20 bg-slate-50 relative overflow-hidden"
    >
      <style>{`
        .gallery-scroll::-webkit-scrollbar { display: none; }
        .gallery-scroll { scrollbar-width: none; -ms-overflow-style: none; }

        @keyframes gal-header-fade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gal-card-flip {
          from { opacity: 0; transform: perspective(900px) rotateX(35deg) translateY(24px); }
          to { opacity: 1; transform: perspective(900px) rotateX(0deg) translateY(0); }
        }
        @keyframes gal-arrow-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes gal-cta-fade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .gal-header { opacity: 0; }
        .gal-header.gal-in {
          animation: gal-header-fade 0.6s ease-out forwards;
        }

        .gal-track {
          perspective: 1200px;
        }
        .gal-card {
          opacity: 0;
          transform-origin: bottom center;
        }
        .gal-card.gal-in {
          animation: gal-card-flip 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .gal-arrow-left,
        .gal-arrow-right {
          opacity: 0;
        }
        .gal-arrow-left.gal-in,
        .gal-arrow-right.gal-in {
          animation: gal-arrow-fade 0.5s ease-out 0.5s forwards;
        }

        .gal-cta {
          opacity: 0;
        }
        .gal-cta.gal-in {
          animation: gal-cta-fade 0.5s ease-out 0.55s forwards;
        }

        .gal-icon-wrap {
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .gal-card:hover .gal-icon-wrap {
          transform: scale(1.08);
        }

        @media (prefers-reduced-motion: reduce) {
          .gal-header, .gal-card, .gal-arrow-left, .gal-arrow-right, .gal-cta {
            opacity: 1 !important;
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`gal-header ${inView ? "gal-in" : ""} text-center mb-5`}>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            OUR GALLERY
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight mt-3">
            <span className="text-blue-600">Moments</span> at KGurukul's
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            A glimpse of practical computer lab coding, student workshops, and memorable celebrations.
          </p>
        </div>

        {/* Gallery Carousel Container */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={() => scrollByImage(-1)}
            aria-label="Scroll gallery left"
            className={`gal-arrow-left ${inView ? "gal-in" : ""} absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-slate-200 flex items-center justify-center hover:bg-white hover:scale-110 transition-all text-blue-600`}
          >
            <ChevronLeftIcon fontSize="medium" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={() => scrollByImage(1)}
            aria-label="Scroll gallery right"
            className={`gal-arrow-right ${inView ? "gal-in" : ""} absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-slate-200 flex items-center justify-center hover:bg-white hover:scale-110 transition-all text-blue-600`}
          >
            <ChevronRightIcon fontSize="medium" />
          </button>

          {/* Left Fade */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 to-transparent z-10" />

          {/* Right Fade */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 to-transparent z-10" />

          {/* Scroll Track */}
          <div
            ref={scrollRef}
            className="gal-track gallery-scroll flex gap-4 overflow-x-auto scroll-smooth px-8 sm:px-12 py-3"
          >
            {GALLERY_IMAGES.map((src, i) => (
              <div
                key={i}
                onClick={() => onOpenLightbox && onOpenLightbox(i)}
                className={`gal-card ${inView ? "gal-in" : ""} w-[220px] sm:w-[280px] h-[160px] sm:h-[200px] rounded-2xl overflow-hidden shrink-0 bg-slate-900 shadow-md border border-slate-200/80 group cursor-pointer relative`}
                style={{
                  animationDelay: inView
                    ? `${Math.min(i, MAX_STAGGER_INDEX) * STAGGER_STEP}s`
                    : undefined,
                }}
              >
                <div className="gal-icon-wrap w-full h-full">
                  <img
                    src={src}
                    alt={`KGurukul moment ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <ZoomInIcon />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View More CTA */}
        <div className={`gal-cta ${inView ? "gal-in" : ""} flex justify-center mt-10`}>
          <Button
            href="#contact"
            variant="contained"
            endIcon={<ArrowForwardIcon fontSize="small" />}
            sx={{
              borderRadius: 999,
              px: 4,
              py: 1.3,
              bgcolor: "#ec4899",
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "0 8px 20px -6px rgba(236,72,153,0.45)",
              transition: "transform 0.25s ease, background-color 0.2s ease",
              "&:hover": {
                bgcolor: "#db2777",
                transform: "scale(1.04)",
              },
            }}
          >
            Visit Our Institute
          </Button>
        </div>
      </div>
    </section>
  );
}