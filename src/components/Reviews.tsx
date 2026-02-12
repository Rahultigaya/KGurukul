import { useEffect, useRef } from "react";
import reviews from "../review";

const WhatsAppReviews = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        let scrollAmount = 0;
        const speed = 0.4;

        const scroll = () => {
            scrollAmount += speed;
            container.scrollLeft = scrollAmount;

            if (
                container.scrollLeft + container.clientWidth >=
                container.scrollWidth
            ) {
                scrollAmount = 0;
                container.scrollLeft = 0;
            }
        };

        const interval = setInterval(scroll, 20);

        // Pause on hover
        container.addEventListener("mouseenter", () =>
            clearInterval(interval)
        );

        return () => clearInterval(interval);
    }, []);

    return (
        <section
            id="reviews"
            className="w-full bg-hero py-20 px-4"
        >
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-semibold text-white text-center mb-12">
                    What Students & Parents Say 123
                </h2>

                <div
                    ref={scrollRef}
                    className="
            flex gap-6 overflow-x-auto
            scrollbar-hide
            pb-4
          "
                >
                    {reviews.map((review, i) => (
                        <div
                            key={i}
                            className="
                min-w-[280px] max-w-[280px]
                bg-white rounded-xl
                shadow-xl
                flex flex-col
              "
                        >
                            {/* Header */}
                            <div className="bg-emerald-700 text-white px-4 py-3">
                                <p className="font-semibold text-sm">{review.name}</p>
                                <p className="text-xs opacity-80">{review.org}</p>
                            </div>

                            {/* Messages */}
                            <div
                                className="
                  bg-[#efeae2]
                  bg-[url('https://www.transparenttextures.com/patterns/food.png')]
                  p-4 space-y-3 flex-1
                "
                            >
                                {review.messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className="
                      max-w-[85%]
                      bg-white px-3 py-2
                      rounded-lg text-sm
                      shadow relative
                    "
                                    >
                                        {msg}
                                        <span
                                            className="
                        absolute left-[-6px] top-3
                        border-t-[6px] border-b-[6px]
                        border-r-[6px]
                        border-t-transparent
                        border-b-transparent
                        border-r-white
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
    );
};

export default WhatsAppReviews;