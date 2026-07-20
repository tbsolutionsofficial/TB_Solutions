import type { Metadata } from "next";
import { Libre_Baskerville, IBM_Plex_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-libre-baskerville",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const SITE_URL = "https://tbsolutions.online";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TorchBearer Solutions — Final Year & Industry Project Experts India",
    template: "%s | TorchBearer Solutions",
  },
  description:
    "India's trusted technology partner for final year projects, BTech projects, and industry solutions. AI, Robotics, IoT, Web, App, Embedded Systems, Drone & more. 100+ projects delivered. Get your project done today.",
  keywords: [
    "final year project help India",
    "BTech project solutions",
    "mini project help",
    "AI project India",
    "robotics project students",
    "IoT project college",
    "embedded systems project",
    "drone technology project",
    "web development project India",
    "app development project",
    "data science project help",
    "project solutions Hyderabad",
    "electronics project India",
    "cloud computing project",
    "cybersecurity project",
    "automation project",
    "TorchBearer Solutions",
    "tbsolutions",
    "technology partner India",
    "project services students",
    "PCB design project",
  ],
  authors: [{ name: "TorchBearer Solutions", url: SITE_URL }],
  creator: "TorchBearer Solutions",
  publisher: "TorchBearer Solutions",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "TorchBearer Solutions",
    title: "TorchBearer Solutions — Final Year & Industry Project Experts",
    description:
      "Project services across AI, Robotics, IoT, Web, App, Embedded Systems & 12 more domains. 100+ projects delivered across India. Start your project today.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "TorchBearer Solutions — We Light the Way",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TorchBearer Solutions — Project Experts India",
    description: "AI, Robotics, IoT, Web & 12 domain project services for students & industry.",
    images: ["/logo.png"],
  },
  alternates: { canonical: SITE_URL },
  category: "technology",
  verification: {
    google: "DZniDEvCEPtNd0E7LByGKRKHJEJWfQgiGOh0qOnMF58",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "TorchBearer Solutions",
  alternateName: "TB Solutions",
  description:
    "India's trusted technology partner for final year projects and industry solutions across AI, Robotics, IoT, Web Development, App Development, Embedded Systems, and more.",
  url: SITE_URL,
  telephone: "+916303987443",
  email: "tbsolutions.official@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  serviceType: [
    "Final Year Project Help",
    "AI Projects",
    "Robotics Projects",
    "IoT Projects",
    "Web Development",
    "App Development",
    "Embedded Systems",
    "Drone Technology",
    "Data Science Projects",
    "Electronics & PCB Design",
    "Cybersecurity Projects",
    "Cloud Computing Projects",
  ],
  sameAs: ["https://tbsolutions.online"],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "21:00",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${libreBaskerville.variable} ${ibmPlexSans.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body className="font-inter min-h-full flex flex-col">
        {children}
        <Analytics />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "rgba(10,10,10,0.85)",
              backdropFilter: "blur(24px)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.1)",
              borderLeft: "4px solid #cc785c",
              fontFamily: "var(--font-inter)",
            },
          }}
        />
      </body>
    </html>
  );
}
