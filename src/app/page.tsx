import React from "react";
import { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";
import { PRODUCTS } from "@/data/products";

export const metadata: Metadata = {
  title: "YDA | Premium Sanganeri & Gujarati Handcrafted Bags",
  description: "Exquisite handcrafted bags and cushion covers featuring Sanganeri and Gujarati prints. Minimal luxury, timeless craftsmanship.",
  openGraph: {
    title: "YDA | Premium Sanganeri & Gujarati Handcrafted Bags",
    description: "Exquisite handcrafted bags and cushion covers featuring Sanganeri and Gujarati prints.",
    images: ["/images/home-page-image/small-tote.jpg"],
  },
};

export default function Home() {
  // Pass products to client component
  // In a real app, this might be a server-side fetch from a database
  const featuredProducts = PRODUCTS;

  return <HomeClient initialProducts={featuredProducts} />;
}
