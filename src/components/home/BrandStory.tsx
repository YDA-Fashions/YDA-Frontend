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
      title: "Master's Touch", 
      desc: "Every piece is designed and cut by Manoj Tailor, a master craftsman with 20+ years of expertise."
    },
    { 
      icon: Package, 
      title: "Family Legacy", 
      desc: "YDA (Yashika, Dimple, Avani) is a father's tribute to his daughters and their shared heritage."
    },
    { 
      icon: Truck, 
      title: "Chapai Culture", 
      desc: "Bringing the soul of Sanganeri block printing from local clusters to the global stage."
    },
    { 
      icon: RotateCcw, 
      title: "Handcrafted Trust", 
      desc: "We stand by our craft with easy exchanges and a commitment to timeless quality."
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-white border-t border-border-beige">
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
              The Heart of YDA
            </span>
            <h2 className="text-4xl md:text-6xl font-serif tracking-tight mb-8">
              A Master's <span className="italic">Legacy.</span>
            </h2>
            <div className="space-y-6 text-foreground/70 text-base md:text-lg leading-relaxed mb-8">
              <p>
                For over 20 years, <span className="text-black font-medium font-sans italic">Manoj Tailor</span> has been a guardian of the craft. Born into a family of tailors, his journey began not in a classroom, but in his father's studio, where he learned that every cut tells a story.
              </p>
              <p>
                After years of resilience, <span className="text-black font-medium">YDA Fashion Studio</span> was born—a tribute named after his three daughters: <span className="text-accent-dark font-bold">Yashika, Dimple, and Avani</span>. Today, it is a collaboration of generations, where professional precision meets modern vision.
              </p>
              <p>
                Our mission is to revive the <span className="italic">"Chapai"</span> (printing) culture of Sanganer, bringing these timeless patterns from regional heritage to the global fashion stage.
              </p>
            </div>
            <Link 
              href="/story"
              className="inline-block px-10 py-4 border border-foreground/20 text-[10px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-foreground hover:text-background transition-colors"
            >
              Discover Our Roots
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square md:aspect-[4/5] rounded-none overflow-hidden order-1 md:order-2 shadow-2xl"
          >
            <Image
              src="/images/home-page-image/sanganeri-print-1.jpg.png"
              alt="Manoj Tailor's Craft"
              fill
              className="object-cover hover:scale-105 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-black/5" />
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
