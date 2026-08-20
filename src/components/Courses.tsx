import { useState } from "react";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MenuBookIcon from "@mui/icons-material/MenuBook";

import icseStd9 from "../assets/ICSE-IX.png";
import icseStd10 from "../assets/ICSE-X.png";
import hscStd11 from "../assets/HSC-XI.png";
import hscStd12 from "../assets/HSC-XII.png";
import iscStd11 from "../assets/ISC-XI.png";
import iscStd12 from "../assets/ISC-XII.png";

import type { CourseDetail } from "./CourseModal";

export const COURSES_DATA: CourseDetail[] = [
  {
    class: "ICSE",
    name: "Std-IX",
    description: "(Basic Java Programming)",
    details:
      "Java Fundamentals | Programming Basics | School Exam Preparation | Practical Coding",
    images: [icseStd9],
    duration: "Full Academic Year",
      showHighlights: false,

    topics: [
      "Introduction to Java & OOP Concepts",
      "Data Types, Variables & Operators",
      "Control Structures (if-else, switch-case)",
      "Iterative Constructs (for, while, do-while loops)",
      "Nested Loops & Pattern Programs",
      "Practical Lab Exercises & School Test Series",
    ],
  },
  {
    class: "ICSE",
    name: "Std-X",
    description: "(Advanced Java Programming)",
    details:
      "Advanced Java | OOP Concepts | Prelim Exams | Board Exam Preparation",
    images: [icseStd10],
    duration: "Full Academic Year",
    topics: [
      "User-Defined Methods & Function Overloading",
      "Class as the Basis of all Computation & Constructors",
      "Encapsulation, Inheritance & String Functions",
      "Single & Double Dimensional Arrays",
      "Board Examination Previous 10 Years Papers",
      "Prelim Mock Exams & Practical Viva Prep",
    ],
  },
  {
    class: "HSC",
    name: "Std-XI",
    description: "(Computer Science: CS1 + CS2)",
    details:
      "Programming Fundamentals | Practical Preparation | Annual Exam Preparation | Regular Assessments",
    images: [hscStd11],
    duration: "Full Academic Year",
    topics: [
      "C++ Programming Fundamentals & Data Types",
      "Functions, Arrays & Pointers in C++",
      "Data Structures & Microprocessors Concepts",
      "Networking & Operating Systems Essentials",
      "Practical Journal Preparation & Lab Coding",
    ],
  },
  {
    class: "HSC",
    name: "Std-XII",
    description: "(Computer Science: CS1 + CS2)",
    details:
      "Advanced Programming | Prelim Exams | Mock Board Exams | Practical & Viva Preparation",
    images: [hscStd12],
    duration: "Full Academic Year",
    topics: [
      "Object Oriented Programming with C++ (CS1)",
      "Data Structures (Stacks, Queues, Trees) (CS1)",
      "Hardware, 8085 Microprocessor & Assembly (CS2)",
      "Networking Protocols & HTML/CSS Basics (CS2)",
      "HSC Board Prelim Mocks & HSC Practical Viva Prep",
    ],
  },
  {
    class: "ISC",
    name: "Std-XI",
    description: "(Computer Science: CS1 + CS2)",
    details:
      "Programming Fundamentals | Practical Preparation | Annual Exam Preparation | Regular Assessments",
    images: [iscStd11],
    duration: "Full Academic Year",
    topics: [
      "Java Programming Concepts & Algorithms",
      "Boolean Algebra & Logic Gates",
      "Data Representation & Primitive Types",
      "Arrays, Strings & Recursion Fundamentals",
      "ISC Annual Exam Question Papers Practice",
    ],
  },
  {
    class: "ISC",
    name: "Std-XII",
    description: "(Computer Science: CS1 + CS2)",
    details:
      "Advanced Programming | Prelim Exams | Mock Board Exams | Practical & Viva Preparation",
    images: [iscStd12],
    duration: "Full Academic Year",
    topics: [
      "Boolean Algebra, Karnaugh Maps (K-Maps)",
      "Advanced Java OOP, Inheritance & Polymorphism",
      "Data Structures (Linked Lists, Stacks, Queues)",
      "Recursive Algorithms & Complexity Analysis",
      "ISC Board Prelim Series & Practical File Verification",
    ],
  },
];

