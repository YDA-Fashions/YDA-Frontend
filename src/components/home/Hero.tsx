"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const BANNERS = [
  {
    id: 1,
    title: "Heritage Handcrafted",
    subtitle: "New Spring/Summer Collection",
    image: "/images/banner-image/YDA-Home-hero-Banner-1.jpg",
  },
  {
    id: 2,
    title: "The Artisanal Tote",
    subtitle: "Limited Edition Canvas Art",
    image: "/images/banner-image/YDA-Home-hero-Banner-2.jpg",
  },
  {
    id: 3,
    title: "Living Heritage",
    subtitle: "Curated Home Living",
    image: "/images/banner-image/YDA-Home-hero-Banner-3.jpg",
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (!isMounted) return <div className="h-[90vh] md:h-screen w-full bg-[#111]" />;

  return (
    <section className="relative h-[90vh] md:h-screen w-full bg-black overflow-hidden group">
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image with subtle zoom (Ken Burns effect) */}
          <motion.div
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "linear" }}
            className="w-full h-full relative"
          >
            <Image
              src={BANNERS[current].image}
              alt={BANNERS[current].title}
              fill
              className="object-cover"
              priority
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/30" />
          </motion.div>

          {/* Centered Text Content - Manglam Style */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-white text-[10px] md:text-[12px] uppercase tracking-[0.4em] mb-4 md:mb-6 font-medium">
                {BANNERS[current].subtitle}
              </h2>
              <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-serif tracking-wide mb-8 md:mb-12">
                {BANNERS[current].title}
              </h1>
              <Link 
                href="/shop"
                className="text-white border border-white px-8 md:px-12 py-3 md:py-4 text-[10px] md:text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
              >
                View Collection
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-30">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              current === idx ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
      
      {/* Optional Side Arrows (appear on hover) */}
      <button 
        onClick={() => setCurrent((prev) => (prev - 1 + BANNERS.length) % BANNERS.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-30"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <button 
        onClick={() => setCurrent((prev) => (prev + 1) % BANNERS.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-30"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </section>
  );
}
