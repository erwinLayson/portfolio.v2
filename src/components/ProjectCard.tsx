import { ArrowUpRightIcon, GitHubIcon, MonitorIcon } from "./icons";
import type { Project } from "../constants/projects";

export default function ProjectCard({
  title,
  description,
  tech,
  image,
  github,
  demo,
}: Project) {
  const imageContent = image ? (
    <img
      src={image}
      alt={`${title} screenshot`}
      loading="lazy"
      className="h-full w-full bg-[var(--color-bg-secondary)] object-contain transition-transform duration-700 ease-out group-hover:scale-105"
    />
  ) : (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[var(--color-border-subtle)] via-[var(--color-bg-secondary)] to-[var(--color-border-default)] text-[var(--color-text-muted)]">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-[var(--color-border-emphasis)] bg-[var(--color-bg-card)]/60">
        <MonitorIcon className="h-7 w-7" />
      </span>
      <span className="text-xs font-medium uppercase tracking-widest">
        Screenshot coming soon
      </span>
    </div>
  );

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent-primary)]/40 hover:shadow-lg hover:shadow-[var(--color-accent-primary)]/10">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[var(--color-accent-gradient)] transition-transform duration-500 group-hover:scale-x-100"
      />

      {/* Image header — clicking it opens the deployed project */}
      {demo ? (
        <a
          href={demo}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${title} live site`}
          className="relative block aspect-[16/9] shrink-0 overflow-hidden border-b border-[var(--color-border-subtle)]"
        >
          {imageContent}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-dark)]/60 via-[var(--color-primary-dark)]/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <span className="absolute bottom-3 left-4 translate-y-2 text-sm font-medium text-[var(--color-primary-white)] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            View project
          </span>
          <span className="absolute right-3 top-3 flex h-10 w-10 -translate-x-1 items-center justify-center rounded-full bg-[var(--color-primary-white)]/90 text-[var(--color-primary-dark)] opacity-0 shadow-md transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            <ArrowUpRightIcon className="h-4 w-4" />
          </span>
        </a>
      ) : (
        <div className="relative aspect-[16/9] shrink-0 overflow-hidden border-b border-[var(--color-border-subtle)]">
          {imageContent}
        </div>
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-7">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className="text-[17px] font-bold tracking-tight text-[var(--color-text-primary)] sm:text-lg">
            {title}
          </h3>
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              aria-label={`${title} source code on GitHub`}
              className="shrink-0 rounded-lg p-1.5 text-[var(--color-text-muted)] transition-all duration-300 hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-accent-primary)]"
            >
              <GitHubIcon className="h-5 w-5" />
            </a>
          )}
        </div>

        <p className="mb-5 text-[14px] leading-relaxed text-[var(--color-text-secondary)] sm:text-sm lg:text-base">
          {description}
        </p>

        <ul className="mt-auto flex flex-wrap gap-2">
          {tech.map((item) => (
            <li
              key={item}
              className="rounded-full border border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] px-3 py-1.5 text-[11px] font-medium text-[var(--color-text-secondary)] transition-colors duration-300 group-hover:border-[var(--color-border-emphasis)] sm:text-xs"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center gap-5 border-t border-[var(--color-border-subtle)] pt-4">
          {demo ? (
            <a
              href={demo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-text-primary)] transition-all duration-300 hover:gap-2.5 hover:text-[var(--color-accent-primary)] sm:text-sm"
            >
              Live demo
              <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : (
            <span className="text-sm text-[var(--color-text-muted)]">Demo coming soon</span>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-text-muted)] transition-colors duration-300 hover:text-[var(--color-accent-primary)] sm:text-sm"
            >
              <GitHubIcon className="h-4 w-4" aria-hidden="true" />
              Source
            </a>
          )}
        </div>
      </div>
    </article>
  );
}