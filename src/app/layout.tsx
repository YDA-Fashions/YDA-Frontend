import type { Metadata } from "next";
import { Inter, Prata } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const prata = Prata({
  weight: "400",
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "YDA | Premium Sanganeri & Gujarati Handcrafted Bags",
  description: "Exquisite handcrafted bags and cushion covers featuring Sanganeri and Gujarati prints. Minimal luxury, timeless craftsmanship.",
};

import GlobalInit from "@/components/common/GlobalInit";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${prata.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GlobalInit />
        {children}
      </body>
    </html>
  );
}
