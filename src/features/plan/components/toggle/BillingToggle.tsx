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
      className="flex gap-3 mb-12"
    >
      <button
        onClick={() => onToggle(false)}
        className={`px-8 py-2 rounded-full text-sm font-semibold transition-all ${
          !isYearly 
            ? 'bg-purple-600 text-white' 
            : 'bg-white text-gray-700'
        }`}
      >
        MONTHLY
      </button>
      <button
        onClick={() => onToggle(true)}
        className={`px-8 py-2 rounded-full text-sm font-semibold transition-all ${
          isYearly 
            ? 'bg-purple-600 text-white' 
            : 'bg-white text-gray-700'
        }`}
      >
        YEARLY
      </button>
    </motion.div>
  );
}