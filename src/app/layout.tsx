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
  metadataBase: new URL("https://ydafashions.com"),
  title: "YDA | Premium Sanganeri & Gujarati Handcrafted Bags",
  description: "Exquisite handcrafted bags and cushion covers featuring Sanganeri and Gujarati prints. Minimal luxury, timeless craftsmanship.",
  keywords: ["Sanganeri prints", "handcrafted bags", "Gujarati prints", "premium cushions", "luxury fashion", "handmade in india"],
  authors: [{ name: "YDA Team" }],
  creator: "YDA Studio",
  publisher: "YDA Fashions",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ydafashions.com",
    siteName: "YDA | Premium Handcrafted Heritage",
    title: "YDA | Premium Sanganeri & Gujarati Handcrafted Bags",
    description: "Exquisite handcrafted bags and cushion covers featuring Sanganeri and Gujarati prints. Minimal luxury, timeless craftsmanship.",
    images: [
      {
        url: "/images/home-page-image/small-tote.jpg",
        width: 1200,
        height: 630,
        alt: "YDA Premium Handcrafted Bags",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YDA | Premium Sanganeri & Gujarati Handcrafted Bags",
    description: "Exquisite handcrafted bags and cushion covers featuring Sanganeri and Gujarati prints.",
    images: ["/images/home-page-image/small-tote.jpg"],
  },
  verification: {
    google: "GZM7ef9LBexMHArE9S2ZXfQxXQXQrxijc1FgXo3FfNY",
  },
  alternates: {
    canonical: "https://ydafashions.com",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import GlobalInit from "@/components/common/GlobalInit";
import JsonLd from "@/components/common/JsonLd";

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
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "YDA Fashions",
            "url": "https://ydafashions.com",
            "logo": "https://ydafashions.com/logo-dark-horizontal.png",
            "sameAs": [
              "https://www.instagram.com/ydafashions",
              "https://www.facebook.com/ydafashions"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-XXXXXXXXXX",
              "contactType": "customer service"
            }
          }}
        />
        <GlobalInit />
        {children}
      </body>
    </html>
  );
}
