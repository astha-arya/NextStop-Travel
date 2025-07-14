"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const normalizeUserData = (userData) => {
    if (!userData) return null;
    
    return {
      // Make sure both camelCase and PascalCase properties are available
      id: userData.User_ID || userData.id || "",
      name: userData.Name || userData.name || "",
      email: userData.Email || userData.email || "",
      phone: userData.Phone_Number || userData.phone || "",
      address: userData.Address || userData.address || "",
      
      // Preserve original API property names
      User_ID: userData.User_ID || userData.id || "",
      Name: userData.Name || userData.name || "",
      Email: userData.Email || userData.email || "",
      Phone_Number: userData.Phone_Number || userData.phone || "",
      Address: userData.Address || userData.address || "",
      
      // Other fields
      joinDate: userData.Created_At || new Date().toISOString(),
      profileImage: null,
      reviews: []
    };
  };

  const fetchUserProfile = async () => {
    try {
      const data = await api.getCurrentUser();
      if (data && data.user) {
        const normalizedUser = normalizeUserData(data.user);
        setUser(normalizedUser);
      } else {
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await api.login(email, password);
      
      if (data && data.token) {
        localStorage.setItem('auth_token', data.token);
        
        // Set a basic user object first for immediate feedback
        const normalizedUser = normalizeUserData(data.user);
        setUser(normalizedUser);
        
        // Then fetch the complete profile
        try {
          await fetchUserProfile();
        } catch (profileError) {
          console.error('Error fetching full profile after login:', profileError);
        }
        
        return { success: true };
      } else {
        return { success: false, message: 'Login failed' };
      }
    } catch (error) {
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const data = await api.register(userData);
      
      if (data && data.token) {
        localStorage.setItem('auth_token', data.token);
        
        // Set a basic user object first
        const normalizedUser = normalizeUserData(data.user);
        setUser(normalizedUser);
        
        // Then fetch the complete profile
        try {
          await fetchUserProfile();
        } catch (profileError) {
          console.error('Error fetching full profile after registration:', profileError);
        }
        
        return { success: true };
      } else {
        return { success: false, message: 'Registration failed' };
      }
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}