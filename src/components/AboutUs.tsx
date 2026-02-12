const About = () => {
    return (
        <section
            id="about"
            className="w-full py-20 px-6 from-slate-900"
        >
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                {/* LEFT IMAGE */}
                <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 to-lime-400/20 blur-2xl opacity-40 group-hover:opacity-70 transition duration-500" />

                    <img
                        src="/about_us.png"   // replace with your image
                        alt="About Us"
                        className="relative rounded-2xl shadow-2xl w-full object-cover"
                    />
                </div>

                {/* RIGHT CONTENT */}
                <div className="text-white space-y-6">

                    {/* Small Label */}
                    <p className="text-emerald-400 uppercase tracking-widest text-sm">
                        Who We Are
                    </p>

                    {/* Big Heading */}
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                        About <span className="text-emerald-400">Us</span>
                    </h2>

                    {/* Divider */}
                    <div className="w-16 h-1 bg-emerald-400 rounded-full" />

                    {/* Paragraph */}
                    <p className="text-gray-300 leading-relaxed">
                        We are dedicated to providing exceptional academic support and
                        mentorship. Our focus is not only on results, but on building
                        confidence, clarity, and consistency in every student.
                    </p>

                    <p className="text-gray-400 leading-relaxed">
                        With structured guidance, personal attention, and continuous
                        evaluation, we ensure that every learner reaches their maximum
                        potential — academically and personally.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;