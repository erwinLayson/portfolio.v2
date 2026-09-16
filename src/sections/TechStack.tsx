import { techStack } from "../constants/techStack";
import SectionHeading from "../components/SectionHeading";
import TechBadge from "../components/TechBadge";
import Reveal from "../components/Reveal";

export default function TechStack() {
  const total = techStack.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <section id="tech-stack" className="scroll-mt-24 bg-zinc-50 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          title="Tech Stack"
          subtitle={`The ${total} tools and technologies I use to bring ideas to life.`}
        />

        <div className="space-y-6">
          {techStack.map((group, groupIndex) => (
            <Reveal key={group.category} delay={groupIndex * 100}>
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-4">
                  <h3 className="text-sm font-semibold tracking-widest text-zinc-500 uppercase">
                    {group.category}
                  </h3>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500">
                    {group.items.length}
                  </span>
                  <span className="h-px flex-1 bg-zinc-100" aria-hidden="true" />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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