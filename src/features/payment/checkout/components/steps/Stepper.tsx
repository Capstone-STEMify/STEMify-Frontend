'use client';

import React from 'react';

export function Stepper({ current }: { current: 1 | 2 | 3 }) {
  const DOT = 18;          
  const THICK = 6;         
  const progress = (current - 1) / 2; 

  return (
    <div className="mx-auto w-full max-w-5xl px-4">
      <div className="relative" style={{ height: DOT }}>
        <div
          className="absolute rounded bg-gray-300"
          style={{
            left: DOT / 2,
            width: `calc(100% - ${DOT}px)`,
            top: DOT / 2 - THICK / 2,
            height: THICK,
          }}
        />
        <div
          className="absolute rounded bg-amber-300 origin-left transition-transform"
          style={{
            left: DOT / 2,
            width: `calc(100% - ${DOT}px)`,
            top: DOT / 2 - THICK / 2,
            height: THICK,
            transform: `scaleX(${progress})`,
          }}
        />

        <Dot
          size={DOT}
          state={current >= 1 ? 'done' : 'todo'}
          style={{ left: 0 }}
        />
        <Dot
          size={DOT}
          state={current >= 2 ? 'done' : 'todo'}
          style={{ left: '50%', transform: 'translateX(-50%)' }}
        />
        <Dot
          size={DOT}
          state={current >= 3 ? 'done' : 'todo'}
          style={{ right: 0 }}
        />
      </div>

      {/* Nhãn dưới line */}
      <div className="mt-3 grid grid-cols-3 text-center text-[15px] text-gray-900">
        <span>1. Your Details</span>
        <span>2. Delivery</span>
        <span>3. Review &amp; Pay</span>
      </div>
    </div>
  );
}

function Dot({
  size,
  state,
  style,
}: {
  size: number;
  state: 'done' | 'todo';
  style?: React.CSSProperties;
}) {
  const done = state === 'done';
  return (
    <div
      className={`absolute z-10 rounded-full border ${
        done ? 'bg-amber-400 border-amber-400' : 'bg-white border-gray-400'
      }`}
      style={{ width: size, height: size, ...style }}
      aria-hidden
    />
  );
}
