import { create } from 'zustand';
import { supabase } from '@lib/supabase';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({ 
        user: data.user,
        isAuthenticated: true 
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ 
      user: null, 
      isAuthenticated: false 
    });
  },

  checkAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      set({
        user: session?.user || null,
        isAuthenticated: !!session,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  initialize: () => {
    get().checkAuth();
    supabase.auth.onAuthStateChange((event, session) => {
      set({
        user: session?.user || null,
        isAuthenticated: !!session,
        isLoading: false,
      });
    });
  },
}));