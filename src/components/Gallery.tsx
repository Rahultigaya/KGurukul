import { useRef } from "react";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ZoomInIcon from "@mui/icons-material/ZoomIn";

export const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
];

const IMAGE_WIDTH_MOBILE = 220;
const IMAGE_WIDTH_DESKTOP = 300;
const GAP = 16;

interface GalleryProps {
  onOpenLightbox?: (index: number) => void;
}

export default function Gallery({ onOpenLightbox }: GalleryProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

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
    <section id="gallery" className="py-12 sm:py-16 lg:py-20 bg-slate-50 relative overflow-hidden">
      <style>{`
        .gallery-scroll::-webkit-scrollbar { display: none; }
        .gallery-scroll { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Campus Life & Events
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
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-slate-200 flex items-center justify-center hover:bg-white hover:scale-110 transition-all text-blue-600"
          >
            <ChevronLeftIcon fontSize="medium" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={() => scrollByImage(1)}
            aria-label="Scroll gallery right"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-slate-200 flex items-center justify-center hover:bg-white hover:scale-110 transition-all text-blue-600"
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
            className="gallery-scroll flex gap-4 overflow-x-auto scroll-smooth px-8 sm:px-12 py-3"
          >
            {GALLERY_IMAGES.map((src, i) => (
              <div
                key={i}
                onClick={() => onOpenLightbox && onOpenLightbox(i)}
                className="w-[220px] sm:w-[280px] h-[160px] sm:h-[200px] rounded-2xl overflow-hidden shrink-0 bg-slate-900 shadow-md border border-slate-200/80 group cursor-pointer relative"
              >
                <img
                  src={src}
                  alt={`KGurukul moment ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                />
                
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
        <div className="flex justify-center mt-10">
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
              "&:hover": {
                bgcolor: "#db2777",
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