import { supabase } from "@/lib/supabase";

/**
 * Wishlist Service
 * 
 * Handles saving and retrieving "masterpieces" to the user's wishlist in Supabase.
 */
export const wishlistService = {
  async getWishlist(userId: string) {
    const { data, error } = await supabase
      .from("wishlist")
      .select("*, products(*)")
      .eq("user_id", userId);

    if (error) {
      console.error("✨ Wishlist: Fetch failed", error.message);
      return [];
    }

    return data.map(item => ({
      ...item.products,
      wishlist_id: item.id
    }));
  },

  async addToWishlist(userId: string, productId: string) {
    const { error } = await supabase
      .from("wishlist")
      .upsert({ 
        user_id: userId, 
        product_id: productId 
      }, { onConflict: "user_id,product_id" });

    if (error) console.error("✨ Wishlist: Add failed", error.message);
  },

  async removeFromWishlist(userId: string, productId: string) {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .match({ user_id: userId, product_id: productId });

    if (error) console.error("✨ Wishlist: Remove failed", error.message);
  }
};
