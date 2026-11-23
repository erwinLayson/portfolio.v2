import type { BookChapter } from "./bookData";

type RightPageProps = {
  chapter: BookChapter;
  totalChapters: number;
  hasNext?: boolean;
  onNextPage?: () => void;
};

export default function RightPageContent({
  chapter,
  totalChapters,
  hasNext,
  onNextPage,
}: RightPageProps) {
  const rightPageNum = chapter.chapterNumber * 2;

  return (
    <div className="book-page book-page-right">
      <div>
        {/* Top header row */}
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
          <span className="text-xs font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
            Milestone Breakdown
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">
            {chapter.chapterNumber} of {totalChapters} Chapters
          </span>
        </div>

        {/* Key Responsibilities & Achievements */}
        <div className="mt-5">
          <h4 className="text-xs font-bold tracking-widest text-[var(--color-accent-secondary)] uppercase">
            Core Responsibilities & Work
          </h4>
          <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-[var(--color-text-secondary)] sm:text-[13px]">
            {chapter.points.map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-primary)] shadow-sm shadow-[var(--color-accent-primary)]/50" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Key Accomplishments / Deliverables Callout Box */}
        <div className="mt-5 rounded-xl border border-[var(--color-border-emphasis)] bg-[var(--color-bg-primary)]/70 p-4">
          <h5 className="flex items-center gap-2 text-xs font-bold tracking-wider text-[var(--color-text-primary)] uppercase">
            <svg className="h-4 w-4 text-[var(--color-accent-cyan)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Key Achievements & Milestones</span>
          </h5>
          <ul className="mt-2 space-y-1.5 text-xs text-[var(--color-text-secondary)]">
            {chapter.keyAccomplishments.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-[var(--color-accent-secondary)]">▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Chapter Philosophical Takeaway / Quote */}
        {chapter.quote && (
          <div className="mt-4 border-l-2 border-[var(--color-brand-blue)] pl-3 text-xs italic text-[var(--color-text-muted)]">
            &ldquo;{chapter.quote}&rdquo;
          </div>
        )}
      </div>

      {/* Right page footer with interactive corner curl */}
      <div className="relative mt-6 flex items-center justify-between border-t border-[var(--color-border-subtle)] pt-3 text-xs text-[var(--color-text-muted)]">
        <span className="font-mono font-semibold">Page {rightPageNum}</span>
        <span className="italic">Sultan Kudarat State University</span>

        {/* Corner curl to turn page forward */}
        {hasNext && onNextPage && (
          <button
            type="button"
            onClick={onNextPage}
            className="page-corner-curl"
            title="Turn to next chapter"
            aria-label="Turn to next chapter"
          />
        )}
      </div>
    </div>
  );
}
