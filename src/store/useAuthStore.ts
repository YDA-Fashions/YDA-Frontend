"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: any | null;
  session: any | null;
  isLoading: boolean;
  setAuth: (user: any, session: any) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
}

/**
 * Authentication Store
 * 
 * Manages user session state and hydration status.
 * Compatible with Supabase authentication flow.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isLoading: true,
      
      setAuth: (user, session) => {
        console.log("🔐 Auth: Session established for user:", user?.email);
        set({ user, session, isLoading: false });
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      signOut: async () => {
        const { supabase } = await import("@/lib/supabase");
        console.log("🚪 Auth: Signing out and clearing session");
        
        // 1. Backend SignOut
        await supabase?.auth.signOut();
        
        // 2. Immediate Local State Termination
        const { useCartStore } = await import("./useCartStore");
        const { useWishlistStore } = await import("./useWishlistStore");
        
        useCartStore.getState().clearLocalItems();
        useWishlistStore.getState().clearLocalItems();
        
        set({ user: null, session: null, isLoading: false });
      },
    }),
    {
      name: "yda-auth-storage",
      // Only persist user and session info, not the loading transient state
      partialize: (state) => ({ 
        user: state.user, 
        session: state.session 
      }),
    }
  )
);
