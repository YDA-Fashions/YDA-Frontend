"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import CartToast from "../cart/CartToast";
import BrandModal from "./BrandModal";
import { useCartStore } from "../../store/useCartStore";
import { useWishlistStore } from "../../store/useWishlistStore";
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
  const wishlistItemCount = useWishlistStore((state) => state.items.length);
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
    if (isSearchOpen || isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isSearchOpen, isMobileMenuOpen]);

  // Search Logic
  const filteredResults = searchQuery.trim() === "" 
    ? [] 
    : PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8);

  const navLinks = [
    { name: "Big Totes", href: "/big-tote-bags" },
    { name: "Small Totes", href: "/small-tote-bags" },
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Cushion Covers", href: "/cushion-covers" },
    { name: "Sanganeri & Gujarati Prints", href: "/sanganeri-gujarati-prints" },
  ];

  return (
    <>
      <CartToast />
      
      {/* Global Branded Modals */}
      <BrandModal 
        isOpen={isAccountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        type="account"
        title="Welcome to YDA"
        subtitle="Your account has been created successfully"
        buttonText="Continue Selection"
      />

      <BrandModal 
        isOpen={isOrderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        type="order"
        title="Order Confirmed"
        subtitle="Your order has been placed successfully"
        buttonText="Continue Shopping"
        productName={modalData?.productName}
        amount={modalData?.amount}
      />

      <BrandModal 
        isOpen={isErrorModalOpen}
        onClose={() => setErrorModalOpen(false)}
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

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-start pt-20 md:pt-32 px-6"
          >
            <button 
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              className="absolute top-8 right-8 p-2 text-foreground/40 hover:text-black transition-colors"
              aria-label="Close Search"
            >
              <X size={32} strokeWidth={1} />
            </button>
            
            <div className="w-full max-w-2xl">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search by name or category..."
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b border-black/10 py-6 text-xl md:text-3xl font-serif italic outline-none placeholder:text-black/10 focus:border-black transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest font-black text-black/20 hover:text-black"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Search Results */}
              <div className="mt-12 overflow-y-auto max-h-[60vh] custom-scrollbar-hide pb-20">
                {searchQuery.trim() !== "" && (
                  <>
                    {filteredResults.length > 0 ? (
                      <div className="space-y-8">
                        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-black/20 border-b border-black/5 pb-4">
                          Found {filteredResults.length} Results
                        </p>
                        <div className="grid grid-cols-1 gap-6">
                          {filteredResults.map((product) => (
                            <Link 
                              key={product.id}
                              href={`/product/${product.id}`}
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery("");
                              }}
                              className="flex items-center gap-6 group"
                            >
                              <div className="relative w-16 h-16 bg-[#F5F5F0] rounded-sm overflow-hidden flex-shrink-0">
                                <Image 
                                  src={product.colors[0].images[0]} 
                                  alt={product.name}
                                  fill
                                  className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                              <div className="flex-grow">
                                <p className="text-[8px] uppercase tracking-widest font-black text-black/40 mb-1">{product.category}</p>
                                <h4 className="text-sm font-serif italic">{product.name}</h4>
                                <p className="text-[10px] font-black mt-1">₹{product.selling_price}</p>
                              </div>
                              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-20">
                        <p className="text-lg font-serif italic text-black/20">No matching creations found.</p>
                      </div>
                    )}
                  </>
                )}
                
                {searchQuery.trim() === "" && (
                  <div className="text-center py-20 opacity-20">
                    <Search size={48} className="mx-auto mb-6" strokeWidth={1} />
                    <p className="text-[10px] uppercase tracking-[0.5em] font-black">Begin Typing to Search</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"
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
                    <Link 
                      key={link.name} 
                      href={link.href}
                      className="group relative text-[10px] uppercase tracking-[0.2em] font-sans font-black text-foreground/50 hover:text-black transition-colors whitespace-nowrap"
                    >
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-black transition-all group-hover:w-full" />
                    </Link>
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

              <Link href="/wishlist" className="p-2 text-foreground/80 hover:text-black transition-colors relative" aria-label="Wishlist">
                <Heart size={18} strokeWidth={1.2} />
                {isMounted && wishlistItemCount > 0 && (
                  <span className="absolute top-1 right-0 bg-[#FFD700] text-black text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-black">
                    {wishlistItemCount}
                  </span>
                )}
              </Link>
              
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
