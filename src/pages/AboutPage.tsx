import React, { useEffect } from "react";
import About from "../components/AboutUs";

const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="w-full min-h-[80vh]">
      <About />
    </div>
  );
};

export default AboutPage;
