'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  CreditCard,
  Truck,
  ArrowRight,
  UserCheck
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, subtotal, deliveryFee, tax, total } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();

  // Checkout form states
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync user info when logged in
  useEffect(() => {
    if (user) {
      setDeliveryAddress(user.address || '');
      setPhoneNumber(user.phone || '');
    }
  }, [user]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (!user) {
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await placeOrder(
        deliveryAddress || '123 Gourmet Blvd, Food City, FC 90210',
        phoneNumber || '+1 (555) 019-2834',
        paymentMethod
      );
      if (order) {
        router.push('/orders');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-white font-display">Your Cart is Empty</h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            Looks like you haven&apos;t added any gourmet items to your cart yet. Explore our delicious categories.
          </p>
        </div>
        <Link
          href="/menu"
          className="inline-flex items-center space-x-1.5 px-8 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-all"
        >
          <span>Browse Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-4xl font-extrabold text-white font-display">
          Shopping <span className="text-orange-500">Cart</span>
        </h1>
        <p className="text-sm text-slate-400">Review your delicacies and complete your order.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Cart Items List (8 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div 
                key={item.id}
                className="glass-card rounded-2xl p-4 flex items-center justify-between space-x-4 border border-white/5"
              >
                {/* Item Image */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.menuItem.image} 
                    alt={item.menuItem.name} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name & Customizations */}
                <div className="flex-grow space-y-1 min-w-0">
                  <h3 className="font-bold text-white text-sm sm:text-base truncate">{item.menuItem.name}</h3>
                  
                  {/* Customization Badges */}
                  <div className="flex flex-wrap gap-1">
                    {item.customization?.size && (
                      <span className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        Size: {item.customization.size}
                      </span>
                    )}
                    {item.customization?.spiceLevel && (
                      <span className="text-[10px] font-semibold bg-red-950/40 text-red-400 px-2 py-0.5 rounded">
                        🌶️ {item.customization.spiceLevel}
                      </span>
                    )}
                  </div>

                  {item.customization?.notes && (
                    <p className="text-[10px] text-slate-400 italic truncate max-w-[200px]">
                      &ldquo;{item.customization.notes}&rdquo;
                    </p>
                  )}
                </div>

                {/* Actions: Quantity + Price */}
                <div className="flex items-center space-x-4 sm:space-x-8 flex-shrink-0">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-800 bg-slate-950/40 rounded-xl px-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 sm:p-2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-1.5 sm:px-2 font-bold text-xs sm:text-sm text-white w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 sm:p-2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right w-16 sm:w-20">
                    <div className="font-extrabold text-white text-sm sm:text-base">
                      ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      ₹{item.menuItem.price.toFixed(2)} each
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Incentive Banner */}
          {subtotal < 500 ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center space-x-3 text-amber-400 text-xs">
              <Truck className="w-5 h-5 flex-shrink-0" />
              <span>
                Add <strong>₹{(500 - subtotal).toFixed(2)}</strong> more to unlock <strong>Free Delivery</strong>!
              </span>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center space-x-3 text-green-400 text-xs">
              <Truck className="w-5 h-5 flex-shrink-0" />
              <span>You have unlocked <strong>Free Delivery</strong>!</span>
            </div>
          )}

        </div>

        {/* Right Column: Checkout Form / Summary (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Summary Box */}
          <div className="glass-panel rounded-3xl p-6 border border-white/5 space-y-6">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider border-b border-white/5 pb-4">
              Order Summary
            </h2>
            
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="text-white">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-white">
                  {deliveryFee === 0 ? <span className="text-green-500 font-semibold">Free</span> : `₹${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-white/5 pt-4 flex justify-between text-base font-extrabold text-white">
                <span>Total Amount</span>
                <span className="text-orange-500">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Checkout Form */}
          <form onSubmit={handleCheckoutSubmit} className="glass-panel rounded-3xl p-6 border border-white/5 space-y-6">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider border-b border-white/5 pb-4">
              Checkout Details
            </h2>

            {/* Warn/Toggle Login */}
            {!user && (
              <div className="p-4 rounded-xl bg-orange-600/10 border border-orange-500/20 space-y-3">
                <p className="text-xs text-orange-200 leading-relaxed">
                  You must be <strong>signed in</strong> to place an order and save your order history.
                </p>
                <Link
                  href="/login"
                  className="flex items-center space-x-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 px-3.5 py-2 rounded-lg"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Sign In to Continue</span>
                </Link>
              </div>
            )}

            <div className="space-y-4 text-xs">
              
              {/* Address */}
              <div className="space-y-2">
                <label className="font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  <span>Delivery Address</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 123 Gourmet Blvd, Suite 4B"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-orange-500" />
                  <span>Contact Phone</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                  <CreditCard className="w-3.5 h-3.5 text-orange-500" />
                  <span>Payment Method</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Credit Card', 'Apple Pay', 'PayPal', 'Cash on Delivery'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-1 rounded-lg border text-[10px] font-bold text-center cursor-pointer transition-colors ${
                        paymentMethod === method
                          ? 'border-orange-500 bg-orange-500/10 text-white'
                          : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Place Order button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-sm font-bold text-center glow-primary transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Processing Order...' : `Place Order • ₹${total.toFixed(2)}`}
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
