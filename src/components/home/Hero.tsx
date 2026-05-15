"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const BANNERS = [
  {
    id: 1,
    title: "Heritage",
    subtitle: "Spring/Summer Collection",
    description: "Discover the intersection of ancient craftsmanship and modern silhouettes. Handcrafted by master artisans in the heart of Sanganer.",
    image: "/images/banner-image/YDA-Home-hero-Banner-1.jpg",
  },
  {
    id: 2,
    title: "Artistry",
    subtitle: "The Canvas Series",
    description: "Every stitch tells a story of generation-old secrets. Our latest totes are designed for the modern collector of fine arts.",
    image: "/images/banner-image/YDA-Home-hero-Banner-2.jpg",
  },
  {
    id: 3,
    title: "Legacy",
    subtitle: "New Living Archives",
    description: "Transform your sanctuary with our Heritage Garden series. Hand-printed floral motifs that breathe life into your home.",
    image: "/images/banner-image/YDA-Home-hero-Banner-3.jpg",
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrent((curr) => (curr + 1) % BANNERS.length);
          return 0;
        }
        return prev + 0.4;
      });
    }, 40);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % BANNERS.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
    setProgress(0);
  };

  return (
    <section className="relative h-[90vh] md:h-screen w-full bg-[#FDFBF7] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex flex-col lg:flex-row"
        >
          {/* Text Content - Left Side */}
          <div className="w-full lg:w-[45%] h-full flex flex-col justify-center px-8 md:px-20 lg:px-32 relative z-20">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="text-[10px] uppercase tracking-[0.5em] font-black text-black/40 mb-6 block">
                {BANNERS[current].subtitle}
              </span>
              <h1 className="text-[80px] md:text-[120px] lg:text-[180px] font-serif leading-[0.8] tracking-tighter text-black mb-10">
                {BANNERS[current].title}
              </h1>
              <p className="text-sm md:text-base text-black/60 max-w-sm leading-relaxed mb-12 font-sans">
                {BANNERS[current].description}
              </p>
              
              <Link href="/shop" className="group inline-flex items-center gap-6">
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-black">Explore Collection</span>
                <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500">
                  <ArrowRight size={18} strokeWidth={1} />
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Image Content - Right Side */}
          <div className="w-full lg:w-[55%] h-full relative overflow-hidden">
            <motion.div
              initial={{ scale: 1.1, x: 50 }}
              animate={{ scale: 1, x: 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full"
            >
              <Image
                src={BANNERS[current].image}
                alt={BANNERS[current].title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7] via-transparent to-transparent hidden lg:block" />
            </motion.div>

            {/* Subtle Float Number */}
            <div className="absolute top-20 right-20 hidden lg:block overflow-hidden">
              <motion.div
                key={current}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                className="text-[200px] font-serif italic text-black/5 font-black leading-none"
              >
                0{current + 1}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-12 left-8 md:left-20 lg:left-32 right-8 md:right-20 lg:right-32 flex items-end justify-between z-30">
        <div className="flex gap-12 items-center">
          <div className="flex gap-6">
            <button onClick={prevSlide} className="text-black/30 hover:text-black transition-colors uppercase text-[9px] font-black tracking-widest">Prev</button>
            <div className="w-px h-3 bg-black/10 self-center" />
            <button onClick={nextSlide} className="text-black/30 hover:text-black transition-colors uppercase text-[9px] font-black tracking-widest">Next</button>
          </div>
          
          <div className="hidden md:flex gap-4">
            {BANNERS.map((_, idx) => (
              <div key={idx} className="h-[2px] w-12 bg-black/5 relative overflow-hidden">
                {current === idx && (
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute inset-0 bg-black origin-left"
                    style={{ scaleX: progress / 100 }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-black/20 mb-1">Curation</span>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-black">Artisan Handcrafted</span>
        </div>
      </div>
    </section>
  );
}
