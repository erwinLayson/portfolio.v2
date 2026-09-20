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
        <div className="relative h-52 w-52 overflow-hidden rounded-full border-2 border-[var(--color-border-default)] sm:h-72 sm:w-72 lg:h-96 lg:w-96">
          <img
            src={me}
            alt="Portrait of Erwin B. Layson"
            className="h-full w-full object-cover"
          />
          {/* Subtle brand accent ring */}
          <div className="absolute inset-0 rounded-full border-2 border-[var(--color-accent-primary)]/20" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;