const BOARD_FILTERS = ["ALL", "ICSE", "HSC", "ISC"];

const getCourseTheme = (classType: string, name: string) => {
  switch (classType) {
    case "ICSE":
      if (name === "Std-IX") {
        return {
          primary: "#16a34a",
          bg: "#f0fdf4",
          border: "border-emerald-200",
          badgeText: "text-emerald-700",
          badgeBg: "bg-emerald-50",
          badgeBorder: "border-emerald-200/60",
          hasSplitPills: false,
        };
      }
      return {
        primary: "#2563eb",
        bg: "#eff6ff",
        border: "border-blue-200",
        badgeText: "text-blue-700",
        badgeBg: "bg-blue-50",
        badgeBorder: "border-blue-200/60",
        hasSplitPills: false,
      };
    case "HSC":
      if (name === "Std-XI") {
        return {
          primary: "#7c3aed",
          bg: "#f5f3ff",
          border: "border-purple-200",
          badgeText: "text-purple-700",
          badgeBg: "bg-purple-50/70",
          badgeBorder: "border-purple-200/60",
          hasSplitPills: true,
        };
      }
      return {
        primary: "#ea580c",
        bg: "#fff7ed",
        border: "border-orange-200",
        badgeText: "text-orange-700",
        badgeBg: "bg-orange-50/70",
        badgeBorder: "border-orange-200/60",
        hasSplitPills: true,
      };
    case "ISC":
      if (name === "Std-XI") {
        return {
          primary: "#0d9488",
          bg: "#f0fdfa",
          border: "border-teal-200",
          badgeText: "text-teal-700",
          badgeBg: "bg-teal-50",
          badgeBorder: "border-teal-200/60",
          hasSplitPills: false,
        };
      }
      return {
        primary: "#e11d48",
        bg: "#fff1f2",
        border: "border-rose-200",
        badgeText: "text-rose-700",
        badgeBg: "bg-rose-50",
        badgeBorder: "border-rose-200/60",
        hasSplitPills: true,
      };
    default:
      return {
        primary: "#2563eb",
        bg: "#eff6ff",
        border: "border-blue-200",
        badgeText: "text-blue-700",
        badgeBg: "bg-blue-50",
        badgeBorder: "border-blue-200/60",
        hasSplitPills: false,
      };
  }
};

interface CoursesProps {
  onSelectCourse?: (course: CourseDetail) => void;
}

