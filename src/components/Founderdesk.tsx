import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import founder_desk from "../assets/founder_desk_sir.png";

function FounderDeskImg() {
  return (
    <div className="w-full relative group">
      <div className="absolute inset-0 bg-orange-400/20 rounded-3xl blur-xl group-hover:bg-orange-400/30 transition-all duration-300 -z-10" />
      <img
        src={founder_desk}
        alt="Prof. Santoush P Chipdey Founder Desk"
        className="w-full h-[280px] lg:h-[440px] object-cover object-top rounded-3xl border-2 border-amber-200/80 shadow-xl transition-transform duration-500 group-hover:scale-[1.01]"
      />
    </div>
  );
}

export default function FoundersDesk() {
  return (
    <section
      id="founders-desk"
      className="relative overflow-hidden py-10 lg:py-0 lg:h-screen lg:min-h-[600px] xl:min-h-[720px] lg:flex lg:items-center bg-slate-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gradient-to-br from-amber-500/10 via-orange-50/80 to-amber-50/50 rounded-3xl border border-amber-200/60 shadow-xl p-5 sm:p-6 lg:p-8 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

            {/* Left Content */}
            <div className="lg:col-span-8 space-y-3.5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 bg-orange-100/80 px-2.5 py-0.5 rounded-full">
                  Vision & Leadership
                </span>
                <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 leading-tight mt-2.5">
                  Founder's <span className="text-orange-600">Desk</span>
                </h2>
                <p className="text-xs sm:text-sm font-extrabold text-slate-500 mt-1">
                  An Inspiring Message from Prof. Santoush P Chipdey
                </p>
              </div>

              <p className="text-xs sm:text-sm lg:text-base text-slate-700 leading-relaxed">
                Education is one of the most powerful gifts we can offer to the
                next generation. It has the ability to transform lives, build
                unshakeable confidence, and create opportunities that last a
                <span className="font-extrabold text-slate-900"> lifetime</span>.
                This core belief has been the guiding foundation of my teaching journey for
                more than 34 years.
              </p>

              <p className="text-xs sm:text-sm lg:text-base text-slate-700 leading-relaxed">
                At KGURUKUL'S, we believe that every student possesses unique
                creative and analytical abilities. Our role as educators is to identify those strengths,
                nurture them with personalized care, and inspire students to achieve
                board exam perfection through hands-on coding and continuous practice.
              </p>

              <p className="text-xs sm:text-sm lg:text-base text-slate-700 leading-relaxed">
                As we move forward, our commitment remains unchanged—to provide
                top-quality computer education, build strong values, encourage curiosity, and
                prepare students not only for examinations but for a successful career in tech.
              </p>

              {/* Quote Block */}
              <div className="relative mt-4 rounded-2xl bg-white border-l-4 border-orange-500 border border-orange-200/80 p-4 sm:p-5 shadow-md">
                <FormatQuoteIcon
                  sx={{ fontSize: 32 }}
                  className="absolute top-2.5 left-3.5 text-orange-300 -scale-x-100"
                />

                <p className="pl-7 pr-2 italic text-slate-800 font-medium text-sm sm:text-base leading-snug">
                  "A teacher's true success is measured not merely by lessons taught,
                  but by the minds inspired and careers launched."
                </p>

                <div className="mt-3.5 pl-7 flex justify-end items-center gap-3 border-t border-orange-100 pt-2.5">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      Prof. Santoush P Chipdey
                    </h4>
                    <p className="text-[10px] sm:text-xs text-orange-600 font-extrabold">
                      Founder
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-4 flex justify-center w-full">
              <FounderDeskImg />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}