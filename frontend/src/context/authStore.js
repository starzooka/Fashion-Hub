import { create } from 'zustand';

const SESSION_EXPIRY_DAYS = 7;

// Check if session is expired
const isSessionExpired = () => {
  const sessionExpiry = localStorage.getItem('sessionExpiry');
  if (!sessionExpiry) return true;
  return Date.now() > parseInt(sessionExpiry);
};

// Initialize auth state from localStorage with expiry check
const initializeAuth = () => {
  if (isSessionExpired()) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('sessionExpiry');
    return { user: null, token: null, isAuthenticated: false };
  }
  return {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
  };
};

const useAuthStore = create((set) => ({
  ...initializeAuth(),

  setUser: (user, token) => {
    const expiryTime = Date.now() + (SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('sessionExpiry', expiryTime.toString());
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('sessionExpiry');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  checkSession: () => {
    if (isSessionExpired()) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('sessionExpiry');
      set({ user: null, token: null, isAuthenticated: false });
      return false;
    }
    return true;
  },
}));

export default useAuthStore;
