"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const BrandStory = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-2 md:order-1"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-4 block font-sans">
              Our Heritage
            </span>
            <h2 className="text-3xl md:text-5xl font-serif mb-6">
              A Master&apos;s Legacy
            </h2>
            <div className="space-y-4 text-muted-foreground font-sans leading-relaxed mb-8">
              <p>
                For over 20 years, <span className="text-foreground font-medium">Manoj Tailor</span> has been a guardian of traditional craft. Born into a family of artisans, his journey began not in a classroom, but in his father&apos;s studio.
              </p>
              <p>
                <span className="text-foreground font-medium">YDA Fashion Studio</span> was born as a tribute to his three daughters: Yashika, Dimple, and Avani. Today, it is a collaboration of generations, where traditional precision meets modern vision.
              </p>
              <p>
                Our mission is to revive the &ldquo;Chapai&rdquo; (printing) culture of Sanganer, bringing these timeless patterns from regional heritage to the global fashion stage.
              </p>
            </div>
            <Link
              href="/story"
              className="group inline-flex items-center gap-3 border border-foreground px-8 py-4 text-xs uppercase tracking-[0.15em] font-sans font-semibold transition-all duration-300 hover:bg-foreground hover:text-background"
            >
              <span>Discover Our Story</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-1 md:order-2"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/brand-story-image-1.png"
                alt="Manoj Tailor - Master Craftsman"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
