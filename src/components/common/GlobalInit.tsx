"use client";

import React, { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useProductStore } from "@/store/useProductStore";

/**
 * GlobalInit
 * 
 * Invisible component mounted in RootLayout to handle:
 * - Supabase auth session hydration
 * - Syncing cart/wishlist stores with the authenticated user
 */
const GlobalInit = () => {
  const { setAuth, setLoading, signOut } = useAuthStore();
  const { setUserId: setCartUserId, syncCart, clearLocalItems: clearCart } = useCartStore();
  const { setUserId: setWishlistUserId, syncWishlist, clearLocalItems: clearWishlist } = useWishlistStore();
  const { fetchProducts } = useProductStore();

  useEffect(() => {
    // 1. Auth & Store Hydration
    fetchProducts();

    // 2. Hydrate the initial session
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (session?.user) {
        setAuth(session.user, session);
        setCartUserId(session.user.id);
        setWishlistUserId(session.user.id);
        syncCart(session.user.id);
        syncWishlist(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
          if (session?.user) {
            setAuth(session.user, session);
            setCartUserId(session.user.id);
            setWishlistUserId(session.user.id);
            syncCart(session.user.id);
            syncWishlist(session.user.id);
          }
        } else if (event === "SIGNED_OUT") {
          signOut();
          setCartUserId(null);
          setWishlistUserId(null);
          clearCart();
          clearWishlist();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuth, setLoading, signOut, setCartUserId, setWishlistUserId]);

  return null; // This component renders nothing
};

export default GlobalInit;
