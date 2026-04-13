import { supabase } from "./src/lib/supabase";

async function verifyBackend() {
  console.log("🔍 Probing YDA Supabase Backend...");
  
  try {
    const { data: products, error: pError } = await supabase.from('products').select('count', { count: 'exact', head: true });
    if (pError) throw pError;
    console.log("✅ Products Table: Active (Count: " + products?.[0]?.count + ")");

    const { data: cart, error: cError } = await supabase.from('cart_items').select('count', { count: 'exact', head: true });
    if (cError) console.log("⚠️ cart_items table access error:", cError.message);
    else console.log("✅ Cart Items Table: Active");

    const { data: orders, error: oError } = await supabase.from('orders').select('count', { count: 'exact', head: true });
    if (oError) console.log("⚠️ orders table access error:", oError.message);
    else console.log("✅ Orders Table: Active");

    console.log("🚀 Connection Status: WORKING");
  } catch (err) {
    console.error("❌ Backend Connection Failed:", err);
  }
}

verifyBackend();
