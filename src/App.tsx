import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./sections/Hero";
import AboutMe from "./sections/AboutMe";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Gallery from "./components/Gallery";
import ContactMe from "./sections/ContactMe";
import Footer from "./components/Footer";
import ResumePage from "./pages/ResumePage";

function checkIsResumeRoute(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname.replace(/\/$/, "");
  const hash = window.location.hash;
  return path === "/resume" || hash === "#resume";
}

export default function App() {
  const [isResume, setIsResume] = useState<boolean>(checkIsResumeRoute);

  useEffect(() => {
    const handleLocationChange = () => {
      setIsResume(checkIsResumeRoute());
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  if (isResume) {
    return <ResumePage />;
  }

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutMe />
        <Experience />
        <Projects />
        <Gallery />
        <ContactMe />
      </main>
      <Footer />
    </>
  );
}
