import { motion } from "framer-motion";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import founder_desk from "../assets/founder_desk_sir.png";

// Parent controls the sequence; children just declare hidden/show states.
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const imageVariants = {
  hidden: { opacity: 0, x: 24, scale: 0.96 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function FounderDeskImg() {
  return (
    <motion.div variants={imageVariants} className="w-full relative group">
      <motion.div
        className="absolute inset-0 bg-orange-400/20 rounded-3xl blur-xl group-hover:bg-orange-400/30 transition-all duration-300 -z-10"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <img
        src={founder_desk}
        alt="Prof. Santoush P Chipdey Founder Desk"
        className="w-full h-[280px] lg:h-[440px] object-cover object-top rounded-3xl border-2 border-amber-200/80 shadow-xl transition-transform duration-500 group-hover:scale-[1.01]"
      />
    </motion.div>
  );
}

export default function FoundersDesk() {
  return (
    <section
      id="founders-desk"
      className="relative overflow-hidden py-10 lg:py-0 lg:h-screen lg:min-h-[600px] xl:min-h-[720px] lg:flex lg:items-center bg-slate-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="bg-gradient-to-br from-amber-500/10 via-orange-50/80 to-amber-50/50 rounded-3xl border border-amber-200/60 shadow-xl p-5 sm:p-6 lg:p-8 relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

            {/* Left Content */}
            <div className="lg:col-span-8 space-y-3.5">
              <div>
                <motion.span
                  variants={fadeUp}
                  className="text-[10px] font-bold uppercase tracking-widest text-orange-600 bg-orange-100/80 px-2.5 py-0.5 rounded-full inline-block"
                >
                  Vision & Leadership
                </motion.span>
                <motion.h2
                  variants={fadeUp}
                  className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 leading-tight mt-2.5"
                >
                  Founder's <span className="text-orange-600">Desk</span>
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  className="text-xs sm:text-sm font-extrabold text-slate-500 mt-1"
                >
                  An Inspiring Message from Prof. Santoush P Chipdey
                </motion.p>
              </div>

              <motion.p
                variants={fadeUp}
                className="text-xs sm:text-sm lg:text-base text-slate-700 leading-relaxed text-justify"
              >
                Education is one of the most powerful gifts we can offer to the
                next generation. It has the ability to transform lives, build
                unshakeable confidence, and create opportunities that last a
                <span className="font-extrabold text-slate-900"> lifetime</span>.
                This core belief has been the guiding foundation of my teaching journey for
                more than 34 years.
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="text-xs sm:text-sm lg:text-base text-slate-700 leading-relaxed text-justify"
              >
                At KGURUKUL'S, we believe that every student possesses unique
                creative and analytical abilities. Our role as educators is to identify those strengths,
                nurture them with personalized care, and inspire students to achieve
                board exam perfection through hands-on coding and continuous practice.
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="text-xs sm:text-sm lg:text-base text-slate-700 leading-relaxed text-justify"
              >
                As we move forward, our commitment remains unchanged—to provide
                top-quality computer education, build strong values, encourage curiosity, and
                prepare students not only for examinations but for a successful career in tech.
              </motion.p>

              {/* Quote Block */}
              <motion.div
                variants={fadeUp}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative mt-4 rounded-2xl bg-white border-l-4 border-orange-500 border border-orange-200/80 p-4 sm:p-5 shadow-md"
              >
                <motion.div variants={fadeIn}>
                  <FormatQuoteIcon
                    sx={{ fontSize: 32 }}
                    className="absolute top-2.5 left-3.5 text-orange-300 -scale-x-100"
                  />
                </motion.div>

                <motion.p
                  variants={fadeIn}
                  className="pl-7 pr-2 italic text-slate-800 font-medium text-sm sm:text-base leading-snug"
                >
                  "A teacher's true success is measured not merely by lessons taught,
                  but by the minds inspired and careers launched."
                </motion.p>

                <motion.div
                  variants={fadeIn}
                  className="mt-3.5 pl-7 flex justify-end items-center gap-3 border-t border-orange-100 pt-2.5"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      Prof. Santoush P Chipdey
                    </h4>
                    <p className="text-[10px] sm:text-xs text-orange-600 font-extrabold">
                      Founder
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-4 flex justify-center w-full">
              <FounderDeskImg />
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}