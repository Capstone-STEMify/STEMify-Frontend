// components/CartItem.tsx
import React from 'react';
import Image from 'next/image';

interface CartItemProps {
  id: string;
  brand: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  hasDelivery: boolean;
  hasCollection: boolean;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  id,
  brand,
  name,
  price,
  quantity,
  image,
  hasDelivery,
  hasCollection,
  onQuantityChange,
  onRemove,
}) => {
  return (
    <div className="bg-gray-50 p-4 md:p-6 rounded-lg mb-4 transition-all hover:shadow-md hover:bg-white">
      <div className="flex gap-4 md:gap-6">
        {/* Product Image */}
        <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-lg flex-shrink-0 p-2 shadow-sm">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 pr-4">
              <h3 className="font-bold text-sm md:text-base text-gray-900 mb-1">
                {brand}
              </h3>
              <p className="text-gray-700 text-sm md:text-base mb-3">
                {name}
              </p>
              <p className="text-lg md:text-xl font-bold text-gray-900">
                £{price.toFixed(2)}
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => onRemove(id)}
              className="text-gray-500 hover:text-red-600 transition-colors text-xl font-bold"
              aria-label="Remove item"
            >
              ✕
            </button>
          </div>

          {/* Delivery Options */}
          <div className="flex gap-4 mb-4">
            {hasDelivery && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Delivery</span>
              </div>
            )}
            {hasCollection && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Collection</span>
              </div>
            )}
          </div>

          {/* Quantity and Price */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <label className="text-gray-700 font-medium text-sm md:text-base">
                Quantity
              </label>
              <div className="relative inline-flex">
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    onQuantityChange(id, Math.max(1, Math.min(99, val)));
                  }}
                  className="w-16 bg-white border border-gray-300 rounded-md pl-3 pr-2 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <div className="absolute inset-y-0 right-1 flex flex-col justify-center">
                  <button
                    onClick={() => onQuantityChange(id, Math.min(99, quantity + 1))}
                    className="px-1 hover:bg-gray-100 rounded transition-colors"
                    aria-label="Increase quantity"
                  >
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onQuantityChange(id, Math.max(1, quantity - 1))}
                    className="px-1 hover:bg-gray-100 rounded transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-lg md:text-xl font-bold text-gray-900">
                £{(price * quantity).toFixed(2)}
              </p>
              <button className="text-sm text-blue-600 hover:text-blue-800 underline transition-colors mt-1">
                Move to wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}