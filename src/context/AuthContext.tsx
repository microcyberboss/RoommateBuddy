import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import * as api from '../api/api';
import { User, AuthResponse } from '../api/types';
import { getToken, saveToken, removeToken, getUser, saveUser, removeUser } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, phone: string | null, password: string, type?: 'admin' | 'user') => Promise<{ token: string } | undefined>;
  logout: () => Promise<void>;
  setUserAndToken: (user: User, token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => undefined,
  logout: async () => {},
  setUserAndToken: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for token on app load
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedToken = await getToken();
        
        if (savedToken) {
          const savedUser = await getUser();
          if (savedUser) {
            setUser(savedUser);
            setToken(savedToken);
          } else {
            // If we have a token but no user, clear everything for consistency
            await removeToken();
          }
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response: AuthResponse = await api.login(email, password);
      
      await saveToken(response.token);
      await saveUser(response.user);
      
      setToken(response.token);
      setUser(response.user);
      
      router.replace('/(tabs)/home');
    } catch (error) {
      throw error;
    }
  };

  const signup = async (
    name: string, 
    email: string, 
    phone: string | null,
    password: string,
    type: 'admin' | 'user' = 'user'
  ) => {
    try {
      const response = await api.signup(name, email, phone, password, type);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local storage regardless of API success
      await removeToken();
      await removeUser();
      
      setToken(null);
      setUser(null);
      
      router.replace('/login');
    }
  };

  const setUserAndToken = async (newUser: User, newToken: string) => {
    await saveToken(newToken);
    await saveUser(newUser);
    
    setToken(newToken);
    setUser(newUser);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    signup,
    logout,
    setUserAndToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
