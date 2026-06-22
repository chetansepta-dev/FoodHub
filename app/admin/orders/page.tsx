'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useOrders } from '../../../context/OrderContext';
import { OrderStatus } from '../../../types';
import { 
  ShieldAlert, 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Check, 
  Play, 
  Truck, 
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const { orders, updateStatus, loading } = useOrders();
  const [selectedTab, setSelectedTab] = useState<string>('Active');
  const [detailedOrderId, setDetailedOrderId] = useState<string | null>(null);

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
            You must be signed in with administrative privileges to view and process customer orders.
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

  // Filter orders by tab
  const filteredOrders = orders.filter(order => {
    if (selectedTab === 'Active') {
      return ['Pending', 'Preparing', 'Out for Delivery'].includes(order.status);
    }
    if (selectedTab === 'All') return true;
    return order.status === selectedTab;
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Preparing': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Out for Delivery': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Delivered': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  const tabs = ['Active', 'Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled', 'All'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header Back Button */}
      <div className="flex items-center space-x-2 text-xs text-slate-400">
        <Link href="/admin" className="hover:text-white flex items-center space-x-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-4xl font-extrabold text-white font-display">
          Process <span className="text-orange-500 font-display">Orders</span>
        </h1>
        <p className="text-sm text-slate-400">Manage kitchen preparation queues and dispatch deliveries to active customers.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar border-b border-white/5">
        {tabs.map((tab) => {
          const count = tab === 'Active' 
            ? orders.filter(o => ['Pending', 'Preparing', 'Out for Delivery'].includes(o.status)).length
            : tab === 'All'
            ? orders.length
            : orders.filter(o => o.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 cursor-pointer ${
                selectedTab === tab
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                selectedTab === tab ? 'bg-orange-700 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {loading && filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-orange-500 animate-spin"></div>
          <p className="text-sm text-slate-400">Loading orders board...</p>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => {
            const isDetailed = detailedOrderId === order.id;
            return (
              <div 
                key={order.id}
                className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col justify-between space-y-6"
              >
                
                {/* Meta details */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-extrabold text-white font-display">Order #{order.id}</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.userName}
                      </p>
                    </div>
                    
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Summary Address */}
                  <div className="space-y-2 text-[11px] text-slate-400">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{order.deliveryAddress}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                      <span>{order.phone}</span>
                    </div>
                  </div>

                  {/* Toggle items */}
                  <button 
                    onClick={() => setDetailedOrderId(prev => prev === order.id ? null : order.id)}
                    className="flex items-center space-x-1 text-[10px] font-bold text-orange-500 hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    {isDetailed ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide Order Items</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Order Items ({order.items.length})</span>
                      </>
                    )}
                  </button>

                  {/* Expanded Items Receipt */}
                  {isDetailed && (
                    <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 space-y-3">
                      <div className="divide-y divide-white/5 space-y-2 text-[11px]">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start pt-2 first:pt-0">
                            <div>
                              <div className="font-bold text-white">
                                {item.name} <span className="text-slate-500 font-normal">x{item.quantity}</span>
                              </div>
                              <div className="text-[9px] text-slate-400 space-x-1.5 mt-0.5">
                                {item.size && <span>Size: {item.size}</span>}
                                {item.spiceLevel && <span>Spice: {item.spiceLevel}</span>}
                              </div>
                            </div>
                            <span className="font-bold text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-white/5 pt-2 flex justify-between text-xs font-extrabold text-white">
                        <span>Total Receipt</span>
                        <span className="text-orange-500">₹{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                </div>

                {/* Workflow Buttons */}
                <div className="border-t border-white/5 pt-4">
                  {order.status === 'Pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateStatus(order.id, 'Preparing')}
                        className="flex-grow py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-bold flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Accept & Cook</span>
                      </button>
                      <button
                        onClick={() => updateStatus(order.id, 'Cancelled')}
                        className="p-2.5 rounded-xl border border-slate-800 hover:border-red-500 hover:bg-red-500/5 text-slate-500 hover:text-red-400 cursor-pointer"
                        title="Cancel Order"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {order.status === 'Preparing' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateStatus(order.id, 'Out for Delivery')}
                        className="flex-grow py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Truck className="w-4.5 h-4.5" />
                        <span>Dispatch Courier</span>
                      </button>
                      <button
                        onClick={() => updateStatus(order.id, 'Cancelled')}
                        className="p-2.5 rounded-xl border border-slate-800 hover:border-red-500 hover:bg-red-500/5 text-slate-500 hover:text-red-400 cursor-pointer"
                        title="Cancel Order"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {order.status === 'Out for Delivery' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateStatus(order.id, 'Delivered')}
                        className="flex-grow py-2.5 px-4 rounded-xl bg-green-600 hover:bg-green-500 text-white text-[11px] font-bold flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Check className="w-4.5 h-4.5" />
                        <span>Mark Delivered</span>
                      </button>
                      <button
                        onClick={() => updateStatus(order.id, 'Cancelled')}
                        className="p-2.5 rounded-xl border border-slate-800 hover:border-red-500 hover:bg-red-500/5 text-slate-500 hover:text-red-400 cursor-pointer"
                        title="Cancel Order"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {['Delivered', 'Cancelled'].includes(order.status) && (
                    <div className="text-center text-[10px] text-slate-500 italic">
                      This order is completed and archived.
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/30 border border-white/5 rounded-3xl space-y-4">
          <Check className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No orders in this section</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            All customer orders under this category have been processed or moved to another stage.
          </p>
        </div>
      )}

    </div>
  );
}
