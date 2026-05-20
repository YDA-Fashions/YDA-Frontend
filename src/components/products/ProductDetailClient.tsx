"use client";

import React, { useState, useRef, MouseEvent, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCcw, X, Star, ArrowRight, Banknote, Award, CheckCircle } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductCard from "@/components/products/ProductCard";
import QuickAddDrawer from "@/components/products/QuickAddDrawer";
import StickyCartBar from "@/components/products/StickyCartBar";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import { Product } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(0);
  const [viewers, setViewers] = useState(12);

  useEffect(() => {
    setViewers(Math.floor(Math.random() * 11) + 12); // random between 12 and 22
    const interval = setInterval(() => {
      setViewers(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next >= 10 && next <= 25 ? next : prev;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Quick Add State
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleQuickAdd = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickAddOpen(true);
  };


  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // Ref used by StickyCartBar to track when the Add-to-Cart button leaves viewport
  const addToCartRef = useRef<HTMLDivElement>(null);

  // Magnetic effect hooks for the two CTA buttons
  const addMagnetic = useMagneticEffect(0.3);
  const buyMagnetic = useMagneticEffect(0.3);

  const addItem = useCartStore((state) => state.addItem);
  const isAdded = useCartStore((state) => state.items.some((item) => item.id === product.id));

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
    return () => clearInterval(timer);
  }, [reviews.length]);

  const currentImages = product.colors[selectedColor].images;

  const nextReview = () => setCurrentReview((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleBuyNow = async () => {
    router.push(`/checkout?buyNow=${product.id}&qty=${quantity}`);
  };

  return (
    <div className="min-h-screen bg-[#FCFBFA]">
      <Header />

      <main className="pt-28 pb-12 md:pt-36">
        <div className="container mx-auto px-6 max-w-7xl">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-black/40 hover:text-black transition-colors mb-12"
          >
            <ArrowLeft size={14} /> Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 items-start mb-24">
            {/* LEFT COLUMN: Gallery */}
            <div className="lg:col-span-7 lg:sticky lg:top-32">
              <div className="flex flex-col gap-6">
                <div
                  ref={containerRef}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={() => setIsZoomModalOpen(true)}
                  className="relative aspect-square bg-white border border-border-beige/10 overflow-hidden cursor-crosshair rounded-sm"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${selectedColor}-${selectedImage}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full relative"
                    >
                      <Image
                        src={currentImages[selectedImage]}
                        alt={product.name}
                        fill
                        className="object-contain"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Amazon-style Lens overlay */}
                  {isHovered && (
                    <div 
                      className="absolute pointer-events-none border border-black/20 bg-black/5 hidden lg:block z-10"
                      style={{
                        left: `${Math.max(20, Math.min(80, zoomPos.x))}%`, 
                        top: `${Math.max(20, Math.min(80, zoomPos.y))}%`, 
                        width: '40%', 
                        height: '40%',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: '0 0 0 9999px rgba(255, 255, 255, 0.4)'
                      }}
                    />
                  )}
                </div>

                {/* Amazon-style Zoomed Output Box (appears on the right) */}
                {isHovered && (
                  <div className="absolute top-0 left-full ml-8 w-full max-w-[600px] aspect-square bg-white z-[100] border border-border-beige shadow-2xl hidden lg:block rounded-sm overflow-hidden pointer-events-none">
                    <div 
                      className="w-full h-full relative bg-white"
                      style={{
                        backgroundImage: `url("${currentImages[selectedImage]}")`,
                        backgroundPosition: `${((Math.max(20, Math.min(80, zoomPos.x)) - 20) / 60) * 100}% ${((Math.max(20, Math.min(80, zoomPos.y)) - 20) / 60) * 100}%`,
                        backgroundSize: '250%',
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                  </div>
                )}

                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar-hide snap-x">
                  {currentImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative aspect-square w-20 md:w-24 flex-shrink-0 snap-start transition-all duration-300 rounded-sm border-2 ${selectedImage === idx ? "border-black opacity-100" : "border-transparent opacity-40 hover:opacity-100"
                        }`}
                    >
                      <Image src={img} alt={`${product.name} thumbnail ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Info */}
            <div className="lg:col-span-5 flex flex-col pt-0">
              <div className="mb-6">
                <span className="text-[9px] uppercase tracking-[0.5em] font-black text-black opacity-40 mb-3 block">
                  {product.type} / {product.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-serif tracking-tight leading-[1.1] mb-6">
                  {product.name}
                </h1>
              </div>

              <div className="flex flex-col gap-3 mb-10">
                <div className="flex items-center gap-5">
                  <span className="text-3xl font-black text-black tracking-tighter">₹{product.selling_price.toLocaleString()}</span>
                  <span className="text-lg text-black/30 line-through tracking-wider">₹{product.original_price.toLocaleString()}</span>
                  <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase italic">
                    Special Offer Price
                  </span>
                </div>
                
                {/* Live Social Proof Badge */}
                <div className="flex items-center gap-2 bg-[#F9F6F0] border border-[#EBE3D5]/60 rounded-full px-4 py-1.5 self-start shadow-[0_1px_3px_rgba(0,0,0,0.02)] animate-pulse">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
                  </span>
                  <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-amber-800">
                    ✨ {viewers} active collectors are viewing this piece right now
                  </span>
                </div>
              </div>

              <div className="space-y-10 mb-16">
                {product.colors.length > 1 && (
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-black/40 mb-5 block">Variation</span>
                    <div className="flex flex-wrap gap-4">
                      {product.colors.map((color, idx) => (
                        <button
                          key={color.name}
                          onClick={() => {
                            setSelectedColor(idx);
                            setSelectedImage(0);
                          }}
                          className={`w-12 h-12 rounded-full border-[1.5px] p-1 transition-all duration-500 ${selectedColor === idx ? "border-black shadow-md" : "border-black/5 hover:border-black/20"
                            }`}
                        >
                          <div
                            className="w-full h-full rounded-full"
                            style={{ backgroundColor: color.name.toLowerCase().replace(" ", "") }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ref here so StickyCartBar knows when this leaves the viewport */}
                <div ref={addToCartRef} className="grid grid-cols-1 gap-4">
                  {/* Stock Status Badge */}
                  {product.stock <= 0 ? (
                    <div className="bg-red-50 border border-red-100 p-4 mb-2">
                       <p className="text-[10px] uppercase tracking-widest font-black text-red-600 flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                         Currently Sold Out
                       </p>
                    </div>
                  ) : product.stock < 4 ? (
                    <div className="bg-orange-50 border border-orange-100 p-4 mb-2">
                       <p className="text-[10px] uppercase tracking-widest font-black text-orange-600 flex items-center gap-2 italic">
                         <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-bounce" />
                         Hurry up! Only {product.stock} pieces left in stock.
                       </p>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-100 p-4 mb-2">
                       <p className="text-[10px] uppercase tracking-widest font-black text-emerald-600 flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                         In Stock: {product.stock} units available
                       </p>
                    </div>
                  )}

                  {/* Magnetic Add to Cart */}
                  {isAdded ? (
                    <motion.a
                      ref={addMagnetic.ref as React.RefObject<HTMLAnchorElement>}
                      onMouseMove={addMagnetic.onMouseMove}
                      onMouseLeave={addMagnetic.onMouseLeave}
                      animate={{ x: addMagnetic.offset.x, y: addMagnetic.offset.y }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      href="/cart"
                      className="w-full py-5 text-[11px] uppercase tracking-[0.4em] font-black transition-colors duration-300 shadow-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center gap-3"
                    >
                      <CheckCircle size={16} /> Go to Cart
                    </motion.a>
                  ) : (
                    <motion.button
                      ref={addMagnetic.ref as React.RefObject<HTMLButtonElement>}
                      onMouseMove={addMagnetic.onMouseMove}
                      onMouseLeave={addMagnetic.onMouseLeave}
                      animate={{ x: addMagnetic.offset.x, y: addMagnetic.offset.y }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      whileTap={product.stock > 0 ? { scale: 0.98 } : {}}
                      onClick={product.stock > 0 ? () => addItem(product) : undefined}
                      disabled={product.stock <= 0}
                      className={`w-full py-5 text-[11px] uppercase tracking-[0.4em] font-black transition-colors duration-300 shadow-lg ${
                        product.stock <= 0 
                          ? "bg-black/10 text-black/40 cursor-not-allowed shadow-none" 
                          : "bg-[#FFD700] hover:bg-[#F2CC00] text-black"
                      }`}
                    >
                      {product.stock <= 0 ? "Sold Out" : "Add to Selection"}
                    </motion.button>
                  )}

                  {/* Magnetic Buy Now */}
                  <motion.button
                    ref={buyMagnetic.ref as React.RefObject<HTMLButtonElement>}
                    onMouseMove={buyMagnetic.onMouseMove}
                    onMouseLeave={buyMagnetic.onMouseLeave}
                    animate={{ x: buyMagnetic.offset.x, y: buyMagnetic.offset.y }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    whileTap={product.stock > 0 ? { scale: 0.98 } : {}}
                    onClick={product.stock > 0 ? handleBuyNow : undefined}
                    disabled={product.stock <= 0}
                    className={`flex-grow py-6 uppercase tracking-[0.4em] text-[12px] font-sans font-black transition-colors flex items-center justify-center gap-4 shadow-2xl ${
                      product.stock <= 0 
                        ? "bg-black/5 text-black/20 cursor-not-allowed shadow-none" 
                        : "bg-[#1a1a1a] text-white hover:bg-black"
                    }`}
                  >
                    {product.stock <= 0 ? "Out of Stock" : <>Buy Now <ArrowRight size={18} /></>}
                  </motion.button>
                </div>

                {/* WhatsApp Inquiry Button (Option A) */}
                <a
                  href={`https://wa.me/917877646756?text=Hello%20YDA!%20I%20am%20interested%20in%20the%20${encodeURIComponent(product.name)}.%20Could%20you%20share%20more%20details?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full py-5 border border-black/20 text-black dark:border-white/20 dark:text-white uppercase tracking-[0.3em] text-[10px] font-sans font-black items-center justify-center gap-3 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  Speak to a Stylist
                </a>

                {/* Complete the Look Bundle */}
                {relatedProducts && relatedProducts.length > 0 && (
                  <div className="mt-8 p-5 bg-[#FAF9F5] border border-[#EBE3D5] rounded-sm shadow-sm">
                    <span className="text-[8px] uppercase tracking-widest font-black text-black/40 block mb-3">Perfect Styling Set</span>
                    <h4 className="text-[10px] font-sans font-black uppercase tracking-wider text-black mb-4">✨ Complete The Curation & Save 10%</h4>
                    <div className="flex items-center gap-4">
                      {/* Current Product Thumbnail */}
                      <div className="w-14 h-16 bg-[#F9F8F6] relative rounded border border-black/5 flex-shrink-0">
                        <img src={product.colors?.[0]?.images?.[0]} alt={product.name} className="w-full h-full object-contain p-1" />
                      </div>
                      <span className="text-lg font-light text-black/30">+</span>
                      {/* Related Product Thumbnail */}
                      <div className="w-14 h-16 bg-[#F9F8F6] relative rounded border border-black/5 flex-shrink-0">
                        <img src={relatedProducts[0].colors?.[0]?.images?.[0]} alt={relatedProducts[0].name} className="w-full h-full object-contain p-1" />
                      </div>
                      
                      <div className="flex-grow">
                        <p className="text-[9px] font-black uppercase text-black line-clamp-1">{relatedProducts[0].name}</p>
                        <p className="text-[11px] font-bold text-amber-800 mt-0.5">₹{(product.selling_price + relatedProducts[0].selling_price - 100).toLocaleString()} <span className="text-[9px] text-black/30 line-through">₹{(product.selling_price + relatedProducts[0].selling_price).toLocaleString()}</span></p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        addItem(product);
                        addItem(relatedProducts[0]);
                        router.push("/cart");
                      }}
                      className="mt-4 w-full bg-white hover:bg-black hover:text-white text-black border border-black py-2.5 text-[9px] uppercase tracking-[0.2em] font-black transition-colors rounded-sm"
                    >
                      Buy Styling Bundle
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-12 border-t border-black/5">
                <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-black mb-8 block font-sans">Product Information</h3>
                <div className="space-y-10">
                  <p className="text-base font-sans text-black/60 leading-relaxed max-w-xl">
                    {product.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 pt-4">
                    <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-black/40 group-hover:bg-black group-hover:text-white transition-all duration-300">
                        <Banknote size={18} strokeWidth={1.5} />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-black/80">Secure COD Available</span>
                    </div>

                    <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-black/40 group-hover:bg-black group-hover:text-white transition-all duration-300">
                        <RotateCcw size={18} strokeWidth={1.5} />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-black/80">Easy Heritage Exchange</span>
                    </div>

                    <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-black/40 group-hover:bg-black group-hover:text-white transition-all duration-300">
                        <Award size={18} strokeWidth={1.5} />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-black/80">Manoj Tailor Certified</span>
                    </div>

                    <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-black/40 group-hover:bg-black group-hover:text-white transition-all duration-300">
                        <Truck size={18} strokeWidth={1.5} />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-black/80">Artisan Direct Shipping</span>
                    </div>
                  </div>

                  {/* Category-Specific Visual Guide */}
                  <div className="mt-10 p-5 bg-[#FAF9F5] border border-[#EBE3D5] rounded-sm">
                    {product.category === "bags" ? (
                      <div>
                        <p className="text-[9px] uppercase tracking-widest font-black text-black/40 mb-3 block">Visual Curation Guide</p>
                        <h4 className="text-xs font-sans font-black uppercase tracking-wider text-black mb-3">🎒 What Fits Inside Your Curation</h4>
                        <div className="grid grid-cols-2 gap-3 text-[10px] font-sans text-black/75">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-600">✓</span> <span>13" & 14" Macbook Pro / iPad Pro</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-600">✓</span> <span>Designer Sunglasses Case</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-600">✓</span> <span>Daily Planner & Notebook</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-600">✓</span> <span>Luxury Wallet & Phone Pouch</span>
                          </div>
                          <div className="flex items-center gap-2 col-span-2 pt-2 border-t border-black/5 text-[9px] text-black/40 tracking-wide">
                            Dimensions: 14.5" Width x 12" Height x 4.5" Depth
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[9px] uppercase tracking-widest font-black text-black/40 mb-3 block">Visual Styling Guide</p>
                        <h4 className="text-xs font-sans font-black uppercase tracking-wider text-black mb-3">🛋️ Where It Belongs / Styling Ideas</h4>
                        <div className="grid grid-cols-2 gap-3 text-[10px] font-sans text-black/75">
                          <div className="flex items-center gap-2">
                            <span className="text-amber-700">✦</span> <span>Living Room Accent Sofa</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-amber-700">✦</span> <span>Master Bed Central Pillow Stack</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-amber-700">✦</span> <span>Cozy Armchair Statement Accent</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-amber-700">✦</span> <span>Terrace / Balcony Premium Seating</span>
                          </div>
                          <div className="flex items-center gap-2 col-span-2 pt-2 border-t border-black/5 text-[9px] text-black/40 tracking-wide">
                            Dimensions: 16" x 16" Standard Luxury Accent Size
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Seal of Authenticity Card */}
                  <div className="mt-8 p-6 border border-amber-900/10 bg-amber-500/[0.03] rounded-sm relative overflow-hidden flex items-center gap-4">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.04] blur-xl rounded-full" />
                    
                    {/* Golden vintage circular badge */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-full border border-dashed border-amber-600/30 flex items-center justify-center relative bg-white shadow-sm">
                      <div className="w-12 h-12 rounded-full border border-amber-600/40 flex flex-col items-center justify-center p-1 text-center bg-amber-50/50">
                        <span className="text-[6px] font-black uppercase text-amber-800 tracking-tighter">YDA</span>
                        <span className="text-[5px] font-bold text-amber-700 leading-none">100%</span>
                        <span className="text-[5px] font-black uppercase text-amber-800 tracking-tighter">Jaipur</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-sans font-black uppercase tracking-widest text-amber-900">Heritage Craftsmanship Seal</h4>
                      <p className="text-[10px] font-sans text-amber-900/60 leading-relaxed">
                        This piece carries the authentic seal of Manoj Tailor's atelier. Hand-block printed using premium organic colors on vintage-finished cotton in Jaipur, India.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div className="w-full space-y-24">
            {/* The Craftsmanship Journey Block */}
            <div className="pt-24 border-t border-black/5">
              <span className="text-[9px] uppercase tracking-[0.4em] font-black text-black opacity-40 mb-3 block font-sans">Craftsmanship Narrative</span>
              <h3 className="text-2xl md:text-3xl font-serif italic text-black mb-10">Behind The Masterpiece</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#FAF9F6] border border-[#EBE3D5] p-8 rounded-sm space-y-4 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-800 font-serif font-black text-sm">01</div>
                  <h4 className="text-sm font-sans font-black uppercase tracking-wider text-black">Teak Block Carving</h4>
                  <p className="text-xs font-sans text-black/60 leading-relaxed">
                    Master block-carvers engrave intricate floral and classic motifs onto aged teak wood blocks by hand. This takes up to 48 hours of chiseling per single pattern layer.
                  </p>
                </div>
                
                <div className="bg-[#FAF9F6] border border-[#EBE3D5] p-8 rounded-sm space-y-4 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-800 font-serif font-black text-sm">02</div>
                  <h4 className="text-sm font-sans font-black uppercase tracking-wider text-black">Sanganeri Hand-Block Print</h4>
                  <p className="text-xs font-sans text-black/60 leading-relaxed">
                    Artisans dip wooden blocks into natural vegetable colors, stamping them repeatedly onto fabrics. The slight variations are a proud signature of human hands.
                  </p>
                </div>
                
                <div className="bg-[#FAF9F6] border border-[#EBE3D5] p-8 rounded-sm space-y-4 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-800 font-serif font-black text-sm">03</div>
                  <h4 className="text-sm font-sans font-black uppercase tracking-wider text-black">Tailored Heritage Finish</h4>
                  <p className="text-xs font-sans text-black/60 leading-relaxed">
                    Stitched carefully in limited batches by Manoj Tailor's boutique workshop. Heavy reinforcement on double-seams ensures lifetime resilience.
                  </p>
                </div>
              </div>
            </div>

            {/* Cinematic Review Showcase */}
            <div className="pt-24 border-t border-black/5">
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-black mb-12 block font-sans">Client Stories</h3>
              <div className="relative bg-[#FBF9F4] p-10 md:p-20 overflow-hidden rounded-sm group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/40 blur-[100px] -mr-48 -mt-48 rounded-full" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/[0.02] blur-[80px] -ml-48 -mb-48 rounded-full" />
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentReview}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col lg:flex-row items-center gap-12 md:gap-24 relative z-10"
                  >
                    <div className="relative w-full lg:w-[45%] aspect-square lg:aspect-auto lg:h-[450px] rounded-sm overflow-hidden shadow-2xl bg-white">
                      <Image
                        src={reviews[currentReview].image}
                        alt={reviews[currentReview].name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
                        sizes="(max-width: 1024px) 100vw, 45vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    <div className="flex-grow flex flex-col justify-center max-w-xl">
                      <div className="flex gap-1 mb-8">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-2xl md:text-4xl font-serif italic text-black/90 leading-[1.3] mb-12">
                        "{reviews[currentReview].text}"
                      </p>
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-[1px] bg-black/20" />
                        <div className="flex flex-col">
                          <span className="text-xs uppercase tracking-[0.4em] font-black text-black mb-1">{reviews[currentReview].name}</span>
                          <span className="text-[9px] uppercase tracking-[0.2em] text-black/30 font-bold">Verified Collector</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-8 right-10 md:bottom-20 md:right-20 flex gap-6 z-20">
                  <button onClick={prevReview} className="w-14 h-14 flex items-center justify-center bg-white/50 backdrop-blur-sm hover:bg-black hover:text-white transition-all border border-black/10 rounded-full">
                    <ArrowLeft size={20} strokeWidth={1} />
                  </button>
                  <button onClick={nextReview} className="w-14 h-14 flex items-center justify-center bg-white/50 backdrop-blur-sm hover:bg-black hover:text-white transition-all border border-black/10 rounded-full">
                    <ArrowRight size={20} strokeWidth={1} />
                  </button>
                </div>
              </div>
            </div>

            {/* Recommendations Section */}
            <div className="pt-12 border-t border-black/5">
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-black mb-12 block font-sans">You May Also Love</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} onQuickAdd={handleQuickAdd} />
                ))}
              </div>

              <div className="mt-20 pt-10 flex justify-center">
                <Link href="/shop" className="group flex items-center gap-5 text-[10px] uppercase tracking-[0.4em] font-black text-black">
                  Explore More Heritage
                  <div className="w-12 h-px bg-black/20 group-hover:w-20 transition-all duration-500" />
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Zoom Modal */}
        <AnimatePresence>
          {isZoomModalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-white">
              <button onClick={() => setIsZoomModalOpen(false)} className="absolute top-10 right-10 p-2 text-foreground/40 hover:text-foreground transition-colors z-[60]">
                <X size={32} strokeWidth={1} />
              </button>
              <div className="w-full max-w-5xl h-screen relative">
                <Image src={currentImages[selectedImage]} alt={product.name} fill className="object-contain" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sticky Add-to-Cart Bar */}
      <StickyCartBar
        product={product}
        onAddToCart={() => addItem(product)}
        triggerRef={addToCartRef}
        alreadyInCart={isAdded}
      />

      <Footer />

      {/* Quick Add Drawer */}
      <QuickAddDrawer 
        product={selectedProduct} 
        isOpen={isQuickAddOpen} 
        onClose={() => setIsQuickAddOpen(false)} 
      />
    </div>
  );
}
