import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductCard from "@/components/products/ProductCard";
import { productService } from "@/services/productService";

export default async function NewArrivalsPage() {
  let products = [];
  try {
    const allProducts = await productService.getProducts();
    // Sort by created_at is handled by service. Just take first 12 for "New"
    products = allProducts.slice(0, 12);
  } catch (error) {
    console.error("Failed to fetch new arrivals:", error);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <title>New Arrivals | Handcrafted Jaipur Collection | YDA</title>
      <meta name="description" content="Be the first to explore our latest handcrafted masterpieces. Fresh Sanganeri prints, artisanal tote bags, and luxury home decor just added to the studio." />
      
      <Header />
      
      <main className="pt-32 pb-24 md:pt-44">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <h1 className="text-5xl md:text-7xl font-serif tracking-tight uppercase leading-none">
              New <br />
              <span className="italic ml-12 md:ml-24 text-accent-dark">Arrivals.</span>
            </h1>
            <p className="mt-8 text-sm md:text-base text-foreground/60 max-w-md leading-relaxed">
              Fresh from the studio. Discover our most recent artisanal creations, blending timeless Indian craftsmanship with contemporary luxury.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="py-32 text-center border-t border-border-beige">
              <p className="text-xl font-serif italic text-foreground/30">Our artisans are currently crafting new masterpieces.</p>
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
