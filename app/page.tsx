'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ChefHat, 
  ArrowRight, 
  Star, 
  Clock, 
  Truck, 
  Shield,
  Utensils,
  Flame
} from 'lucide-react';

const categories = [
  { name: 'Starters', emoji: '🥗', desc: 'Fresh salads, soups & bites', color: 'from-green-600/20 to-emerald-600/10', border: 'border-green-500/20', hover: 'hover:border-green-500/50' },
  { name: 'Main Course', emoji: '🥩', desc: 'Steaks, curries & mains', color: 'from-orange-600/20 to-amber-600/10', border: 'border-orange-500/20', hover: 'hover:border-orange-500/50' },
  { name: 'Desserts', emoji: '🍰', desc: 'Cakes, tarts & indulgences', color: 'from-pink-600/20 to-rose-600/10', border: 'border-pink-500/20', hover: 'hover:border-pink-500/50' },
  { name: 'Drinks', emoji: '🍹', desc: 'Cocktails, lattes & smoothies', color: 'from-blue-600/20 to-cyan-600/10', border: 'border-blue-500/20', hover: 'hover:border-blue-500/50' },
];

const features = [
  { icon: Clock, title: '30-Min Delivery', desc: 'Lightning fast delivery from restaurant to your door', color: 'text-amber-400' },
  { icon: Star, title: 'Premium Quality', desc: 'Chef-curated menu with only the finest ingredients', color: 'text-orange-400' },
  { icon: Truck, title: 'Free Delivery', desc: 'Free delivery on orders over ₹500. No hidden charges.', color: 'text-emerald-400' },
  { icon: Shield, title: 'Secure Checkout', desc: 'Bank-level security for all your payments', color: 'text-blue-400' },
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      
      {/* ======================== HERO SECTION ======================== */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 pulse-glow-bg">
        
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-10 z-10">

          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold tracking-wider">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>PREMIUM FOOD DELIVERY — EST. 2024</span>
          </div>

          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none font-display">
              <span className="text-white">Gourmet Food,</span>
              <br />
              <span className="text-gradient">Delivered Fast.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans">
              Explore our chef-crafted menu of premium starters, mains, desserts and beverages. 
              Order in seconds and track your delivery in real-time.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/menu"
              id="hero-order-now-btn"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-base glow-primary transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Utensils className="w-5 h-5" />
              <span>Explore the Menu</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/signup"
              id="hero-signup-btn"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl border border-slate-700 hover:border-orange-500/50 text-slate-300 hover:text-white font-bold text-base transition-all duration-300"
            >
              <span>Create Free Account</span>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-4 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span><strong className="text-white">4.9/5</strong> Customer Rating</span>
            </div>
            <div className="w-px h-4 bg-slate-700" />
            <div className="flex items-center space-x-1.5">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span><strong className="text-white">20,000+</strong> Deliveries Done</span>
            </div>
            <div className="w-px h-4 bg-slate-700" />
            <div className="flex items-center space-x-1.5">
              <ChefHat className="w-4 h-4 text-orange-400" />
              <span><strong className="text-white">20+</strong> Gourmet Dishes</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== CATEGORIES SECTION ======================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-4 mb-14">
          <h2 className="text-4xl font-extrabold text-white font-display">
            Browse by <span className="text-orange-500">Category</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            From light bites to hearty mains — we have something for every craving.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/menu?category=${cat.name}`}
              id={`category-${cat.name.toLowerCase().replace(' ', '-')}`}
              className={`group relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br ${cat.color} border ${cat.border} ${cat.hover} transition-all duration-300 hover:-translate-y-1 text-center space-y-4`}
            >
              <div className="text-5xl">{cat.emoji}</div>
              <div>
                <h3 className="text-xl font-extrabold text-white font-display">{cat.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{cat.desc}</p>
              </div>
              <div className="flex items-center justify-center space-x-1 text-orange-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Browse Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ======================== FEATURES SECTION ======================== */}
      <section className="bg-slate-900/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-4 mb-14">
            <h2 className="text-4xl font-extrabold text-white font-display">
              Why Choose <span className="text-orange-500">FoodHub?</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              We obsess over every detail — from sourcing the best ingredients to delivering the fastest.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="glass-card rounded-3xl p-8 text-center space-y-4 border border-white/5">
                <div className={`inline-flex w-14 h-14 rounded-2xl items-center justify-center bg-slate-900 border border-slate-800 ${feature.color} mx-auto`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-white font-display">{feature.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== CTA SECTION ======================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-600 to-amber-500 p-12 text-center space-y-6">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_107%,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
          
          <div className="relative space-y-4">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white font-display leading-tight">
              Ready to Order?
            </h2>
            <p className="text-orange-100 text-base max-w-lg mx-auto">
              Join thousands of food lovers who trust FoodHub for premium gourmet delivery every day.
            </p>
          </div>
          
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/menu"
              id="cta-menu-btn"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-white text-orange-600 font-bold text-base hover:bg-orange-50 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Utensils className="w-5 h-5" />
              <span>Order Now</span>
            </Link>
            <Link
              href="/signup"
              id="cta-signup-btn"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl border-2 border-white/40 text-white font-bold text-base hover:bg-white/10 transition-all duration-300"
            >
              <span>Sign Up Free</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}