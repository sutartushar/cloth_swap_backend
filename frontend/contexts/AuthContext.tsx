'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

export interface User {
  id: number;
  email: string;
  name: string;
  phone_number: string;
  location: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone_number: string, location: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  // Initialize from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });

      const { token } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
      
      // Decode token to get user info (basic decoding)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      
      setUser({ ...payload, email } as User);
      localStorage.setItem('user', JSON.stringify({ ...payload, email }));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone_number: string,
    location: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/users/register`, {
        name,
        email,
        password,
        phone_number,
        location,
      });

      const { token } = response.data;
      setToken(token);
      localStorage.setItem('token', token);

      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);

      setUser({ ...payload, name, email, phone_number, location } as User);
      localStorage.setItem('user', JSON.stringify({ ...payload, name, email, phone_number, location }));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
