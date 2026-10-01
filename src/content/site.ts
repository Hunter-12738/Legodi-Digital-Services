// All website copy lives here. Edit this file to change services, prices, projects or contact details.
// Portfolio facts were taken from the live sites (researched 1 October 2026). Nothing here is invented:
// if something could not be verified on the live site, it was left out.

export const SITE = {
  name: "Legodi's Digital Systems",
  founder: "Tshegofatso Legodi",
  description:
    "Websites, automation and custom digital systems designed to help businesses attract customers, save time and operate more efficiently.",
  /** Display format. Links are derived from it (tel: and wa.me). */
  phone: "+27 68 344 0637",
  whatsapp: "+27 68 344 0637",
  seoTitle: "Legodi's Digital Systems | Websites & Digital Systems for Businesses",
  seoDescription:
    "Legodi's Digital Systems builds websites from R8,500, plus invoicing, event ticketing, ordering and booking systems that help South African businesses attract customers and save time.",
} as const;

export type ServiceIcon = "invoice" | "website" | "ticket" | "cart" | "calendar";

export type Service = {
  title: string;
  description: string;
  /** Shown as "FROM" above the price when true. */
  from: boolean;
  price: string;
  icon: ServiceIcon;
};

export const SERVICES: Service[] = [
  {
    title: "Invoice & Quotation System",
    description: "Create professional invoices and quotations, track payments and manage your business finances easily.",
    from: false,
    price: "R500",
    icon: "invoice",
  },
  {
    title: "Websites",
    description: "Modern, responsive websites that represent your brand and help you attract more customers.",
    from: true,
    price: "R8,500",
    icon: "website",
  },
  {
    title: "Event Ticketing",
    description: "Sell tickets online, generate PDF tickets with QR codes and verify attendees.",
    from: true,
    price: "R300",
    icon: "ticket",
  },
  {
    title: "Ordering System",
    description: "Allow customers to place orders online and manage them from a simple system.",
    from: false,
    price: "R250",
    icon: "cart",
  },
  {
    title: "Booking System",
    description: "Let customers book appointments or services and manage your schedule efficiently.",
    from: false,
    price: "R250",
    icon: "calendar",
  },
];

export type Project = {
  title: string;
  category: string;
  url: string;
  image: string;
  description: string;
  features: string[];
};

export const PROJECTS: Project[] = [
  {
    title: "Sanicha Student Accommodation",
    category: "Student Accommodation · Website & Management System",
    url: "https://sanicha.co.za",
    image: "/portfolio/sanicha.webp",
    description:
      "A website and management system for Sanicha, which runs four student residences in Universitas, Bloemfontein, close to the University of the Free State. Students can compare residences and room types, check live availability, read about facilities and funding options including NSFAS, and apply online — receiving a reference number as soon as they submit. Behind the public site, a private dashboard handles the owner's day-to-day administration.",
    features: [
      "Residence and room-type listings with pricing",
      "Live availability across all residences",
      "Online application form with instant reference number",
      "Facilities, funding and FAQ information",
      "Private management dashboard",
      "WhatsApp contact",
    ],
  },
  {
    title: "South African Development Foundation (SADF)",
    category: "Non-Profit Organisation",
    url: "https://sadf.co.za",
    image: "/portfolio/sadf.webp",
    description:
      "A website for SADF, a registered South African non-profit organisation focused on education, skills development, enterprise and community empowerment. The site sets out the foundation's vision, mission, objectives and values, presents its programme areas and impact initiatives, introduces the leadership team and gives partners and communities a clear way to get in touch.",
    features: [
      "Vision, mission, objectives and values",
      "Programme areas with active / planned status",
      "Impact initiatives",
      "Leadership directory with contact details",
      "Contact form with a WhatsApp option",
      "Partnership call to action",
    ],
  },
  {
    title: "Saul Glen Steel Works",
    category: "Welding & Metalwork",
    url: "https://saulglenworks.co.za",
    image: "/portfolio/saul-glen-steel-works.webp",
    description:
      "A website for Saul Glen Steel Works, a family-owned welding and metalwork business in Protea Glen, Soweto. It showcases their work — custom security gates, palisade fencing, stainless steel, balustrades, gate motor installations and gutters — with a gallery of completed projects and a quote request form that goes straight to WhatsApp.",
    features: [
      "Services overview",
      "Gallery of completed projects",
      "Quote request form connected to WhatsApp",
      "Business hours and contact details",
    ],
  },
  {
    title: "Zee's Wigology",
    category: "Beauty · Wig Services",
    url: "https://zeeswigology.co.za",
    image: "/portfolio/zees-wigology.webp",
    description:
      "A boutique website for Zee's Wigology, a wig care and customisation business. It presents the full service menu with prices — from washes, plucking and installs to revamps, customisation and colouring — asks clients to acknowledge the booking policies first, and turns each appointment request into a pre-filled WhatsApp message.",
    features: [
      "Service menu with pricing",
      "Policy acknowledgement before booking",
      "Appointment booking via WhatsApp",
      "Contact section",
    ],
  },
];

export const PROCESS = [
  { title: "Tell Us What You Need", description: "Tell us about your business and what you want to build." },
  { title: "We Plan The Solution", description: "We understand your requirements and determine the right solution." },
  { title: "We Build", description: "We design, develop and test your website or digital system." },
  { title: "You Launch", description: "Your finished system goes live and is ready for your customers." },
];

export const NAV_LINKS = [
  { href: "#top", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "Our Work" },
  { href: "#process", label: "How It Works" },
  { href: "#reviews", label: "Reviews" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

/** tel: link from a display number. */
export const telHref = (n: string) => `tel:${n.replace(/[^\d+]/g, "")}`;

/** wa.me link from a South African display number ("+27 68 …" or "068 …"). */
export function whatsappHref(n: string, text?: string) {
  let digits = n.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `27${digits.slice(1)}`;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
