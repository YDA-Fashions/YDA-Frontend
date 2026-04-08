"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../data/products";

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  
  // Toast State
  isCartToastOpen: boolean;
  lastAddedItem: CartItem | null;
  setCartToastOpen: (isOpen: boolean) => void;

  // Order Success Modal State
  isOrderSuccessModalOpen: boolean;
  setOrderSuccessModalOpen: (isOpen: boolean) => void;
  lastOrderDetails: {
    orderId: string;
    totalAmount: number;
  } | null;
  setLastOrderDetails: (details: { orderId: string; totalAmount: number } | null) => void;

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

      isOrderSuccessModalOpen: false,
      setOrderSuccessModalOpen: (isOpen) => set({ isOrderSuccessModalOpen: isOpen }),
      lastOrderDetails: null,
      setLastOrderDetails: (details) => set({ lastOrderDetails: details }),

      addItem: (product) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex((item) => item.id === product.id);

        let newItem: CartItem;

        if (existingItemIndex > -1) {
          const updatedItems = [...currentItems];
          updatedItems[existingItemIndex].quantity += 1;
          newItem = updatedItems[existingItemIndex];
          set({ items: updatedItems });
        } else {
          newItem = { ...product, quantity: 1 };
          set({ items: [...currentItems, newItem] });
        }

        // Trigger Toast
        set({ 
          lastAddedItem: newItem,
          isCartToastOpen: true 
        });

        // Auto-close toast after 4 seconds
        setTimeout(() => {
          set({ isCartToastOpen: false });
        }, 4000);
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        const updatedItems = get().items.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        );
        set({ items: updatedItems });
      },

      clearCart: () => set({ items: [] }),

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
