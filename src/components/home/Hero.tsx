"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const BANNERS = [
  "/images/Slider-image-C/Slider-image-C1.jpg",
  "/images/Slider-image-C/Slider-image-C2.jpg",
  "/images/Slider-image-C/Slider-image-C3.jpg",
  "/images/Slider-image-C/Slider-image-C4.jpg",
  "/images/Slider-image-C/Slider-image-C5.jpg",
  "/images/Slider-image-C/Slider-image-C6.jpg",
];



const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 4000);

    return () => {
      window.removeEventListener("resize", checkMobile);
      clearInterval(timer);
    };
  }, [isMobile]);

  const activeBanners = BANNERS;

  return (
    <section className="relative h-auto aspect-[16/9] md:h-[95vh] w-full overflow-hidden bg-black max-h-[300px] md:max-h-none">
      {/* Background Slider with Fade Effect */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${isMobile ? "mob" : "desk"}-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <Image
              src={activeBanners[currentIndex % activeBanners.length]}
              alt={`YDA Premium Banner ${currentIndex + 1}`}
              fill
              priority={currentIndex === 0}
              className="object-cover brightness-[0.85]"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slider Indicators (Dots) - Slightly Higher for better visibility on 85vh */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
        {activeBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 transition-all duration-500 ${
              currentIndex % activeBanners.length === index ? "w-8 bg-white" : "w-4 bg-white/30"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator (Refined for Slider) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 right-10 z-20 flex flex-col items-center gap-4 hidden md:flex"
      >
        <span className="text-[8px] uppercase tracking-[0.4em] text-white/40 font-sans rotate-90 mb-8">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
