'use client';

import React from 'react';
import type { DeliveryMethodKey } from '../../../../types/types';

export function DeliveryMethod({
  selected,
  onChange,
  prices,
  currencyFmt,
  disabled,
}: {
  selected: DeliveryMethodKey;
  onChange: (v: DeliveryMethodKey) => void;
  prices: Record<DeliveryMethodKey, number>;
  currencyFmt: Intl.NumberFormat;
  disabled?: boolean;
}) {
  const Opt: React.FC<{
    id: DeliveryMethodKey;
    title: string;
    sub?: string;
  }> = ({ id, title, sub }) => (
    <label
      className={[
        'flex cursor-pointer items-start justify-between gap-4 rounded-md border p-3',
        selected === id ? 'border-amber-600 bg-amber-50' : 'border-gray-300 bg-white',
        disabled ? 'opacity-60' : '',
      ].join(' ')}
    >
      <span className="flex-1">
        <input
          type="radio"
          name="deliveryMethod"
          className="mr-2 align-middle accent-amber-600"
          checked={selected === id}
          onChange={() => onChange(id)}
          disabled={disabled}
        />
        <span className="text-sm font-medium text-gray-900">{title}</span>
        {sub && <div className="mt-1 text-xs text-gray-500">{sub}</div>}
      </span>
      <span className="text-sm text-gray-900">{currencyFmt.format(prices[id])}</span>
    </label>
  );

  return (
    <section className="rounded-lg border border-gray-200 p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">Delivery Method</h3>
      <div className="space-y-3">
        <Opt id="standard" title="Standard Delivery" sub="3–5 Working Days" />
        <Opt
          id="nextDay"
          title="Next Day Delivery"
          sub="Order before 12 PM (Mon to Fri) for next working day delivery"
        />
        <Opt id="named" title="Named Day" />
      </div>
    </section>
  );
}
