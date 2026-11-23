import { useState } from "react";
import { profile, socials } from "../constants/profile";
import { techStack } from "../constants/techStack";
import { experience } from "../constants/experience";
import { projects } from "../constants/projects";
import {
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
} from "../components/icons";

export default function ResumePage() {
  const [copied, setCopied] = useState(false);

  // Group technologies by standard categories for ATS parsing
  const frontendSkills = techStack.find((g) => g.category === "Frontend")?.items ?? [];
  const backendSkills = techStack.find((g) => g.category === "Backend")?.items ?? [];
  const toolsSkills = techStack.find((g) => g.category === "Tools & Workflow")?.items ?? [];
  const deploySkills = techStack.find((g) => g.category === "Deployment")?.items ?? [];

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPlainText = async () => {
    const plainText = `
ERWIN B. LAYSON
Full-Stack Web Developer
Location: Philippines | Email: ${profile.email}
LinkedIn: https://www.linkedin.com/in/erwinlayson | GitHub: https://github.com/erwinlayson

==================================================
PROFESSIONAL SUMMARY
==================================================
Dedicated and detail-oriented Full-Stack Web Developer with a strong foundation in building scalable, reliable, and user-centric web applications. Proficient in React, TypeScript, Node.js, Express.js, and SQL/NoSQL databases (MySQL, TiDB, PostgreSQL, MongoDB). Proven leadership as Capstone Project Leader and Programmer, delivering production-ready platforms including school management systems (GradeSync), university scholarship portals (OSAS), appointment booking platforms (Salonease), and real-time tracking systems (P2P Bus Tracking). Experienced in RESTful API development, Role-Based Access Control (RBAC), Docker containerization, and modern deployment pipelines (Vercel, Render).

==================================================
TECHNICAL SKILLS
==================================================
• Frontend: ${frontendSkills.join(", ")}
• Backend & APIs: ${backendSkills.join(", ")}
• Tools & Workflow: ${toolsSkills.join(", ")}
• Deployment & Cloud: ${deploySkills.join(", ")}
• Architecture & Concepts: MVC Architecture, Full-Stack Architecture, Role-Based Access Control (RBAC), Authentication, Responsive Web Design, Unit Testing & Debugging

==================================================
EXPERIENCE & LEADERSHIP
==================================================
${experience
  .map(
    (job) => `${job.role.toUpperCase()}
${job.company} | ${job.period}
${job.points.map((pt) => `• ${pt}`).join("\n")}
`
  )
  .join("\n")}
==================================================
KEY PROJECTS
==================================================
${projects
  .map(
    (p) => `${p.title.toUpperCase()}
Technologies: ${p.tech.join(", ")}
${p.demo ? `Demo: ${p.demo}\n` : ""}${p.github ? `GitHub: ${p.github}\n` : ""}• ${p.description}
`
  )
  .join("\n")}
==================================================
EDUCATION
==================================================
BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY (BSIT)
Sultan Kudarat State University (SKSU), Philippines
2023 — Present (Expected Graduation: 2027 | 4th Year College)
• Capstone Project Leader and Lead Programmer
• Core Studies: Web Development, Database Management Systems, Software Engineering, Object-Oriented Programming (OOP), Data Structures & Algorithms
`.trim();

    try {
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleBackToPortfolio = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.opener) {
      window.close();
    } else {
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] antialiased print:bg-white print:text-black">
      {/* Top action toolbar (hidden on print) */}
      <header className="resume-toolbar print-hidden sticky top-0 z-40 border-b border-[var(--color-border-default)] bg-[var(--color-bg-primary)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <a
            href="/"
            onClick={handleBackToPortfolio}
            className="group flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent-primary)]"
          >
            <svg
              className="h-4 w-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Portfolio</span>
          </a>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={handleCopyPlainText}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border-emphasis)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] transition-all hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] sm:text-sm"
              title="Copy plain text version for ATS job applications"
            >
              {copied ? (
                <>
                  <CheckIcon className="h-4 w-4 text-[var(--color-status-open)]" />
                  <span>Copied Text!</span>
                </>
              ) : (
                <>
                  <CopyIcon className="h-4 w-4 text-[var(--color-text-muted)]" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-accent-primary)] px-4 py-1.5 text-xs font-semibold text-[var(--color-primary-white)] transition-all hover:bg-[var(--color-accent-secondary)] hover:shadow-md hover:shadow-[var(--color-accent-primary)]/30 sm:text-sm"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Resume Document Container */}
      <main className="resume-page-container mx-auto max-w-4xl px-4 py-8 sm:px-8 sm:py-12">
        <article className="resume-article rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] p-6 shadow-xl sm:p-10 md:p-12">
          {/* ========================================================= */}
          {/* ATS HEADER: Contact Information */}
          {/* ========================================================= */}
          <header className="border-b border-[var(--color-border-default)] pb-6 text-center print:border-b-2 print:border-black print:pb-4 sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] print:text-2xl print:text-black sm:text-4xl">
              {profile.name}
            </h1>
            <p className="mt-1 text-lg font-semibold text-[var(--color-accent-primary)] print:text-base print:text-black">
              {profile.role}
            </p>

            {/* ATS-friendly contact list */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-[var(--color-text-secondary)] print:text-xs print:text-black sm:justify-start sm:text-sm">
              <span className="flex items-center gap-1.5">
                <MailIcon className="h-3.5 w-3.5 text-[var(--color-accent-primary)] print:hidden" />
                <a
                  href={`mailto:${profile.email}`}
                  className="hover:underline text-[var(--color-text-secondary)] print:text-black"
                >
                  {profile.email}
                </a>
              </span>

              <span className="hidden text-[var(--color-border-emphasis)] sm:inline print:text-black">•</span>

              <span>{profile.location}</span>

              <span className="hidden text-[var(--color-border-emphasis)] sm:inline print:text-black">•</span>

              <span className="flex items-center gap-1">
                <LinkedInIcon className="h-3.5 w-3.5 text-[var(--color-accent-primary)] print:hidden" />
                <a
                  href="https://www.linkedin.com/in/erwinlayson"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline text-[var(--color-text-secondary)] print:text-black"
                >
                  linkedin.com/in/erwinlayson
                </a>
              </span>

              <span className="hidden text-[var(--color-border-emphasis)] sm:inline print:text-black">•</span>

              <span className="flex items-center gap-1">
                <GitHubIcon className="h-3.5 w-3.5 text-[var(--color-accent-primary)] print:hidden" />
                <a
                  href="https://github.com/erwinlayson"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline text-[var(--color-text-secondary)] print:text-black"
                >
                  github.com/erwinlayson
                </a>
              </span>
            </div>
          </header>

          <div className="mt-6 space-y-7 print:mt-2.5 print:space-y-3">
            {/* ========================================================= */}
            {/* PROFESSIONAL SUMMARY */}
            {/* ========================================================= */}
            <section aria-labelledby="section-summary">
              <h2
                id="section-summary"
                className="text-xs font-bold tracking-[0.18em] text-[var(--color-accent-primary)] uppercase print:border-b print:border-gray-400 print:pb-0.5 print:text-xs print:font-bold print:text-black sm:text-sm"
              >
                Professional Summary
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)] print:text-xs print:text-black sm:text-[13.5px]">
                Dedicated and detail-oriented Full-Stack Web Developer with a strong foundation in building scalable, reliable, and user-centric web applications. Proficient in React, TypeScript, Node.js, Express.js, and SQL/NoSQL databases (MySQL, TiDB, PostgreSQL, MongoDB). Proven leadership as Capstone Project Leader and Programmer, delivering production-ready platforms including school management systems (GradeSync), university scholarship portals (OSAS), appointment booking platforms (Salonease), and real-time tracking systems (P2P Bus Tracking). Experienced in RESTful API development, Role-Based Access Control (RBAC), Docker containerization, and modern deployment pipelines (Vercel, Render).
              </p>
            </section>

            {/* ========================================================= */}
            {/* TECHNICAL SKILLS */}
            {/* ========================================================= */}
            <section aria-labelledby="section-skills">
              <h2
                id="section-skills"
                className="text-xs font-bold tracking-[0.18em] text-[var(--color-accent-primary)] uppercase print:border-b print:border-gray-400 print:pb-0.5 print:text-xs print:font-bold print:text-black sm:text-sm"
              >
                Technical Skills
              </h2>
              <div className="mt-2 space-y-1.5 text-xs text-[var(--color-text-secondary)] print:text-xs print:text-black sm:text-[13.5px]">
                <p>
                  <strong className="font-semibold text-[var(--color-text-primary)] print:text-black">Frontend Development: </strong>
                  {frontendSkills.join(", ")}
                </p>
                <p>
                  <strong className="font-semibold text-[var(--color-text-primary)] print:text-black">Backend & APIs: </strong>
                  {backendSkills.join(", ")}
                </p>
                <p>
                  <strong className="font-semibold text-[var(--color-text-primary)] print:text-black">Databases & Storage: </strong>
                  MySQL, TiDB (Cloud Distributed SQL), PostgreSQL, MongoDB
                </p>
                <p>
                  <strong className="font-semibold text-[var(--color-text-primary)] print:text-black">DevOps, Tools & Workflow: </strong>
                  {toolsSkills.concat(deploySkills).join(", ")}
                </p>
                <p>
                  <strong className="font-semibold text-[var(--color-text-primary)] print:text-black">Architecture & Concepts: </strong>
                  Model-View-Controller (MVC) Pattern, Component-Driven Development, Role-Based Access Control (RBAC), Authentication, RESTful API Design, Real-Time WebSockets (Socket.IO), Database Normalization & Schema Design, Unit Testing, Debugging
                </p>
              </div>
            </section>

            {/* ========================================================= */}
            {/* WORK EXPERIENCE & LEADERSHIP */}
            {/* ========================================================= */}
            <section aria-labelledby="section-experience">
              <h2
                id="section-experience"
                className="text-xs font-bold tracking-[0.18em] text-[var(--color-accent-primary)] uppercase print:border-b print:border-gray-400 print:pb-0.5 print:text-xs print:font-bold print:text-black sm:text-sm"
              >
                Experience & Leadership
              </h2>
              <div className="mt-3 space-y-5 print:mt-2 print:space-y-2.5">
                {experience.map((job) => (
                  <div key={`${job.role}-${job.period}`} className="print:break-inside-auto">
                    <div className="flex flex-col justify-between sm:flex-row sm:items-baseline">
                      <h3 className="text-sm font-bold text-[var(--color-text-primary)] print:text-[13px] print:text-black">
                        {job.role}
                      </h3>
                      <span className="text-xs font-medium text-[var(--color-text-muted)] print:text-xs print:text-gray-700">
                        {job.period}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[var(--color-accent-secondary)] print:text-xs print:text-gray-800">
                      {job.company}
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-[var(--color-text-secondary)] print:text-xs print:text-black sm:text-[13px]">
                      {job.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================= */}
            {/* KEY PROJECTS */}
            {/* ========================================================= */}
            <section aria-labelledby="section-projects">
              <h2
                id="section-projects"
                className="text-xs font-bold tracking-[0.18em] text-[var(--color-accent-primary)] uppercase print:border-b print:border-gray-400 print:pb-0.5 print:text-xs print:font-bold print:text-black sm:text-sm"
              >
                Key Projects
              </h2>
              <div className="mt-3 space-y-4 print:space-y-3">
                {projects.map((proj) => (
                  <div key={proj.title} className="break-inside-avoid print:break-inside-avoid">
                    <div className="flex flex-col justify-between sm:flex-row sm:items-baseline">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[var(--color-text-primary)] print:text-[13px] print:text-black">
                          {proj.title}
                        </h3>
                        {proj.demo && (
                          <a
                            href={proj.demo}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[var(--color-accent-primary)] hover:underline print:hidden"
                          >
                            <span>Live Demo</span>
                            <ArrowUpRightIcon className="h-3 w-3" />
                          </a>
                        )}
                        {proj.github && (
                          <a
                            href={proj.github}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[var(--color-text-muted)] hover:underline print:hidden"
                          >
                            <span>Code</span>
                            <ArrowUpRightIcon className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      <span className="text-xs font-medium text-[var(--color-text-muted)] print:text-xs print:text-gray-700">
                        {proj.tech.slice(0, 5).join(" • ")}
                      </span>
                    </div>

                    <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-secondary)] print:text-xs print:text-black sm:text-[13px]">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================= */}
            {/* EDUCATION */}
            {/* ========================================================= */}
            <section aria-labelledby="section-education" className="break-inside-avoid print:break-inside-avoid">
              <h2
                id="section-education"
                className="text-xs font-bold tracking-[0.18em] text-[var(--color-accent-primary)] uppercase print:border-b print:border-gray-400 print:pb-0.5 print:text-xs print:font-bold print:text-black sm:text-sm"
              >
                Education
              </h2>
              <div className="mt-2 flex flex-col justify-between sm:flex-row sm:items-baseline">
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-text-primary)] print:text-[13px] print:text-black">
                    Bachelor of Science in Information Technology (BSIT)
                  </h3>
                  <p className="text-xs font-semibold text-[var(--color-accent-secondary)] print:text-xs print:text-gray-800">
                    Sultan Kudarat State University (SKSU), Philippines
                  </p>
                </div>
                <span className="text-xs font-medium text-[var(--color-text-muted)] print:text-xs print:text-gray-700">
                  2023 — Present (Expected Graduation: 2027)
                </span>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-[var(--color-text-secondary)] print:text-xs print:text-black sm:text-[13px]">
                <li>Currently 4th Year College student maintaining an active focus on practical full-stack software development.</li>
                <li>Served as Capstone Project Leader and Lead Programmer; successfully presented and defended project milestones.</li>
                <li>Relevant coursework: Web Application Development, Database Systems, Software Engineering, Object-Oriented Programming, Data Structures & Algorithms.</li>
              </ul>
            </section>
          </div>
        </article>
      </main>

      {/* Footer (hidden on print) */}
      <footer className="resume-footer print-hidden border-t border-[var(--color-border-subtle)] py-6 text-center text-xs text-[var(--color-text-muted)]">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 px-4 sm:flex-row">
          <p>© {new Date().getFullYear()} Erwin B. Layson. ATS Compliant Resume.</p>
          <div className="flex gap-4">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[var(--color-accent-primary)]"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
