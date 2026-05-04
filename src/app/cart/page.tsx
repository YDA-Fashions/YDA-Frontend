"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, Gift, Truck, ShieldCheck, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";

const CartPage = () => {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const { setOrderModalOpen } = useUIStore();
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
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#FCFBFA]">
      <Header />
      
      <main className="pt-28 pb-24 md:pt-40">
        <div className="container mx-auto px-6 max-w-7xl">
          
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
              </div>

              {/* Right Column: Order Summary (Amazon Style) */}
              <div className="lg:col-span-3 space-y-6">
                
                <div className="bg-white border border-black/5 p-5 rounded-sm">
                  <div className="mb-4">
                    <div className="flex gap-2 items-start mb-2">
                      <CheckCircle size={20} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-sans text-emerald-800">
                        Your order is eligible for FREE Delivery.
                      </p>
                    </div>
                  </div>

                  <h2 className="text-lg font-sans mb-5">
                    Subtotal ({getTotalItems()} items): <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                  </h2>

                  <button 
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full py-2.5 px-4 text-sm font-sans shadow-sm transition-all text-black mb-4 disabled:opacity-50"
                  >
                    {isProcessing ? "Authenticating..." : "Proceed to Buy"}
                  </button>

                  <div className="space-y-3 pt-4 border-t border-black/10">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={16} className="text-black/40" />
                      <span className="text-xs font-sans text-black/60">Secure checkout via SSL</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Truck size={16} className="text-black/40" />
                      <span className="text-xs font-sans text-black/60">Dispatches from YDA Studio</span>
                    </div>
                  </div>
                </div>

                {/* AOV Booster Alert (Styled like Amazon deals) */}
                {!isFreeGiftEligible && (
                  <div className="bg-white border border-black/5 p-4 rounded-sm">
                    <h3 className="text-sm font-bold font-sans mb-2 flex items-center gap-2">
                      <Gift size={16} className="text-amber-600" /> Unlock a Free Gift
                    </h3>
                    <p className="text-xs font-sans text-black/80 mb-3">
                      Add ₹{awayAmount.toLocaleString()} more to your order to receive a complimentary handcrafted surprise gift!
                    </p>
                    <Link href="/shop" className="text-xs text-cyan-700 hover:text-amber-700 hover:underline">
                      Shop more items
                    </Link>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
