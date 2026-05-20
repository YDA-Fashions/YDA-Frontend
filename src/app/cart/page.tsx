"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, Gift, Truck, ShieldCheck, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { PRODUCTS } from "@/data/products";

const URGENCY_MESSAGES = [
  "🔥 Limited Stock. Buy Within",
  "⏳ Masterpieces are reserved. Checkout within",
  "⚡ High Demand. Complete purchase within",
  "🛍️ Popular curation. Secure items within"
];

const CartPage = () => {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart, cartTimerExpiresAt, addItem } = useCartStore();
  const { setOrderModalOpen } = useUIStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [timeLeft, setTimeLeft] = useState<string>("");
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
    // Select a random urgency message on load
    const randomIndex = Math.floor(Math.random() * URGENCY_MESSAGES.length);
    setSelectedMessage(URGENCY_MESSAGES[randomIndex]);
  }, []);

  useEffect(() => {
    if (!isMounted || !cartTimerExpiresAt || items.length === 0) {
      setTimeLeft("");
      return;
    }

    const updateTimer = () => {
      const remaining = cartTimerExpiresAt - Date.now();
      if (remaining <= 0) {
        setTimeLeft("00:00");
        setShowExpiredModal(true);
        clearInterval(interval);
        clearCart();
      } else {
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        const pad = (num: number) => num.toString().padStart(2, "0");
        setTimeLeft(`${pad(minutes)}:${pad(seconds)}`);
      }
    };

    updateTimer(); // Run once immediately
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [cartTimerExpiresAt, items, clearCart, isMounted]);

  const subtotal = getTotalPrice();
  const threshold = 1000;
  const shippingFee = subtotal >= threshold ? 0 : 100;
  const isFreeGiftEligible = subtotal >= threshold;
  const awayAmount = threshold - subtotal;

  const handleCheckout = () => {
    router.push("/checkout");
  };

  // Get 3 items not currently in the cart for cross-selling
  const recommendedItems = React.useMemo(() => {
    const cartIds = new Set(items.map(item => item.id));
    const filtered = PRODUCTS.filter(product => !cartIds.has(product.id));
    return filtered.slice(0, 3);
  }, [items]);

  return (
    <div className="min-h-screen bg-[#FCFBFA]">
      <Header />
      
      <main className="pt-28 pb-24 md:pt-40">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* URGENCY COUNTDOWN TIMER BANNER */}
          {isMounted && items.length > 0 && timeLeft && selectedMessage && (
            <div className="mb-8 bg-red-600 border border-red-700 text-white rounded-sm px-4 py-3 flex items-center justify-between gap-4 shadow-sm relative overflow-hidden">
              {/* Background heartbeat pulse effect */}
              <div className="absolute inset-0 bg-red-500 opacity-20 animate-pulse pointer-events-none" />
              
              <div className="flex items-center gap-2.5 z-10">
                <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </span>
                <p className="text-xs font-sans font-bold tracking-wider uppercase">
                  {selectedMessage}
                </p>
              </div>

              <div className="z-10 flex-shrink-0 flex items-center bg-white/10 px-3 py-1 border border-white/20 rounded-sm">
                <span className="text-sm font-sans font-black tracking-widest tabular-nums animate-pulse text-[#FFD700]">
                  {timeLeft}
                </span>
              </div>
            </div>
          )}

          {!isMounted ? (
            <div className="py-32 text-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-black/5 rounded-full mb-4" />
                <div className="h-4 w-32 bg-black/5 rounded" />
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="py-32 text-center bg-white border border-black/5 p-12 max-w-xl mx-auto rounded-sm">
              <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={32} className="text-black/30" strokeWidth={1} />
              </div>
              <h1 className="text-3xl font-serif italic mb-3">Your Curation is Empty</h1>
              <p className="text-sm font-sans text-black/50 mb-8 max-w-sm mx-auto leading-relaxed">
                Add handcrafted masterworks, cushions, or luxury accessories from YDA collections to start your curation.
              </p>
              <Link 
                href="/shop"
                className="inline-block bg-black hover:bg-black/80 text-white px-8 py-3.5 text-[10px] font-sans font-bold uppercase tracking-widest rounded-sm transition-all"
              >
                Browse Collections
              </Link>
            </div>
          ) : (
            <div>
              {/* Cinematic Luxury Page Header */}
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-[9px] uppercase tracking-[0.4em] font-black text-black/40">Boutique Checkout</span>
                <h1 className="text-4xl md:text-5xl font-serif italic text-black mt-2 mb-4">Your Curation</h1>
                <p className="text-sm font-sans text-black/60 leading-relaxed">
                  A carefully selected range of YDA handcrafted luxury creations, reserved for your private collection.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* Left Column: Spacious Curation Items List */}
                <div className="lg:col-span-8 space-y-10">
                  <div className="space-y-8">
                    {items.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex flex-col sm:flex-row gap-8 pb-8 border-b border-black/[0.06] last:border-0 last:pb-0"
                      >
                        {/* Product Image Frame */}
                        <Link href={`/product/${item.id}`} className="flex-shrink-0">
                          <div className="relative w-36 md:w-44 aspect-[4/5] bg-[#F9F8F6] rounded-sm overflow-hidden border border-black/[0.03] shadow-sm group">
                            <Image 
                              src={item.colors?.[0]?.images?.[0] || "/images/placeholder.jpg"} 
                              alt={item.name} 
                              fill 
                              className="object-contain p-3 group-hover:scale-105 transition-transform duration-500" 
                            />
                          </div>
                        </Link>

                        {/* Product Detailed Metadata */}
                        <div className="flex-grow flex flex-col justify-between py-1">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <span className="text-[8px] uppercase tracking-widest font-black text-black/40 block mb-1">
                                  {item.category}
                                </span>
                                <Link href={`/product/${item.id}`}>
                                  <h3 className="text-lg md:text-xl font-serif italic text-black hover:text-amber-800 transition-colors leading-tight">
                                    {item.name}
                                  </h3>
                                </Link>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-base font-sans font-bold text-black">
                                  ₹{(item.selling_price * item.quantity).toLocaleString()}
                                </p>
                                {item.original_price > item.selling_price && (
                                  <p className="text-xs text-black/40 line-through mt-0.5">
                                    ₹{(item.original_price * item.quantity).toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-xs text-emerald-700 font-sans font-medium">In Stock • Dispatches in 24 Hours</p>
                            <p className="text-[10px] text-black/50 font-sans tracking-wide">
                              Complimentary wrapping & gift message available
                            </p>
                          </div>

                          {/* Minimal Quantity & Action Bar */}
                          <div className="flex items-center justify-between flex-wrap gap-4 mt-6 pt-4 border-t border-black/[0.04]">
                            <div className="flex items-center gap-1 bg-[#F5F4F0] border border-black/[0.06] rounded-sm px-1 py-0.5">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:text-black text-black/40 transition-colors"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="px-3 text-xs font-sans font-bold text-black min-w-[24px] text-center">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:text-black text-black/40 transition-colors"
                              >
                                <Plus size={11} />
                              </button>
                            </div>

                            <div className="flex items-center gap-4">
                              <button 
                                onClick={() => removeItem(item.id)}
                                className="text-[9px] font-sans font-black tracking-widest text-black/30 hover:text-red-700 uppercase transition-colors"
                              >
                                [ Remove Piece ]
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                  {/* Frequently Bought Together Widget */}
                  {recommendedItems.length > 0 && (
                    <div className="mt-20 pt-10 border-t border-black/[0.08]">
                      <span className="text-[9px] uppercase tracking-[0.3em] font-black text-black/40 block mb-2">Complements</span>
                      <h3 className="text-lg font-serif italic text-black mb-6">
                        Frequently Bought Together
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {recommendedItems.map((product) => (
                          <div 
                            key={product.id} 
                            className="border border-[#EBE3D5] bg-[#FDFCFB] p-4 rounded-sm flex flex-col justify-between group"
                          >
                            <div>
                              <Link href={`/product/${product.id}`}>
                                <div className="relative w-full aspect-square bg-[#F9F8F6] rounded-sm overflow-hidden mb-3 border border-black/[0.02]">
                                  <Image 
                                    src={product.colors?.[0]?.images?.[0] || "/images/placeholder.jpg"} 
                                    alt={product.name} 
                                    fill 
                                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                                  />
                                </div>
                              </Link>
                              <Link href={`/product/${product.id}`}>
                                <h4 className="text-xs font-sans font-bold text-black/85 hover:text-amber-800 line-clamp-1">
                                  {product.name}
                                </h4>
                              </Link>
                              <p className="text-[8px] text-black/40 uppercase tracking-widest mt-0.5">{product.category}</p>
                              <p className="text-xs font-sans font-black text-black mt-2">₹{product.selling_price.toLocaleString()}</p>
                            </div>
                            <button
                              onClick={() => addItem(product)}
                              className="mt-4 w-full bg-white hover:bg-black hover:text-white border border-black/20 text-black py-2 text-[9px] uppercase tracking-widest font-sans font-black transition-colors rounded-sm"
                            >
                              + Add to Curation
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Invoice-Style Summary Card */}
                <div className="lg:col-span-4 lg:sticky lg:top-36">
                  <div className="bg-[#FDFCFB] border border-[#EBE3D5] p-6 shadow-sm rounded-sm">
                    
                    {/* Invoice Header */}
                    <div className="border-b border-black/[0.06] pb-4 mb-6">
                      <span className="text-[9px] uppercase tracking-[0.3em] font-black text-black/40 block mb-1">Curation Slip</span>
                      <h3 className="text-lg font-serif italic text-black">Summary of Pieces</h3>
                    </div>

                    {/* Interactive Gold Progress Bar */}
                    <div className="mb-6 bg-[#FCFBFA] border border-[#EBE3D5] p-4 rounded-sm space-y-2">
                      <div className="flex justify-between items-center text-[9px] font-sans font-black uppercase tracking-wider">
                        <span className="text-black/80">
                          {subtotal >= threshold ? "🎉 Free Delivery Unlocked" : "Delivery Progress"}
                        </span>
                        <span className="text-black/50">
                          {subtotal >= threshold ? "100%" : `${Math.floor((subtotal / threshold) * 100)}%`}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#F5F4F0] rounded-full overflow-hidden border border-black/[0.04]">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min((subtotal / threshold) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-[9px] font-sans text-black/50 leading-relaxed">
                        {subtotal >= threshold 
                          ? "Qualifies for free priority courier dispatch & surprise artisan gift." 
                          : `Add ₹${awayAmount.toLocaleString()} more for free shipping & a surprise handcrafted gift.`
                        }
                      </p>
                    </div>

                    {/* Receipt Line Items */}
                    <div className="space-y-3 font-sans text-xs border-b border-black/[0.06] pb-6 mb-6">
                      <div className="flex justify-between items-center text-black/60">
                        <span>Items Subtotal ({getTotalItems()})</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-black/60">
                        <span>Luxury Gift Wrapping</span>
                        <span className="text-[9px] uppercase font-bold text-emerald-700 tracking-wider">Complimentary</span>
                      </div>
                      <div className="flex justify-between items-center text-black/60">
                        <span>Courier Dispatch</span>
                        <span>{shippingFee === 0 ? <span className="text-[9px] uppercase font-bold text-emerald-700 tracking-wider">Free</span> : `₹${shippingFee}`}</span>
                      </div>
                      <div className="flex justify-between items-center text-black/60 border-t border-dashed border-black/10 pt-3">
                        <span>Estimated GST (Included)</span>
                        <span>₹0</span>
                      </div>
                    </div>

                    {/* Grand Total */}
                    <div className="flex justify-between items-baseline mb-8">
                      <span className="text-xs uppercase tracking-widest font-black text-black/80">Total Value</span>
                      <span className="text-2xl font-sans font-black text-black">
                        ₹{(subtotal + shippingFee).toLocaleString()}
                      </span>
                    </div>

                    {/* Luxury Checkout Button */}
                    <button 
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="w-full bg-black text-white hover:bg-black/90 border border-black rounded-sm py-4 px-6 text-[10px] font-sans font-black uppercase tracking-[0.2em] shadow-md transition-all duration-300 mb-6 disabled:opacity-50"
                    >
                      {isProcessing ? "Authenticating..." : "Proceed to Checkout"}
                    </button>

                    {/* Verified Badges */}
                    <div className="space-y-4 pt-4 border-t border-black/[0.06]">
                      <div className="flex items-center gap-3">
                        <ShieldCheck size={16} className="text-emerald-700 flex-shrink-0" />
                        <span className="text-[10px] font-sans font-bold text-black/75 uppercase tracking-wider">Secure 256-Bit Checkout</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Truck size={16} className="text-black/60 flex-shrink-0" />
                        <span className="text-[10px] font-sans font-bold text-black/75 uppercase tracking-wider">Studio Dispatch Verified</span>
                      </div>
                      
                      {/* Stylized Brand Payment Logos */}
                      <div className="pt-3.5 border-t border-black/[0.04] flex flex-wrap gap-2 justify-center items-center">
                        {/* Visa */}
                        <svg className="w-10 h-6.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)] rounded-[3px] border border-black/[0.03]" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="40" height="24" rx="2" fill="#1A1F71"/>
                          <path d="M12.5 15.5l1.2-7h1.6l-1.2 7h-1.6zm7.2-6.8c-.3-.1-.7-.2-1.2-.2-1.3 0-2.2.7-2.2 1.6 0 .7.6 1.1 1.2 1.4.5.2.7.4.7.6 0 .3-.4.5-.8.5-.6 0-.9-.1-1.4-.3l-.2-.1-.2 1.3c.4.2 1 .3 1.5.3 1.4 0 2.3-.7 2.3-1.7 0-.8-.7-1.2-1.4-1.5-.5-.2-.7-.4-.7-.6 0-.3.3-.5.7-.5.5 0 .8.1 1.2.2l.2.1.2-1.3zm6 6.8l-1.5-7h-1.5l-.8 4.5-.4-2.5c-.1-.7-.7-1.5-1.5-1.5h-1.3l.2 1 1 .5c.6.3.8.7.9 1.1l1.1 3.9h1.8zm4.8 0l1.2-7h-1.3l-.9 5-.1-.7-.6-4.3h-1.5l1.6 7h1.6z" fill="#FFF"/>
                        </svg>

                        {/* Mastercard */}
                        <svg className="w-10 h-6.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)] rounded-[3px] border border-black/[0.03]" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="40" height="24" rx="2" fill="#222222"/>
                          <circle cx="15" cy="12" r="6" fill="#EB001B"/>
                          <circle cx="23" cy="12" r="6" fill="#FF5F00" fillOpacity="0.85"/>
                        </svg>

                        {/* UPI */}
                        <svg className="w-10 h-6.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)] rounded-[3px] border border-black/[0.08]" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="48" height="24" rx="2" fill="#FFFFFF"/>
                          <text x="4" y="16" fontFamily="sans-serif" fontWeight="900" fontSize="10" fill="#000000" fontStyle="italic" letterSpacing="-0.5">UPI</text>
                          <path d="M28 8l3 3-3 3" stroke="#097939" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M33 8l-3 3 3 3" stroke="#0072b2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>

                        {/* Paytm */}
                        <svg className="w-10 h-6.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)] rounded-[3px] border border-black/[0.08]" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="48" height="24" rx="2" fill="#FFFFFF"/>
                          <text x="3" y="16" fontFamily="sans-serif" fontWeight="900" fontSize="11" fill="#00baf2" letterSpacing="-0.5">Pay</text>
                          <text x="23" y="16" fontFamily="sans-serif" fontWeight="900" fontSize="11" fill="#002e6e" letterSpacing="-0.5">tm</text>
                        </svg>

                        {/* PhonePe */}
                        <svg className="w-10 h-6.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)] rounded-[3px] border border-black/[0.03]" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="48" height="24" rx="2" fill="#5f259f"/>
                          <text x="5" y="15" fontFamily="sans-serif" fontWeight="900" fontSize="8" fill="#FFFFFF" letterSpacing="0.3">PhonePe</text>
                        </svg>

                        {/* RuPay */}
                        <svg className="w-10 h-6.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)] rounded-[3px] border border-black/[0.08]" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="48" height="24" rx="2" fill="#FFFFFF"/>
                          <text x="3" y="15" fontFamily="sans-serif" fontWeight="900" fontSize="8" fill="#0a3973" fontStyle="italic" letterSpacing="-0.3">RuPay</text>
                          <path d="M37 9h3l-1.5 3h-3z" fill="#f7941d"/>
                          <path d="M38.5 6h3l-1.5 3h-3z" fill="#0a3973"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />

      {/* Expired Notification Modal */}
      <AnimatePresence>
        {showExpiredModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#FCFBFA] border border-[#EBE3D5] p-8 max-w-md w-full shadow-2xl relative"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                  <ShoppingBag size={28} strokeWidth={1.5} />
                </div>
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-red-600">Reservation Expired</span>
                <h3 className="text-2xl font-serif italic text-black">Curation Released</h3>
                <p className="text-sm font-sans text-black/60 leading-relaxed">
                  Due to high demand for YDA handcrafted creations, your 20-minute reservation has expired and the items have been released.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setShowExpiredModal(false);
                      router.push("/shop");
                    }}
                    className="w-full bg-black text-white py-4 text-[10px] uppercase tracking-[0.3em] font-sans font-bold hover:bg-black/80 transition-all duration-300"
                  >
                    Browse Collections
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartPage;
