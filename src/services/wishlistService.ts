import { supabase } from "@/lib/supabase";

/**
 * Wishlist Service
 * 
 * Handles syncing the wishlist with Supabase backend.
 */
export const wishlistService = {
  async getWishlist(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from("wishlist_items")
      .select("product_id")
      .eq("user_id", userId);

    if (error) throw error;
    return (data || []).map((item: any) => item.product_id);
  },

  async addItem(userId: string, productId: string) {
    const { error } = await supabase
      .from("wishlist_items")
      .upsert(
        { user_id: userId, product_id: productId },
        { onConflict: "user_id,product_id" }
      );

    if (error) throw error;
  },

  async removeItem(userId: string, productId: string) {
    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) throw error;
  },

  async clearWishlist(userId: string) {
    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;
  },
};
