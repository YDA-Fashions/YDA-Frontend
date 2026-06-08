"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const BANNERS = [
  {
    image: "/images/Slider-image-C/Slider-image-C1.jpg",
    title: "Hand-Block Heritage",
    subtitle: "Jaipur's soul in every stitch.",
    mobileBg:
      "bg-gradient-to-br from-[#2A2218] via-[#5C4A38] to-[#9A7B5A]",
  },
  {
    image: "/images/Slider-image-C/Slider-image-C2.jpg",
    title: "Manoj's Mastery",
    subtitle: "20 years of tailoring excellence.",
    mobileBg:
      "bg-gradient-to-br from-[#1E2420] via-[#3D4F42] to-[#6B8570]",
  },
  {
    image: "/images/Slider-image-C/Slider-image-C3.jpg",
    title: "The Art of Detail",
    subtitle: "Reviving Sanganeri Chapai Culture.",
    mobileBg:
      "bg-gradient-to-br from-[#261C1A] via-[#5A3D38] to-[#A67C6B]",
  },
  {
    image: "/images/Slider-image-C/Slider-image-C4.jpg",
    title: "Timeless Luxury",
    subtitle: "Crafted for the modern wardrobe.",
    mobileBg:
      "bg-gradient-to-br from-[#1A1A22] via-[#3A3A4A] to-[#7A6B8A]",
  },
] as const;

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCarouselReady, setIsCarouselReady] = useState(false);

  useEffect(() => {
    setIsCarouselReady(true);
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const currentBanner = BANNERS[currentIndex];

  const renderMobileBackground = (banner: (typeof BANNERS)[number]) => (
    <div className={`absolute inset-0 md:hidden ${banner.mobileBg}`}>
      <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_30%_20%,white,transparent_55%)]" />
      <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_12px,rgba(255,255,255,0.04)_12px,rgba(255,255,255,0.04)_24px)]" />
      <p className="absolute -right-4 top-1/2 -translate-y-1/2 text-[7rem] font-serif italic text-white/[0.06] leading-none select-none pointer-events-none">
        YDA
      </p>
    </div>
  );

  const renderDesktopImage = (
    banner: (typeof BANNERS)[number],
    priority = false
  ) => (
    <Image
      src={banner.image}
      alt={banner.title}
      fill
      priority={priority}
      fetchPriority={priority ? "high" : "auto"}
      quality={75}
      className="hidden object-cover brightness-[0.75] md:block"
      sizes="100vw"
    />
  );

  return (
    <section className="relative h-[85vh] md:h-[95vh] w-full overflow-hidden bg-[#1a1a1a]">
      <div className="absolute inset-0 z-0">
        {!isCarouselReady ? (
          <div className="absolute inset-0">
            {renderMobileBackground(BANNERS[0])}
            {renderDesktopImage(BANNERS[0], true)}
            <div className="absolute inset-0 bg-black/20 md:bg-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 md:bg-gradient-to-b md:from-black/30 md:via-transparent md:to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent opacity-50 md:opacity-60" />
          </div>
        ) : (
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
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: "easeOut" }}
                className="absolute inset-0"
              >
                {renderMobileBackground(currentBanner)}
                {renderDesktopImage(currentBanner, currentIndex === 0)}
              </motion.div>
              <div className="absolute inset-0 bg-black/20 md:bg-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 md:bg-gradient-to-b md:from-black/30 md:via-transparent md:to-black/60" />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent opacity-50 md:opacity-60" />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center text-center px-6 md:px-24">
        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} className="max-w-4xl flex flex-col items-center">
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-xs uppercase text-white tracking-widest mb-4 md:mb-6 font-black drop-shadow-lg"
            >
              Handcrafted Heritage
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
              className="text-5xl md:text-7xl font-heading italic text-white leading-tight mb-6 tracking-tight drop-shadow-2xl"
            >
              {currentBanner.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-sm md:text-base uppercase tracking-wider text-white/90 mb-8 md:mb-10 font-black max-w-xl leading-relaxed drop-shadow-md"
            >
              {currentBanner.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Button onClick={() => window.location.href = '/shop'} variant="primary" size="lg">
                Shop the Collection
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-8">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="group relative flex items-center py-4"
            aria-label={`Go to slide ${index + 1}`}
          >
            <span
              className={`text-[11px] font-black mr-3 transition-colors ${currentIndex === index ? "text-white" : "text-white/20"}`}
            >
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

      <div className="absolute right-12 top-1/2 -translate-y-1/2 z-20 hidden xl:block">
        <p className="text-xs uppercase tracking-[0.8em] text-white/20 font-black vertical-text rotate-180">
          Spring Summer Collection 24
        </p>
      </div>
    </section>
  );
};

export default Hero;
