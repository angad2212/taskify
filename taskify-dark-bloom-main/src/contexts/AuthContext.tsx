
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'admin' | 'user') => Promise<void>;
  signup: (email: string, password: string, role: 'admin' | 'user', name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('taskify_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'admin' | 'user') => {
    // Mock login - replace with real API call
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      role,
      name: email.split('@')[0]
    };
    
    setUser(mockUser);
    localStorage.setItem('taskify_user', JSON.stringify(mockUser));
  };

  const signup = async (email: string, password: string, role: 'admin' | 'user', name: string) => {
    // Mock signup - replace with real API call
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      role,
      name
    };
    
    setUser(mockUser);
    localStorage.setItem('taskify_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskify_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
