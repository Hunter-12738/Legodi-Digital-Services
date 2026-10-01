"use client";

import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { submitEnquiry } from "@/app/actions";
import { SERVICES } from "@/content/site";
import { FormMessage, Honeypot, SelectInput, TextArea, TextInput, useFormAction } from "@/components/ui/form";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const { pending, result, onSubmit, errors } = useFormAction(submitEnquiry, {
    resetOnSuccess: true,
    onSuccess: () => setSent(true),
  });

  if (sent && result?.ok) {
    return (
      <div className="flex min-h-[28rem] flex-col items-center justify-center text-center" role="status">
        <CheckCircle2 className="size-12 text-gold" strokeWidth={1.5} aria-hidden="true" />
        <p className="mt-5 max-w-sm font-display text-2xl text-cream">{result.message}</p>
        <button type="button" onClick={() => setSent(false)} className="mt-8 text-sm font-semibold text-gold underline-offset-4 hover:underline">
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-5" aria-label="Project enquiry">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextInput label="Name" name="name" required autoComplete="name" minLength={2} maxLength={120} error={errors.name} />
        <TextInput label="Email" name="email" type="email" required autoComplete="email" maxLength={254} error={errors.email} />
        <TextInput label="Phone" name="phone" type="tel" autoComplete="tel" maxLength={31} error={errors.phone} />
        <TextInput label="Company" name="company" autoComplete="organization" maxLength={160} error={errors.company} />
      </div>
      <SelectInput label="Service interested in" name="service" defaultValue="" error={errors.service}>
        <option value="">Select a service…</option>
        {SERVICES.map((s) => (
          <option key={s.title} value={s.title}>
            {s.title} — {s.from ? "from " : ""}{s.price}
          </option>
        ))}
        <option value="Custom project">Custom project (quote)</option>
      </SelectInput>
      <TextArea
        label="Project description"
        name="message"
        required
        minLength={10}
        maxLength={5000}
        rows={6}
        placeholder="Tell us about your business and what you'd like to build."
        error={errors.message}
      />
      <FormMessage result={result && !result.ok ? result : null} />
      <button
        type="submit"
        disabled={pending}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 font-semibold text-ink transition-all hover:bg-gold-light hover:shadow-[0_0_36px_-8px_rgb(227_163_59/0.8)] disabled:opacity-60 sm:w-auto"
      >
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {pending ? "Sending…" : "Let's Build Something"}
        {!pending && <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
      </button>
    </form>
  );
}
