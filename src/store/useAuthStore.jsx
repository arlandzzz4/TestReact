import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { properties } from '../constants/properties.js';

const initialState = {
  user: null,
  isLoggedIn: false,
};

const authStore = (set) => ({
  user: null,
  isLoggedIn: false,
  token: null,

  login: (userData, token) => 
    set(
      { user: userData, token: token, isLoggedIn: true },
      false,
      'auth/login' // devtools에 표시될 액션명
    ),

  logout: () => 
    set(
      { user: null, token: null, isLoggedIn: false },
      false,
      'auth/logout'
    ),

  regist: (userData) => 
    set(
      { user: userData },
      false,
      'auth/regist'
    ),
});

export const useAuthStore = create(
  persist(
    properties.isDev
      ? devtools(authStore, { name: 'AuthStore' })
      : authStore,
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        token: state.token, 
      }),
    }
  )
);