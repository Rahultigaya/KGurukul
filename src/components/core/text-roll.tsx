import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TextRollProps {
  children?: string;
  items?: string[];
  className?: string;
  duration?: number;
  variants?: {
    enter?: { initial: Record<string, any>; animate: Record<string, any> };
    exit?: { initial: Record<string, any>; animate: Record<string, any> };
  };
}

export const TextRoll: React.FC<TextRollProps> = ({
  items = ["Share the Ride", "Save the Money", "Request a Ride"],
  className = "",
  duration = 3000,
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!items || items.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, duration);
    return () => clearInterval(interval);
  }, [items, duration]);

  const currentText = items[index] || "";

  return (
    <span className={`inline-block relative overflow-hidden align-middle ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentText}
          initial={{ rotateX: -90, opacity: 0, filter: "blur(4px)", y: 15 }}
          animate={{ rotateX: 0, opacity: 1, filter: "blur(0px)", y: 0 }}
          exit={{ rotateX: 90, opacity: 0, filter: "blur(4px)", y: -15 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="inline-block origin-center transform-gpu"
        >
          {currentText}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default TextRoll;
