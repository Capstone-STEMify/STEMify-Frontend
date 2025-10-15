// file: BillingToggle.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface BillingToggleProps {
  isYearly: boolean;
  onToggle: (isYearly: boolean) => void;
}

export function BillingToggle({ isYearly, onToggle }: BillingToggleProps) {
  const spring = {
    type: "spring",
    stiffness: 500,
    damping: 30
  } as const;

  return (
    <div className="flex items-center p-1 rounded-full bg-white w-fit shadow-lg border">
      <button
        onClick={() => onToggle(false)}
        className={`relative w-24 py-2 text-sm font-semibold text-center transition-colors duration-300 ${
          !isYearly ? 'text-white' : 'text-slate-500'
        }`}
      >
        {!isYearly && (
          <motion.span
            layoutId="pill"
            className="absolute inset-0 z-0 bg-sky-400 rounded-full"
            transition={spring}
          />
        )}
        <span className="relative z-10">SEMESTERLY</span>
      </button>

      <button
        onClick={() => onToggle(true)}
        className={`relative w-24 py-2 text-sm font-semibold text-center transition-colors duration-300 ${
          isYearly ? 'text-white' : 'text-slate-500'
        }`}
      >
        {isYearly && (
          <motion.span
            layoutId="pill"
            className="absolute inset-0 z-0 bg-sky-400 rounded-full"
            transition={spring}
          />
        )}
        <span className="relative z-10">YEARLY</span>
      </button>
    </div>
  );
}