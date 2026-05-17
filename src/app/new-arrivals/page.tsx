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
      
      <main className="pt-20">
        {/* Editorial Hero Banner */}
        <div className="relative h-[45vh] md:h-[55vh] min-h-[350px] w-full flex items-center justify-center overflow-hidden mb-16 md:mb-24">
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/Slider-image-C/Slider-image-C1.jpg" 
              alt="YDA New Arrivals" 
              className="object-cover object-center w-full h-full opacity-80 dark:opacity-40"
            />
            <div className="absolute inset-0 bg-black/40 dark:bg-black/70" />
          </div>
          
          <div className="relative z-10 text-center text-white px-6 max-w-4xl">
            <h1 className="text-4xl md:text-7xl font-serif tracking-tight uppercase leading-none mb-6">
              New <br />
              <span className="italic font-normal tracking-wide text-white/95">Arrivals</span>
            </h1>
            <div className="w-16 h-[1px] bg-white/30 mx-auto mb-6" />
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] font-light max-w-md mx-auto leading-relaxed text-white/80">
              Fresh from the studio. Discover our most recent artisanal creations, blending timeless Indian craftsmanship with contemporary luxury.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6">

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
