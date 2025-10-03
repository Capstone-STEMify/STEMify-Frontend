'use client';

import React, { useEffect, useRef, useState } from 'react';

type Props = {
  email?: string;
  onGuestContinue: (email: string) => void;
  onGoLogin: () => void;
  onGoRegister: () => void;
};

type Section = 'guest' | 'signin' | 'create' | null;

export function Step1StartCheckout({
  email = '',
  onGuestContinue,
  onGoLogin,
  onGoRegister,
}: Props) {
  const [active, setActive] = useState<Section>('guest');
  const [guestEmail, setGuestEmail] = useState(email);
  const inputRef = useRef<HTMLInputElement>(null);

  // Nếu vì lý do nào đó input bị blur khi đang gõ, ta refocus lại rất nhẹ.
  useEffect(() => {
    if (active === 'guest' && inputRef.current) {
      if (document.activeElement !== inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
    }
  }, [guestEmail, active]);

  const SectionCard: React.FC<{
    title: string;
    subtitle: string;
    isOpen: boolean;
    onToggle: () => void;
    children?: React.ReactNode;
  }> = ({ title, subtitle, isOpen, onToggle, children }) => (
    <div
      className={[
        'rounded-xl border border-gray-200 bg-gray-50 transition',
        isOpen ? 'ring-1 ring-amber-200' : '',
      ].join(' ')}
    >
      <button
        type="button"
        className="w-full rounded-xl px-6 py-5 text-left"
        onClick={onToggle}
        onMouseDown={(e) => e.preventDefault()}
      >
        <div className="text-lg font-semibold text-gray-900">{title}</div>
        <div className="mt-1 text-sm text-gray-600">{subtitle}</div>
      </button>

      <div
        className={`px-6 pb-6 ${isOpen ? 'block' : 'hidden'}`}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Start Checkout</h1>

      <div className="mt-6 space-y-4">
        {/* Checkout as a guest */}
        <SectionCard
          title="Checkout as a guest"
          subtitle="Checkout now - You can create an account once you’ve completed your order."
          isOpen={active === 'guest'}
          onToggle={() => setActive((a) => (a === 'guest' ? null : 'guest'))}
        >
          <label htmlFor="guest-email" className="block text-sm font-medium text-gray-900">
            Email Address <span className="text-red-600">*</span>
          </label>
          <input
            id="guest-email"
            ref={inputRef}
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:border-amber-500"
            onKeyDownCapture={(e) => e.stopPropagation()}
          />
          <p className="mt-2 text-xs text-gray-600">
            ▲ You can create an account after checkout.
          </p>
          <button
            onClick={() => onGuestContinue(guestEmail)}
            className="mt-4 w-full rounded-full bg-amber-400 px-6 py-3 text-white hover:bg-amber-500"
          >
            Continue as a guest
          </button>
        </SectionCard>

        {/* Sign-in and checkout */}
        <SectionCard
          title="Sign-in and checkout"
          subtitle="Have an account? Log in here"
          isOpen={active === 'signin'}
          onToggle={() => setActive((a) => (a === 'signin' ? null : 'signin'))}
        >
          <button
            onClick={onGoLogin}
            className="rounded-full bg-gray-900 px-5 py-2.5 text-sm text-white hover:bg-black"
          >
            Go to Login
          </button>
        </SectionCard>

        {/* Create an account */}
        <SectionCard
          title="Create an account"
          subtitle="Sign up for a faster checkout experience"
          isOpen={active === 'create'}
          onToggle={() => setActive((a) => (a === 'create' ? null : 'create'))}
        >
          <button
            onClick={onGoRegister}
            className="rounded-full bg-gray-900 px-5 py-2.5 text-sm text-white hover:bg-black"
          >
            Go to Register
          </button>
        </SectionCard>
      </div>
    </div>
  );
}
