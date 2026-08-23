import { useState } from "react";
import { motion } from "framer-motion";
 import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
 import CodeIcon from "@mui/icons-material/Code";
import CalculateIcon from "@mui/icons-material/Calculate";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import LoopIcon from "@mui/icons-material/Loop";
import StorageIcon from "@mui/icons-material/Storage";
import SettingsIcon from "@mui/icons-material/Settings";
import FunctionsIcon from "@mui/icons-material/Functions";
import LanguageIcon from "@mui/icons-material/Language";

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
    images: [icseStd9],
    duration: "Full Academic Year",
    highlights: [
      { title: "Practical Execution", subtitle: "Hands-on coding sessions to apply concepts practically" },
      { title: "Regular Worksheet Solving", subtitle: "Consistent practice through structured worksheets" },
      { title: "Monthly Exams", subtitle: "Regular assessments to track conceptual clarity" },
      { title: "Attendance Monitoring", subtitle: "Consistent tracking to ensure regular participation" },
      { title: "One-to-One Progress Tracking", subtitle: "Personalized feedback on individual performance" },
    ],
    topics: [
      {
        title: "Introduction to Java & OOP Concepts",
        subtitle: "Understand Java environment, classes, objects, and basic OOP principles.",
        icon: CodeIcon,
        iconColor: "text-blue-600",
      },
      {
        title: "Data Types, Variables & Operators",
        subtitle: "Learn different data types, variables, declarations, and operators in Java.",
        icon: CalculateIcon,
        iconColor: "text-emerald-600",
      },
      {
        title: "Control Structures (if-else, switch-case)",
        subtitle: "Implement decision making and branching using conditional statements.",
        icon: AccountTreeIcon,
        iconColor: "text-amber-600",
      },
      {
        title: "Iterative Constructs (for, while, do-while loops)",
        subtitle: "Use loops to solve real-world programming problems efficiently.",
        icon: LoopIcon,
        iconColor: "text-indigo-600",
      },
      {
        title: "Nested Loops & Pattern Programs",
        subtitle: "Build pattern-based logic using nested loop structures.",
        icon: LoopIcon,
        iconColor: "text-indigo-600",
      },
    ],
  },
  {
    class: "ICSE",
    name: "Std-X",
    description: "(Advanced Java Programming)",
    images: [icseStd10],
    duration: "Full Academic Year",
    highlights: [
      { title: "Syllabus Completion by September", subtitle: "Complete syllabus coverage well ahead of board exams" },
      { title: "9 Preliums throughout the year", subtitle: "Multiple mock exams to build exam readiness" },
      { title: "In-House Crash Course", subtitle: "Focused revision sessions before final exams" },
      { title: "Regular Work sheets", subtitle: "Consistent practice through structured worksheets" },
      { title: "Doubt Solving", subtitle: "Dedicated sessions to clear concept doubts" },
      { title: "One-to-One progress tracking", subtitle: "Personalized feedback on individual performance" },
      { title: "Career Guidance", subtitle: "Guidance on academic and career pathways" },
    ],
    topics: [
      {
        title: "User-Defined Methods & Function Overloading",
        subtitle: "Learn to create custom methods and use function overloading effectively.",
        icon: CodeIcon,
        iconColor: "text-blue-600",
      },
      {
        title: "Classes, Computation & Constructor Concepts",
        subtitle: "Understand classes, objects, and constructors as building blocks of Java.",
        icon: AccountTreeIcon,
        iconColor: "text-amber-600",
      },
      {
        title: "Encapsulation, Inheritance & String Functions",
        subtitle: "Master OOP principles and essential string manipulation functions.",
        icon: StorageIcon,
        iconColor: "text-purple-600",
      },
      {
        title: "Single & Double Dimensional Arrays",
        subtitle: "Work with 1D and 2D arrays to store and process data.",
        icon: StorageIcon,
        iconColor: "text-purple-600",
      },
      {
        title: "Board Examination Previous 10 Years Papers",
        subtitle: "Practice previous years' board papers for exam readiness.",
        icon: CheckCircleIcon,
        iconColor: "text-rose-600",
      },

    ],
  },
  {
    class: "HSC",
    name: "Std-XI",
    description: "(Computer Science: CS1 + CS2)",
    images: [hscStd11],
    duration: "Full Academic Year",
    highlights: [
      { title: "Practical Execution", subtitle: "Hands-on coding sessions to apply concepts practically" },
      { title: "Regular Worksheet Solving", subtitle: "Consistent practice through structured worksheets" },
      { title: "Monthly Exams", subtitle: "Regular assessments to track conceptual clarity" },
      { title: "Attendance Monitoring", subtitle: "Consistent tracking to ensure regular participation" },
      { title: "One-to-One Progress Tracking", subtitle: "Personalized feedback on individual performance" },
      { title: "Practical & Viva Preparation", subtitle: "Confidence training for examiner viva" },
    ],
    topics: [
      {
        title: "C++ Programming Fundamentals & Number Systems (CS1)",
        subtitle: "Build core C++ programming skills and understand number systems.",
        icon: CodeIcon,
        iconColor: "text-blue-600",
      },
      {
        title: "Functions, Arrays & Pointers in C++ (CS1)",
        subtitle: "Learn functions, arrays, and pointer manipulation in C++.",
        icon: StorageIcon,
        iconColor: "text-purple-600",
      },
      {
        title: "Visual Basics & Microprocessors Concepts (CS2)",
        subtitle: "Explore Visual Basic fundamentals and microprocessor architecture.",
        icon: SettingsIcon,
        iconColor: "text-slate-500",
      },
      {
        title: "Networking (CS2)",
        subtitle: "Understand networking concepts, topologies, and protocols.",
        icon: AccountTreeIcon,
        iconColor: "text-amber-600",
      },
    ],
  },
  {
    class: "HSC",
    name: "Std-XII",
    description: "(Computer Science: CS1 + CS2)",
    images: [hscStd12],
    duration: "Full Academic Year",
    highlights: [
      { title: "Practical Execution", subtitle: "Hands-on coding sessions to apply concepts practically" },
      { title: "Regular Worksheet Solving", subtitle: "Consistent practice through structured worksheets" },
      { title: "Monthly Exams", subtitle: "Regular assessments to track conceptual clarity" },
      { title: "Attendance Monitoring", subtitle: "Consistent tracking to ensure regular participation" },
      { title: "One-to-One Progress Tracking", subtitle: "Personalized feedback on individual performance" },
      { title: "Practical & Viva Preparation", subtitle: "Confidence training for examiner viva" },
    ],
    topics: [
      {
        title: "Object-Oriented Programming with C++ (CS1)",
        subtitle: "Master OOP concepts, classes, objects, inheritance, and polymorphism.",
        icon: CodeIcon,
        iconColor: "text-blue-600",
      },
      {
        title: "HTML & Web Fundamentals (CS1)",
        subtitle: "Learn HTML structure, elements, forms, tables, and web page development.",
        icon: LanguageIcon,
        iconColor: "text-orange-600",
      },
      {
        title: "Data Structures (CS1)",
        subtitle: "Master essential data structures for efficient problem solving.",
        icon: StorageIcon,
        iconColor: "text-purple-600",
      },
      {
        title: "Operating Systems (CS1)",
        subtitle: "Understand OS concepts including memory and process management.",
        icon: SettingsIcon,
        iconColor: "text-slate-500",
      },
      {
        title: "8085 Microprocessor & Assembly (CS2)",
        subtitle: "Learn 8085 architecture and assembly language programming.",
        icon: SettingsIcon,
        iconColor: "text-slate-500",
      },
      {
        title: "Intel x86 & Microcontroller (CS2)",
        subtitle: "Explore Intel x86 architecture and microcontroller fundamentals.",
        icon: SettingsIcon,
        iconColor: "text-slate-500",
      },
      {
        title: "Networking (CS2)",
        subtitle: "Understand networking concepts, topologies, and protocols.",
        icon: AccountTreeIcon,
        iconColor: "text-amber-600",
      },
    ],
  },
  {
    class: "ISC",
    name: "Std-XI",
    description: "(Computer Science: CS1 + CS2)",
    images: [iscStd11],
    duration: "Full Academic Year",
    highlights: [
      { title: "Practical Execution", subtitle: "Hands-on coding sessions to apply concepts practically" },
      { title: "Regular Worksheet Solving", subtitle: "Consistent practice through structured worksheets" },
      { title: "Monthly Exams", subtitle: "Regular assessments to track conceptual clarity" },
      { title: "Attendance Monitoring", subtitle: "Consistent tracking to ensure regular participation" },
      { title: "One-to-One Progress Tracking", subtitle: "Personalized feedback on individual performance" },
      { title: "Practical & Viva Preparation", subtitle: "Confidence training for examiner viva" },
    ],
    topics: [
      {
        title: "Java Programming Concepts & Algorithms",
        subtitle: "Strengthen Java fundamentals and algorithmic thinking.",
        icon: CodeIcon,
        iconColor: "text-blue-600",
      },
      {
        title: "Boolean Algebra , Logic Gates & Propositional Logic",
        subtitle: "Learn Boolean algebra and digital logic gate design.",
        icon: SettingsIcon,
        iconColor: "text-slate-500",
      },
      {
        title: "Arrays & Strings",
        subtitle: "Master arrays, strings, and their core operations.",
        icon: StorageIcon,
        iconColor: "text-purple-600",
      },
      {
        title: "Functions",
        subtitle: "Understand function concepts, parameters, return values, and recursion.",
        icon: FunctionsIcon,
        iconColor: "text-rose-600",
      },
    ],
  },
  {
    class: "ISC",
    name: "Std-XII",
    description: "(Computer Science: CS1 + CS2)",
    images: [iscStd12],
    duration: "Full Academic Year",
    highlights: [
      { title: "Practical Execution", subtitle: "Hands-on coding sessions to apply concepts practically" },
      { title: "Regular Worksheet Solving", subtitle: "Consistent practice through structured worksheets" },
      { title: "Monthly Exams", subtitle: "Regular assessments to track conceptual clarity" },
      { title: "Attendance Monitoring", subtitle: "Consistent tracking to ensure regular participation" },
      { title: "One-to-One Progress Tracking", subtitle: "Personalized feedback on individual performance" },
      { title: "Practical & Viva Preparation", subtitle: "Confidence training for examiner viva" },
    ],
    topics: [
      {
        title: "Boolean Algebra, Karnaugh Maps (K-Maps)",
        subtitle: "Simplify logic expressions using Boolean algebra and K-Maps.",
        icon: SettingsIcon,
        iconColor: "text-slate-500",
      },
      {
        title: "Advanced Java OOP, Inheritance & Polymorphism",
        subtitle: "Deep dive into advanced OOP concepts in Java.",
        icon: CodeIcon,
        iconColor: "text-blue-600",
      },
      {
        title: "Data Structures (Linked Lists, Stacks, Queues)",
        subtitle: "Master linear data structures and their applications.",
        icon: StorageIcon,
        iconColor: "text-purple-600",
      },
      {
        title: "Recursion, Arrays & Object Passing",
        subtitle: "Apply recursion, array operations, and object passing techniques.",
        icon: AccountTreeIcon,
        iconColor: "text-amber-600",
      },
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

// Grid stagger container
const gridVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
    },
  },
};

