import React from "react";
import Product from "../Cources";
import reviews from "../review";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const today = new Date().getDay();

const Services = () => {
    return (
        <section className="w-full bg-hero py-16 px-4">
            <div className="max-w-7xl mx-auto space-y-16">

                {/* ================= STUDENT SUPPORT ================= */}
                <div className="flex justify-center">
                    <div
                        className="
              backdrop-blur-md bg-white/10
              border border-white/20
              rounded-2xl
              px-10 py-8
              flex flex-col md:flex-row items-center gap-10
              shadow-xl
            "
                    >
                        {/* 24x7 */}
                        <div className="text-center">
                            <div className="flex items-end justify-center gap-2 mb-2">
                                <span className="text-5xl font-extrabold text-[#c6d740] font-size: 3.6rem;">
                                    24
                                </span>
                                <span className="text-lg text-white pb-1">
                                    X
                                </span>
                            </div>

                            <div className="flex gap-1 justify-center mb-2">
                                {days.map((day, i) => (
                                    <span
                                        key={day}
                                        className={`
                      text-xs px-2 py-1 rounded-md
                      ${i === today
                                                ? "bg-white text-black font-semibold scale-110"
                                                : "bg-white/20 text-white/80"
                                            }
                      transition
                    `}
                                    >
                                        {day}
                                    </span>
                                ))}
                            </div>

                            <p className="text-sm text-white/80 tracking-wide">
                                Student Support
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px h-20 bg-white/30" />
                        <div className="md:hidden w-24 h-px bg-white/30" />

                        {/* Results */}
                        <div className="text-center">
                            <h2 className="text-4xl font-extrabold text-white mb-1">
                                100%
                            </h2>
                            <p className="text-sm text-white/80 tracking-wide">
                                Results Every Year
                            </p>
                        </div>
                    </div>
                </div>

                {/* ================= SERVICES CARDS ================= */}
                <div
                    className="
            grid grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-6
          "
                >
                    {Product.map((product, index) => (
                        <div
                            key={index}
                            className="
                bg-white
                rounded-xl
                p-6
                flex flex-col items-center text-center
                shadow-md
                transition-all duration-300 ease-out
                hover:-translate-y-2 hover:shadow-2xl
              "
                        >
                            {/* IMAGE */}
                            <div className="h-10 w-full flex items-center justify-center mb-4">
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="h-full object-contain"
                                />
                            </div>

                            {/* TEXT */}
                            <h3 className="text-lg font-semibold text-gray-900">
                                {product.name}
                            </h3>

                            <p className="text-sm text-gray-600 italic mt-1">
                                {product.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
            {/* WhatsApp Chat Review */}
            <section className="w-full bg-hero py-20 px-4">
                <div className="max-w-7xl mx-auto">

                    {/* Heading */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-semibold text-white">
                            What Parents & Students Say
                        </h2>
                    </div>

                    {/* Reviews */}
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                        {reviews.map((review, i) => (
                            <div
                                key={i}
                                className="
                min-w-[280px] max-w-[280px]
                bg-white rounded-xl
                shadow-xl
                overflow-hidden
                flex flex-col
              "
                            >
                                {/* Header */}
                                <div className="bg-emerald-700 text-white px-4 py-3">
                                    <p className="font-semibold text-sm">{review.name}</p>
                                    <p className="text-xs opacity-80">{review.org}</p>
                                </div>

                                {/* Chat Body */}
                                <div
                                    className="
                  bg-[#efeae2]
                  bg-[url('https://www.transparenttextures.com/patterns/food.png')]
                  flex-1
                  p-4
                  space-y-3
                  overflow-y-auto
                "
                                >
                                    {review.messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className="
                      max-w-[85%]
                      bg-white
                      px-3 py-2
                      rounded-lg
                      text-sm
                      shadow
                      relative
                      animate-fadeIn
                    "
                                        >
                                            {msg}

                                            {/* Bubble Tail */}
                                            <span
                                                className="
                        absolute left-[-6px] top-3
                        w-0 h-0
                        border-t-[6px] border-t-transparent
                        border-b-[6px] border-b-transparent
                        border-r-[6px] border-r-white
                      "
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </section>

    );
};

export default Services;