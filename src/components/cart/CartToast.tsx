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
          initial={{ opacity: 0, y: 100, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 100, x: "-50%" }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] w-[90%] max-w-sm"
        >
          <div className="bg-white rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-black/5 p-4 flex items-center gap-4">
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
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle2 size={12} className="text-emerald-600" />
                <span className="text-[10px] uppercase tracking-widest font-black text-emerald-600">Added to Selection</span>
              </div>
              <h4 className="text-[13px] font-serif truncate mb-0.5">{lastAddedItem.name}</h4>
              <p className="text-[11px] font-black text-black/40">₹{lastAddedItem.selling_price.toLocaleString()}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Link 
                href="/cart"
                onClick={() => setCartToastOpen(false)}
                className="p-2.5 bg-black text-white rounded-full hover:bg-black/80 transition-colors"
                title="View Cart"
              >
                <ArrowRight size={16} />
              </Link>
              <button 
                onClick={() => setCartToastOpen(false)}
                className="p-2.5 text-black/20 hover:text-black transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartToast;
