import { useState, useEffect, useRef, useCallback } from "react";
import { bookChapters } from "./bookData";
import BookPageSpread from "./BookPageSpread";
import LeftPageContent from "./LeftPageContent";
import RightPageContent from "./RightPageContent";
import Pagination from "../Pagination";
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
      <Pagination
        currentPage={currentChapterIdx + 1}
        totalPages={total}
        disabled={isFlipping}
        onPageChange={(page) => handleSelectChapter(page - 1)}
        prevLabel="Previous Page"
        nextLabel="Next Page"
        indicatorLabel={`Chapter ${currentChapter.chapterNumber} of ${total} • Pages ${currentChapter.chapterNumber * 2 - 1}–${currentChapter.chapterNumber * 2}`}
        ariaLabel="Experience chapters pagination"
      />
    </div>
  );
}
