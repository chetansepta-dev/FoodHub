'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  ShoppingBag, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  ChefHat, 
  ShieldAlert
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: 'Menu', href: '/menu' },
    { name: 'Orders', href: '/orders' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center glow-primary">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white font-display">
                Food<span className="text-orange-500">Hub</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-orange-500 ${
                  isActive(link.href) ? 'text-orange-500 font-semibold' : 'text-slate-300'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Admin Dashboard link - only if admin */}
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className={`text-sm font-medium flex items-center space-x-1 transition-colors duration-200 hover:text-orange-500 ${
                  pathname.startsWith('/admin') ? 'text-orange-500 font-semibold' : 'text-amber-400'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Shopping Cart */}
            <Link href="/cart" className="relative group p-2 rounded-full hover:bg-white/5 transition-colors">
              <ShoppingBag className="w-6 h-6 text-slate-300 group-hover:text-orange-500 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-950 glow-primary animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile / Authentication */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="flex items-center space-x-2 group">
                  {user.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full border border-orange-500/30 group-hover:border-orange-500 transition-colors" 
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                      <UserIcon className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors max-w-[100px] truncate">
                    {user.name}
                  </span>
                </Link>

                <button 
                  onClick={logout} 
                  className="p-2 rounded-full text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            
            {/* Mobile Cart */}
            <Link href="/cart" className="relative p-2 rounded-full hover:bg-white/5">
              <ShoppingBag className="w-6 h-6 text-slate-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-950">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 animate-fade-in">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive(link.href) 
                    ? 'bg-orange-500/10 text-orange-500 font-semibold' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {user?.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-base font-medium flex items-center space-x-2 ${
                  pathname.startsWith('/admin')
                    ? 'bg-orange-500/10 text-orange-500 font-semibold'
                    : 'text-amber-400 hover:bg-white/5'
                }`}
              >
                <ShieldAlert className="w-5 h-5" />
                <span>Admin Panel</span>
              </Link>
            )}

            <div className="pt-4 border-t border-slate-800">
              {user ? (
                <div className="px-3 space-y-3">
                  <Link 
                    href="/profile" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 py-2"
                  >
                    {user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border border-orange-500/30" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <div className="text-base font-semibold text-white">{user.name}</div>
                      <div className="text-xs text-slate-400">{user.email}</div>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-red-500/30 hover:border-red-500 text-red-400 hover:bg-red-500/5 transition-all text-sm font-semibold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="px-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-semibold shadow-lg shadow-orange-500/20"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
