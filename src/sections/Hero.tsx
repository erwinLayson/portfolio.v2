import me from "../assets/me.jpg";
import { profile } from "../constants/profile";

function HeroSection() {
  return (
    <section
      id="hero-section"
      className="flex min-h-screen flex-col-reverse md:grid md:grid-cols-1 items-center gap-12 px-6 pt-24 pb-16 lg:grid-cols-2 lg:gap-16 lg:px-16"
    >
      <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-accent-primary)] uppercase">
          {profile.role}
        </p>
        <h1 className="text-[2.5rem] font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl">
          Erwin B. Layson
        </h1>
        <p className="max-w-md text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
          {profile.tagline}
        </p>

        {/* Technology highlights */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 lg:justify-start">
          {(profile.techHighlights ?? []).map((tech, i) => (
            <span key={tech} className="flex items-center">
              <span className="text-sm font-medium text-[var(--color-text-muted)]">
                {tech}
              </span>
              {i < (profile.techHighlights?.length ?? 0) - 1 && (
                <span className="ml-3 text-[var(--color-border-emphasis)]">•</span>
              )}
            </span>
          ))}
        </div>

        <div className="flex gap-3 pt-2 sm:gap-4 lg:justify-start">
          <a
            href="#projects"
            className="rounded-full bg-[var(--color-accent-primary)] px-7 py-3 text-sm font-semibold text-[var(--color-primary-white)] transition-all duration-300 hover:bg-[var(--color-accent-secondary)] hover:shadow-lg hover:shadow-[var(--color-accent-primary)]/30"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="rounded-full border border-[var(--color-accent-primary)] px-7 py-3 text-sm font-semibold text-[var(--color-accent-primary)] transition-all duration-300 hover:bg-[var(--color-accent-primary)] hover:text-[var(--color-primary-white)]"
          >
            Contact Me
          </a>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="animate-float relative h-52 w-52 sm:h-72 sm:w-72 lg:h-96 lg:w-96">
          {/* Rotating gradient ring */}
          <div className="animate-spin-slow absolute -inset-1 rounded-full bg-[var(--color-accent-gradient)] opacity-20" />
          <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-[var(--color-border-default)]">
            <img
              src={me}
              alt="Portrait of Erwin B. Layson"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;