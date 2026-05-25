'use client';

import { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Check authentication status on app load
    checkAuth();
  }, [checkAuth]);

  return <SessionContext.Provider value={{}}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
}
