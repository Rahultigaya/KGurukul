import { useState } from "react";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Curriculum Aligned Courses
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight mt-3">
            Our Board Aligned <span className="text-blue-600">Courses</span>
          </h2>
          <p className="text-slate-500 mt-3 text-sm sm:text-base max-w-xl mx-auto">
            Comprehensive computer science programs specially tailored for ICSE, HSC, and ISC board exams.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const points = course.details
              .split("|")
              .map((p) => p.trim())
              .filter(Boolean);

            return (
              <div
                key={`${course.class}-${course.name}`}
                className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Course Image Banner */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                    <img
                      src={course.images[0]}
                      alt={course.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                      {course.class} Board
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3 className="font-serif-display font-bold text-xl text-slate-900">
                        {course.name}
                      </h3>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {course.class}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-blue-600 mb-4">
                      {course.description}
                    </p>

                    {/* Syllabus Points */}
                    <ul className="space-y-2 mb-4">
                      {points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-2 text-xs text-slate-600 leading-snug"
                        >
                          <CheckCircleIcon
                            fontSize="small"
                            className="text-emerald-500 mt-0.5 shrink-0"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-5 sm:px-6 pb-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-auto">
                  <button
                    type="button"
                    onClick={() => onSelectCourse && onSelectCourse(course)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition-colors py-2"
                  >
                    <InfoOutlinedIcon fontSize="small" /> View Detailed Syllabus
                  </button>

                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => onSelectCourse && onSelectCourse(course)}
                    endIcon={<ArrowForwardIcon fontSize="small" />}
                    sx={{
                      borderRadius: 2,
                      px: 2,
                      py: 0.8,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "none",
                      bgcolor: "#2563eb",
                      "&:hover": { bgcolor: "#1d4ed8" },
                    }}
                  >
                    Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="flex justify-center mt-10">
          <Button
            href="#contact"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon fontSize="small" />}
            sx={{
              borderRadius: 999,
              px: 4,
              py: 1.4,
              fontSize: 15,
              fontWeight: 700,
              textTransform: "none",
              background: "linear-gradient(135deg, #2563eb, #16a34a)",
              boxShadow: "0 8px 20px -6px rgba(37,99,235,0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #1d4ed8, #15803d)",
              },
            }}
          >
            Inquire About Custom Batches
          </Button>
        </div>

      </div>
    </section>
  );
}