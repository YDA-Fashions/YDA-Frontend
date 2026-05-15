import { supabase } from "@/lib/supabase";

export const couponService = {
  async validateCoupon(code: string) {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("active", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") throw new Error("Invalid Artflow Code");
      throw error;
    }

    // Check expiry
    if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
      throw new Error("Artflow Code Expired");
    }

    return data;
  },

  async getAllCoupons() {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createCoupon(couponData: { code: string; discount_percent: number; expiry_date?: string }) {
    const { data, error } = await supabase
      .from("coupons")
      .insert([{
        code: couponData.code.toUpperCase(),
        discount_percent: couponData.discount_percent,
        expiry_date: couponData.expiry_date || null,
        active: true
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCoupon(id: string) {
    const { error } = await supabase
      .from("coupons")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
};
