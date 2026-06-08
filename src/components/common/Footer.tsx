"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

const FooterAccordion = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#E8E2D6]/50 md:border-none">
      <button
        className="w-full flex items-center justify-between py-4 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-xs uppercase tracking-[0.35em] font-sans font-semibold text-[#8B7D6B]">{title}</h3>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={14} className="text-[#8B7D6B]" />
        </motion.div>
      </button>

      <h3 className="hidden md:block text-xs uppercase tracking-[0.35em] font-sans font-semibold text-[#8B7D6B] mb-10">{title}</h3>

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
    { name: "Journal", href: "/blog" },
    { name: "Our Story", href: "/story" },
    { name: "Craftsmanship", href: "/story#craft" },
    { name: "Sanganeri & Gujarati Prints", href: "/sanganeri-gujarati-prints" },
    { name: "Contact Us", href: "/contact" },
  ];

  const policyLinks = [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Shipping", href: "/shipping" },
    { name: "Returns", href: "/returns" },
  ];

  return (
    <footer className="relative bg-[#F9F6F0] border-t border-[#E8E2D6] pt-16 md:pt-28 pb-12 md:pb-16 font-sans">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/35 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-0 md:gap-12 mb-14 md:mb-24">
          {/* Brand Identity */}
          <div className="flex flex-col gap-6 lg:col-span-4 pb-10 md:pb-0 border-b border-[#E8E2D6]/50 md:border-none">
            <Logo variant="horizontal" theme="dark" />
            <p className="text-sm font-serif italic text-black/75 leading-relaxed max-w-[280px]">
              Premium Indian prints, lovingly handcrafted in Jaipur.
            </p>
            <p className="text-xs leading-relaxed text-[#8B7D6B] max-w-[260px] uppercase tracking-[0.22em] font-sans font-medium">
              Sanganeri & Gujarati heritage · Artisan finishing · Modern luxury
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="https://www.instagram.com/ydafashions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-black/65 hover:text-black border border-[#E8E2D6] px-4 py-2 bg-white/50 transition-colors"
                aria-label="YDA on Instagram"
              >
                Instagram
              </a>
              <a
                href="https://wa.me/917877646756"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-black/65 hover:text-black border border-[#E8E2D6] px-4 py-2 bg-white/50 transition-colors"
                aria-label="Contact on WhatsApp"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 md:pt-0 pt-2">
            <FooterAccordion title="Collective">
              <ul className="flex flex-col gap-3.5">
                {shopLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-xs uppercase tracking-[0.18em] text-black/75 hover:text-black transition-colors font-sans font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterAccordion>
          </div>

          <div className="lg:col-span-2">
            <FooterAccordion title="Studio">
              <ul className="flex flex-col gap-3.5">
                {brandLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-xs uppercase tracking-[0.18em] text-black/75 hover:text-black transition-colors font-sans font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterAccordion>
          </div>

          <div className="lg:col-span-4">
            <FooterAccordion title="L'Atelier">
              <div className="flex flex-col gap-5">
                <p className="text-xs leading-relaxed text-black/70 font-sans max-w-sm">
                  Join our circle for new arrivals, studio stories, and exclusive offers.
                </p>
                <form className="relative border-b border-[#8B7D6B]/40 py-3 group max-w-sm">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full bg-transparent text-xs tracking-[0.12em] font-sans font-medium text-black placeholder:text-black/25 focus:outline-none pr-24"
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-xs tracking-[0.2em] font-sans font-semibold text-[#8B7D6B] hover:text-black transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </FooterAccordion>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="border-t border-[#E8E2D6]/70 pt-10 flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-8">
          <p className="text-xs uppercase tracking-[0.32em] text-[#8B7D6B] font-sans font-medium order-2 lg:order-1">
            &copy; {new Date().getFullYear()} YDA Fashion Studio
          </p>
          <div className="flex gap-5 md:gap-8 flex-wrap justify-center order-1 lg:order-2">
            {policyLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs uppercase tracking-[0.28em] text-black/65 hover:text-black transition-colors font-sans font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#8B7D6B] font-sans font-medium hidden lg:block order-3 text-right">
            Handcrafted in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
