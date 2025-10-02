import Image from 'next/image';
import React, { useState } from 'react';

interface PaymentSummaryProps {
  total: number;
  currency?: string;
  onCheckout: () => void;
  onRemoveAll: () => void;
}

type PaymentMethod = 'stripe' | 'payos'

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  total,
  currency = '£',
  onCheckout,
  onRemoveAll,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('stripe');
  const [discountCode, setDiscountCode] = useState('');

  const paymentMethods = [
    { id: 'stripe' as PaymentMethod, name: 'Stripe', logo: '/images/logo/stripe.jpg' },
    { id: 'payos' as PaymentMethod, name: 'PayOs', logo: '/images/logo/payos.png' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
      {/* Total */}
      <div className="mb-6">
        <h3 className="text-gray-600 text-sm mb-2">Total:</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl md:text-5xl font-bold text-gray-900">
            {total.toLocaleString()}
          </span>
          <span className="text-2xl font-medium text-gray-600">{currency}</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="text-gray-900 font-semibold text-lg mb-4">Payment Method</h3>
        <div className="grid grid-cols-2 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedPayment(method.id)}
              className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                selectedPayment === method.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Image src={method.logo} alt='payment-icon' width={64} height={64} />
                {/* <span className="text-sm font-medium text-gray-700">
                  {method.name}
                </span> */}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mb-6">
        <button
          onClick={onCheckout}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-all hover:shadow-lg active:scale-98"
        >
          Checkout
        </button>
        <button
          onClick={onRemoveAll}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-lg transition-all hover:shadow-lg active:scale-98"
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