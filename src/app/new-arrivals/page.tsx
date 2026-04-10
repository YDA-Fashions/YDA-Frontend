"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/data/products";
import { useProductStore } from "@/store/useProductStore";

const NewArrivalsPage = () => {
  const allProducts = useProductStore((state) => state.products);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Show the 4 most recent products from the catalog
    setProducts([...allProducts].slice(-4).reverse());
  }, [allProducts]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <title>New Arrivals | Latest Handcrafted Pieces | YDA</title>
      <meta name="description" content="Be the first to explore our newest handcrafted creations. Fresh designs, updated prints, and the latest in premium Indian fashion essentials." />
      
      <Header />
      
      <main className="pt-32 pb-24 md:pt-44">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-serif tracking-tight uppercase leading-none"
            >
              New <br />
              <span className="italic ml-12 md:ml-24 text-accent-dark">Arrivals.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-sm md:text-base text-foreground/60 max-w-md leading-relaxed"
            >
              The latest from the studio. Every piece is a unique narrative of heritage and modern luxury, freshly off the loom.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-20 border-t border-border-beige pt-16">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewArrivalsPage;
