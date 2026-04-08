"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ShieldCheck, MapPin, ChevronRight, CheckCircle2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useCartStore } from "@/store/useCartStore";
import confetti from "canvas-confetti";

const CheckoutPage = () => {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);
    // Simulate Razorpay Loading
    setTimeout(() => {
      setLoading(false);
      setStep(3);
      clearCart();
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#8B7D6B", "#FADADD", "#333333"]
      });
    }, 2000);
  };

  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-serif mb-4 text-foreground/40 italic">Empty Basket.</h1>
          <button onClick={() => router.push("/shop")} className="text-xs uppercase tracking-widest font-bold">Return to Collection</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-24 md:pt-48">
        <div className="container mx-auto px-6 max-w-6xl">
          <AnimatePresence mode="wait">
            {step < 3 ? (
              <motion.div 
                key="checkout-flow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-16"
              >
                {/* Left Side: Forms */}
                <div className="lg:col-span-7 space-y-12">
                  <div className="flex items-center gap-8 mb-12">
                    <button className={`text-[10px] uppercase tracking-widest font-bold ${step === 1 ? "text-foreground" : "text-foreground/20"}`}>01 Shipping</button>
                    <ChevronRight size={14} className="text-foreground/20" />
                    <button className={`text-[10px] uppercase tracking-widest font-bold ${step === 2 ? "text-foreground" : "text-foreground/20"}`}>02 Payment</button>
                  </div>

                  {step === 1 ? (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                      <h2 className="text-3xl font-serif tracking-tight">Shipping <span className="italic">Destination.</span></h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input placeholder="First Name" className="bg-transparent border border-border-beige p-4 text-sm focus:border-accent-dark outline-none transition-colors" />
                        <input placeholder="Last Name" className="bg-transparent border border-border-beige p-4 text-sm focus:border-accent-dark outline-none transition-colors" />
                        <input placeholder="Phone Number" className="bg-transparent border border-border-beige p-4 text-sm md:col-span-2 focus:border-accent-dark outline-none transition-colors" />
                        <input placeholder="Address Line 1" className="bg-transparent border border-border-beige p-4 text-sm md:col-span-2 focus:border-accent-dark outline-none transition-colors" />
                        <input placeholder="City" className="bg-transparent border border-border-beige p-4 text-sm focus:border-accent-dark outline-none transition-colors" />
                        <input placeholder="State" className="bg-transparent border border-border-beige p-4 text-sm focus:border-accent-dark outline-none transition-colors" />
                      </div>
                      <button 
                        onClick={() => setStep(2)}
                        className="w-full bg-foreground text-background py-5 px-8 text-[12px] uppercase tracking-[0.3em] font-sans font-bold hover:bg-accent-dark transition-all duration-500"
                      >
                        Continue to Payment
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                      <h2 className="text-3xl font-serif tracking-tight">Payment <span className="italic">Gateway.</span></h2>
                      <div className="bg-accent/10 border border-accent-dark p-6 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-accent-dark">Razorpay Secure</span>
                          <Lock size={16} className="text-accent-dark" />
                        </div>
                        <p className="text-sm text-foreground/60 leading-relaxed italic">
                          "You will be redirected to the Razorpay secure gateway to finalize your heritage selection."
                        </p>
                        <div className="flex gap-4 opacity-40">
                          <CreditCard size={24} />
                          <ShieldCheck size={24} />
                        </div>
                      </div>
                      <button 
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-foreground text-background py-5 px-8 text-[12px] uppercase tracking-[0.3em] font-sans font-bold hover:bg-accent-dark transition-all duration-500 flex items-center justify-center gap-4"
                      >
                        {loading ? "Authorizing Selection..." : `Pay ₹${getTotalPrice().toLocaleString()}`}
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Right Side: Summary Container */}
                <div className="lg:col-span-5">
                   <div className="bg-[#F5F5F0] p-10 space-y-10 sticky top-48">
                      <h3 className="text-[10px] uppercase tracking-widest font-bold border-b border-border-beige pb-4">Your Selection</h3>
                      <div className="space-y-6 max-h-[300px] overflow-y-auto">
                        {items.map(item => (
                          <div key={item.id} className="flex gap-4 items-center">
                            <span className="text-[10px] font-bold text-foreground/40">{item.quantity}x</span>
                            <span className="text-sm font-serif">{item.name}</span>
                            <span className="ml-auto text-sm font-sans font-bold">₹{(item.selling_price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-border-beige pt-6 space-y-4">
                        <div className="flex justify-between text-[10px] uppercase tracking-widest text-foreground/40">
                          <span>Subtotal</span>
                          <span>₹{getTotalPrice().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-baseline pt-4">
                          <span className="text-[12px] uppercase tracking-widest font-bold">Grand Total</span>
                          <span className="text-2xl font-serif font-bold">₹{getTotalPrice().toLocaleString()}</span>
                        </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-white border border-border-beige shadow-2xl relative overflow-hidden"
              >
                <div className="relative z-10 p-12">
                  <CheckCircle2 size={80} className="mx-auto mb-8 text-accent-dark" strokeWidth={1} />
                  <h2 className="text-5xl md:text-7xl font-serif italic mb-6">Selection Finalized.</h2>
                  <p className="text-[12px] uppercase tracking-[0.4em] font-sans font-bold text-foreground/40 mb-12">
                    Order Confirmation #YDA-2026-{(Math.random() * 10000).toFixed(0)}
                  </p>
                  <p className="max-w-md mx-auto text-foreground/60 text-lg leading-relaxed mb-12">
                    Artistry takes time. We've received your selection and our artisans are beginning the final inspection.
                  </p>
                  <button 
                    onClick={() => router.push("/")}
                    className="inline-block bg-foreground text-background px-12 py-5 text-[12px] uppercase tracking-[0.3em] font-sans font-bold hover:bg-accent-dark transition-all duration-500"
                  >
                    Return to Studio
                  </button>
                </div>
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                  <div className="absolute top-10 left-10 text-9xl font-serif">YDA</div>
                  <div className="absolute bottom-10 right-10 text-9xl font-serif italic">YDA</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
