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
      className={`relative flex flex-col flex-1 p-8 cursor-pointer transition-colors duration-300 rounded-2xl ${
        isSelected 
          ? 'bg-slate-900 text-white' 
          : 'bg-transparent text-slate-800'
      }`}
      animate={{
        scale: isSelected ? 1.05 : 1,
        y: isSelected ? -20 : 0,
        zIndex: isSelected ? 10 : 1,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {isPopular && (
        <div className="flex justify-end">
          <span className="bg-slate-700 text-sky-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="mb-6 pt-4">
        <motion.div
          key={displayPrice}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-baseline gap-1 mb-3"
        >
          <span className="text-5xl font-bold">${displayPrice}</span>
          <span className={`text-base ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}>
            {isYearly ? '/ 12 months' : '/ 6 months'}
          </span>
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className={`text-sm h-10 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
          {description}
        </p>
      </div>

      <div className="mb-8 space-y-2 flex-grow">
        {features.map((feature, idx) => (
          <FeatureItem key={idx} text={feature} isSelected={isSelected} />
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full py-3 rounded-full text-sm font-semibold transition-all ${
          isSelected
            ? 'bg-sky-400 text-white hover:bg-slate-600'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        Contact Us
      </motion.button>
    </motion.div>
  );
}