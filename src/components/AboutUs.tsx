import { useState } from "react";

const About = () => {
    const [flippedCard, setFlippedCard] = useState<number | null>(null);

    const teachers = [
        {
            id: 1,
            name: "Santoush Chipdey",
            role: "Founder & Lead Educator",
            image: "/teacher1.jpg", // Replace with actual image
            education: "M.Sc. Computer Science, B.Ed.",
            bio: "15+ years of experience in teaching programming and computer science. Passionate about making complex concepts simple and engaging for students."
        },
        {
            id: 2,
            name: "Riyaa Chipdey",
            role: "Co-Founder & Management",
            image: "/teacher2.jpg", // Replace with actual image
            education: "M.Sc. Mathematics, NET Qualified",
            bio: "Expert in competitive exam preparation with a track record of 100% results. Specializes in calculus, algebra, and statistics."
        }
    ];

    const handleCardInteraction = (id: number) => {
        if (flippedCard === id) {
            setFlippedCard(null);
        } else {
            setFlippedCard(id);
        }
    };

    return (
        <section
            id="about"
            className="w-full py-16 md:py-20 px-4 md:px-6 bg-gradient-to-br from-slate-900 via-gray-900 to-black"
        >
            <div className="max-w-7xl mx-auto">

                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">
                    <p className="text-emerald-400 uppercase tracking-widest text-xs md:text-sm mb-3 md:mb-4">
                        Who We Are
                    </p>
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight text-white mb-4">
                        About <span className="text-emerald-400">Us</span>
                    </h2>
                    <div className="w-16 h-1 bg-emerald-400 rounded-full mx-auto" />
                </div>

                {/* About Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center mb-16 md:mb-20">
                    {/* LEFT IMAGE */}
                    <div className="relative group">
                        <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-tr from-emerald-500/20 to-lime-400/20 blur-xl md:blur-2xl opacity-40 group-hover:opacity-70 transition duration-500" />

                        <img
                            src="/about_us.png"
                            alt="About Us"
                            className="relative w-full object-cover"
                        />
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="text-white space-y-4 md:space-y-6">
                        {/* Paragraph */}
                        <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                            We are dedicated to providing exceptional academic support and
                            mentorship. Our focus is not only on results, but on building
                            confidence, clarity, and consistency in every student.
                        </p>
                        <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                            We are dedicated to providing exceptional academic support and
                            mentorship. Our focus is not only on results, but on building
                            confidence, clarity, and consistency in every student.
                        </p>
                        <p className="text-gray-300 leading-relaxed text-base md:text-lg">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequatur molestias eligendi consequuntur totam sunt voluptate,
                            quam, deserunt ducimus aspernatur iste maiores vero voluptatibus, qui autem corrupti ipsum distinctio magnam libero.</p>

                        <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                            With structured guidance, personal attention, and continuous
                            evaluation, we ensure that every learner reaches their maximum
                            potential — academically and personally.
                        </p>
                    </div>
                </div>

                {/* Teachers Section */}
                <div className="mt-16 md:mt-20">
                    <div className="text-center mb-8 md:mb-12">
                        <h3 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">
                            Meet Our <span className="text-emerald-400">Expert Teachers</span>
                        </h3>
                        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base px-4">
                            Dedicated educators committed to bringing out the best in every student. Tap to learn !
                        </p>
                    </div>

                    {/* Teacher Cards */}
                    <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto px-4">
                        {teachers.map((teacher) => (
                            <div
                                key={teacher.id}
                                className="relative h-80 md:h-96 cursor-pointer perspective-1000"
                                onClick={() => handleCardInteraction(teacher.id)}
                                onMouseEnter={() => window.innerWidth >= 768 && setFlippedCard(teacher.id)}
                                onMouseLeave={() => window.innerWidth >= 768 && setFlippedCard(null)}
                            >
                                {/* Flip Container */}
                                <div
                                    className={`relative w-full h-full transition-transform duration-700 ease-in-out`}
                                    style={{
                                        transformStyle: "preserve-3d",
                                        transform: flippedCard === teacher.id ? "rotateY(180deg)" : "rotateY(0deg)"
                                    }}
                                >
                                    {/* FRONT - Image */}
                                    <div
                                        className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl"
                                        style={{ backfaceVisibility: "hidden" }}
                                    >
                                        <div className="relative w-full h-full bg-gradient-to-br from-slate-700 to-slate-800">
                                            {/* Placeholder Avatar if no image */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-emerald-500 to-lime-400 rounded-full flex items-center justify-center text-5xl md:text-6xl font-bold text-white shadow-2xl">
                                                    {teacher.name.split(" ").map(n => n[0]).join("")}
                                                </div>
                                            </div>

                                            {/* If you have actual images, uncomment below */}
                                            {/* <img
                                                src={teacher.image}
                                                alt={teacher.name}
                                                className="w-full h-full object-cover"
                                            /> */}

                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                            {/* Name & Role */}
                                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                                                <h4 className="text-xl md:text-2xl font-bold mb-1">{teacher.name}</h4>
                                                <p className="text-emerald-400 text-sm md:text-base font-medium">{teacher.role}</p>
                                            </div>

                                            {/* Tap hint for mobile */}
                                            <div className="absolute top-3 right-3 md:hidden bg-white/20 backdrop-blur-sm rounded-full p-2 animate-pulse">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BACK - Details */}
                                    <div
                                        className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white p-4 md:p-8 flex flex-col justify-center border border-emerald-500/20"
                                        style={{
                                            transform: "rotateY(180deg)",
                                            backfaceVisibility: "hidden"
                                        }}
                                    >
                                        {/* Content */}
                                        <div className="text-center space-y-3 md:space-y-6">
                                            {/* Small Avatar */}
                                            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-emerald-500 to-lime-400 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold mb-2 shadow-lg">
                                                {teacher.name.split(" ").map(n => n[0]).join("")}
                                            </div>

                                            <div>
                                                <h4 className="text-xl md:text-2xl font-bold mb-1 text-emerald-400">{teacher.name}</h4>
                                                <p className="text-gray-300 text-sm md:text-base font-medium mb-3 md:mb-4">{teacher.role}</p>

                                                {/* Education */}
                                                <div className="mb-3 md:mb-4">
                                                    <div className="flex items-center justify-center gap-2 mb-1 md:mb-2">
                                                        <svg className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                                        </svg>
                                                        <span className="text-xs md:text-sm font-semibold">Education</span>
                                                    </div>
                                                    <p className="text-gray-300 text-xs md:text-sm px-2">{teacher.education}</p>
                                                </div>

                                                {/* Bio */}
                                                <p className="text-gray-400 text-xs md:text-sm leading-relaxed px-2">
                                                    {teacher.bio}
                                                </p>
                                            </div>

                                            {/* Back hint */}
                                            <div className="flex items-center justify-center gap-2 text-gray-500 text-xs pt-2">
                                                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                <span>Tap to flip back</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default About;
