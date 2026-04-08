"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "../products/ProductCard";
import { PRODUCTS } from "../../data/products";

const FeaturedProducts = () => {
  const featuredItems = PRODUCTS.filter(p => p.isFeatured).slice(0, 4);

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 md:mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-foreground/40 mb-4 block"
            >
              Curated Essentials
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-serif tracking-tight"
            >
              The Season's <br /> <span className="italic">Key Pieces.</span>
            </motion.h2>
          </div>

          <Link 
            href="/shop"
            className="group flex items-center gap-4 text-xs uppercase tracking-[0.2em] font-sans font-bold border-b border-foreground/10 hover:border-foreground transition-all duration-300 pb-1"
          >
            Explore All Creations
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-6 md:gap-x-12 gap-y-16">
          {featuredItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
