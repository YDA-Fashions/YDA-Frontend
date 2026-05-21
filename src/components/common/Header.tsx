"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, ArrowRight, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import CartToast from "../cart/CartToast";
import BrandModal from "./BrandModal";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useUIStore } from "../../store/useUIStore";
import { PRODUCTS } from "../../data/products";
import Image from "next/image";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const cartItemCount = useCartStore((state) => state.getTotalItems());
  const { user, signOut } = useAuthStore();
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const {
    isAccountModalOpen,
    setAccountModalOpen,
    isOrderModalOpen,
    setOrderModalOpen,
    isErrorModalOpen,
    setErrorModalOpen,
    modalData,
  } = useUIStore();

  const announcements = [
    "Free Shipping on Orders Above ₹999",
    "Handcrafted with Traditional Indian Prints",
    "Shop For ₹1000+ & Get 10% OFF",
    "Easy Returns & Hassle-Free Exchange",
  ];

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    const announcementTimer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(announcementTimer);
    };
  }, [announcements.length, lastScrollY]);

  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen, isMobileMenuOpen]);

  // SYNC AUTH WITH CART
  const setUserId = useCartStore((state) => state.setUserId);
  const syncCart = useCartStore((state) => state.syncCart);

  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
      syncCart(user.id);
    } else {
      setUserId(null);
    }
  }, [user, setUserId, syncCart]);

  // Search Logic
  const filteredResults =
    searchQuery.trim() === ""
      ? []
      : PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.type.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 6);

  const navLinks = [
    { name: "Shop", href: "/shop" },
    { name: "Small Totes", href: "/small-tote-bags" },
    { name: "Big Totes", href: "/big-tote-bags" },
    { name: "Cushions", href: "/cushion-covers" },
    { name: "Our Story", href: "/story" },
  ];

  return (
    <>
      <CartToast />

      {/* Global Branded Modals */}
      <BrandModal
        isOpen={isAccountModalOpen}
        onClose={() => {
          if (modalData?.onAction) modalData.onAction();
          setAccountModalOpen(false);
        }}
        type="account"
        title="Welcome to YDA"
        subtitle="Your account has been created successfully"
        buttonText="Continue Shopping"
      />

      <BrandModal
        isOpen={isOrderModalOpen}
        onClose={() => {
          if (modalData?.onAction) modalData.onAction();
          setOrderModalOpen(false);
        }}
        type="order"
        title="Order Confirmed"
        subtitle="Your order has been placed successfully"
        buttonText="Continue Shopping"
        productName={modalData?.productName}
        amount={modalData?.amount}
      />

      <BrandModal
        isOpen={isErrorModalOpen}
        onClose={() => {
          if (modalData?.onAction) modalData.onAction();
          setErrorModalOpen(false);
        }}
        type="error"
        title={modalData?.title || "Encountered an Issue"}
        subtitle={modalData?.subtitle || "Something went wrong. Please try again."}
        buttonText={modalData?.buttonText || "Acknowledged"}
      />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[90]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-full max-w-sm bg-background z-[100] overflow-y-auto"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-12">
                  <Logo variant="horizontal" theme="dark" />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={24} strokeWidth={1.5} />
                  </button>
                </div>

                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="py-4 text-2xl font-serif text-foreground hover:text-muted-foreground transition-colors border-b border-border"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto pt-8 border-t border-border">
                  <div className="flex flex-col gap-4">
                    <Link
                      href="/account"
                      className="flex items-center gap-3 text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User size={18} />
                      <span>Account</span>
                    </Link>
                    <Link
                      href="/cart"
                      className="flex items-center gap-3 text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ShoppingBag size={18} />
                      <span>Cart ({isMounted ? cartItemCount : 0})</span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Drawer */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 right-0 bg-background z-[201] max-h-[80vh] overflow-y-auto"
            >
              <div className="container mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-sans">
                    Search
                  </span>
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="relative mb-8">
                  <input
                    type="text"
                    placeholder="Search products..."
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-foreground py-4 text-2xl md:text-4xl font-serif outline-none placeholder:text-muted-foreground/50"
                  />
                </div>

                {searchQuery.trim() !== "" ? (
                  <div>
                    {filteredResults.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {filteredResults.map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.id}`}
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="group flex flex-col"
                          >
                            <div className="relative aspect-square bg-muted mb-3 overflow-hidden">
                              <Image
                                src={product.colors[0].images[0]}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-sans mb-1">
                              {product.category}
                            </span>
                            <h4 className="text-sm font-sans line-clamp-1">{product.name}</h4>
                            <p className="text-sm font-sans font-semibold mt-1">
                              ₹{product.selling_price}
                            </p>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-12">
                        No products found for &ldquo;{searchQuery}&rdquo;
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-sans mb-4">
                      Popular Searches
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {["Tote Bag", "Cushion", "Floral", "Jungle Print", "Heritage"].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSearchQuery(tag)}
                          className="px-4 py-2 text-sm font-sans border border-border hover:bg-foreground hover:text-background transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Announcement Bar */}
        <div className="bg-foreground text-background py-2 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={announcementIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-[10px] md:text-xs text-center uppercase tracking-[0.2em] font-sans"
            >
              {announcements[announcementIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Main Nav */}
        <div
          className={`bg-background border-b border-border transition-all duration-300 ${
            isScrolled ? "bg-background/95 backdrop-blur-lg" : ""
          }`}
        >
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16 md:h-20">
              {/* Left - Menu Toggle (Mobile) / Nav (Desktop) */}
              <div className="flex items-center gap-8">
                <button
                  className="lg:hidden p-2 -ml-2 text-foreground"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu size={22} strokeWidth={1.5} />
                </button>

                <nav className="hidden lg:flex items-center gap-8">
                  {navLinks.slice(0, 3).map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-xs uppercase tracking-[0.15em] font-sans font-medium text-foreground hover:text-muted-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Center - Logo */}
              <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                <Logo variant="horizontal" theme="dark" />
              </Link>

              {/* Right - Nav (Desktop) / Icons */}
              <div className="flex items-center gap-6 md:gap-8">
                <nav className="hidden lg:flex items-center gap-8">
                  {navLinks.slice(3).map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-xs uppercase tracking-[0.15em] font-sans font-medium text-foreground hover:text-muted-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-foreground hover:text-muted-foreground transition-colors"
                    aria-label="Search"
                  >
                    <Search size={20} strokeWidth={1.5} />
                  </button>

                  <Link
                    href="/account"
                    className="hidden md:flex p-2 text-foreground hover:text-muted-foreground transition-colors"
                    aria-label="Account"
                  >
                    <User size={20} strokeWidth={1.5} />
                  </Link>

                  <Link
                    href="/cart"
                    className="relative p-2 text-foreground hover:text-muted-foreground transition-colors"
                    aria-label="Cart"
                  >
                    <ShoppingBag size={20} strokeWidth={1.5} />
                    {isMounted && cartItemCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-foreground text-background text-[10px] font-sans font-semibold rounded-full flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
