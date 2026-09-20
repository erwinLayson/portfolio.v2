import type { ReactNode } from "react";
import Reveal from "./Reveal";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export default function SectionHeading({
  title,
  subtitle,
  children,
}: SectionHeadingProps) {
  return (
    <Reveal className="mb-10 sm:mb-12">
      <h2 className="text-[1.65rem] font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      <div className="mt-3 h-1 w-12 rounded-full bg-[var(--color-accent-gradient)]" />

      {subtitle && (
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
          {subtitle}
        </p>
      )}

      {children}
    </Reveal>
  );
}