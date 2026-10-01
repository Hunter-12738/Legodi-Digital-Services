import { PROCESS } from "@/content/site";

export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 left-1/2 size-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(227_163_59/0.12),transparent_65%)]" />
      <div className="container-x relative">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <p className="eyebrow flex items-center justify-center gap-3 text-gold">
            <span className="h-px w-8 bg-current opacity-60" aria-hidden="true" />
            How It Works
            <span className="h-px w-8 bg-current opacity-60" aria-hidden="true" />
          </p>
          <h2 id="process-title" className="display mt-5 text-4xl font-medium text-cream sm:text-5xl">
            From idea to launch in <em>four steps</em>.
          </h2>
        </div>

        <ol className="relative mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <span aria-hidden="true" className="absolute left-0 right-0 top-[3.1rem] hidden h-px bg-gradient-to-r from-gold/0 via-gold/40 to-gold/0 lg:block" />
          {PROCESS.map((step, i) => (
            <li
              key={step.title}
              data-reveal
              style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}
              className="group relative"
            >
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="font-display text-7xl font-semibold leading-none text-transparent transition-colors duration-700 [-webkit-text-stroke:1.2px_var(--color-gold)] group-hover:text-gold/15 sm:text-[5.5rem]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden="true" className="hidden size-2.5 rounded-full bg-gold shadow-[0_0_12px_rgb(227_163_59)] lg:block" />
              </div>
              <div className="card mt-6 rounded-2xl p-6 transition-all duration-500 group-hover:-translate-y-1 group-hover:border-line-strong">
                <h3 className="text-lg font-semibold text-cream">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
