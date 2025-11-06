// src/stores/uiStore.js - Fixed version
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
  persist(
    (set, get) => ({
      theme: 'dark',
      sidebarOpen: true,
      activeModal: null,
      modalProps: null,
      isLoading: false,
      toasts: [],

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'dark' ? 'light' : 'dark' 
      })),

      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      openModal: (modal, props = null) => set({ 
        activeModal: modal, 
        modalProps: props 
      }),
      closeModal: () => set({ 
        activeModal: null, 
        modalProps: null 
      }),

      setLoading: (isLoading) => set({ isLoading }),

      addToast: (toast) => set((state) => ({
        toasts: [...state.toasts, { id: Date.now(), ...toast }]
      })),
      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter(toast => toast.id !== id)
      })),
    }),
    {
      name: 'ui-storage',
    }
  )
);