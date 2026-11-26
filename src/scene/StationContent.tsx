import { useEffect, useRef, useState } from "react";
import mePortrait from "../assets/me.png";
import { aboutStats } from "../constants/about";
import { chronicleChapters } from "../constants/chronicle";
import { experience } from "../constants/experience";
import { gallery } from "../constants/gallery";
import { profile, socials } from "../constants/profile";
import { getProjectImage, projects } from "../constants/projects";
import {
  resumeEducation,
  resumeProjects,
  resumeSummary,
  technicalSkills,
} from "../constants/resume";
import { techStack } from "../constants/techStack";
import { useEnvironmentNav, type SectionId } from "../state/environmentNav";
import TechBadge from "../components/TechBadge";
import {
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  MonitorIcon,
} from "../components/icons";

const socialIcons = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  mail: MailIcon,
} as const;

function buildResumePlainText(): string {
  return `
ERWIN B. LAYSON
${profile.role}
Location: ${profile.location} | Email: ${profile.email}
LinkedIn: https://www.linkedin.com/in/erwinlayson | GitHub: https://github.com/erwinlayson

==================================================
PROFESSIONAL SUMMARY
==================================================
${resumeSummary}

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

${job.points.map((pt) => `• ${pt}`).join("\n")}`,
  )
  .join("\n\n")}

==================================================
KEY PROJECTS
==================================================
${resumeProjects
  .map(
    (proj) => `${proj.title}
Technologies: ${proj.technologies}
${proj.demo ? `Demo: ${proj.demo}\n` : ""}${proj.github ? `GitHub: ${proj.github}\n` : ""}${proj.points.map((pt) => `• ${pt}`).join("\n")}`,
  )
  .join("\n\n")}

