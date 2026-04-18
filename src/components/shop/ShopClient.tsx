"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/data/products";

interface ShopClientProps {
  initialProducts: Product[];
}

export default function ShopClient({ initialProducts }: ShopClientProps) {
  const searchParams = useSearchParams();
  const printFilter = searchParams?.get("print");
  const categoryFilter = searchParams?.get("category");

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSort, setActiveSort] = useState("Recommended");
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    let result = [...initialProducts];
    
    if (printFilter) {
      result = result.filter(p => p.type.toLowerCase() === printFilter.toLowerCase());
    }
    
    if (categoryFilter) {
      result = result.filter(p => p.category === categoryFilter);
    }

    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredProducts(result);
  }, [printFilter, categoryFilter, searchQuery, initialProducts]);

  const sortOptions = ["Recommended", "Price: Low to High", "Price: High to Low", "Newest"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-28 pb-24 md:pt-40">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-8 border-b border-border-beige pb-10">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-serif tracking-tight uppercase"
              >
                The Studio <br /> <span className="italic ml-8 md:ml-20">Full Selection.</span>
              </motion.h1>
              <p className="mt-6 text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-foreground/40">
                Found {filteredProducts.length} Creations
              </p>
            </div>

            <div className="flex items-center gap-12 self-end w-full md:w-auto">
              <button className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-foreground/60 hover:text-foreground transition-colors group">
                <SlidersHorizontal size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                Filter Collections
              </button>

              <div className="relative">
                <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-foreground/60 hover:text-foreground transition-colors group"
                >
                  Sort By: {activeSort}
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`} />
                </button>
                
                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute right-0 top-full mt-4 bg-white border border-border-beige p-6 min-w-[200px] z-30 shadow-2xl space-y-4"
                    >
                      {sortOptions.map((opt) => (
                        <button 
                          key={opt}
                          onClick={() => { setActiveSort(opt); setIsSortOpen(false); }}
                          className="w-full text-left text-[10px] uppercase tracking-widest flex items-center justify-between hover:text-accent-dark transition-colors"
                        >
                          {opt}
                          {activeSort === opt && <Check size={12} />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-32 text-center">
              <p className="text-2xl font-serif italic text-foreground/30">No creations found in this selection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-20">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-32 pt-16 border-t border-border-beige flex justify-center items-center gap-8">
             <span className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-foreground/20">Prev</span>
             <div className="flex gap-4">
                <span className="text-xl font-serif italic border-b border-foreground px-2">1</span>
                <span className="text-xl font-serif opacity-20 px-2 cursor-pointer hover:opacity-100 transition-opacity">2</span>
                <span className="text-xl font-serif opacity-20 px-2 cursor-pointer hover:opacity-100 transition-opacity">3</span>
             </div>
             <span className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold hover:text-foreground transition-colors cursor-pointer">Next Page</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
