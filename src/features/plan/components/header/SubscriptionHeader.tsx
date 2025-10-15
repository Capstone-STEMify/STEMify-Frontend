import React from 'react';
import { motion } from 'framer-motion';

export function SubscriptionHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl md:text-5xl font-semibold text-gray-800 mb-4">
        Plans & Pricing
      </h1>
      <p className="text-gray-500 text-base max-w-md">
        Whether your time-saving automation needs are large or small, 
        we're here to help you scale.
      </p>
    </motion.div>
  );
}