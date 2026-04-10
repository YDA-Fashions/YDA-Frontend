"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/data/products";
import { useProductStore } from "@/store/useProductStore";

const BigToteBagsPage = () => {
  const allProducts = useProductStore((state) => state.products);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const filtered = allProducts.filter(
      (p) => p.category === "bags" && p.size === "large"
    );
    setProducts(filtered);
  }, [allProducts]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <title>Large Luxury Tote Bags | Spacious Handcrafted Carry | YDA</title>
      <meta name="description" content="Explore our premium collection of large, spacious tote bags. Hand-blocked with traditional Indian motifs, perfect for travel, work, and errands." />
      
      <Header />
      
      <main className="pt-32 pb-24 md:pt-44">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-serif tracking-tight uppercase leading-none"
            >
              Big <br />
              <span className="italic ml-12 md:ml-24 text-accent-dark">Tote Bags.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-sm md:text-base text-foreground/60 max-w-md leading-relaxed"
            >
              Spacious and elegant. Our large totes are designed for the modern lifestyle without compromising on visual heritage.
            </motion.p>
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
};

export default BigToteBagsPage;
