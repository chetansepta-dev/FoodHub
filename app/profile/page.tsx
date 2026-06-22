'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User as UserIcon, Mail, Phone, MapPin, Save, ShieldCheck, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Prefill state
  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    updateProfile({
      ...user,
      name,
      phone,
      address
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-orange-500 animate-spin"></div>
        <p className="text-sm text-slate-400">Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <UserIcon className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-white font-display">Authentication Required</h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            Please sign in to view your profile details and manage your active orders.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center space-x-1.5 px-8 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-all"
        >
          <span>Go to Sign In</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-4xl font-extrabold text-white font-display">
          My <span className="text-orange-500 font-display">Profile</span>
        </h1>
        <p className="text-sm text-slate-400">Manage your contact details and default delivery address.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Avatar Card */}
        <div className="md:col-span-4 glass-panel rounded-3xl p-6 border border-white/5 text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-orange-500/30">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                <UserIcon className="w-10 h-10 text-slate-500" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white font-display">{user.name}</h3>
            <p className="text-xs text-slate-400 mt-1">{user.email}</p>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-orange-500/10 text-orange-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Role: {user.role}</span>
          </div>
        </div>

        {/* Right Side: Edit Form */}
        <div className="md:col-span-8 glass-panel rounded-3xl p-8 border border-white/5">
          
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            
            {saveSuccess && (
              <div className="p-3 text-xs font-semibold rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Email (Readonly) */}
              <div className="space-y-2">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">
                  Email Address (Verified)
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="email"
                    readOnly
                    value={user.email}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-slate-900 rounded-xl text-xs text-slate-500 cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2 sm:col-span-2">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">
                  Contact Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-2 sm:col-span-2">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">
                  Default Delivery Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-[15px] w-4 h-4 text-slate-500" />
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter your detailed street address, apartment, city, state, zip code..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center space-x-1.5 glow-primary transition-all duration-300 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
