import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware'; // [변경]: persist 임포트 추가
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
      { ...initialState }, // [변경]: initialState를 사용하여 한 번에 리셋
      false,
      'auth/logout'
    ),

  // 등록(임시) 액션
  regist: (userData) => 
    set(
      { user: userData },
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