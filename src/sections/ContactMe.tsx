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
    <footer id="contact" className="scroll-mt-24 bg-zinc-100 text-zinc-700">
      <div className="mx-auto max-w-5xl px-6 pt-20 pb-10">
        {/* CTA card */}
        <Reveal>
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 sm:p-12">
            <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                {profile.openToWork && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    Open to work
                  </span>
                )}

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                  Let&apos;s build something together.
                </h2>
                <p className="mt-3 leading-relaxed text-zinc-600">
                  Have a project in mind or just want to say hi? My inbox is
                  always open - I&apos;ll get back to you as soon as I can.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row md:flex-col lg:flex-row">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-[.8rem] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-700 hover:shadow-lg hover:shadow-zinc-300/60"
                >
                  <MailIcon className="h-4 w-4" aria-hidden="true" />
                  Email me
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label={copied ? "Email copied to clipboard" : `Copy email address ${profile.email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-md hover:shadow-zinc-200/60"
                >
                  {copied ? (
                    <>
                      <CheckIcon
                        className="h-4 w-4 text-emerald-600"
                        aria-hidden="true"
                      />
                      Copied!
                    </>
                  ) : (
                    <>
                      <CopyIcon
                        className="h-4 w-4 text-zinc-500"
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

        {/* Link columns */}
        <div className="mt-14 gap-12 flex flex-col md:flex-row md:justify-between">
          {/* Brand */}
          <Reveal>
              <p className="text-lg font-bold tracking-tight text-zinc-900">
                EL<span className="text-zinc-500">.</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                Portfolio of {profile.name}, a {profile.role} based in{" "}
                {profile.location}.
              </p>
              <a
                href={`mailto:${profile.email}`}
                className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900"
              >
                {profile.email}
                <ArrowUpRightIcon className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-zinc-900" />
              </a>
          </Reveal>

          {/* Quick Links */}
          <Reveal delay={100}>
            <div className="grid place-items-center">
              <h3 className="text-sm font-semibold tracking-widest text-zinc-500 uppercase">
                Quick Links
              </h3>
              <ul className="mt-5 space-y-3 text-center">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
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
            <div className="grid place-items-center md:place-items-start md:flex md:flex-col">
              <h3 className="text-sm font-semibold tracking-widest text-zinc-500 uppercase">
                Connect
              </h3>
              <ul className="mt-5 space-y-3 text-center md:text-start">
                {socials.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-3 text-sm text-zinc-600 transition-colors hover:text-zinc-900"
                    >
                      {social.icon === "github" && <GitHubIcon className="h-4 w-4" />}
                      {social.icon === "linkedin" && <LinkedInIcon className="h-4 w-4" />}
                      {social.icon === "mail" && <MailIcon className="h-4 w-4" />}
                      {social.name}
                      <ArrowUpRightIcon className="h-3.5 w-3.5 text-zinc-400 transition-colors group-hover:text-zinc-900" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex items-center justify-center gap-3 border-t border-zinc-200 pt-8">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} {profile.name}. Built with React TypeScript &amp; Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}