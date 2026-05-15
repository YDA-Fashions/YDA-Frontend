"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const BANNERS = [
  {
    image: "/images/Slider-image-C/Slider-image-C1.jpg",
    mobileImage: "/images/mobile-slider-/mobile-slider-1.jpg",
    title: "Hand-Block Heritage",
    subtitle: "Jaipur's soul in every stitch."
  },
  {
    image: "/images/Slider-image-C/Slider-image-C2.jpg",
    mobileImage: "/images/mobile-slider-/mobile-slider-2.jpg",
    title: "Manoj's Mastery",
    subtitle: "20 years of tailoring excellence."
  },
  {
    image: "/images/Slider-image-C/Slider-image-C3.jpg",
    mobileImage: "/images/mobile-slider-/mobile-slider-3.jpg",
    title: "The Art of Detail",
    subtitle: "Reviving Sanganeri Chapai Culture."
  },
  {
    image: "/images/Slider-image-C/Slider-image-C4.jpg",
    mobileImage: "/images/mobile-slider-/mobile-slider-4.jpg",
    title: "Timeless Luxury",
    subtitle: "Crafted for the modern wardrobe."
  },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 6000);

    return () => {
      window.removeEventListener("resize", checkMobile);
      clearInterval(timer);
    };
  }, []);

  if (!isMounted) return <div className="h-[95vh] bg-black" />;

  const currentBanner = BANNERS[currentIndex];
  const bannerImage = isMobile ? currentBanner.mobileImage : currentBanner.image;

  return (
    <section className="relative h-[85vh] md:h-[95vh] w-full overflow-hidden bg-black">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={bannerImage}
                alt={currentBanner.title}
                fill
                priority
                className="object-cover brightness-[0.75]"
                sizes="100vw"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Text Overlay - Premium Brand Style */}
      <div className="absolute inset-0 z-10 flex items-center justify-center text-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="max-w-5xl"
          >
            <motion.p 
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              animate={{ opacity: 1, letterSpacing: "0.6em" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-[10px] md:text-xs uppercase text-white/60 mb-8 font-sans font-black"
            >
              Handcrafted Heritage Since 2004
            </motion.p>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40, skewY: 2 }}
              animate={{ opacity: 1, y: 0, skewY: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
              className="text-6xl md:text-[9rem] font-serif italic text-white leading-[0.9] mb-12 tracking-tighter"
            >
              {currentBanner.title}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-[10px] md:text-sm uppercase tracking-[0.4em] text-white/40 mb-14 font-sans font-black max-w-2xl mx-auto leading-relaxed"
            >
              {currentBanner.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Link 
                href="/shop"
                className="inline-block px-14 py-6 bg-white text-black text-[10px] uppercase tracking-[0.4em] font-black transition-all hover:bg-black hover:text-white hover:scale-105 active:scale-95 shadow-2xl"
              >
                Explore the selection
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Premium Slider Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-8">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="group relative flex items-center py-4"
            aria-label={`Go to slide ${index + 1}`}
          >
            <span className={`text-[8px] font-black mr-3 transition-colors ${currentIndex === index ? "text-white" : "text-white/20"}`}>
              0{index + 1}
            </span>
            <div className="relative w-16 h-[1px] bg-white/10 overflow-hidden">
              {currentIndex === index && (
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 6, ease: "linear" }}
                  className="absolute inset-0 bg-white"
                />
              )}
              <div className="absolute inset-0 bg-white/20 translate-y-[1px] group-hover:translate-y-0 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* Side Label */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 z-20 hidden xl:block">
        <p className="text-[9px] uppercase tracking-[0.8em] text-white/20 font-black vertical-text rotate-180">
          Spring Summer Collection 24
        </p>
      </div>
    </section>
  );
};


export default Hero;
