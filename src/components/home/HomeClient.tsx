"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Truck, Shield, CreditCard, RefreshCw, Star, Play, Pause } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Hero from "@/components/home/Hero";
import ProductCard from "@/components/products/ProductCard";
import QuickAddDrawer from "@/components/products/QuickAddDrawer";
import { Product } from "@/data/products";

interface HomeClientProps {
  initialProducts: Product[];
}

// Animated Counter Component
const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// Video Card Component
const VideoCard = ({ video, index }: { video: { title: string; tag: string }; index: number }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={togglePlay}
      className="flex-shrink-0 w-[260px] md:w-[320px] aspect-[9/16] relative bg-muted overflow-hidden snap-center group cursor-pointer"
    >
      <video
        ref={videoRef}
        src="/videos/YDA-VIDEO-1.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-2 font-sans">
          {video.tag}
        </span>
        <h4 className="text-lg md:text-xl font-serif text-white">
          {video.title}
        </h4>
      </div>

      {/* Play/Pause Indicator */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full glass flex items-center justify-center transition-all duration-300 ${isPlaying ? "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100" : "opacity-100"}`}>
        {isPlaying ? (
          <Pause size={20} className="text-white" />
        ) : (
          <Play size={20} className="text-white ml-1" />
        )}
      </div>
    </motion.div>
  );
};

// Featured Category Card
const CategoryCard = ({ category, index }: { 
  category: { id: string; title: string; image: string; href: string; subtitle: string }; 
  index: number 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      className="group relative aspect-[3/4] overflow-hidden bg-muted"
    >
      <Link href={category.href} className="block h-full">
        <Image
          src={category.image}
          alt={category.title}
          fill
          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/70 mb-2 font-sans">
            {category.subtitle}
          </span>
          <h3 className="text-xl md:text-2xl font-serif text-white mb-4">
            {category.title}
          </h3>
          <div className="flex items-center gap-2 text-white/80 text-xs uppercase tracking-[0.2em] font-sans font-medium group-hover:text-white transition-colors">
            <span>Explore</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-2" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function HomeClient({ initialProducts }: HomeClientProps) {
  const latestProducts = initialProducts.slice(0, 8);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentReview, setCurrentReview] = useState(0);

  const handleQuickAdd = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickAddOpen(true);
  };

  const categories = [
    { id: "small", title: "Small Totes", subtitle: "Everyday Essentials", image: "/images/home-page-image/small-tote.jpg", href: "/small-tote-bags" },
    { id: "big", title: "Big Totes", subtitle: "Statement Pieces", image: "/images/home-page-image/big-tote.jpg", href: "/big-tote-bags" },
    { id: "cushion", title: "Cushion Covers", subtitle: "Home Decor", image: "/images/home-page-image/cushion-1.jpg", href: "/cushion-covers" },
  ];

  const trustFeatures = [
    { icon: Truck, title: "Free Shipping", desc: "On orders above ₹999" },
    { icon: Shield, title: "Authentic Craft", desc: "100% handmade heritage" },
    { icon: CreditCard, title: "Secure COD", desc: "Pay at your doorstep" },
    { icon: RefreshCw, title: "Easy Returns", desc: "7-day hassle-free returns" },
  ];

  const reviews = [
    {
      name: "Shivani M.",
      text: "The quality exceeded my expectations. The Sanganeri print is absolutely stunning and the craftsmanship is impeccable.",
      rating: 5,
      image: "/images/review-image-folder/YDA-review-shivani-mahata.png",
      product: "Floral Canvas Tote Bag"
    },
    {
      name: "Chhavi S.",
      text: "I&apos;ve purchased multiple pieces and each one tells a unique story of Indian artistry. Truly collector-worthy items.",
      rating: 5,
      image: "/images/review-image-folder/YDA-review-chhavi-singh.png",
      product: "Heritage Canvas Tote"
    },
    {
      name: "Priya N.",
      text: "The attention to detail is breathtaking. These pieces add so much character to my home decor.",
      rating: 5,
      image: "/images/review-image-folder/YDA-review-priya-naiwal.png",
      product: "Heritage Garden Cushion"
    },
  ];

  const studioVideos = [
    { title: "Master Cutting", tag: "@manojtailor" },
    { title: "Sanganeri Detail", tag: "#artisan" },
    { title: "New Arrivals", tag: "Collection 24" },
    { title: "Crafting Soul", tag: "@yda_studio" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main>
        <Hero />

        {/* Featured Categories */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 md:mb-16"
            >
              <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-4 block font-sans">
                Our Collections
              </span>
              <h2 className="text-3xl md:text-5xl font-serif">
                Curated Categories
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {categories.map((cat, idx) => (
                <CategoryCard key={cat.id} category={cat} index={idx} />
              ))}
            </div>
          </div>
        </section>

        {/* Trust Features Bar */}
        <section className="py-12 md:py-16 bg-muted border-y border-border">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
              {trustFeatures.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-background border border-border">
                    <feature.icon size={20} strokeWidth={1.5} className="text-foreground" />
                  </div>
                  <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground font-sans">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Products */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16 gap-4"
            >
              <div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-4 block font-sans">
                  New In
                </span>
                <h2 className="text-3xl md:text-5xl font-serif">
                  Latest Arrivals
                </h2>
              </div>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-sans font-semibold hover:text-muted-foreground transition-colors"
              >
                <span>View All</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {latestProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {latestProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <ProductCard product={product} onQuickAdd={handleQuickAdd} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground font-sans">Loading products...</p>
              </div>
            )}
          </div>
        </section>

        {/* Studio Live Section */}
        <section className="py-16 md:py-24 bg-foreground text-background overflow-hidden">
          <div className="container mx-auto px-6 mb-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.4em] text-background/60 font-sans">
                    Studio Live
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-serif text-background">
                  Behind the Craft
                </h2>
              </div>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-sans font-semibold text-background/70 hover:text-background transition-colors"
              >
                <span>View All</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-4 px-6 pb-4 snap-x no-scrollbar">
            {studioVideos.map((video, idx) => (
              <VideoCard key={idx} video={video} index={idx} />
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24 border-b border-border">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
              {[
                { value: 20, suffix: "+", label: "Years of Craft" },
                { value: 5000, suffix: "+", label: "Happy Customers" },
                { value: 100, suffix: "%", label: "Handmade" },
                { value: 50, suffix: "+", label: "Unique Designs" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-6xl font-serif mb-2">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-sans">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 md:mb-16"
            >
              <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-4 block font-sans">
                Testimonials
              </span>
              <h2 className="text-3xl md:text-5xl font-serif">
                What Our Customers Say
              </h2>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReview}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-foreground text-foreground" />
                    ))}
                  </div>
                  <blockquote className="text-xl md:text-2xl font-serif mb-8 leading-relaxed">
                    &ldquo;{reviews[currentReview].text}&rdquo;
                  </blockquote>
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={reviews[currentReview].image}
                        alt={reviews[currentReview].name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-sans font-semibold">{reviews[currentReview].name}</p>
                      <p className="text-xs text-muted-foreground">{reviews[currentReview].product}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Review Navigation Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentReview(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentReview ? "bg-foreground w-6" : "bg-foreground/20"
                    }`}
                    aria-label={`Go to review ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Brand Story Section */}
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

        {/* Newsletter Section */}
        <section className="py-16 md:py-24 bg-foreground text-background">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-[10px] uppercase tracking-[0.4em] text-background/60 mb-4 block font-sans">
                  Stay Connected
                </span>
                <h2 className="text-3xl md:text-4xl font-serif mb-4">
                  Join Our Circle
                </h2>
                <p className="text-background/70 font-sans mb-8">
                  Subscribe for exclusive drops, artisan stories, and early access to new collections.
                </p>
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 bg-transparent border border-background/20 text-background placeholder:text-background/40 text-sm font-sans focus:outline-none focus:border-background/60 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-background text-foreground text-xs uppercase tracking-[0.15em] font-sans font-semibold hover:bg-background/90 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Quick Add Drawer */}
      <QuickAddDrawer
        isOpen={isQuickAddOpen}
        onClose={() => {
          setIsQuickAddOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />
    </div>
  );
}
