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
      .select("*, products(*)")
      .eq("user_id", userId);

    if (error) {
      console.error("🛒 Cart: Fetch failed", error.message);
      return [];
    }
    
    // Map database structure to Store structure
    return data.map(item => {
      const product = item.products;
      if (!product) return null;

      return {
        ...product,
        id: product.product_code,
        selling_price: (product.base_price || 0) / 100,
        original_price: product.metadata?.original_price || 0,
        colors: product.metadata?.colors || [
          {
            name: "Default",
            images: product.images || []
          }
        ],
        type: product.metadata?.type || product.category,
        size: product.metadata?.size,
        quantity: item.quantity,
        db_item_id: item.id
      };
    }).filter(Boolean);
  },

  async syncItem(userId: string, productId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeItem(userId, productId);
    }

    const { error } = await supabase
      .from("cart_items")
      .upsert({ 
        user_id: userId, 
        product_code: productId, 
        quantity 
      }, { onConflict: "user_id,product_code" });

    if (error) console.error("🛒 Cart: Sync failed", error.message);
  },

  async removeItem(userId: string, productId: string) {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .match({ user_id: userId, product_code: productId });

    if (error) console.error("🛒 Cart: Removal failed", error.message);
  },

  async clearCart(userId: string) {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId);

    if (error) console.error("🛒 Cart: Clear failed", error.message);
  },
};
