"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { ArrowRight, Star } from "lucide-react";

export default function StoryPage() {
  const fadeIn: any = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="container mx-auto px-6 mb-24 md:mb-32">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="text-center max-w-4xl mx-auto"
          >
            <p className="text-[10px] uppercase tracking-[0.6em] font-black text-accent-dark mb-8">Established in Jaipur</p>
            <h1 className="text-5xl md:text-8xl font-serif italic mb-12 leading-[1.1]">
              A Narrative of Heritage & Modernity
            </h1>
            <div className="w-16 h-[1px] bg-accent-dark/30 mx-auto" />
          </motion.div>
        </section>

        {/* Vision Section */}
        <section className="container mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative aspect-[4/5] bg-border-beige overflow-hidden shadow-2xl">
              <Image 
                src="/images/home-page-image/sanganeri-print-1.jpg.png"
                alt="Craftsmanship detail"
                fill
                className="object-cover"
              />
            </motion.div>
            <div className="max-w-lg">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
                <h2 className="text-3xl md:text-5xl font-serif italic mb-8">The YDA Philosophy</h2>
                <p className="text-foreground/70 text-lg leading-relaxed mb-8">
                  YDA (Yashoda Indian Arts) was born from a singular vision: to preserve the fading art of traditional Indian hand-block printing while reimagining it for the contemporary luxury landscape.
                </p>
                <p className="text-foreground/70 text-lg leading-relaxed mb-12">
                  Our journey began in the narrow lanes of Sanganer, where the rhythmic sound of wooden blocks meeting fabric has echoed for centuries. We collaborate directly with master artisans to ensure every piece tells a story of patience, precision, and soul.
                </p>
                <div className="flex gap-12">
                  <div>
                    <p className="text-2xl font-serif mb-2">100+</p>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">Artisans</p>
                  </div>
                  <div>
                    <p className="text-2xl font-serif mb-2">10,000+</p>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">Hand-Blocks</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* The Process Section */}
        <section className="bg-[#1A1A1A] text-white py-32 overflow-hidden">
          <div className="container mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-3xl mx-auto">
              <p className="text-[10px] uppercase tracking-[0.6em] font-black text-accent-light/40 mb-8">The Alchemy of Craft</p>
              <h2 className="text-4xl md:text-6xl font-serif italic mb-12">Hand-carved wood, natural dyes, and desert sunlight.</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-20">
                <div>
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-8 text-xs font-serif italic">01</div>
                  <h4 className="text-sm uppercase tracking-widest font-bold mb-4">The Block</h4>
                  <p className="text-sm text-white/40 leading-relaxed">Teak wood blocks are hand-carved with intricate motifs derived from Mughal and Rajasthani heritage.</p>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-8 text-xs font-serif italic">02</div>
                  <h4 className="text-sm uppercase tracking-widest font-bold mb-4">The Pigment</h4>
                  <p className="text-sm text-white/40 leading-relaxed">We use eco-conscious dyes and traditional natural pigments to achieve depths of color that age beautifully.</p>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-8 text-xs font-serif italic">03</div>
                  <h4 className="text-sm uppercase tracking-widest font-bold mb-4">The Impression</h4>
                  <p className="text-sm text-white/40 leading-relaxed">Each impression is a unique heartbeat, creating subtle variations that separate art from manufacturing.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Center Video Section (New) */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="relative w-full aspect-video shadow-2xl overflow-hidden rounded-sm border border-border-beige/10">
                <iframe 
                   src="https://www.youtube.com/embed/Bt0S0hqjVX4"
                   title="YDA Our Story"
                   className="absolute inset-0 w-full h-full"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen
                 />
              </div>
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="container mx-auto px-6 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <Star className="mx-auto mb-8 text-accent-dark" size={32} strokeWidth={1} />
              <h2 className="text-3xl md:text-5xl font-serif italic mb-12 leading-tight">
                "Our commitment is to slow luxury—where time is the most precious ingredient and heritage is our compass."
              </h2>
              <Link 
                href="/shop"
                className="inline-flex items-center gap-4 text-xs uppercase tracking-[0.4em] font-black border-b border-foreground/20 pb-2 hover:border-foreground transition-all group"
              >
                Experience the Collection
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
