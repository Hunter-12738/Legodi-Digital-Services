import { NAV_LINKS, SITE, telHref, whatsappHref } from "@/content/site";
import { Logo } from "./Logo";

const LINKS = NAV_LINKS.filter((l) => l.href !== "#process");

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-night">
      <div className="container-x grid gap-12 py-16 sm:py-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-6 max-w-sm leading-relaxed text-muted">
            We design and build websites, automation and custom digital systems that help businesses attract customers, save time
            and operate more efficiently.
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <h2 className="eyebrow text-gold">Explore</h2>
          <ul className="mt-5 space-y-3">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-muted transition hover:text-gold-light">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h2 className="eyebrow text-gold">Contact</h2>
          <ul className="mt-5 space-y-3 text-muted">
            <li>
              <a href={telHref(SITE.phone)} className="transition hover:text-gold-light">
                Call: {SITE.phone}
              </a>
            </li>
            <li>
              <a href={whatsappHref(SITE.whatsapp)} target="_blank" rel="noopener noreferrer" className="transition hover:text-gold-light">
                WhatsApp: {SITE.whatsapp}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <p className="container-x py-6 text-sm text-faint">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
