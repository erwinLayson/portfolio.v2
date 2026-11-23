import { useState } from "react";
import { profile, socials } from "../constants/profile";
import { experience } from "../constants/experience";
import {
  CheckIcon,
  CopyIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
} from "../components/icons";

const technicalSkills = [
  {
    category: "Frontend Development",
    skills: "React, TypeScript, JavaScript, Tailwind CSS, Vite, HTML5, CSS3, Bootstrap",
  },
  {
    category: "Backend Development",
    skills: "Node.js, Express.js, PHP, RESTful API Development",
  },
  {
    category: "Databases",
    skills: "MySQL, TiDB, MongoDB, PostgreSQL",
  },
  {
    category: "Architecture & Security",
    skills: "MVC Architecture, Role-Based Access Control (RBAC), Authentication, Authorization, Relational Database Design",
  },
  {
    category: "Tools & Development Workflow",
    skills: "Git, GitHub, Postman, VS Code, Docker, Docker Compose",
  },
  {
    category: "Testing & Deployment",
    skills: "Unit Testing, Debugging, Vercel, Render, Netlify",
  },
];

const resumeProjects = [
  {
    title: "GRADESYNC — SCHOOL MANAGEMENT SYSTEM",
    technologies: "React, TypeScript, Tailwind CSS, Node.js, Express.js, MySQL, TiDB",
    demo: "https://grade-sync-client-side.vercel.app/",
    github: "https://github.com/erwinLayson/gradeSync-client-side",
    points: [
      "Led the development of a school management platform with dedicated administrator, teacher, and student portals.",
      "Implemented student enrollment, attendance tracking, gradebook management, and academic reporting workflows.",
      "Developed RESTful APIs, authentication, protected routes, and role-based access control to manage user permissions.",
    ],
  },
  {
    title: "OSAS — SCHOLARSHIP APPLICATION AND MANAGEMENT SYSTEM",
    technologies: "React, Tailwind CSS, JavaScript, Node.js, Express.js, MySQL",
    demo: "https://osas-frontend.vercel.app/home",
    github: "https://github.com/erwinLayson/Scholarship-Application-and-Management-System",
    points: [
      "Developed a university scholarship management portal enabling students to browse programs, submit digital applications, and monitor evaluation progress online.",
      "Built administrative management modules for staff to review student submissions, verify documentation, manage scholarship quotas, and generate reports.",
      "Implemented authentication, form validation, and relational MySQL database schemas to ensure data integrity across application records.",
    ],
  },
  {
    title: "SALONEASE — APPOINTMENT BOOKING AND MANAGEMENT SYSTEM",
    technologies: "React, TypeScript, Tailwind CSS, Node.js, Express.js, MySQL",
    demo: "https://salonease-seven.vercel.app/",
    github: "https://github.com/erwinLayson/salonease",
    points: [
      "Developed an online appointment booking and scheduling system for salon clients and service staff.",
      "Implemented real-time service selection, calendar-based appointment scheduling, and automated booking status management.",
      "Built role-based administrative dashboards for salon staff to manage service catalogs, monitor client bookings, and streamline daily operations.",
    ],
  },
];

