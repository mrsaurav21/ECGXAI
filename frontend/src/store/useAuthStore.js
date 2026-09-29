import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
  token: localStorage.getItem('access_token'),

  setAuth: (user, token) => {
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('access_token', token);
    set({ user, token });
  },

  updateUser: (updatedUser) => {
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  logout: () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('access_token');
    set({ user: null, token: null });
  },
}));