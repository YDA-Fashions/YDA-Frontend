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
        console.log("🚪 Auth: Signing out and clearing session");
        
        // 1. Backend SignOut (with try-catch to prevent freezes)
        try {
          const { supabase } = await import("@/lib/supabase");
          if (supabase) {
            await supabase.auth.signOut();
          }
        } catch (authError) {
          console.error("⚠️ Auth: Backend signOut failed/timed out, continuing local cleanup:", authError);
        }
        
        // 2. Immediate Local State Termination
        try {
          const { useCartStore } = await import("./useCartStore");
          useCartStore.getState().clearLocalItems();
        } catch (cartError) {
          console.error("⚠️ Auth: Clearing cart state failed:", cartError);
        }
        
        set({ user: null, session: null, isLoading: false });

        // 3. Clear storage and force redirect to home to refresh UI completely
        if (typeof window !== "undefined") {
          localStorage.removeItem("yda-auth-storage");
          window.location.href = "/";
        }
      },
    }),
    {
      name: "yda-auth-storage",
      // Do not persist user/session to avoid desync.
      // GlobalInit handles hydration from Supabase.
      partialize: (state) => ({ 
        isLoading: state.isLoading 
      }),
    }
  )
);
