import { supabase } from "@/lib/supabase";

export const addressService = {
  async getAddresses(userId: string) {
    const { data, error } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async saveAddress(userId: string, addressData: any) {
    const { error } = await supabase
      .from("user_addresses")
      .upsert({
        user_id: userId,
        name: addressData.name || "Home",
        full_name: addressData.full_name,
        phone: addressData.phone,
        street_address: addressData.street_address,
        city: addressData.city,
        state: addressData.state,
        pincode: addressData.pincode,
        is_default: addressData.is_default || false
      });

    if (error) throw error;
  },

  async deleteAddress(userId: string, addressId: string) {
    const { error } = await supabase
      .from("user_addresses")
      .delete()
      .match({ user_id: userId, id: addressId });

    if (error) throw error;
  }
};
