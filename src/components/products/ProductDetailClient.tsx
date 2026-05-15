"use client";

import React, { useState, useRef, MouseEvent, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCcw, X, Star, ArrowRight, Banknote, Award } from "lucide-react";

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

              <div className="flex items-center gap-5 mb-10">
                <span className="text-3xl font-black text-black tracking-tighter">₹{product.selling_price.toLocaleString()}</span>
                <span className="text-lg text-black/30 line-through tracking-wider">₹{product.original_price.toLocaleString()}</span>
                <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase italic">
                  Special Offer Price
                </span>
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
                  ) : null}

                  {/* Magnetic Add to Cart */}
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
                </div>
              </div>
            </div>
          </div>

          <div className="w-full space-y-24">
            {/* Reviews Section */}
            <div className="pt-12 border-t border-black/5">
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-black mb-12 block font-sans">Client Stories</h3>
              <div className="w-full bg-[#FCFBFA] border border-black/5 p-8 md:p-16 rounded-sm overflow-hidden min-h-[400px] relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentReview}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col lg:flex-row items-center gap-10 md:gap-20 h-full"
                  >
                    <div className="relative w-full lg:w-[40%] aspect-square lg:aspect-auto lg:h-[350px] rounded-sm overflow-hidden grayscale">
                      <Image
                        src={reviews[currentReview].image}
                        alt={reviews[currentReview].name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-grow flex flex-col justify-center">
                      <div className="flex gap-1 mb-8">
                        {[...Array(reviews[currentReview].rating)].map((_, i) => (
                          <Star key={i} size={16} className="fill-black text-black" />
                        ))}
                      </div>
                      <p className="text-xl md:text-2xl font-serif italic text-black/80 leading-relaxed mb-10">
                        "{reviews[currentReview].text}"
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-[1px] bg-black/20" />
                        <span className="text-xs uppercase tracking-widest font-black text-black">{reviews[currentReview].name}</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-8 right-8 md:bottom-16 md:right-16 flex gap-6">
                  <button onClick={prevReview} className="p-3 hover:bg-black/5 transition-colors border border-black/10 rounded-full">
                    <ArrowLeft size={20} strokeWidth={1} />
                  </button>
                  <button onClick={nextReview} className="p-3 hover:bg-black/5 transition-colors border border-black/10 rounded-full">
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
