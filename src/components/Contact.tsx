import { useState, useEffect } from "react";
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
    text: "+91 9967442515, +91 9930776829",
    bg: "#dcfce7",
    color: "#16a34a",
    link: "tel:+919967442515",
  },
  {
    icon: <EmailIcon fontSize="small" />,
    label: "Email Support",
    text: "kgurukuls09@gmail.com",
    bg: "#fef3c7",
    color: "#d97706",
    link: "mailto:kgurukuls09@gmail.com",
  },
  {
    icon: <AccessTimeIcon fontSize="small" />,
    label: "Working Hours",
    text: "Monday - Sunday : 11:00 AM - 8:00 PM ",
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // trigger entrance animations shortly after mount
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

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
    <section
      id="contact"
      className="relative overflow-hidden py-10 lg:py-0 lg:h-screen lg:min-h-[600px] xl:min-h-[720px] lg:flex lg:items-center bg-white"
    >
      <style>{`
        .ct-field .MuiOutlinedInput-root { border-radius: 12px; transition: box-shadow 0.25s ease, transform 0.25s ease; }
        .ct-field .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
          border-color: #2563eb;
        }
        .ct-field .MuiOutlinedInput-root.Mui-focused {
          box-shadow: 0 0 0 4px rgba(37,99,235,0.08);
        }
        .ct-field .MuiInputLabel-root.Mui-focused { color: #2563eb; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(37,211,102,0.45); }
          70% { box-shadow: 0 0 0 10px rgba(37,211,102,0); }
          100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
        }
        @keyframes checkPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        .ct-header {
          opacity: 0;
          animation: fadeUp 0.6s ease forwards;
        }
        .ct-card {
          opacity: 0;
          animation: fadeUp 0.55s ease forwards;
        }
        .ct-whatsapp {
          opacity: 0;
          animation: fadeUp 0.55s ease forwards, pulseRing 2.4s ease-in-out 1.5s infinite;
        }
        .ct-form-wrap {
          opacity: 0;
          animation: scaleIn 0.6s ease 0.25s forwards;
        }
        .ct-success {
          animation: fadeUp 0.4s ease forwards;
        }
        .ct-check {
          animation: checkPop 0.5s ease forwards;
        }
        .ct-submit-btn {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .ct-submit-btn:active {
          transform: scale(0.97);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 ct-header">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
            Get In Touch
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 leading-tight mt-2.5">
            Let's <span className="text-blue-600">Connect With Us</span>
          </h2>
          <p className="text-slate-500 mt-2 text-xs sm:text-sm max-w-xl mx-auto">
            Questions about course syllabus, demo classes, or batch timings? Book a visit or call us today!
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">

          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-3">
            {CONTACT_ITEMS.map((item, i) => (
              <a
                key={i}
                href={item.link || "#"}
                target={item.link && item.link.startsWith("http") ? "_blank" : "_self"}
                rel="noreferrer"
                className="ct-card flex items-start gap-3.5 bg-slate-50 rounded-2xl border border-slate-200 p-3.5 sm:p-4 hover:bg-white hover:shadow-md hover:border-blue-200 transition-all duration-300 group"
                style={{ animationDelay: `${0.15 + i * 0.1}s` }}
              >
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                  style={{ backgroundColor: item.bg, color: item.color }}
                >
                  {item.icon}
                </span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed group-hover:text-blue-600 transition-colors">
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
              className="ct-whatsapp flex items-center justify-center gap-2.5 text-sm sm:text-base font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-2xl py-3 shadow-md shadow-emerald-500/10 hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mt-2"
              style={{ animationDelay: "0.55s" }}
            >
              <WhatsAppIcon fontSize="medium" className="animate-bounce" style={{ animationDuration: "2s" }} />
              Chat directly on WhatsApp
            </a>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 ct-form-wrap">
            <form
              onSubmit={handleSubmit}
              className="ct-field bg-slate-50/80 rounded-3xl border border-slate-200/80 shadow-md p-5 sm:p-6 space-y-4 transition-shadow duration-300 hover:shadow-lg"
            >
              <div>
                <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-slate-900 mb-0.5">
                  Send Us an Inquiry
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in your details below to schedule a free counselor demo class.
                </p>
              </div>

              {submitted && (
                <div className="ct-success flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
                  <CheckCircleIcon fontSize="small" className="text-emerald-600 ct-check" />
                  Your message has been sent! We will contact you shortly.
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-3.5">
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

              <div className="grid sm:grid-cols-2 gap-3.5">
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
                rows={2}
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
                className="ct-submit-btn"
                sx={{
                  borderRadius: 3,
                  py: 1.25,
                  fontWeight: 700,
                  textTransform: "none",
                  fontSize: "0.95rem",
                  background: "linear-gradient(135deg, #2563eb, #16a34a)",
                  boxShadow: "0 6px 16px -4px rgba(37,99,235,0.4)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1d4ed8, #15803d)",
                    boxShadow: "0 8px 20px -4px rgba(37,99,235,0.55)",
                  },
                }}
              >
                Submit Inquiry
              </Button>
            </form>
          </div>
</div>
        </div>
    </section >
  );
}