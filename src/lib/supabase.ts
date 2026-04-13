import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Supabase Client Initialization
 * 
 * Provides access to Supabase Auth, Database, and Storage services.
 * Note: If environment variables are missing (e.g., during build), 
 * a placeholder client is created to avoid fatal errors.
 */
export const supabase: SupabaseClient = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any); 

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === "production") {
    console.warn("⚠️  Supabase environment variables are missing during PRODUCTION build/runtime!");
  } else {
    console.warn("⚠️  Supabase environment variables are missing. Check your .env file.");
  }
}
