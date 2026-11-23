export type PaginationProps = {
  currentPage: number; // 1-based index (1 to totalPages)
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  indicatorLabel?: string;
  className?: string;
  ariaLabel?: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  prevLabel = "Previous Page",
  nextLabel = "Next Page",
  indicatorLabel,
  className = "",
  ariaLabel = "Pagination",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const handlePrev = () => {
    if (hasPrev && !disabled) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNext && !disabled) {
      onPageChange(currentPage + 1);
    }
  };

  const defaultIndicator = `Page ${currentPage} of ${totalPages}`;
  const displayIndicator = indicatorLabel ?? defaultIndicator;

  // Short labels for small mobile viewports
  const shortPrev = prevLabel.replace(" Page", "");
  const shortNext = nextLabel.replace(" Page", "");

  return (
    <nav
      aria-label={ariaLabel}
      className={`mt-10 flex w-full items-center justify-between gap-3 sm:gap-6 ${className}`}
    >
      {/* Previous Page Button */}
      <button
        type="button"
        onClick={handlePrev}
        disabled={!hasPrev || disabled}
        className={`group flex items-center gap-1.5 rounded-full border border-[var(--color-border-default)] px-3.5 py-2 text-xs font-semibold transition-all sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm ${
          !hasPrev || disabled
            ? "cursor-not-allowed opacity-30 text-[var(--color-text-muted)]"
            : "bg-[var(--color-bg-card)] text-[var(--color-text-primary)] hover:border-[var(--color-accent-primary)] hover:bg-[var(--color-bg-elevated)] hover:shadow-md active:scale-95"
        }`}
        aria-label="Go to previous page"
      >
        <svg
          className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 sm:h-4 sm:w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="hidden sm:inline">{prevLabel}</span>
        <span className="sm:hidden">{shortPrev}</span>
      </button>

      {/* Center Progress Dots & Page Indicator */}
      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2" role="tablist" aria-label="Page selection">
          {Array.from({ length: totalPages }, (_, idx) => {
            const pageNum = idx + 1;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                type="button"
                disabled={disabled}
                onClick={() => onPageChange(pageNum)}
                aria-current={isActive ? "page" : undefined}
                className={`h-2 rounded-full transition-all duration-300 sm:h-2.5 ${
                  isActive
                    ? "w-6 bg-gradient-to-r from-[var(--color-brand-blue)] to-[var(--color-accent-cyan)] shadow-sm shadow-[var(--color-accent-cyan)]/50 sm:w-8"
                    : "w-2 bg-[var(--color-border-emphasis)] hover:bg-[var(--color-text-muted)] sm:w-2.5"
                } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                aria-label={`Jump to page ${pageNum}`}
              />
            );
          })}
        </div>
        <span className="text-[11px] font-medium text-[var(--color-text-muted)] text-center sm:text-xs">
          {displayIndicator}
        </span>
      </div>

      {/* Next Page Button */}
      <button
        type="button"
        onClick={handleNext}
        disabled={!hasNext || disabled}
        className={`group flex items-center gap-1.5 rounded-full border border-[var(--color-border-default)] px-3.5 py-2 text-xs font-semibold transition-all sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm ${
          !hasNext || disabled
            ? "cursor-not-allowed opacity-30 text-[var(--color-text-muted)]"
            : "bg-[var(--color-accent-primary)] text-[var(--color-primary-white)] hover:bg-[var(--color-accent-secondary)] hover:shadow-lg hover:shadow-[var(--color-accent-primary)]/30 active:scale-95"
        }`}
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline">{nextLabel}</span>
        <span className="sm:hidden">{shortNext}</span>
        <svg
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 sm:h-4 sm:w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </nav>
  );
}
