import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase environment variables are missing!");
}

/**
 * Supabase Client Initialization
 * 
 * Provides access to Supabase Auth, Database, and Storage services.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
