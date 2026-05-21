"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "../../data/products";
import { useCartStore } from "../../store/useCartStore";
import { useWishlistStore } from "../../store/useWishlistStore";

interface ProductCardProps {
  product: Product;
  onQuickAdd?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickAdd }) => {
  const addItem = useCartStore((state) => state.addItem);
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickAdd && window.innerWidth < 768) {
      onQuickAdd(product);
    } else {
      addItem(product);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const discount = Math.round(((product.original_price - product.selling_price) / product.original_price) * 100);
  const isSoldOut = product.stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group relative bg-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {/* Primary Image */}
          <Image
            src={product.colors?.[0]?.images?.[0] || "/images/placeholder.jpg"}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-700 ${!isSoldOut && product.colors?.[0]?.images?.[1] ? "group-hover:opacity-0" : ""}`}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          {/* Hover Image */}
          {product.colors?.[0]?.images?.[1] && !isSoldOut && (
            <Image
              src={product.colors[0].images[1]}
              alt={`${product.name} alternate`}
              fill
              className="object-cover opacity-0 transition-all duration-700 group-hover:opacity-100"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {isSoldOut ? (
              <span className="text-[9px] uppercase tracking-[0.15em] font-sans font-semibold bg-foreground text-background px-3 py-1.5">
                Sold Out
              </span>
            ) : product.stock < 4 ? (
              <span className="text-[9px] uppercase tracking-[0.15em] font-sans font-semibold bg-red-600 text-white px-3 py-1.5">
                Only {product.stock} Left
              </span>
            ) : null}
            {discount > 0 && !isSoldOut && (
              <span className="text-[9px] uppercase tracking-[0.1em] font-sans font-semibold bg-background text-foreground px-3 py-1.5 border border-border">
                {discount}% Off
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background border border-border"
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={16}
              className={`transition-colors ${isInWishlist ? "fill-red-500 text-red-500" : "text-foreground"}`}
            />
          </button>

          {/* Quick Add Button */}
          {!isSoldOut && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ duration: 0.2 }}
              onClick={handleAddToCart}
              className="absolute bottom-3 left-3 right-3 z-10 py-3 bg-foreground text-background text-[10px] uppercase tracking-[0.2em] font-sans font-semibold flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors"
            >
              <Plus size={14} />
              <span>Quick Add</span>
            </motion.button>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-sans">
              {product.category}
            </span>
          </div>
          <h3 className="text-sm font-sans font-medium text-foreground line-clamp-1 mb-2 group-hover:text-muted-foreground transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-sans font-semibold text-foreground">
              ₹{product.selling_price.toLocaleString()}
            </span>
            {discount > 0 && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{product.original_price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
