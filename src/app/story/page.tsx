"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { ArrowRight, Star, Heart, Award, ShieldCheck } from "lucide-react";

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-[#FCFBFA]">
      <Header />
      
      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="container mx-auto px-6 mb-24 md:mb-40">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="text-center max-w-5xl mx-auto"
          >
            <p className="text-[10px] uppercase tracking-[0.6em] font-black text-accent-dark mb-10">The Manoj Tailor Legacy</p>
            <h1 className="text-5xl md:text-9xl font-serif italic mb-16 leading-[1.0] tracking-tighter">
              Crafting a <br/> Modern Heritage
            </h1>
            <div className="w-24 h-[1px] bg-black/10 mx-auto" />
          </motion.div>
        </section>

        {/* Founder Story Section */}
        <section className="container mx-auto px-6 mb-40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }} 
              transition={{ duration: 1 }} 
              className="lg:col-span-6 relative aspect-[4/5] bg-border-beige overflow-hidden shadow-2xl rounded-sm"
            >
              <Image 
                src="/images/brand-story-image-1.png"
                alt="Manoj Tailor - The Visionary"
                fill
                className="object-cover hover:scale-105 transition-all duration-[2s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 text-white">
                <p className="text-[10px] uppercase tracking-[0.4em] font-black mb-2 text-white/60">The Mastermind</p>
                <p className="text-3xl font-serif italic drop-shadow-lg">Manoj Tailor</p>
              </div>
            </motion.div>
            
            <div className="lg:col-span-6 flex flex-col gap-10">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <h2 className="text-3xl md:text-5xl font-serif italic mb-10 leading-tight">20 Years of Mastery. <br/>One Vision.</h2>
                <div className="space-y-8 text-black/60 text-lg leading-relaxed font-sans">
                  <p>
                    For two decades, Manoj Tailor has lived at the intersection of needle and thread. Coming from a traditional tailoring background, he spent years mastering the silent language of fabrics, understanding that luxury isn't just about the price—it's about the soul of the craft.
                  </p>
                  <p>
                    The journey wasn't easy. After leaving formal education to support his family's legacy, Manoj honed his skills in the workshops of Jaipur, learning that the true beauty of Indian art lies in its resilience.
                  </p>
                  <p className="text-black font-serif italic text-2xl border-l-2 border-black/10 pl-8 my-12">
                    "Every stitch is a promise. Every print is a memory of our ancestors' art."
                  </p>
                  <p>
                    When the world stopped in 2020, Manoj didn't. He saw an opportunity to bring the hidden masterpieces of Sanganeri Chapai to the global stage. He started small, naming his venture after his greatest inspiration—his daughters.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* The Y-D-A Connection */}
        <section className="py-32 bg-black text-white overflow-hidden mb-40">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto text-center">
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-[10px] uppercase tracking-[0.8em] font-black text-white/30 mb-12">The Meaning of YDA</motion.p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex flex-col items-center">
                  <span className="text-8xl md:text-9xl font-serif italic mb-6">Y</span>
                  <h4 className="text-sm uppercase tracking-widest font-black mb-2">Yashika</h4>
                  <div className="w-8 h-px bg-white/20 mb-4" />
                  <p className="text-xs text-white/40 uppercase tracking-[0.2em]">The Strength</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col items-center">
                  <span className="text-8xl md:text-9xl font-serif italic mb-6">D</span>
                  <h4 className="text-sm uppercase tracking-widest font-black mb-2">Dimple</h4>
                  <div className="w-8 h-px bg-white/20 mb-4" />
                  <p className="text-xs text-white/40 uppercase tracking-[0.2em]">The Spirit</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex flex-col items-center">
                  <span className="text-8xl md:text-9xl font-serif italic mb-6">A</span>
                  <h4 className="text-sm uppercase tracking-widest font-black mb-2">Avani</h4>
                  <div className="w-8 h-px bg-white/20 mb-4" />
                  <p className="text-xs text-white/40 uppercase tracking-[0.2em]">The Soul</p>
                </motion.div>
              </div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="mt-24 max-w-2xl mx-auto">
                <p className="text-lg md:text-xl font-serif italic text-white/60 leading-relaxed">
                  Three daughters, one legacy. YDA isn't just a brand; it's a father's tribute to the next generation of Indian women, blending tradition with modern independence.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Global Mission Section */}
        <section className="container mx-auto px-6 mb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="text-3xl md:text-5xl font-serif italic mb-10">Reviving the Sanganeri Chapai Culture.</h2>
                <div className="space-y-10">
                  <div className="flex gap-8">
                    <div className="w-12 h-12 flex-shrink-0 bg-accent/10 rounded-full flex items-center justify-center">
                      <Award size={20} className="text-accent-dark" />
                    </div>
                    <div>
                      <h4 className="text-sm uppercase tracking-widest font-black mb-3">Artisan Empowerment</h4>
                      <p className="text-black/60 leading-relaxed">We work directly with the master printers of Jaipur, bypassing middle-men to ensure the artists receive the recognition and reward they deserve.</p>
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <div className="w-12 h-12 flex-shrink-0 bg-emerald-50 rounded-full flex items-center justify-center">
                      <ShieldCheck size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-sm uppercase tracking-widest font-black mb-3">Authentic Heritage</h4>
                      <p className="text-black/60 leading-relaxed">Every piece is certified YDA. We use traditional teak-wood blocks and age-old pigments to maintain the depth and character of real hand-printing.</p>
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <div className="w-12 h-12 flex-shrink-0 bg-black/5 rounded-full flex items-center justify-center">
                      <Heart size={20} className="text-black" />
                    </div>
                    <div>
                      <h4 className="text-sm uppercase tracking-widest font-black mb-3">Family Values</h4>
                      <p className="text-black/60 leading-relaxed">From Manoj's studio to your home, we treat every customer like a part of the YDA family, overseen by the founder's eldest daughter.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              className="order-1 lg:order-2 relative aspect-square"
            >
              <Image 
                src="/images/brand-story-image-3.png"
                alt="YDA Craftsmanship"
                fill
                className="object-cover rounded-sm shadow-2xl"
              />
            </motion.div>
          </div>
        </section>

        {/* Video Feature */}
        <section className="py-32 bg-[#F8F8F5] border-y border-black/5">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-5xl mx-auto space-y-16">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-black/30 mb-6">Visual Journey</p>
                <h2 className="text-4xl md:text-7xl font-serif italic">The Art of Stillness</h2>
              </div>
              <div className="relative w-full aspect-video shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] rounded-sm overflow-hidden">
                <iframe 
                  src="https://www.youtube.com/embed/Bt0S0hqjVX4"
                  title="YDA Story Video"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        {/* Final Quote */}
        <section className="py-40 text-center">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <Star size={40} className="mx-auto mb-12 text-accent-dark opacity-40" strokeWidth={1} />
              <h2 className="text-4xl md:text-7xl font-serif italic mb-16 max-w-4xl mx-auto leading-[1.1]">
                "We don't just sell bags; we carry forward a thousand years of Indian heartbeats."
              </h2>
              <div className="flex flex-col items-center gap-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-px bg-black/10" />
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black">Manoj Tailor, Founder</p>
                  <div className="w-16 h-px bg-black/10" />
                </div>
                <Link 
                  href="/shop"
                  className="px-16 py-6 bg-black text-white text-[11px] uppercase tracking-[0.4em] font-black transition-all hover:bg-accent-dark hover:-translate-y-2 shadow-2xl"
                >
                  Shop the selection
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
