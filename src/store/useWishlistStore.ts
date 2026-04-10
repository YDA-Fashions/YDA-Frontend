import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../data/products";
import { wishlistService } from "@/services/wishlistService";

interface WishlistStore {
  items: string[]; // Store only product IDs to prevent stale data hydration crashes
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getWishlistItems: (allProducts: Product[]) => Product[];
  userId: string | null;
  setUserId: (id: string | null) => void;
  syncWishlist: (userId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      userId: null,
      setUserId: (id) => set({ userId: id }),

      syncWishlist: async (userId) => {
        try {
          const remoteWishlist = await wishlistService.getWishlist(userId);
          set({ items: remoteWishlist });
        } catch (error) {
          console.error('Error syncing wishlist:', error);
        }
      },
      
      addItem: (product: Product) => {
        const { userId } = get();
        
        // Hydration Guard
        const { isLoading } = (require("@/store/useAuthStore").useAuthStore.getState());
        if (isLoading) {
          console.log("⏳ Wishlist: Waiting for authentication portal to hydrate...");
          return;
        }

        if (!userId) {
          console.warn("🔐 Identity Required: User must be signed in to curate their selection.");
          // Instead of hard redirect, let the UI handle the guest state or show login
          return;
        }

        const currentIds = get().items;
        if (!currentIds.includes(product.id)) {
          set({ items: [...currentIds, product.id] });
          console.log("🧡 Added item to wishlist:", product.id, "for user:", userId);
          wishlistService.addItem(userId, product.id)
            .then(() => console.log("☁️ Wishlist synced to backend for:", product.id))
            .catch(err => console.error("❌ Failed to sync wishlist to backend:", err));
        }
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter((id) => id !== productId),
        });
        const { userId } = get();
        if (userId) {
          wishlistService.removeItem(userId, productId).catch(console.error);
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.includes(productId);
      },

      clearWishlist: () => {
        set({ items: [] });
        const { userId } = get();
        if (userId) {
          wishlistService.clearWishlist(userId).catch(console.error);
        }
      },

      getWishlistItems: (allProducts: Product[]) => {
        const ids = get().items;
        return ids
          .map(id => allProducts.find(p => p.id === id))
          .filter((p): p is Product => p !== undefined);
      }
    }),
    {
      name: "yda-wishlist-storage",
    }
  )
);
