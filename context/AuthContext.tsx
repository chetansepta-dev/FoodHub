'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updatedUser: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch profile from Supabase and update state
  const syncUser = async (supabaseUserId: string, email: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUserId)
        .single();

      const role: 'admin' | 'customer' =
        profile?.role === 'admin'
          ? 'admin'
          : email.toLowerCase() === 'admin@foodhub.com'
          ? 'admin'
          : 'customer';

      const name: string = profile?.full_name || email.split('@')[0];

      setUser({
        id: supabaseUserId,
        email,
        name,
        role,
        address: profile?.address || '',
        phone: profile?.phone || '',
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f97316&color=fff`,
      });
    } catch (e) {
      console.error('Error syncing user profile:', e);
    }
  };

  useEffect(() => {
    // 1. Restore session on mount
    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await syncUser(session.user.id, session.user.email || '');
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initSession();

    // 2. Subscribe to auth state changes (sign in / sign out / token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
        return;
      }
      if (session?.user) {
        setLoading(true);
        await syncUser(session.user.id, session.user.email || '');
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const loggedUser = await authService.login(email, password);
      setUser(loggedUser);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const signedUser = await authService.signup(name, email, password);
      setUser(signedUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedUser: User): Promise<void> => {
    setLoading(true);
    try {
      const freshUser = await authService.updateProfile(updatedUser);
      setUser(freshUser);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
