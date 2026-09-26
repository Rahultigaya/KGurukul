import { useState } from "react";
import emailjs from "@emailjs/browser";
import { EMAIL, CONTACT_NUMBERS, ADDRESS, BRANCH_ADDRESS } from '../Constant';
import { useTheme } from "../context/ThemeContext";

const Contact = () => {
    const { isDark } = useTheme();
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [focused, setFocused] = useState<string | null>(null);

    const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        emailjs
            .sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", e.currentTarget, "YOUR_PUBLIC_KEY")
            .then(() => {
                setSent(true);
                e.currentTarget.reset();
                setTimeout(() => setSent(false), 4000);
            })
            .catch(() => alert("Something went wrong 😢"))
            .finally(() => setLoading(false));
    };

    const inputBase = (name: string) =>
        `w-full bg-transparent border-b-2 py-3 px-0 text-sm outline-none transition-all duration-300 ${isDark
            ? `placeholder-zinc-500 text-white ${focused === name ? "border-amber-400" : "border-zinc-700"}`
            : `placeholder-slate-400 text-slate-900 ${focused === name ? "border-red-600" : "border-slate-300"}`
        }`;

    const INFO = [
        { icon: "fa-map-marker", label: "Headquarters", value: ADDRESS },
        { icon: "fa-phone", label: "Call Us", value: CONTACT_NUMBERS },
        { icon: "fa-envelope", label: "Email", value: EMAIL },
        { icon: "fa-code-fork", label: "Branch", value: BRANCH_ADDRESS },
    ];

    return (
        <section className={`min-h-screen flex items-center py-16 px-4 relative overflow-hidden transition-colors duration-500 ${isDark ? "bg-zinc-950 text-white" : "bg-slate-50 text-slate-900"
            }`}>

            {/* Map Background Overlay from map-bg-removebg.png */}
            <div className={`absolute inset-0 bg-[url('/map-bg-removebg.png')] bg-cover bg-center pointer-events-none transition-all duration-500 ${isDark ? "opacity-75 brightness-125" : "opacity-80"
                }`} />

            {/* Dark/Light Gradient Overlay */}
            <div className={`absolute inset-0 pointer-events-none ${isDark ? "bg-black/60" : "bg-white/40"
                }`} />

            {/* Background accent blobs */}
            <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl pointer-events-none ${isDark ? "bg-amber-400/5" : "bg-red-500/10"
                }`} />
            <div className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl pointer-events-none ${isDark ? "bg-amber-400/5" : "bg-red-500/10"
                }`} />

            <div className="relative z-10 max-w-5xl w-full mx-auto">

                {/* Header */}
                <div className="mb-12">
                    <span className={`inline-block text-xs font-semibold tracking-widest uppercase mb-3 ${isDark ? "text-amber-400" : "text-red-600"
                        }`}>
                        Get in touch
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                        Let's talk about<br />
                        <span className={isDark ? "text-blue-400" : "text-[#513BCF]"}>
                            your next ride.
                        </span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-5 gap-8 items-start">

                    {/* LEFT — Info cards */}
                    <div className="md:col-span-2 space-y-4">
                        {INFO.map(({ icon, label, value }) => (
                            <div
                                key={label}
                                className={`flex items-start gap-4 border rounded-2xl px-5 py-4 transition-all duration-300 group ${isDark
                                    ? "bg-zinc-900/90 border-zinc-800 text-zinc-200 hover:border-amber-400/40"
                                    : "bg-white/90 border-slate-200 text-slate-800 shadow-md hover:border-red-500/40"
                                    }`}
                            >
                                <div className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition ${isDark ? "bg-amber-400/10 group-hover:bg-amber-400/20" : "bg-red-600/10 group-hover:bg-red-600/20"
                                    }`}>
                                    <i className={`fa ${icon} text-sm ${isDark ? "text-amber-400" : "text-red-600"}`} />
                                </div>
                                <div>
                                    <p className={`text-xs mb-0.5 font-medium ${isDark ? "text-zinc-500" : "text-slate-400"}`}>{label}</p>
                                    <p className="text-sm font-medium leading-snug">{value}</p>
                                </div>
                            </div>
                        ))}

                        {/* Social row */}
                        <div className="flex gap-3 pt-2">
                            {[
                                { icon: "fa-twitter", href: "#" },
                                { icon: "fa-instagram", href: "#" },
                                { icon: "fa-linkedin", href: "#" },
                            ].map(s => (
                                <a
                                    key={s.icon}
                                    href={s.href}
                                    className={`w-9 h-9 rounded-xl border flex items-center justify-center transition ${isDark
                                        ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-400/40"
                                        : "bg-white border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-500/40 shadow-sm"
                                        }`}
                                >
                                    <i className={`fa ${s.icon} text-sm`} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT — Form */}
                    <form
                        onSubmit={sendEmail}
                        className={`md:col-span-3 border rounded-3xl p-8 space-y-7 transition-all duration-300 ${isDark
                            ? "bg-zinc-900/90 border-zinc-800 text-white"
                            : "bg-white/95 border-slate-200 text-slate-900 shadow-xl"
                            }`}
                    >
                        {/* Name + Email row */}
                        <div className="grid sm:grid-cols-2 gap-7">
                            <div>
                                <label className={`text-xs font-medium mb-1 block ${isDark ? "text-zinc-500" : "text-slate-500"}`}>Full Name</label>
                                <input
                                    name="user_name"
                                    placeholder="First Last Surname"
                                    required
                                    onFocus={() => setFocused("name")}
                                    onBlur={() => setFocused(null)}
                                    className={inputBase("name")}
                                />
                            </div>
                            <div>
                                <label className={`text-xs font-medium mb-1 block ${isDark ? "text-zinc-500" : "text-slate-500"}`}>Email</label>
                                <input
                                    name="user_email"
                                    type="email"
                                    placeholder="you@email.com"
                                    required
                                    onFocus={() => setFocused("email")}
                                    onBlur={() => setFocused(null)}
                                    className={inputBase("email")}
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className={`text-xs font-medium mb-1 block ${isDark ? "text-zinc-500" : "text-slate-500"}`}>Phone</label>
                            <div className="flex items-center gap-2">
                                <span className={`text-sm border-b-2 py-3 pr-2 ${isDark ? "text-zinc-500 border-zinc-700" : "text-slate-500 border-slate-300"}`}>+91</span>
                                <input
                                    name="user_phone"
                                    type="tel"
                                    maxLength={10}
                                    placeholder="98765 43210"
                                    onFocus={() => setFocused("phone")}
                                    onBlur={() => setFocused(null)}
                                    className={inputBase("phone") + " flex-1"}
                                />
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label className={`text-xs font-medium mb-1 block ${isDark ? "text-zinc-500" : "text-slate-500"}`}>Message</label>
                            <textarea
                                name="message"
                                placeholder="Tell us about your requirements…"
                                rows={3}
                                required
                                onFocus={() => setFocused("message")}
                                onBlur={() => setFocused(null)}
                                className={inputBase("message") + " resize-none"}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-3 font-bold text-sm py-3.5 rounded-xl active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isDark
                                ? "bg-amber-400 text-zinc-900 hover:bg-amber-300 shadow-lg shadow-amber-400/20"
                                : "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/20"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Sending…
                                </>
                            ) : sent ? (
                                <>
                                    <i className="fa fa-check-circle" />
                                    Message Sent!
                                </>
                            ) : (
                                <>
                                    Send Message
                                    <i className="fa fa-arrow-right" />
                                </>
                            )}
                        </button>
                    </form>

                </div>
            </div>
        </section>
    );
};

export default Contact;