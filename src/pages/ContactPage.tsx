import React, { useEffect } from "react";
import Contact from "../components/Contact";

const ContactPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="w-full min-h-[80vh]">
      <Contact />
    </div>
  );
};

export default ContactPage;