// Card entrance + hover states combined in one variants object
const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
  hover: {
    y: -6,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
};

// Image tilts when the parent CARD is hovered (variant propagation)
const imageTiltVariants = {
  hover: {
    rotate: -8,
    scale: 1.12,
    y: -4,
    transition: { type: "spring" as const, stiffness: 260, damping: 12 },
  },
};

// Decorative blob also reacts to card hover
const blobHoverVariants = {
  hover: {
    scale: 1.3,
    transition: { type: "spring" as const, stiffness: 200, damping: 20 },
  },
};

export default function Courses({ onSelectCourse }: CoursesProps) {
  const [selectedBoard, setSelectedBoard] = useState("ALL");

  const filteredCourses =
    selectedBoard === "ALL"
      ? COURSES_DATA
      : COURSES_DATA.filter((c) => c.class === selectedBoard);

  return (
    <section id="courses" className="py-12 sm:py-16 lg:py-20 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
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
              <motion.button
                key={board}
                type="button"
                onClick={() => setSelectedBoard(board)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors duration-200 ${selectedBoard === board
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
              >
                {board === "ALL" ? "All Boards" : `${board} Curriculum`}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          key={selectedBoard}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={gridVariants}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredCourses.map((course) => {
 
            const theme = getCourseTheme(course.class, course.name);
            const subject = course.class === "ICSE" ? "Computer Applications" : "Computer Science";

            return (
              <motion.div
                key={`${course.class}-${course.name}`}
                variants={cardVariants}
                whileHover="hover"
                className="group relative overflow-hidden bg-white rounded-3xl border border-slate-200/80 p-5 shadow-md hover:shadow-2xl hover:border-slate-300 transition-shadow duration-300 flex flex-col justify-between"
              >
                {/* Decorative corner dot grid */}
                <div className="absolute top-5 right-5 grid grid-cols-4 gap-[5px] opacity-75 pointer-events-none z-0">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} className="h-[3px] w-[3px] rounded-full bg-slate-500" />
                  ))}
                </div>

                {/* Decorative soft blob — reacts to card hover */}
                <motion.div
                  variants={blobHoverVariants}
                  className="absolute -top-12 -right-12 w-44 h-44 rounded-full opacity-60 blur-2xl pointer-events-none z-0"
                  style={{ backgroundColor: theme.bg }}
                />

                {/* Top: Image + Copy */}
                <div className="relative z-10 flex items-center gap-5">
                  <motion.img
                    src={course.images[0]}
                    alt={course.name}
                    variants={imageTiltVariants}
                    className="w-20 sm:w-36 h-auto object-contain drop-shadow-sm"
                    style={{ transformOrigin: "bottom center" }}
                  />

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
                        className="block h-[2px] w-6 rounded-full mt-1.5 transition-all duration-300 group-hover:w-10"
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

                {/* Points / Highlights */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2.5 pt-4 mt-4 border-t border-slate-100">
                  {course.highlights.slice(0, 4).map((h) => (
                    <div key={h.title} className="flex items-start gap-2">
                      <CheckCircleIcon sx={{ fontSize: 16, color: theme.primary }} className="shrink-0 mt-0.5" />
                      <span className="text-xs font-bold text-slate-700 leading-snug">
                        {h.title}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Link */}
                <div className="relative z-10 flex justify-center pt-4">
                  <button
                    type="button"
                    onClick={() => onSelectCourse && onSelectCourse(course)}
                    className="text-xs sm:text-sm font-black uppercase tracking-wider inline-flex items-center gap-1.5 transition-all duration-200 hover:scale-105 hover:underline"
                    style={{ color: theme.primary }}
                  >
                    View Details <ArrowForwardIcon sx={{ fontSize: 14 }} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mt-12"
        >
          {/* <Button
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
                transform: "translateY(-2px)",
                "& .btn-arrow": {
                  transform: "translateX(4px)",
                },
              },
            }}
          >
            View All Courses
          </Button> */}
        </motion.div>

      </div>
    </section>
  );
}