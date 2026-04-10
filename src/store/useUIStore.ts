"use client";

import { create } from "zustand";

interface ModalData {
  productName?: string;
  amount?: number;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

interface UIStore {
  isAccountModalOpen: boolean;
  isOrderModalOpen: boolean;
  isErrorModalOpen: boolean;
  modalData: ModalData | null;
  
  setAccountModalOpen: (isOpen: boolean, data?: ModalData) => void;
  setOrderModalOpen: (isOpen: boolean, data?: ModalData) => void;
  setErrorModalOpen: (isOpen: boolean, data?: ModalData) => void;
  setModalData: (data: ModalData | null) => void;
}

/**
 * UI Store
 * 
 * Manages global UI states like modals, notifications, and transient data.
 */
export const useUIStore = create<UIStore>((set) => ({
  isAccountModalOpen: false,
  isOrderModalOpen: false,
  isErrorModalOpen: false,
  modalData: null,
  
  setAccountModalOpen: (isOpen, data) => set({ isAccountModalOpen: isOpen, ...(data && { modalData: data }) }),
  setOrderModalOpen: (isOpen, data) => set({ isOrderModalOpen: isOpen, ...(data && { modalData: data }) }),
  setErrorModalOpen: (isOpen, data) => set({ isErrorModalOpen: isOpen, ...(data && { modalData: data }) }),
  setModalData: (data) => set({ modalData: data }),
}));
