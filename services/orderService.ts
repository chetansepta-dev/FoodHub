import { supabase } from '@/lib/supabase';
import { Order, OrderItem, OrderStatus } from '../types';

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    const { data: dbOrders, error: ordersErr } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersErr) {
      console.error('Error fetching all orders:', ordersErr);
      return [];
    }

    return orderService.mapDbOrdersToOrders(dbOrders || []);
  },

  getOrdersByUser: async (userId: string, role: 'customer' | 'admin'): Promise<Order[]> => {
    let query = supabase.from('orders').select('*');

    if (role !== 'admin') {
      query = query.eq('user_id', userId);
    }

    const { data: dbOrders, error: ordersErr } = await query.order('created_at', { ascending: false });

    if (ordersErr) {
      console.error('Error fetching orders by user:', ordersErr);
      return [];
    }

    return orderService.mapDbOrdersToOrders(dbOrders || []);
  },

  getOrderById: async (id: string): Promise<Order | undefined> => {
    const { data: dbOrder, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !dbOrder) {
      console.error('Error fetching order by id:', error);
      return undefined;
    }

    const mappedList = await orderService.mapDbOrdersToOrders([dbOrder]);
    return mappedList[0];
  },

  createOrder: async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order | null> => {
    const orderPayload = {
      user_id: orderData.userId,
      total_amount: orderData.total,
      status: 'Pending' as OrderStatus,
      delivery_address: orderData.deliveryAddress,
      phone: orderData.phone || '',
      payment_method: orderData.paymentMethod || 'Credit Card',
    };

    const { data: dbOrder, error: orderErr } = await supabase
      .from('orders')
      .insert([orderPayload])
      .select()
      .single();

    if (orderErr || !dbOrder) {
      console.error('Error inserting order:', orderErr?.message, orderErr?.details);
      return null;
    }

    const orderId = dbOrder.id;
    await orderService.insertOrderItems(orderId, orderData.items);

    return {
      id: String(orderId),
      userId: orderData.userId,
      userName: orderData.userName,
      userEmail: orderData.userEmail,
      items: orderData.items,
      total: orderData.total,
      status: 'Pending',
      createdAt: dbOrder.created_at || new Date().toISOString(),
      deliveryAddress: orderData.deliveryAddress,
      phone: orderData.phone,
      paymentMethod: orderData.paymentMethod,
    };
  },

  insertOrderItems: async (orderId: string | number, items: OrderItem[]): Promise<void> => {
    if (!items || items.length === 0) return;

    const orderItemsPayload = items.map(item => {
      const numericFoodId = parseInt(item.menuItemId, 10);
      return {
        order_id: orderId,
        food_id: isNaN(numericFoodId) ? null : numericFoodId,
        price: item.price,
        quantity: item.quantity,
        size: item.size || '',
        spice_level: item.spiceLevel || '',
        notes: item.notes || '',
      };
    });

    const { error: itemsErr } = await supabase
      .from('order_items')
      .insert(orderItemsPayload);

    if (itemsErr) {
      console.error('Error inserting order items:', itemsErr?.message, itemsErr?.details);
    }
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<Order | undefined> => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return undefined;
    }

    return orderService.getOrderById(orderId);
  },

  resetOrders: async (): Promise<void> => {
    // Kept for interface compatibility — no-op
  },

  // Helper: map raw DB order rows → typed Order[]
  mapDbOrdersToOrders: async (dbOrders: Record<string, unknown>[]): Promise<Order[]> => {
    if (dbOrders.length === 0) return [];

    const orderIds = dbOrders.map((o) => o.id);

    // Fetch order items for all orders
    const { data: dbItems, error: itemsErr } = await supabase
      .from('order_items')
      .select('*')
      .in('order_id', orderIds);

    if (itemsErr) {
      console.error('Error fetching order items for mapping:', itemsErr);
    }

    // Fetch food item names for display
    const { data: foodItems } = await supabase.from('food_items').select('id, name');
    const foodItemMap = new Map(
      (foodItems || []).map((f: Record<string, unknown>) => [String(f.id), f.name as string])
    );

    // Fetch user profiles for order display
    const userIds = [...new Set(dbOrders.map((o) => o.user_id as string))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, phone')
      .in('id', userIds);
    const profileMap = new Map(
      (profiles || []).map((p: Record<string, unknown>) => [p.id as string, p])
    );

    const orders: Order[] = dbOrders.map((o) => {
      const matchingItems = (dbItems || []).filter(
        (item: Record<string, unknown>) => item.order_id === o.id
      );

      const items: OrderItem[] = matchingItems.map((item: Record<string, unknown>) => ({
        menuItemId: String(item.food_id),
        name: foodItemMap.get(String(item.food_id)) || 'Gourmet Item',
        price: Number(item.price),
        quantity: Number(item.quantity),
        size: (item.size as string) || undefined,
        spiceLevel: (item.spice_level as string) || undefined,
        notes: (item.notes as string) || undefined,
      }));

      const profile = profileMap.get(o.user_id as string) as Record<string, unknown> | undefined;

      return {
        id: String(o.id),
        userId: String(o.user_id),
        userName: profile ? ((profile.full_name as string) || 'Customer') : 'Customer',
        userEmail: '',
        items,
        total: Number(o.total_amount),
        status: o.status as OrderStatus,
        createdAt: o.created_at as string,
        deliveryAddress: (o.delivery_address as string) || '',
        phone: (o.phone as string) || (profile ? ((profile.phone as string) || '') : ''),
        paymentMethod: (o.payment_method as string) || 'Credit Card',
      };
    });

    return orders;
  },
};
