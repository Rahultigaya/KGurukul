import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import icseStd9 from "../assets/ICSE-IX.png";
import icseStd10 from "../assets/ICSE-X.png";
import hscStd11 from "../assets/HSC-XI.png";
import hscStd12 from "../assets/HSC-XII.png";
import iscStd11 from "../assets/ISC-XI.png";
import iscStd12 from "../assets/ISC-XII.png";

const Product = [
  {
    class: "ICSE",
    name: "Std-IX",
    description: "(Basic Java Programming)",
    details:
      "Java Fundamentals | Programming Basics | School Exam Preparation | Practical Coding",
    images: [icseStd9],
  },
  {
    class: "ICSE",
    name: "Std-X",
    description: "(Advanced Java Programming)",
    details:
      "Advanced Java | OOP Concepts | Prelim Exams | Board Exam Preparation",
    images: [icseStd10],
  },
  {
    class: "HSC",
    name: "Std-XI",
    description: "(Computer Science: CS1 + CS2)",
    details:
      "Programming Fundamentals | Practical Preparation | Annual Exam Preparation | Regular Assessments",
    images: [hscStd11],
  },
  {
    class: "HSC",
    name: "Std-XII",
    description: "(Computer Science: CS1 + CS2)",
    details:
      "Advanced Programming | Prelim Exams | Mock Board Exams | Practical & Viva Preparation",
    images: [hscStd12],
  },
  {
    class: "ISC",
    name: "Std-XI",
    description: "(Computer Science: CS1 + CS2)",
    details:
      "Programming Fundamentals | Practical Preparation | Annual Exam Preparation | Regular Assessments",
    images: [iscStd11],
  },
  {
    class: "ISC",
    name: "Std-XII",
    description: "(Computer Science: CS1 + CS2)",
    details:
      "Advanced Programming | Prelim Exams | Mock Board Exams | Practical & Viva Preparation",
    images: [iscStd12],
  },
];

export default function Courses() {
  return (
    <section id="courses" className="py-10 sm:py-14 lg:py-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8 lg:mb-8">
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight">
            Our <span className="text-blue-600">Courses</span>
          </h2>
          <p className="text-slate-500 mt-2 sm:mt-3 text-xs sm:text-base max-w-xl mx-auto">
            Board-aligned computer science programs for ICSE and HSC students.
          </p>
        </div>

        {/* Flex-wrap instead of grid: matching card widths per breakpoint
            mean an incomplete last row (e.g. 8 items -> 6 + 2) centers
            itself automatically via justify-center, instead of grid's
            default left-alignment of leftover items. */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-5 lg:gap-3">
          {Product.map((course) => {
            const points = course.details
              .split("|")
              .map((p) => p.trim())
              .filter(Boolean);
            const firstThree = points.slice(0, 3);
            const rest = points.slice(3);

            return (
              <div
                key={`${course.class}-${course.name}`}
                className="group bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-1 overflow-hidden flex flex-col
                  w-[calc((100%_-_12px)/2)] sm:w-[calc((100%_-_20px)/2)] lg:w-[calc((100%_-_60px)/6)]"
              >
              {/* Image banner — no fixed height, no object-fit tricks. The <img>
    sizes itself to its own natural aspect ratio (w-full, h-auto),
    so the box is exactly the image, no cropping and no empty space
    around it. Since all course banners share the same export ratio,
    every card still ends up the same height automatically. */}
<div className="relative w-full shrink-0 overflow-hidden">
  <img
    src={course.images[0]}
    alt={course.name}
    className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
  />
</div>
                {/* Content — sized to its own content, no forced height */}
                <div className="p-2.5 sm:p-4 lg:p-2.5 flex flex-col flex-1">
                  <ul className="space-y-0.5 sm:space-y-1 mb-1">
                    {firstThree.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-1 sm:gap-1.5 text-[10px] sm:text-[13px] lg:text-[11px] text-slate-600 leading-snug"
                      >
                        <CheckCircleIcon
                          sx={{ fontSize: { xs: 11, sm: 13, lg: 11 } }}
                          className="text-green-500 mt-0.5 shrink-0"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {rest.length > 0 && (
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out">
                      <ul className="overflow-hidden min-h-[26px] space-y-0.5 sm:space-y-1">
                        {rest.map((point) => (
                          <li
                            key={point}
                            className="flex items-start gap-1 sm:gap-1.5 text-[10px] sm:text-[13px] lg:text-[11px] text-slate-600 leading-snug pt-1"
                          >
                            <CheckCircleIcon
                              sx={{ fontSize: { xs: 11, sm: 13, lg: 11 } }}
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
                    className="mt-2 sm:mt-3 lg:mt-1.5 text-[10px] sm:text-xs font-semibold text-blue-600 inline-flex items-center gap-1 self-start hover:text-blue-700 transition-colors"
                  >
                    View Details <ArrowForwardIcon sx={{ fontSize: { xs: 11, sm: 13, lg: 11 } }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-6 sm:mt-8 lg:mt-8">
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