
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";

type User = {
  id: string;
  email: string;
  name?: string;
  photoUrl?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user in localStorage on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This is a mock implementation - in a real app, you would call your auth API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Create mock user
      const user = {
        id: `user-${Date.now()}`,
        email
      };
      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock Google login
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // This is a mock implementation - in a real app, you would implement OAuth
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Create mock Google user
      const user = {
        id: `google-user-${Date.now()}`,
        email: 'user@example.com',
        name: 'Example User',
        photoUrl: 'https://via.placeholder.com/150'
      };
      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Logged in with Google successfully');
    } catch (error) {
      toast.error('Google login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function
  const register = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      // This is a mock implementation - in a real app, you would call your auth API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Create mock user
      const user = {
        id: `user-${Date.now()}`,
        email,
        name
      };
      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Registered successfully');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading,
        isAuthenticated: !!user,
        login, 
        loginWithGoogle, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
