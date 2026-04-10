"use client";

import { create } from "zustand";
import { PRODUCTS, Product } from "../data/products";

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Product Store
 * 
 * Manages the product catalog. Initialized with static PRODUCTS data.
 * Can be extended to fetch from Supabase in the future.
 */
export const useProductStore = create<ProductStore>((set) => ({
  products: PRODUCTS,
  isLoading: false,
  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
