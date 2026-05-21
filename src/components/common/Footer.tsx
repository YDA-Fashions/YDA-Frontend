"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

// Custom SVG icons for social media (not available in lucide-react)
const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const YoutubeIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <path d="m10 15 5-3-5-3z"/>
  </svg>
);
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
                <InstagramIcon size={18} />
              </a>
              <a
                href="https://facebook.com/ydafashions"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon size={18} />
              </a>
              <a
                href="https://youtube.com/@ydafashions"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="YouTube"
              >
                <YoutubeIcon size={18} />
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
