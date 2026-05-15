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
import QuickAddDrawer from "@/components/products/QuickAddDrawer";
import BrandStory from "@/components/home/BrandStory";
import { useProductStore } from "@/store/useProductStore";
import { Product } from "@/data/products";

interface HomeClientProps {
  initialProducts: Product[];
}

const VideoCard = ({ video }: { video: any }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(true);

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
      transition={{ duration: 0.8, delay: video.id * 0.1 }}
      onClick={togglePlay}
      className="flex-shrink-0 w-[240px] md:w-[380px] aspect-[9/16] relative bg-[#F8F8F5] overflow-hidden snap-center group shadow-xl hover:shadow-2xl transition-all duration-700 cursor-pointer"
    >
      <video
        ref={videoRef}
        src="/videos/YDA-VIDEO-1.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <span className="text-[10px] uppercase tracking-widest font-black text-white/60 mb-2">{video.tag}</span>
        <h4 className="text-xl md:text-2xl font-serif italic text-white group-hover:translate-x-2 transition-transform duration-500">{video.title}</h4>
      </div>

      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm transition-all duration-500 ${isPlaying ? "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100" : "opacity-100 scale-100"}`}>
        {isPlaying ? (
          <div className="flex gap-1">
            <div className="w-1.5 h-6 bg-white" />
            <div className="w-1.5 h-6 bg-white" />
          </div>
        ) : (
          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
        )}
      </div>
    </motion.div>
  );
};

export default function HomeClient({ initialProducts }: HomeClientProps) {
  // Show latest 12 products from Supabase (same as shop page)
  const latestProducts = initialProducts.slice(0, 12);
  const [currentReview, setCurrentReview] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Quick Add State
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleQuickAdd = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickAddOpen(true);
  };


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

        {/* Trust Section - Boutique Style */}
        <section className="py-24 md:py-32 bg-white border-y border-border-beige/50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
              {[
                { icon: Truck, title: "Artisan Direct", text: "From Manoj's Studio To Your Door" },
                { icon: Banknote, title: "Secure COD", text: "Pay At Your Doorstep" },
                { icon: Star, title: "Prepaid Reward", text: "Extra 5% Off On Prepaid" },
                { icon: Award, title: "YDA Certified", text: "100% Sanganeri Heritage" },
              ].map((item, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 mb-8 flex items-center justify-center bg-[#F8F8F5] rounded-full group-hover:scale-105 transition-transform duration-500">
                    <item.icon size={28} strokeWidth={1} className="text-black" />
                  </div>
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-black mb-3 text-black">{item.title}</h4>
                  <p className="text-[10px] text-black/40 font-sans leading-relaxed px-4 uppercase tracking-wider">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* Studio Live Section (Lililo Style) */}
        <section className="py-24 md:py-32 bg-white overflow-hidden border-b border-border-beige/20">
          <div className="container mx-auto px-6 mb-16 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-black">Studio Live</p>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif tracking-tight italic">What's New in the Studio.</h2>
            </div>
            <Link 
              href="/shop"
              className="hidden md:flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-black border-b border-black/10 pb-2 hover:border-black transition-all"
            >
              View All Reels
              <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="flex overflow-x-auto gap-6 md:gap-10 px-6 md:px-20 pb-12 snap-x scrollbar-hide no-scrollbar cursor-grab active:cursor-grabbing">
            {[
              { id: 1, title: "Master Cutting", tag: "@manojtailor" },
              { id: 2, title: "Sanganeri Detail", tag: "#artisan" },
              { id: 3, title: "New Tote Arrival", tag: "Collection 24" },
              { id: 4, title: "Crafting Soul", tag: "@yda_studio" },
              { id: 5, title: "Heritage Prints", tag: "Jaipur" },
              { id: 6, title: "Founder's Vision", tag: "Legacy" },
            ].map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>

        {/* Live Products from Shop */}
        <section className="py-24 md:py-32 bg-white border-t border-border-beige/50 overflow-hidden">
          <div className="w-full px-6 md:px-20 max-w-[1920px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <p className="text-[10px] uppercase tracking-[0.5em] font-black text-accent-dark mb-6">Our Selection</p>
              <h2 className="text-4xl md:text-6xl font-serif tracking-tight mb-6 italic text-foreground">Latest Pieces</h2>
              <div className="w-12 h-[1px] bg-black/10 mx-auto" />
            </motion.div>

            {latestProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 md:gap-x-10 gap-y-16 md:gap-y-24">
                {latestProducts.map((product) => (
                  <div key={product.id} className="w-full">
                    <ProductCard product={product} onQuickAdd={handleQuickAdd} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-foreground/40 uppercase tracking-widest">Loading products...</p>
            )}

            <div className="mt-20 text-center">
              <Link
                href="/shop"
                className="inline-block px-12 py-5 border border-black/10 text-black text-[10px] uppercase tracking-[0.4em] font-black transition-all hover:bg-black hover:text-white"
              >
                View Full Collection
              </Link>
            </div>
          </div>
        </section>

        {/* Enhanced Review Section (Cinematic Cards) */}
        <section className="py-24 md:py-32 bg-[#F8F8F5] overflow-hidden border-t border-border-beige/50">
          <div className="container mx-auto px-6 mb-16 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.6em] font-black text-accent-dark mb-4">Client Stories</p>
              <h2 className="text-4xl md:text-6xl font-serif tracking-tight italic text-foreground">What our collectors say.</h2>
            </div>
            <div className="hidden md:flex gap-4">
              <span className="text-[10px] uppercase tracking-widest font-bold opacity-40 italic">Swipe to explore</span>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-6 md:gap-10 px-6 md:px-20 pb-12 snap-x scrollbar-hide no-scrollbar cursor-grab active:cursor-grabbing">
            {[
              { id: 1, name: "Shivani Mahata", text: "Amazing quality and finish. The fabric feels premium.", image: "/images/review-image-folder/YDA-review-shivani-mahata.png" },
              { id: 2, name: "Chhavi Singh", text: "Loved the fabric and print. Truly authentic.", image: "/images/review-image-folder/YDA-review-chhavi-singh.png" },
              { id: 3, name: "Priya Naiwal", text: "Breathtaking Sanganeri detail. Perfect for my home.", image: "/images/review-image-folder/YDA-review-priya-naiwal.png" },
              { id: 4, name: "Radhika Kumari", text: "The craftsmanship is unparalleled. Unique Indian art.", image: "/images/review-image-folder/YDA-review-radhika-kumari.png" },
              { id: 5, name: "Parul Choudhari", text: "Absolutely stunning designs! Vibrant colors.", image: "/images/review-image-folder/YDA-review-parul-choudhari.png" },
            ].map((review, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="flex-shrink-0 w-[280px] md:w-[420px] aspect-[9/16] relative bg-white overflow-hidden snap-center group shadow-xl hover:shadow-2xl transition-all duration-700"
              >
                <Image
                  src={review.image}
                  alt={review.name}
                  fill
                  className="object-cover transition-all duration-1000 group-hover:scale-110"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Verified Badge */}
                <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[8px] uppercase tracking-[0.2em] font-black text-white/80">Verified Buyer</span>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/30 to-transparent">
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-sm border border-white/10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm md:text-base font-serif italic text-white mb-6 leading-relaxed">
                      "{review.text}"
                    </p>
                    <div className="pt-4 border-t border-white/10">
                      <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white/80">{review.name}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>


        {/* Brand Story (Legacy & Craft) */}
        <BrandStory />

        {/* Social Connect */}
        <section className="py-24 md:py-32 bg-[#FBF9F4] border-t border-border-beige/50">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-5xl mx-auto space-y-16">
               <div>
                  <p className="text-[10px] uppercase tracking-[0.5em] font-black text-accent-dark mb-6 text-center">Artistry in Motion</p>
                  <h2 className="text-4xl md:text-6xl font-serif italic text-foreground text-center leading-tight">The Making of <br/> Modern Luxury</h2>
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

        {/* Final CTA */}
        <section className="py-24 md:py-40 text-center bg-white overflow-hidden">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
              <p className="text-[10px] uppercase tracking-[0.5em] font-black text-accent-dark mb-10 italic">Your Journey Begins Here</p>
              <h2 className="text-4xl md:text-7xl font-serif italic mb-16 max-w-3xl mx-auto leading-tight">
                Discover pieces that <br/> tell your story.
              </h2>
              <Link 
                href="/shop"
                className="inline-block px-16 py-6 bg-black text-white text-[11px] uppercase tracking-[0.4em] font-black transition-all duration-700 hover:bg-accent-dark hover:-translate-y-2 shadow-2xl"
              >
                Shop the selection
              </Link>
            </motion.div>
          </div>
        </section>
      </main>



      <Footer />

      {/* Quick Add Drawer */}
      <QuickAddDrawer 
        product={selectedProduct} 
        isOpen={isQuickAddOpen} 
        onClose={() => setIsQuickAddOpen(false)} 
      />


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
