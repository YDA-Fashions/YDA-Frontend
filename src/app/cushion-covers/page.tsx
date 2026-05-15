import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductCard from "@/components/products/ProductCard";
import { productService } from "@/services/productService";

export default async function CushionCoversPage() {
  let products = [];
  try {
    const allProducts = await productService.getProducts();
    products = allProducts.filter((p) => p.category === "cushions");
  } catch (error) {
    console.error("Failed to fetch cushions:", error);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <title>Premium Artisan Cushion Covers | Sanganeri & Floral Designs | YDA</title>
      <meta name="description" content="Elevate your home with our collection of premium handcrafted cushion covers. Featuring vibrant Sanganeri floral prints on soft, high-quality fabric." />
      
      <Header />
      
      <main className="pt-32 pb-24 md:pt-44">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <h1 className="text-5xl md:text-7xl font-serif tracking-tight uppercase leading-none">
              Cushion <br />
              <span className="italic ml-12 md:ml-24 text-accent-dark">Covers.</span>
            </h1>
            <p className="mt-8 text-sm md:text-base text-foreground/60 max-w-md leading-relaxed">
              Softness meets heritage. Our cushion covers are meticulously crafted to bring warmth and artistic charm to every corner of your home.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="py-32 text-center border-t border-border-beige">
              <p className="text-xl font-serif italic text-foreground/30">New designs are currently in production.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-20 border-t border-border-beige pt-16">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
