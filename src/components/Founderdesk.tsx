import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import founder_desk from "../assets/founder_desk_sir.png";

function FounderDeskImg() {
  return (
    <div className="w-full relative group">
      <div className="absolute inset-0 bg-orange-400/20 rounded-3xl blur-xl group-hover:bg-orange-400/30 transition-all duration-300 -z-10" />
      <img
        src={founder_desk}
        alt="Prof. Santoush Chipdey Founder Desk"
        className="w-full h-[360px] sm:h-[420px] object-cover object-top rounded-3xl border-2 border-amber-200/80 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
      />
    </div>
  );
}

export default function FoundersDesk() {
  return (
    <section id="founders-desk" className="py-12 sm:py-16 lg:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-amber-500/10 via-orange-50/80 to-amber-50/50 rounded-3xl border border-amber-200/60 shadow-xl p-6 sm:p-8 lg:p-12 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-100/80 px-3 py-1 rounded-full">
                  Vision & Leadership
                </span>
                <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight mt-3">
                  Founder's <span className="text-orange-600">Desk</span>
                </h2>
                <p className="text-sm font-extrabold text-slate-500 mt-1">
                  A Inspiring Message from Prof. Santoush Chipdey
                </p>
              </div>

              <p className="text-base text-slate-700 leading-relaxed">
                Education is one of the most powerful gifts we can offer to the
                next generation. It has the ability to transform lives, build
                unshakeable confidence, and create opportunities that last a
                <span className="font-extrabold text-slate-900"> lifetime</span>.
                This core belief has been the guiding foundation of my teaching journey for
                more than 34 years.
              </p>

              <p className="text-base text-slate-700 leading-relaxed">
                At KGURUKUL'S, we believe that every student possesses unique
                creative and analytical abilities. Our role as educators is to identify those strengths,
                nurture them with personalized care, and inspire students to achieve
                board exam perfection through hands-on coding and continuous practice.
              </p>

              <p className="text-base text-slate-700 leading-relaxed">
                As we move forward, our commitment remains unchanged—to provide
                top-quality computer education, build strong values, encourage curiosity, and
                prepare students not only for examinations but for a successful career in tech.
              </p>

              {/* Quote Block */}
              <div className="relative mt-6 rounded-2xl bg-white border-l-4 border-orange-500 border border-orange-200/80 p-5 sm:p-6 shadow-md">
                <FormatQuoteIcon
                  sx={{ fontSize: 40 }}
                  className="absolute top-3 left-4 text-orange-300 -scale-x-100"
                />

                <p className="pl-8 pr-2 italic text-slate-800 font-medium text-base sm:text-lg leading-snug">
                  "A teacher's true success is measured not merely by lessons taught,
                  but by the minds inspired and careers launched."
                </p>

                <div className="mt-4 pl-8 flex justify-end items-center gap-3 border-t border-orange-100 pt-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Prof. Santoush Chipdey
                    </h4>
                    <p className="text-xs text-orange-600 font-extrabold">
                      Founder • M.Sc. CS, B.Ed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-4">
              <FounderDeskImg />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}