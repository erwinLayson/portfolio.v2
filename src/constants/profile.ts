// ============================================================
// Your identity and social links.
// Used by: AboutMe, ContactMe, Footer (and about stats).
// Replace the placeholder values with your real data.
// ============================================================

export const profile = {
  name: "Erwin B. Layson",
  role: "Full-Stack Web Developer",
  tagline:
    "I build modern, reliable web applications.",
  techHighlights: ["React", "TypeScript", "Node.js", "MySQL"],
  email: "laysonerwin97@gmail.com", // TODO: replace with your real email
  location: "Philippines",
  openToWork: true,
};

export const socials = [
  {
    name: "GitHub",
    url: "https://github.com/erwinlayson",
    icon: "github" as const,
    description: "Check out my code and open-source work.",
    cta: "Follow",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/erwinlayson",
    icon: "linkedin" as const,
    description: "Let's connect professionally.",
    cta: "Connect",
  },
  {
    name: "Email",
    url: `mailto:${profile.email}`,
    icon: "mail" as const,
    description: "The fastest way to reach me.",
    cta: "Say hi",
  },
];
