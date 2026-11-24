import { useState, useEffect, useRef, useCallback } from "react";
import { PageFlip } from "page-flip";
import { bookChapters } from "./bookData";
import LeftPageContent from "./LeftPageContent";
import RightPageContent from "./RightPageContent";
import "./DigitalBook.css";

export default function DigitalBook() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pagesSourceRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<PageFlip | null>(null);

  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const totalChapters = bookChapters.length;
  const currentChapterIdx = Math.min(
    totalChapters - 1,
    Math.max(0, Math.floor(currentPageIdx / 2))
  );
  const currentChapter = bookChapters[currentChapterIdx];

  // Initialize StPageFlip instance
  useEffect(() => {
    if (!containerRef.current || !pagesSourceRef.current) return;

    // Create a dedicated inner mount element to prevent React DOM hierarchy conflicts
    const mountEl = document.createElement("div");
    mountEl.className = "st-book-mount";
    containerRef.current.appendChild(mountEl);

    // Instantiate StPageFlip with natural physics, dynamic lighting, and responsive stretching
    const pageFlip = new PageFlip(mountEl, {
      width: 470,
      height: 630,
      size: "stretch",
      minWidth: 310,
      maxWidth: 580,
      minHeight: 440,
      maxHeight: 720,
      drawShadow: true,
      maxShadowOpacity: 0.55,
      showCover: false,
      usePortrait: true,
      autoSize: true,
      flippingTime: 750,
      useMouseEvents: true,
      showPageCorners: true,
      mobileScrollSupport: true,
      clickEventForward: true,
      swipeDistance: 35,
    });

    // Deep clone source template pages so React's virtual DOM is undisturbed
    const sourcePages = Array.from(pagesSourceRef.current.children) as HTMLElement[];
    const pageClones = sourcePages.map((page) => page.cloneNode(true) as HTMLElement);

    pageFlip.loadFromHTML(pageClones);
    pageFlipRef.current = pageFlip;

    // Listen to page flip events
    pageFlip.on("flip", (e: { data: number }) => {
      setCurrentPageIdx(e.data);
      setIsFlipping(false);
    });

    // Monitor flipping physics state
    pageFlip.on("changeState", (e: { data: string }) => {
      if (e.data === "flipping" || e.data === "user_fold") {
        setIsFlipping(true);
      } else if (e.data === "read") {
        setIsFlipping(false);
      }
    });

    return () => {
      try {
        pageFlip.destroy();
      } catch (err) {
        console.error("Error during PageFlip cleanup:", err);
      }
      pageFlipRef.current = null;
      if (mountEl.parentNode) {
        mountEl.parentNode.removeChild(mountEl);
      }
    };
  }, []);

  // Jump to specific chapter
  const handleSelectChapter = useCallback((chIdx: number) => {
    if (!pageFlipRef.current) return;
    const targetPage = chIdx * 2;
    pageFlipRef.current.flip(targetPage);
  }, []);

  // Flip forward
  const handleNext = useCallback(() => {
    if (!pageFlipRef.current) return;
    pageFlipRef.current.flipNext();
  }, []);

  // Flip backward
  const handlePrev = useCallback(() => {
    if (!pageFlipRef.current) return;
    pageFlipRef.current.flipPrev();
  }, []);

  // Keyboard navigation listener (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* ========================================================= */}
      {/* TOP CONTROL BAR: Chapter Navigation Tabs & Keyboard Hint */}
      {/* ========================================================= */}
      <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        {/* Chapter Selection Ribbon */}
        <div className="flex w-full items-center gap-2 overflow-x-auto px-1 py-1 scrollbar-none sm:justify-center md:w-auto md:px-0 md:py-0">
          {bookChapters.map((ch, idx) => (
            <button
              key={ch.id}
              type="button"
              disabled={isFlipping}
              onClick={() => handleSelectChapter(idx)}
              className={`chapter-tab ${idx === currentChapterIdx ? "active" : ""}`}
              aria-label={`Go to Chapter ${ch.chapterNumber}: ${ch.chapterTitle}`}
            >
              <span className="font-semibold text-[var(--color-accent-primary)] mr-1.5">
                Ch. {ch.chapterNumber}
              </span>
              <span>{ch.period.split("—")[0].trim()}</span>
            </button>
          ))}
        </div>

        {/* Keyboard Navigation Hint */}
        <div className="hidden items-center gap-2 text-xs text-[var(--color-text-muted)] lg:flex">
          <span>Turn page:</span>
          <kbd className="kbd-hint">←</kbd>
          <kbd className="kbd-hint">→</kbd>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MAIN 3D REALISTIC BOOK SCENE WITH StPageFlip */}
      {/* ========================================================= */}
      <div className="book-scene">
        <div className="book-cover">
          {/* Stacked Paper Edges Depth */}
          <div className="book-spine-left" aria-hidden="true" />
          <div className="book-spine-right" aria-hidden="true" />

          {/* Central Bookmark ribbon decoration */}
          <div className="book-ribbon" title={`Chapter ${currentChapter.chapterNumber}`} />

          {/* StPageFlip Dynamic Canvas/DOM Container */}
          <div ref={containerRef} className="st-book-container" />
        </div>
      </div>

      {/* Hidden source templates for StPageFlip to clone from */}
      <div ref={pagesSourceRef} style={{ display: "none" }} aria-hidden="true">
        {bookChapters.flatMap((chapter) => [
          <div
            key={`page-${chapter.id}-left`}
            className="st-page st-page-left"
            data-density="soft"
          >
            <LeftPageContent chapter={chapter} />
          </div>,
          <div
            key={`page-${chapter.id}-right`}
            className="st-page st-page-right"
            data-density="soft"
          >
            <RightPageContent
              chapter={chapter}
              totalChapters={totalChapters}
            />
          </div>,
        ])}
      </div>
    </div>
  );
}
