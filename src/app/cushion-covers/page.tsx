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
      
      <main className="pt-20">
        {/* Editorial Hero Banner */}
        <div className="relative h-[45vh] md:h-[55vh] min-h-[350px] w-full flex items-center justify-center overflow-hidden mb-16 md:mb-24">
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/home-page-image/cushion-1.jpg" 
              alt="Artisan Cushion Covers" 
              className="object-cover object-center w-full h-full opacity-80 dark:opacity-40"
            />
            <div className="absolute inset-0 bg-black/40 dark:bg-black/70" />
          </div>
          
          <div className="relative z-10 text-center text-white px-6 max-w-4xl">
            <h1 className="text-4xl md:text-7xl font-serif tracking-tight uppercase leading-none mb-6">
              Cushion <br />
              <span className="italic font-normal tracking-wide text-white/95">Covers</span>
            </h1>
            <div className="w-16 h-[1px] bg-white/30 mx-auto mb-6" />
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] font-light max-w-md mx-auto leading-relaxed text-white/80">
              Softness meets heritage. Our cushion covers are meticulously crafted to bring warmth and artistic charm to every corner of your home.
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
