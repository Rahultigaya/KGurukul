import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import FloatingActions from "./components/FloatingActions";
import Contact from "./components/Contact";
import Services from "./components/Cources";
import About from "./components/AboutUs";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section id="Home">
        <Hero />
      </section>
      <main className="flex-grow">
        {/* pages / sections go here */}
      </main>
      <section id="About">
        <About />
      </section>
      <section id="Courses">
        <Services />
      </section>
      <section id="Contact">
        <Contact />
      </section>

      <Footer />
      <FloatingActions />
    </div>
  );
}

export default App;
