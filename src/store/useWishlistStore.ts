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
        // Backend sync disabled per current architecture (strictly local)
        set({ userId });
        console.log("🧡 Wishlist: Session linked (Offline Mode).");
      },

      clearLocalItems: () => {
        set({ items: [], userId: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('yda-wishlist-storage');
        }
        console.log("🧹 Wishlist: Session state wiped.");
      },
      
      addItem: (product: Product) => {
        const { userId, items } = get();
        
        // Skip if already in wishlist
        if (items.includes(product.id)) return;

        set({ items: [...items, product.id] });
        console.log("🧡 Wishlist: Added", product.id);

        if (userId) {
          wishlistService.addItem(userId, product.id).catch(err => {
            console.error("❌ Wishlist: Sync addition failed:", err);
          });
        }
      },

      removeItem: (productId: string) => {
        const { userId, items } = get();
        set({
          items: items.filter((id) => id !== productId),
        });
        if (userId) {
          wishlistService.removeItem(userId, productId).catch(console.error);
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.includes(productId);
      },

      clearWishlist: () => {
        const { userId } = get();
        set({ items: [] });
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
