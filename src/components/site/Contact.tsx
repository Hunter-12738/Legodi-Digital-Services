import { Phone } from "lucide-react";
import { SITE, telHref, whatsappHref } from "@/content/site";
import { WhatsappIcon } from "@/components/ui/SocialIcons";
import { ContactForm } from "./ContactForm";

/** The two direct-contact cards (WhatsApp + Call), styled after the brand's contact card. */
export function DirectContact() {
  const cards = [
    {
      label: "WhatsApp",
      value: SITE.whatsapp,
      href: whatsappHref(SITE.whatsapp, `Hi ${SITE.name}, I'd like to discuss a project.`),
      external: true,
      icon: (
        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_0_24px_-6px_rgb(37_211_102/0.7)]">
          <WhatsappIcon className="size-8" />
        </span>
      ),
    },
    {
      label: "Call",
      value: SITE.phone,
      href: telHref(SITE.phone),
      external: false,
      icon: (
        <span className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-gold text-gold">
          <Phone className="size-6" strokeWidth={1.8} />
        </span>
      ),
    },
  ];
  return (
    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
      {cards.map((c) => (
        <li key={c.label}>
          <a
            href={c.href}
            {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="card group flex items-center gap-4 rounded-2xl p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_0_40px_-14px_rgb(227_163_59/0.6)]"
            aria-label={`${c.label} ${c.value}${c.external ? " (opens WhatsApp)" : ""}`}
          >
            <span aria-hidden="true">{c.icon}</span>
            <span className="min-w-0">
              <span className="block text-base font-medium text-cream">{c.label}</span>
              <span className="block whitespace-nowrap text-xl font-semibold tracking-tight text-gold-light transition-colors group-hover:text-gold">
                {c.value}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-1/3 size-[34rem] rounded-full bg-[radial-gradient(circle,rgb(227_163_59/0.12),transparent_65%)]" />
      <div className="container-x relative grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5" data-reveal>
          <p className="eyebrow flex items-center gap-3 text-gold">
            <span className="h-px w-8 bg-current opacity-60" aria-hidden="true" />
            Contact Me
          </p>
          <h2 id="contact-title" className="display mt-5 text-4xl font-medium text-cream sm:text-5xl">
            Have a project in mind? <em>Let&apos;s talk.</em>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Tell us about your business and what you need — a new website, a booking or ordering system, invoicing, ticketing or
            something custom. Message on WhatsApp, call, or send the form and we&apos;ll get back to you.
          </p>
          <div className="mt-10">
            <DirectContact />
          </div>
          <p className="mt-6 text-sm text-faint">
            Websites from <span className="text-gold-light">R8,500</span>. Custom projects are quoted on scope and requirements.
          </p>
        </div>

        <div className="lg:col-span-7" data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
          <div className="card rounded-[1.75rem] p-6 shadow-[0_40px_80px_-50px_rgb(0_0_0/0.9)] sm:p-10">
            <h3 className="mb-6 font-display text-2xl text-cream">Send an enquiry</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