==================================================
EDUCATION
==================================================
${resumeEducation.degree}
${resumeEducation.school}
${resumeEducation.period}
Relevant Coursework: ${resumeEducation.coursework}
`.trim();
}

function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <button
      type="button"
      className="station-btn station-btn--ghost"
      onClick={handleCopy}
    >
      {copied ? (
        <CheckIcon className="h-4 w-4 text-[var(--color-status-open)]" />
      ) : (
        <CopyIcon className="h-4 w-4" />
      )}
      <span>{copied ? "Email copied" : profile.email}</span>
    </button>
  );
}

function AboutStation() {
  return (
    <div className="station-grid station-grid--about">
      <div className="station-holo-portrait">
        <div className="station-holo-portrait__frame">
          <img
            src={mePortrait}
            alt={`Portrait of ${profile.name}`}
            className="station-holo-portrait__img"
          />
          <span className="station-holo-portrait__scan" aria-hidden="true" />
        </div>
        {profile.openToWork && (
          <div className="station-status-badge">
            <span className="station-status-dot" aria-hidden="true" />
            <span>Open to work</span>
          </div>
        )}
      </div>

      <div className="station-stack">
        <div>
          <p className="station-eyebrow">{profile.role}</p>
          <h3 className="station-name">{profile.name}</h3>
          <p className="station-lead">{profile.tagline}</p>
        </div>

        <p className="station-copy">
          I design and build full-stack web applications using React, TypeScript,
          Node.js, Express, and relational/cloud databases like MySQL and TiDB —
          turning institutional and real-world workflows into reliable software.
        </p>

        <div className="station-card">
          <span className="station-card__label">Education</span>
          <strong className="station-card__title">{resumeEducation.degree}</strong>
          <span className="station-card__sub">
            {resumeEducation.school} · {resumeEducation.period}
          </span>
        </div>

        <div className="station-stat-row">
          {aboutStats.map((stat) => (
            <div key={stat.label} className="station-stat">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>

        <div className="station-chip-row">
          {socials.map((social) => {
            const Icon = socialIcons[social.icon];
            return (
              <a
                key={social.name}
                href={social.url}
                target={social.url.startsWith("http") ? "_blank" : undefined}
                rel={social.url.startsWith("http") ? "noreferrer" : undefined}
                className="station-link-pill"
              >
                <Icon className="h-4 w-4" />
                <span>{social.name}</span>
                <ArrowUpRightIcon className="h-3.5 w-3.5" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TechStation() {
  const frontendItems =
    techStack.find((g) => g.category === "Frontend")?.items ?? [];
  const backendRaw =
    techStack.find((g) => g.category === "Backend")?.items ?? [];
  const databaseNames = new Set(["MySQL", "MongoDB", "TiDB", "PostgreSQL"]);
  const backendItems = backendRaw.filter((item) => !databaseNames.has(item));
  const databaseItems = ["MySQL", "TiDB", "MongoDB", "PostgreSQL"];
  const toolsAndDeployItems = Array.from(
    new Set([
      ...(techStack.find((g) => g.category === "Tools & Workflow")?.items ?? []),
      ...(techStack
        .find((g) => g.category === "Deployment")
        ?.items.filter((item) => !databaseNames.has(item)) ?? []),
    ]),
  );

  const panels = [
    { title: "Frontend", code: "UI LAYER", items: frontendItems },
    { title: "Backend", code: "API & LOGIC", items: backendItems },
    { title: "Databases", code: "DATA TIER", items: databaseItems },
    { title: "Development Tools", code: "WORKFLOW & CLOUD", items: toolsAndDeployItems },
  ];

  return (
    <div className="station-stack">
      <p className="station-lead">
        Core technologies and engineering tools organized across the full
        application stack.
      </p>
      <div className="station-tech-panels">
        {panels.map((panel) => (
          <section key={panel.title} className="station-subpanel">
            <header className="station-subpanel__head">
              <span>{panel.code}</span>
              <h3>{panel.title}</h3>
            </header>
            <div className="station-tech-grid">
              {panel.items.map((item) => (
                <div key={item} className="station-tech-slot">
                  <TechBadge label={item} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function ExperienceStation() {
  const [activeTab, setActiveTab] = useState<number>(chronicleChapters.length);
  const selectedChapter =
    activeTab < chronicleChapters.length ? chronicleChapters[activeTab] : null;
  const primaryJob = experience[0];

  return (
    <div className="station-stack">
      <p className="station-lead">
        Academic progression and hands-on full-stack software delivery from
        foundational systems programming to institutional SaaS architectures.
      </p>

      <div
        className="station-tab-strip"
        role="tablist"
        aria-label="Experience timeline milestones"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === chronicleChapters.length}
          className={`station-tab ${
            activeTab === chronicleChapters.length ? "is-active" : ""
          }`}
          onClick={() => setActiveTab(chronicleChapters.length)}
        >
          <span className="station-tab__meta">OVERVIEW</span>
          <span>Full-Stack Role</span>
        </button>
        {chronicleChapters.map((chapter, idx) => (
          <button
            key={chapter.id}
            type="button"
            role="tab"
            aria-selected={activeTab === idx}
            className={`station-tab ${activeTab === idx ? "is-active" : ""}`}
            onClick={() => setActiveTab(idx)}
          >
            <span className="station-tab__meta">
              CH. {chapter.chapterRoman} · {chapter.period.split("—")[0].trim()}
            </span>
            <span>{chapter.chapterTitle}</span>
          </button>
        ))}
      </div>

      {selectedChapter ? (
        <article className="station-timeline-panel" role="tabpanel">
          <div className="station-timeline-panel__head">
            <div>
              <p className="station-eyebrow">{selectedChapter.subtitle}</p>
              <h3>{selectedChapter.chapterTitle}</h3>
              <p className="station-card__sub">{selectedChapter.company}</p>
            </div>
            <span className="station-period-pill">{selectedChapter.period}</span>
          </div>

          <p className="station-copy">{selectedChapter.summary}</p>

          <div className="station-two-col">
            <div>
              <h4 className="station-mini-title">Responsibilities & Work</h4>
              <ul className="station-list">
                {selectedChapter.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </div>

            <div className="station-stack-sm">
              <div className="station-card">
                <h4 className="station-mini-title">Key Milestones</h4>
                <ul className="station-list station-list--compact">
                  {selectedChapter.keyAccomplishments.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="station-mini-title">Technologies</h4>
                <div className="station-chip-row">
                  {selectedChapter.technologies.map((tech) => (
                    <span key={tech} className="station-chip">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>
      ) : (
        <article className="station-timeline-panel" role="tabpanel">
          <div className="station-timeline-panel__head">
            <div>
              <p className="station-eyebrow">{primaryJob.company}</p>
              <h3>{primaryJob.role}</h3>
            </div>
            <span className="station-period-pill">{primaryJob.period}</span>
          </div>
          <ul className="station-list">
            {primaryJob.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
        </article>
      )}
    </div>
  );
}

function ProjectsStation() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeProject = projects[selectedIdx];
  const activeImage = getProjectImage(activeProject.title, activeProject.image);

  return (
    <div className="station-stack">
      <p className="station-lead">
        Select a holographic project node to inspect its architecture, stack,
        preview, and source links.
      </p>

      <div
        className="station-project-selector"
        role="tablist"
        aria-label="Featured software projects"
      >
        {projects.map((project, index) => {
          const thumb = getProjectImage(project.title, project.image);
          return (
            <button
              key={project.title}
              type="button"
              role="tab"
              aria-selected={selectedIdx === index}
              className={`station-project-node ${
                selectedIdx === index ? "is-selected" : ""
              }`}
              onClick={() => setSelectedIdx(index)}
            >
              <span className="station-project-node__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              {thumb && (
                <img
                  src={thumb}
                  alt=""
                  className="station-project-node__thumb"
                  aria-hidden="true"
                />
              )}
              <span className="station-project-node__title">{project.title}</span>
            </button>
          );
        })}
      </div>

      <article className="station-project-stage" role="tabpanel">
        <div className="station-project-stage__media">
          {activeImage ? (
            <img
              src={activeImage}
              alt={`${activeProject.title} application preview`}
              className="station-project-stage__img"
            />
          ) : (
            <div className="station-project-stage__empty">
              <MonitorIcon className="h-8 w-8" />
              <span>Preview unavailable</span>
            </div>
          )}
        </div>

        <div className="station-project-stage__info">
          <p className="station-eyebrow">
            PROJECT {String(selectedIdx + 1).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </p>
          <h3 className="station-name">{activeProject.title}</h3>
          <p className="station-copy">{activeProject.description}</p>

          <div className="station-chip-row">
            {activeProject.tech.map((tech) => (
              <span key={tech} className="station-chip">
                {tech}
              </span>
            ))}
          </div>

          <div className="station-actions">
            {activeProject.demo ? (
              <a
                href={activeProject.demo}
                target="_blank"
                rel="noreferrer"
                className="station-btn"
              >
                <span>Open Live Demo</span>
                <ArrowUpRightIcon className="h-4 w-4" />
              </a>
            ) : (
              <span className="station-muted-pill">Demo deployment pending</span>
            )}
            {activeProject.github && (
              <a
                href={activeProject.github}
                target="_blank"
                rel="noreferrer"
                className="station-btn station-btn--ghost"
              >
                <GitHubIcon className="h-4 w-4" />
                <span>View Source</span>
              </a>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

function ResumeStation() {
  const handleDownloadTxt = () => {
    const content = buildResumePlainText();
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Erwin_B_Layson_Resume.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="station-stack">
      <div className="station-actions">
        <a
          href="/resume"
          target="_blank"
          rel="noreferrer"
          className="station-btn"
        >
          <span>Open Full Resume · Print / Save PDF</span>
          <ArrowUpRightIcon className="h-4 w-4" />
        </a>
        <button
          type="button"
          className="station-btn station-btn--ghost"
          onClick={handleDownloadTxt}
        >
          <span>Download ATS Plain Text (.txt)</span>
        </button>
      </div>

      <div className="station-resume-sheet">
        <div className="station-resume-sheet__head">
          <div>
            <h3>{profile.name}</h3>
            <p className="station-eyebrow">{profile.role}</p>
          </div>
          <span className="station-card__sub">
            {profile.location} · {profile.email}
          </span>
        </div>

        <p className="station-copy">{resumeSummary}</p>

        <div className="station-two-col">
          <div className="station-card">
            <h4 className="station-mini-title">Technical Skills</h4>
            <div className="station-skill-lines">
              {technicalSkills.map((item) => (
                <p key={item.category}>
                  <strong>{item.category}:</strong> {item.skills}
                </p>
              ))}
            </div>
          </div>

          <div className="station-stack-sm">
            <div className="station-card">
              <h4 className="station-mini-title">Key Projects</h4>
              <ul className="station-list station-list--compact">
                {resumeProjects.map((project) => (
                  <li key={project.title}>
                    <strong>{project.title}</strong> — {project.technologies}
                  </li>
                ))}
              </ul>
            </div>

            <div className="station-card">
              <h4 className="station-mini-title">Education</h4>
              <p className="station-copy">
                <strong>{resumeEducation.degree}</strong>
                <br />
                {resumeEducation.school}
                <br />
                {resumeEducation.period}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactStation() {
  return (
    <div className="station-stack">
      {profile.openToWork && (
        <div className="station-status-badge">
          <span className="station-status-dot" aria-hidden="true" />
          <span>Available for full-stack opportunities</span>
        </div>
      )}

      <p className="station-lead">
        Let&apos;s build something together. Reach out directly by email or
        connect on GitHub and LinkedIn.
      </p>

      <div className="station-card">
        <h3 className="station-mini-title">Direct Email Uplink</h3>
        <div className="station-actions">
          <a href={`mailto:${profile.email}`} className="station-btn">
            <MailIcon className="h-4 w-4" />
            <span>Send Email</span>
          </a>
          <CopyEmailButton />
        </div>
      </div>

      <div className="station-card">
        <h3 className="station-mini-title">Network Channels</h3>
        <div className="station-chip-row">
          {socials.map((social) => {
            const Icon = socialIcons[social.icon];
            return (
              <a
                key={social.name}
                href={social.url}
                target={social.url.startsWith("http") ? "_blank" : undefined}
                rel={social.url.startsWith("http") ? "noreferrer" : undefined}
                className="station-link-pill"
              >
                <Icon className="h-4 w-4" />
                <span>{social.name}</span>
                <ArrowUpRightIcon className="h-3.5 w-3.5" />
              </a>
            );
          })}
        </div>
      </div>

      <p className="station-card__sub">Base location: {profile.location}</p>
    </div>
  );
}

function TestimonialStation() {
  const { openSection } = useEnvironmentNav();
  const linkedIn = socials.find((s) => s.icon === "linkedin");

  return (
    <div className="station-stack">
      <div className="station-empty">
        <span className="station-empty__diamond" aria-hidden="true" />
        <h3>Verified Testimonials Pending</h3>
        <p>
          No client or peer testimonials are currently published in this
          portfolio. Only real, verified recommendations will be displayed here
          once added.
        </p>
        <div className="station-actions">
          {linkedIn && (
            <a
              href={linkedIn.url}
              target="_blank"
              rel="noreferrer"
              className="station-btn station-btn--ghost"
            >
              <LinkedInIcon className="h-4 w-4" />
              <span>LinkedIn Profile</span>
              <ArrowUpRightIcon className="h-3.5 w-3.5" />
            </a>
          )}
          <button
            type="button"
            className="station-btn"
            onClick={() => openSection("contact")}
          >
            <span>Open Contact Uplink</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function BackstageStation() {
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const featured = gallery[selectedPhotoIdx];

  const workflowPillars = [
    {
      title: "Architecture & APIs",
      detail:
        "MVC pattern, separation of concerns, RESTful API design, authentication, and role-based access control (RBAC).",
    },
    {
      title: "Databases & Scale",
      detail:
        "Normalized relational schemas in MySQL and cloud-distributed TiDB alongside MongoDB for real-time tracking.",
    },
    {
      title: "Containerization & QA",
      detail:
        "Docker and Docker Compose environments, unit testing database-driven logic, and Git/GitHub version workflows.",
    },
    {
      title: "Institutional & SaaS Focus",
      detail:
        "Presenting ModuLearn SaaS proposals and building institutional software with UP Cebu TTBDO.",
    },
  ];

  return (
    <div className="station-stack">
      <p className="station-lead">
        Engineering workflow, architectural principles, and visual moments from
        on-the-job training at UP Cebu TTBDO.
      </p>

      <div className="station-workflow-grid">
        {workflowPillars.map((pillar) => (
          <div key={pillar.title} className="station-card">
            <h3 className="station-mini-title">{pillar.title}</h3>
            <p className="station-copy">{pillar.detail}</p>
          </div>
        ))}
      </div>

      <div className="station-gallery-stage">
        <figure className="station-gallery-featured">
          <img src={featured.image} alt={featured.title} />
          <figcaption>
            <strong>{featured.title}</strong>
            <span>{featured.description}</span>
          </figcaption>
        </figure>

        <div className="station-gallery-thumbs" role="group" aria-label="OJT photo archive">
          {gallery.map((item, idx) => (
            <button
              key={item.title}
              type="button"
              className={`station-gallery-thumb ${
                selectedPhotoIdx === idx ? "is-active" : ""
              }`}
              aria-pressed={selectedPhotoIdx === idx}
              onClick={() => setSelectedPhotoIdx(idx)}
            >
              <img src={item.image} alt="" aria-hidden="true" />
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StationContent({ section }: { section: SectionId }) {
  switch (section) {
    case "about":
      return <AboutStation />;
    case "tech":
      return <TechStation />;
    case "experience":
      return <ExperienceStation />;
    case "projects":
      return <ProjectsStation />;
    case "resume":
      return <ResumeStation />;
    case "contact":
      return <ContactStation />;
    case "testimonial":
      return <TestimonialStation />;
    case "backstage":
      return <BackstageStation />;
  }
}
