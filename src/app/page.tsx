import React from "react";
import { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";
import { productService } from "@/services/productService";

export const metadata: Metadata = {
  title: "YDA | Premium Sanganeri & Gujarati Handcrafted Bags",
  description: "Exquisite handcrafted bags and cushion covers featuring Sanganeri and Gujarati prints. Minimal luxury, timeless craftsmanship.",
  openGraph: {
    title: "YDA | Premium Sanganeri & Gujarati Handcrafted Bags",
    description: "Exquisite handcrafted bags and cushion covers featuring Sanganeri and Gujarati prints.",
    images: ["/images/home-page-image/small-tote.jpg"],
  },
};

export default async function Home() {
  // Fetch live products from Supabase
  let featuredProducts = [];
  try {
    featuredProducts = await productService.getProducts();
  } catch (error) {
    console.error("Failed to fetch products for Home:", error);
  }

  return <HomeClient initialProducts={featuredProducts} />;
}
