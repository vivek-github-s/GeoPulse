// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from '../api/axios';

interface AuthContextType {
  user: any;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      axios.defaults.headers['Authorization'] = `Bearer ${storedToken}`;
      setUser({ token: storedToken });
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    axios.defaults.headers['Authorization'] = `Bearer ${token}`;
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;