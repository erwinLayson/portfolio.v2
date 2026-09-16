import { useState } from "react";
import { projects, getProjectImage } from "../constants/projects";
import SectionHeading from "../components/SectionHeading";
import ProjectCard from "../components/ProjectCard";
import Reveal from "../components/Reveal";

const PER_PAGE = 4;

export default function Projects() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(projects.length / PER_PAGE);
  const start = (currentPage - 1) * PER_PAGE;
  const pageProjects = projects.slice(start, start + PER_PAGE);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <section id="projects" className="scroll-mt-24 bg-zinc-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          title="Projects"
          subtitle="A selection of things I've designed, built, and shipped."
        />

        <div className="grid gap-6 sm:grid-cols-2">
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

        <nav
          aria-label="Projects pagination"
          className="mt-12 flex items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`h-10 w-10 rounded-xl text-sm font-medium transition-colors ${
                page === currentPage
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      </div>
    </section>
  );
}