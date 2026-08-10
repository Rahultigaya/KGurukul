import { useRef } from "react";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";


const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=300&h=400&fit=crop",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=600&h=400&fit=crop",
];

const IMAGE_WIDTH_MOBILE = 160;
const IMAGE_WIDTH_DESKTOP = 220;
const GAP = 12;

export default function Gallery() {
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
    <section id="gallery" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-10">      <style>{`
        .gallery-scroll::-webkit-scrollbar {
          display: none;
        }

        .gallery-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
 
      `}</style>

      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 leading-tight">
          <span className="text-blue-600">Moments</span> at KGurukul's
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          A glimpse of learning, activities and memorable moments at KGurukul.
        </p>
      </div>

      {/* Gallery */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          type="button"
          onClick={() => scrollByImage(-1)}
          aria-label="Scroll gallery left"
          className="
            absolute
            left-2
            top-1/2
            -translate-y-1/2
            z-10
            w-9
            h-9
            rounded-full
            bg-white
            shadow-md
            border
            border-slate-200
            flex
            items-center
            justify-center
            hover:bg-slate-50
            hover:scale-105
            transition
          "
        >
          <ChevronLeftIcon
            sx={{
              color: "#2563eb",
              fontSize: 20,
            }}
          />
        </button>

        {/* Right Arrow */}
        <button
          type="button"
          onClick={() => scrollByImage(1)}
          aria-label="Scroll gallery right"
          className="
            absolute
            right-2
            top-1/2
            -translate-y-1/2
            z-10
            w-9
            h-9
            rounded-full
            bg-white
            shadow-md
            border
            border-slate-200
            flex
            items-center
            justify-center
            hover:bg-slate-50
            hover:scale-105
            transition
          "
        >
          <ChevronRightIcon
            sx={{
              color: "#2563eb",
              fontSize: 20,
            }}
          />
        </button>

        {/* Left Fade */}
        <div
          className="
            pointer-events-none
            absolute
            left-0
            top-0
            bottom-0
            w-12
            bg-gradient-to-r
            from-white
            to-transparent
            z-[5]
          "
        />

        {/* Right Fade */}
        <div
          className="
            pointer-events-none
            absolute
            right-0
            top-0
            bottom-0
            w-12
            bg-gradient-to-l
            from-white
            to-transparent
            z-[5]
          "
        />

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="
            gallery-scroll
            flex
            gap-3
            overflow-x-auto
            scroll-smooth
            px-6 sm:px-10
            pb-2
          "
        >
          {GALLERY_IMAGES.map((src, i) => (
            <div
              key={i}
              className="
                w-[160px] sm:w-[220px]
                h-28 sm:h-32
                rounded-xl
                overflow-hidden
                shrink-0
                bg-slate-100
                shadow-sm
                border
                border-slate-100
                group
              "
            >
              <img
                src={src}
                alt={`KGurukul moment ${i + 1}`}
                className="
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* View More Button */}
      <div className="flex justify-center mt-8">
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon fontSize="small" />}
          sx={{
            borderRadius: 999,
            px: 3,
            py: 1.1,
            bgcolor: "#ec4899",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(236,72,153,0.25)",
            "&:hover": {
              bgcolor: "#db2777",
            },
          }}
        >
          View More Photos
        </Button>
      </div>
    </section>
  );
}