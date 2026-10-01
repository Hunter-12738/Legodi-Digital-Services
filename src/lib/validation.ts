// Small, dependency-free FormData validation. The database re-checks every constraint.
import type { ActionResult } from "@/lib/types";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Normalises user text before it is stored: removes control/zero-width characters, trims each line
 * and collapses runs of blank lines. (Display is escaped by React; nothing is rendered as HTML.)
 */
export function cleanText(v: string, { multiline = false } = {}): string {
  let s = v.normalize("NFC").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩]/g, "");
  s = multiline
    ? s.replace(/\r\n?/g, "\n").split("\n").map((l) => l.trim()).join("\n").replace(/\n{3,}/g, "\n\n")
    : s.replace(/\s+/g, " ");
  return s.trim();
}

type TextOpts = { required?: boolean; min?: number; max?: number; label?: string; multiline?: boolean };

export class Fields {
  readonly errors: Record<string, string> = {};
  constructor(private readonly fd: FormData) {}

  text(name: string, { required = false, min = 0, max = 500, label = "This field", multiline = false }: TextOpts = {}): string | null {
    const raw = this.fd.get(name);
    const v = typeof raw === "string" ? cleanText(raw, { multiline }) : "";
    if (!v) {
      if (required) this.errors[name] = `${label} is required.`;
      return null;
    }
    if (v.length < min) this.errors[name] = `${label} must be at least ${min} characters.`;
    else if (v.length > max) this.errors[name] = `${label} must be at most ${max} characters.`;
    return v;
  }

  email(name: string, { required = false } = {}): string | null {
    const v = this.text(name, { required, max: 254, label: "Email" });
    if (v && !EMAIL.test(v)) this.errors[name] = "Enter a valid email address.";
    return v ? v.toLowerCase() : v;
  }

  int(name: string, { min, max, message }: { min: number; max: number; message: string }): number | null {
    const raw = this.fd.get(name);
    const n = Number(raw);
    if (typeof raw !== "string" || !raw || !Number.isInteger(n) || n < min || n > max) {
      this.errors[name] = message;
      return null;
    }
    return n;
  }

  get ok(): boolean {
    return Object.keys(this.errors).length === 0;
  }

  fail(error = "Please correct the highlighted fields."): ActionResult {
    return { ok: false, error, fieldErrors: this.errors };
  }
}
