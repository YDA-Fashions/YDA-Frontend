"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";

const WHATSAPP_NUMBER = "917877646756";
const SITE_BASE = "https://ydafashions.com";

interface GiftButtonProps {
  product: { id: string; name: string };
  className?: string;
}

function buildGiftMessage(product: { id: string; name: string }) {
  const link = `${SITE_BASE}/product/${product.id}`;
  return `Hello! I'd love to gift you the *${product.name}* from my YDA collection. Here's the link: ${link}`;
}

export default function GiftButton({ product, className = "" }: GiftButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleGift = async () => {
    const message = buildGiftMessage(product);
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
    const link = `${SITE_BASE}/product/${product.id}`;

    const isMobile =
      typeof window !== "undefined" &&
      /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      window.open(waUrl, "_blank", "noopener,noreferrer");
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleGift}
      className={`inline-flex items-center gap-2 border border-amber-400/70 text-amber-900 bg-amber-50/50 hover:bg-amber-100/80 px-4 py-2 text-[9px] uppercase tracking-[0.2em] font-black transition-colors ${className}`}
      aria-label={`Gift ${product.name} via WhatsApp or copy link`}
    >
      <Gift size={12} strokeWidth={2} aria-hidden />
      {copied ? "Link Copied" : "Gift This Piece"}
    </motion.button>
  );
}
