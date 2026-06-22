import { supabase } from '@/lib/supabase';
import { MenuItem } from '../types';

export const menuService = {
  getMenuItems: async (): Promise<MenuItem[]> => {
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }

    return (data || []).map((item: any) => {
      const nameLower = item.name.toLowerCase();
      // Guess vegetarian status if not in DB to match mock design
      const isVeg = item.category === 'Desserts' || item.category === 'Drinks' || 
                    (!nameLower.includes('chicken') && !nameLower.includes('steak') && 
                     !nameLower.includes('salmon') && !nameLower.includes('ribeye') && 
                     !nameLower.includes('shrimp') && !nameLower.includes('mutton') &&
                     !nameLower.includes('pork') && !nameLower.includes('fish'));
      
      const deterministicRating = 4.3 + (item.id % 7) * 0.1;
      const deterministicPrepTime = 10 + (item.id % 3) * 5;
      const deterministicCalories = 150 + (item.id % 9) * 80;
      const deterministicSpice = item.category === 'Main Course' ? (item.id % 3) as 0 | 1 | 2 | 3 : 0;

      return {
        id: String(item.id),
        name: item.name,
        description: item.description || '',
        price: Number(item.price),
        category: item.category,
        image: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        isAvailable: true,
        rating: Number(deterministicRating.toFixed(1)),
        preparationTime: deterministicPrepTime,
        spiceLevel: deterministicSpice,
        calories: deterministicCalories,
        vegetarian: isVeg
      };
    });
  },

  getMenuItemById: async (id: string): Promise<MenuItem | undefined> => {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return undefined;

    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .eq('id', numericId)
      .single();

    if (error || !data) {
      console.error('Error fetching menu item by id:', error);
      return undefined;
    }

    const item = data;
    const nameLower = item.name.toLowerCase();
    const isVeg = item.category === 'Desserts' || item.category === 'Drinks' || 
                  (!nameLower.includes('chicken') && !nameLower.includes('steak') && 
                   !nameLower.includes('salmon') && !nameLower.includes('ribeye') && 
                   !nameLower.includes('shrimp') && !nameLower.includes('mutton') &&
                   !nameLower.includes('pork') && !nameLower.includes('fish'));
    
    const deterministicRating = 4.3 + (item.id % 7) * 0.1;
    const deterministicPrepTime = 10 + (item.id % 3) * 5;
    const deterministicCalories = 150 + (item.id % 9) * 80;
    const deterministicSpice = item.category === 'Main Course' ? (item.id % 3) as 0 | 1 | 2 | 3 : 0;

    return {
      id: String(item.id),
      name: item.name,
      description: item.description || '',
      price: Number(item.price),
      category: item.category,
      image: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      isAvailable: true,
      rating: Number(deterministicRating.toFixed(1)),
      preparationTime: deterministicPrepTime,
      spiceLevel: deterministicSpice,
      calories: deterministicCalories,
      vegetarian: isVeg
    };
  },

  addMenuItem: async (item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
    const dbItem = {
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image_url: item.image
    };

    const { data, error } = await supabase
      .from('food_items')
      .insert([dbItem])
      .select()
      .single();

    if (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }

    return {
      ...item,
      id: String(data.id)
    };
  },

  updateMenuItem: async (updatedItem: MenuItem): Promise<MenuItem> => {
    const numericId = parseInt(updatedItem.id, 10);
    if (isNaN(numericId)) throw new Error('Invalid ID format');

    const dbItem = {
      name: updatedItem.name,
      description: updatedItem.description,
      price: updatedItem.price,
      category: updatedItem.category,
      image_url: updatedItem.image
    };

    const { error } = await supabase.from('food_items').update(dbItem).eq('id', numericId);
    if (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }

    return updatedItem;
  },

  deleteMenuItem: async (id: string): Promise<void> => {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return;

    const { error } = await supabase.from('food_items').delete().eq('id', numericId);
    if (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  },

  resetMenu: async (): Promise<void> => {
    // Keep for compatibility but we won't need to clear database seeds locally
  }
};

