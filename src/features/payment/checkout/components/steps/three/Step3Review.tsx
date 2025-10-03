'use client';

import React, { useState } from 'react';
import type { CheckoutState } from '../../../types/types';
import Image from 'next/image';

type Props = {
  state: CheckoutState;
  currencyFmt: Intl.NumberFormat;
  shippingCost: number;
  tax: number;
  total: number;
  onBack: () => void;
  onPlaceOrder: () => void;
};

type PaymentMethod = 'stripe' | 'payos'

export function Step3Review({
  state,
  currencyFmt,
  shippingCost,
  tax,
  total,
  onBack,
  onPlaceOrder,
}: Props) {

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('stripe');

  const subtotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0);

  const paymentMethods = [
    { id: 'stripe' as PaymentMethod, name: 'Stripe', logo: '/images/logo/stripe.jpg' },
    { id: 'payos' as PaymentMethod, name: 'PayOs', logo: '/images/logo/payos.png' },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* LEFT: Order & Payment */}
      <div className="md:col-span-2 space-y-6">
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Order Summary</h3>

          <div className="space-y-4">
            {state.cart.map((i) => (
              <div key={i.id} className="flex items-center gap-3">
                <img
                  src={i.imageUrl}
                  alt={i.title}
                  className="h-14 w-14 rounded-md object-cover"
                />
                <div className="flex-1 text-sm">
                  <div className="font-medium text-gray-900">{i.title}</div>
                  <div className="text-xs text-gray-500">Qty: {i.qty}</div>
                </div>
                <div className="text-sm">
                  {currencyFmt.format(i.price * i.qty)}
                </div>
              </div>
            ))}

            <div className="h-px w-full bg-gray-200" />

            <div className="space-y-1 text-sm">
              <Row label="Subtotal" value={currencyFmt.format(subtotal)} />
              <Row label="Shipping" value={currencyFmt.format(shippingCost)} />
              <Row label="Tax" value={currencyFmt.format(tax)} />
              <div className="h-px w-full bg-gray-200" />
              <Row label="Total" value={currencyFmt.format(total)} bold />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Payment Method</h3>
          {/* Đây chỉ là mock UI để review. Tích hợp cổng thanh toán thật bạn có thể thay khối này */}
          <div className="mb-6">
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

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={onBack}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm"
            >
              Back
            </button>
            <button
              onClick={onPlaceOrder}
              className="flex-1 rounded-md bg-amber-400 px-6 py-3 text-white hover:bg-amber-500"
            >
              Confirm & Pay
            </button>
          </div>
        </section>
      </div>

      {/* RIGHT: Customer details */}
      <div className="md:col-span-1 space-y-6">
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">
            Customer Details
          </h3>
          <div className="text-sm">
            <Field label="Email" value={state.guestEmail || ''} />
            <Field label="Name" value={`${state.address.firstName} ${state.address.lastName}`} />
            <Field label="Phone" value={state.address.phone} />
            <Field
              label="Address"
              value={
                state.deliveryOption === 'collection'
                  ? 'Collection (no address required)'
                  : [
                      state.address.street1,
                      state.address.street2,
                      state.address.city,
                      state.address.postCode,
                      state.address.country,
                    ]
                      .filter(Boolean)
                      .join(', ')
              }
            />
            <Field
              label="Delivery"
              value={ `Home Delivery (${state.deliveryMethod})`
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? 'font-semibold' : ''}>{label}</span>
      <span className={bold ? 'font-semibold' : ''}>{value}</span>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-2">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-gray-900">{value || '—'}</div>
    </div>
  );
}
