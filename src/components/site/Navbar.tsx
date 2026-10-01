"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NAV_LINKS, SITE } from "@/content/site";
import { Logo } from "./Logo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#top");
  const firstLink = useRef<HTMLAnchorElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.querySelector(l.href)).filter(Boolean) as Element[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const toggleButton = toggle.current;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      toggleButton?.focus();
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-line bg-ink/75 py-3 backdrop-blur-xl" : "border-b border-transparent py-5"
      }`}
    >
      <nav className="container-x flex items-center justify-between gap-6" aria-label="Main">
        <a href="#top" className="shrink-0" aria-label={`${SITE.name} — home`}>
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                aria-current={active === l.href ? "true" : undefined}
                className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  active === l.href ? "text-cream" : "text-muted hover:text-cream"
                }`}
              >
                {l.label}
                <span
                  className={`absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-500 ${
                    active === l.href ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="group hidden items-center gap-2 whitespace-nowrap rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:bg-gold-light hover:shadow-[0_0_30px_-6px_rgb(227_163_59/0.7)] sm:inline-flex"
          >
            Start Your Project
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <button
            ref={toggle}
            type="button"
            onClick={() => setOpen(true)}
            className="grid size-11 place-items-center rounded-full border border-line bg-white/[0.03] text-cream lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-0 z-50 flex flex-col bg-ink lg:hidden"
      >
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-[radial-gradient(circle,rgb(227_163_59/0.22),transparent_65%)]" />
        <div className="container-x relative flex items-center justify-between py-5">
          <Logo />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="grid size-11 place-items-center rounded-full border border-line text-cream"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>
        <ul className="container-x relative mt-4 flex flex-1 flex-col overflow-y-auto">
          {NAV_LINKS.map((l, i) => (
            <li key={l.href} className={open ? "animate-rise" : ""} style={{ animationDelay: `${40 + i * 40}ms` }}>
              <a
                ref={i === 0 ? firstLink : undefined}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between border-b border-white/[0.07] py-4 font-display text-3xl text-cream"
              >
                {l.label}
                <span className="font-sans text-xs tracking-widest text-gold/70">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="container-x relative pb-8 pt-6">
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 font-semibold text-ink"
          >
            Start Your Project <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
