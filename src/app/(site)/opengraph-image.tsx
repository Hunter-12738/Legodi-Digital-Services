import { ImageResponse } from "next/og";
import { SITE } from "@/content/site";

export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "radial-gradient(circle at 85% 10%, #3a2a14 0%, #090807 55%)",
          color: "#f6eedf",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              border: "2px solid #e3a33b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              color: "#f4c56f",
            }}
          >
            L
          </div>
          <div style={{ fontSize: 34, color: "#f4c56f" }}>{SITE.name}</div>
        </div>
        <div style={{ fontSize: 70, lineHeight: 1.1, maxWidth: 1000 }}>We Build Digital Systems Behind Ambitious Brands.</div>
        <div style={{ fontSize: 30, color: "#a39684" }}>Websites from R8,500 · Invoicing · Ticketing · Ordering · Bookings</div>
      </div>
    ),
    size,
  );
}
