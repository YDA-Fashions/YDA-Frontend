"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import CartToast from "../cart/CartToast";
import BrandModal from "./BrandModal";
import HoverImageLink from "./HoverImageLink";
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
    modalData 
  } = useUIStore();

  const announcements = [
    "Shop For ₹1000+ & Get 10% OFF ✨",
    "Free Shipping on Orders Above ₹999",
    "Handcrafted with Traditional Indian Prints",
    "Premium Quality Fabric & Finishing",
    "Easy Returns & Hassle-Free Exchange"
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
    }, 3000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(announcementTimer);
    };
  }, [announcements.length, lastScrollY]);

  useEffect(() => {
    return () => { document.body.style.overflow = "unset"; };
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
  const filteredResults = searchQuery.trim() === "" 
    ? [] 
    : PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8);

  const navLinks = [
    { name: "Big Totes", href: "/big-tote-bags", previewImage: "/images/home-page-image/big-tote.jpg" },
    { name: "Small Totes", href: "/small-tote-bags", previewImage: "/images/home-page-image/small-tote.jpg" },
    { name: "New Arrivals", href: "/new-arrivals", previewImage: "/images/home-page-image/gujarati-print-1.jpg" },
    { name: "Cushion Covers", href: "/cushion-covers", previewImage: "/images/home-page-image/cushion-1.jpg" },
    { name: "Our Story", href: "/story", previewImage: "/images/home-page-image/sanganeri-print-1.jpg.png" },
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
        buttonText="Continue Selection"
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

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 w-full h-full bg-white z-[100] md:hidden"
          >
            <div className="p-8 flex flex-col h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-12">
                <div className="scale-75 origin-left">
                  <Logo variant="horizontal" />
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-black/40 hover:text-black transition-colors"
                >
                  <X size={28} strokeWidth={1} />
                </button>
              </div>
              <nav className="flex flex-col gap-6 mt-4">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-black/20 mb-2">Collections</p>
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className="text-2xl font-serif tracking-tight text-black hover:italic transition-all border-b border-black/5 pb-4 last:border-0"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-12 border-t border-black/5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-full bg-[#F5F5F0] flex items-center justify-center font-serif italic text-lg shadow-inner">Y</div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black">YDA Studio</p>
                    <p className="text-[10px] text-black/40 uppercase tracking-widest">Handcrafted Heritage</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Side Drawer */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
            />

            {/* Side Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className="fixed right-0 top-0 bottom-0 z-[201] w-full max-w-md bg-[#FDFBF7] h-full flex flex-col p-6 md:p-8 shadow-2xl border-l border-[#EBE3D5] overflow-y-auto"
            >
              {/* Header inside Drawer */}
              <div className="flex justify-between items-center pb-6 border-b border-black/5">
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-black/40">Search Curation</span>
                <button 
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="p-1.5 text-black/50 hover:text-black hover:rotate-90 transition-transform duration-300"
                  aria-label="Close Search"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Input Row */}
              <div className="mt-8 relative">
                <input 
                  type="text" 
                  placeholder="Search products, prints..."
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b border-black/10 py-4 text-lg font-serif italic outline-none placeholder:text-black/20 focus:border-black transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-widest font-black text-black/30 hover:text-black"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Content Area */}
              <div className="flex-1 mt-8 overflow-y-auto custom-scrollbar-hide pb-6">
                {searchQuery.trim() !== "" ? (
                  /* Search Results */
                  <div>
                    {filteredResults.length > 0 ? (
                      <div className="space-y-6">
                        <p className="text-[9px] uppercase tracking-widest font-black text-black/30">
                          Found {filteredResults.length} Creations
                        </p>
                        <div className="space-y-4">
                          {filteredResults.map((product) => (
                            <Link 
                              key={product.id}
                              href={`/product/${product.id}`}
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery("");
                              }}
                              className="flex items-center gap-4 group p-2 hover:bg-black/[0.02] rounded-sm transition-colors"
                            >
                              <div className="relative w-14 h-14 bg-[#F5F5F0] rounded-sm overflow-hidden flex-shrink-0">
                                <Image 
                                  src={product.colors[0].images[0]} 
                                  alt={product.name}
                                  fill
                                  className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                              <div className="flex-grow">
                                <p className="text-[7px] uppercase tracking-widest font-black text-black/40 mb-0.5">{product.category}</p>
                                <h4 className="text-xs font-serif italic text-black/80 group-hover:text-black line-clamp-1">{product.name}</h4>
                                <p className="text-[9px] font-sans font-bold text-black mt-0.5">₹{product.selling_price}</p>
                              </div>
                              <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 text-black/50" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <p className="text-sm font-serif italic text-black/40">No matching creations found.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Empty State: Trending & Bestsellers */
                  <div className="space-y-8">
                    {/* Trending Section */}
                    <div>
                      <h4 className="text-[9px] uppercase tracking-widest font-black text-black/40 mb-4">Trending Searches</h4>
                      <div className="flex flex-wrap gap-2">
                        {["Jungle Print", "Tote Bag", "Cushion Covers", "Lime", "Floral Print"].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSearchQuery(tag)}
                            className="text-[9px] uppercase tracking-widest font-black text-black/60 bg-[#F5F4F0] border border-[#EBE3D5]/60 hover:bg-black hover:text-white px-3 py-1.5 rounded-full transition-all duration-200"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Separator */}
                    <div className="h-[1px] bg-black/5" />

                    {/* Bestselling Creations */}
                    <div>
                      <h4 className="text-[9px] uppercase tracking-widest font-black text-black/40 mb-4">Featured Masterpieces</h4>
                      <div className="space-y-4">
                        {PRODUCTS.slice(0, 3).map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.id}`}
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-4 group p-2 hover:bg-black/[0.02] rounded-sm transition-colors"
                          >
                            <div className="relative w-14 h-14 bg-[#F5F5F0] rounded-sm overflow-hidden flex-shrink-0">
                              <Image
                                src={product.colors[0].images[0]}
                                alt={product.name}
                                fill
                                className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="flex-grow">
                              <span className="inline-block text-[6px] font-sans font-black tracking-widest bg-amber-50 text-amber-800 border border-amber-100 uppercase px-1.5 py-0.5 mb-1 rounded-sm">
                                Bestseller
                              </span>
                              <h4 className="text-xs font-serif italic text-black/80 group-hover:text-black line-clamp-1">{product.name}</h4>
                              <p className="text-[9px] font-sans font-bold text-black mt-0.5">₹{product.selling_price}</p>
                            </div>
                            <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 text-black/50" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-white/80 backdrop-blur-xl backdrop-saturate-150 shadow-[0_1px_24px_rgba(0,0,0,0.06)] border-b border-white/40" 
            : "bg-white"
        } ${showHeader ? "translate-y-0" : "-translate-y-full md:translate-y-0"}`}
      >
        {/* Announcement Bar */}
        <div className="bg-[#F5F1E8] py-1.5 h-8 overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={announcementIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-sans font-bold text-black"
            >
              {announcements[announcementIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-2 md:py-4 min-h-[50px] md:min-h-[70px] relative">
            
            {/* LEFT: Menu Toggle (Mobile) / Desktop Logo (when scrolled) */}
            <div className={`flex items-center justify-start gap-4 ${isScrolled ? "flex-1" : "flex-1 lg:max-w-[200px]"}`}>
              <button 
                className="lg:hidden p-2 text-foreground/80 -ml-2"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>

              {isScrolled && (
                <div className="hidden lg:block">
                  <Logo variant="horizontal" theme="dark" className="scale-90 transition-transform duration-0" />
                </div>
              )}
            </div>

            {/* CENTER: Mobile Logo (Always) / Desktop Logo (Initial) / Menu (when scrolled) */}
            <div className="flex flex-col items-center justify-center flex-[2]">
              <div className="lg:hidden">
                <Logo variant="horizontal" theme="dark" className="transition-transform duration-0" />
              </div>
              
              {!isScrolled ? (
                // Desktop Logo at center when at top
                <div className="hidden lg:block">
                  <Logo variant="horizontal" theme="dark" className="scale-110 transition-transform duration-0" />
                </div>
              ) : (
                // Full Menu at center when scrolled
                <nav className="hidden lg:flex items-center gap-6 xl:gap-10">
                  {navLinks.map((link) => (
                    <HoverImageLink
                      key={link.name}
                      href={link.href}
                      label={link.name}
                      image={link.previewImage}
                      className="group relative text-[10px] uppercase tracking-[0.2em] font-sans font-black text-foreground/50 hover:text-black transition-colors whitespace-nowrap"
                    />
                  ))}
                </nav>
              )}
            </div>

            {/* RIGHT: Utility Icons */}
            <div className={`flex items-center justify-end gap-1 md:gap-2 ${isScrolled ? "flex-1" : "flex-1 lg:max-w-[200px]"}`}>
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-foreground/80 hover:text-black transition-colors"
                aria-label="Search"
              >
                <Search size={18} strokeWidth={1.2} />
              </button>
              
              <Link 
                href="/cart"
                className="p-2 text-foreground/80 hover:text-black transition-colors relative" 
                aria-label="Cart"
              >
                <ShoppingBag size={18} strokeWidth={1.2} />
                {isMounted && cartItemCount > 0 && (
                  <span className="absolute top-1 right-0 bg-[#FFD700] text-black text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-black shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <div className="relative">
                <button 
                  onClick={() => user ? setIsAccountOpen(!isAccountOpen) : router.push("/login")}
                  className="p-2 text-foreground/80 hover:text-black transition-colors"
                  aria-label="Account"
                >
                  {user ? (
                    <div className="w-5 h-5 bg-foreground text-background text-[8px] flex items-center justify-center rounded-full font-black uppercase">
                      {user.email?.[0]}
                    </div>
                  ) : (
                    <User size={18} strokeWidth={1.2} />
                  )}
                </button>

                <AnimatePresence>
                  {isAccountOpen && user && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-4 w-64 bg-white border border-border-beige p-6 shadow-xl"
                    >
                      <div className="mb-6 pb-6 border-b border-border-beige">
                        <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">Authenticated as</p>
                        <p className="text-sm font-serif italic truncate">{user.email}</p>
                      </div>
                      <div className="space-y-4">
                        <Link href="/account" className="block text-[10px] uppercase tracking-widest font-black hover:text-accent-dark transition-colors">Account Settings</Link>
                        <Link href="/orders" className="block text-[10px] uppercase tracking-widest font-black hover:text-accent-dark transition-colors">Order History</Link>
                        <button 
                          onClick={() => {
                            signOut();
                            setIsAccountOpen(false);
                          }}
                          className="block w-full text-left text-[10px] uppercase tracking-widest font-black text-red-500 hover:text-red-700 transition-colors pt-4 border-t border-border-beige"
                        >
                          Sign Out From Studio
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
