import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
 import TopPerformersDark from "./components/TopPerformersDark";
import WhyChoose from "./components/WhyChoose";
import Courses from "./components/Courses";
import Mentors from "./components/Mentors";
import LearningJourney from "./components/LearningJourney";
import TestimonialsGallery from "./components/TestimonialsGallery";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FoundersDesk from "./components/Founderdesk";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900">
      <Navbar />
      <Hero />
       <TopPerformersDark />
      <About />
      <WhyChoose />
      <Courses />
      <Mentors />
      <FoundersDesk />
      <LearningJourney />
      <TestimonialsGallery />
      <Contact />
      <Footer />
    </div>
  );
}