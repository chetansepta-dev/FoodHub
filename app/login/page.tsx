'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '@/lib/supabase';
import { ChefHat, Mail, Lock, UserCheck, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'customer' | 'admin'>('customer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);

      // After login, fetch the actual role from DB to redirect correctly
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        const role =
          profile?.role ||
          (email.toLowerCase() === 'admin@foodhub.com' ? 'admin' : 'customer');

        router.push(role === 'admin' ? '/admin' : '/menu');
      } else {
        router.push('/menu');
      }
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || '';
      if (msg.includes('Email not confirmed')) {
        setError('⚠️ Email not confirmed. Ask admin to run confirm_users.sql in Supabase SQL Editor.');
      } else if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials')) {
        setError('❌ Invalid email or password. Please try again.');
      } else if (msg.includes('Too many requests') || msg.includes('rate limit')) {
        setError('⏳ Too many attempts. Please wait a moment and try again.');
      } else if (msg) {
        setError(msg);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 pulse-glow-bg">
      <div className="w-full max-w-md space-y-8">

        {/* Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-400 items-center justify-center glow-primary mx-auto">
            <ChefHat className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white font-display">
            Sign In to <span className="text-orange-500 font-display">FoodHub</span>
          </h2>
          <p className="text-xs text-slate-400">Welcome back! Enter your details to continue.</p>
        </div>

        {/* Form */}
        <div className="glass-panel rounded-3xl p-8 border border-white/5 space-y-6 shadow-2xl">

          {error && (
            <div className="p-3 text-xs font-semibold rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-5">

            {/* Role Selector (visual only — actual role comes from DB) */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Sign In As
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedRole('customer')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-all ${
                    selectedRole === 'customer'
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-all ${
                    selectedRole === 'admin'
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="e.g. customer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 placeholder-slate-600"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 placeholder-slate-600"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold text-center glow-primary transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>

          </form>

          <div className="border-t border-white/5 pt-4 text-center space-y-2">
            <p className="text-[10px] text-slate-500 leading-relaxed">
              💡 Admin: <strong>admin@foodhub.com</strong> / <strong>Password123!</strong> (run seed.sql first)
            </p>
            <p className="text-xs text-slate-400">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-orange-500 hover:text-orange-400 font-bold transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
