import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import icseStd9 from "../assets/icse-std9-basic-java.png";
import icseStd10 from "../assets/icse-std10-advanced-java.png";
import hscStd11 from "../assets/hsc-std11-computer-science.png";
import hscStd12 from "../assets/hsc-std12-computer-science.png";

const Product = [
  {
    class: "ICSE",
    name: "Std-IX",
    description: "(Basic Java Programming)",
    details:
      "Programming Basics | Logic Building | Weekly Tests | Exam Preparation | Crash Course | Practical Coding",
    images: [icseStd9],
  },
  {
    class: "ICSE",
    name: "Std-X",
    description: "(Advanced Java Programming)",
    details:
      "Advanced Java | OOP Concepts | Board Problem Solving | Weekly Tests | Revision Sessions | Practical Coding",
    images: [icseStd10],
  },
  {
    class: "HSC",
    name: "Std-XI",
    description: "(Computer Science: CS1 + CS2)",
    details:
      "Programming Basics | Python / Java | Theory + Practical | Concept Tests | Exam Preparation | Lab Practice",
    images: [hscStd11],
  },
  {
    class: "HSC",
    name: "Std-XII",
    description: "(Computer Science: CS1 + CS2)",
    details:
      "Advanced Programming | Algorithms | Board Problem Solving | Board Tests | Revision | Viva Preparation",
    images: [hscStd12],
  },
];

const BADGE_STYLES = {
  ICSE: { bg: "#dbeafe", color: "#1d4ed8" },
  HSC: { bg: "#dcfce7", color: "#15803d" },
};

export default function Courses() {
  return (
    <section id="courses" className="py-10 ">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
          Our <span className="text-blue-600">Courses</span>
        </h2>
        <p className="text-center text-slate-500 max-w-2xl mx-auto mb-8 text-sm">
          Board-aligned computer science programs for ICSE and HSC students.
        </p>

        {/* Normal grid flow — no absolute positioning, no fixed heights,
            no has() hacks. Rows just grow naturally on hover, pushing
            whatever's below (like the button) down with them. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {Product.map((course) => {
            const badge = BADGE_STYLES[course.class] || BADGE_STYLES.ICSE;
            const points = course.details
              .split("|")
              .map((p) => p.trim())
              .filter(Boolean);
            const firstThree = points.slice(0, 3);
            const rest = points.slice(3);

            return (
              <div
                key={course.name}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-1 overflow-hidden flex flex-col"
              >
                {/* Image banner */}
                <div className="relative h-36 shrink-0 overflow-hidden">
                  <img
                    src={course.images[0]}
                    alt={course.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                   
                </div>

                {/* Content — sized to its own content, no forced height */}
                <div className="p-4 flex flex-col flex-1">
                  
                  <ul className="space-y-1 mb-1">
                    {firstThree.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-1.5 text-[15px] text-slate-600 leading-snug"
                      >
                        <CheckCircleIcon
                          sx={{ fontSize: 15 }}
                          className="text-green-500 mt-0.5 shrink-0"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Smooth auto-height reveal via grid-template-rows
                      0fr -> 1fr. Animates to the EXACT content height,
                      no guessed max-height, so timing always looks even. */}
                  {rest.length > 0 && (
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out">
                      <ul className="overflow-hidden min-h-[35px] space-y-1">
                        {rest.map((point) => (
                          <li
                            key={point}
                            className="flex items-start gap-1.5 text-[15px] text-slate-600 leading-snug pt-1"
                          >
                            <CheckCircleIcon
                              sx={{ fontSize: 15 }}
                              className="text-green-500 mt-0.5 shrink-0"
                            />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    type="button"
                    className="mt-3 text-xs font-semibold text-blue-600 inline-flex items-center gap-1 self-start hover:text-blue-700 transition-colors"
                  >
                    View Details <ArrowForwardIcon sx={{ fontSize: 15 }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-8">
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon fontSize="small" />}
            sx={{
              borderRadius: 999,
              px: 3.5,
              py: 1.2,
              bgcolor: "#2563eb",
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            View All Courses
          </Button>
        </div>
      </div>
    </section>
  );
}