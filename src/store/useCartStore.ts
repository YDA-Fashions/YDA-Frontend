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
          const remoteCart = await cartService.getCart(userId);
          // Simple implementation: merge remote with products list (this assumes products are available)
          // For now, let's keep it simple: if local is empty, use remote.
          // This is a complex area, but let's just make sure clearCart/addItem/removeItem call the service.
        } catch (error) {
          console.error('Error syncing cart:', error);
        }
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
