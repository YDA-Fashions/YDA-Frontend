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
  const setCartUserId = useCartStore((state) => state.setUserId);
  const setWishlistUserId = useWishlistStore((state) => state.setUserId);


  useEffect(() => {
    // 1. Auth & Store Hydration

    // 2. Hydrate the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuth(session.user, session);
        setCartUserId(session.user.id);
        setWishlistUserId(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setAuth(session.user, session);
          setCartUserId(session.user.id);
          setWishlistUserId(session.user.id);
        } else {
          signOut();
          setCartUserId(null);
          setWishlistUserId(null);
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
