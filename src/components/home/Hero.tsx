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

  // Use a simple div if not mounted to ensure something is there
  if (!isMounted) {
    return (
      <div className="w-full h-[70vh] md:h-screen bg-neutral-900 flex items-center justify-center">
        <span className="text-white/20 uppercase tracking-[1em] text-[10px]">YDA Loading...</span>
      </div>
    );
  }

  return (
    <section className="relative w-full h-[70vh] md:h-screen bg-black overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Layer */}
          <div className="relative w-full h-full">
            <Image
              src={BANNERS[current].image}
              alt={BANNERS[current].title}
              fill
              className="object-cover opacity-80"
              priority
              quality={90}
            />
            {/* Dark Gradient Overlay for Manglam Style */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />
          </div>

          {/* Content Layer */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-5xl"
            >
              <h2 className="text-white text-[10px] md:text-xs uppercase tracking-[0.6em] font-black mb-8 drop-shadow-lg opacity-80">
                {BANNERS[current].subtitle}
              </h2>
              <h1 className="text-white text-5xl md:text-8xl lg:text-[120px] font-serif leading-none tracking-tight mb-12 drop-shadow-2xl">
                {BANNERS[current].title}
              </h1>
              <Link 
                href="/shop"
                className="inline-block border border-white text-white px-12 py-5 text-[10px] uppercase tracking-[0.4em] font-black hover:bg-white hover:text-black transition-all duration-500"
              >
                Shop Selection
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Indicators */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-4 z-30">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              current === idx ? "bg-white scale-125" : "bg-white/20 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
