'use client';

import React, { useMemo, useState } from 'react';

import { Step1StartCheckout } from './steps/one/Step1StartCheckout';


import type {
  Address,
  CartItem,
  CheckoutState,
  DeliveryMethodKey,
  DeliveryOption,
} from '../types/types';
import { Stepper } from './steps/Stepper';
import { Step2Delivery } from './steps/two/Step2Delivery';
import { Step3Review } from './steps/three/Step3Review';

const GBP = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

const demoCart: CartItem[] = [
  {
    id: 'hamleys-shopper',
    title: "HAMLEY'S® Hamleys London Shopper",
    imageUrl:
      'https://eduall.vn/wp-content/uploads/2024/06/stem-kit-yolo-starter-kit-3-500x500-1.png',
    qty: 1,
    price: 6.0,
  },
];

const emptyAddress: Address = {
  firstName: '',
  lastName: '',
  phone: '',
  street1: '',
  street2: '',
  country: 'United Kingdom',
  city: '',
  postCode: '',
};

export default function PaymentCheckout() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [state, setState] = useState<CheckoutState>({
    guestEmail: '',
    deliveryOption: 'home',
    deliveryMethod: 'standard',
    address: emptyAddress,
    cart: demoCart,
  });

  const shippingCost = useMemo<number>(() => {
    const table: Record<DeliveryMethodKey, number> = {
      standard: 4.99,
      nextDay: 5.99,
      named: 5.99,
    };
    // Collection => 0đ ship
    if (state.deliveryOption === 'collection') return 0;
    return table[state.deliveryMethod];
  }, [state.deliveryMethod, state.deliveryOption]);

  const subtotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = 1; // mock to match screenshot feel
  const total = subtotal + shippingCost + tax;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <Stepper current={step} />
      <div className="mt-6">
        {step === 1 && (
          <Step1StartCheckout
            email={state.guestEmail ?? ''}
            onGuestContinue={(email) => {
              setState((s) => ({ ...s, guestEmail: email }));
              setStep(2);
            }}
            onGoLogin={() => alert('Navigate to /login (mock)')}
            onGoRegister={() => alert('Navigate to /register (mock)')}
          />
        )}

        {step === 2 && (
          <Step2Delivery
            state={state}
            prices={{ standard: 4.99, nextDay: 5.99, named: 5.99 }}
            currencyFmt={GBP}
            onChangeDeliveryOption={(opt: DeliveryOption) =>
              setState((s) => ({ ...s, deliveryOption: opt }))
            }
            onChangeDeliveryMethod={(m: DeliveryMethodKey) =>
              setState((s) => ({ ...s, deliveryMethod: m }))
            }
            onChangeAddress={(addr) => setState((s) => ({ ...s, address: addr }))}
            onContinue={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <Step3Review
            state={state}
            currencyFmt={GBP}
            shippingCost={shippingCost}
            tax={tax}
            total={total}
            onBack={() => setStep(2)}
            onPlaceOrder={() => alert('✅ Mock: order placed!')}
          />
        )}
      </div>
    </div>
  );
}
