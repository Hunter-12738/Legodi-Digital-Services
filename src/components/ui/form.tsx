"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useTransition } from "react";
import type { ActionResult } from "@/lib/types";

/**
 * Submits a form to a Server Action without React's automatic form reset, so values survive a
 * failed submit. Field errors come back from the action and are shown inline.
 */
export function useFormAction(
  action: (fd: FormData) => Promise<ActionResult>,
  { onSuccess, resetOnSuccess = false }: { onSuccess?: (r: ActionResult) => void; resetOnSuccess?: boolean } = {},
) {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    start(async () => {
      try {
        const r = await action(fd);
        setResult(r);
        if (r.ok) {
          if (resetOnSuccess) form.reset();
          // A saved upload must not be uploaded again on the next save.
          else form.querySelectorAll<HTMLInputElement>('input[type="file"]').forEach((i) => (i.value = ""));
          onSuccess?.(r);
        }
      } catch {
        setResult({ ok: false, error: "Something went wrong. If you were signed in, your session may have expired." });
      }
    });
  };
  const errors = result && !result.ok ? (result.fieldErrors ?? {}) : {};
  return { pending, result, setResult, onSubmit, errors };
}

export const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[0.95rem] text-cream placeholder:text-faint outline-none transition focus:border-gold/70 focus:bg-white/[0.06] focus:ring-4 focus:ring-gold/15 aria-[invalid=true]:border-danger disabled:opacity-60";

type FieldProps = { label: string; name: string; error?: string; hint?: string; required?: boolean; className?: string };

export function Field({ label, name, error, hint, required, className = "", children }: FieldProps & { children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-sand">
        {label}
        {required && <span className="text-gold"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-faint">{hint}</p>}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

const a11y = (name: string, error?: string) => ({
  id: name,
  name,
  "aria-invalid": error ? true : undefined,
  "aria-describedby": error ? `${name}-error` : undefined,
});

export function TextInput({
  label, name, error, hint, required, className, ...props
}: FieldProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Field label={label} name={name} error={error} hint={hint} required={required} className={className}>
      <input {...a11y(name, error)} required={required} className={inputCls} {...props} />
    </Field>
  );
}

export function TextArea({
  label, name, error, hint, required, className, ...props
}: FieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Field label={label} name={name} error={error} hint={hint} required={required} className={className}>
      <textarea {...a11y(name, error)} required={required} rows={5} className={`${inputCls} resize-y`} {...props} />
    </Field>
  );
}

export function SelectInput({
  label, name, error, hint, required, className, children, ...props
}: FieldProps & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Field label={label} name={name} error={error} hint={hint} required={required} className={className}>
      <select {...a11y(name, error)} required={required} className={`${inputCls} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23e3a33b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-[length:1.1rem] bg-[right_0.9rem_center] bg-no-repeat pr-10`} {...props}>
        {children}
      </select>
    </Field>
  );
}

/** Invisible to people; bots that fill every field are quietly discarded server-side. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
      <label>
        Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function FormMessage({ result }: { result: ActionResult | null }) {
  if (!result) return null;
  const ok = result.ok;
  const text = ok ? result.message : result.error;
  if (!text) return null;
  return (
    <p
      role={ok ? "status" : "alert"}
      className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${ok ? "bg-success/10 text-success" : "bg-danger/10 text-danger ring-1 ring-danger/25"}`}
    >
      {ok ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> : <AlertCircle className="mt-0.5 size-4 shrink-0" />}
      {text}
    </p>
  );
}
