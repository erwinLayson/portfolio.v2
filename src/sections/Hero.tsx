import me from "../assets/me.png";
import { profile } from "../constants/profile";
import { techStack } from "../constants/techStack";
import TechBadge from "../components/TechBadge";
import "../style/HeroProfile.css";

function HeroSection() {
  const allTechItems = Array.from(
    new Set([
      ...(profile.techHighlights ?? []),
      ...techStack.flatMap((group) => group.items),
    ])
  );

  return (
    <section
      id="hero-section"
      className="relative flex min-h-screen flex-col justify-between overflow-hidden pt-24 pb-8"
    >
      {/* Hero content: text introduction and profile photo */}
      <div className="mx-auto flex flex-1 w-full max-w-6xl flex-col-reverse items-center justify-center gap-12 px-6 py-6 md:grid md:grid-cols-1 lg:grid-cols-2 lg:gap-16 lg:px-16">
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

            {/* Frosted glass frame */}
            <div className="glass-frame" aria-hidden="true">
              {/* Shine sweep */}
              <div className="glass-shine" />

              {/* Portrait image */}
              <img
                src={me}
                alt="Portrait of Erwin B. Layson"
                className="profile-img"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Marquee at the bottom of Hero section */}
      <div className="w-full pt-8 pb-2">
        <div className="mx-auto mb-3 max-w-6xl px-6 text-center lg:text-left">
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-text-muted)] uppercase">
            Tech Stack
          </p>
        </div>

        <div className="relative w-full overflow-hidden py-1">
          {/* Subtle fade edges for smooth entrance and exit */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--color-bg-primary)] to-transparent sm:w-28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--color-bg-primary)] to-transparent sm:w-28" />

          {/* Continuous scrolling flex track */}
          <div className="animate-marquee flex w-max">
            {/* Primary track */}
            <div className="flex shrink-0 items-center gap-4 pr-4">
              {allTechItems.map((tech) => (
                <div key={`hero-tech-1-${tech}`} className="shrink-0">
                  <TechBadge label={tech} />
                </div>
              ))}
            </div>

            {/* Cloned track for seamless infinite scroll */}
            <div className="flex shrink-0 items-center gap-4 pr-4" aria-hidden="true">
              {allTechItems.map((tech) => (
                <div key={`hero-tech-2-${tech}`} className="shrink-0">
                  <TechBadge label={tech} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
