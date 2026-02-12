import { useState } from "react";
import emailjs from "@emailjs/browser";
import { EMAIL, SLOGAN, CONTACT_NUMBERS, ADDRESS, BRANCH_ADDRESS } from '../Constant';

const Contact = () => {
    const [loading, setLoading] = useState(false);

    const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        emailjs
            .sendForm(
                "YOUR_SERVICE_ID",
                "YOUR_TEMPLATE_ID",
                e.currentTarget,
                "YOUR_PUBLIC_KEY"
            )
            .then(() => {
                alert("Message sent successfully 🚀");
                e.currentTarget.reset();
            })
            .catch(() => {
                alert("Something went wrong 😢");
            })
            .finally(() => setLoading(false));
    };

    return (
        <section
            className="
        relative py-12 px-4
        bg-[url('/map-bg-removebg.png')]
        bg-cover bg-center
      "
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/75" />

            {/* CONTENT */}
            <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

                {/* LEFT INFO */}
                <div className="text-white space-y-6">
                    <p className="text-2xl text-gray-400">{SLOGAN}</p>
                    <h2 className="text-4xl font-semibold">
                        Contact Us
                    </h2>

                    <div className="space-y-4 text-gray-300 text-base">
                        <p>
                            <span className="block text-yellow-500"><i className="fa fa-home" /> Our Address</span>
                            {ADDRESS}
                        </p>

                        <p>
                            <span className="block text-yellow-500"> <i className="fa fa-phone" /> Contact</span>
                            {CONTACT_NUMBERS}
                        </p>

                        <p>
                            <span className="block text-yellow-500"><i className="fa fa-envelope-o" /> Email</span>
                            {EMAIL}
                        </p>

                        <p>
                            <span className="block text-yellow-500"> <i className="fa fa-code" /> Branch</span>
                            {BRANCH_ADDRESS}
                        </p>
                    </div>
                </div>

                {/* FORM CARD */}
                <form
                    onSubmit={sendEmail}
                    className="
            bg-white/45 rounded-2xl p-8 space-y-6
            shadow-xl
          "
                >
                    <h3 className="text-2xl font-semibold text-gray-800">
                        Contact Form
                    </h3>

                    <input
                        name="user_name"
                        placeholder="Name"
                        required
                        className="w-full border-b border-white-300 py-2 px-2 rounded-md focus:border-black"
                    />

                    <input
                        name="user_email"
                        type="email"
                        placeholder="E-mail"
                        required
                        className="w-full border-b border-red-300 py-2 px-2 rounded-md focus:border-black"
                    />

                    <input
                        name="user_phone"
                        type="text" maxLength={10}
                        placeholder="Phone"
                        className="w-full border-b border-red-300 py-2 px-2 rounded-md focus:border-black"
                    />

                    <textarea
                        name="message"
                        placeholder="Message"
                        rows={2}
                        required
                        className="w-full border-b border-red-300 py-2 px-2 rounded-md focus:border-black"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="
              w-full bg-black text-white py-3 rounded-md
              hover:bg-gray-800 transition
              disabled:opacity-50
            "
                    >
                        {loading ? "Sending..." : "Send Message"}
                        &nbsp;&nbsp;&nbsp;<i className="fa fa-send" />
                    </button>
                </form>

            </div>
        </section>
    );
};

export default Contact;