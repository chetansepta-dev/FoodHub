'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { menuService } from '../../services/menuService';
import { MenuItem } from '../../types';
import FoodCard from '../../components/FoodCard';
import { useCart } from '../../context/CartContext';
import {
  Search,
  X,
  Info,
  Minus,
  Plus,
  Star,
  Clock,
  Leaf
} from 'lucide-react';

function MenuContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  // Load menu items from service
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    menuService.getMenuItems()
      .then(items => {
        setMenuItems(items);
        setLoadError('');
      })
      .catch(() => {
        setLoadError('Failed to load menu. Please try again.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc'>('rating');

  // Modal states
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<'Regular' | 'Large'>('Regular');
  const [selectedSpice, setSelectedSpice] = useState<'Mild' | 'Medium' | 'Hot'>('Medium');
  const [specialNotes, setSpecialNotes] = useState('');

  // Handle category param on load
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Set category in URL
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.replace(`/menu?${params.toString()}`);
  };

  // Filter items
  const filteredItems = menuItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesVeg = !vegOnly || item.vegetarian;

      return matchesSearch && matchesCategory && matchesVeg;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  // Modal Actions
  const openDetailsModal = (item: MenuItem) => {
    setSelectedItem(item);
    setModalQuantity(1);
    setSelectedSize('Regular');
    setSelectedSpice(item.spiceLevel && item.spiceLevel > 0 ? 'Medium' : 'Mild');
    setSpecialNotes('');
  };

  const closeDetailsModal = () => {
    setSelectedItem(null);
  };

  const handleModalQuantityChange = (val: number) => {
    if (modalQuantity + val > 0) {
      setModalQuantity(prev => prev + val);
    }
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;

    // Add extra price if Large size
    const finalPrice = selectedItem.price + (selectedSize === 'Large' ? 100.00 : 0);
    const adjustedItem = {
      ...selectedItem,
      price: finalPrice
    };

    addToCart(adjustedItem, modalQuantity, {
      size: selectedSize,
      spiceLevel: selectedSpice,
      notes: specialNotes
    });

    closeDetailsModal();
  };

  const categories: string[] = ['All', 'Starters', 'Main Course', 'Desserts', 'Drinks'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      {/* Search & Filter Header */}
      <div className="flex flex-col space-y-6">
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-4xl font-extrabold text-white font-display">
            Explore <span className="text-orange-500">Our Menu</span>
          </h1>
          <p className="text-sm text-slate-400">
            Browse through our fresh selection of gourmet dishes and beverages.
          </p>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search dishes, descriptions, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-white placeholder-slate-500"
            />
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'price-asc' | 'price-desc')}
              className="w-full px-4 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-sm focus:outline-none focus:border-orange-500 text-slate-300"
            >
              <option value="rating">Sort by: Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Veg Toggle */}
          <div className="md:col-span-3 flex items-center justify-between md:justify-center px-4 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-sm">
            <span className="text-slate-300 flex items-center space-x-2">
              <Leaf className="w-4 h-4 text-green-500" />
              <span>Vegetarian Only</span>
            </span>
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${vegOnly ? 'bg-orange-600' : 'bg-slate-700'
                }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${vegOnly ? 'translate-x-5' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>

        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar border-b border-white/5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-6 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${selectedCategory === cat
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/15'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-card rounded-3xl overflow-hidden border border-white/5 animate-pulse">
              <div className="h-48 bg-slate-800" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-800 rounded w-2/3" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 bg-slate-800 rounded w-1/4" />
                  <div className="h-8 bg-slate-800 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : loadError ? (
        <div className="text-center py-20 bg-slate-900/30 border border-red-500/20 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
            <Info className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Failed to Load Menu</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">{loadError}</p>
          <button
            onClick={() => {
              setIsLoading(true);
              menuService.getMenuItems()
                .then(items => { setMenuItems(items); setLoadError(''); })
                .catch(() => setLoadError('Failed to load menu. Please try again.'))
                .finally(() => setIsLoading(false));
            }}
            className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              onViewDetails={openDetailsModal}
            />
          ))}
        </div>
      ) : menuItems.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 border border-white/5 rounded-3xl space-y-4">
          <Info className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">Menu is Empty</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            No food items found in the database. Please run the seed script in your Supabase SQL editor.
          </p>
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/30 border border-white/5 rounded-3xl space-y-4">
          <Info className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No items matches your search</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Try adjusting your search criteria, clearing the vegetarian filter, or switching categories.
          </p>
        </div>
      )}

      {/* FOOD DETAIL MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh] overflow-y-auto">

            {/* Close button */}
            <button
              onClick={closeDetailsModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/70 border border-white/10 text-white hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Side: Image */}
            <div className="md:w-1/2 relative h-64 md:h-auto min-h-[250px] bg-slate-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900 via-transparent to-transparent"></div>
            </div>

            {/* Right Side: Details & Customizer */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto space-y-6">

              {/* Core Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 tracking-wider">
                      {selectedItem.category.toUpperCase()}
                    </span>
                    {selectedItem.vegetarian && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 tracking-wider flex items-center space-x-1">
                        <Leaf className="w-3 h-3" />
                        <span>VEG</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-extrabold text-white font-display">
                    {selectedItem.name}
                  </h2>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {selectedItem.description}
                </p>

                {/* Rating & prep */}
                <div className="flex items-center space-x-6 text-xs text-slate-300">
                  <span className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-white">{selectedItem.rating.toFixed(1)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{selectedItem.preparationTime} mins</span>
                  </span>
                  {selectedItem.calories && (
                    <span>{selectedItem.calories} kcal</span>
                  )}
                </div>

                {/* Size Customizer */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Portion Size</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedSize('Regular')}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${selectedSize === 'Regular'
                        ? 'border-orange-500 bg-orange-500/10 text-white'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white'
                        }`}
                    >
                      Regular
                    </button>
                    <button
                      onClick={() => setSelectedSize('Large')}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${selectedSize === 'Large'
                        ? 'border-orange-500 bg-orange-500/10 text-white'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white'
                        }`}
                    >
                      Large (+₹100.00)
                    </button>
                  </div>
                </div>

                {/* Spice Level Customizer (if item has spice option) */}
                {selectedItem.spiceLevel !== undefined && selectedItem.spiceLevel > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Spice Level</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {(['Mild', 'Medium', 'Hot'] as const).map((spice) => (
                        <button
                          key={spice}
                          onClick={() => setSelectedSpice(spice)}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${selectedSpice === spice
                            ? 'border-orange-500 bg-orange-500/10 text-white'
                            : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white'
                            }`}
                        >
                          {spice}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Instructions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Special Instructions</h4>
                  <textarea
                    rows={2}
                    placeholder="e.g. Allergy details, no onions, extra sauce..."
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

              </div>

              {/* Order Actions */}
              <div className="border-t border-white/5 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Total Price</span>
                  <span className="text-2xl font-extrabold text-white">
                    ₹{((selectedItem.price + (selectedSize === 'Large' ? 100.00 : 0)) * modalQuantity).toFixed(2)}
                  </span>
                </div>

                <div className="flex space-x-4">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-800 bg-slate-950/60 rounded-xl px-2">
                    <button
                      onClick={() => handleModalQuantityChange(-1)}
                      className="p-2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 font-bold text-sm text-white w-8 text-center">{modalQuantity}</span>
                    <button
                      onClick={() => handleModalQuantityChange(1)}
                      className="p-2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-grow py-3 px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold text-center glow-primary transition-all duration-300 cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-orange-500 animate-spin"></div>
        <p className="text-sm text-slate-400">Loading catalog...</p>
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}
