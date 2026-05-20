"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsAppFAB() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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

  useEffect(() => {
    if (isVisible) {
      // Expand 1.2 seconds after appearing
      const expandTimer = setTimeout(() => {
        setIsExpanded(true);
      }, 1200);

      // Collapse back 5 seconds later
      const collapseTimer = setTimeout(() => {
        setIsExpanded(false);
      }, 6200);

      return () => {
        clearTimeout(expandTimer);
        clearTimeout(collapseTimer);
      };
    } else {
      setIsExpanded(false);
    }
  }, [isVisible]);

  if (isProductPage) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          layout
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          href="https://wa.me/917877646756?text=Hello%20YDA!%20I%20have%20an%20inquiry."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex items-center justify-center bg-black text-white dark:bg-white dark:text-black h-12 w-auto min-w-[48px] md:h-14 md:min-w-[56px] rounded-full shadow-2xl hover:scale-105 transition-transform duration-300 border border-white/10 px-3.5 md:px-4"
          aria-label="Contact us on WhatsApp"
        >
          {/* WhatsApp Icon */}
          <svg 
            viewBox="0 0 24 24" 
            className="w-[20px] h-[20px] md:w-[22px] md:h-[22px] flex-shrink-0"
            stroke="currentColor" 
            strokeWidth="1.5" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>

          {/* Slide-out bold text */}
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0, x: -10 }}
                animate={{ opacity: 1, width: "auto", x: 0 }}
                exit={{ opacity: 0, width: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="ml-2.5 text-[10px] font-sans font-black tracking-widest uppercase whitespace-nowrap overflow-hidden"
              >
                Chat with us
              </motion.span>
            )}
          </AnimatePresence>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
