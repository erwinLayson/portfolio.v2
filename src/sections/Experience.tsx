import { experience } from "../constants/experience";
import SectionHeading from "../components/SectionHeading";
import ExperienceItem from "../components/ExperienceItem";
import Reveal from "../components/Reveal";

export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-24">
      <SectionHeading
        title="Experience"
        subtitle="Where I've worked and what I've built along the way."
      />

      <div>
        {experience.map((job) => (
          <Reveal key={`${job.company}-${job.period}`}>
            <ExperienceItem
              role={job.role}
              company={job.company}
              period={job.period}
              points={job.points}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}