import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import TopPerformersDark from "./components/Topperformersdark";
import WhyChoose from "./components/WhyChoose";
import Courses from "./components/Courses";
import Mentors from "./components/Mentors";
import LearningJourney from "./components/LearningJourney";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FoundersDesk from "./components/Founderdesk";
import Gallery, { GALLERY_IMAGES } from "./components/Gallery";
import Testimonials from "./components/Testimonials";
import CourseModal from "./components/CourseModal";
import type { CourseDetail } from "./components/CourseModal";
import ImageLightbox from "./components/ImageLightbox";
import FloatingWidgets from "./components/FloatingWidgets";

import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/700.css";

export default function App() {
  const [selectedCourse, setSelectedCourse] = useState<CourseDetail | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleEnroll = (_courseName?: string) => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white font-sans">
      <Navbar />
      
      <main>
        <Hero />
        <TopPerformersDark />
        <About />
        <WhyChoose />
        <Courses onSelectCourse={(course) => setSelectedCourse(course)} />
        <Mentors />
        <FoundersDesk />
        <LearningJourney />
        <Testimonials />
        <Gallery onOpenLightbox={(index) => setLightboxIndex(index)} />
        <Contact />
      </main>

      <Footer />

      {/* Floating Action Widgets */}
      <FloatingWidgets />

      {/* Interactive Dialog Popups */}
      <CourseModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onEnroll={handleEnroll}
      />

      <ImageLightbox
        images={GALLERY_IMAGES}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIndex) => setLightboxIndex(newIndex)}
      />
    </div>
  );
}