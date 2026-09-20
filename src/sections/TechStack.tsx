import { techStack } from "../constants/techStack";
import SectionHeading from "../components/SectionHeading";
import TechBadge from "../components/TechBadge";
import Reveal from "../components/Reveal";

export default function TechStack() {
  const total = techStack.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <section id="tech-stack" className="scroll-mt-24 bg-[var(--color-bg-secondary)] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          title="Tech Stack"
          subtitle={`The ${total} tools and technologies I use to bring ideas to life.`}
        />

        <div className="space-y-8 sm:space-y-10">
          {techStack.map((group, groupIndex) => (
            <Reveal key={group.category} delay={groupIndex * 100}>
              <div>
                <h3 className="mb-4 text-xs font-semibold tracking-[0.2em] text-[var(--color-text-muted)] uppercase">
                  {group.category}
                </h3>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
                  {group.items.map((item) => (
                    <TechBadge key={item} label={item} />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}