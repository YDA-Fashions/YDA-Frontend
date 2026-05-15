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
        set({ userId, isLoading: true } as any);
        try {
          const backendItems = await cartService.getCart(userId);
          // ALWAYS take backend data if it exists to ensure cross-device sync
          if (backendItems) {
            set({ items: backendItems });
          }
        } catch (err) {
          console.error("🛒 Cart: Sync failed", err);
        } finally {
          set({ isLoading: false } as any);
        }
      },

      clearLocalItems: () => {
        set({ items: [], userId: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cart-storage');
        }
      },

      addItem: (product) => {
        const { userId, items } = get();
        
        // 🛑 AUTH LOCK: No guest additions
        if (!userId) {
          alert("Identification Required: Please log in to add this masterpiece to your curation.");
          return;
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

        set({ 
          items: updatedItems,
          lastAddedItem: { ...product, quantity: newQuantity },
          isCartToastOpen: true 
        });

        // Sync to backend
        cartService.syncItem(userId, product.id, newQuantity).catch(console.error);

        setTimeout(() => set({ isCartToastOpen: false }), 3000);
      },

      removeItem: (productId) => {
        const { userId, items } = get();
        if (!userId) return;

        set({ items: items.filter((item) => item.id !== productId) });
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
        set({ items: [] });
        if (userId) {
          cartService.clearCart(userId).catch(console.error);
        }
      },

      getTotalPrice: () => get().items.reduce((t, i) => t + i.selling_price * i.quantity, 0),
      getTotalItems: () => get().items.reduce((t, i) => t + i.quantity, 0),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
