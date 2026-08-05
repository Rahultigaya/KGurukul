import Button from "@mui/material/Button";
import StarIcon from "@mui/icons-material/Star";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const TESTIMONIALS = [
  {
    quote:
      "The teachers explain concepts so clearly that my daughter actually enjoys coding now.",
    name: "Priya Sharma",
    role: "Mother",
  },
  {
    quote:
      "Very supportive staff and personal attention to each student. Highly recommended!",
    name: "Amit Patel",
    role: "Parent",
  },
  {
    quote:
      "My son improved a lot in programming. Thank you KGurukul for building his confidence.",
    name: "Neha Gupta",
    role: "Mother",
  },
];

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop",
];

export default function TestimonialsGallery() {
  return (
    <section id="gallery" className="py-20 bg-rose-50/40">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-12">
        {/* Testimonials */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8">
            What <span className="text-violet-600">Parents</span> &amp;{" "}
            <span className="text-violet-600">Students</span> Say
          </h2>

          <div className="space-y-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
              >
                <FormatQuoteIcon sx={{ color: "#a78bfa", fontSize: 22 }} />
                <p className="text-sm text-slate-600 leading-relaxed mt-1 mb-4">
                  {t.quote}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon key={i} sx={{ fontSize: 14, color: "#f59e0b" }} />
                      ))}
                    </div>
                  </div>
                  <WhatsAppIcon sx={{ color: "#22c55e" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-8">
            <span className="text-blue-600">Moments</span> at KGurukul
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {GALLERY_IMAGES.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="KGurukul moment"
                className="w-full h-28 sm:h-32 object-cover rounded-xl"
              />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon fontSize="small" />}
              sx={{
                borderRadius: 999,
                px: 3,
                bgcolor: "#ec4899",
                "&:hover": { bgcolor: "#db2777" },
              }}
            >
              View More Photos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
