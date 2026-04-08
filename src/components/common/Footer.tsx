"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

const FooterAccordion = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border-beige/40 md:border-none">
      {/* Mobile: Clickable Header */}
      <button
        className="w-full flex items-center justify-between py-4 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-foreground/30">{title}</h4>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={14} className="text-foreground/30" />
        </motion.div>
      </button>

      {/* Desktop: Always visible title */}
      <h4 className="hidden md:block text-[10px] uppercase tracking-[0.4em] font-bold text-foreground/30 mb-10">{title}</h4>

      {/* Mobile: Animated dropdown */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden md:hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop: Always visible content */}
      <div className="hidden md:block">{children}</div>
    </div>
  );
};

const Footer = () => {
  const shopLinks = [
    { name: "Small Tote Bags", href: "/small-tote-bags" },
    { name: "Big Tote Bags", href: "/big-tote-bags" },
    { name: "Cushion Covers", href: "/cushion-covers" },
    { name: "New Arrivals", href: "/new-arrivals" },
  ];

  const brandLinks = [
    { name: "Our Story", href: "/story" },
    { name: "Craftsmanship", href: "/story#craft" },
    { name: "Sanganeri & Gujarati Prints", href: "/sanganeri-gujarati-prints" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <footer className="bg-background border-t border-border-beige/50 pt-16 md:pt-32 pb-16 font-sans">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-16 mb-16 md:mb-32">
          {/* Brand Identity */}
          <div className="flex flex-col gap-8 md:col-span-1 pb-8 md:pb-0 border-b border-border-beige/40 md:border-none">
            <Logo variant="horizontal" theme="dark" />
            <p className="text-[11px] leading-relaxed text-foreground/50 max-w-[240px] uppercase tracking-widest font-bold">
              Premium Indian Prints <br /> 
              Meet Modern Luxury.
            </p>
          </div>

          {/* Collective Links */}
          <FooterAccordion title="Collective">
            <ul className="flex flex-col gap-4">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[11px] uppercase tracking-[0.2em] hover:text-accent-dark transition-colors font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterAccordion>

          {/* Studio Links */}
          <FooterAccordion title="Studio">
            <ul className="flex flex-col gap-4">
              {brandLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[11px] uppercase tracking-[0.2em] hover:text-accent-dark transition-colors font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterAccordion>

          {/* Newsletter */}
          <FooterAccordion title="L'Atelier">
            <div className="flex flex-col gap-6">
              <p className="text-[11px] leading-relaxed text-foreground/50 uppercase tracking-widest font-semibold">
                Join our exclusive circle for latest arrivals and cultural narratives.
              </p>
              <form className="relative border-b border-border-beige py-2 group">
                <input 
                  type="email" 
                  placeholder="EMAIL ADDRESS" 
                  className="w-full bg-transparent text-[9px] tracking-[0.3em] font-bold focus:outline-none placeholder:text-foreground/20"
                />
                <button className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] tracking-[0.2em] font-bold text-accent-dark hover:text-foreground transition-all duration-300">
                  SUBSCRIBE
                </button>
              </form>
            </div>
          </FooterAccordion>
        </div>

        {/* Bottom Metadata */}
        <div className="border-t border-border-beige/30 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] uppercase tracking-[0.4em] text-foreground/30 font-bold">
            &copy; {new Date().getFullYear()} YDA FASHION STUDIO.
          </p>
          <div className="flex gap-12">
            <Link href="/privacy" className="text-[9px] uppercase tracking-[0.4em] text-foreground/30 hover:text-foreground transition-colors font-bold">
              Privacy
            </Link>
            <Link href="/terms" className="text-[9px] uppercase tracking-[0.4em] text-foreground/30 hover:text-foreground transition-colors font-bold">
              Terms
            </Link>
          </div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-foreground/30 font-bold hidden lg:block">
            Sanganeri / Gujarati / Artisan Heritage
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
