'use client';

import React from 'react';
import type { CartItem } from '../../../../types/types';

export function ShoppingBagSummary({
  items,
  shipping,
  tax,
  currencyFmt,
}: {
  items: CartItem[];
  shipping: number;
  tax: number;
  currencyFmt: Intl.NumberFormat;
}) {
  const productTotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const total = productTotal + shipping + tax;

  return (
    <aside className="rounded-lg border border-gray-200 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Shopping Bag</h3>
        <button className="rounded-md border px-2 py-1 text-xs">Add a Promo Code</button>
      </div>

      <div className="space-y-4">
        {items.map((i) => (
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
            <div className="text-sm">{currencyFmt.format(i.price * i.qty)}</div>
          </div>
        ))}

        <div className="h-px w-full bg-gray-200" />

        <div className="space-y-1 text-sm">
          <Row label="Product Total" value={currencyFmt.format(productTotal)} />
          <Row label="Shipping" value={currencyFmt.format(shipping)} />
          <Row label="Tax" value={currencyFmt.format(tax)} />
          <div className="h-px w-full bg-gray-200" />
          <Row label="Total" value={currencyFmt.format(total)} bold />
        </div>
      </div>
    </aside>
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
