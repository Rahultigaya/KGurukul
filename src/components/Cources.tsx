import { useState, useEffect, useRef } from "react";
import Product from "../Cources";
import { useNavigate } from "react-router-dom";
import { SiPython, SiCoffeescript } from "react-icons/si";
import { FiCode, FiGlobe } from "react-icons/fi";
// import reviews from "../review";
import { reviews as fetchReviewsAPI } from "../api/api";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const today = new Date().getDay();

const Services = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([] as any[]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            console.log("Fetching reviews from API...");
            const res = await fetchReviewsAPI();
            console.log("Full API Response:", res);
            console.log("Response data:", res.data);
            console.log("Response type:", typeof res);

            // Handle different response structures
            let reviewsData: any[] = [];
            if (res && Array.isArray(res.data)) {
                reviewsData = res.data;
            } else if (Array.isArray(res)) {
                reviewsData = res;
            }

            console.log("Setting reviews:", reviewsData);
            console.log("Reviews length:", reviewsData.length);
            setReviews(reviewsData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            const err = error as { message?: string; response?: unknown };
            console.error("Error message:", err.message);
            console.error("Error response:", err.response);
            setReviews([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll reviews every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollContainerRef.current) {
                const cardWidth = 300; // Card width + gap
                const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
                const currentScroll = scrollContainerRef.current.scrollLeft;
                const nextScroll = currentScroll + cardWidth;

                if (nextScroll >= maxScroll) {
                    scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                    scrollContainerRef.current.scrollTo({ left: nextScroll, behavior: "smooth" });
                }
            }
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            const cardWidth = 300;
            scrollContainerRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const cardWidth = 300;
            scrollContainerRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
    };

    return (
        <section className="w-full bg-gradient-to-br from-slate-900 via-gray-900 to-black py-16 px-4">
            <div className="max-w-7xl mx-auto space-y-16">

                {/* ================= STUDENT SUPPORT ================= */}
                <div className="flex justify-center">
                    <div
                        className="
              backdrop-blur-md bg-white/5
              border border-white/10
              rounded-2xl
              px-6 md:px-10 py-6 md:py-8
              flex flex-col md:flex-row items-center gap-6 md:gap-10
              shadow-xl
            "
                    >
                        {/* 24x7 */}
                        <div className="text-center">
                            <div className="flex items-end justify-center gap-2 mb-2">
                                <span className="text-4xl md:text-5xl font-extrabold text-[#c6d740]">
                                    24
                                </span>
                                <span className="text-base md:text-lg text-white pb-1">
                                    X
                                </span>
                            </div>

                            <div className="flex gap-0.5 md:gap-1 justify-center mb-2">
                                {days.map((day, i) => (
                                    <span
                                        key={day}
                                        className={`
                      text-[10px] md:text-xs px-1.5 md:px-2 py-1 rounded-md
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

                            <p className="text-xs md:text-sm text-white/80 tracking-wide">
                                Student Support
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px h-20 bg-white/30" />
                        <div className="md:hidden w-20 h-px bg-white/30" />

                        {/* Results */}
                        <div className="text-center">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-1">
                                100%
                            </h2>
                            <p className="text-xs md:text-sm text-white/80 tracking-wide">
                                Results Every Year
                            </p>
                        </div>
                    </div>
                </div>

                {/* ================= COURSES CARDS ================= */}
                <div>
                    {/* Section Header */}
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                            Our Popular Courses
                        </h2>
                        <p className="text-white/70 text-sm md:text-base max-w-2xl mx-auto">
                            Industry-relevant curriculum designed to help you master in-demand skills
                        </p>
                    </div>

                    {/* Course Cards Grid */}
                    <div
                        className="
                            grid grid-cols-1
                            sm:grid-cols-2
                            lg:grid-cols-4
                            gap-4 md:gap-6
                        "
                    >
                        {Product.map((product, index) => {
                            const detailsList = product.details.split(",").map(d => d.trim());
                            return (
                            <div
                                key={index}
                                className="
                                    group
                                    relative
                                    bg-gradient-to-br from-slate-800/90 to-slate-700/90
                                    backdrop-blur-sm
                                    rounded-2xl
                                    overflow-hidden
                                    shadow-lg
                                    transition-all duration-500 ease-out
                                    hover:shadow-2xl hover:scale-[1.03]
                                    hover:from-purple-900/95 hover:to-blue-900/95
                                    border border-white/10
                                    hover:border-purple-500/30
                                    cursor-pointer
                                "
                            >
                                {/* Gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                {/* Top accent bar */}
                                <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 group-hover:from-purple-400 group-hover:via-blue-400 group-hover:to-purple-400 transition-all duration-500" />

                                <div className="p-5 relative z-10">
                                    {/* Class Badge */}
                                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border border-purple-500/30 mb-3">
                                        {product.class}
                                    </span>

                                    {/* Icon */}
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                        {index === 0 ? (
                                            <FiCode className="w-7 h-7 text-white" />
                                        ) : index === 1 ? (
                                            <SiCoffeescript className="w-7 h-7 text-white" />
                                        ) : index === 2 ? (
                                            <SiPython className="w-7 h-7 text-white" />
                                        ) : (
                                            <FiGlobe className="w-7 h-7 text-white" />
                                        )}
                                    </div>

                                    {/* Course Name */}
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-200 transition-colors">
                                        {product.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-slate-300 mb-4">
                                        {product.description}
                                    </p>

                                    {/* Details - shown on hover */}
                                    <div className="overflow-hidden transition-all duration-500 ease-out">
                                        <div className="max-h-0 group-hover:max-h-48 transition-all duration-500 ease-out">
                                            <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <span className="w-4 h-px bg-purple-400" />
                                                What you'll get
                                            </p>
                                            <ul className="space-y-1.5">
                                                {detailsList.map((detail, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                                        {detail}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <button
                                        className="w-full mt-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2.5 px-4 rounded-xl font-semibold text-sm hover:from-purple-400 hover:to-blue-400 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                                        onClick={() => navigate('/auth/login')}
                                    >
                                        <span>Learn More</span>
                                        <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Decorative corner elements */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full group-hover:from-purple-500/20 transition-all duration-500" />
                                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full group-hover:from-blue-500/20 transition-all duration-500" />
                            </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            {/* ================= WHATSAPP CHAT REVIEWS - DARK THEME ================= */}
            <section className="w-full bg-gradient-to-br from-slate-900 via-gray-900 to-black py-16 md:py-20 px-4">
                <div className="max-w-7xl mx-auto">

                    {/* Heading */}
                    <div className="text-center mb-8 md:mb-10">
                        <h2 className="text-2xl md:text-4xl font-semibold text-white mb-3">
                            What Parents & Students Say
                        </h2>
                        <p className="text-white/70 text-sm md:text-base">
                            Real experiences from our community
                        </p>
                    </div>

                    {/* Reviews Container with Navigation */}
                    <div className="relative">
                        {/* Navigation Buttons */}
                        <button
                            onClick={scrollLeft}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
                            aria-label="Scroll left"
                        >
                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={scrollRight}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
                            aria-label="Scroll right"
                        >
                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Reviews Scroll Container - All reviews visible */}
                        <div
                            ref={scrollContainerRef}
                            className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth px-2"
                            style={{
                                scrollbarWidth: 'none' as const,
                                msOverflowStyle: 'none' as const,
                            }}
                        >
                            {reviews?.length > 0 ? (
                                reviews.map((review, i) => {
                                    console.log(`Review ${i}:`, review);

                                    // Try different possible message field names
                                    const messages = review.messages || review.message || review.text || review.review || review.content || [];
                                    const messagesArray = Array.isArray(messages) ? messages : [messages];
                                    console.log(`Messages for review ${i}:`, messagesArray);

                                    return (
                                        <div
                                            key={i}
                                            className="
                                        min-w-[280px] max-w-[280px]
                                        bg-[#0b141a]
                                        rounded-2xl
                                        shadow-2xl
                                        overflow-hidden
                                        flex flex-col
                                        border border-[#1f2c34]
                                    "
                                        >
                                            {/* Header - Dark WhatsApp Theme */}
                                            <div className="bg-[#1f2c34] text-white px-4 py-3 flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-lg font-bold">
                                                    {review.name?.charAt(0) || "?"}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-sm">{review.name || "Anonymous"}</p>
                                                    <p className="text-[10px] text-slate-400">{review.org || "N/A"}</p>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    <span className="w-1 h-1 rounded-full bg-white/60"></span>
                                                    <span className="w-1 h-1 rounded-full bg-white/60"></span>
                                                    <span className="w-1 h-1 rounded-full bg-white/60"></span>
                                                </div>
                                            </div>

                                            {/* Chat Body - Dark Theme */}
                                            <div
                                                className="
                                            bg-[#0b141a]
                                            flex-1
                                            p-4
                                            min-h-[220px]
                                            space-y-3
                                        "
                                            >
                                                {messagesArray && messagesArray.length > 0 ? (
                                                    messagesArray.map((msg, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="
                                                    max-w-[90%]
                                                    bg-[#005c4b]
                                                    px-4 py-2.5
                                                    rounded-2xl
                                                    text-sm
                                                    text-white
                                                    shadow-md
                                                    relative
                                                "
                                                        >
                                                            {msg}

                                                            {/* WhatsApp checkmarks */}
                                                            <div className="absolute -right-5 -bottom-1 flex gap-0.5">
                                                                <svg className="w-3 h-3 text-[#53bdeb]" fill="currentColor" viewBox="0 0 16 15">
                                                                    <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
                                                                </svg>
                                                            </div>

                                                            {/* Bubble Tail - Left */}
                                                            <span
                                                                className="
                                                        absolute left-[-6px] top-3
                                                        w-0 h-0
                                                        border-t-[6px] border-t-transparent
                                                        border-b-[6px] border-b-transparent
                                                        border-r-[6px] border-r-[#005c4b]
                                                    "
                                                            />
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-white/70 text-sm">No message</p>
                                                )}
                                            </div>

                                            {/* Footer - Input Area */}
                                            <div className="bg-[#1f2c34] px-3 py-2 flex items-center gap-2">
                                                <span className="text-slate-400 text-lg">😊</span>
                                                <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 text-xs text-slate-400">
                                                    Type a message...
                                                </div>
                                                <span className="text-emerald-500 text-lg">➤</span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-white/70 text-center py-8 w-full">
                                    {loading ? "Loading reviews..." : "No reviews available"}
                                </p>
                            )}
                        </div>
                    </div>

                </div>
            </section>
        </section>

    );
};

export default Services;