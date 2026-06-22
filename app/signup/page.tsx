'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ChefHat, Mail, Lock, User, UserPlus } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(name.trim(), email.trim(), password);
      router.push('/menu');
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || '';
      if (
        msg.includes('already registered') ||
        msg.includes('already been registered') ||
        msg.includes('User already registered') ||
        msg.includes('user_already_exists')
      ) {
        setError('⚠️ This email is already registered. Please sign in instead.');
      } else if (msg.includes('Password should be') || msg.includes('password')) {
        setError('❌ ' + msg);
      } else if (msg.includes('email') || msg.includes('Email')) {
        setError('❌ Please enter a valid email address.');
      } else if (msg) {
        setError(msg);
      } else {
        setError('Sign up failed. Please try again.');
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
            Create an <span className="text-orange-500 font-display">Account</span>
          </h2>
          <p className="text-xs text-slate-400">
            Sign up to track order history and enjoy free gourmet offers.
          </p>
        </div>

        {/* Form */}
        <div className="glass-panel rounded-3xl p-8 border border-white/5 space-y-6 shadow-2xl">

          {error && (
            <div className="p-3 text-xs font-semibold rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSignupSubmit} className="space-y-5">

            {/* Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 placeholder-slate-600"
                />
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
                  placeholder="e.g. johndoe@example.com"
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
              className="w-full py-3 px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold text-center glow-primary transition-all duration-300 cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? 'Creating Account...' : 'Sign Up'}</span>
            </button>

          </form>

          <div className="border-t border-white/5 pt-4 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-orange-500 hover:text-orange-400 font-bold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
