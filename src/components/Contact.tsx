import { useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SendIcon from "@mui/icons-material/Send";

const COURSE_OPTIONS = [
  "Python Programming",
  "Web Development",
  "Java Programming",
  "C / C++ Programming",
  "Data Structures & Algorithms",
  "Tally with GST",
];

const CONTACT_ITEMS = [
  {
    icon: <LocationOnIcon fontSize="small" />,
    label: "Visit Us",
    text: "6, Kavita CHS, Opp. Pratap Cinema, Kolbad Road, Thane West - 400601",
    bg: "#dbeafe",
    color: "#2563eb",
  },
  {
    icon: <PhoneIcon fontSize="small" />,
    label: "Call Us",
    text: "+91 9967442515, 8879987836",
    bg: "#dcfce7",
    color: "#16a34a",
  },
  {
    icon: <EmailIcon fontSize="small" />,
    label: "Email Us",
    text: "kgurukuls90@gmail.com",
    bg: "#fef3c7",
    color: "#d97706",
  },
  {
    icon: <AccessTimeIcon fontSize="small" />,
    label: "Working Hours",
    text: "Mon - Sat: 9:00 AM - 8:00 PM (Sunday Closed)",
    bg: "#ede9fe",
    color: "#7c3aed",
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    message: "",
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<any>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", form);
  };

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20">
      <style>{`
         .ct-field .MuiOutlinedInput-root { border-radius: 10px; }
        .ct-field .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
          border-color: #16a34a;
        }
        .ct-field .MuiInputLabel-root.Mui-focused { color: #16a34a; }
      `}</style>

      <div className="max-w-8xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-4">
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-slate-900 leading-tight">
            Let's <span className="text-blue-600">Get in Touch</span></h2><p className="text-slate-500 mt-3 text-sm sm:text-base max-w-xl mx-auto">
            Questions about a course, a demo class, or enrollment? Reach out —
            we usually reply the same day.
          </p>
        </div>

        <div className="grid lg:grid-cols-[0.85fr_1.3fr_0.85fr] gap-8">
          {/* Contact info */}
          <div className="space-y-4">
            {CONTACT_ITEMS.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: item.bg, color: item.color }}
                >
                  {item.icon}
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}

            <a
              href="https://wa.me/919967442515"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-2xl py-3 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <WhatsAppIcon fontSize="small" /> Chat on WhatsApp
            </a>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="ct-field bg-white rounded-2xl border border-slate-100 shadow-md p-6 sm:p-8 space-y-4"
          >
            <div>
              <h3 className="ct-display text-xl font-semibold text-slate-900 mb-1">
                Send us a message
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                Fill in your details and we'll get back to you shortly.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <TextField
                fullWidth
                size="small"
                label="Your Name"
                value={form.name}
                onChange={handleChange("name")}
              />
              <TextField
                fullWidth
                size="small"
                label="Your Email"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField
                fullWidth
                size="small"
                label="Your Phone"
                value={form.phone}
                onChange={handleChange("phone")}
              />
              <TextField
                select
                fullWidth
                size="small"
                label="Course Interested In"
                value={form.course}
                onChange={handleChange("course")}
              >
                {COURSE_OPTIONS.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <TextField
              fullWidth
              size="small"
              label="Your Message"
              multiline
              rows={4}
              value={form.message}
              onChange={handleChange("message")}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              endIcon={<SendIcon fontSize="small" />}
              sx={{
                borderRadius: 2.5,
                py: 1.4,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.95rem",
                bgcolor: "#16a34a",
                boxShadow: "0 4px 14px rgba(22,163,74,0.25)",
                "&:hover": {
                  bgcolor: "#15803d",
                  boxShadow: "0 6px 18px rgba(22,163,74,0.32)",
                },
              }}
            >
              Send Message
            </Button>
          </form>

          {/* Message CTA card */}
          <div className="bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 rounded-2xl border border-rose-100 p-7 relative overflow-hidden flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl mb-4">
              🙌
            </div>
            <h3 className="ct-display text-xl font-semibold text-slate-900 leading-snug mb-3">
              Your message matters to us.
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              We will get back to you within 24 hours. In the meantime, feel
              free to explore our courses or check out student results.
            </p>

            <div className="mt-auto pt-4 border-t border-rose-100/70 flex items-center gap-2 text-xs text-slate-400">
              <AccessTimeIcon sx={{ fontSize: 15 }} />
              Avg. response time: under 4 hours
            </div>

            <SendIcon
              sx={{
                position: "absolute",
                right: -6,
                bottom: -6,
                fontSize: 90,
                color: "#fb923c",
                opacity: 0.12,
                transform: "rotate(-20deg)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}