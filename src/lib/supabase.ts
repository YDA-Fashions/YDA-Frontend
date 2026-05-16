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
// Recursive Proxy to handle any level of method chaining (from.select.order.eq...)
const createDummyProxy = (): any => {
  const dummy: any = new Proxy(() => dummy, {
    get: (target, prop) => {
      if (prop === "then") {
        return (resolve: any) => resolve({ data: [], error: null });
      }
      return dummy;
    },
    apply: () => dummy,
  });
  return dummy;
};

export const supabase: SupabaseClient = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'yda-studio-auth'
      }
    })
  : createDummyProxy(); 

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === "production") {
    console.warn("⚠️  Supabase environment variables are missing during PRODUCTION build/runtime!");
  } else {
    console.warn("⚠️  Supabase environment variables are missing. Check your .env file.");
  }
}
