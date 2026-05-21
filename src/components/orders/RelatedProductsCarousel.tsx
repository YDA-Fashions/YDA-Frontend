"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { orderService } from "@/services/orderService";
import { useCartStore } from "@/store/useCartStore";
import { Product } from "@/data/products";

interface RelatedProductsCarouselProps {
  order: {
    id: string;
    order_items?: Array<{
      product_id?: string;
      products?: { id?: string; product_code?: string; category?: string } | null;
    }>;
  };
}

export default function RelatedProductsCarousel({ order }: RelatedProductsCarouselProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const related = await orderService.getRelatedProducts(order);
        if (!cancelled) setProducts(related);
      } catch (err) {
        console.error("Failed to load related products:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [order]);

  if (loading || products.length === 0) return null;

  const current = products[index];
  const canPrev = index > 0;
  const canNext = index < products.length - 1;

  return (
    <section
      className="mt-10 pt-8 border-t border-black/5"
      aria-labelledby={`upsell-${order.id}`}
    >
      <h3
        id={`upsell-${order.id}`}
        className="text-[11px] uppercase tracking-[0.3em] font-black text-black/40 mb-6"
      >
        Complete Your Curation
      </h3>

      <div className="relative bg-[#FBF9F4] border border-black/5 p-4 md:p-6 rounded-sm">
        <div className="flex gap-4 md:gap-6 items-center">
          <Link
            href={`/product/${current.id}`}
            className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-white rounded-sm overflow-hidden"
          >
            <Image
              src={current.colors?.[0]?.images?.[0] || "/images/placeholder.jpg"}
              alt={current.name}
              fill
              className="object-contain p-2"
              sizes="96px"
            />
          </Link>

          <div className="flex-grow min-w-0">
            <p className="text-[8px] uppercase tracking-widest font-black text-black/40">
              {current.category}
            </p>
            <Link href={`/product/${current.id}`}>
              <p className="text-sm font-serif italic truncate hover:underline">
                {current.name}
              </p>
            </Link>
            <p className="text-sm font-black mt-1">
              ₹{current.selling_price.toLocaleString()}
            </p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addItem(current)}
              disabled={current.stock <= 0}
              className="mt-3 bg-white hover:bg-black hover:text-white border border-black/20 text-black py-1.5 px-4 text-[8px] uppercase tracking-widest font-black transition-colors rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label={`Add ${current.name} to cart`}
            >
              + Add
            </motion.button>
          </div>

          {products.length > 1 && (
            <div className="flex flex-col gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                disabled={!canPrev}
                className="p-2 border border-black/10 hover:bg-black hover:text-white transition-colors disabled:opacity-30"
                aria-label="Previous recommendation"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => setIndex((i) => Math.min(products.length - 1, i + 1))}
                disabled={!canNext}
                className="p-2 border border-black/10 hover:bg-black hover:text-white transition-colors disabled:opacity-30"
                aria-label="Next recommendation"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {products.length > 1 && (
          <p className="text-[9px] text-black/30 mt-3 text-center font-sans">
            {index + 1} of {products.length}
          </p>
        )}
      </div>
    </section>
  );
}
