"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const BANNERS = [
  {
    id: 1,
    title: "Heritage Handcrafted",
    subtitle: "New Spring/Summer Collection",
    image: "/images/banner-image/YDA-Home-hero-Banner-1.jpg",
  },
  {
    id: 2,
    title: "The Artisanal Tote",
    subtitle: "Limited Edition Canvas Art",
    image: "/images/banner-image/YDA-Home-hero-Banner-2.jpg",
  },
  {
    id: 3,
    title: "Living Heritage",
    subtitle: "Curated Home Living",
    image: "/images/banner-image/YDA-Home-hero-Banner-3.jpg",
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[70vh] md:h-screen bg-neutral-900 overflow-hidden">
      {/* Fallback Background in case images fail */}
      <div className="absolute inset-0 bg-neutral-900" />
      
      {BANNERS.map((banner, idx) => (
        <div 
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            className="object-cover"
            priority={idx === 0}
          />
          {/* Manglam Style Dark Overlay */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Centered Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <div className="max-w-4xl">
              <span className="text-white text-[10px] md:text-xs uppercase tracking-[0.5em] font-black mb-6 block">
                {banner.subtitle}
              </span>
              <h1 className="text-white text-5xl md:text-8xl font-serif tracking-tight mb-10">
                {banner.title}
              </h1>
              <Link 
                href="/shop"
                className="inline-block border border-white text-white px-10 md:px-16 py-4 text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold hover:bg-white hover:text-black transition-all"
              >
                Explore More
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Manual Indicators */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 z-20">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              current === idx ? "bg-white" : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
