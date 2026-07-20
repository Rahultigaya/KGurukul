import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SiPython, SiCoffeescript } from "react-icons/si";
import { FiCode, FiGlobe } from "react-icons/fi";
import Product from "../Cources";
import { reviews as fetchReviewsAPI } from "../api/api";
import whatsappBg from "../assets/whatsapp-bg-img.jpg";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TODAY = new Date().getDay();
const COURSE_ICONS = [FiCode, SiCoffeescript, SiPython, FiGlobe];
const SCROLL_STEP = 340;
const AUTO_SCROLL_MS = 2000;
const RESUME_AFTER_INTERACTION_MS = 3000;

type Review = {
    name?: string;
    org?: string;
    messages?: string | string[];
    message?: string | string[];
    text?: string | string[];
    review?: string | string[];
    content?: string | string[];
};

// Fallback data shown whenever the reviews API fails or returns nothing —
// remove this once the backend is wired up for real.
const DUMMY_REVIEWS: Review[] = [
    {
        name: "Ananya Sharma",
        org: "Parent, Std IX",
        messages: [
            "My son's grades improved so much this term!",
            "The teachers actually explain concepts, not just rush through the syllabus."
        ],
    },
    {
        name: "Rohan Mehta",
        org: "Student, Std X",
        messages: [
            "Java classes are super clear.",
            "I finally understand loops and OOP properly 🙌"
        ],
    },
    {
        name: "Priya Nair",
        org: "Parent, Std VIII",
        messages: [
            "Great support outside class hours too.",
            "Doubt sessions are honestly a lifesaver before exams."
        ],
    },
    {
        name: "Karan Verma",
        org: "Student, Std XII",
        messages: [
            "Python course helped me build my first project.",
            "Would recommend to anyone starting out."
        ],
    },
    {
        name: "Sneha Patil",
        org: "Student, Std XI",
        messages: [
            "The regular tests helped me identify my weak areas.",
            "My confidence has grown a lot after joining these classes."
        ],
    },
    {
        name: "Amit Joshi",
        org: "Parent, Std X",
        messages: [
            "The teachers keep parents updated about attendance and progress.",
            "We're very happy with the personalized attention given to our daughter."
        ],
    },
    {
        name: "Neha Kulkarni",
        org: "Student, Std IX",
        messages: [
            "Every concept is explained with simple examples.",
            "The friendly environment makes learning enjoyable and stress-free."
        ],
    },
];
const NavArrowButton = ({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`group absolute ${direction === "left" ? "left-0 md:left-1" : "right-0 md:right-1"} top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white hover:bg-[#1A73E8] border-2 border-[#DADCE0] hover:border-[#1A73E8] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300`}
        aria-label={`Scroll ${direction}`}
    >
        <svg className="w-5 h-5 text-[#5F6368] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
        </svg>
    </button>
);

