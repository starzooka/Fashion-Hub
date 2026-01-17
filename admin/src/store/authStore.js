import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (userData, token) => {
        localStorage.setItem('adminToken', token);
        set({ user: userData, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('adminToken');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'admin-auth-storage',
    }
  )
);

export default useAuthStore;
