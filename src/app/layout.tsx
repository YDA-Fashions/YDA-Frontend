import type { Metadata } from "next";
import { Inter, Prata } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const prata = Prata({
  weight: "400",
  variable: "--font-prata",
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
  maximumScale: 5,
};

import GlobalInit from "@/components/common/GlobalInit";
import JsonLd from "@/components/common/JsonLd";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import WhatsAppFAB from "@/components/common/WhatsAppFAB";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${prata.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col">
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MWVBGWZQ');`,
          }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MWVBGWZQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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
              "telephone": "+91-7877646756",
              "contactType": "customer service"
            }
          }}
        />
        <GlobalInit />
        {children}
        <WhatsAppFAB />
      </body>
    </html>
  );
}
