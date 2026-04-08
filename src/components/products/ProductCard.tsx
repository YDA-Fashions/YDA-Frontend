"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "../../data/products";
import { useCartStore } from "../../store/useCartStore";
import { useWishlistStore } from "../../store/useWishlistStore";
import { useState, useEffect } from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlistStore();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isWishlisted = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeWishlist(product.id);
    } else {
      addWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    // Add success toast logic later
  };

  const discount = Math.round(((product.original_price - product.selling_price) / product.original_price) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      viewport={{ once: true }}
      className="group bg-white transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden rounded-sm border border-black/5"
    >
      <div className="relative overflow-hidden">
        <Link href={`/product/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-[#F5F5F0]">
            <Image
              src={product.colors?.[0]?.images?.[0] || "/images/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            
            {/* Wishlist Button */}
            <button 
              onClick={toggleWishlist}
              className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors z-10 ${
                isMounted && isWishlisted ? "bg-accent-dark text-white" : "bg-white/60 text-foreground hover:bg-white"
              }`}
            >
              <Heart size={14} fill={isMounted && isWishlisted ? "currentColor" : "none"} strokeWidth={1.5} />
            </button>
          </div>

          <div className="p-4 flex flex-col gap-2">
            <h3 className="text-sm font-sans font-bold tracking-tight text-foreground line-clamp-2 min-h-[40px]">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-black text-foreground">
                ₹{product.selling_price.toLocaleString()}
              </span>
              <span className="text-xs text-foreground/30 line-through">
                ₹{product.original_price.toLocaleString()}
              </span>
              <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                SAVE {discount}%
              </span>
            </div>
          </div>
        </Link>

        {/* Full-width Yellow Pill Button */}
        <div className="px-4 pb-6">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="w-full bg-[#FFD700] hover:bg-[#F2CC00] text-black py-4 rounded-full text-[10px] tracking-[0.2em] font-black uppercase transition-all shadow-md flex items-center justify-center gap-2"
          >
            <ShoppingBag size={14} strokeWidth={2.5} />
            Add to Selection
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
