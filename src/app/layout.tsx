import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Haidi — Demand and inventory planning you can explain",
  description:
    "From demand signal to inventory decision, with scenario testing built in. Clear enough to explain to your CFO. Fast enough to be useful today.",
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
  openGraph: {
    title: "Haidi — Demand and inventory planning you can explain",
    description: "Supply chain planning set up in mere hours. Built by supply chain practitioners.",
    url: site.url,
    siteName: "Haidi",
    images: [{ url: "/assets/haidi-platform.png", width: 1600, height: 1000 }],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#14161D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="bg-canvas text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
