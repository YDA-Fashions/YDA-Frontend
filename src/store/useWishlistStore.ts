import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, PRODUCTS } from "../data/products";

interface WishlistStore {
  items: string[]; // Store only product IDs to prevent stale data hydration crashes
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getWishlistItems: () => Product[];
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product) => {
        const currentIds = get().items;
        if (!currentIds.includes(product.id)) {
          set({ items: [...currentIds, product.id] });
        }
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter((id) => id !== productId),
        });
      },

      isInWishlist: (productId: string) => {
        return get().items.includes(productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      getWishlistItems: () => {
        const ids = get().items;
        // Filter out any IDs that might no longer exist in the PRODUCTS data
        return ids
          .map(id => PRODUCTS.find(p => p.id === id))
          .filter((p): p is Product => p !== undefined);
      }
    }),
    {
      name: "yda-wishlist-storage",
    }
  )
);
