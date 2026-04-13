import { supabase } from "../lib/supabase";
import { PRODUCTS } from "../data/products";

/**
 * Production Seed Utility
 * 
 * Takes the static PRODUCTS array and syncs it to the production 'products' table.
 * Maps traditional Rupees to backend Paise and handles unified metadata.
 */
export const seedProducts = async () => {
  console.log("🚀 Starting production product seeding...");

  const productsToInsert = PRODUCTS.map((p) => ({
    product_code: p.id,
    name: p.name,
    description: p.description,
    base_price: p.selling_price * 100, // Convert ₹ to Paise for production integrity
    stock_quantity: p.stock,
    category: p.category,
    images: p.colors?.[0]?.images || [],
    metadata: { 
      type: p.type,
      original_price: p.original_price,
      size: p.size,
      featured: p.isFeatured
    }
  }));

  const { data, error } = await supabase
    .from("products")
    .upsert(productsToInsert, { onConflict: "product_code" })
    .select();

  if (error) {
    console.error("❌ Seeding failed:", error.message);
    return { success: false, error };
  }

  console.log("✅ Seeding complete! Synchronized", data?.length, "masterpieces.");
  return { success: true, count: data?.length };
};
