import type { BookChapter } from "./bookData";
import LeftPageContent from "./LeftPageContent";
import RightPageContent from "./RightPageContent";

type BookPageSpreadProps = {
  chapter: BookChapter;
  totalChapters: number;
  onNextPage?: () => void;
  hasNext: boolean;
};

export default function BookPageSpread({
  chapter,
  totalChapters,
  onNextPage,
  hasNext,
}: BookPageSpreadProps) {
  return (
    <div className="book-spread">
      {/* Central spine gutter with shadow (desktop) */}
      <div className="book-gutter" aria-hidden="true" />

      {/* Decorative bookmark ribbon */}
      <div className="book-ribbon" title={`Chapter ${chapter.chapterNumber}`} />

      {/* Left Page */}
      <LeftPageContent chapter={chapter} />

      {/* Right Page */}
      <RightPageContent
        chapter={chapter}
        totalChapters={totalChapters}
        hasNext={hasNext}
        onNextPage={onNextPage}
      />
    </div>
  );
}
