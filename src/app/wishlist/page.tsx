"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductCard from "@/components/products/ProductCard";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useProductStore } from "@/store/useProductStore";

const WishlistPage = () => {
  const { getWishlistItems, items: wishlistIds } = useWishlistStore();
  const allProducts = useProductStore((state) => state.products);
  const [isMounted, setIsMounted] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  // Fix Hydration Error: Ensure component is mounted on client before rendering items
  useEffect(() => {
    setIsMounted(true);
    // Fetch actual product objects from IDs using dynamic product data
    setProducts(getWishlistItems(allProducts));
  }, [getWishlistItems, wishlistIds, allProducts]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#FCFBFA]">
        <Header />
        <main className="pt-28 pb-24 md:pt-40 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 bg-black/5 rounded-full mb-4" />
            <div className="h-4 w-32 bg-black/5 rounded" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBFA]">
      <Header />
      
      <main className="pt-28 pb-24 md:pt-40">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-20">
            <h1 className="text-4xl md:text-6xl font-serif tracking-tight mb-6">
              Your <br /> <span className="italic ml-8 md:ml-16">Curated Desires.</span>
            </h1>
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-black text-black/40">
              <span>{products.length} Items saved</span>
              <div className="w-1 h-1 bg-black/10 rounded-full" />
              <span>Personal Selection</span>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="py-32 text-center border-t border-black/5">
              <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-8">
                <Heart size={32} className="text-black/20" strokeWidth={1} />
              </div>
              <p className="text-xl md:text-2xl font-serif text-black/40 italic mb-10">
                Your heart is currently seeking...
              </p>
              <Link 
                href="/shop"
                className="inline-block bg-black text-white px-12 py-5 text-[12px] uppercase tracking-[0.4em] font-black hover:bg-black/90 transition-all shadow-xl"
              >
                Discover Creations
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              <AnimatePresence>
                {products.map((product) => (
                  <motion.div 
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          
          {products.length > 0 && (
            <div className="mt-24 pt-12 border-t border-black/5 flex justify-center">
              <Link 
                href="/shop"
                className="group flex items-center gap-5 text-[10px] uppercase tracking-[0.4em] font-black text-black"
              >
                Keep Exploring Collections
                <div className="w-12 h-px bg-black/20 group-hover:w-20 transition-all duration-500" />
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;
