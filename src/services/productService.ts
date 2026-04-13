import { supabase } from "@/lib/supabase";
import { Product } from "../data/products";

/**
 * Product Service
 * 
 * Handles CRUD operations and image uploads for the production catalog.
 */
export const productService = {
  async getProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createProduct(productData: any) {
    // Map UI fields to Database fields
    const dbData = {
      name: productData.name,
      product_code: productData.product_code || `YDA-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      description: productData.description,
      base_price: productData.selling_price * 100, // Convert ₹ to Paise
      stock_quantity: productData.stock || 0,
      category: productData.category,
      images: productData.images || [],
      metadata: { 
        type: productData.type,
        original_price: productData.original_price,
        size: productData.size
      }
    };

    const { data, error } = await supabase
      .from("products")
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProduct(id: string, productData: any) {
    const dbData = {
      name: productData.name,
      description: productData.description,
      base_price: productData.selling_price * 100,
      stock_quantity: productData.stock || 0,
      category: productData.category,
      images: productData.images || [],
      metadata: { 
        type: productData.type,
        original_price: productData.original_price,
        size: productData.size
      }
    };

    const { data, error } = await supabase
      .from("products")
      .update(dbData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  /**
   * Upload multiple images to Supabase Storage
   * @param files Array of File objects
   * @returns Array of public URLs
   */
  async uploadImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    });

    return Promise.all(uploadPromises);
  },

  async uploadImage(file: File): Promise<string> {
    const urls = await this.uploadImages([file]);
    return urls[0];
  }
};
