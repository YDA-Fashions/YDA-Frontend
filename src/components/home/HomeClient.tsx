"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Banknote, Star, Award, Truck, X } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Hero from "@/components/home/Hero";
import ProductCard from "@/components/products/ProductCard";
import { useProductStore } from "@/store/useProductStore";
import { Product } from "@/data/products";

interface HomeClientProps {
  initialProducts: Product[];
}

export default function HomeClient({ initialProducts }: HomeClientProps) {
  const products = initialProducts;
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 10);
  const [currentReview, setCurrentReview] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reviews = [
    {
      name: "Shivani Mahata",
      text: "Amazing quality and finish. The print is so authentic and the fabric feels premium. Truly a luxury experience.",
      rating: 5,
      image: "/images/review-image-folder/YDA-review-shivani-mahata.png"
    },
    {
      name: "Chhavi Singh",
      text: "Loved the fabric and print. It's rare to find such high-quality handcrafted items online. Highly recommended.",
      rating: 5,
      image: "/images/review-image-folder/YDA-review-chhavi-singh.png"
    },
    {
      name: "Priya Naiwal",
      text: "Looks even better in real life. The Sanganeri detail is breathtaking. Perfect for my modern home decor.",
      rating: 5,
      image: "/images/review-image-folder/YDA-review-priya-naiwal.png"
    },
    {
      name: "Radhika Kumari",
      text: "The craftsmanship is unparalleled. I've bought multiple pieces and each one tells a unique story of Indian art.",
      rating: 5,
      image: "/images/review-image-folder/YDA-review-radhika-kumari.png"
    },
    {
      name: "Parul Choudhari",
      text: "Absolutely stunning designs! The colors are vibrant yet sophisticated. It adds so much character to the space.",
      rating: 5,
      image: "/images/review-image-folder/YDA-review-parul-choudhari.png"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 6000);
    
    const hasShownPopup = sessionStorage.getItem("yda-popup-shown");
    let popupTimer: NodeJS.Timeout;

    if (!hasShownPopup) {
      popupTimer = setTimeout(() => {
        setShowPopup(true);
        sessionStorage.setItem("yda-popup-shown", "true");
      }, 10000);
    }

    return () => {
      clearInterval(timer);
      if (popupTimer) clearTimeout(popupTimer);
    };
  }, [reviews.length]);

  const nextReview = () => setCurrentReview((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <div className="min-h-screen bg-background text-[#333333]">
      <Header />
      
      <main className="pt-[90px]">
        <Hero />
        
        {/* Promotional Section */}
        <section className="pt-12 pb-6 md:py-16 bg-background text-center">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-xl md:text-3xl lg:text-5xl font-black text-black uppercase tracking-tight leading-tight mb-2">
                Shop For ₹1000+ & Get 10% Extra Discount
              </h2>
              <h3 className="text-lg md:text-2xl font-black text-black uppercase tracking-tight mb-6">
                PLUS FREE Gift
              </h3>
              <p className="text-xs md:text-base font-black text-emerald-600 uppercase tracking-[0.3em]">
                Hurry! Limited Time Deal 🔥
              </p>
            </motion.div>
          </div>
        </section>

        {/* Hero CTA */}
        <section className="pb-12 md:pb-16 bg-background border-b border-border-beige/20">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
              <Link 
                href="/shop"
                className="px-12 py-4 bg-foreground text-background text-[11px] uppercase tracking-[0.4em] font-bold transition-all duration-500 hover:bg-accent-dark hover:-translate-y-1 block text-center min-w-[280px] shadow-sm"
              >
                Shop Now
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.1 }}>
              <Link 
                href="/sanganeri-gujarati-prints"
                className="px-12 py-4 border border-foreground text-foreground text-[11px] uppercase tracking-[0.4em] font-bold transition-all duration-500 hover:bg-foreground hover:text-background hover:-translate-y-1 block text-center min-w-[280px]"
              >
                View Our Collections
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Visual Navigation */}
        <section className="py-16 md:py-24 container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 'small', title: "Small Totes", image: "/images/home-page-image/small-tote.jpg", href: "/small-tote-bags" },
              { id: 'big', title: "Big Totes", image: "/images/home-page-image/big-tote.jpg", href: "/big-tote-bags" },
              { id: 'cushion', title: "Cushions", image: "/images/home-page-image/cushion-1.jpg", href: "/cushion-covers" },
            ].map((cat) => (
              <motion.div 
                key={cat.id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
                className="relative group aspect-[4/5] overflow-hidden bg-foreground/5 cursor-pointer shadow-sm"
              >
                <Link href={cat.href}>
                  <Image 
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <h3 className="text-white text-xl md:text-2xl font-serif tracking-wide border-b border-white/20 pb-3 group-hover:border-white transition-colors">
                      {cat.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Video Reels Section */}
        <section className="py-12 md:py-24 bg-white overflow-hidden border-b border-border-beige/20">
          <div className="container mx-auto px-6 mb-12">
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent-dark mb-4 text-center md:text-left">Artistry in Motion</p>
            <h1 className="text-3xl md:text-5xl font-serif tracking-tight italic text-center md:text-left">Handcrafted Stories</h1>
          </div>
          
          <div className="flex overflow-x-auto gap-4 md:gap-12 px-6 container mx-auto pb-8 snap-x scrollbar-hide no-scrollbar">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex-shrink-0 w-[160px] md:w-[350px] aspect-[9/16] relative bg-foreground/5 overflow-hidden snap-center rounded-sm shadow-lg md:shadow-2xl hover:scale-[1.02] transition-transform duration-500"
              >
                <video 
                  src="/videos/YDA-VIDEO-1.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Collections */}
        <section className="w-full bg-black overflow-hidden">
          {/* Sanganeri Collection */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
            className="relative h-[75vh] md:h-[85vh] w-full flex items-center justify-center overflow-hidden group"
          >
            <Image 
              src="/images/home-page-image/sanganeri-print-1.jpg.png" 
              alt="Sanganeri Flora Collection" 
              fill 
              className="object-cover scale-105 transition-transform duration-[3s] group-hover:scale-100"
              priority
            />
            <div className="absolute inset-0 bg-black/30" />
            
            <div className="relative z-10 text-center text-white px-6">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-[10px] md:text-xs uppercase tracking-[0.6em] font-black mb-6 opacity-80"
              >
                Heritage Jaipur Block Prints
              </motion.p>
              <h2 className="text-5xl md:text-8xl lg:text-9xl font-serif italic mb-12 leading-[1.1] tracking-tight">
                Sanganeri Flora
              </h2>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Link 
                  href="/sanganeri-gujarati-prints" 
                  className="inline-block border border-white/40 px-16 py-5 text-[10px] uppercase tracking-[0.4em] font-black hover:bg-white hover:text-black hover:border-white transition-all duration-700 backdrop-blur-sm"
                >
                  Explore Collection
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Gujarati Collection */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
            className="relative h-[75vh] md:h-[85vh] w-full flex items-center justify-center overflow-hidden group border-t border-white/10"
          >
            <Image 
              src="/images/home-page-image/gujarati-print-1.jpg" 
              alt="Gujarati Motifs Collection" 
              fill 
              className="object-cover scale-105 transition-transform duration-[3s] group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-black/40" />
            
            <div className="relative z-10 text-center text-white px-6">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-[10px] md:text-xs uppercase tracking-[0.6em] font-black mb-6 opacity-80"
              >
                Traditional Western Craft
              </motion.p>
              <h2 className="text-5xl md:text-8xl lg:text-9xl font-serif italic mb-12 leading-[1.1] tracking-tight">
                Gujarati Motifs
              </h2>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Link 
                  href="/sanganeri-gujarati-prints" 
                  className="inline-block border border-white/40 px-16 py-5 text-[10px] uppercase tracking-[0.4em] font-black hover:bg-white hover:text-black hover:border-white transition-all duration-700 backdrop-blur-sm"
                >
                  Explore Collection
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Brand Story */}
        <section className="py-16 md:py-24 bg-white overflow-hidden border-t border-border-beige/50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
                className="relative aspect-square bg-border-beige overflow-hidden shadow-md max-w-lg mx-auto lg:mx-0"
              >
                <Image 
                  src="/images/home-page-image/sanganeri-print-1.jpg.png"
                  alt="Traditional Sanganeri Block Print detail"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-[2s]"
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-md lg:ml-auto text-center lg:text-left"
              >
                <p className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-accent-dark mb-6">
                  The Essence of Tradition
                </p>
                <h2 className="text-3xl md:text-5xl font-serif italic mb-6 leading-[1.1]">
                  Rooted in tradition, crafted for modern luxury.
                </h2>
                <div className="w-10 h-[1px] bg-accent-dark/30 mx-auto lg:mx-0 mb-6" />
                <p className="text-foreground/60 text-sm leading-relaxed mb-8">
                  Heritage Jaipur blocks meticulously handprinted on premium canvas for the discerning wardrobe.
                </p>
                <Link href="/story" className="text-[10px] uppercase tracking-[0.2em] font-bold border-b border-foreground/20 pb-1 hover:border-foreground transition-colors">
                  Read Our Story
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Product Selection */}
        <section className="py-16 md:py-24 bg-background border-t border-border-beige/50 overflow-hidden">
          <div className="w-full px-4 md:px-10 max-w-[1920px] mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="text-center mb-16">
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent-dark mb-4">Our Selection</p>
              <h2 className="text-3xl md:text-5xl font-serif tracking-tight mb-4 italic text-foreground">Featured Pieces</h2>
              <div className="w-8 h-[1px] bg-foreground/20 mx-auto" />
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 md:gap-x-16 gap-y-24">
              {mounted && featuredProducts.map((product) => (
                <div key={product.id} className="w-full">
                   <ProductCard product={product} />
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Link 
                href="/shop"
                className="inline-block px-12 py-4 border border-foreground/20 text-foreground text-[10px] uppercase tracking-[0.4em] font-bold transition-all hover:bg-foreground hover:text-background"
              >
                View Full Collection
              </Link>
            </div>
          </div>
        </section>

        {/* Review Slider */}
        <section className="bg-white border-t border-border-beige/50 overflow-hidden min-h-[60vh] flex items-center">
          <div className="w-full h-full relative">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentReview}
                initial={{ opacity: 0, transition: { duration: 0.4 } }}
                animate={{ opacity: 1, transition: { duration: 0.6 } }}
                exit={{ opacity: 0, transition: { duration: 0.4 } }}
                className="flex flex-col lg:flex-row items-center w-full h-full"
              >
                <div className="relative w-full lg:w-[35%] h-[400px] lg:h-[60vh] overflow-hidden">
                  <Image
                    src={reviews[currentReview].image}
                    alt={reviews[currentReview].name}
                    fill
                    className="object-cover object-center"
                    priority
                  />
                </div>

                <div className="flex flex-col justify-center px-10 md:px-20 py-16 lg:w-[65%] lg:pl-10">
                  <div className="max-w-xl mx-auto lg:mx-0 text-left">
                    <p className="text-xs uppercase tracking-[0.6em] font-black text-accent-dark mb-8">Client Stories</p>
                    <div className="flex justify-start gap-1 mb-6">
                      {[...Array(reviews[currentReview].rating)].map((_, i) => (
                        <Star key={i} size={16} className="fill-[#D4AF37] text-[#D4AF37]" />
                      ))}
                    </div>
                    <p className="text-base md:text-lg font-sans font-normal mb-8 leading-relaxed text-foreground">
                      "{reviews[currentReview].text}"
                    </p>
                    <div className="flex items-center justify-start gap-6 mt-8 pt-6 border-t border-border-beige/30">
                      <div className="w-12 h-[1px] bg-accent-dark hidden lg:block" />
                      <span className="text-xs uppercase tracking-[0.3em] font-black">{reviews[currentReview].name}</span>
                    </div>

                    <div className="flex justify-start gap-8 mt-12">
                      <button onClick={prevReview} className="hover:text-accent-dark transition-colors">
                        <ArrowLeft size={24} strokeWidth={1} />
                      </button>
                      <button onClick={nextReview} className="hover:text-accent-dark transition-colors">
                        <ArrowRight size={24} strokeWidth={1} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-24 md:py-32 bg-background border-y border-border-beige/50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
              {[
                { icon: Truck, title: "Free Shipping", text: "Free Shipping On ₹500+ Order" },
                { icon: Banknote, title: "Cash On Delivery", text: "COD Option Available" },
                { icon: Star, title: "Top Ratings", text: "100% Customer Satisfaction" },
                { icon: Award, title: "Made In India", text: "HANDCRAFTED QUALITY" },
              ].map((item, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-20 h-20 mb-8 flex items-center justify-center bg-white rounded-full shadow-md group-hover:scale-105 transition-transform duration-500 border border-border-beige/10">
                    <item.icon size={36} strokeWidth={1} className="text-black" />
                  </div>
                  <h4 className="text-xs md:text-sm uppercase tracking-[0.2em] font-black mb-3 text-black">{item.title}</h4>
                  <p className="text-[10px] md:text-[11px] text-black/60 italic font-sans leading-relaxed px-2 uppercase tracking-wider">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Connect */}
        <section className="py-12 md:py-24 bg-[#FBF9F4] border-t border-border-beige/50">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-5xl mx-auto space-y-12">
               <div>
                  <p className="text-[10px] uppercase tracking-[0.5em] font-black text-accent-dark mb-4 text-center">Our Creative Space</p>
                  <h2 className="text-3xl md:text-5xl font-serif italic text-foreground text-center">The Making of Luxury</h2>
               </div>
               
               <div className="relative w-full aspect-video shadow-2xl overflow-hidden rounded-sm border border-border-beige/30">
                 <iframe 
                   src="https://www.youtube.com/embed/Bt0S0hqjVX4"
                   title="YDA Luxury Handcrafted Fashion"
                   className="absolute inset-0 w-full h-full"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen
                 />
               </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 md:py-32 text-center bg-white overflow-hidden">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent-dark mb-8">Your Journey Begins Here</p>
              <h2 className="text-3xl md:text-6xl font-serif italic mb-12 max-w-2xl mx-auto leading-tight">
                Discover pieces that tell a story.
              </h2>
              <Link 
                href="/shop"
                className="inline-block px-12 py-4 bg-foreground text-background text-[11px] uppercase tracking-[0.4em] font-bold transition-all duration-500 hover:bg-accent-dark hover:-translate-y-1 shadow-xl"
              >
                Shop the selection
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Promotional Popup */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPopup(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl overflow-hidden shadow-2xl z-10 mx-auto"
            >
              <div className="absolute top-4 right-4 z-20">
                <button 
                  onClick={() => setShowPopup(false)}
                  className="p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-colors"
                >
                  <X size={20} strokeWidth={2} />
                </button>
              </div>
              
              <Link href="/shop" onClick={() => setShowPopup(false)}>
                <div className="relative w-full cursor-pointer group">
                  <Image 
                    src="/images/home-page-image/Website-Popup.png" 
                    alt="Exclusive Offer" 
                    width={1240}
                    height={1748}
                    className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </div>
              </Link>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
