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
        
        {/* Optimized Editorial Hero Banner */}
        <section className="relative h-[30vh] md:h-[45vh] min-h-[250px] w-full flex items-center justify-center overflow-hidden mb-16 md:mb-24">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/images/Slider-image-C/Slider-image-C1.jpg" 
              alt="YDA New Arrivals Collection" 
              fill
              className="object-cover object-center opacity-70 dark:opacity-45"
              priority
            />
            <div className="absolute inset-0 bg-black/45 dark:bg-black/70" />
          </div>
          
          <div className="relative z-10 text-center text-white px-6 pt-8 md:pt-12">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif tracking-tight uppercase leading-tight mb-4">
              New <span className="italic font-normal text-white/90 lowercase">arrivals</span>
            </h1>
            <div className="w-12 h-[1px] bg-white/30 mx-auto mb-4" />
            <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] font-light max-w-md mx-auto leading-relaxed text-white/80">
              Fresh from the studio. Discover our most recent artisanal creations, blending timeless Indian craftsmanship with contemporary luxury.
            </p>
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
