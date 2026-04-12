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
 * Manages the product catalog. 
 * Reverted to static data from local PRODUCTS array.
 */
export const useProductStore = create<ProductStore>((set) => ({
  products: PRODUCTS, // Initialize with static data
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    // No-op since data is static, but kept for compatibility
    set({ isLoading: false, error: null });
  },

  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
