import { useEffect, useRef, useState } from "react";
import { profile, socials } from "../constants/profile";
import {
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
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

export default function ContactMe() {
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear the feedback timer if the component unmounts mid-feedback.
  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. non-secure context): fall back to mailto.
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <footer id="contact" className="scroll-mt-24 bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)]">
      <div className="mx-auto max-w-5xl px-6 pt-24 pb-10">
        {/* CTA card */}
        <Reveal>
          <div className="rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-8 sm:p-12 lg:p-16">
            <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                {profile.openToWork && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-status-open-border)] bg-[var(--color-status-open-bg)] px-3 py-1 text-xs font-semibold text-[var(--color-status-open)]">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-status-open)]/75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-status-open)]" />
                    </span>
                    Open to work
                  </span>
                )}

                <h2 className="mt-4 text-[1.65rem] font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl lg:text-4xl">
                  Let&apos;s build something together.
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
                  Have a project in mind or just want to say hi? My inbox is
                  always open — I&apos;ll get back to you as soon as I can.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row md:flex-col lg:flex-row">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent-primary)] px-7 py-3.5 text-sm font-semibold text-[var(--color-primary-white)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-accent-secondary)] hover:shadow-lg hover:shadow-[var(--color-accent-primary)]/30"
                >
                  <MailIcon className="h-4 w-4" aria-hidden="true" />
                  Contact Me
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label={copied ? "Email copied to clipboard" : `Copy email address ${profile.email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-border-emphasis)] bg-[var(--color-bg-elevated)] px-7 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-accent-primary)] hover:shadow-md hover:shadow-[var(--color-accent-primary)]/20"
                >
                  {copied ? (
                    <>
                      <CheckIcon
                        className="h-4 w-4 text-[var(--color-status-open)]"
                        aria-hidden="true"
                      />
                      Copied!
                    </>
                  ) : (
                    <>
                      <CopyIcon
                        className="h-4 w-4 text-[var(--color-text-muted)]"
                        aria-hidden="true"
                      />
                      {profile.email}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Footer columns */}
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:justify-between">
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