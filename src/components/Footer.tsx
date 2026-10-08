import { profile, socials } from "../constants/profile";
import {
  ArrowUpRightIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
} from "../components/icons";
import Reveal from "../components/Reveal";

const quickLinks = [
  { label: "About Me", href: "#about" },
  { label: "Tech Stack", href: "#tech-stack" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)]">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16 lg:py-20">
        {/* Footer columns */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:justify-between">
          {/* Brand */}
          <Reveal>
            <div>
              <p className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
                {profile.name}
              </p>
              <p className="mt-1 text-sm text-[var(--color-accent-primary)]">
                {profile.role}
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-text-secondary)] sm:text-sm">
                A developer based in {profile.location}, building modern web applications.
              </p>
              <a
                href={`mailto:${profile.email}`}
                className="group mt-4 inline-flex items-center gap-2 text-[14px] font-medium text-[var(--color-text-secondary)] underline decoration-[var(--color-border-emphasis)] underline-offset-4 transition-colors hover:text-[var(--color-accent-primary)] hover:decoration-[var(--color-accent-primary)] sm:text-sm"
              >
                {profile.email}
                <ArrowUpRightIcon className="h-3.5 w-3.5 text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-accent-primary)]" />
              </a>
            </div>
          </Reveal>

          {/* Quick Links */}
          <Reveal delay={100}>
            <div>
              <h3 className="text-[11px] font-semibold tracking-[0.2em] text-[var(--color-text-muted)] uppercase sm:text-xs">
                Quick Links
              </h3>
              <ul className="mt-4 space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-[14px] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent-primary)] sm:text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Connect */}
          <Reveal delay={200}>
            <div>
              <h3 className="text-[11px] font-semibold tracking-[0.2em] text-[var(--color-text-muted)] uppercase sm:text-xs">
                Connect
              </h3>
              <ul className="mt-4 space-y-3">
                {socials.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2.5 text-[14px] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent-primary)] sm:text-sm"
                    >
                      {social.icon === "github" && <GitHubIcon className="h-4 w-4" />}
                      {social.icon === "linkedin" && <LinkedInIcon className="h-4 w-4" />}
                      {social.icon === "mail" && <MailIcon className="h-4 w-4" />}
                      {social.name}
                      <ArrowUpRightIcon className="h-3 w-3 text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-accent-primary)]" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex items-center justify-center border-t border-[var(--color-border-subtle)] pt-8">
          <p className="text-[12px] text-[var(--color-text-muted)] sm:text-xs">
            © {new Date().getFullYear()} {profile.name}. Built with React, TypeScript & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
