import React, { useEffect } from "react";
import Services from "../components/Services";

const ServicesPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="w-full min-h-[80vh]">
      <Services />
    </div>
  );
};

export default ServicesPage;
