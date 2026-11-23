import SectionHeading from "../components/SectionHeading";
import DigitalBook from "../components/DigitalBook/DigitalBook";
import Reveal from "../components/Reveal";

export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6">
      <SectionHeading
        title="Experience"
        subtitle="An interactive digital chronicle of my software engineering journey, academic milestones, and real-world project deliveries."
      />

      <Reveal>
        <div className="mt-10">
          <DigitalBook />
        </div>
      </Reveal>
    </section>
  );
}
