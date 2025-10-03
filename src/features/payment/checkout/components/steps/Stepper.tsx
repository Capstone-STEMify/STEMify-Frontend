'use client';

import React from 'react';

export function Stepper({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { id: 1, label: "1. Your Details" },
    { id: 2, label: '2. Delivery' },
    { id: 3, label: '3. Review & Pay' },
  ];

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {steps.map((s, idx) => (
          <div key={s.id} className="flex-1">
            <div className="flex items-center gap-2">
              <span
                className={[
                  'grid h-4 w-4 place-items-center rounded-full',
                  current >= s.id ? 'bg-red-600' : 'bg-gray-300',
                ].join(' ')}
              >
                <span className="sr-only">step {s.id}</span>
              </span>
              <span
                className={[
                  'text-xs md:text-[11px]',
                  current >= s.id ? 'text-gray-900' : 'text-gray-500',
                ].join(' ')}
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="mt-2 h-0.5 w-full rounded bg-gray-200">
                <div
                  className={[
                    'h-0.5 rounded',
                    current > s.id ? 'w-full bg-red-600' : 'w-0 bg-transparent',
                  ].join(' ')}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
