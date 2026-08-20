import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScamLens — Spot the Red Flags Before You Click",
  description:
    "Analyze suspicious messages for scam indicators privately in your browser.",
  openGraph: {
    title: "ScamLens — Spot the Red Flags Before You Click",
    description:
      "Analyze suspicious messages for scam indicators privately in your browser.",
    type: "website",
    locale: "en_US",
    siteName: "ScamLens",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScamLens — Spot the Red Flags Before You Click",
    description:
      "Analyze suspicious messages for scam indicators privately in your browser.",
  },
  keywords: [
    "scam detection",
    "SMS scam",
    "phishing",
    "message analysis",
    "cybersecurity",
    "online safety",
    "fraud detection",
    "WhatsApp scam",
    "email scam",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
