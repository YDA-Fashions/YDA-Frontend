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

      syncCart: async (userId) => {
        try {
          // 1. Get current guest items
          const localItems = get().items;
          
          // 2. Fetch account items from Supabase
          const remoteRows = await cartService.getCart(userId);
          
          const { useProductStore } = (require("@/store/useProductStore"));
          const allProducts = useProductStore.getState().products;
          
          const remoteItems: CartItem[] = (remoteRows || []).map((row: any) => {
            const product = allProducts.find((p: any) => p.id === row.product_id);
            return product ? { ...product, quantity: row.quantity } : null;
          }).filter(Boolean) as CartItem[];

          // 3. Merge Logic: Account items take precedence, Guest items are added if new
          const mergedMap = new Map<string, CartItem>();
          
          // Add remote items first
          remoteItems.forEach(item => mergedMap.set(item.id, item));
          
          // Merge local items
          localItems.forEach(item => {
            if (mergedMap.has(item.id)) {
              // Item exists in both: usually we take the higher quantity or combine
              // Let's combine for the best guest experience
              const existing = mergedMap.get(item.id)!;
              existing.quantity += item.quantity;
            } else {
              // New guest item: add it and mark for backend sync
              mergedMap.set(item.id, item);
              cartService.syncItem(userId, item.id, item.quantity).catch(console.error);
            }
          });

          const finalItems = Array.from(mergedMap.values());
          set({ items: finalItems });
          console.log("☁️ Cart: Guest selections successfully merged with your account.");
        } catch (error) {
          console.error('Error syncing cart:', error);
        }
      },

      clearLocalItems: () => {
        set({ items: [], userId: null });
        console.log("🧹 Cart: Local selection cleared for privacy.");
      },

      addItem: (product) => {
        const { userId } = get();
        
        console.log("🛒 Preparing to add item to cart:", product.name);

        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex((item) => item.id === product.id);

        let newItem: CartItem;

        if (existingItemIndex > -1) {
          const updatedItems = [...currentItems];
          updatedItems[existingItemIndex].quantity += 1;
          newItem = updatedItems[existingItemIndex];
          set({ items: updatedItems });
          console.log("➕ Incremented quantity for existing item:", product.name);
        } else {
          newItem = { ...product, quantity: 1 };
          set({ items: [...currentItems, newItem] });
          console.log("🆕 Added new item to cart selection:", product.name);
        }

        // Trigger Toast
        set({ 
          lastAddedItem: newItem,
          isCartToastOpen: true 
        });

        // Sync with backend if logged in
        if (userId) {
          cartService.syncItem(userId, product.id, newItem.quantity)
            .then(() => console.log("☁️ Cart synced to backend for:", product.name))
            .catch(err => console.error("❌ Failed to sync cart to backend:", err));
        }

        // Auto-close toast after 3 seconds
        setTimeout(() => {
          set({ isCartToastOpen: false });
        }, 3000);
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
        const { userId } = get();
        if (userId) {
          cartService.removeItem(userId, productId).catch(console.error);
        }
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        const updatedItems = get().items.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        );
        set({ items: updatedItems });
      },

      clearCart: () => {
        set({ items: [] });
        const { userId } = get();
        if (userId) {
          cartService.clearCart(userId).catch(console.error);
        }
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.selling_price * item.quantity, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);
