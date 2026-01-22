import { create } from 'zustand';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  login: (token: string, user: AuthState['user']) => void;
  logout: () => void;
}

const safeGet = (key: string) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage.getItem(key);
  } catch (e) {
    return null;
  }
};

const safeSet = (key: string, value: string) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(key, value);
  } catch (e) {
    // ignore
  }
};

const safeRemove = (key: string) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(key);
  } catch (e) {
    // ignore
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  token: safeGet('token'),
  isAuthenticated: !!safeGet('token'),
  user: JSON.parse(safeGet('user') || 'null'),
  login: (token, user) => {
    safeSet('token', token);
    safeSet('user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    safeRemove('token');
    safeRemove('user');
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
