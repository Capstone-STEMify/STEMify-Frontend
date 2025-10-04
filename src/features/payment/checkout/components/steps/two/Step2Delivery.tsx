'use client';

import React, { useMemo, useState } from 'react';
import type {
  Address,
  CheckoutState,
  DeliveryMethodKey,
  DeliveryOption,
} from '../../../types/types';
import { ShippingAddressForm } from './sections/ShippingAddressForm';
import { DeliveryMethod } from './sections/DeliveryMethod';
import { ShoppingBagSummary } from './sections/ShoppingBagSummary';

type Props = {
  state: CheckoutState;
  prices: Record<DeliveryMethodKey, number>;
  currencyFmt: Intl.NumberFormat;
  onChangeDeliveryOption: (opt: DeliveryOption) => void;
  onChangeDeliveryMethod: (method: DeliveryMethodKey) => void;
  onChangeAddress: (addr: Address) => void;
  onContinue: () => void;
};

export function Step2Delivery({
  state,
  prices,
  currencyFmt,
  onChangeDeliveryMethod,
  onChangeAddress,
  onContinue,
}: Props) {
  const [localAddr, setLocalAddr] = useState<Address>(state.address);

  const shippingCost = useMemo<number>(() => {
    if (state.deliveryOption === 'collection') return 0;
    return prices[state.deliveryMethod];
  }, [state.deliveryMethod, state.deliveryOption, prices]);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* LEFT */}
      <div className="md:col-span-2 space-y-6">
        <ShippingAddressForm
          value={localAddr}
          onChange={(addr) => {
            setLocalAddr(addr);
            onChangeAddress(addr);
          }}
          disabled={state.deliveryOption === 'collection'}
        />

        <DeliveryMethod
          selected={state.deliveryMethod}
          onChange={onChangeDeliveryMethod}
          prices={prices}
          currencyFmt={currencyFmt}
          disabled={state.deliveryOption === 'collection'}
        />

        <div className="pt-1">
          <button
            onClick={onContinue}
            className="w-full rounded-md bg-amber-400 px-6 py-3 text-white hover:bg-amber-500"
          >
            Go to payment
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="md:col-span-1">
        <ShoppingBagSummary
          items={state.cart}
          shipping={shippingCost}
          tax={1}
          currencyFmt={currencyFmt}
        />
      </div>
    </div>
  );
}
