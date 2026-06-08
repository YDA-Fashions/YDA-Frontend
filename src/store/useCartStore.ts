"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../data/products";
import { cartService } from "@/services/cartService";

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  
  // Toast State
  isCartToastOpen: boolean;
  lastAddedItem: CartItem | null;
  setCartToastOpen: (isOpen: boolean) => void;
  setLastOrderDetails: (details: { orderId: string; totalAmount: number } | null) => void;

  userId: string | null;
  setUserId: (id: string | null) => void;
  syncCart: (userId: string) => Promise<void>;
  clearLocalItems: () => void;

  // Timer State
  cartTimerExpiresAt: number | null;
  setCartTimerExpiresAt: (expiresAt: number | null) => void;

  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Selectors
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      isCartToastOpen: false,
      lastAddedItem: null,
      setCartToastOpen: (isOpen) => set({ isCartToastOpen: isOpen }),
      setLastOrderDetails: () => {},

      userId: null,
      setUserId: (id) => set({ userId: id }),

      cartTimerExpiresAt: null,
      setCartTimerExpiresAt: (expiresAt) => set({ cartTimerExpiresAt: expiresAt }),

      syncCart: async (userId) => {
        set({ userId, isLoading: true } as any);
        try {
          const backendItems = await cartService.getCart(userId);
          const localItems = get().items;

          // Never wipe a local cart with an empty/pending backend response
          if (!backendItems || backendItems.length === 0) {
            if (localItems.length > 0) {
              await Promise.all(
                localItems.map((item) =>
                  cartService.syncItem(userId, item.id, item.quantity)
                )
              );
            }
            return;
          }

          const merged = new Map(
            backendItems.map((item) => [item.id, item as CartItem])
          );
          for (const local of localItems) {
            const existing = merged.get(local.id);
            if (!existing) {
              merged.set(local.id, local);
              cartService
                .syncItem(userId, local.id, local.quantity)
                .catch(console.error);
            } else if (local.quantity > existing.quantity) {
              merged.set(local.id, { ...existing, quantity: local.quantity });
              cartService
                .syncItem(userId, local.id, local.quantity)
                .catch(console.error);
            }
          }

          set({ items: Array.from(merged.values()) });
        } catch (err) {
          console.error("🛒 Cart: Sync failed", err);
        } finally {
          set({ isLoading: false } as any);
        }
      },

      clearLocalItems: () => {
        set({ items: [], userId: null, cartTimerExpiresAt: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cart-storage');
        }
      },

      addItem: async (product) => {
        let { userId, items } = get();
        
        // 🛑 AUTH LOCK: No guest additions
        if (!userId) {
          const { supabase } = await import("@/lib/supabase");
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            userId = session.user.id;
            set({ userId });
          } else {
            alert("Identification Required: Please log in to add this masterpiece to your curation.");
            return;
          }
        }

        console.log("🛒 Cart: Adding", product.name);
        const existingIndex = items.findIndex((item) => item.id === product.id);
        let updatedItems = [...items];
        let newQuantity = 1;

        if (existingIndex > -1) {
          updatedItems[existingIndex].quantity += 1;
          newQuantity = updatedItems[existingIndex].quantity;
        } else {
          updatedItems.push({ ...product, quantity: 1 });
        }

        // Set persistent 20-minute countdown if it's the first item added
        let expiresAt = get().cartTimerExpiresAt;
        if (!expiresAt) {
          expiresAt = Date.now() + 20 * 60 * 1000; // 20 minutes from now
        }

        set({ 
          items: updatedItems,
          lastAddedItem: { ...product, quantity: newQuantity },
          isCartToastOpen: true,
          cartTimerExpiresAt: expiresAt
        });

        // Sync to backend
        cartService.syncItem(userId, product.id, newQuantity).catch(console.error);
      },

      removeItem: (productId) => {
        const { userId, items } = get();
        if (!userId) return;

        const updatedItems = items.filter((item) => item.id !== productId);
        set({ 
          items: updatedItems,
          cartTimerExpiresAt: updatedItems.length === 0 ? null : get().cartTimerExpiresAt
        });
        cartService.removeItem(userId, productId).catch(console.error);
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        const { userId, items } = get();
        if (!userId) return;
        
        const updatedItems = items.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        );
        set({ items: updatedItems });
        cartService.syncItem(userId, productId, quantity).catch(console.error);
      },

      clearCart: () => {
        const { userId } = get();
        set({ items: [], cartTimerExpiresAt: null });
        if (userId) {
          cartService.clearCart(userId).catch(console.error);
        }
      },

      getTotalPrice: () => get().items.reduce((t, i) => t + i.selling_price * i.quantity, 0),
      getTotalItems: () => get().items.reduce((t, i) => t + i.quantity, 0),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ 
        items: state.items,
        cartTimerExpiresAt: state.cartTimerExpiresAt
      }),
    }
  )
);
