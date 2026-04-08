"use client";

import React from "react";
import { motion } from "framer-motion";

const VideoSection = () => {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden bg-zinc-900">
      {/* Background Video Placeholder */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="h-full w-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-on-a-pavement-in-slow-motion-1200-large.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Overlay Text */}
      <div className="relative z-10 container mx-auto px-6 h-full flex items-center justify-center">
        <div className="text-center">
          <motion.h2 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 1.5 }}
             className="text-4xl md:text-7xl lg:text-8xl font-serif text-white tracking-widest leading-none mb-12"
          >
            HAND-CRAFTED <br /> <span className="italic">HERITAGE.</span>
          </motion.h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 mt-16 md:mt-24">
            <div className="flex flex-col items-center gap-4 group cursor-help">
              <span className="text-[10px] md:text-[12px] uppercase tracking-[0.4em] text-white/40 font-bold group-hover:text-white transition-colors duration-500">
                Crafted in Jaipur
              </span>
              <div className="w-16 md:w-24 h-[1px] bg-white/20 group-hover:w-32 md:group-hover:w-40 transition-all duration-700" />
            </div>
            
            <div className="flex flex-col items-center gap-4 group cursor-help">
              <span className="text-[10px] md:text-[12px] uppercase tracking-[0.4em] text-white/40 font-bold group-hover:text-white transition-colors duration-500">
                Ethical Materials
              </span>
              <div className="w-16 md:w-24 h-[1px] bg-white/20 group-hover:w-32 md:group-hover:w-40 transition-all duration-700" />
            </div>
            
            <div className="flex flex-col items-center gap-4 group cursor-help">
              <span className="text-[10px] md:text-[12px] uppercase tracking-[0.4em] text-white/40 font-bold group-hover:text-white transition-colors duration-500">
                Heritage Sourcing
              </span>
              <div className="w-16 md:w-24 h-[1px] bg-white/20 group-hover:w-32 md:group-hover:w-40 transition-all duration-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-5 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
    </section>
  );
};

export default VideoSection;
