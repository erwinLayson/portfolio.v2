import { aboutStats } from "../constants/about";
import { profile, socials } from "../constants/profile";
import SectionHeading from "../components/SectionHeading";
import { GitHubIcon, LinkedInIcon, MailIcon } from "../components/icons";
import Reveal from "../components/Reveal";

export default function AboutMe() {
  return (
    <section id="about" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-24">
      <SectionHeading
        title="About Me"
        subtitle="A quick introduction to who I am and what I do."
      />

      <Reveal className="max-w-3xl">
        <div className="space-y-5 text-[15px] leading-[1.7] text-[var(--color-text-secondary)] sm:text-base">
          <p>
            I'm <span className="font-semibold text-[var(--color-text-primary)]">{profile.name}</span>, a {profile.role.toLowerCase()} focused on building practical web applications with React, TypeScript, Node.js, and MySQL.
          </p>
          <p>
            I enjoy turning real-world problems into reliable, maintainable software and continuously improving my skills through real projects.
          </p>
        </div>
      </Reveal>

      <Reveal className="mt-14 grid grid-cols-4 gap-3 sm:gap-4" delay={100}>
        {aboutStats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-5">
            <dt className="text-xs font-medium text-[var(--color-text-muted)]">{stat.label}</dt>
            <dd className="mt-1 text-lg font-semibold text-[var(--color-text-primary)]">{stat.value}</dd>
          </div>
        ))}
        {profile.openToWork && (
          <div className="rounded-xl border border-[var(--color-status-open-border)] bg-[var(--color-status-open-bg)] p-5">
            <dt className="text-xs font-medium text-[var(--color-status-open)]">Status</dt>
            <dd className="mt-1 flex items-center gap-2 text-lg font-semibold text-[var(--color-status-open)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-status-open)]/75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-status-open)]"></span>
              </span>
              Open to work
            </dd>
          </div>
        )}
      </Reveal>

      <Reveal className="mt-12 flex gap-5 text-[var(--color-text-muted)]" delay={200}>
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            aria-label={social.name}
            className="transition-colors hover:text-[var(--color-accent-primary)]"
          >
            {social.icon === "github" && <GitHubIcon className="h-6 w-6" />}
            {social.icon === "linkedin" && <LinkedInIcon className="h-6 w-6" />}
            {social.icon === "mail" && <MailIcon className="h-6 w-6" />}
          </a>
        ))}
      </Reveal>
    </section>
  );
}