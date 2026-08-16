import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import founder_desk from "../assets/founder_desk_sir.png";

function FounderDeskImg() {
    return (
        <div className="w-full">
            <img
                src={founder_desk}
                alt="Founder Desk"
                className="w-[90%] h-[400px] object-cover object-top rounded-2xl border border-orange-100 shadow-lg" />
        </div>
    );
}

export default function FoundersDesk() {
    return (
        <section id="founders-desk" className="py-12 sm:py-16 lg:py-20">
            <div className="max-w-8xl mx-auto px-5 sm:px-6 lg:px-8">
                <div className="bg-orange-50/60 rounded-3xl border border-orange-100 shadow-sm p-6 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">



                        {/* left Content */}
                        <div className="lg:col-span-9">
                            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 leading-tight">
                                Founder's <span className="text-orange-600">Desk</span>
                            </h2>

                            <p className="text-sm font-semibold text-slate-500 mt-2 mb-5">
                                A Message from the Founder
                            </p>

                            <p className="text-[15px] text-slate-600 mb-2">
                                Education is one of the most powerful gifts we can offer to the
                                next generation. It has the ability to transform lives, build
                                confidence, and create opportunities that last a
                                <span className="font-semibold text-slate-800">
                                    {" "}lifetime
                                </span>.
                                This belief has been the foundation of my teaching journey for
                                more than 34 years.
                            </p>

                            <p className="text-[15px] text-slate-600 mb-2">
                                At KGURUKULS, we believe that every child possesses unique
                                abilities. Our role as educators is to identify those strengths,
                                nurture them with care, and inspire students to achieve
                                excellence through dedication and continuous learning.
                            </p>

                            <p className="text-[15px] text-slate-600 mb-2">
                                As we move forward, our commitment remains unchanged—to provide
                                quality education, build strong values, encourage curiosity, and
                                prepare students not only for examinations but for a lifetime of
                                learning and success.
                            </p>

                            {/* Quote Card */}
                            {/* Quote Card */}
                            <div className="relative mt-6 rounded-xl bg-gradient-to-r from-orange-50 to-white border-l-4 border-orange-500 border border-orange-100 p-5 shadow-sm">
                                <FormatQuoteIcon
                                    sx={{ fontSize: 34 }}
                                    className="absolute top-3 left-4 text-orange-300 -scale-x-100"
                                />

                                <p className="pl-8 pr-2 italic text-slate-700 text-[15px] leading-7">
                                    "A teacher's true success is measured not by lessons taught,
                                    but by the lives inspired."
                                </p>

                                <div className="mt-4 pl-8 float-end border-t border-orange-100 pt-3">
                                    <h4 className="font-semibold text-slate-900">
                                        Prof. Santosh Chipdey
                                    </h4>
                                    <p className="text-xs text-orange-600 font-medium">
                                        Founder • MCA
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* right Image */}
                        <div className="lg:col-span-3">
                            <FounderDeskImg />
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}