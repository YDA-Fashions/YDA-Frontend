"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";

const CartToast = () => {
  const { isCartToastOpen, lastAddedItem, setCartToastOpen } = useCartStore();

  if (!lastAddedItem) return null;

  return (
    <AnimatePresence>
      {isCartToastOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 md:bottom-10 left-0 right-0 md:left-1/2 md:-translate-x-1/2 z-[300] w-full md:w-[92%] md:max-w-md"
        >
          <div className="bg-white/95 backdrop-blur-md rounded-t-[20px] md:rounded-sm shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.1),0_30px_60px_-15px_rgba(0,0,0,0.2)] border-t md:border border-black/5 p-5 pt-7 md:pt-5 flex items-center gap-4 md:gap-6 overflow-hidden relative">
            {/* Pull Handle for Mobile */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-black/5 rounded-full md:hidden" />
            
            {/* Design Element: Accent Bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-black" />
            
            {/* Product Image */}
            <div className="relative w-14 h-14 md:w-16 md:h-16 bg-[#F5F5F0] flex-shrink-0 rounded-sm overflow-hidden">
              <Image 
                src={lastAddedItem.colors?.[0]?.images?.[0] || "/images/placeholder.jpg"} 
                alt={lastAddedItem.name} 
                fill 
                className="object-contain p-2"
              />
            </div>

            {/* Content */}
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-black text-black/50">Added to Selection</span>
              </div>
              <h4 className="text-[14px] md:text-[15px] font-serif italic mb-0.5 md:mb-1 truncate text-black">{lastAddedItem.name}</h4>
              <p className="text-[11px] md:text-[12px] font-black tracking-tight text-black/40">₹{lastAddedItem.selling_price.toLocaleString()}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 border-l border-black/5 pl-4 md:pl-5">
              <Link 
                href="/cart"
                onClick={() => setCartToastOpen(false)}
                className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-black text-black hover:opacity-60 transition-all border-b border-black pb-0.5 whitespace-nowrap"
              >
                View
              </Link>
              <button 
                onClick={() => setCartToastOpen(false)}
                className="p-1.5 text-black/20 hover:text-black transition-colors"
                aria-label="Close"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartToast;
