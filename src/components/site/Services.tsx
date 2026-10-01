import { ArrowUpRight, CalendarDays, Monitor, ReceiptText, ShoppingCart, Ticket, type LucideIcon } from "lucide-react";
import { SERVICES, type Service, type ServiceIcon } from "@/content/site";

const ICONS: Record<ServiceIcon, LucideIcon> = {
  invoice: ReceiptText,
  website: Monitor,
  ticket: Ticket,
  cart: ShoppingCart,
  calendar: CalendarDays,
};

function Price({ service, className = "" }: { service: Service; className?: string }) {
  return (
    <div className={`rounded-xl border border-line bg-gold/[0.06] px-4 py-2 text-center ${className}`}>
      {service.from && <span className="block text-[0.62rem] font-semibold tracking-[0.2em] text-sand/80">FROM</span>}
      <span className="block font-sans text-2xl font-bold tracking-tight text-gold-light">{service.price}</span>
    </div>
  );
}

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = ICONS[service.icon];
  return (
    <li
      data-reveal
      style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
      className="card group relative overflow-hidden rounded-2xl p-5 transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_0_50px_-18px_rgb(227_163_59/0.55)] sm:p-6"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-gold/15 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
      <div className="relative flex items-start gap-4 sm:gap-6">
        <span className="grid size-14 shrink-0 place-items-center rounded-xl border border-line-strong text-gold transition-all duration-500 group-hover:bg-gold group-hover:text-ink group-hover:shadow-[0_0_24px_-4px_rgb(227_163_59/0.8)] sm:size-16">
          <Icon className="size-7" strokeWidth={1.4} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-cream sm:text-xl">
            <span className="mr-1.5 text-gold">{index + 1}.</span>
            {service.title}
          </h3>
          <p className="mt-1.5 leading-relaxed text-muted">{service.description}</p>
          <Price service={service} className="mt-4 inline-block sm:hidden" />
        </div>
        <Price service={service} className="hidden shrink-0 sm:block" />
      </div>
    </li>
  );
}

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="relative py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start" data-reveal>
          <p className="eyebrow flex items-center gap-3 text-gold">
            <span className="h-px w-8 bg-current opacity-60" aria-hidden="true" />
            Our Services
          </p>
          <h2 id="services-title" className="display mt-5 text-4xl font-medium text-cream sm:text-5xl">
            Systems that help your business <em>run better</em>.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            From a professional website to the tools that run your day-to-day — invoicing, ticketing, orders and bookings. Clear starting prices, no surprises.
          </p>

          <div className="card mt-8 rounded-2xl p-6">
            <p className="font-display text-xl text-cream">Need something custom?</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Websites start from <strong className="text-gold-light">R8,500</strong>. For custom systems and larger projects, final pricing depends on the scope and your requirements — tell us what you need and we&apos;ll send you a quote.
            </p>
            <a
              href="#contact"
              className="group mt-5 inline-flex items-center gap-2 rounded-full border border-gold/60 px-5 py-2.5 text-sm font-semibold text-gold-light transition hover:bg-gold hover:text-ink"
            >
              Request a Quote
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <ul className="space-y-4">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.title} service={s} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