export default function Courses({ onSelectCourse }: CoursesProps) {
  const [selectedBoard, setSelectedBoard] = useState("ALL");

  const filteredCourses =
    selectedBoard === "ALL"
      ? COURSES_DATA
      : COURSES_DATA.filter((c) => c.class === selectedBoard);

  return (
    <section id="courses" className="py-12 sm:py-16 lg:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-5 sm:mb-5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            WHAT WE TEACH
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight mt-3">
            Our <span className="text-blue-600">Courses</span>
          </h2>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-xl mx-auto">
            Board-aligned computer science programs for ICSE and HSC students.
          </p>

          {/* Board Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {BOARD_FILTERS.map((board) => (
              <button
                key={board}
                type="button"
                onClick={() => setSelectedBoard(board)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                  selectedBoard === board
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {board === "ALL" ? "All Boards" : `${board} Curriculum`}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const points = course.details
              .split("|")
              .map((p) => p.trim())
              .filter(Boolean);
            
            const theme = getCourseTheme(course.class, course.name);
            const subject = course.class === "ICSE" ? "Computer Applications" : "Computer Science";

            return (
              <div
                key={`${course.class}-${course.name}`}
                className="group relative overflow-hidden bg-white rounded-3xl border border-slate-150 p-3 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Decorative corner dot grid */}
                <div className="absolute top-5 right-5 grid grid-cols-4 gap-[5px] opacity-50 pointer-events-none z-0">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} className="h-[3px] w-[3px] rounded-full bg-slate-300" />
                  ))}
                </div>

                {/* Decorative soft blob */}
                <div
                  className="absolute -top-12 -right-12 w-44 h-44 rounded-full opacity-60 blur-2xl pointer-events-none z-0"
                  style={{ backgroundColor: theme.bg }}
                />

                {/* Top: Image + Copy */}
                <div className="relative z-10 flex items-center gap-5">
                  {/* Image showcase with circular backdrop */}
                  {/* <div
                    className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: theme.bg }}
                  > */}
                    <img
                      src={course.images[0]}
                      alt={course.name}
                      className="w-20 sm:w-36 h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  {/* </div> */}

                  {/* Copy */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className={`inline-flex text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${theme.badgeText} ${theme.badgeBg} ${theme.badgeBorder}`}>
                      {course.class}
                    </span>

                    <h3 className="font-serif-display font-black text-2xl sm:text-2xl text-slate-900 leading-none">
                      {course.name.toUpperCase()}
                    </h3>
                    <p
                      className="text-xs sm:text-sm font-bold leading-none"
                      style={{ color: theme.primary }}
                    >
                      {subject}
                    </p>

                    {/* Small decorative underline for cards without split pills */}
                    {!theme.hasSplitPills && (
                      <span
                        className="block h-[2px] w-6 rounded-full mt-1.5"
                        style={{ backgroundColor: theme.primary }}
                      />
                    )}

                    {/* Split Pills */}
                    {theme.hasSplitPills && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <div className={`inline-flex items-center overflow-hidden rounded border text-[9px] sm:text-[10px] font-extrabold ${theme.badgeBorder}`}>
                          <span className="text-white px-1.5 py-0.5" style={{ backgroundColor: theme.primary }}>CS 1</span>
                          <span className={`px-1.5 py-0.5 ${theme.badgeBg} ${theme.badgeText}`}>Computer Science 1</span>
                        </div>
                        <div className={`inline-flex items-center overflow-hidden rounded border text-[9px] sm:text-[10px] font-extrabold ${theme.badgeBorder}`}>
                          <span className="text-white px-1.5 py-0.5" style={{ backgroundColor: theme.primary }}>CS 2</span>
                          <span className={`px-1.5 py-0.5 ${theme.badgeBg} ${theme.badgeText}`}>Computer Science 2</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Points - filled column-major to match reference (down first column, then second) */}
                <div className="relative z-10 grid grid-rows-2 grid-flow-col gap-x-4 gap-y-2 pt-4 mt-4 border-t border-slate-100">
                  {points.map((point) => (
                    <div key={point} className="flex items-center gap-2 text-xs sm:text-sm   text-slate-600">
                      <CheckCircleIcon sx={{ fontSize: 14, color: theme.primary }} className="shrink-0" />
                      <span className="truncate" title={point}>{point}</span>
                    </div>
                  ))}
                </div>

                {/* Action Link - centered, full width */}
                <div className="relative z-10 flex justify-center pt-4">
                  <button
                    type="button"
                    onClick={() => onSelectCourse && onSelectCourse(course)}
                    className="text-xs sm:text-sm font-black uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors hover:underline"
                    style={{ color: theme.primary }}
                  >
                    View Details <ArrowForwardIcon sx={{ fontSize: 14 }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="flex justify-center mt-12">
          <Button
            href="#contact"
            variant="contained"
            size="large"
            startIcon={<MenuBookIcon />}
            endIcon={<ArrowForwardIcon fontSize="small" className="btn-arrow" />}
            sx={{
              borderRadius: 999,
              px: 4,
              py: 1.6,
              fontSize: 15,
              fontWeight: 700,
              textTransform: "none",
              background: "#2563eb",
              boxShadow: "0 8px 24px -6px rgba(37,99,235,0.45)",
              transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
              "& .btn-arrow": {
                transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
              },
              "&:hover": {
                background: "#1d4ed8",
                boxShadow: "0 12px 28px -6px rgba(37,99,235,0.55)",
                transform: "translateY(-1px)",
                "& .btn-arrow": {
                  transform: "translateX(4px)",
                },
              },
            }}
          >
            View All Courses
          </Button>
        </div>

      </div>
    </section>
  );
}