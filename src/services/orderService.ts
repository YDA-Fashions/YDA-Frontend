import { supabase } from "@/lib/supabase";

/**
 * Order Service
 * 
 * Handles creating and fetching orders from Supabase backend.
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
    const { data, error } = await supabase
      .from("orders")
      .insert([orderData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getOrders(userId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
