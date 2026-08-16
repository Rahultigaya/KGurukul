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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Swal from "sweetalert2";

const COURSE_OPTIONS = [
  "ICSE Std-IX (Basic Java)",
  "ICSE Std-X (Advanced Java)",
  "HSC Std-XI (CS1 + CS2)",
  "HSC Std-XII (CS1 + CS2)",
  "ISC Std-XI (CS1 + CS2)",
  "ISC Std-XII (CS1 + CS2)",
  "Python Programming",
  "Web Development",
  "C / C++ Programming",
];

const CONTACT_ITEMS = [
  {
    icon: <LocationOnIcon fontSize="small" />,
    label: "Visit Our Institute",
    text: "6, Kavita CHS, Opp. Pratap Cinema, Kolbad Road, Thane West - 400601",
    bg: "#dbeafe",
    color: "#2563eb",
    link: "https://maps.google.com/?q=KGURUKUL+Thane",
  },
  {
    icon: <PhoneIcon fontSize="small" />,
    label: "Call Us Direct",
    text: "+91 9967442515, +91 8879987836",
    bg: "#dcfce7",
    color: "#16a34a",
    link: "tel:+919967442515",
  },
  {
    icon: <EmailIcon fontSize="small" />,
    label: "Email Support",
    text: "kgurukuls90@gmail.com",
    bg: "#fef3c7",
    color: "#d97706",
    link: "mailto:kgurukuls90@gmail.com",
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
    course: "ICSE Std-X (Advanced Java)",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<any>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      Swal.fire({
        icon: "warning",
        title: "Required Fields",
        text: "Please enter your name and phone number so we can contact you.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setSubmitted(true);
    Swal.fire({
      icon: "success",
      title: "Inquiry Submitted!",
      text: `Thank you ${form.name}! We have received your inquiry for ${form.course}. Our team will contact you within 4 hours.`,
      confirmButtonColor: "#16a34a",
    });
  };

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-white">
      <style>{`
        .ct-field .MuiOutlinedInput-root { border-radius: 12px; }
        .ct-field .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
          border-color: #2563eb;
        }
        .ct-field .MuiInputLabel-root.Mui-focused { color: #2563eb; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Get In Touch
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight mt-3">
            Let's <span className="text-blue-600">Connect With Us</span>
          </h2>
          <p className="text-slate-500 mt-3 text-sm sm:text-base max-w-xl mx-auto">
            Questions about course syllabus, demo classes, or batch timings? Book a visit or call us today!
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            {CONTACT_ITEMS.map((item, i) => (
              <a
                key={i}
                href={item.link || "#"}
                target={item.link?.startsWith("http") ? "_blank" : "_self"}
                rel="noreferrer"
                className="flex items-start gap-4 bg-slate-50 rounded-2xl border border-slate-200/80 p-4.5 sm:p-5 hover:bg-white hover:shadow-lg hover:border-blue-200 transition-all duration-300 group"
              >
                <span
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: item.bg, color: item.color }}
                >
                  {item.icon}
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed group-hover:text-blue-600 transition-colors">
                    {item.text}
                  </p>
                </div>
              </a>
            ))}

            {/* Direct WhatsApp Action Button */}
            <a
              href="https://wa.me/919967442515?text=Hi%20KGurukul!%20I%20want%20to%20enroll%20in%20a%20course."
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2.5 text-base font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-2xl py-4 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 mt-2"
            >
              <WhatsAppIcon fontSize="medium" /> Chat directly on WhatsApp
            </a>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="ct-field bg-slate-50/80 rounded-3xl border border-slate-200/80 shadow-lg p-6 sm:p-8 space-y-5"
            >
              <div>
                <h3 className="font-serif-display text-2xl font-bold text-slate-900 mb-1">
                  Send Us an Inquiry
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in your details below to schedule a free counselor demo class.
                </p>
              </div>

              {submitted && (
                <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
                  <CheckCircleIcon fontSize="small" className="text-emerald-600" />
                  Your message has been sent! We will contact you shortly.
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <TextField
                  fullWidth
                  required
                  label="Student / Parent Name"
                  value={form.name}
                  onChange={handleChange("name")}
                  variant="outlined"
                  size="small"
                />
                <TextField
                  fullWidth
                  required
                  label="Phone Number"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  variant="outlined"
                  size="small"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  variant="outlined"
                  size="small"
                />
                <TextField
                  select
                  fullWidth
                  label="Interested Course"
                  value={form.course}
                  onChange={handleChange("course")}
                  variant="outlined"
                  size="small"
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
                label="Your Questions / Additional Details"
                multiline
                rows={3}
                value={form.message}
                onChange={handleChange("message")}
                variant="outlined"
                size="small"
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                endIcon={<SendIcon fontSize="small" />}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: "none",
                  fontSize: "1rem",
                  background: "linear-gradient(135deg, #2563eb, #16a34a)",
                  boxShadow: "0 8px 20px -6px rgba(37,99,235,0.45)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1d4ed8, #15803d)",
                  },
                }}
              >
                Submit Inquiry
              </Button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}