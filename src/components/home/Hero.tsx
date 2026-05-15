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
    <section className="relative h-[85vh] md:h-[98vh] w-full overflow-hidden bg-black">
      {/* Background Cinematic Layers */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 1.8, ease: [0.19, 1, 0.22, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={bannerImage}
              alt={currentBanner.title}
              fill
              priority
              className="object-cover brightness-[0.65]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating UI Elements */}
      <div className="absolute inset-0 z-10 container mx-auto px-6 flex flex-col justify-center">
        <div className="max-w-6xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="relative"
            >
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
              >
                <p className="text-[10px] md:text-xs uppercase tracking-[1em] text-white/40 mb-8 font-sans font-black flex items-center gap-4">
                  <span className="w-12 h-[1px] bg-white/20" />
                  Masterpiece {currentIndex + 1} / {BANNERS.length}
                </p>
                
                <h1 className="text-6xl md:text-8xl lg:text-[12rem] font-serif italic text-white leading-[0.85] mb-12 tracking-tighter drop-shadow-2xl">
                  {currentBanner.title.split(' ').map((word, i) => (
                    <motion.span 
                      key={i}
                      initial={{ opacity: 0, rotateX: 90 }}
                      animate={{ opacity: 1, rotateX: 0 }}
                      transition={{ delay: 0.2 + (i * 0.1), duration: 0.8 }}
                      className="inline-block mr-6 last:mr-0"
                    >
                      {word}
                    </motion.span>
                  ))}
                </h1>

                <div className="flex flex-col md:flex-row md:items-end gap-12">
                   <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 max-w-md rounded-sm">
                      <p className="text-xs md:text-sm text-white/60 leading-relaxed uppercase tracking-widest font-sans mb-8 italic">
                        {currentBanner.subtitle}
                      </p>
                      <Link 
                        href="/shop"
                        className="group flex items-center gap-6 text-[10px] uppercase tracking-[0.4em] font-black text-white hover:text-white/60 transition-all"
                      >
                        Explore Curation
                        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                          <ArrowRight size={18} />
                        </div>
                      </Link>
                   </div>

                   <div className="hidden lg:flex items-center gap-12 pb-4">
                      <div className="text-left">
                        <p className="text-[8px] uppercase tracking-widest text-white/30 mb-2">Technique</p>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-white">Traditional Chapa</p>
                      </div>
                      <div className="w-[1px] h-8 bg-white/10" />
                      <div className="text-left">
                        <p className="text-[8px] uppercase tracking-widest text-white/30 mb-2">Artisan</p>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-white">Manoj Tailor</p>
                      </div>
                   </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Modern Navigation */}
      <div className="absolute bottom-12 left-6 right-6 md:left-12 md:right-12 z-30 flex items-end justify-between">
        <div className="flex gap-4">
          {BANNERS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="relative w-12 h-1 bg-white/10 overflow-hidden rounded-full transition-all"
            >
              {currentIndex === index && (
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 6, ease: "linear" }}
                  className="absolute inset-0 bg-white"
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-end gap-4">
           <p className="text-[9px] uppercase tracking-[0.5em] text-white/20 font-black">Scroll for Journey</p>
           <div className="w-px h-16 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>
    </section>
  );
};


export default Hero;
