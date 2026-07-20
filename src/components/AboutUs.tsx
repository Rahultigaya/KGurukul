import { useState } from "react";
import aboutUsImg from "../assets/about-us-img.png";

type Teacher = {
    id: number;
    name: string;
    role: string;
    image: string;
    education: string;
    bio: string;
};

const TEACHERS: Teacher[] = [
    {
        id: 1,
        name: "Santosh Chipdey",
        role: "Founder & Lead Educator",
        image: "/sir.png",
        education: "M.Sc. Computer Science, B.Ed.",
        bio: "30+ years of experience in teaching programming and computer science. Passionate about making complex concepts simple and engaging for students.",
    },
    {
        id: 2,
        name: "Riya Chipdey",
        role: "Co-Founder & Management",
        image: "/maam.png",
        education: "M.Sc. Mathematics, NET Qualified",
        bio: "Expert in competitive exam preparation with a track record of 100% results. Specializes in calculus, algebra, and statistics.",
    },
];

const INTRO_PARAGRAPHS = [
    "We are dedicated to providing high-quality education and personalized guidance to help every student achieve their academic goals. Our experienced teachers focus on creating a positive learning environment where students can strengthen their concepts, improve problem-solving skills, and develop confidence in their abilities. We believe that every student has unique potential, and our teaching approach is designed to support individual learning needs.",
    "Our coaching classes emphasize discipline, consistency, and continuous improvement. Through regular lectures, practice sessions, assessments, and performance tracking, we help students stay on the right path throughout their academic journey. Parents are also kept informed about attendance, progress, and overall development, ensuring a strong partnership between teachers and families.",
];

const TeacherCard = ({
    teacher,
    flipped,
    onToggle,
}: {
    teacher: Teacher;
    flipped: boolean;
    onToggle: (id: number | null) => void;
}) => (
    <div
        className="relative h-80 md:h-96 cursor-pointer perspective-1000"
        onClick={() => onToggle(flipped ? null : teacher.id)}
        onMouseEnter={() => window.innerWidth >= 768 && onToggle(teacher.id)}
        onMouseLeave={() => window.innerWidth >= 768 && onToggle(null)}
    >
        <div
            className="relative w-full h-full transition-transform duration-700 ease-in-out"
            style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
            {/* FRONT */}
            <div
                className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(60,64,67,0.15),0_1px_2px_rgba(60,64,67,0.1)]"
                style={{ backfaceVisibility: "hidden" }}
            >
                <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 border-2 border-[#1A73E8]/20 rounded-2xl" />

                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                    <h4 className="text-xl md:text-2xl font-bold mb-1">{teacher.name}</h4>
                    <p className="text-[#8AB4F8] text-sm md:text-base font-medium">{teacher.role}</p>
                </div>

                <div className="absolute top-3 right-3 md:hidden bg-white/30 backdrop-blur-sm rounded-full p-2 animate-pulse">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                </div>
            </div>

            {/* BACK */}
            <div
                className="absolute inset-0 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(60,64,67,0.15),0_1px_2px_rgba(60,64,67,0.1)] bg-white text-[#202124] p-4 md:p-8 flex flex-col justify-center border border-[#E8EAED]"
                style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
            >
                <div className="text-center space-y-3 md:space-y-6">
                    <div className="relative mx-auto w-20 h-20 md:w-24 md:h-24">
                        <img
                            src={teacher.image}
                            alt={teacher.name}
                            className="w-full h-full object-cover rounded-full ring-2 ring-[#1A73E8] shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#34A853] rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xl md:text-2xl font-bold mb-1 text-[#1A73E8]">{teacher.name}</h4>
                        <p className="text-[#5F6368] text-sm md:text-base font-medium mb-3 md:mb-4">{teacher.role}</p>

                        <div className="mb-3 md:mb-4">
                            <div className="flex items-center justify-center gap-2 mb-1 md:mb-2">
                                <svg className="w-4 h-4 md:w-5 md:h-5 text-[#1A73E8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                </svg>
                                <span className="text-xs md:text-sm font-semibold">Education</span>
                            </div>
                            <p className="text-[#5F6368] text-xs md:text-sm px-2">{teacher.education}</p>
                        </div>

                        <p className="text-[#80868B] text-xs md:text-sm leading-relaxed px-2">{teacher.bio}</p>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[#80868B] text-xs pt-2">
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Tap to flip back</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const About = () => {
    const [flippedId, setFlippedId] = useState<number | null>(null);

    return (
        <section id="about" className="w-full py-16 md:py-20 px-4 md:px-6 bg-[#F6F9FE]">
            <div className="max-w-7xl mx-auto">

                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">
                    <p className="text-[#1A73E8] uppercase tracking-widest text-xs md:text-sm mb-3 md:mb-4">Who We Are</p>
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight text-[#202124] mb-4">
                        About <span className="text-[#1A73E8]">Us</span>
                    </h2>
                    <div className="w-16 h-1 bg-[#1A73E8] rounded-full mx-auto" />
                </div>

                {/* About Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center mb-16 md:mb-20">
                    <div className="relative group">
                        <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-tr from-[#1A73E8]/10 to-[#34A853]/10 blur-xl md:blur-2xl opacity-40 group-hover:opacity-70 transition duration-500" />
                        <img src={aboutUsImg} alt="About Us" className="relative w-full object-cover" />
                    </div>

                    <div className="text-[#202124] space-y-4 md:space-y-6">
                        {INTRO_PARAGRAPHS.map((text, i) => (
                            <p key={i} className="text-[#5F6368] leading-relaxed text-base md:text-lg">{text}</p>
                        ))}
                        <p className="text-[#80868B] leading-relaxed text-sm md:text-base">
                            With structured guidance, personal attention, and continuous evaluation, we ensure that every learner reaches their maximum potential — academically and personally.
                        </p>
                    </div>
                </div>

                {/* Teachers Section */}
                <div className="mt-16 md:mt-20">
                    <div className="text-center mb-8 md:mb-12">
                        <h3 className="text-2xl md:text-4xl font-bold text-[#202124] mb-3 md:mb-4">
                            Meet Our <span className="text-[#1A73E8]">Expert Teachers</span>
                        </h3>
                        <p className="text-[#5F6368] max-w-4xl mx-auto text-sm md:text-base px-4">
                            Meet the dedicated mentors who inspire confidence, nurture potential, and help every student achieve success.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto px-4">
                        {TEACHERS.map((teacher) => (
                            <TeacherCard
                                key={teacher.id}
                                teacher={teacher}
                                flipped={flippedId === teacher.id}
                                onToggle={setFlippedId}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default About;