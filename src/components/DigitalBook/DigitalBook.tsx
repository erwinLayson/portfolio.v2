import { useState, useEffect, useRef, useCallback } from "react";
import { bookChapters } from "./bookData";
import BookPageSpread from "./BookPageSpread";
import LeftPageContent from "./LeftPageContent";
import RightPageContent from "./RightPageContent";
import "./DigitalBook.css";

type FlipState = {
  direction: "forward" | "backward";
  fromIdx: number;
  toIdx: number;
} | null;

export default function DigitalBook() {
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [flipState, setFlipState] = useState<FlipState>(null);

  // Synchronous ref to strictly block simultaneous page turns
  const isFlippingRef = useRef(false);

  // Touch gesture state for mobile swiping
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = bookChapters.length;
  const currentChapter = bookChapters[currentChapterIdx];

  const triggerFlip = useCallback(
    (targetIdx: number, direction: "forward" | "backward") => {
      if (isFlippingRef.current) return;
      if (targetIdx < 0 || targetIdx >= total) return;
      if (targetIdx === currentChapterIdx) return;

      isFlippingRef.current = true;
      setFlipState({
        direction,
        fromIdx: currentChapterIdx,
        toIdx: targetIdx,
      });

      // 800ms matches the physical 3D animation duration
      setTimeout(() => {
        setCurrentChapterIdx(targetIdx);
        setFlipState(null);
        isFlippingRef.current = false;
      }, 790);
    },
    [currentChapterIdx, total]
  );

  const handleNext = useCallback(() => {
    if (currentChapterIdx < total - 1) {
      triggerFlip(currentChapterIdx + 1, "forward");
    }
  }, [currentChapterIdx, total, triggerFlip]);

  const handlePrev = useCallback(() => {
    if (currentChapterIdx > 0) {
      triggerFlip(currentChapterIdx - 1, "backward");
    }
  }, [currentChapterIdx, triggerFlip]);

  const handleSelectChapter = useCallback(
    (index: number) => {
      if (index === currentChapterIdx || isFlippingRef.current) return;
      triggerFlip(index, index > currentChapterIdx ? "forward" : "backward");
    },
    [currentChapterIdx, triggerFlip]
  );

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

  // Touch swipe support for mobile & tablet screens
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (diff > minSwipeDistance) {
      handleNext();
    } else if (diff < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const isFlipping = flipState !== null;

  return (
    <div
      className="mx-auto w-full max-w-5xl"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* ========================================================= */}
      {/* TOP CONTROL BAR: Chapter Navigation Tabs & Keyboard Hint */}
      {/* ========================================================= */}
      <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        {/* Chapter Selection Ribbon */}
        <div className="flex w-full items-center gap-2 overflow-x-auto pb-2 scrollbar-none md:w-auto md:pb-0">
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
      {/* MAIN 3D REALISTIC BOOK SCENE */}
      {/* ========================================================= */}
      <div className="book-scene">
        <div className="book-cover">
          {/* Stacked Paper Edges Depth */}
          <div className="book-spine-left" aria-hidden="true" />
          <div className="book-spine-right" aria-hidden="true" />

          {/* Book Stage with Perspective and 3D Leaf Animation */}
          <div className="book-flip-stage">
            {/* ----------------------------------------------------- */}
            {/* STATE 1: Idle (Static Spread) */}
            {/* ----------------------------------------------------- */}
            {!flipState && (
              <BookPageSpread
                chapter={currentChapter}
                totalChapters={total}
                onNextPage={handleNext}
                hasNext={currentChapterIdx < total - 1}
              />
            )}

            {/* ----------------------------------------------------- */}
            {/* STATE 2: Flipping Forward (Right to Left: 0deg to -180deg) */}
            {/* ----------------------------------------------------- */}
            {flipState && flipState.direction === "forward" && (
              <>
                <div className="book-spread">
                  <div className="book-gutter" aria-hidden="true" />
                  <div className="book-ribbon" title={`Chapter ${bookChapters[flipState.toIdx].chapterNumber}`} />

                  {/* Base Left Page (stays stationary on the left) */}
                  <LeftPageContent chapter={bookChapters[flipState.fromIdx]} />

                  {/* Base Right Page (Revealed Underneath as the leaf lifts away) */}
                  <div className="relative h-full w-full overflow-hidden">
                    <RightPageContent
                      chapter={bookChapters[flipState.toIdx]}
                      totalChapters={total}
                    />
                    {/* Dynamic cast shadow from the lifting leaf */}
                    <div className="revealed-cast-shadow" aria-hidden="true" />
                  </div>
                </div>

                {/* The 3D Rotating Leaf (outside book-spread so overflow never clips the 3D arc) */}
                <div className="flipping-leaf-container flipping-leaf-forward">
                  <div className="flipping-leaf">
                    {/* Front Face: Current Right Page */}
                    <div className="leaf-face leaf-front">
                      <RightPageContent
                        chapter={bookChapters[flipState.fromIdx]}
                        totalChapters={total}
                      />
                      <div className="leaf-shadow-front" aria-hidden="true" />
                      <div className="leaf-sheen" aria-hidden="true" />
                    </div>

                    {/* Back Face: Next Left Page */}
                    <div className="leaf-face leaf-back">
                      <LeftPageContent chapter={bookChapters[flipState.toIdx]} />
                      <div className="leaf-shadow-back" aria-hidden="true" />
                      <div className="leaf-sheen" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ----------------------------------------------------- */}
            {/* STATE 3: Flipping Backward (Left to Right: 0deg to 180deg) */}
            {/* ----------------------------------------------------- */}
            {flipState && flipState.direction === "backward" && (
              <>
                <div className="book-spread">
                  <div className="book-gutter" aria-hidden="true" />
                  <div className="book-ribbon" title={`Chapter ${bookChapters[flipState.toIdx].chapterNumber}`} />

                  {/* Base Left Page (Revealed Underneath on the left) */}
                  <div className="relative h-full w-full overflow-hidden">
                    <LeftPageContent chapter={bookChapters[flipState.toIdx]} />
                    {/* Dynamic cast shadow from the lifting leaf */}
                    <div className="revealed-cast-shadow-left" aria-hidden="true" />
                  </div>

                  {/* Base Right Page (stays stationary on the right) */}
                  <RightPageContent
                    chapter={bookChapters[flipState.fromIdx]}
                    totalChapters={total}
                  />
                </div>

                {/* The 3D Rotating Leaf (outside book-spread) */}
                <div className="flipping-leaf-container flipping-leaf-backward">
                  <div className="flipping-leaf">
                    {/* Front Face: Current Left Page */}
                    <div className="leaf-face leaf-front">
                      <LeftPageContent chapter={bookChapters[flipState.fromIdx]} />
                      <div className="leaf-shadow-front" aria-hidden="true" />
                      <div className="leaf-sheen" aria-hidden="true" />
                    </div>

                    {/* Back Face: Previous Right Page */}
                    <div className="leaf-face leaf-back">
                      <RightPageContent
                        chapter={bookChapters[flipState.toIdx]}
                        totalChapters={total}
                      />
                      <div className="leaf-shadow-back" aria-hidden="true" />
                      <div className="leaf-sheen" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BOTTOM NAVIGATION CONTROLS & PROGRESS INDICATOR */}
      {/* ========================================================= */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentChapterIdx === 0 || isFlipping}
          className={`flex items-center gap-2 rounded-full border border-[var(--color-border-default)] px-5 py-2.5 text-sm font-semibold transition-all ${
            currentChapterIdx === 0 || isFlipping
              ? "cursor-not-allowed opacity-30 text-[var(--color-text-muted)]"
              : "bg-[var(--color-bg-card)] text-[var(--color-text-primary)] hover:border-[var(--color-accent-primary)] hover:bg-[var(--color-bg-elevated)] hover:shadow-md"
          }`}
          aria-label="Previous Chapter"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous Page</span>
        </button>

        {/* Center Progress Dots & Page Indicator */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            {bookChapters.map((_, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isFlipping}
                onClick={() => handleSelectChapter(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentChapterIdx
                    ? "w-8 bg-gradient-to-r from-[var(--color-brand-blue)] to-[var(--color-accent-cyan)] shadow-sm shadow-[var(--color-accent-cyan)]/50"
                    : "w-2.5 bg-[var(--color-border-emphasis)] hover:bg-[var(--color-text-muted)]"
                }`}
                aria-label={`Jump to page ${idx + 1}`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-[var(--color-text-muted)]">
            Chapter {currentChapter.chapterNumber} of {total} &bull; Pages {currentChapter.chapterNumber * 2 - 1}–{currentChapter.chapterNumber * 2}
          </span>
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentChapterIdx === total - 1 || isFlipping}
          className={`flex items-center gap-2 rounded-full border border-[var(--color-border-default)] px-5 py-2.5 text-sm font-semibold transition-all ${
            currentChapterIdx === total - 1 || isFlipping
              ? "cursor-not-allowed opacity-30 text-[var(--color-text-muted)]"
              : "bg-[var(--color-accent-primary)] text-[var(--color-primary-white)] hover:bg-[var(--color-accent-secondary)] hover:shadow-lg hover:shadow-[var(--color-accent-primary)]/30"
          }`}
          aria-label="Next Chapter"
        >
          <span>Next Page</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
