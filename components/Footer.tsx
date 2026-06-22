import React from 'react';
import Link from 'next/link';
import { ChefHat, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Col */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white font-display">
                Food<span className="text-orange-500">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Serving gourmet meals crafted by award-winning chefs, delivered fresh and fast right to your doorstep. Experience restaurant-quality dining at home.
            </p>
            <div className="flex space-x-4">
              {/* Facebook SVG */}
              <a href="#" aria-label="Facebook" className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-orange-500 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>
              {/* Twitter/X SVG */}
              <a href="#" aria-label="Twitter" className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-orange-500 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Instagram SVG */}
              <a href="#" aria-label="Instagram" className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-orange-500 transition-colors">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/menu" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Our Menu
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm text-slate-400 hover:text-white transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Sign In / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Menu Categories</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/menu?category=Starters" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Starters & Appetizers
                </Link>
              </li>
              <li>
                <Link href="/menu?category=Main Course" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Main Course Gourmet
                </Link>
              </li>
              <li>
                <Link href="/menu?category=Desserts" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Sweet Desserts
                </Link>
              </li>
              <li>
                <Link href="/menu?category=Drinks" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Special Drinks & Mocktails
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-400">
                  123 Gourmet Blvd, Food City, FC 90210
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span className="text-sm text-slate-400">+1 (555) 019-2834</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span className="text-sm text-slate-400">support@foodhub.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} FoodHub Inc. All rights reserved. Made with ❤️ for food lovers.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-xs text-slate-500 hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-400">Terms of Service</a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-400">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
