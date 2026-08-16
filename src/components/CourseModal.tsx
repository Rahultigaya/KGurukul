import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "@mui/material/Button";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

export interface CourseDetail {
  class: string;
  name: string;
  description: string;
  details: string;
  images: string[];
  duration?: string;
  prerequisites?: string;
  topics?: string[];
}

interface CourseModalProps {
  course: CourseDetail | null;
  onClose: () => void;
  onEnroll: (courseName: string) => void;
}

export default function CourseModal({
  course,
  onClose,
  onEnroll,
}: CourseModalProps) {
  if (!course) return null;

  const points = course.details
    .split("|")
    .map((p) => p.trim())
    .filter(Boolean);

  const topicsList = course.topics || [
    "Core Theory & Fundamentals",
    "Hands-on Lab Coding Practice",
    "Previous Board Exam Papers & Solutions",
    "Weekly Chapter Tests & Mock Prelims",
    "Viva Voce & Practical Project File Guidance",
  ];

  return (
    <Dialog
      open={Boolean(course)}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
          },
        },
      }}
    >
      <div className="relative bg-white">
        {/* Banner image */}
        <div className="relative h-44 sm:h-52 bg-slate-900 overflow-hidden">
          <img
            src={course.images[0]}
            alt={course.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <IconButton
            onClick={onClose}
            aria-label="Close dialog"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: "#fff",
              bgcolor: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(4px)",
              "&:hover": { bgcolor: "rgba(15, 23, 42, 0.85)" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <div className="absolute bottom-4 left-5 right-5 text-white">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white uppercase tracking-wider mb-1.5 shadow-sm">
              {course.class} Board Curriculum
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-display leading-tight">
              {course.name} <span className="text-blue-300 font-sans text-sm font-semibold">{course.description}</span>
            </h3>
          </div>
        </div>

        {/* Content */}
        <DialogContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <div className="flex flex-wrap gap-4 items-center text-xs text-slate-500 pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-1.5 font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
              <AccessTimeIcon fontSize="small" className="text-blue-600" />
              <span>Full Academic Year Batch</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
              <MenuBookIcon fontSize="small" className="text-emerald-600" />
              <span>ICSE / HSC Aligned</span>
            </div>
          </div>

          <div className="mb-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Key Syllabus Highlights
            </h4>
            <div className="grid sm:grid-cols-2 gap-2">
              {points.map((pt) => (
                <div key={pt} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <CheckCircleIcon fontSize="small" className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              What Students Learn & Practice
            </h4>
            <ul className="space-y-2">
              {topicsList.map((t, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="contained"
              fullWidth
              startIcon={<RocketLaunchIcon />}
              onClick={() => {
                onClose();
                onEnroll(`${course.class} ${course.name}`);
              }}
              sx={{
                borderRadius: 2.5,
                py: 1.3,
                fontWeight: 700,
                textTransform: "none",
                fontSize: 14,
                background: "linear-gradient(135deg, #2563eb, #16a34a)",
                boxShadow: "0 8px 20px -6px rgba(37,99,235,0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #1d4ed8, #15803d)",
                },
              }}
            >
              Enroll in {course.name}
            </Button>
            
            <Button
              variant="outlined"
              href={`https://wa.me/919967442515?text=Hi%20KGurukul,%20I%20am%20interested%20in%20${encodeURIComponent(course.class + ' ' + course.name)}`}
              target="_blank"
              rel="noreferrer"
              startIcon={<WhatsAppIcon sx={{ color: "#16a34a" }} />}
              sx={{
                borderRadius: 2.5,
                py: 1.3,
                px: 3,
                fontWeight: 700,
                textTransform: "none",
                fontSize: 14,
                borderColor: "#cbd5e1",
                color: "#334155",
                "&:hover": {
                  borderColor: "#94a3b8",
                  bgcolor: "#f8fafc",
                },
              }}
            >
              Ask on WhatsApp
            </Button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
