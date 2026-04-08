"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const SanganeriGujaratiShowcase = () => {
  const scrollFadeIn: any = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8 }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-foreground font-sans overflow-x-hidden">
      <title>Sanganeri & Gujarati Prints | Heritage Showcase | YDA</title>
      <meta name="description" content="Discover the timeless artistry of Sanganeri and Gujarati prints. An editorial showcase of traditional print heritage, handcrafted fabrics, and cultural narratives." />
      
      <Header />
      
      <main>
        {/* 1. Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <Image 
            src="/images/cushions/floral/YDA-CC-001-red-1.jpg"
            alt="Heritage Bloom Backdrop"
            fill
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative text-center text-white px-6">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] md:text-sm uppercase tracking-[0.5em] mb-4 font-bold"
            >
              The Soul of the Loom
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-9xl font-serif tracking-tight leading-none"
            >
              Sanganeri & <br /> <span className="italic">Gujarati.</span>
            </motion.h1>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-white opacity-60">Begin the Narrative</span>
            <div className="w-[1px] h-12 bg-white/40" />
          </motion.div>
        </section>

        {/* 2. Sanganeri Story - Split Section */}
        <section className="py-24 md:py-44 container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="relative aspect-[4/5] bg-border-beige overflow-hidden">
              <Image 
                src="/images/cushions/floral/YDA-CC-001-red-3.jpg"
                alt="Sanganeri Print Detail"
                fill
                className="object-cover hover:scale-110 transition-transform duration-[2s]"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-md">
              <h2 className="text-4xl md:text-6xl font-serif italic mb-8">The Sanganeri Rhythm</h2>
              <p className="text-foreground/70 leading-relaxed mb-6 font-sans">
                Hailing from the heart of Jaipur, Sanganeri art is a celebration of fine lines and botanical precision. Every motif is hand-blocked with a rhythmic cadence, traditionally on cotton and silk, using century-old techniques that capture the vibrant spirit of Rajasthan.
              </p>
              <div className="w-12 h-[1px] bg-accent-dark opacity-30" />
            </motion.div>
          </div>
        </section>

        {/* 3. Visual Break - Full Width Parallax-style */}
        <section className="relative h-[60vh] md:h-[80vh] bg-border-beige overflow-hidden">
          <motion.div 
            style={{ y: "-10%" }}
            className="absolute inset-0"
          >
            <Image 
              src="/images/cushions/floral/YDA-CC-003-white-1.jpg"
              alt="Vibrant Print Break"
              fill
              className="object-cover brightness-90"
            />
          </motion.div>
        </section>

        {/* 4. Gujarati Story - Split (Reversed) */}
        <section className="py-24 md:py-44 container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="lg:order-2 relative aspect-[4/5] bg-border-beige overflow-hidden">
              <Image 
                src="/images/cushions/floral/YDA-CC-002-red-4.jpg"
                alt="Gujarati Print Detail"
                fill
                className="object-cover hover:scale-110 transition-transform duration-[2s]"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.2 }} className="lg:order-1 lg:ml-auto max-w-md">
              <h2 className="text-4xl md:text-6xl font-serif italic mb-8">Gujarati Opulence</h2>
              <p className="text-foreground/70 leading-relaxed mb-6 font-sans">
                A bold dialogue of geometry and heritage. Gujarati prints are defined by their structural richness and cultural depth. From the intricate Bandhani to the structured Ajrakh, these designs represent the resilient spirit and artistic legacy of western India.
              </p>
              <div className="w-12 h-[1px] bg-accent-dark opacity-30" />
            </motion.div>
          </div>
        </section>

        {/* 5. Craftsmanship & Visual Collage */}
        <section className="bg-white py-24 md:py-44 border-t border-border-beige">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-serif mb-6 tracking-tight uppercase">Crafted, Not Made.</h2>
              <p className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-accent-dark mb-8">The Process Behind the Print</p>
              <p className="text-foreground/50 text-sm leading-relaxed">
                At YDA, our prints are more than just designs — they are living artifacts. Each fabric is treated as a canvas, where artisans apply pressure and pigments to bring ancient stories into modern silhouettes. A slow, meditative process that defies mass production.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-[600px]">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="relative h-full overflow-hidden">
                  <Image src="/images/bags/tote/small/YDA-TB-001-beige-4.jpg" alt="Texture 1" fill className="object-cover" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.1 }} className="relative h-full lg:mt-12 overflow-hidden">
                  <Image src="/images/bags/tote/small/YDA-TB-001-beige-6.jpg" alt="Texture 2" fill className="object-cover" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.2 }} className="relative h-full overflow-hidden">
                  <Image src="/images/cushions/floral/YDA-CC-003-white-2.jpg" alt="Detail 1" fill className="object-cover" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.3 }} className="relative h-full lg:mt-12 overflow-hidden">
                  <Image src="/images/cushions/floral/YDA-CC-001-red-5.jpg" alt="Detail 2" fill className="object-cover" />
                </motion.div>
            </div>
          </div>
        </section>

        {/* 6. Editorial CTA */}
        <section className="py-24 md:py-44 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
              <h3 className="text-3xl font-serif italic opacity-30 mb-8 max-w-lg mx-auto">Explore the transition from heritage art to modern silhouettes.</h3>
              <a href="/shop" className="inline-block px-12 py-4 border border-foreground text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-foreground hover:text-white transition-all duration-500">
                Explore The Studio
              </a>
            </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SanganeriGujaratiShowcase;
