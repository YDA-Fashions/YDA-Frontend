import { supabase } from "../lib/supabase";
import { PRODUCTS } from "../data/products";

/**
 * Seed Utility
 * 
 * Takes the static PRODUCTS array and syncs it to the Supabase 'products' table.
 * It maps the old string ID (e.g. 'YDA-TB-001') to the 'product_code' field,
 * allowing the database to generate a unique UUID for the primary 'id' field.
 */
export const seedProducts = async () => {
  console.log("🚀 Starting product seeding...");

  const productsToInsert = PRODUCTS.map((p) => ({
    product_code: p.id, // Current ID becomes the code
    name: p.name,
    selling_price: p.selling_price,
    original_price: p.original_price,
    stock: p.stock,
    category: p.category,
    type: p.type,
    description: p.description,
    colors: p.colors,
    is_featured: p.isFeatured,
    size: p.size,
  }));

  const { data, error } = await supabase
    .from("products")
    .upsert(productsToInsert, { onConflict: "product_code" })
    .select();

  if (error) {
    console.error("❌ Seeding failed:", error.message);
    return { success: false, error };
  }

  console.log("✅ Seeding complete! Inserted/Updated", data?.length, "products.");
  return { success: true, count: data?.length };
};
