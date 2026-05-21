"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Instagram, Facebook, Youtube } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

const FooterAccordion = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border md:border-none">
      {/* Mobile: Clickable Header */}
      <button
        className="w-full flex items-center justify-between py-4 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-foreground">
          {title}
        </h4>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-muted-foreground" />
        </motion.div>
      </button>

      {/* Desktop: Always visible title */}
      <h4 className="hidden md:block text-xs uppercase tracking-[0.2em] font-sans font-semibold text-foreground mb-6">
        {title}
      </h4>

      {/* Mobile: Animated dropdown */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
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
    { name: "All Products", href: "/shop" },
    { name: "Small Tote Bags", href: "/small-tote-bags" },
    { name: "Big Tote Bags", href: "/big-tote-bags" },
    { name: "Cushion Covers", href: "/cushion-covers" },
    { name: "New Arrivals", href: "/new-arrivals" },
  ];

  const companyLinks = [
    { name: "Our Story", href: "/story" },
    { name: "Contact Us", href: "/contact" },
    { name: "Sanganeri Prints", href: "/sanganeri-gujarati-prints" },
  ];

  const supportLinks = [
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns & Exchanges", href: "/returns" },
    { name: "Track Order", href: "/orders" },
    { name: "FAQs", href: "/contact" },
  ];

  return (
    <footer className="bg-background border-t border-border">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 mb-8 md:mb-0">
            <Logo variant="horizontal" theme="dark" className="mb-6" />
            <p className="text-sm text-muted-foreground font-sans leading-relaxed max-w-sm mb-8">
              Premium handcrafted bags and home decor featuring authentic Sanganeri and Gujarati prints. 
              Minimal luxury, timeless craftsmanship.
            </p>
            
            {/* Newsletter */}
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-foreground mb-4">
                Join Our Circle
              </h4>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-muted border border-border text-sm font-sans placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-foreground text-background text-xs uppercase tracking-[0.1em] font-sans font-semibold hover:bg-foreground/90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Shop Links */}
          <FooterAccordion title="Shop">
            <ul className="flex flex-col gap-3">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterAccordion>

          {/* Company Links */}
          <FooterAccordion title="Company">
            <ul className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterAccordion>

          {/* Support Links */}
          <FooterAccordion title="Support">
            <ul className="flex flex-col gap-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterAccordion>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-xs text-muted-foreground font-sans text-center md:text-left">
              © {new Date().getFullYear()} YDA Fashion Studio. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/ydafashions"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com/ydafashions"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://youtube.com/@ydafashions"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-xs text-muted-foreground hover:text-foreground font-sans transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-muted-foreground hover:text-foreground font-sans transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
