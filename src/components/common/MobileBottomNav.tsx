"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User, Grid3X3 } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "../../store/useCartStore";

const MobileBottomNav = () => {
  const pathname = usePathname();
  const cartItemCount = useCartStore((state) => state.getTotalItems());

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/shop", icon: Grid3X3 },
    { name: "Search", href: "#search", icon: Search },
    { name: "Cart", href: "/cart", icon: ShoppingBag, badge: cartItemCount },
    { name: "Account", href: "/account", icon: User },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-border"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <item.icon size={20} strokeWidth={active ? 2 : 1.5} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-foreground text-background text-[9px] font-sans font-semibold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[9px] uppercase tracking-[0.1em] font-sans mt-1">
                {item.name}
              </span>
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-foreground rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
      {/* Safe area padding for iOS */}
      <div className="h-safe-area-inset-bottom bg-background/80" />
    </motion.nav>
  );
};

export default MobileBottomNav;
