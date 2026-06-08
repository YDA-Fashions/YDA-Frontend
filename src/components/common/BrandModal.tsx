"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, UserCheck, X } from "lucide-react";

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "account" | "order" | "error";
  title: string;
  subtitle: string;
  buttonText: string;
  productName?: string;
  amount?: number;
}

/**
 * BrandModal
 * 
 * A premium branded modal used for account creation confirmations,
 * order success notifications, and error messages.
 */
const BrandModal: React.FC<BrandModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  subtitle,
  buttonText,
  productName,
  amount,
}) => {
  const icons = {
    account: <UserCheck size={40} strokeWidth={1} className="text-emerald-500" />,
    order: <CheckCircle size={40} strokeWidth={1} className="text-emerald-500" />,
    error: <AlertCircle size={40} strokeWidth={1} className="text-red-500" />,
  };

  // Handle Escape key close
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[300] flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="brand-modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-md p-12 text-center shadow-2xl z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-black/20 hover:text-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              aria-label="Close modal"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            <div className="flex justify-center mb-8">{icons[type]}</div>
            <h2 id="brand-modal-title" className="text-2xl md:text-3xl font-serif italic mb-4">{title}</h2>
            <p className="text-sm text-black/70 leading-relaxed mb-2">{subtitle}</p>

            {productName && (
              <p className="text-xs uppercase tracking-widest font-black text-black/60 mt-4">
                {productName}
              </p>
            )}
            {amount !== undefined && (
              <p className="text-lg font-black mt-2">₹{amount.toLocaleString()}</p>
            )}

            <button
              onClick={onClose}
              className="mt-10 w-full bg-black text-white py-4 text-[11px] uppercase tracking-wider font-black hover:bg-black/90 transition-all"
            >
              {buttonText}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BrandModal;