const CourseCard = ({ product, Icon, onLearnMore }: { product: (typeof Product)[number]; Icon: typeof FiCode; onLearnMore: () => void }) => {
    const details = product.details.split(",").map((d) => d.trim());
    const previewCount = 2;

    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(60,64,67,0.15),0_1px_2px_rgba(60,64,67,0.1)] transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-1.5 border border-[#E8EAED] hover:border-[#1A73E8]/40 cursor-pointer flex flex-col">

            {/* Top accent bar — animates into a gradient sweep on hover */}
            <div className="h-1.5 w-full bg-[#1A73E8] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#1A73E8] via-[#4C9AFF] to-[#1A73E8] bg-[length:200%_100%] opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_1.5s_linear_infinite] transition-opacity duration-300" />
            </div>

            {/* Decorative corner glow for depth */}
            <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#1A73E8]/5 group-hover:bg-[#1A73E8]/10 blur-2xl transition-colors duration-500" />

            <div className="p-5 relative z-10 flex flex-col flex-1">

                {/* Header row: icon + badge balanced side-by-side */}
                <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-[#1A73E8] flex items-center justify-center shadow-lg shadow-[#1A73E8]/20 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                        <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1A73E8]/10 text-[#1A73E8] border border-[#1A73E8]/20">
                        {product.class}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-[#202124] mb-1 group-hover:text-[#1A73E8] transition-colors">{product.name}</h3>
                <p className="text-sm text-[#5F6368] mb-4">{product.description}</p>

                {/* Divider that grows on hover — a small signature touch */}
                <div className="h-px w-8 bg-[#DADCE0] group-hover:w-full group-hover:bg-[#1A73E8]/30 transition-all duration-500 mb-4" />

                {/* Details: preview always visible, rest slides in on hover — no dead space */}
                <div className="flex-1">
                    <p className="text-xs font-semibold text-[#1A73E8] uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span className="w-4 h-px bg-[#1A73E8]" />
                        What you'll get
                        <span className="ml-auto normal-case font-medium text-[#5F6368] tracking-normal">{details.length} items</span>
                    </p>
                    <ul className="space-y-1.5">
                        {details.slice(0, previewCount).map((detail, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-[#5F6368]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8] mt-1.5 shrink-0" />
                                {detail}
                            </li>
                        ))}
                    </ul>

                    {details.length > previewCount && (
                        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out">
                            <ul className="overflow-hidden space-y-1.5">
                                {details.slice(previewCount).map((detail, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-[#5F6368] pt-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8] mt-1.5 shrink-0" />
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {details.length > previewCount && (
                        <p className="text-[11px] text-[#1A73E8] font-medium mt-2 group-hover:opacity-0 transition-opacity duration-200">
                            +{details.length - previewCount} more
                        </p>
                    )}
                </div>

                <button
                    onClick={onLearnMore}
                    className="w-full mt-4 bg-[#1A73E8] text-white py-2.5 px-4 rounded-xl font-semibold text-sm hover:bg-[#1765CC] hover:shadow-lg hover:shadow-[#1A73E8]/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                >
                    <span>Learn More</span>
                    <svg className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

// NOTE: chat bubble colors below intentionally kept as WhatsApp's own light-mode palette, not part of the site theme
const ReviewCard = ({ review }: { review: Review }) => {
    const raw = review.messages || review.message || review.text || review.review || review.content || [];
    const messages = Array.isArray(raw) ? raw : [raw];

    return (
        <div className="min-w-[280px] max-w-[280px] rounded-2xl shadow-2xl overflow-hidden flex flex-col border ">
            <div className="bg-[#008069] text-white px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
                    {review.name?.charAt(0) || "?"}
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-sm">{review.name || "Anonymous"}</p>
                    <p className="text-[10px] text-white/70">{review.org || "N/A"}</p>
                </div>
                <div className="flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-white/70" />
                    <span className="w-1 h-1 rounded-full bg-white/70" />
                    <span className="w-1 h-1 rounded-full bg-white/70" />
                </div>
            </div>

            <div
                className="flex-1 p-4 min-h-[220px] space-y-2 bg-[#E5DDD5]"
                style={{
                    backgroundImage: `url(${whatsappBg})`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "contain",
                }}
            >
                {messages.length > 0 ? (
                    messages.map((msg, idx) => (
                        <div key={idx} className="relative flex pl-2">
                            {/* Tail — attached flush to the bubble, curved like real WhatsApp */}
                            <svg
                                className="absolute left-0 top-0 w-[9px] h-[13px] text-[#D9FDD3]"
                                viewBox="0 0 9 13"
                                fill="currentColor"
                            >
                                <path d="M0 0h9v13c0-5-2.5-9-9-13z" />
                            </svg>

                            <div className="max-w-[85%] bg-[#D9FDD3] pl-3 pr-2 py-1.5 rounded-lg rounded-tl-none text-[#111B21] shadow-sm">
                                <span className="text-sm leading-snug align-bottom">{msg}</span>
                                <span className="inline-flex items-center gap-1 float-right mt-1 ml-2 translate-y-1">
                                    <span className="text-[10px] text-[#667781] whitespace-nowrap">
                                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                    <svg className="w-3.5 h-3.5 text-[#53bdeb]" fill="currentColor" viewBox="0 0 16 15">
                                        <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-[#3B4A54]/70 text-sm">No message</p>
                )}
            </div>

            <div className="bg-white px-3 py-2 flex items-center gap-2 border-t border-[#E9EDEF]">
                <span className="text-[#8696A0] text-lg">😊</span>
                <div className="flex-1 bg-[#F0F2F5] rounded-full px-4 py-2 text-xs text-[#8696A0]">Type a message...</div>
                <span className="text-[#008069] text-lg">➤</span>
            </div>
        </div>
    );
};

const Services = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isAutoScrollingRef = useRef(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetchReviewsAPI();
                const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
                setReviews(data.length > 0 ? data : DUMMY_REVIEWS);
            } catch (error) {
                console.error("Error fetching reviews, showing dummy data:", error);
                setReviews(DUMMY_REVIEWS);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Auto-scroll reviews — always resumes from current scrollLeft, never resets
    useEffect(() => {
        const interval = setInterval(() => {
            if (isPaused) return;
            const el = scrollRef.current;
            if (!el) return;
            const maxScroll = el.scrollWidth - el.clientWidth;
            const next = el.scrollLeft + SCROLL_STEP;
            isAutoScrollingRef.current = true;
            el.scrollTo({ left: next >= maxScroll ? 0 : next, behavior: "smooth" });
        }, AUTO_SCROLL_MS);
        return () => clearInterval(interval);
    }, [isPaused]);

    useEffect(() => {
        return () => {
            if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
        };
    }, []);

    const scheduleResume = (delay = RESUME_AFTER_INTERACTION_MS) => {
        if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
        resumeTimeoutRef.current = setTimeout(() => setIsPaused(false), delay);
    };

    // Fires on every scroll — wheel, trackpad, drag, touch, or auto-scroll itself.
    // Debounced: only resumes a couple seconds after the LAST scroll event,
    // so it always continues from wherever the user actually stopped.
    const handleScroll = () => {
        if (isAutoScrollingRef.current) {
            // This scroll event was caused by our own auto-scroll tick — ignore it,
            // don't treat it as "user interaction" or reset the resume timer.
            isAutoScrollingRef.current = false;
            return;
        }
        setIsPaused(true);
        scheduleResume();
    };

    const scrollBy = (delta: number) => {
        setIsPaused(true);
        scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
        scheduleResume();
    };

    return (
        <section className="w-full bg-[#F8F9FA]  px-4">
            <div className="max-w-7xl mx-auto space-y-4">

                {/* Student Support Stats */}
                <div className="flex justify-center">
                    <div className="bg-white border border-[#E8EAED] rounded-2xl px-6 md:px-10 py-6 md:py-8 flex flex-col md:flex-row items-center gap-6 md:gap-10 shadow-[0_1px_3px_rgba(60,64,67,0.15),0_1px_2px_rgba(60,64,67,0.1)]">
                        <div className="text-center">
                            <div className="flex items-end justify-center gap-2 mb-2">
                                <span className="text-4xl md:text-5xl font-extrabold text-[#1A73E8]">24</span>
                                <span className="text-base md:text-lg text-[#202124] pb-1">X</span>
                            </div>
                            <div className="flex gap-0.5 md:gap-1 justify-center mb-2">
                                {DAYS.map((day, i) => (
                                    <span
                                        key={day}
                                        className={`text-[10px] md:text-xs px-1.5 md:px-2 py-1 rounded-md transition ${i === TODAY ? "bg-[#1A73E8] text-white font-semibold scale-110" : "bg-[#F1F3F4] text-[#5F6368]"}`}
                                    >
                                        {day}
                                    </span>
                                ))}
                            </div>
                            <p className="text-xs md:text-sm text-[#5F6368] tracking-wide">Student Support</p>
                        </div>

                        <div className="hidden md:block w-px h-20 bg-[#DADCE0]" />
                        <div className="md:hidden w-20 h-px bg-[#DADCE0]" />

                        <div className="text-center">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#202124] mb-1">100%</h2>
                            <p className="text-xs md:text-sm text-[#5F6368] tracking-wide">Results Every Year</p>
                        </div>
                    </div>
                </div>

                {/* Courses */}
                <div>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#202124] mb-3">Our Popular Courses</h2>
                        <p className="text-[#5F6368] text-sm md:text-base max-w-2xl mx-auto">
                            Explore our well-structured courses designed to build strong concepts and academic excellence
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-start">
                        {Product.map((product, index) => (
                            <CourseCard
                                key={product.name}
                                product={product}
                                Icon={COURSE_ICONS[index % COURSE_ICONS.length]}
                                onLearnMore={() => navigate("/auth/login")}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <section className="w-full bg-white py-16 md:py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8 md:mb-10">
                        <h2 className="text-2xl md:text-4xl font-semibold text-[#202124] mb-3">What Parents & Students Say</h2>
                        <p className="text-[#5F6368] text-sm md:text-base">Real experiences and honest feedback from our students and parents</p>
                    </div>

                    <div className="relative">
                        <NavArrowButton direction="left" onClick={() => scrollBy(-SCROLL_STEP)} />
                        <NavArrowButton direction="right" onClick={() => scrollBy(SCROLL_STEP)} />

                        <div
                            ref={scrollRef}
                            onScroll={handleScroll}
                            className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth py-2 px-14 md:px-16"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
                        >
                            {reviews.length > 0 ? (
                                reviews.map((review, i) => <ReviewCard key={i} review={review} />)
                            ) : (
                                <p className="text-[#5F6368] text-center py-8 w-full">
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

