import type { Metadata } from "next";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: SITE.seoTitle,
  description: SITE.seoDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "/",
    siteName: SITE.name,
    title: SITE.seoTitle,
    description: SITE.seoDescription,
  },
  twitter: { card: "summary_large_image", title: SITE.seoTitle, description: SITE.seoDescription },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
