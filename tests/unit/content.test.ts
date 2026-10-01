import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PROJECTS, SERVICES, SITE, telHref, whatsappHref } from "@/content/site";
import { cleanText, Fields } from "@/lib/validation";

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

describe("content requirements", () => {
  it("never shows the old R1,500 website price anywhere in the source", () => {
    for (const file of walk(join(process.cwd(), "src"))) {
      expect(readFileSync(file, "utf8"), file).not.toMatch(/R\s?1[ ,.]?500/);
    }
  });

  it("prices websites from R8,500 and lists the five services", () => {
    expect(SERVICES.map((s) => s.title)).toEqual([
      "Invoice & Quotation System",
      "Websites",
      "Event Ticketing",
      "Ordering System",
      "Booking System",
    ]);
    expect(SERVICES.find((s) => s.title === "Websites")).toMatchObject({ from: true, price: "R8,500" });
  });

  it("every project has a real description, an existing screenshot and an https link", () => {
    expect(PROJECTS.map((p) => new URL(p.url).hostname)).toEqual(["sanicha.co.za", "sadf.co.za", "saulglenworks.co.za", "zeeswigology.co.za"]);
    for (const p of PROJECTS) {
      expect(p.url).toMatch(/^https:\/\//);
      expect(p.description.length).toBeGreaterThan(150);
      expect(p.description).not.toMatch(/goes here|lorem|placeholder/i);
      expect(p.features.length).toBeGreaterThan(2);
      expect(existsSync(join(process.cwd(), "public", p.image)), p.image).toBe(true);
    }
    expect(PROJECTS.find((p) => p.url.includes("sadf"))!.title).toMatch(/South African Development Foundation/);
  });
});

describe("contact links", () => {
  it("builds tel: and WhatsApp links", () => {
    expect(telHref(SITE.phone)).toBe("tel:+27683440637");
    expect(whatsappHref(SITE.whatsapp)).toBe("https://wa.me/27683440637");
    expect(whatsappHref("068 344 0637", "Hi")).toBe("https://wa.me/27683440637?text=Hi");
  });
});

describe("validation", () => {
  const fd = (o: Record<string, string>) => {
    const f = new FormData();
    for (const [k, v] of Object.entries(o)) f.append(k, v);
    return f;
  };

  it("cleans control characters, zero-width and bidi characters, and excess blank lines", () => {
    expect(cleanText("  Hello​‮ world\u0000  ")).toBe("Hello world");
    expect(cleanText("a\r\n\r\n\r\n\r\nb  \n  c", { multiline: true })).toBe("a\n\nb\nc");
    expect(cleanText("a\n\nb")).toBe("a b");
  });

  it("validates review fields", () => {
    const f = new Fields(fd({ name: "A", email: "bad", rating: "6", review: "short" }));
    f.text("name", { required: true, min: 2, label: "Name" });
    f.email("email", { required: true });
    f.int("rating", { min: 1, max: 5, message: "rating" });
    f.text("review", { required: true, min: 20, max: 1200, label: "Review" });
    expect(Object.keys(f.errors).sort()).toEqual(["email", "name", "rating", "review"]);

    const g = new Fields(fd({ email: "Person@Example.TEST", rating: "4" }));
    expect(g.email("email")).toBe("person@example.test");
    expect(g.int("rating", { min: 1, max: 5, message: "x" })).toBe(4);
    expect(g.ok).toBe(true);
  });
});
