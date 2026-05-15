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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrent((curr) => (curr + 1) % BANNERS.length);
          return 0;
        }
        return prev + 0.5;
      });
    }, 40);
    return () => clearInterval(timer);
  }, []);

  if (!isMounted) return <div className="h-screen w-full bg-[#FDFBF7]" />;

  const activeBanner = BANNERS[current];

  return (
    <section className="relative h-[80vh] md:h-screen w-full bg-[#FDFBF7] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 flex flex-col lg:flex-row"
        >
          {/* Left Content */}
          <div className="w-full lg:w-[45%] h-1/2 lg:h-full flex flex-col justify-center px-6 md:px-20 lg:px-32 relative z-20">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="text-[10px] uppercase tracking-[0.5em] font-black text-black/40 mb-4 md:mb-6 block">
                {activeBanner.subtitle}
              </span>
              <h1 className="text-[60px] md:text-[100px] lg:text-[150px] font-serif leading-[0.85] tracking-tighter text-black mb-6 md:mb-10">
                {activeBanner.title}
              </h1>
              <p className="text-xs md:text-sm text-black/60 max-w-sm leading-relaxed mb-8 md:mb-12 font-sans">
                {activeBanner.description}
              </p>
              
              <Link href="/shop" className="group inline-flex items-center gap-4 md:gap-6">
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-black">Explore Selection</span>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500">
                  <ArrowRight size={16} strokeWidth={1} />
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-[55%] h-1/2 lg:h-full relative overflow-hidden">
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
              className="w-full h-full"
            >
              <Image
                src={activeBanner.image}
                alt={activeBanner.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7] via-transparent to-transparent hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-transparent to-transparent lg:hidden" />
            </motion.div>

            <div className="absolute top-10 right-10 hidden lg:block overflow-hidden">
              <motion.div
                key={current}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                className="text-[150px] font-serif italic text-black/[0.03] font-black leading-none"
              >
                0{current + 1}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Minimal Navigation */}
      <div className="absolute bottom-10 left-6 md:left-20 lg:left-32 right-6 md:right-20 lg:right-32 flex items-end justify-between z-30">
        <div className="flex gap-8 items-center">
          <div className="flex gap-4">
            <button onClick={() => setCurrent((prev) => (prev - 1 + BANNERS.length) % BANNERS.length)} className="text-black/30 hover:text-black transition-colors uppercase text-[9px] font-black tracking-widest">Prev</button>
            <button onClick={() => setCurrent((prev) => (prev + 1) % BANNERS.length)} className="text-black/30 hover:text-black transition-colors uppercase text-[9px] font-black tracking-widest">Next</button>
          </div>
          
          <div className="hidden md:flex gap-3">
            {BANNERS.map((_, idx) => (
              <div key={idx} className="h-[1px] w-10 bg-black/5 relative overflow-hidden">
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

        <div className="flex flex-col items-end opacity-20">
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-black italic">Artisan Heritage</span>
        </div>
      </div>
    </section>
  );
}
