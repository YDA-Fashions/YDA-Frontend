"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, RotateCcw, Package } from "lucide-react";

const BrandStory = () => {
  const trustItems = [
    { 
      icon: ShieldCheck, 
      title: "Handcrafted Quality", 
      desc: "Each piece is meticulously crafted by artisans in Rajasthan and Gujarat."
    },
    { 
      icon: Package, 
      title: "Premium Materials", 
      desc: "We use only the finest cotton and sustainable dyes for our fabrics."
    },
    { 
      icon: Truck, 
      title: "Global Delivery", 
      desc: "Thoughtfully packaged and shipped to your doorstep worldwide from India."
    },
    { 
      icon: RotateCcw, 
      title: "Easy Exchanges", 
      desc: "Our commitment to quality means we stand by everything we make."
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-background border-t border-border-beige">
      <div className="container mx-auto px-6">
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-accent-dark mb-4 block">
              The YDA Narrative
            </span>
            <h2 className="text-4xl md:text-6xl font-serif tracking-tight mb-8">
              Heritage <span className="italic">Redefined.</span>
            </h2>
            <p className="text-foreground/70 text-lg leading-relaxed mb-8">
              Founded on the principles of preserving Indian textile heritage, YDA Fashion Studio bridges the gap between traditional craftsmanship and modern luxury.
            </p>
            <p className="text-foreground/60 text-base leading-relaxed mb-10">
              Our artisans specialize in centuries-old block printing and embroidery techniques, ensuring that every bag and cushion cover tells a unique story of culture and dedication.
            </p>
            <Link 
              href="/story"
              className="inline-block px-10 py-4 border border-foreground/20 text-[10px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-foreground hover:text-background transition-colors"
            >
              Explore Our Story
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square md:aspect-[4/5] rounded-none overflow-hidden order-1 md:order-2"
          >
            <Image
              src="/images/artisan-work.jpg"
              alt="Artisan at work"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </motion.div>
        </div>

        {/* Trust Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pt-24 border-t border-border-beige/40">
          {trustItems.map((item, idx) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center text-center gap-4 group"
            >
              <div className="p-4 rounded-full bg-accent/30 text-accent-dark group-hover:scale-110 transition-transform duration-500">
                <item.icon size={24} strokeWidth={1.5} />
              </div>
              <h4 className="text-[12px] uppercase tracking-[0.2em] font-sans font-bold">
                {item.title}
              </h4>
              <p className="text-[12px] text-foreground/40 font-sans leading-relaxed max-w-[200px]">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
