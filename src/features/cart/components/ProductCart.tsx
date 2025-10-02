'use client';

import React, { useState } from 'react';
import { DeliveryProgress } from './delivery/DeliveryProgess';
import { CartItem } from './items/CartItems';
import { PaymentSummary } from './summary/CartSummary';

interface CartItemData {
  id: string;
  brand: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  hasDelivery: boolean;
  hasCollection: boolean;
}

export default function ProductCart() {
  const [cartItems, setCartItems] = useState<CartItemData[]>([
    {
      id: '1',
      brand: 'HAMLEYS®',
      name: 'Hamleys® Paddington Bear Non Woven bag',
      price: 8.00,
      quantity: 1,
      image: '/api/placeholder/200/200',
      hasDelivery: true,
      hasCollection: true,
    },
    {
      id: '2',
      brand: 'HAMLEYS®',
      name: 'Hamleys Medium Corgi Tote Bag',
      price: 8.00,
      quantity: 1,
      image: '/api/placeholder/200/200',
      hasDelivery: true,
      hasCollection: true,
    },
  ]);

  const FREE_DELIVERY_THRESHOLD = 35.00;
  
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleRemoveAll = () => {
    if (confirm('Are you sure you want to remove all items from cart?')) {
      setCartItems([]);
    }
  };

  const handleCheckout = () => {
    alert('Proceeding to checkout...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {cartItems.length} item(s) in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500">Add some items to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2">
              <DeliveryProgress
                currentAmount={totalAmount}
                targetAmount={FREE_DELIVERY_THRESHOLD}
              />

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    {...item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>

              {/* Continue Shopping Button (Mobile) */}
              <button className="w-full mt-6 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all lg:hidden">
                ← Continue Shopping
              </button>
            </div>

            {/* Right Column - Payment Summary */}
            <div className="lg:col-span-1">
              <PaymentSummary
                total={totalAmount * 50000} // Convert to VND (example rate)
                currency="đ"
                onCheckout={handleCheckout}
                onRemoveAll={handleRemoveAll}
              />
            </div>
          </div>
        )}

        {/* Continue Shopping Button (Desktop) */}
        {cartItems.length > 0 && (
          <button className="hidden lg:block mt-8 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all">
            ← Continue Shopping
          </button>
        )}
      </div>
    </div>
  );
}