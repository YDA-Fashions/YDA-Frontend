"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ChevronRight } from "lucide-react";
import { Product } from "../../data/products";
import { useCartStore } from "../../store/useCartStore";

interface QuickAddDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickAddDrawer: React.FC<QuickAddDrawerProps> = ({ product, isOpen, onClose }) => {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!product || !isMounted) return null;

  const handleAddToCart = () => {
    const selectedColor = product.colors[selectedColorIndex];
    addItem({
      ...product,
      // In a real app, we would store the selected color in the cart item
    });
    onClose();
  };

  const discount = Math.round(((product.original_price - product.selling_price) / product.original_price) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white z-[201] rounded-t-[32px] overflow-hidden max-h-[90vh]"
          >
            <div className="relative p-6 pb-10">
              {/* Handle */}
              <div className="w-12 h-1.5 bg-black/10 rounded-full mx-auto mb-8" />
              
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-black/60 hover:text-black transition-colors"
              >
                <X size={24} strokeWidth={1} />
              </button>

              <div className="flex flex-col gap-8">
                {/* Product Info Header */}
                <div className="flex gap-6 items-start">
                  <div className="relative w-32 aspect-[4/5] bg-[#F8F8F5] overflow-hidden shadow-sm">
                    <Image
                      src={product.colors[selectedColorIndex].images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <span className="text-xs uppercase tracking-wider font-black text-accent-dark/60">{product.category}</span>
                    <h2 className="text-xl font-serif italic leading-tight">{product.name}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xl font-black">₹{product.selling_price}</span>
                      <span className="text-sm text-black/20 line-through">₹{product.original_price}</span>
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 uppercase tracking-tighter">{discount}% OFF</span>
                    </div>
                  </div>
                </div>

                <div className="h-[1px] bg-black/[0.05]" />

                {/* Color Selection */}
                {product.colors.length > 1 && (
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs uppercase tracking-wider font-black text-black/60">Select Variation</span>
                      <span className="text-xs font-bold text-black">{product.colors[selectedColorIndex].name}</span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                      {product.colors.map((color, idx) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColorIndex(idx)}
                          className={`relative flex-shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                            selectedColorIndex === idx ? "border-black scale-110 shadow-lg" : "border-transparent opacity-60"
                          }`}
                        >
                          <Image
                            src={color.images[0]}
                            alt={color.name}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits / Trust */}
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-accent-dark" />
                    <span className="text-xs font-bold uppercase tracking-wider">Fast Shipping</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span className="text-xs font-bold uppercase tracking-wider">Easy Exchange</span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="w-full bg-black text-white py-5 rounded-2xl flex items-center justify-center gap-4 group shadow-xl shadow-black/10"
                >
                  <ShoppingBag size={20} strokeWidth={2} />
                  <span className="text-xs uppercase tracking-widest font-black">Add to Selection</span>
                  <ChevronRight size={18} className="opacity-40 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickAddDrawer;
