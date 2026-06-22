export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  address?: string;
  phone?: string;
  avatarUrl?: string;
}

export type FoodCategory = 'Starters' | 'Main Course' | 'Desserts' | 'Drinks';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
  image: string; // Realistic URL or placeholder URL
  isAvailable: boolean;
  rating: number;
  preparationTime: number; // in minutes
  spiceLevel?: 0 | 1 | 2 | 3; // 0 = none, 3 = very hot
  calories?: number;
  vegetarian?: boolean;
}

export interface CartItem {
  id: string; // unique cart item id (combines menu item id + customization hash)
  menuItem: MenuItem;
  quantity: number;
  customization?: {
    notes?: string;
    size?: 'Regular' | 'Large';
    spiceLevel?: 'Mild' | 'Medium' | 'Hot';
  };
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  spiceLevel?: string;
  notes?: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  deliveryAddress: string;
  phone: string;
  paymentMethod: string;
}
