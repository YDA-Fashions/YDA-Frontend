"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "../../data/products";
import { useCartStore } from "../../store/useCartStore";
import { useState, useEffect } from "react";

interface ProductCardProps {
  product: Product;
  onQuickAdd?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickAdd }) => {

  const addItem = useCartStore((state) => state.addItem);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onQuickAdd && window.innerWidth < 768) {
      onQuickAdd(product);
    } else {
      addItem(product);
    }
  };


  const discount = Math.round(((product.original_price - product.selling_price) / product.original_price) * 100);
  const isSoldOut = product.stock <= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={!isSoldOut ? { y: -4 } : {}}
      viewport={{ once: true }}
      className={`group bg-white transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] overflow-hidden border border-black/[0.03] ${isSoldOut ? "opacity-75" : ""}`}
    >
      <div className="relative overflow-hidden">
        <Link href={`/product/${product.id}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#F8F8F5]">
            {/* Primary Image */}
            <Image
              src={product.colors?.[0]?.images?.[0] || "/images/placeholder.jpg"}
              alt={product.name}
              fill
              className={`object-cover transition-opacity duration-700 ease-in-out ${!isSoldOut ? "group-hover:opacity-0" : ""}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            
            {/* Hover Image */}
            {product.colors?.[0]?.images?.[1] && !isSoldOut && (
              <Image
                src={product.colors[0].images[1]}
                alt={`${product.name} alternate view`}
                fill
                className="object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            )}
            
            {/* Heritage Badge */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              <span className="text-[8px] uppercase tracking-[0.2em] font-bold bg-white/90 backdrop-blur-md text-black px-3 py-1.5 shadow-sm w-fit">
                Jaipur Heritage
              </span>
              {isSoldOut ? (
                <span className="text-[8px] uppercase tracking-[0.2em] font-black bg-red-600 text-white px-3 py-1.5 shadow-sm w-fit">
                  Sold Out
                </span>
              ) : product.stock < 4 ? (
                <span className="text-[8px] uppercase tracking-[0.2em] font-black bg-orange-500 text-white px-3 py-1.5 shadow-sm w-fit animate-pulse">
                  Only {product.stock} Left!
                </span>
              ) : null}
            </div>
          </div>

          <div className="p-3 md:p-5 flex flex-col gap-2 md:gap-3">
            <div className="flex flex-col gap-0.5 md:gap-1">
              <span className="text-[7px] md:text-[8px] uppercase tracking-[0.3em] font-black text-accent-dark/60">{product.category}</span>
              <h3 className="text-xs md:text-base font-serif italic tracking-tight text-foreground line-clamp-1">
                {product.name}
              </h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-xs md:text-sm font-black text-black">
                  ₹{product.selling_price.toLocaleString()}
                </span>
                <span className="text-[9px] md:text-[10px] text-black/20 line-through">
                  ₹{product.original_price.toLocaleString()}
                </span>
              </div>
              <span className="text-[7px] md:text-[8px] font-black text-emerald-600 bg-emerald-50 px-1.5 md:px-2 py-0.5 tracking-tighter uppercase">
                {discount}% Off
              </span>
            </div>
          </div>
        </Link>

        {/* Action Button */}
        <div className="px-3 md:px-5 pb-4 md:pb-6">
          <motion.button 
            whileTap={!isSoldOut ? { scale: 0.98 } : {}}
            onClick={!isSoldOut ? handleAddToCart : undefined}
            disabled={isSoldOut}
            className={`w-full py-3 md:py-4 text-[8px] md:text-[9px] tracking-[0.2em] md:tracking-[0.3em] font-black uppercase transition-all flex items-center justify-center gap-2 group/btn rounded-full md:rounded-none ${
              isSoldOut 
                ? "bg-black/10 text-black/40 cursor-not-allowed" 
                : "bg-black text-white hover:bg-accent-dark"
            }`}
          >
            {isSoldOut ? (
              "Sold Out"
            ) : (
              <>
                <ShoppingBag size={12} strokeWidth={2} className="group-hover/btn:scale-110 transition-transform hidden sm:block" />
                <span className="truncate">Add to Bag</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
