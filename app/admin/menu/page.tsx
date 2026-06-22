'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { menuService } from '../../../services/menuService';
import { MenuItem, FoodCategory } from '../../../types';
import { 
  ShieldAlert, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  Leaf, 
  Flame, 
  Search,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function AdminMenuPage() {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Main Course');
  const [image, setImage] = useState('');
  const [preparationTime, setPreparationTime] = useState('');
  const [calories, setCalories] = useState('');
  const [spiceLevel, setSpiceLevel] = useState<0 | 1 | 2 | 3>(0);
  const [vegetarian, setVegetarian] = useState(false);

  const loadMenu = async () => {
    const items = await menuService.getMenuItems();
    setMenuItems(items);
  };

  useEffect(() => {
    loadMenu();
  }, []);

  // Filter access
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-amber-500">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-white font-display">Access Denied</h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            You must be signed in with administrative privileges to manage menu inventories.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center space-x-1.5 px-8 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-all"
        >
          <span>Sign In as Admin</span>
        </Link>
      </div>
    );
  }

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategory('Main Course');
    setImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80');
    setPreparationTime('15');
    setCalories('400');
    setSpiceLevel(0);
    setVegetarian(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price.toString());
    setCategory(item.category);
    setImage(item.image);
    setPreparationTime(item.preparationTime.toString());
    setCalories(item.calories?.toString() || '');
    setSpiceLevel(item.spiceLevel || 0);
    setVegetarian(!!item.vegetarian);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      await menuService.deleteMenuItem(id);
      await loadMenu();
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const itemPayload = {
      name,
      description,
      price: parseFloat(price) || 0,
      category,
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      rating: editingItem ? editingItem.rating : 4.5,
      preparationTime: parseInt(preparationTime) || 15,
      calories: parseInt(calories) || undefined,
      spiceLevel: spiceLevel,
      vegetarian
    };

    try {
      if (editingItem) {
        await menuService.updateMenuItem({
          ...editingItem,
          ...itemPayload
        });
      } else {
        await menuService.addMenuItem(itemPayload);
      }
    } catch (err) {
      console.error('Error saving menu item:', err);
    }

    setIsModalOpen(false);
    await loadMenu();
  };

  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header Back Button */}
      <div className="flex items-center space-x-2 text-xs text-slate-400">
        <Link href="/admin" className="hover:text-white flex items-center space-x-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Title + Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-white font-display">
            Manage <span className="text-orange-500 font-display">Menu Items</span>
          </h1>
          <p className="text-sm text-slate-400">Add new creations, adjust pricing, or remove dishes from active service.</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-1.5 px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs glow-primary transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Filter menu by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-orange-500 text-white placeholder-slate-500"
        />
      </div>

      {/* Items Table Grid */}
      <div className="glass-panel rounded-3xl p-6 border border-white/5 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs min-w-[600px]">
          <thead>
            <tr className="border-b border-white/5 text-slate-400 font-bold uppercase tracking-wider">
              <th className="pb-3 w-16">Image</th>
              <th className="pb-3">Name</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Dietary</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredItems.map((item) => (
              <tr key={item.id} className="text-slate-300 hover:bg-white/2 transition-colors">
                
                {/* Image */}
                <td className="py-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                
                {/* Name */}
                <td className="py-3 font-bold text-white text-sm">
                  <div>{item.name}</div>
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5 line-clamp-1 max-w-[200px]">
                    {item.description}
                  </div>
                </td>
                
                {/* Category */}
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold">
                    {item.category}
                  </span>
                </td>

                {/* Price */}
                <td className="py-3 font-extrabold text-white text-sm">
                  ₹{item.price.toFixed(2)}
                </td>

                {/* Diet */}
                <td className="py-3">
                  {item.vegetarian ? (
                    <span className="inline-flex items-center space-x-1 text-green-400 text-[10px] font-bold">
                      <Leaf className="w-3.5 h-3.5" />
                      <span>VEG</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-red-400 text-[10px] font-bold">
                      <Flame className="w-3.5 h-3.5" />
                      <span>NON-VEG</span>
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3 text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-2 rounded-lg border border-slate-800 hover:border-orange-500/50 hover:bg-orange-500/5 text-slate-400 hover:text-white cursor-pointer"
                      title="Edit Item"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 rounded-lg border border-slate-800 hover:border-red-500/50 hover:bg-red-500/5 text-slate-400 hover:text-red-400 cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 7. ADD/EDIT ITEM DIALOG MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <form 
            onSubmit={handleFormSubmit}
            className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-extrabold text-white font-display">
              {editingItem ? 'Edit Menu Item' : 'Add New Dish'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Dish Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Classic cheeseburger"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FoodCategory)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Starters">Starters</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Drinks">Drinks</option>
                </select>
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Price (₹ INR)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 14.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the item, list ingredients, flavor notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Unsplash Image URL</label>
                <input
                  type="url"
                  placeholder="Paste a direct photo image link"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Prep time */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Prep Time (mins)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 15"
                  value={preparationTime}
                  onChange={(e) => setPreparationTime(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Calories */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Calories (kcal)</label>
                <input
                  type="number"
                  placeholder="e.g. 380"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Spice Level */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 uppercase tracking-wider block">Spice Rating</label>
                <select
                  value={spiceLevel}
                  onChange={(e) => setSpiceLevel(parseInt(e.target.value) as any)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                >
                  <option value={0}>0 - No Spice</option>
                  <option value={1}>1 - Mild</option>
                  <option value={2}>2 - Medium</option>
                  <option value={3}>3 - Hot 🌶️</option>
                </select>
              </div>

              {/* Vegetarian */}
              <div className="space-y-1.5 flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Leaf className="w-4 h-4 text-green-500" />
                  <span>Vegetarian Diet</span>
                </span>
                <button
                  type="button"
                  onClick={() => setVegetarian(!vegetarian)}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                    vegetarian ? 'bg-orange-600' : 'bg-slate-700'
                  }`}
                >
                  <span 
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      vegetarian ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center space-x-1.5 glow-primary transition-all duration-300 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Dish</span>
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
