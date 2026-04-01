import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { properties } from '../constants/properties.js';

const initialState = {
  user: null,
  isLoggedIn: false,
  token: null,
};

const authStore = (set) => ({
  ...initialState, // 초기값 적용

  // 로그인 액션
  login: (userData, token) => 
    set(
      { user: userData, token: token, isLoggedIn: true },
      false,
      'auth/login'
    ),

  // 로그아웃 액션
  logout: () => 
    set(
      { ...initialState },
      false,
      'auth/logout'
    ),

  // 등록 액션
  regist: (userData, token) => 
    set(
      { user: userData, token: token, isLoggedIn: true},
      false,
      'auth/regist'
    ),
});

export const useAuthStore = create(
  devtools(
    persist(authStore, {
      name: 'auth-storage',
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        token: state.token, 
      }),
    }),
    { name: 'AuthStore', enabled: properties.isDev } // [변경]: properties.isDev 활용
  )
);