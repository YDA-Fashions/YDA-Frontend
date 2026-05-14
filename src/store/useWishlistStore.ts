"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../data/products";
import { wishlistService } from "@/services/wishlistService";

interface WishlistStore {
  items: Product[];
  userId: string | null;
  
  setUserId: (id: string | null) => void;
  syncWishlist: (userId: string) => Promise<void>;
  
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      userId: null,

      setUserId: (id) => set({ userId: id }),

      syncWishlist: async (userId) => {
        set({ userId });
        try {
          const backendItems = await wishlistService.getWishlist(userId);
          if (backendItems.length > 0) {
            set({ items: backendItems });
          } else {
            const { items } = get();
            if (items.length > 0) {
              for (const item of items) {
                await wishlistService.addToWishlist(userId, item.id);
              }
            }
          }
        } catch (err) {
          console.error("✨ Wishlist: Sync failed", err);
        }
      },

      toggleWishlist: (product) => {
        const { items, userId } = get();
        const isExists = items.some(i => i.id === product.id);
        
        let newItems;
        if (isExists) {
          newItems = items.filter(i => i.id !== product.id);
          if (userId) wishlistService.removeFromWishlist(userId, product.id);
        } else {
          newItems = [...items, product];
          if (userId) wishlistService.addToWishlist(userId, product.id);
        }
        
        set({ items: newItems });
      },

      isInWishlist: (productId) => {
        return get().items.some(i => i.id === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "wishlist-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
