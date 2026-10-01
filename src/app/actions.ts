"use server";

// Public Server Actions. They use the anon key, so RLS applies exactly as for a direct API call:
// reviews and enquiries can only be inserted (validated by DB constraints), never edited or deleted.
import { revalidatePath } from "next/cache";
import { createPublicClient } from "@/lib/supabase/server";
import { PUBLIC_REVIEW_COLUMNS, type ActionResult, type PublicReview } from "@/lib/types";
import { Fields } from "@/lib/validation";

const UNAVAILABLE: ActionResult = { ok: false, error: "This form is temporarily unavailable. Please try again later, or contact us on WhatsApp." };
const FAILED: ActionResult = { ok: false, error: "Something went wrong while sending. Please try again." };

function dbError(what: string, error: { code?: string; message: string }): ActionResult {
  if (error.message.includes("rate_limited")) return { ok: false, error: "We're receiving a lot of submissions right now. Please try again in a little while." };
  if (error.message.includes("duplicate_review")) return { ok: false, error: "This review has already been submitted." };
  console.error(`${what} insert failed`, error.code); // never log the submission itself
  return FAILED;
}

export async function submitReview(fd: FormData): Promise<ActionResult> {
  const thanks = "Thank you for taking the time to review Legodi's Digital Systems.";
  if (fd.get("website")) return { ok: true, message: thanks }; // honeypot: quietly drop bots

  const f = new Fields(fd);
  const name = f.text("name", { required: true, min: 2, max: 80, label: "Name" });
  const company = f.text("company", { max: 120, label: "Company" });
  const email = f.email("email", { required: true });
  const rating = f.int("rating", { min: 1, max: 5, message: "Please choose a rating from 1 to 5 stars." });
  const review = f.text("review", { required: true, min: 20, max: 1200, label: "Review", multiline: true });
  if (!f.ok) return f.fail();

  const sb = createPublicClient();
  if (!sb) return UNAVAILABLE;
  const { data, error } = await sb
    .from("reviews")
    .insert({ name, company, email, rating, review })
    .select(PUBLIC_REVIEW_COLUMNS)
    .single();
  if (error) return dbError("review", error);

  revalidatePath("/");
  return { ok: true, message: thanks, review: data as PublicReview };
}

export async function submitEnquiry(fd: FormData): Promise<ActionResult> {
  const thanks = "Thank you — your enquiry has been received. We'll be in touch soon.";
  if (fd.get("website")) return { ok: true, message: thanks };

  const f = new Fields(fd);
  const name = f.text("name", { required: true, min: 2, max: 120, label: "Name" });
  const email = f.email("email", { required: true });
  const phone = f.text("phone", { max: 31, label: "Phone" });
  if (phone && !/^[+\d][\d\s()-]{6,30}$/.test(phone)) f.errors.phone = "Enter a valid phone number.";
  const company = f.text("company", { max: 160, label: "Company" });
  const service = f.text("service", { max: 160, label: "Service" });
  const message = f.text("message", { required: true, min: 10, max: 5000, label: "Project description", multiline: true });
  if (!f.ok) return f.fail();

  const sb = createPublicClient();
  if (!sb) return UNAVAILABLE;
  const { error } = await sb.from("enquiries").insert({ name, email, phone, company, service, message });
  if (error) return dbError("enquiry", error);
  return { ok: true, message: thanks };
}
