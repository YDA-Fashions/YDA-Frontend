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
            <div className="mb-6 bg-red-600 border border-red-700 text-white rounded-sm px-4 py-3.5 flex items-center justify-between gap-4 shadow-sm relative overflow-hidden">
              {/* Background heartbeat pulse effect */}
              <div className="absolute inset-0 bg-red-500 opacity-20 animate-pulse pointer-events-none" />
              
              <div className="flex items-center gap-2.5 z-10">
                <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </span>
                <p className="text-xs md:text-sm font-sans font-bold tracking-wide uppercase">
                  {selectedMessage}
                </p>
              </div>

              <div className="z-10 flex-shrink-0 flex items-center bg-white/10 px-3 py-1 border border-white/20 rounded-sm">
                <span className="text-base md:text-lg font-sans font-black tracking-widest tabular-nums animate-pulse text-[#FFD700]">
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
            <div className="py-32 text-center bg-white border border-black/5 p-12">
              <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingBag size={32} className="text-black/20" strokeWidth={1} />
              </div>
              <h1 className="text-3xl font-serif mb-4">Your Shopping Cart is empty.</h1>
              <Link 
                href="/shop"
                className="inline-block bg-[#FFD700] hover:bg-[#F2CC00] text-black px-8 py-3 rounded-md text-sm font-bold shadow-sm transition-colors mt-4"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Cart Items (Amazon Style) */}
              <div className="lg:col-span-9 bg-white p-6 border border-black/5 rounded-sm">
                <div className="flex justify-between items-end border-b border-black/10 pb-2 mb-6">
                  <h1 className="text-3xl font-serif">Shopping Cart</h1>
                  <span className="text-sm font-sans text-black/60 hidden md:block">Price</span>
                </div>

                <div className="space-y-6">
                  {items.map((item) => (
                     <div key={item.id} className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-black/5 last:border-0 last:pb-0">
                      
                      {/* Product Image */}
                      <Link href={`/product/${item.id}`} className="flex-shrink-0">
                        <div className="relative w-32 md:w-48 aspect-square bg-[#F5F5F0] rounded-sm overflow-hidden mix-blend-multiply">
                          <Image 
                            src={item.colors?.[0]?.images?.[0] || "/images/placeholder.jpg"} 
                            alt={item.name} 
                            fill 
                            className="object-contain p-2" 
                          />
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="flex-grow flex flex-col sm:flex-row justify-between">
                        <div className="space-y-1 sm:pr-8">
                          <Link href={`/product/${item.id}`}>
                            <h3 className="text-lg md:text-xl font-sans font-medium line-clamp-2 hover:text-amber-700 hover:underline">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-emerald-700 font-sans font-medium mt-1">In stock</p>
                          <p className="text-xs text-black/60 font-sans mt-1">Eligible for FREE Shipping</p>
                          <p className="text-xs text-black/60 font-sans mt-1 uppercase tracking-widest"><span className="font-bold">Category:</span> {item.category}</p>
                          
                          {/* Quantity & Actions (Amazon Style Layout) */}
                          <div className="flex items-center flex-wrap gap-3 mt-4 pt-2">
                            <div className="flex items-center bg-[#FBF9F4] rounded-md border border-black/10 shadow-sm overflow-hidden">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-3 py-1 bg-black/5 hover:bg-black/10 transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-3 py-1 text-sm font-sans min-w-[32px] text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-3 py-1 bg-black/5 hover:bg-black/10 transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <span className="text-black/20">|</span>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-sm text-cyan-700 hover:text-amber-700 hover:underline font-sans"
                            >
                              Delete
                            </button>
                            <span className="text-black/20">|</span>
                            <button className="text-sm text-cyan-700 hover:text-amber-700 hover:underline font-sans">
                              Share
                            </button>
                          </div>
                        </div>

                        {/* Price (Right side on desktop) */}
                        <div className="mt-4 sm:mt-0 text-left sm:text-right flex-shrink-0">
                          <p className="text-xl font-bold font-sans">
                            ₹{(item.selling_price * item.quantity).toLocaleString()}
                          </p>
                          {item.original_price > item.selling_price && (
                            <p className="text-xs text-black/40 line-through mt-1">
                              ₹{(item.original_price * item.quantity).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-black/10 text-right">
                  <p className="text-lg font-sans">
                    Subtotal ({getTotalItems()} items): <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                  </p>
                </div>

                {/* Frequently Bought Together Widget */}
                {recommendedItems.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-black/10">
                    <h3 className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-black/80 mb-6">
                      Frequently Bought Together
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {recommendedItems.map((product) => (
                        <div key={product.id} className="border border-[#EBE3D5] bg-[#FCFBFA] p-4 rounded-sm flex flex-col justify-between group">
                          <div>
                            <Link href={`/product/${product.id}`}>
                              <div className="relative w-full aspect-square bg-[#F5F5F0] rounded-sm overflow-hidden mb-3">
                                <Image 
                                  src={product.colors?.[0]?.images?.[0] || "/images/placeholder.jpg"} 
                                  alt={product.name} 
                                  fill 
                                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            </Link>
                            <Link href={`/product/${product.id}`}>
                              <h4 className="text-xs font-sans font-bold text-black/80 hover:text-amber-800 line-clamp-1">
                                {product.name}
                              </h4>
                            </Link>
                            <p className="text-[9px] text-black/50 uppercase tracking-widest mt-0.5">{product.category}</p>
                            <p className="text-xs font-sans font-black text-black mt-1.5">₹{product.selling_price.toLocaleString()}</p>
                          </div>
                          <button
                            onClick={() => addItem(product)}
                            className="mt-4 w-full bg-white hover:bg-black hover:text-white border border-black/20 text-black py-2.5 text-[9px] uppercase tracking-widest font-sans font-black transition-colors rounded-sm"
                          >
                            + Add to Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Order Summary (Amazon Style) */}
              <div className="lg:col-span-3 space-y-6">
                
                <div className="bg-white border border-black/5 p-5 rounded-sm">
                  {/* Interactive Gold Progress Bar */}
                  <div className="mb-6 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-sans uppercase tracking-wider">
                      <span className="font-black text-black/80">
                        {subtotal >= threshold ? "🎉 Free Delivery Unlocked" : "Delivery Progress"}
                      </span>
                      <span className="text-black/50 font-bold">
                        {subtotal >= threshold ? "100%" : `${Math.floor((subtotal / threshold) * 100)}%`}
                      </span>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-full h-2 bg-[#F5F4F0] rounded-full overflow-hidden border border-[#EBE3D5]">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min((subtotal / threshold) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-sans text-black/60 leading-relaxed pt-0.5">
                      {subtotal >= threshold 
                        ? "Your curation qualifies for FREE delivery and a surprise handcrafted gift!" 
                        : `Add ₹${awayAmount.toLocaleString()} more to unlock FREE delivery and surprise gift.`
                      }
                    </p>
                  </div>

                  <h2 className="text-base font-sans mb-1 uppercase tracking-wide">
                    Subtotal ({getTotalItems()} items): <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                  </h2>
                  <p className="text-xs text-black/60 font-sans mb-5">
                    Shipping: {shippingFee === 0 ? <span className="text-emerald-700 font-bold uppercase">Free</span> : `₹${shippingFee}`}
                  </p>

                  <button 
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full bg-black text-white hover:bg-black/90 border border-black rounded-sm py-3.5 px-4 text-xs font-sans font-black uppercase tracking-widest shadow-sm transition-all mb-4 disabled:opacity-50"
                  >
                    {isProcessing ? "Authenticating..." : "Proceed to Buy"}
                  </button>

                  <div className="space-y-4 pt-4 border-t border-black/10">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0" />
                      <span className="text-xs font-sans font-bold text-black/70 uppercase tracking-wider">Secure 256-Bit Checkout</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Truck size={18} className="text-black/60 flex-shrink-0" />
                      <span className="text-xs font-sans font-bold text-black/70 uppercase tracking-wider">Studio Dispatch Verified</span>
                    </div>
                    
                    {/* Stylized Brand Payment Logos */}
                    <div className="pt-3.5 border-t border-black/5 flex flex-wrap gap-2 justify-center items-center">
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

                {/* AOV Booster Alert */}
                {!isFreeGiftEligible && (
                  <div className="bg-white border border-[#EBE3D5] p-5 rounded-sm">
                    <h3 className="text-xs font-bold font-sans uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Gift size={15} className="text-amber-700" /> Complimentary Gift
                    </h3>
                    <p className="text-xs font-sans text-black/70 leading-relaxed mb-3">
                      Add ₹{awayAmount.toLocaleString()} more to your curation to receive an exclusive surprise handcrafted gift!
                    </p>
                    <Link href="/shop" className="text-xs text-amber-800 hover:text-black font-sans font-bold hover:underline uppercase tracking-wider">
                      Shop more creations →
                    </Link>
                  </div>
                )}

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
