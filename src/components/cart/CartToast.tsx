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
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 50, x: "-50%" }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] w-[92%] max-w-md"
        >
          <div className="bg-white/95 backdrop-blur-md rounded-sm shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] border border-black/5 p-5 flex items-center gap-6 overflow-hidden relative">
            {/* Design Element: Accent Bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-black" />
            {/* Product Image */}
            <div className="relative w-16 h-16 bg-[#F5F5F0] flex-shrink-0 rounded-sm overflow-hidden">
              <Image 
                src={lastAddedItem.colors?.[0]?.images?.[0] || "/images/placeholder.jpg"} 
                alt={lastAddedItem.name} 
                fill 
                className="object-contain p-2"
              />
            </div>

            {/* Content */}
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-black/50">Piece Added to Selection</span>
              </div>
              <h4 className="text-[15px] font-serif italic mb-1 truncate text-black">{lastAddedItem.name}</h4>
              <p className="text-[12px] font-black tracking-tight text-black/40">₹{lastAddedItem.selling_price.toLocaleString()}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 border-l border-black/5 pl-5">
              <Link 
                href="/cart"
                onClick={() => setCartToastOpen(false)}
                className="text-[11px] uppercase tracking-[0.2em] font-black text-black hover:opacity-60 transition-all border-b border-black pb-0.5"
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
