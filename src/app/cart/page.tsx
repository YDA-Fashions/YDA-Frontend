"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, Gift, Truck, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useCartStore } from "@/store/useCartStore";

const CartPage = () => {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, setOrderSuccessModalOpen, setLastOrderDetails, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const subtotal = getTotalPrice();
  const threshold = 1000;
  const isFreeGiftEligible = subtotal >= threshold;
  const awayAmount = threshold - subtotal;

  const handleCheckout = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      const orderId = "YDA" + Math.random().toString(36).substr(2, 9).toUpperCase();
      setLastOrderDetails({
        orderId,
        totalAmount: subtotal
      });
      setOrderSuccessModalOpen(true);
      clearCart();
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FCFBFA]">
      <Header />
      
      <main className="pt-28 pb-24 md:pt-40">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-serif tracking-tight mb-6">
              Your <br /> <span className="italic ml-8 md:ml-16">Collective Selection.</span>
            </h1>
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-black text-black/40">
              <span>{getTotalItems()} Pieces</span>
              <div className="w-1 h-1 bg-black/10 rounded-full" />
              <span>Authentication Guaranteed</span>
            </div>
          </div>

          {!isMounted ? (
            <div className="py-32 text-center border-t border-black/5">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-black/5 rounded-full mb-4" />
                <div className="h-4 w-32 bg-black/5 rounded" />
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="py-32 text-center border-t border-black/5">
              <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingBag size={32} className="text-black/20" strokeWidth={1} />
              </div>
              <p className="text-xl md:text-2xl font-serif text-black/40 italic mb-10">
                Your selection is currently empty.
              </p>
              <Link 
                href="/shop"
                className="inline-block bg-black text-white px-12 py-5 text-[12px] uppercase tracking-[0.4em] font-black hover:bg-black/90 transition-all shadow-xl"
              >
                Explore Collections
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              
              {/* Product List */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                
                {/* AOV Booster Alert */}
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 border flex items-center justify-between gap-4 rounded-sm ${
                    isFreeGiftEligible 
                    ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                    : "bg-[#FBF9F4] border-black/5 text-black"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isFreeGiftEligible ? "bg-emerald-600/10" : "bg-black/5"}`}>
                      {isFreeGiftEligible ? <CheckCircle size={20} /> : <Gift size={20} />}
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest mb-1">
                        {isFreeGiftEligible ? "Bonus Unlocked!" : "Unlock Exclusive Bonus"}
                      </p>
                      <p className="text-xs font-sans opacity-70">
                        {isFreeGiftEligible 
                          ? "Congratulations! You've qualified for a FREE handcrafted surprise gift."
                          : `You're just ₹${awayAmount.toLocaleString()} away from a FREE handcrafted gift.`
                        }
                      </p>
                    </div>
                  </div>
                  {!isFreeGiftEligible && (
                    <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest border-b border-black/20 pb-0.5 hover:border-black transition-all">Add More</Link>
                  )}
                </motion.div>

                <div className="space-y-6">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white border border-black/5 p-6 flex gap-6 md:gap-10 items-center rounded-sm group hover:shadow-sm transition-shadow"
                      >
                        <Link href={`/product/${item.id}`} className="relative aspect-square w-24 md:w-32 bg-[#F5F5F0] overflow-hidden flex-shrink-0 rounded-sm">
                          <Image src={item.colors?.[0]?.images?.[0] || "/images/placeholder.jpg"} alt={item.name} fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-700" />
                        </Link>
                        
                        <div className="flex-grow flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="space-y-2">
                            <span className="text-[9px] uppercase tracking-[0.2em] font-black text-black/40">
                              Artisan Heritage Series
                            </span>
                            <Link href={`/product/${item.id}`}>
                              <h3 className="text-lg md:text-xl font-serif line-clamp-1">{item.name}</h3>
                            </Link>
                            <p className="text-sm font-black tracking-tight">₹{item.selling_price.toLocaleString()}</p>
                          </div>

                          <div className="flex items-center gap-8 md:gap-12">
                            {/* Quantity Selector */}
                            <div className="flex items-center bg-[#FBF9F4] rounded-full px-2 py-1 border border-black/5">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded-full transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-10 text-center text-xs font-black">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded-full transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            
                            <div className="text-right min-w-[100px]">
                              <p className="text-base font-black tracking-tighter">₹{(item.selling_price * item.quantity).toLocaleString()}</p>
                            </div>

                            <button 
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-black/10 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={20} strokeWidth={1} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-4 lg:sticky lg:top-40">
                <div className="bg-white border border-black/5 p-10 rounded-sm shadow-sm">
                  <h2 className="text-[11px] uppercase tracking-[0.4em] font-black mb-10 border-b border-black/5 pb-6">
                    Selection Summary
                  </h2>
                  
                  <div className="space-y-6 mb-10">
                    <div className="flex justify-between items-center text-sm font-sans">
                      <span className="text-black/40 uppercase tracking-widest text-[10px] font-black">Subtotal</span>
                      <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-sans">
                      <span className="text-black/40 uppercase tracking-widest text-[10px] font-black">Shipping</span>
                      <span className="text-emerald-600 uppercase tracking-[0.2em] font-black text-[9px] italic">Complimentary</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-sans">
                      <span className="text-black/40 uppercase tracking-widest text-[10px] font-black">Expert Curation</span>
                      <span className="text-black/40 uppercase tracking-[0.2em] text-[9px]">Included</span>
                    </div>
                  </div>

                  <div className="border-t border-black/5 pt-8 mb-10">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[11px] uppercase tracking-[0.3em] font-black italic">Total Investment</span>
                      <span className="text-3xl font-black tracking-tighter">₹{subtotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full bg-black text-white py-6 px-8 text-[12px] uppercase tracking-[0.4em] font-black hover:bg-black/90 transition-all flex items-center justify-center gap-4 shadow-2xl disabled:opacity-50"
                  >
                    {isProcessing ? "Authenticating..." : "Proceed to Checkout"}
                    {!isProcessing && <ArrowRight size={18} />}
                  </button>

                  <div className="mt-12 space-y-6 pt-10 border-t border-black/5">
                    <div className="flex items-center gap-4">
                      <ShieldCheck size={18} className="text-black/20" strokeWidth={1.5} />
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-black/40 leading-relaxed">Secure SSL Encryption</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Truck size={18} className="text-black/20" strokeWidth={1.5} />
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-black/40 leading-relaxed">Direct Artisan Fulfillment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

// Simple icon for eligibility
const CheckCircle = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default CartPage;
