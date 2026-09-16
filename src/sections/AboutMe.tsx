import { aboutStats } from "../constants/about";
import { profile, socials } from "../constants/profile";
import SectionHeading from "../components/SectionHeading";
import { GitHubIcon, LinkedInIcon, MailIcon } from "../components/icons";
import Reveal from "../components/Reveal";

export default function AboutMe() {
  return (
    <section id="about" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-24">
      <SectionHeading
        title="About Me"
        subtitle="A quick introduction to who I am and what I do."
      />

      <Reveal className="max-w-3xl">
        <div className="space-y-4 leading-relaxed text-zinc-600">
          <p>
            Hi, I'm <span className="font-semibold text-zinc-900">{profile.name}</span> — a{" "}
            {profile.role} based in {profile.location}.
          </p>
          <p>{profile.tagline}</p>
          <p>
            I enjoy turning complex problems into simple, beautiful interfaces, and I care
            about writing code that is easy to read, maintain, and scale.
          </p>
        </div>
      </Reveal>

      <Reveal className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" delay={100}>
        {aboutStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-zinc-200 p-6">
            <dt className="text-sm text-zinc-500">{stat.label}</dt>
            <dd className="mt-1 text-xl font-semibold text-zinc-900">{stat.value}</dd>
          </div>
        ))}
        {profile.openToWork && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <dt className="text-sm text-emerald-600">Status</dt>
            <dd className="mt-1 flex items-center gap-2 text-xl font-semibold text-emerald-700">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              </span>
              Open to work
            </dd>
          </div>
        )}
      </Reveal>

      <Reveal className="mt-12 flex gap-5 text-zinc-400" delay={200}>
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            aria-label={social.name}
            className="transition-colors hover:text-zinc-900"
          >
            {social.icon === "github" && <GitHubIcon className="h-6 w-6" />}
            {social.icon === "linkedin" && <LinkedInIcon className="h-6 w-6" />}
            {social.icon === "mail" && <MailIcon className="h-6 w-6" />}
          </a>
        ))}
      </Reveal>
    </section>
  );
}