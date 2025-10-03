import React from 'react';

interface DeliveryProgressProps {
  currentAmount: number;
  targetAmount: number;
}

export const DeliveryProgress: React.FC<DeliveryProgressProps> = ({
  currentAmount,
  targetAmount,
}) => {
  const remaining = targetAmount - currentAmount;
  const progress = (currentAmount / targetAmount) * 100;

  return (
    <div className="bg-gray-50 p-4 md:p-6 rounded-lg mb-6">
      <p className="text-sm md:text-base text-gray-800 mb-3">
        Spend <span className="font-bold">£{remaining.toFixed(2)}</span> more for free VN Standard Delivery
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-red-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}