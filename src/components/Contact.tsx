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
    text: "6, Kavita CHS, Opp. Pratap Cinema, Kolbad Road, Thane West - 400601",
  },
  { icon: <PhoneIcon fontSize="small" />, text: "+91 9967442515, 8879987836" },
  { icon: <EmailIcon fontSize="small" />, text: "kgurukuls90@gmail.com" },
  {
    icon: <AccessTimeIcon fontSize="small" />,
    text: "Mon - Sat: 9:00 AM - 8:00 PM (Sunday Closed)",
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
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-[0.85fr_1.3fr_0.85fr] gap-8">
        {/* Contact info */}
        <div className="space-y-5">
          {CONTACT_ITEMS.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-blue-600 mt-0.5">{item.icon}</span>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
          <a
            href="https://wa.me/919967442515"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 mt-2"
          >
            <WhatsAppIcon fontSize="small" /> Chat on WhatsApp
          </a>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4"
        >
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
              borderRadius: 2,
              py: 1.3,
              bgcolor: "#16a34a",
              "&:hover": { bgcolor: "#15803d" },
            }}
          >
            Send Message
          </Button>
        </form>

        {/* Message CTA card */}
        <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl border border-rose-100 p-7 relative overflow-hidden">
          <p className="text-2xl mb-3">🙌</p>
          <h3 className="text-xl font-extrabold text-slate-900 leading-snug mb-3">
            Your message matters to us.
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            We will get back to you within 24 hours.
          </p>
          <SendIcon
            sx={{
              position: "absolute",
              right: 16,
              bottom: 16,
              fontSize: 40,
              color: "#fb923c",
              transform: "rotate(-20deg)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
