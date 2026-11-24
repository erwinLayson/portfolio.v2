import { memo } from "react";
import type { BookChapter } from "./bookData";

type LeftPageProps = {
  chapter: BookChapter;
};

function LeftPageContent({ chapter }: LeftPageProps) {
  const leftPageNum = chapter.chapterNumber * 2 - 1;

  return (
    <div className="book-page book-page-left">
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-none">
        {/* Top header row */}
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2.5">
          <span className="text-xs font-bold tracking-[0.25em] text-[var(--color-accent-primary)] uppercase">
            Chapter {chapter.chapterRoman}
          </span>
          <span className="rounded-full bg-[var(--color-bg-elevated)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-secondary)] border border-[var(--color-border-subtle)]">
            {chapter.period}
          </span>
        </div>

        {/* Chapter Title & Role */}
        <div className="mt-4">
          <p className="text-xs font-semibold tracking-wider text-[var(--color-text-muted)] uppercase">
            {chapter.subtitle}
          </p>
          <h3 className="mt-1 text-xl font-bold leading-tight text-[var(--color-text-primary)] sm:text-2xl lg:text-3xl">
            {chapter.chapterTitle}
          </h3>
          <p className="mt-1 text-sm font-medium text-[var(--color-brand-blue)]">
            {chapter.company}
          </p>
        </div>

        {/* Chapter Summary Narrative - Clean solid background without expensive backdrop-blur */}
        <div className="mt-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-3.5 sm:p-4">
          <p className="text-xs leading-relaxed text-[var(--color-text-secondary)] sm:text-sm">
            {chapter.summary}
          </p>
        </div>

        {/* Technologies & Tools Used in this Chapter */}
        <div className="mt-4">
          <h4 className="text-[11px] font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
            Technologies & Tools Mastered
          </h4>
          <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
            {chapter.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent-primary)] hover:text-[var(--color-text-primary)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Left page footer */}
      <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border-subtle)] pt-2.5 text-xs text-[var(--color-text-muted)]">
        <span className="italic truncate mr-2">Erwin B. Layson — Professional Chronicles</span>
        <span className="font-mono font-semibold shrink-0">Page {leftPageNum}</span>
      </div>
    </div>
  );
}

export default memo(LeftPageContent);
