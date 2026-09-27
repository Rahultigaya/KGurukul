import React from "react";
import Hero from "../components/Hero";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col">
      <section id="Home">
        <Hero />
      </section>
    </div>
  );
};

export default HomePage;
