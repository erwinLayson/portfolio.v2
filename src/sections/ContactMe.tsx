import { useEffect, useRef, useState } from "react";
import { profile } from "../constants/profile";
import {
  CheckIcon,
  CopyIcon,
  MailIcon,
} from "../components/icons";
import Reveal from "../components/Reveal";

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
    <section
      id="contact"
      className="scroll-mt-24 bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)]"
    >
      <div className="mx-auto max-w-5xl px-6 pt-24 pb-10">
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

      </div>
    </section>
  );
}