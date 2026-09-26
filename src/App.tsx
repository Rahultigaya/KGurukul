import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";

function App() {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

export default App;