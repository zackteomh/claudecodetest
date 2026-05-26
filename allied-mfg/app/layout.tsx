import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Allied MFG Pte Ltd — Precision Manufacturing in Singapore",
    template: "%s | Allied MFG",
  },
  description:
    "Allied MFG delivers high-quality precision machining and manufacturing solutions for demanding industrial applications. Serving semiconductor, automation, power, and energy industries from Singapore.",
  keywords: [
    "precision machining",
    "CNC machining",
    "manufacturing Singapore",
    "precision engineering",
    "metal fabrication",
    "CNC milling",
    "CNC turning",
  ],
  openGraph: {
    siteName: "Allied MFG Pte Ltd",
    type: "website",
    locale: "en_SG",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
