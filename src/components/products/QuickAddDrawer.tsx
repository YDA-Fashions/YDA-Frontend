"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Truck, RefreshCw } from "lucide-react";
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

  useEffect(() => {
    setSelectedColorIndex(0);
  }, [product]);

  if (!product || !isMounted) return null;

  const handleAddToCart = () => {
    addItem(product);
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
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[200]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-background z-[201] rounded-t-3xl overflow-hidden max-h-[85vh]"
          >
            <div className="relative p-6 pb-8">
              {/* Handle */}
              <div className="w-10 h-1 bg-border rounded-full mx-auto mb-6" />
              
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X size={20} strokeWidth={1.5} />
              </button>

              <div className="flex flex-col gap-6">
                {/* Product Info */}
                <div className="flex gap-4 items-start">
                  <div className="relative w-28 aspect-[3/4] bg-muted overflow-hidden flex-shrink-0">
                    <Image
                      src={product.colors[selectedColorIndex].images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 pt-1 flex-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-sans">
                      {product.category}
                    </span>
                    <h2 className="text-lg font-serif leading-tight line-clamp-2">
                      {product.name}
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-lg font-sans font-semibold">
                        ₹{product.selling_price.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.original_price.toLocaleString()}
                      </span>
                      {discount > 0 && (
                        <span className="text-[10px] font-sans font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                          {discount}% Off
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Color Selection */}
                {product.colors.length > 1 && (
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-sans">
                        Color
                      </span>
                      <span className="text-xs font-sans font-medium">
                        {product.colors[selectedColorIndex].name}
                      </span>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                      {product.colors.map((color, idx) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColorIndex(idx)}
                          className={`relative flex-shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-200 ${
                            selectedColorIndex === idx 
                              ? "border-foreground ring-2 ring-foreground ring-offset-2" 
                              : "border-border hover:border-muted-foreground"
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

                {/* Trust Badges */}
                <div className="flex gap-4 border-t border-border pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Truck size={14} />
                    <span className="text-[10px] uppercase tracking-[0.1em] font-sans">Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <RefreshCw size={14} />
                    <span className="text-[10px] uppercase tracking-[0.1em] font-sans">Easy Returns</span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="w-full bg-foreground text-background py-4 flex items-center justify-center gap-3 font-sans text-sm font-semibold uppercase tracking-[0.15em] transition-colors hover:bg-foreground/90"
                >
                  <ShoppingBag size={18} />
                  <span>Add to Bag</span>
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
