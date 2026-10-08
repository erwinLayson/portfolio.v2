import { useState, useEffect } from "react";
import { gallery, type GalleryImage } from "../constants/gallery";
import SectionHeading from "./SectionHeading";

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

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

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

        {totalPages > 1 && (
          <nav
            aria-label="Gallery pagination"
            className="mt-12 flex flex-row items-center justify-center gap-3"
          >
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-emphasis)] hover:text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <div
              className="overflow-x-auto max-h-[80px] w-full
                max-w-[90%] sm:max-w-[90%] lg:max-w-[50%]
                flex items-center justify-center rounded-xl
                border border-[var(--color-border-default)]
                bg-[var(--color-bg-card)] px-2 py-1
              "
              style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(24,185,232,0.5) rgba(10,15,26,0.6)" }}
            >
              <div className="flex items-center gap-2">
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`h-10 w-10 rounded-xl text-sm font-medium transition-colors flex-shrink-0 ${
                      page === currentPage
                        ? "bg-[var(--color-accent-primary)] text-[var(--color-primary-white)]"
                        : "border border-[var(--color-border-default)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-emphasis)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-emphasis)] hover:text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
