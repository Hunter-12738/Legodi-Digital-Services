import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";
import { PROJECTS, type Project } from "@/content/site";

const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");

function Mockup({ project, priority }: { project: Project; priority?: boolean }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={-1}
      aria-hidden="true"
      className="group/mock relative block"
    >
      <div className="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle_at_50%_40%,rgb(227_163_59/0.16),transparent_65%)] opacity-60 blur-xl transition-opacity duration-700 group-hover/mock:opacity-100" />
      <div className="relative overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)] transition-[transform,box-shadow] duration-700 ease-[var(--ease-out-expo)] group-hover/mock:-translate-y-1.5 group-hover/mock:shadow-[0_50px_90px_-40px_rgb(0_0_0/1),0_0_50px_-15px_rgb(227_163_59/0.45)]">
        <div className="flex items-center gap-3 border-b border-line bg-surface-2 px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
          </span>
          <span className="mx-auto truncate rounded-md bg-ink/70 px-3 py-0.5 text-xs text-muted">{host(project.url)}</span>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={project.image}
            alt={`Homepage of the ${project.title} website`}
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            priority={priority}
            className="object-cover object-top transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover/mock:scale-[1.04]"
          />
        </div>
      </div>
    </a>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;
  return (
    <article data-reveal className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16" aria-labelledby={`project-${index}`}>
      <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
        <Mockup project={project} priority={index === 0} />
      </div>
      <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <div className="flex items-center gap-4">
          <span className="font-display text-sm text-gold">
            {String(index + 1).padStart(2, "0")} <span className="text-faint">/ {String(PROJECTS.length).padStart(2, "0")}</span>
          </span>
          <span className="h-px flex-1 bg-line" aria-hidden="true" />
        </div>
        <p className="eyebrow mt-5 text-[0.68rem] text-gold/90">{project.category}</p>
        <h3 id={`project-${index}`} className="display mt-3 text-3xl font-medium text-cream sm:text-4xl">
          {project.title}
        </h3>
        <p className="mt-4 leading-relaxed text-muted">{project.description}</p>
        <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {project.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-sand/90">
              <Check className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-8 inline-flex items-center gap-2 rounded-full border border-gold/60 px-6 py-3 text-sm font-semibold text-gold-light transition hover:bg-gold hover:text-ink hover:shadow-[0_0_30px_-8px_rgb(227_163_59/0.8)]"
        >
          View Website
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          <span className="sr-only">— {host(project.url)} (opens in a new tab)</span>
        </a>
      </div>
    </article>
  );
}

export function Portfolio() {
  return (
    <section id="work" aria-labelledby="work-title" className="relative overflow-hidden bg-night py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="container-x">
        <div className="max-w-2xl" data-reveal>
          <p className="eyebrow flex items-center gap-3 text-gold">
            <span className="h-px w-8 bg-current opacity-60" aria-hidden="true" />
            Our Work
          </p>
          <h2 id="work-title" className="display mt-5 text-4xl font-medium text-cream sm:text-5xl">
            Built for real businesses, <em>live today</em>.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            A selection of websites and systems we&apos;ve built for South African businesses and organisations. Every one is live — take a look.
          </p>
        </div>
        <div className="mt-20 space-y-24 sm:space-y-32">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.url} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
