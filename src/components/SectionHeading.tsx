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
    <Reveal className="mb-12">
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-4 max-w-2xl leading-relaxed text-zinc-600">
          {subtitle}
        </p>
      )}

      {children}
    </Reveal>
  );
}