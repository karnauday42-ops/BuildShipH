import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../lib/api.js';
import { Organization, Profile, UserRole } from '../types/index.js';

interface AuthContextType {
  user: Profile | null;
  organization: Organization | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('foodrescue_auth_token')
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    const currentToken = localStorage.getItem('foodrescue_auth_token');
    if (!currentToken) {
      setUser(null);
      setOrganization(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiRequest<{ profile: Profile; organization: Organization | null }>('/auth/me');
      setUser(data.profile);
      setOrganization(data.organization);
    } catch (err) {
      console.warn('Session expired or invalid, logging out.');
      localStorage.removeItem('foodrescue_auth_token');
      setToken(null);
      setUser(null);
      setOrganization(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiRequest<{ token: string; profile: Profile; organization: Organization | null }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem('foodrescue_auth_token', res.token);
      setToken(res.token);
      setUser(res.profile);
      setOrganization(res.organization);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await apiRequest<{ token: string; profile: Profile; organization: Organization | null }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      localStorage.setItem('foodrescue_auth_token', res.token);
      setToken(res.token);
      setUser(res.profile);
      setOrganization(res.organization);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('foodrescue_auth_token');
    setToken(null);
    setUser(null);
    setOrganization(null);
  };

  const switchDemoRole = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const res = await apiRequest<{ token: string; profile: Profile; organization: Organization | null }>('/auth/switch-demo-role', {
        method: 'POST',
        body: JSON.stringify({ role }),
      });

      localStorage.setItem('foodrescue_auth_token', res.token);
      setToken(res.token);
      setUser(res.profile);
      setOrganization(res.organization);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        token,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

