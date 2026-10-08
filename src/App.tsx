import Navbar from "./components/Navbar";
import HeroSection from "./sections/Hero";
import AboutMe from "./sections/AboutMe";
import TechStack from "./sections/TechStack";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Gallery from "./components/Gallery";
import ContactMe from "./sections/ContactMe";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutMe />
        <TechStack />
        <Experience />
        <Projects />
        <Gallery />
        <ContactMe />
      </main>
      <Footer />
    </>
  );
}
