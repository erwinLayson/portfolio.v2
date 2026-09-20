export type Experience = {
  role: string;
  company: string;
  period: string;
  points: string[];
};

export default function ExperienceItem({ role, company, period, points }: Experience) {
  return (
    <div className="relative grid gap-3 border-l-2 border-[var(--color-border-default)] pb-12 pl-6 sm:grid-cols-[160px_1fr] sm:gap-10 last:pb-0">
      {/* Timeline dot */}
      <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-[var(--color-accent-primary)]" />
      <p className="text-sm font-medium text-[var(--color-text-muted)]">{period}</p>
      <div>
        <h3 className="text-[17px] font-bold leading-snug text-[var(--color-text-primary)] sm:text-lg">{role}</h3>
        <p className="mt-1 text-sm text-[var(--color-accent-primary)]">{company}</p>
        <ul className="mt-5 space-y-3 text-[14px] leading-relaxed text-[var(--color-text-secondary)] sm:text-sm">
          {points.map((point) => (
            <li key={point} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-border-emphasis)]" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
