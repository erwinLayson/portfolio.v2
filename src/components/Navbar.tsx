import { useEffect, useState } from "react";
import {
  ArrowUpRightIcon,
  CloseIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  MenuIcon,
} from "./icons";
import { socials } from "../constants/profile";

const links = [
  { label: "About", href: "#about" },
  { label: "Stack", href: "#tech-stack" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const socialIcons = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  mail: MailIcon,
} as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Close the drawer with the Escape key.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border-default)] bg-[var(--color-bg-primary)]/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <a
            href="#hero-section"
            className="flex h-16 w-16 items-center justify-center rounded-full overflow-hidden"
            onClick={() => setOpen(false)}
          >
            <img src="/my-logo.png" alt="My Logo" className="h-full w-full object-contain" />
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent-primary)]"
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            className="text-[var(--color-text-secondary)] md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-haspopup="dialog"
          >
            <MenuIcon />
          </button>
        </nav>
      </header>

      {/* Mobile drawer (outside <header> so backdrop-blur doesn't trap the fixed positioning) */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
        inert={!open}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-[var(--color-primary-dark)]/40 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        {/* Slide-in panel */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={`absolute inset-y-0 right-0 flex w-72 max-w-[85%] flex-col border-l border-[var(--color-border-default)] bg-[var(--color-bg-primary)] shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--color-border-default)] px-6">
            <span className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
              EL<span className="text-[var(--color-text-muted)]">.</span>
            </span>
            <button
              type="button"
              className="text-[var(--color-text-secondary)]"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-4">
            {links.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between border-b border-[var(--color-border-subtle)] py-4 text-base font-medium text-[var(--color-text-secondary)] transition-all duration-300 hover:text-[var(--color-accent-primary)] ${
                  open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${index * 40}ms` : "0ms" }}
              >
                {link.label}
                <span className="text-xs font-semibold tracking-widest text-[var(--color-text-muted)]">
                  0{index + 1}
                </span>
              </a>
            ))}
          </nav>

          <div className="shrink-0 border-t border-[var(--color-border-default)] px-3 py-4">
            {socials.map((social) => {
              const Icon = socialIcons[social.icon];
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target={social.url.startsWith("http") ? "_blank" : undefined}
                  rel={social.url.startsWith("http") ? "noreferrer" : undefined}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-accent-primary)]"
                >
                  {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                  <span className="flex-1">{social.name}</span>
                  <ArrowUpRightIcon
                    className="h-4 w-4 text-[var(--color-text-muted)]"
                    aria-hidden="true"
                  />
                </a>
              );
            })}
          </div>
        </aside>
      </div>
    </>
  );
}
