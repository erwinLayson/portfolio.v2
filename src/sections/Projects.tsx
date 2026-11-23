import { useState, useEffect } from "react";
import { projects, getProjectImage } from "../constants/projects";
import SectionHeading from "../components/SectionHeading";
import ProjectCard from "../components/ProjectCard";
import Reveal from "../components/Reveal";
import Pagination from "../components/Pagination";

const PER_PAGE_LARGE = 4;
const PER_PAGE_MOBILE = 2;

export default function Projects() {
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = typeof window !== "undefined" && window.innerWidth >= 640 ? PER_PAGE_LARGE : PER_PAGE_MOBILE;
  const totalPages = Math.ceil(projects.length / perPage);
  const start = (currentPage - 1) * perPage;
  const pageProjects = projects.slice(start, start + perPage);

  // Reset to page 1 when crossing the breakpoint so the user never lands on an
  // empty page after resizing (either direction).
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 640px)");
    const handleChange = () => setCurrentPage(1);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="projects" className="scroll-mt-24 bg-[var(--color-bg-secondary)] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          title="Projects"
          subtitle="A selection of things I've designed, built, and shipped."
        />

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          {pageProjects.map((project, index) => (
            <Reveal key={project.title} className="h-full" delay={(index % 2) * 75}>
              <ProjectCard
                title={project.title}
                description={project.description}
                tech={project.tech}
                image={getProjectImage(project.title, project.image)}
                github={project.github}
                demo={project.demo}
              />
            </Reveal>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          prevLabel="Previous"
          nextLabel="Next"
          indicatorLabel={`Page ${currentPage} of ${totalPages}`}
          ariaLabel="Projects pagination"
        />
      </div>
    </section>
  );
}
