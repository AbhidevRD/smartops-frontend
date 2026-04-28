import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Sign up
      signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post(API_ENDPOINTS.AUTH.SIGNUP, {
            email,
            password,
            name,
          });
          const { token, user } = response.data;
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
          }
          return { success: true, data: response.data };
        } catch (error) {
          const message = error.response?.data?.message || 'Signup failed';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      // Verify OTP
      verifyOtp: async (email, otp) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_OTP, {
            email,
            otp,
          });
          const { token, user } = response.data;
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
          }
          return { success: true, data: response.data };
        } catch (error) {
          const message = error.response?.data?.message || 'OTP verification failed';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      // Resend OTP
      resendOtp: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post(API_ENDPOINTS.AUTH.RESEND_OTP, { email });
          set({ isLoading: false });
          return { success: true, data: response.data };
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to resend OTP';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      // Login
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
            email,
            password,
          });
          const { token, user } = response.data;
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
          }
          return { success: true, data: response.data };
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      // Forgot Password
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
          set({ isLoading: false });
          return { success: true, data: response.data };
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to send reset email';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      // Reset Password
      resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
            token,
            password,
          });
          set({ isLoading: false });
          return { success: true, data: response.data };
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to reset password';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      // Logout
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Check if authenticated
      checkAuth: () => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (token) {
            set({ token, isAuthenticated: true });
          }
        }
      },
    }),
    {
      name: 'auth-store',
      storage: typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined,
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
