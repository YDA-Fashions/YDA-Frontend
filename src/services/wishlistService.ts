import { supabase } from "@/lib/supabase";

/**
 * Wishlist Service
 * 
 * Handles syncing the wishlist with Supabase backend.
 */
export const wishlistService = {
  async getWishlist(userId: string): Promise<string[]> {
    console.log("🧡 Wishlist: Skipping backend fetch (Offline Mode)");
    return []; // Return empty database state
  },

  async addItem(userId: string, productId: string) {
    // No-op: Local state is primary
    return;
  },

  async removeItem(userId: string, productId: string) {
    // No-op: Local state is primary
    return;
  },

  async clearWishlist(userId: string) {
    // No-op: Local state is primary
    return;
  },
};
