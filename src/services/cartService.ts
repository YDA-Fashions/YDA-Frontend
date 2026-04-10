import { supabase } from "@/lib/supabase";

/**
 * Cart Service
 * 
 * Handles syncing the shopping cart with Supabase backend.
 */
export const cartService = {
  async getCart(userId: string) {
    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return data || [];
  },

  async syncItem(userId: string, productId: string, quantity: number) {
    const { error } = await supabase
      .from("cart_items")
      .upsert(
        { user_id: userId, product_id: productId, quantity },
        { onConflict: "user_id,product_id" }
      );

    if (error) throw error;
  },

  async removeItem(userId: string, productId: string) {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) throw error;
  },

  async clearCart(userId: string) {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;
  },
};
