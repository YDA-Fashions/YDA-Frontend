"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award } from "lucide-react";

interface OrderCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    created_at: string;
    total_amount: number;
    order_items?: Array<{
      products?: {
        name?: string;
        colors?: { images?: string[] }[];
      } | null;
    }>;
  };
}

export default function OrderCertificateModal({
  isOpen,
  onClose,
  order,
}: OrderCertificateModalProps) {
  const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const orderRef = order.id.slice(0, 12).toUpperCase();

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="certificate-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            className="relative w-full max-w-lg z-10 rounded-sm overflow-hidden border border-amber-200/60 shadow-[0_24px_80px_rgba(180,140,60,0.25)]"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,252,245,0.95) 0%, rgba(251,249,244,0.88) 50%, rgba(245,235,210,0.9) 100%)",
            }}
          >
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-amber-100/30 via-transparent to-amber-50/40" />
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-black/30 hover:text-black transition-colors z-20"
              aria-label="Close certificate"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            <div className="relative p-8 md:p-12 text-center">
              <p className="text-[9px] uppercase tracking-[0.4em] font-black text-amber-800/70 mb-2">
                Certificate of Authenticity
              </p>
              <h2
                id="certificate-title"
                className="text-2xl md:text-3xl font-serif italic text-black mb-6"
              >
                Collector&apos;s Vault
              </h2>

              <div className="flex flex-col items-center mb-8">
                <div
                  className="relative w-28 h-28 rounded-full flex items-center justify-center border-2 border-amber-400/80 shadow-inner"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, #fff9e6, #e8d4a8 45%, #c9a84c 100%)",
                  }}
                >
                  <Award
                    size={36}
                    className="text-amber-900/80"
                    strokeWidth={1}
                    aria-hidden
                  />
                  <span className="absolute inset-3 rounded-full border border-amber-600/30" />
                </div>
                <p className="mt-4 text-[10px] uppercase tracking-[0.25em] font-black text-amber-900/90 max-w-[200px] leading-relaxed">
                  Authentic Heritage Piece – YDA
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-4 text-left mb-8 font-sans text-sm">
                <div>
                  <dt className="text-[9px] uppercase tracking-widest font-black text-black/40">
                    Order Reference
                  </dt>
                  <dd className="font-semibold mt-1">#{orderRef}</dd>
                </div>
                <div>
                  <dt className="text-[9px] uppercase tracking-widest font-black text-black/40">
                    Date
                  </dt>
                  <dd className="font-semibold mt-1">{orderDate}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-[9px] uppercase tracking-widest font-black text-black/40">
                    Total Curation
                  </dt>
                  <dd className="font-semibold mt-1 text-emerald-900">
                    ₹{order.total_amount.toLocaleString()}
                  </dd>
                </div>
              </dl>

              {order.order_items && order.order_items.length > 0 && (
                <div className="border-t border-amber-200/50 pt-6">
                  <p className="text-[9px] uppercase tracking-widest font-black text-black/40 mb-4">
                    Pieces in this curation
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {order.order_items.map((item, i) => (
                      <div
                        key={i}
                        className="w-14 h-14 relative rounded-sm overflow-hidden bg-white/80 border border-amber-100"
                      >
                        <Image
                          src={
                            item.products?.colors?.[0]?.images?.[0] ||
                            "/images/placeholder.jpg"
                          }
                          alt={item.products?.name || "Product"}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                className="mt-10 w-full bg-black text-white py-4 text-[10px] uppercase tracking-[0.3em] font-black hover:bg-black/90 transition-all"
              >
                Close Certificate
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
