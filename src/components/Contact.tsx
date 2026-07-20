import { useState } from "react";
import emailjs from "@emailjs/browser";
import { EMAIL, CONTACT_NUMBERS, ADDRESS, BRANCH_ADDRESS } from '../Constant';
import BG_IMAGE from "../assets/contact-bg-img2.png";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";

const INFO_ROWS = [
    { Icon: LocationOnRoundedIcon, label: "Address", value: `${ADDRESS}, Thane West - 400601`, color: "#1A73E8" },
    { Icon: CallRoundedIcon, label: "Phone / WhatsApp", value: CONTACT_NUMBERS, color: "#0F9D58" },
    { Icon: EmailRoundedIcon, label: "Email", value: EMAIL, color: "#EA4335" },
     { Icon: AccountBalanceRoundedIcon, label: "Branch", value: BRANCH_ADDRESS, color: "#8E24AA" },
];

const inputWrapClass =
    "flex items-center gap-3 bg-white border border-[#DADCE0] rounded-xl px-4 focus-within:border-[#1A73E8] focus-within:ring-2 focus-within:ring-[#1A73E8]/20 transition";
const inputClass =
    "w-full bg-transparent py-3.5 text-[#202124] placeholder:text-[#9AA0A6] outline-none";

const Contact = () => {
    const [loading, setLoading] = useState(false);

    const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        emailjs
            .sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", e.currentTarget, "YOUR_PUBLIC_KEY")
            .then(() => {
                alert("Message sent successfully 🚀");
                e.currentTarget.reset();
            })
            .catch(() => alert("Something went wrong 😢"))
            .finally(() => setLoading(false));
    };

    return (
        <section className="relative overflow-hidden bg-[#F5F8FF] py-16">

            {/* Background illustration */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `url('${BG_IMAGE}')`,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                }}
            />

            <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-start px-6">

                {/* LEFT INFO — wrapped in a soft card so text stays legible over the detailed illustration behind it */}
                <div className="self-start text-[#202124] bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-[0_4px_24px_rgba(60,64,67,0.08)]">
                    <h2 className="text-3xl md:text-3xl font-extrabold leading-tight">
                        Contact <span className="text-[#1A73E8]">Us</span>
                    </h2>
                    <div className="h-1 w-16 bg-[#1A73E8] rounded-full mt-4 mb-2" />

                    <p className="text-[#5F6368] text-base leading-relaxed max-w-md mb-1">
                        We're here to help! Reach out to us for any queries related to our courses, batches or admissions.
                    </p>

                    <div className="space-y-3">
                        {INFO_ROWS.map(({ Icon, label, value, color }) => (
                            <div key={label} className="flex items-start gap-4">
                                <span
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                                    style={{ backgroundColor: `${color}14`, color }}
                                >
                                    <Icon style={{ fontSize: 20 }} />
                                </span>
                                <div className="min-w-0 pt-1">
                                    <p className="text-sm font-semibold" style={{ color }}>{label}</p>
                                    <p className="text-[#202124]">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FORM CARD */}
                <form
                    onSubmit={sendEmail}
                    className="bg-white rounded-3xl p-8 space-y-5 shadow-[0_20px_50px_rgba(60,64,67,0.15)]"
                >
                    <h3 className="text-2xl md:text-2xl font-extrabold text-[#202124]">
                        Send Us a <span className="text-[#1A73E8]">Message</span>
                    </h3>
                    <p className="text-sm text-[#5F6368] -mt-3">Fill out the form below and we'll get back to you shortly.</p>

                    <div className={inputWrapClass}>
                        <PersonRoundedIcon style={{ fontSize: 20 }} className="text-[#9AA0A6]" />
                        <input name="user_name" placeholder="Your Name" type="text" required className={inputClass} />
                    </div>

                    <div className={inputWrapClass}>
                        <MailRoundedIcon style={{ fontSize: 20 }} className="text-[#9AA0A6]" />
                        <input name="user_email" placeholder="Your Email" type="email" required className={inputClass} />
                    </div>

                    <div className={inputWrapClass}>
                        <PhoneRoundedIcon style={{ fontSize: 20 }} className="text-[#9AA0A6]" />
                        <input name="user_phone" placeholder="Your Phone" type="text" maxLength={10} className={inputClass} />
                    </div>

                    <div className={`${inputWrapClass} items-start py-3.5`}>
                        <EditRoundedIcon style={{ fontSize: 20 }} className="text-[#9AA0A6] mt-1" />
                        <textarea name="message" placeholder="Your Message" rows={3} required className={`${inputClass} py-0 resize-none`} />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1A73E8] text-white font-semibold py-3.5 rounded-xl hover:bg-[#1765CC] active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? "Sending..." : "Send Message"}
                        <SendRoundedIcon style={{ fontSize: 18 }} />
                    </button>

                    <p className="flex items-center justify-center gap-1.5 text-xs text-[#5F6368] pt-1">
                        <ShieldRoundedIcon style={{ fontSize: 14 }} />
                        Your information is safe with us. We never share your details.
                    </p>
                </form>
            </div>
        </section>
    );
};

export default Contact;