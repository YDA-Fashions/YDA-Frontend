import { create } from "zustand";
import { Product, PRODUCTS } from "../data/products";

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Product Store
 * 
 * Reverted to Static Model: Manages the product catalog using local data.
 * No Supabase dependency for listing products.
 */
export const useProductStore = create<ProductStore>((set) => ({
  products: PRODUCTS, // Initial state set to static data
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    // No-op: Data is static and local. 
    // Kept as a fulfilled promise to avoid breaking GlobalInit callers.
    set({ products: PRODUCTS, isLoading: false, error: null });
  },

  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
