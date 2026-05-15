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

    return data.map(item => {
      const product = item.products;
      if (!product) return null;
      return {
        ...product,
        id: product.product_code,
        selling_price: (product.base_price || 0) / 100,
        original_price: product.metadata?.original_price || 0,
        colors: [
          {
            name: "Default",
            images: product.images || []
          }
        ],
        wishlist_id: item.id
      };
    }).filter(Boolean);
  },

  async addToWishlist(userId: string, productId: string) {
    const { error } = await supabase
      .from("wishlist")
      .upsert({ 
        user_id: userId, 
        product_code: productId 
      }, { onConflict: "user_id,product_code" });

    if (error) console.error("✨ Wishlist: Add failed", error.message);
  },

  async removeFromWishlist(userId: string, productId: string) {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .match({ user_id: userId, product_code: productId });

    if (error) console.error("✨ Wishlist: Remove failed", error.message);
  }
};
