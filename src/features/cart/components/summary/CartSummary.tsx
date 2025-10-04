import Image from 'next/image';
import React, { useState } from 'react';

interface PaymentSummaryProps {
  total: number;
  currency?: string;
  onCheckout: () => void;
  onRemoveAll: () => void;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  total,
  currency = '£',
  onCheckout,
  onRemoveAll,
}) => {
  const [discountCode, setDiscountCode] = useState('');

  const productTotal = total * 0.95; // 95% of total
  const productTax = total * 0.05; // 5% tax
  const shipping = 0;
  const shippingTax = 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
      {/* Total */}
      <div className="mb-6">
        <h3 className="text-gray-600 text-sm mb-2">Total:</h3>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl md:text-5xl font-bold text-gray-900">
            {total.toLocaleString()}
          </span>
          <span className="text-2xl font-medium text-gray-600">{currency}</span>
        </div>

        {/* Breakdown */}
        <div className="space-y-2 text-sm border-t pt-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Product Total:</span>
            <span className="font-bold text-gray-900">
              {currency === '£' ? '£' : ''}{productTotal.toLocaleString()}{currency === 'đ' ? ' đ' : ''}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">- of which Tax:</span>
            <span className="text-gray-900">
              {currency === '£' ? '£' : ''}{productTax.toLocaleString()}{currency === 'đ' ? ' đ' : ''}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Shipping (from):</span>
            <span className="font-bold text-gray-900">
              {currency === '£' ? '£' : ''}{shipping.toFixed(2)}{currency === 'đ' ? ' đ' : ''}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">- of which Tax:</span>
            <span className="text-gray-900">
              {currency === '£' ? '£' : ''}{shippingTax.toFixed(2)}{currency === 'đ' ? ' đ' : ''}
            </span>
          </div>
        </div>
        <div className='space-y-2 text-sm border-t pt-4'>
          <p className="text-sm mb-8">
          By placing your order you agree to the website
          <br/>
          <a href="#" className="underline hover:text-blue-500 transition-colors hover:text-semibold">
            Terms & Conditions
          </a>
          {' '}&{' '}
          <a href="#" className="underline hover:text-blue-500 transition-colors hover:text-semibold">
            Privacy notice
          </a>
        </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mb-6">
        <button
          onClick={onCheckout}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all hover:shadow-lg active:scale-98"
        >
          Checkout
        </button>
        <button
          onClick={onRemoveAll}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all hover:shadow-lg active:scale-98"
        >
          Remove All
        </button>
      </div>

      {/* Discount Section */}
      <div>
        <h3 className="text-gray-900 font-bold text-lg mb-3">Discount</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            placeholder="Enter code"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-md active:scale-98">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}