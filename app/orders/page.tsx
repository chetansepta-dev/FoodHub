'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { Order, OrderStatus } from '../../types';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Phone, 
  CreditCard,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const { user } = useAuth();
  const { orders, loading } = useOrders();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Filter orders for the current user
  const userOrders = user ? orders.filter(o => o.userId === user.id) : [];

  const toggleExpand = (id: string) => {
    setExpandedOrderId(prev => (prev === id ? null : id));
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Preparing': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Out for Delivery': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Delivered': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const renderTimeline = (status: OrderStatus) => {
    if (status === 'Cancelled') {
      return (
        <div className="flex items-center space-x-2 text-red-400 text-xs p-3 rounded-xl bg-red-500/5 border border-red-500/10">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>This order was cancelled. Please contact customer support for details.</span>
        </div>
      );
    }

    const steps = [
      { key: 'Pending', label: 'Order Placed', desc: 'Received' },
      { key: 'Preparing', label: 'In Kitchen', desc: 'Cooking' },
      { key: 'Out for Delivery', label: 'On The Way', desc: 'Out' },
      { key: 'Delivered', label: 'Arrived', desc: 'Enjoy!' }
    ];

    const getStepStatus = (stepKey: OrderStatus) => {
      const statusOrder: OrderStatus[] = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];
      const currentIndex = statusOrder.indexOf(status);
      const stepIndex = statusOrder.indexOf(stepKey);

      if (stepIndex < currentIndex) return 'completed';
      if (stepIndex === currentIndex) return 'active';
      return 'upcoming';
    };

    return (
      <div className="py-4">
        {/* Timeline Line */}
        <div className="relative flex justify-between">
          <div className="absolute top-[17px] left-8 right-8 h-0.5 bg-slate-800 z-0">
            <div 
              className="h-full bg-orange-500 transition-all duration-500"
              style={{
                width: 
                  status === 'Pending' ? '0%' : 
                  status === 'Preparing' ? '33%' : 
                  status === 'Out for Delivery' ? '66%' : '100%'
              }}
            />
          </div>

          {steps.map((step) => {
            const stepState = getStepStatus(step.key as OrderStatus);
            return (
              <div key={step.key} className="flex flex-col items-center z-10 space-y-2 text-center w-20">
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                    stepState === 'completed' 
                      ? 'bg-orange-600 border-orange-500 text-white' 
                      : stepState === 'active'
                      ? 'bg-slate-900 border-orange-500 text-orange-400 scale-110 glow-primary' 
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  {stepState === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : step.key === 'Out for Delivery' ? (
                    <Truck className="w-4.5 h-4.5" />
                  ) : (
                    <Clock className="w-4.5 h-4.5" />
                  )}
                </div>
                <div>
                  <div className={`text-[10px] font-bold ${stepState === 'active' ? 'text-white' : 'text-slate-400'}`}>
                    {step.label}
                  </div>
                  <div className="text-[9px] text-slate-500">{step.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-white font-display">Authentication Required</h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            Please sign in to view your order history and track active orders in real time.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center space-x-1.5 px-8 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-all"
        >
          <span>Go to Sign In</span>
        </Link>
      </div>
    );
  }

  if (loading && userOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-orange-500 animate-spin"></div>
        <p className="text-sm text-slate-400">Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-4xl font-extrabold text-white font-display">
          My <span className="text-orange-500 font-display">Orders</span>
        </h1>
        <p className="text-sm text-slate-400">Track active order delivery timelines and view order archives.</p>
      </div>

      {userOrders.length > 0 ? (
        <div className="space-y-6">
          {userOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const isLive = ['Pending', 'Preparing', 'Out for Delivery'].includes(order.status);

            return (
              <div 
                key={order.id}
                className={`glass-panel rounded-3xl overflow-hidden border border-white/5 transition-all ${
                  isLive ? 'border-orange-500/20' : ''
                }`}
              >
                
                {/* Header Summary */}
                <div 
                  onClick={() => toggleExpand(order.id)}
                  className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-white/2 transition-colors select-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-extrabold text-white font-display">
                        Order #{order.id}
                      </span>
                      {isLive && (
                        <span className="flex items-center space-x-1 text-[9px] font-extrabold text-orange-400 px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
                          <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
                          <span>LIVE TRACKING</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center space-x-4">
                      <span>Placed: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span>{order.items.reduce((acc, i) => acc + i.quantity, 0)} items</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 self-end md:self-auto">
                    <div className="text-right">
                      <div className="font-extrabold text-white text-lg">₹{order.total.toFixed(2)}</div>
                      <div className="text-[10px] text-slate-400">{order.paymentMethod}</div>
                    </div>
                    
                    <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>

                    <button className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-white/5 bg-slate-950/40 p-6 space-y-8">
                    
                    {/* Live Tracker component */}
                    <div className="border-b border-white/5 pb-6">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Delivery Timeline</h4>
                      {renderTimeline(order.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start text-xs">
                      
                      {/* Ordered Items Receipt */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-slate-400 uppercase tracking-wider">Items Summary</h4>
                        <div className="space-y-2.5">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-slate-900/40 p-3 border border-white/5 rounded-xl">
                              <div>
                                <span className="font-bold text-white text-sm">{item.name}</span>
                                <div className="text-[10px] text-slate-400 flex space-x-2 mt-0.5">
                                  <span>Qty: {item.quantity}</span>
                                  {item.size && <span>• Size: {item.size}</span>}
                                  {item.spiceLevel && <span>• Spice: {item.spiceLevel}</span>}
                                </div>
                              </div>
                              <span className="font-extrabold text-white text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Address & Contact info */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-400 uppercase tracking-wider">Delivery Details</h4>
                        
                        <div className="space-y-3 bg-slate-900/40 p-4 border border-white/5 rounded-xl">
                          <div className="flex items-start space-x-2.5">
                            <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-semibold text-white">Destination Address</div>
                              <div className="text-slate-400 text-[10px] mt-0.5">{order.deliveryAddress}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-2.5">
                            <Phone className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-semibold text-white">Contact Phone</div>
                              <div className="text-slate-400 text-[10px] mt-0.5">{order.phone}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-2.5">
                            <CreditCard className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-semibold text-white">Payment Method</div>
                              <div className="text-slate-400 text-[10px] mt-0.5">{order.paymentMethod}</div>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/30 border border-white/5 rounded-3xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <RotateCcw className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">No orders placed yet</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Place your first gourmet delivery and track its status in real-time.
            </p>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all"
          >
            <span>Order Food Now</span>
          </Link>
        </div>
      )}

    </div>
  );
}
