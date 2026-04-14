import { supabase } from "@/lib/supabase";

/**
 * Order Service
 * 
 * Handles creating and fetching orders from Supabase backend.
 * Uses a normalized structure (orders + order_items).
 */
export const orderService = {
  async createOrder(orderData: {
    user_id?: string;
    items: any[];
    amount: number; // Expected in Paise (Ruprees * 100)
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    payment_method: string;
    payment_status: string;
  }) {
    // 1. Strict Auth Enforcement
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Identity Required: Log in to finalize your curation.");

    // 2. STRICTOR VALIDATION (No silent fallbacks)
    if (!orderData.amount || isNaN(orderData.amount) || orderData.amount <= 0) {
      console.error("❌ Order Blocked: Invalid total amount", orderData.amount);
      throw new Error("Financial Integrity Error: Invalid order total. Please refresh your cart.");
    }

    if (!orderData.items || orderData.items.length === 0) {
      throw new Error("Selection Empty: Add at least one masterpiece to your selection.");
    }

    // 3. PAYLOAD VERIFICATION (Strict Structure for RPC v4)
    const p_items = orderData.items.map(item => ({
      id: item.id || item.product_code, // Ensure we use the code for DB join
      quantity: Math.max(1, item.quantity || 1)
    }));

    console.log("📦 RPC PAYLOAD (v4):", {
      p_user_id: user.id,
      p_total: orderData.amount,
      p_payment: orderData.payment_method === "COD" ? "COD" : "Razorpay",
      p_address: orderData.customer_address,
      p_items
    });

    // 4. Call the Fortress RPC (updated create_order_v4)
    const { data: orderId, error: rpcError } = await supabase.rpc("create_order_v4", {
      p_user_id: user.id,
      p_total: orderData.amount, 
      p_payment: orderData.payment_method === "COD" ? "COD" : "Razorpay",
      p_address: orderData.customer_address,
      p_name: orderData.customer_name,   // Added
      p_phone: orderData.customer_phone, // Added
      p_items
    });

    if (rpcError) {
      // EXPOSE DETAILED ERROR (Security check, stock, or mismatch)
      console.error("❌ Order RPC Failure:", rpcError.message, rpcError.details, rpcError.hint);
      throw new Error(rpcError.message || "Order Finalization Failed.");
    }

    console.log("✅ Order: Atomic creation successful. ID:", orderId);
    return { id: orderId };
  },

  async getOrders(userId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getAllOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
