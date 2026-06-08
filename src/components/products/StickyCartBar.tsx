"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Product } from "@/data/products";

interface StickyCartBarProps {
  product: Product;
  onAddToCart: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  alreadyInCart: boolean;
}

const StickyCartBar = ({ product, onAddToCart, triggerRef, alreadyInCart }: StickyCartBarProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRecentlyAdded, setIsRecentlyAdded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show bar when the Add to Cart button is OUT of view (scrolled past)
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
    );

    const el = triggerRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [triggerRef]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur-md border-t border-border-beige shadow-[0_-8px_32px_rgba(0,0,0,0.06)]"
        >
          <div className="container mx-auto px-6 py-3 flex items-center justify-between gap-4">
            {/* Product Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="relative w-10 h-10 flex-shrink-0 bg-[#F5F1E8] rounded-sm overflow-hidden">
                <Image
                  src={product.colors[0].images[0]}
                  alt={product.name}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-widest font-black text-foreground/40 hidden sm:block">
                  {product.type}
                </p>
                <p className="text-sm font-serif truncate">{product.name}</p>
              </div>
            </div>

            {/* Price */}
            <p className="text-sm font-black tracking-tighter hidden md:block flex-shrink-0">
              ₹{product.selling_price.toLocaleString()}
            </p>

            {/* CTA Button */}
            {alreadyInCart || isRecentlyAdded ? (
              <a 
                href="/cart"
                className="flex-shrink-0 py-2.5 px-6 text-xs uppercase tracking-wider font-black transition-colors duration-300 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-2"
              >
                Go to Cart
              </a>
            ) : (
              <motion.button
                whileTap={product.stock > 0 ? { scale: 0.97 } : {}}
                onClick={() => {
                  if (product.stock > 0) {
                    onAddToCart();
                    setIsRecentlyAdded(true);
                  }
                }}
                disabled={product.stock <= 0}
                className={`flex-shrink-0 py-2.5 px-6 text-xs uppercase tracking-wider font-black transition-colors duration-300 shadow-sm ${
                  product.stock <= 0
                    ? "bg-black/10 text-black/60 cursor-not-allowed shadow-none"
                    : "bg-[#FFD700] hover:bg-[#F2CC00] text-black"
                }`}
              >
                {product.stock <= 0 ? "Sold Out" : "Add to Cart"}
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCartBar;
