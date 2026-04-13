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
  clearLocalItems: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      userId: null,
      setUserId: (id) => set({ userId: id }),

      syncWishlist: async (userId) => {
        try {
          // 1. Get current guest items
          const localIds = get().items;
          
          // 2. Fetch account items from Supabase
          const remoteIds = await wishlistService.getWishlist(userId);
          
          // 3. Merge Logic: Combine unique IDs
          const combinedSet = new Set([...(remoteIds || []), ...localIds]);
          const finalIds = Array.from(combinedSet);
          
          // 4. Sync new local items to backend
          const newIds = localIds.filter(id => !(remoteIds || []).includes(id));
          newIds.forEach(id => wishlistService.addItem(userId, id).catch(console.error));

          set({ items: finalIds });
          console.log("🧡 Wishlist: Guest selections successfully merged with your account.");
        } catch (error) {
          console.error('Error syncing wishlist:', error);
        }
      },

      clearLocalItems: () => {
        set({ items: [], userId: null });
        console.log("🧹 Wishlist: Local selection cleared for privacy.");
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
