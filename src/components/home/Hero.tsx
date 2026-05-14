"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
    <section className="relative h-[80vh] md:h-[95vh] w-full overflow-hidden bg-black">
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
              initial={{ scale: 1 }}
              animate={{ scale: 1.1 }}
              transition={{ duration: 8, ease: "linear" }}
              className="absolute inset-0"
            >
              <Image
                src={bannerImage}
                alt={currentBanner.title}
                fill
                priority
                className="object-cover brightness-[0.7]"
                sizes="100vw"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Text Overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center text-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <p className="text-[10px] md:text-xs uppercase tracking-[0.6em] text-white/60 mb-6 font-sans">
              Handcrafted Heritage Since 2004
            </p>
            <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-serif italic text-white leading-[1.0] mb-10 tracking-tighter">
              {BANNERS[currentIndex].title}
            </h1>
            <p className="text-xs md:text-base uppercase tracking-[0.4em] text-white/40 mb-12 font-sans font-black">
              {BANNERS[currentIndex].subtitle}
            </p>
            <Link 
              href="/shop"
              className="inline-block px-12 py-5 bg-white text-black text-[10px] uppercase tracking-[0.4em] font-black transition-all hover:bg-black hover:text-white shadow-2xl"
            >
              Explore the selection
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="group relative py-4"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div className={`h-[2px] transition-all duration-700 ${
              currentIndex === index ? "w-12 bg-white" : "w-6 bg-white/20 group-hover:bg-white/40"
            }`} />
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 right-12 z-20 hidden lg:flex flex-col items-center gap-6"
      >
        <span className="text-[9px] uppercase tracking-[0.5em] text-white/30 font-sans vertical-text">Scroll</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-white/30 to-transparent" />
      </motion.div>
    </section>
  );
};


export default Hero;
