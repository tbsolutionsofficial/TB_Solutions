import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TorchBearer Solutions — We Light the Way",
  description:
    "India's trusted technology partner. Project services across 12 domains for students, colleges, and industries. 100+ projects delivered.",
  keywords: "technology projects, final year projects, IoT, AI, robotics, web development, India",
  openGraph: {
    title: "TorchBearer Solutions",
    description: "We Light the Way to Tomorrow's Technology",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="font-inter min-h-full flex flex-col">
        {children}
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
