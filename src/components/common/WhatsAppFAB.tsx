"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsAppFAB() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  // Hide on product pages to avoid redundancy with the "Speak to a Stylist" button
  const isProductPage = pathname?.startsWith("/product/");

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling down 200px
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isProductPage) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          href="https://wa.me/917877646756?text=Hello%20YDA!%20I%20have%20an%20inquiry."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-black text-white dark:bg-white dark:text-black rounded-full shadow-2xl hover:scale-110 transition-transform group"
          aria-label="Contact us on WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          
          {/* Tooltip */}
          <span className="absolute right-full mr-4 bg-black text-white dark:bg-white dark:text-black text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block shadow-xl">
            Client Care
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
