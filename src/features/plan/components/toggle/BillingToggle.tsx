import React from 'react';
import { motion } from 'framer-motion';

interface BillingToggleProps {
  isYearly: boolean;
  onToggle: (isYearly: boolean) => void;
}

export function BillingToggle({ isYearly, onToggle }: BillingToggleProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="flex gap-1 mb-12 p-1 rounded-full bg-white w-fit shadow-sm border"
    >
      <button
        onClick={() => onToggle(false)}
        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
          !isYearly 
            ? 'bg-purple-600 text-white shadow' 
            : 'bg-transparent text-slate-500'
        }`}
      >
        MONTHLY
      </button>
      <button
        onClick={() => onToggle(true)}
        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
          isYearly 
            ? 'bg-purple-600 text-white shadow' 
            : 'bg-transparent text-slate-500'
        }`}
      >
        YEARLY
      </button>
    </motion.div>
  );
}