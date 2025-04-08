import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { Platform } from 'react-native';

type User = {
  token: string;
  userData: any;
} | null;

type AuthContextType = {
  user: User;
  login: (token: string, userData: any) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

// This hook can be used to access the user info
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// This hook will protect the route access based on user authentication
function useProtectedRoute(user: User) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const isLoginScreen = segments[0] === undefined || segments[0] === '';

    console.log(`[${Platform.OS}] Auth State:`, {
      user: !!user,
      segments,
      inAuthGroup,
      isLoginScreen
    });

    if (!user && !isLoginScreen) {
      console.log(`[${Platform.OS}] Redirecting to login`);
      router.replace('/');
    } else if (user && isLoginScreen) {
      console.log(`[${Platform.OS}] Redirecting to checkin`);
      router.replace('/checkin');
    }
  }, [user, segments]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  
  useProtectedRoute(user);

  const login = (token: string, userData: any) => {
    console.log(`[${Platform.OS}] Login called with:`, { token, userData });
    setUser({ token, userData });
  };

  const logout = () => {
    console.log(`[${Platform.OS}] Logout called`);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
} 