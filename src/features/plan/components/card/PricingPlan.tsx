import { FeatureItem } from "../item/FeatureItem";
import React from 'react';
import { motion } from 'framer-motion';

interface PricingPlanItemProps {
  title: string;
  price: number;
  description: string;
  features: string[];
  isSelected: boolean;
  isPopular?: boolean;
  onSelect: () => void;
  isYearly: boolean;
}

export function PricingPlanItem({
  title,
  price,
  description,
  features,
  isSelected,
  isPopular = false,
  onSelect,
  isYearly
}: PricingPlanItemProps) {
  const yearlyPrice = Math.floor(price * 10);
  const displayPrice = isYearly ? yearlyPrice : price;

  return (
    <motion.div
      onClick={onSelect}
      className={`relative flex-1 p-8 cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 text-white z-10' 
          : 'bg-transparent text-gray-800'
      }`}
      animate={{
        y: isSelected ? -10 : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="mb-6">
        <motion.div
          key={displayPrice}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-baseline gap-1 mb-3"
        >
          <span className="text-5xl font-bold">${displayPrice}</span>
          <span className={`text-base ${isSelected ? 'text-purple-200' : 'text-gray-500'}`}>
            /month
          </span>
        </motion.div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className={`text-sm ${isSelected ? 'text-purple-100' : 'text-gray-500'}`}>
          {description}
        </p>
      </div>

      <div className="mb-8 space-y-1">
        {features.map((feature, idx) => (
          <FeatureItem key={idx} text={feature} isSelected={isSelected} />
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full py-3 rounded-full text-sm font-semibold transition-all ${
          isSelected
            ? 'bg-white text-purple-700 hover:bg-purple-50'
            : 'bg-purple-500 text-white hover:bg-purple-600'
        }`}
      >
        Choose plan
      </motion.button>
    </motion.div>
  );
}