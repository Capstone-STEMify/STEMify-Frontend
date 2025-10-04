'use client';

import React from 'react';
import type { Address } from '../../../../types/types';

export function ShippingAddressForm({
  value,
  onChange,
  disabled,
}: {
  value: Address;
  onChange: (v: Address) => void;
  disabled?: boolean;
}) {
  const set =
    <K extends keyof Address>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onChange({ ...value, [k]: e.target.value });

  return (
    <section className="rounded-lg border border-gray-200 p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">Shipping Address</h3>

      <div className="mb-3">
        <input
          disabled
          placeholder="Start typing to find your address"
          className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-gray-700">First Name *</label>
          <input
            disabled={disabled}
            value={value.firstName}
            onChange={set('firstName')}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700">Last Name *</label>
          <input
            disabled={disabled}
            value={value.lastName}
            onChange={set('lastName')}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700">Phone Number *</label>
          <input
            disabled={disabled}
            value={value.phone}
            onChange={set('phone')}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700">Street Address *</label>
          <input
            disabled={disabled}
            value={value.street1}
            onChange={set('street1')}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-medium text-gray-700">Address Line 2</label>
          <input
            disabled={disabled}
            value={value.street2 ?? ''}
            onChange={set('street2')}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700">Country *</label>
          <select
            disabled={disabled}
            value={value.country}
            onChange={set('country')}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2"
          >
            <option>United Kingdom</option>
            <option>Viet Nam</option>
            <option>Singapore</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700">City *</label>
          <input
            disabled={disabled}
            value={value.city}
            onChange={set('city')}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700">Post Code *</label>
          <input
            disabled={disabled}
            value={value.postCode}
            onChange={set('postCode')}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>
    </section>
  );
}
