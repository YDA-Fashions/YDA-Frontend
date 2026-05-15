import React, { Suspense } from "react";
import { Metadata } from "next";
import ShopClient from "@/components/shop/ShopClient";
import { productService } from "@/services/productService";

export const metadata: Metadata = {
  title: "Shop All Collections | YDA Premium Handcrafted Bags",
  description: "Browse our full selection of Sanganeri and Gujarati handcrafted bags, cushion covers, and more. Authentic Indian prints for modern luxury.",
  openGraph: {
    title: "Shop All Collections | YDA Premium Handcrafted Bags",
    description: "Browse our full selection of Sanganeri and Gujarati handcrafted bags.",
    images: ["/images/home-page-image/small-tote.jpg"],
  },
};

export default async function ShopPage() {
  let allProducts = [];
  try {
    allProducts = await productService.getProducts();
  } catch (error) {
    console.error("Failed to fetch products for Shop:", error);
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background text-foreground uppercase tracking-widest text-xs font-bold">Loading...</div>}>
      <ShopClient initialProducts={allProducts} />
    </Suspense>
  );
}
