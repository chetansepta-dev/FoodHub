'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus, OrderItem } from '../types';
import { orderService } from '../services/orderService';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  placeOrder: (deliveryAddress: string, phone: string, paymentMethod: string) => Promise<Order | null>;
  updateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  refreshOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { cartItems, total, clearCart } = useCart();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      if (user) {
        const fetchedOrders = await orderService.getOrdersByUser(user.id, user.role);
        setOrders(fetchedOrders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refreshOrders = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const placeOrder = async (deliveryAddress: string, phone: string, paymentMethod: string): Promise<Order | null> => {
    if (!user || cartItems.length === 0) return null;

    setLoading(true);
    try {
      const orderItems: OrderItem[] = cartItems.map(item => ({
        menuItemId: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
        size: item.customization?.size,
        spiceLevel: item.customization?.spiceLevel,
        notes: item.customization?.notes,
      }));

      const newOrder = await orderService.createOrder({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        items: orderItems,
        total: parseFloat(total.toFixed(2)),
        status: 'Pending',
        deliveryAddress,
        phone,
        paymentMethod
      });

      if (newOrder) {
        setOrders(prev => [newOrder, ...prev]);
        clearCart();
      }
      return newOrder;
    } catch (err) {
      console.error('Error placing order:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setLoading(true);
    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, status);
      if (updatedOrder) {
        setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider value={{
      orders,
      loading,
      placeOrder,
      updateStatus,
      refreshOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
