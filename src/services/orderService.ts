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
    amount: number;
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    payment_method: string;
    payment_status: string;
  }) {
    // 1. Create the main Order record
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([{
        user_id: orderData.user_id,
        total_amount: orderData.amount,
        shipping_address: orderData.customer_address,
        payment_method: orderData.payment_method,
        status: orderData.payment_status === "paid" ? "paid" : "pending",
        // We'll store the name/phone in metadata or a profiles table if needed
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Insert items into order_items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.selling_price
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return order;
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
