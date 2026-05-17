import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductCard from "@/components/products/ProductCard";
import { productService } from "@/services/productService";

export default async function SmallToteBagsPage() {
  let products = [];
  try {
    const allProducts = await productService.getProducts();
    products = allProducts.filter(
      (p) => p.category === "bags" && p.size === "small"
    );
  } catch (error) {
    console.error("Failed to fetch small totes:", error);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <title>Small Tote Bags for Women | Handcrafted Collection | YDA</title>
      <meta name="description" content="Discover our exclusive collection of handcrafted small tote bags, featuring traditional Sanganeri and Gujarati prints with modern luxury appeal." />
      
      <Header />
      
      <main className="pt-20">
        {/* Editorial Hero Banner */}
        <div className="relative h-[45vh] md:h-[55vh] min-h-[350px] w-full flex items-center justify-center overflow-hidden mb-16 md:mb-24">
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/home-page-image/small-tote.jpg" 
              alt="Small Tote Bags" 
              className="object-cover object-center w-full h-full opacity-80 dark:opacity-40"
            />
            <div className="absolute inset-0 bg-black/40 dark:bg-black/70" />
          </div>
          
          <div className="relative z-10 text-center text-white px-6 max-w-4xl">
            <h1 className="text-4xl md:text-7xl font-serif tracking-tight uppercase leading-none mb-6">
              Small <br />
              <span className="italic font-normal tracking-wide text-white/95">Tote Bags</span>
            </h1>
            <div className="w-16 h-[1px] bg-white/30 mx-auto mb-6" />
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] font-light max-w-md mx-auto leading-relaxed text-white/80">
              Perfectly sized for daily essentials. Our small totes blend heritage craftsmanship with contemporary functionality.
            </p>
          </div>
        </div>

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
