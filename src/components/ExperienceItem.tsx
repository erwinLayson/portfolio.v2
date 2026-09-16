export type Experience = {
  role: string;
  company: string;
  period: string;
  points: string[];
};

export default function ExperienceItem({ role, company, period, points }: Experience) {
  return (
    <div className="grid gap-2 border-l-2 border-zinc-200 pb-10 pl-6 sm:grid-cols-[140px_1fr] sm:gap-8 last:pb-0">
      <p className="pt-0.5 text-sm text-zinc-500">{period}</p>
      <div>
        <h3 className="font-semibold text-zinc-900">{role}</h3>
        <p className="mt-0.5 text-sm text-zinc-500">{company}</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-zinc-600">
          {points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
