'use client';

import React from 'react';
import { MenuItem } from '../types';
import { Star, Clock, Flame, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface FoodCardProps {
  item: MenuItem;
  onViewDetails: (item: MenuItem) => void;
}

export default function FoodCard({ item, onViewDetails }: FoodCardProps) {
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening details modal
    addToCart(item, 1, {
      size: 'Regular',
      spiceLevel: item.spiceLevel && item.spiceLevel > 0 ? 'Medium' : 'Mild'
    });
  };

  return (
    <div 
      onClick={() => onViewDetails(item)}
      className="glass-card rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full group"
    >
      {/* Image container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {item.vegetarian ? (
            <span className="flex items-center space-x-1 text-[10px] font-bold px-2 py-1 bg-green-500/90 text-white rounded-full backdrop-blur-sm">
              <Leaf className="w-3 h-3" />
              <span>VEG</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 text-[10px] font-bold px-2 py-1 bg-red-500/90 text-white rounded-full backdrop-blur-sm">
              <Flame className="w-3 h-3" />
              <span>NON-VEG</span>
            </span>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 flex items-center space-x-1 px-2.5 py-1 bg-slate-950/80 text-white rounded-lg text-xs font-semibold backdrop-blur-sm">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{item.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-lg text-white group-hover:text-orange-500 transition-colors line-clamp-1">
              {item.name}
            </h3>
          </div>
          
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {/* Metadata */}
          <div className="flex items-center justify-between text-slate-400 text-xs border-t border-white/5 pt-3">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{item.preparationTime} mins</span>
            </span>
            {item.calories && (
              <span>{item.calories} kcal</span>
            )}
            {item.spiceLevel !== undefined && item.spiceLevel > 0 && (
              <span className="flex items-center text-red-400">
                {'🌶️'.repeat(item.spiceLevel)}
              </span>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xl font-extrabold text-white">
              ₹{item.price.toFixed(2)}
            </span>
            <button
              onClick={handleQuickAdd}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white hover:scale-105 transition-all cursor-pointer shadow-md shadow-orange-600/10 hover:shadow-orange-600/20"
            >
              Add +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
