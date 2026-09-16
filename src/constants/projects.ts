export type Project = {
  title: string;
  description: string;
  tech: string[];
  image?: string;
  github?: string;
  demo?: string;
};

const images = import.meta.glob("/src/assets/projects/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

/**
 * Resolves the image for a project card.
 * Precedence: explicit `image` prop -> file named after the title -> undefined.
 */
export function getProjectImage(title: string, image?: string): string | undefined {
  if (image) {
    // An explicit relative filename is resolved against the projects folder.
    return images[`/src/assets/projects/${image}`] ?? image;
  }
  const slug = title.toLowerCase().replace(/\s+/g, "-");
  const key = Object.keys(images).find((path) =>
    path.startsWith(`/src/assets/projects/${slug}.`),
  );
  return key ? images[key] : undefined;
}

export const projects: Project[] = [
  {
    title: "GradeSync",
    description:
      "A school management platform with role-based portals for admins, teachers, and students — handling enrollments, attendance, an online gradebook, and analytics dashboards behind protected routes.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Node.js", "MySQL"],
    image: "abang.png",
    github: "https://github.com/erwinLayson/gradeSync-client-side.git",
    demo: "https://grade-sync-client-side.vercel.app/",
  },
  {
    title: "OSAS - Scholarship Application and Management System",
    description:
      "A scholarship system for a state university — students register and track applications online, while admins manage scholarship programs, review submissions, and generate reports from a dedicated dashboard.",
    image: "osas.png",
    tech: ["React", "Tailwind CSS", "JavaScript", "Node.js", "Express", "MySQL"],
    github: "https://github.com/erwinLayson/Scholarship-Application-and-Management-System.git",
    demo: "https://erwinlayson.github.io/Scholarship-Application-and-Management-System/",
  },
  {
    title: "P2P Bus Tracking System",
    description:
      "A real-time bus tracking system for point-to-point routes: passengers follow buses on a live map, drivers broadcast their location and manage routes, and admins oversee drivers and the fleet.",
    image: 'p2p.png',
    tech: ["React", "Tailwind CSS", "Socket.IO", "JavaScript", "Node.js", "Leaflet", "Express", "MongoDB"],
    demo: "https://erwinlayson.github.io/P2P-bus-tracking-system-client-side/",
    github: "https://github.com/erwinLayson/P2P-bus-tracking-system-client-side.git",
  }
];
