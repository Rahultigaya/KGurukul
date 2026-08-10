import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
 import TopPerformersDark from "./components/Topperformersdark";
import WhyChoose from "./components/WhyChoose";
import Courses from "./components/Courses";
import Mentors from "./components/Mentors";
import LearningJourney from "./components/LearningJourney";
import TestimonialsGallery from "./components/Gallery";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FoundersDesk from "./components/Founderdesk";
import Gallery from "./components/Gallery";
import Testimonials from "./components/Testimonials";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/700.css";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Hero />
       <TopPerformersDark />
      <About />
      <WhyChoose />
      <Courses />
      <Mentors />
      <FoundersDesk />
      <LearningJourney />
      <Testimonials />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  );
}