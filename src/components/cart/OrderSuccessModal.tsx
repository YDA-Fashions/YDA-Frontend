"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";

const OrderSuccessModal = () => {
  const { isOrderSuccessModalOpen, setOrderSuccessModalOpen, lastOrderDetails } = useCartStore();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOrderSuccessModalOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOrderSuccessModalOpen]);

  if (!lastOrderDetails) return null;

  return (
    <AnimatePresence>
      {isOrderSuccessModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
        >
          {/* Confetti Particles (Simplified CSS/Framer Motion) */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
               {[...Array(20)].map((_, i) => (
                 <motion.div
                   key={i}
                   initial={{ 
                     top: "50%", 
                     left: "50%", 
                     scale: 0,
                     rotate: 0,
                     opacity: 1 
                   }}
                   animate={{ 
                     top: `${Math.random() * 100}%`, 
                     left: `${Math.random() * 100}%`, 
                     scale: Math.random() * 1.5,
                     rotate: 360,
                     opacity: 0 
                   }}
                   transition={{ duration: 2, ease: "easeOut" }}
                   className="absolute w-2 h-2 rounded-full"
                   style={{ 
                     backgroundColor: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1"][Math.floor(Math.random() * 4)] 
                   }}
                 />
               ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="bg-white w-full max-w-lg p-12 md:p-20 text-center relative rounded-sm border border-black/5 shadow-2xl"
          >
            <button 
              onClick={() => setOrderSuccessModalOpen(false)}
              className="absolute top-8 right-8 text-black/20 hover:text-black transition-colors"
            >
              <X size={24} strokeWidth={1} />
            </button>

            {/* YDA Logo (Simulated) */}
            <div className="mb-12">
               <span className="text-4xl font-serif tracking-[0.2em] font-black italic">YDA</span>
               <div className="w-12 h-px bg-black/10 mx-auto mt-4" />
            </div>

            <div className="mb-10">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={40} className="text-emerald-600" strokeWidth={1} />
              </div>
              <h2 className="text-3xl font-serif italic mb-4">Thank You!</h2>
              <p className="text-sm font-sans text-black/60 tracking-wide">
                Your piece of heritage has been secured. Your order is confirmed and currently being prepared by our artisans.
              </p>
            </div>

            <div className="bg-[#FCFBFA] border border-black/5 p-8 mb-12 rounded-sm text-left space-y-4">
               <div className="flex justify-between items-center text-[11px] uppercase tracking-widest font-black text-black/40">
                  <span>Order Reference</span>
                  <span className="text-black">#{lastOrderDetails.orderId}</span>
               </div>
               <div className="flex justify-between items-center text-[11px] uppercase tracking-widest font-black text-black/40">
                  <span>Total Investment</span>
                  <span className="text-black text-lg">₹{lastOrderDetails.totalAmount.toLocaleString()}</span>
               </div>
            </div>

            <Link 
              href="/shop"
              onClick={() => setOrderSuccessModalOpen(false)}
              className="inline-flex items-center gap-3 bg-black text-white px-12 py-5 text-[12px] uppercase tracking-[0.4em] font-black hover:bg-black/90 transition-all shadow-xl"
            >
              Continue Selection <ShoppingBag size={14} />
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderSuccessModal;