export default function ResumePage() {
  const [copied, setCopied] = useState(false);

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
Full-Stack Web Developer with hands-on experience designing, developing, and deploying database-driven web applications using React, TypeScript, Node.js, Express.js, and MySQL. Experienced in building RESTful APIs, implementing authentication and role-based access control (RBAC), designing relational database structures, and developing end-to-end business workflows. Led the development of a school management capstone system and contributed to multiple software projects involving academic management, scholarship applications, appointment booking, and real-time tracking. Familiar with Docker, cloud database deployment, software testing, and application maintenance.

==================================================
TECHNICAL SKILLS
==================================================
${technicalSkills.map((item) => `• ${item.category}: ${item.skills}`).join("\n")}

==================================================
EXPERIENCE & LEADERSHIP
==================================================
${experience
        .map(
          (job) => `${job.role}
${job.company} | ${job.period}

${job.points.map((pt) => `• ${pt}`).join("\n\n")}
`
        )
        .join("\n")}
==================================================
KEY PROJECTS
==================================================
${resumeProjects
        .map(
          (p) => `${p.title}

Technologies: ${p.technologies}

${p.demo ? `Demo: ${p.demo}\n` : ""}${p.github ? `GitHub: ${p.github}\n` : ""}
${p.points.map((pt) => `• ${pt}`).join("\n")}
`
        )
        .join("\n")}
==================================================
EDUCATION
==================================================
BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY
Sultan Kudarat State University (SKSU), Philippines
2023 – Present | Expected Graduation: 2027

Relevant Coursework:
Database Management Systems, Software Engineering, Object-Oriented Programming, Web Development, Data Structures and Algorithms.
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
                Full-Stack Web Developer with hands-on experience designing, developing, and deploying database-driven web applications using React, TypeScript, Node.js, Express.js, and MySQL. Experienced in building RESTful APIs, implementing authentication and role-based access control (RBAC), designing relational database structures, and developing end-to-end business workflows. Led the development of a school management capstone system and contributed to multiple software projects involving academic management, scholarship applications, appointment booking, and real-time tracking. Familiar with Docker, cloud database deployment, software testing, and application maintenance.
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
                {technicalSkills.map((item) => (
                  <p key={item.category}>
                    <strong className="font-semibold text-[var(--color-text-primary)] print:text-black">
                      {item.category}:{" "}
                    </strong>
                    {item.skills}
                  </p>
                ))}
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
              <div className="mt-3 space-y-5 print:mt-2 print:space-y-3">
                {resumeProjects.map((proj) => (
                  <div key={proj.title} className="break-inside-avoid print:break-inside-avoid">
                    <h3 className="text-sm font-bold text-[var(--color-text-primary)] print:text-[13px] print:text-black">
                      {proj.title}
                    </h3>

                    <p className="mt-1 text-xs text-[var(--color-text-secondary)] print:text-xs print:text-black sm:text-[13.5px]">
                      <strong className="font-semibold text-[var(--color-text-primary)] print:text-black">
                        Technologies:{" "}
                      </strong>
                      {proj.technologies}
                    </p>

                    {(proj.demo || proj.github) && (
                      <div className="mt-1 space-y-0.5 text-xs text-[var(--color-text-secondary)] print:hidden sm:text-[13.5px]">
                        {proj.demo && (
                          <p>
                            <strong className="font-semibold text-[var(--color-text-primary)]">
                              Demo:{" "}
                            </strong>
                            <a
                              href={proj.demo}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[var(--color-accent-primary)] hover:underline"
                            >
                              {proj.demo}
                            </a>
                          </p>
                        )}
                        {proj.github && (
                          <p>
                            <strong className="font-semibold text-[var(--color-text-primary)]">
                              GitHub:{" "}
                            </strong>
                            <a
                              href={proj.github}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[var(--color-accent-primary)] hover:underline"
                            >
                              {proj.github}
                            </a>
                          </p>
                        )}
                      </div>
                    )}

                    <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-[var(--color-text-secondary)] print:text-xs print:text-black sm:text-[13px]">
                      {proj.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
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
              <div className="mt-2.5">
                <div className="flex flex-col justify-between sm:flex-row sm:items-baseline">
                  <h3 className="text-sm font-bold text-[var(--color-text-primary)] print:text-[13px] print:text-black">
                    BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY
                  </h3>
                  <span className="text-xs font-medium text-[var(--color-text-muted)] print:text-xs print:text-gray-700">
                    2023 – Present | Expected Graduation: 2027
                  </span>
                </div>
                <p className="mt-0.5 text-xs font-semibold text-[var(--color-accent-secondary)] print:text-xs print:text-gray-800">
                  Sultan Kudarat State University (SKSU), Philippines
                </p>
                <div className="mt-2 text-xs text-[var(--color-text-secondary)] print:text-xs print:text-black sm:text-[13px]">
                  <p className="font-semibold text-[var(--color-text-primary)] print:text-black">
                    Relevant Coursework:
                  </p>
                  <p className="mt-0.5 leading-relaxed">
                    Database Management Systems, Software Engineering, Object-Oriented Programming, Web Development, Data Structures and Algorithms.
                  </p>
                </div>
              </div>
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
