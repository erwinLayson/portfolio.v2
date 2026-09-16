import me from "../assets/me.jpg";
import { profile } from "../constants/profile";

function HeroSection() {
  return (
    <section
      id="hero-section"
      className="grid min-h-screen grid-cols-1 items-center gap-12 px-6 pt-24 pb-16 lg:grid-cols-2 lg:gap-8 lg:px-16"
    >
      <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
        <p className="text-sm font-medium tracking-widest text-zinc-400 uppercase">
          {profile.role}
        </p>
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
          Erwin B. Layson
        </h1>
        <p className="max-w-md leading-relaxed text-zinc-600">
          {profile.tagline}
        </p>

        <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
          <a
            href="#projects"
            className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:border-zinc-900"
          >
            Contact Me
          </a>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="relative h-64 w-64 overflow-hidden rounded-full border border-zinc-200 sm:h-80 sm:w-80">
          <img
            src={me}
            alt="Portrait of Erwin B. Layson"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;