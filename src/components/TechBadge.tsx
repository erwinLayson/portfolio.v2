import type { IconType } from "react-icons";
import {
  SiCss,
  SiExpress,
  SiFigma,
  SiGit,
  SiGithub,
  SiHtml5,
  SiMongodb,
  SiNodedotjs,
  SiPostgresql,
  SiPostman,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from "react-icons/si";
import { TbApi } from "react-icons/tb";
import { VscVscode } from "react-icons/vsc";

// Maps each tech name (from src/constants/techStack.ts) to its brand icon
// and brand color. Add new entries here when you add technologies to the stack.
const techMeta: Record<string, { icon: IconType; color: string }> = {
  React: { icon: SiReact, color: "#149ECA" },
  TypeScript: { icon: SiTypescript, color: "#3178C6" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#06B6D4" },
  Vite: { icon: SiVite, color: "#646CFF" },
  HTML: { icon: SiHtml5, color: "#E34F26" },
  CSS: { icon: SiCss, color: "#1572B6" },
  "Node.js": { icon: SiNodedotjs, color: "#5FA04E" },
  Express: { icon: SiExpress, color: "#404040" },
  PostgreSQL: { icon: SiPostgresql, color: "#4169E1" },
  MongoDB: { icon: SiMongodb, color: "#47A248" },
  "REST APIs": { icon: TbApi, color: "#52525B" },
  Git: { icon: SiGit, color: "#F05032" },
  GitHub: { icon: SiGithub, color: "#181717" },
  Figma: { icon: SiFigma, color: "#F24E1E" },
  Postman: { icon: SiPostman, color: "#FF6C37" },
  "VS Code": { icon: VscVscode, color: "#007ACC" },
};

type TechBadgeProps = {
  label: string;
};

export default function TechBadge({ label }: TechBadgeProps) {
  const meta = techMeta[label];
  const Icon = meta?.icon;

  return (
    <div className="group flex min-w-0 items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/70">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-100 bg-zinc-50 transition-transform duration-300 group-hover:scale-110">
        {Icon && (
          <Icon
            className="h-5 w-5"
            style={{ color: meta?.color }}
            aria-hidden="true"
          />
        )}
      </span>
      <span className="truncate text-sm font-semibold text-zinc-800">
        {label}
      </span>
    </div>
  );
}
