import { useState, useEffect } from "react";
import { gallery, type GalleryImage } from "../constants/gallery";
import SectionHeading from "./SectionHeading";
import Pagination from "./Pagination";

const PER_PAGE_MOBILE = 3;
const PER_PAGE_SM = 6;
const PER_PAGE_MD = 9;

function GalleryCard({ item }: { item: GalleryImage }) {
  return (
    <article className="group relative overflow-hidden border border-[var(--color-border-default)] bg-[var(--color-bg-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent-primary)]/40 hover:shadow-lg hover:shadow-[var(--color-accent-primary)]/10">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-[var(--color-bg-secondary)]">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-dark)]/70 via-[var(--color-primary-dark)]/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>

      {/* Caption */}
      <div className="p-5 sm:p-6">
        <h3 className="text-[15px] font-bold tracking-tight text-[var(--color-text-primary)] sm:text-base">
          {item.title}
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-text-secondary)] sm:text-sm">
          {item.description}
        </p>
      </div>

      {/* Top accent line */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[var(--color-accent-gradient)] transition-transform duration-500 group-hover:scale-x-100"
      />
    </article>
  );
}

export default function Gallery() {
  const [currentPage, setCurrentPage] = useState(1);

  const perPage =
    typeof window === "undefined"
      ? PER_PAGE_MOBILE
      : window.innerWidth >= 768
        ? PER_PAGE_MD
        : window.innerWidth >= 640
          ? PER_PAGE_SM
          : PER_PAGE_MOBILE;

  const totalPages = Math.max(1, Math.ceil(gallery.length / perPage));
  const start = (currentPage - 1) * perPage;
  const pageItems = gallery.slice(start, start + perPage);

  // Reset to page 1 whenever the visible page size changes across breakpoints,
  // so the user never lands on an empty page after resizing.
  useEffect(() => {
    const md = window.matchMedia("(min-width: 768px)");
    const sm = window.matchMedia("(min-width: 640px)");

    const handleChange = () => setCurrentPage(1);
    md.addEventListener("change", handleChange);
    sm.addEventListener("change", handleChange);

    return () => {
      md.removeEventListener("change", handleChange);
      sm.removeEventListener("change", handleChange);
    };
  }, []);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="gallery"
      className="scroll-mt-24 bg-[var(--color-bg-secondary)] py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          title="Gallery"
          subtitle="A selection of visuals and previews from recent work."
        />

        {/* Page block: mobile 3 / sm+ 6 / md+ 9 cards */}
        <div
          className="grid gap-6
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3"
        >
          {pageItems.map((item) => (
            <GalleryCard key={item.title} item={item} />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          prevLabel="Previous"
          nextLabel="Next"
          indicatorLabel={`Page ${currentPage} of ${totalPages}`}
          ariaLabel="Gallery pagination"
        />
      </div>
    </section>
  );
}
