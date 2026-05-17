import React from "react";
import Image from "next/image";
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <title>New Arrivals | Handcrafted Jaipur Collection | YDA</title>
      <meta name="description" content="Be the first to explore our latest handcrafted masterpieces. Fresh Sanganeri prints, artisanal tote bags, and luxury home decor just added to the studio." />
      
      <Header />
      
      <main className="pt-20">
        
        {/* Split-Screen Editorial Hero Banner */}
        <section className="relative w-full bg-[#FAF9F6] dark:bg-[#121212] overflow-hidden border-b border-black/5 dark:border-white/10 mb-16 md:mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[350px] md:min-h-[450px]">
            {/* Left: Text Content with solid luxury background */}
            <div className="flex flex-col justify-center px-8 py-16 md:px-16 lg:px-24 bg-black text-white dark:bg-[#0B0B0B]">
              <div className="max-w-xl">
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/50 mb-4 block">Fresh from the Loom</span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight uppercase leading-tight mb-6">
                  New <br />
                  <span className="italic font-normal text-white/95 lowercase">arrivals</span>
                </h1>
                <div className="w-12 h-[1px] bg-white/30 mb-6" />
                <p className="text-xs md:text-sm uppercase tracking-[0.2em] font-light leading-relaxed text-white/70">
                  Fresh from the studio. Discover our most recent artisanal creations, blending timeless Indian craftsmanship with contemporary luxury.
                </p>
              </div>
            </div>
            
            {/* Right: Proportionate Image Wrapper */}
            <div className="relative min-h-[250px] md:min-h-full w-full">
              <Image 
                src="/images/Slider-image-C/Slider-image-C1.jpg" 
                alt="YDA New Arrivals Collection" 
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        </section>

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
