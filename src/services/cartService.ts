import { supabase } from "@/lib/supabase";

/**
 * Cart Service
 * 
 * Handles syncing the shopping cart with Supabase backend.
 */
export const cartService = {
  async getCart(userId: string) {
    console.log("🛒 Cart: Skipping backend fetch (Offline Mode)");
    return []; // Return empty database state
  },

  async syncItem(userId: string, productId: string, quantity: number) {
    // No-op: Local state is primary
    return;
  },

  async removeItem(userId: string, productId: string) {
    // No-op: Local state is primary
    return;
  },

  async clearCart(userId: string) {
    // No-op: Local state is primary
    return;
  },
};
