/** A review as the public API returns it (the email column is never readable). */
export type PublicReview = {
  id: string;
  name: string;
  company: string | null;
  rating: number;
  review: string;
  created_at: string;
};

export const PUBLIC_REVIEW_COLUMNS = "id, name, company, rating, review, created_at";

export type ActionResult =
  | { ok: true; message: string; review?: PublicReview }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };
