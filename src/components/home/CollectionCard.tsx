"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface CollectionCardProps {
  title: string;
  subtitle: string;
  image: string;
  href: string;
  cta?: string;
  reverse?: boolean;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ 
  title, 
  subtitle, 
  image, 
  href, 
  cta = "Shop Collection", 
  reverse = false 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-stretch gap-8 md:gap-16 w-full lg:min-h-[600px] mb-24 md:mb-32`}
    >
      {/* Image Area */}
      <div className="flex-1 overflow-hidden group relative">
        <Link href={href} className="block relative aspect-[4/5] md:aspect-auto h-full min-h-[400px]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-[2s] group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>

      {/* Content Area */}
      <div className={`flex-1 flex flex-col justify-center gap-6 ${reverse ? "md:text-left" : "md:text-right md:items-end"} px-6 md:px-0`}>
        <span className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-accent-dark">
          {subtitle}
        </span>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif tracking-tight leading-[1.1]">
          {title}
        </h2>
        <p className="max-w-md text-foreground/60 text-base md:text-lg leading-relaxed mt-2">
          Discover the intersection of heritage prints and luxury tailoring. Hand-crafted in boutique studios.
        </p>
        <Link 
          href={href}
          className="group/link flex items-center gap-4 mt-6 text-xs uppercase tracking-[0.3em] font-sans font-bold"
        >
          <span className="border-b border-foreground/20 group-hover/link:border-foreground transition-all duration-300">
            {cta}
          </span>
          <ArrowRight size={18} className="transition-transform group-hover/link:translate-x-2" />
        </Link>
      </div>
    </motion.div>
  );
};

export default CollectionCard;
