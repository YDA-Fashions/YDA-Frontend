import React from "react";
import Image from "next/image";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductCard from "@/components/products/ProductCard";
import { productService } from "@/services/productService";

export default async function BigToteBagsPage() {
  let products = [];
  try {
    const allProducts = await productService.getProducts();
    products = allProducts.filter(
      (p) => p.category === "bags" && p.size === "large"
    );
  } catch (error) {
    console.error("Failed to fetch big totes:", error);
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <title>Large Luxury Tote Bags | Spacious Handcrafted Carry | YDA</title>
      <meta name="description" content="Explore our premium collection of large, spacious tote bags. Hand-blocked with traditional Indian motifs, perfect for travel, work, and errands." />
      
      <Header />
      
      <main className="pt-20">
        
        {/* Split-Screen Editorial Hero Banner */}
        <section className="relative w-full bg-[#FAF9F6] dark:bg-[#121212] overflow-hidden border-b border-black/5 dark:border-white/10 mb-16 md:mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[350px] md:min-h-[450px]">
            {/* Left: Text Content with solid luxury background */}
            <div className="flex flex-col justify-center px-8 py-16 md:px-16 lg:px-24 bg-black text-white dark:bg-[#0B0B0B]">
              <div className="max-w-xl">
                <span className="text-xs uppercase tracking-widest font-black text-white/70 mb-4 block">Handcrafted Collection</span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight uppercase leading-tight mb-6">
                  Big <br />
                  <span className="italic font-normal text-white/95 lowercase">tote bags</span>
                </h1>
                <div className="w-12 h-[1px] bg-white/30 mb-6" />
                <p className="text-xs md:text-sm uppercase tracking-[0.2em] font-light leading-relaxed text-white/70">
                  Spacious and elegant. Our large totes are designed for the modern lifestyle without compromising on heritage craftsmanship.
                </p>
              </div>
            </div>
            
            {/* Right: Proportionate Image Wrapper */}
            <div className="relative min-h-[250px] md:min-h-full w-full">
              <Image 
                src="/images/home-page-image/big-tote.jpg" 
                alt="Big Tote Bags Collection" 
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
