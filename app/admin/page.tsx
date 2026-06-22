'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { menuService } from '../../services/menuService';
import { Order } from '../../types';
import { 
  ShieldAlert, 
  TrendingUp, 
  ShoppingBag, 
  ChefHat, 
  IndianRupee,
  ChevronRight,
  UserCheck,
  ClipboardList
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { orders, updateStatus } = useOrders();
  const [menuCount, setMenuCount] = useState(0);

  // Load menu count
  useEffect(() => {
    menuService.getMenuItems().then(items => setMenuCount(items.length));
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
            You must be signed in with administrative privileges to view the dashboard and manage store settings.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center space-x-1.5 px-8 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-all"
        >
          <UserCheck className="w-4 h-4" />
          <span>Sign In as Admin</span>
        </Link>
      </div>
    );
  }

  // Calculations
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');
  const activeOrders = orders.filter(o => ['Pending', 'Preparing', 'Out for Delivery'].includes(o.status));
  const totalRevenue = deliveredOrders.reduce((acc, o) => acc + o.total, 0);
  const avgOrderValue = deliveredOrders.length > 0 ? (totalRevenue / deliveredOrders.length) : 0;

  // Get last 5 orders
  const recentOrders = [...orders].slice(0, 5);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Preparing': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Out for Delivery': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Delivered': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-white font-display">
            Admin <span className="text-orange-500">Dashboard</span>
          </h1>
          <p className="text-sm text-slate-400">Manage menu inventory, track restaurant sales, and process customer orders.</p>
        </div>
        
        {/* Admin Navigation Options */}
        <div className="flex space-x-3 text-xs">
          <Link
            href="/admin/menu"
            className="px-5 py-3 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300 font-bold transition-all"
          >
            Manage Menu
          </Link>
          <Link
            href="/admin/orders"
            className="px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold glow-primary transition-all"
          >
            Process Orders ({activeOrders.length})
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Rev */}
        <div className="glass-panel rounded-3xl p-6 border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Revenue</span>
            <span className="text-3xl font-extrabold text-white font-display">₹{totalRevenue.toFixed(2)}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-600/10 flex items-center justify-center text-orange-500">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        {/* Active Orders */}
        <div className="glass-panel rounded-3xl p-6 border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Orders</span>
            <span className="text-3xl font-extrabold text-white font-display">{activeOrders.length}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-600/10 flex items-center justify-center text-amber-500">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Menu Items count */}
        <div className="glass-panel rounded-3xl p-6 border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Food Items</span>
            <span className="text-3xl font-extrabold text-white font-display">{menuCount}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-500">
            <ChefHat className="w-6 h-6" />
          </div>
        </div>

        {/* Average value */}
        <div className="glass-panel rounded-3xl p-6 border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg Order Value</span>
            <span className="text-3xl font-extrabold text-white font-display">₹{avgOrderValue.toFixed(2)}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Grid: Recent Orders & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recent Orders List (8 cols) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-white/5 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Recent Orders</h2>
            <Link 
              href="/admin/orders" 
              className="text-xs font-bold text-orange-500 hover:text-orange-400 flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="text-slate-300 hover:bg-white/2 transition-colors">
                    <td className="py-3.5 font-bold text-white">#{order.id}</td>
                    <td className="py-3.5">{order.userName}</td>
                    <td className="py-3.5 font-semibold text-white">₹{order.total.toFixed(2)}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {order.status !== 'Delivered' && order.status !== 'Cancelled' ? (
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value as any)}
                          className="bg-slate-900 border border-slate-800 rounded-lg py-1 px-2 text-[10px] text-orange-400 focus:outline-none cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">On Way</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancel</option>
                        </select>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">Archived</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick links box */}
          <div className="glass-panel rounded-3xl p-6 border border-white/5 space-y-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider border-b border-white/5 pb-4">
              Operations Center
            </h2>
            
            <div className="space-y-3">
              <Link 
                href="/admin/menu"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/40 hover:bg-slate-800/80 border border-white/5 hover:border-orange-500/30 transition-all text-xs font-semibold text-slate-200 group"
              >
                <div className="flex items-center space-x-3">
                  <ChefHat className="w-5 h-5 text-orange-500" />
                  <span>Menu Management</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link 
                href="/admin/orders"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/40 hover:bg-slate-800/80 border border-white/5 hover:border-orange-500/30 transition-all text-xs font-semibold text-slate-200 group"
              >
                <div className="flex items-center space-x-3">
                  <ClipboardList className="w-5 h-5 text-orange-500" />
                  <span>Order Processing Board</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>

          {/* Quick Stats Helper */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs text-slate-400">
            <h4 className="font-bold text-slate-200 flex items-center space-x-1.5">
              <span>System Health</span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
            </h4>
            <p className="leading-relaxed">
              Demonstration active. React Context listeners are monitoring order state modifications in the client environment. Status transitions will sync instantly back to the customer profile views.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
