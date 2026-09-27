import React, { useEffect, useState } from "react";

interface TextScrambleProps {
  children?: string;
  items?: string[];
  className?: string;
  characterSet?: string;
  speed?: number;
  duration?: number;
  as?: React.ElementType;
}

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export const TextScramble: React.FC<TextScrambleProps> = ({
  children,
  items,
  className = "",
  characterSet = DEFAULT_CHARS,
  speed = 35,
  duration = 3200,
  as: Component = "span",
}) => {
  const textList = items && items.length > 0 ? items : children ? [children] : ["Text Scramble"];
  const [index, setIndex] = useState(0);
  const currentTargetText = textList[index];
  const [displayText, setDisplayText] = useState(currentTargetText);

  // Cycle through items if items array is provided
  useEffect(() => {
    if (!items || items.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, duration);
    return () => clearInterval(interval);
  }, [items, duration]);

  // Scramble effect whenever currentTargetText changes
  useEffect(() => {
    let frame = 0;
    const totalSteps = currentTargetText.length * 2.5;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalSteps;
      const revealedLength = Math.floor(progress * currentTargetText.length);

      const scrambled = currentTargetText
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < revealedLength) return currentTargetText[i];
          return characterSet[Math.floor(Math.random() * characterSet.length)];
        })
        .join("");

      setDisplayText(scrambled);

      if (frame >= totalSteps) {
        setDisplayText(currentTargetText);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [currentTargetText, characterSet, speed]);

  return <Component className={className}>{displayText}</Component>;
};

export default TextScramble;
