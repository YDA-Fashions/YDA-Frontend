import { create } from "zustand";
import { Product, PRODUCTS } from "../data/products";
import { productService } from "@/services/productService";

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
 * Live Model: Manages the product catalog by fetching directly from Supabase.
 */
export const useProductStore = create<ProductStore>((set) => ({
  products: PRODUCTS, // Keep local data as fallback/initial state
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const liveProducts = await productService.getProducts();
      if (liveProducts && liveProducts.length > 0) {
        set({ products: liveProducts as Product[], error: null });
      }
    } catch (err: any) {
      console.error("❌ Product Store: Fetch failed", err.message);
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
