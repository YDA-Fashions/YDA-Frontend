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
    subtitle: "Jaipur's soul in every stitch",
    cta: "Explore Collection"
  },
  {
    image: "/images/Slider-image-C/Slider-image-C2.jpg",
    mobileImage: "/images/mobile-slider-/mobile-slider-2.jpg",
    title: "Master Craftsmanship",
    subtitle: "20 years of tailoring excellence",
    cta: "Shop Now"
  },
  {
    image: "/images/Slider-image-C/Slider-image-C3.jpg",
    mobileImage: "/images/mobile-slider-/mobile-slider-3.jpg",
    title: "The Art of Detail",
    subtitle: "Reviving Sanganeri Chapai Culture",
    cta: "Discover More"
  },
  {
    image: "/images/Slider-image-C/Slider-image-C4.jpg",
    mobileImage: "/images/mobile-slider-/mobile-slider-4.jpg",
    title: "Timeless Luxury",
    subtitle: "Crafted for the modern wardrobe",
    cta: "View Collection"
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
    }, 7000);

    return () => {
      window.removeEventListener("resize", checkMobile);
      clearInterval(timer);
    };
  }, []);

  if (!isMounted) return <div className="h-screen bg-foreground" />;

  const currentBanner = BANNERS[currentIndex];
  const bannerImage = isMobile ? currentBanner.mobileImage : currentBanner.image;

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-foreground">
      {/* Background Images with Ken Burns Effect */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, ease: "linear" }}
              className="absolute inset-0"
            >
              <Image
                src={bannerImage}
                alt={currentBanner.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </motion.div>
            {/* Cinematic overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end">
        <div className="container mx-auto px-6 md:px-12 pb-24 md:pb-32">
          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div key={currentIndex}>
                {/* Eyebrow */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/70 mb-4 md:mb-6 font-sans font-medium"
                >
                  Handcrafted Heritage
                </motion.p>

                {/* Main Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
                  className="text-4xl md:text-7xl lg:text-8xl font-serif text-white leading-[0.95] mb-4 md:mb-6 tracking-tight"
                >
                  {currentBanner.title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-sm md:text-lg text-white/80 mb-8 md:mb-10 max-w-lg font-sans"
                >
                  {currentBanner.subtitle}
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <Link
                    href="/shop"
                    className="group inline-flex items-center gap-3 bg-white text-foreground px-8 py-4 text-xs md:text-sm uppercase tracking-[0.15em] font-sans font-semibold transition-all duration-300 hover:bg-foreground hover:text-white"
                  >
                    <span>{currentBanner.cta}</span>
                    <ArrowRight 
                      size={16} 
                      className="transition-transform duration-300 group-hover:translate-x-1" 
                    />
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Progress Bar Navigation */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="container mx-auto px-6 md:px-12 pb-8">
            <div className="flex items-center gap-2 md:gap-4">
              {BANNERS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className="group relative flex-1 h-[2px] bg-white/20 overflow-hidden"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {currentIndex === index && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 7, ease: "linear" }}
                      className="absolute inset-0 bg-white origin-left"
                    />
                  )}
                  <div className="absolute inset-0 bg-white/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 right-6 md:right-12 z-20 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-sans [writing-mode:vertical-lr]">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default Hero;
