'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SubscriptionHeader } from './header/SubscriptionHeader';
import { BillingToggle } from './toggle/BillingToggle';
import { PricingPlanItem } from './card/PricingPlan';

export default function SubscriptionPlan() {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(2); 

  const plans = [
    {
      title: 'Starter',
      price: 19,
      description: 'Unleash the power of automation.',
      features: [
        'Multi-step Zaps',
        '3 Premium Apps',
        '2 Users team'
      ]
    },
    {
      title: 'Professional',
      price: 54,
      description: 'Advanced tools to take your work to the next level.',
      features: [
        'Multi-step Zaps',
        'Unlimited Premium',
        '50 Users team',
        'Shared Workspace'
      ]
    },
    {
      title: 'Company',
      price: 89,
      description: 'Automation plus enterprise-grade features.',
      features: [
        'Multi-step Zap',
        'Unlimited Premium',
        'Unlimited Users Team',
        'Advanced Admin',
        'Custom Data Retention'
      ],
      isPopular: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 py-5 px-4 flex items-center justify-center">
      <div className="max-w-5xl mx-auto w-full">
        <div>
          <div className="flex justify-between">
            <SubscriptionHeader />
            <BillingToggle isYearly={isYearly} onToggle={setIsYearly} />
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-3xl shadow-2xl px-15 py-5">
              <div className="flex flex-col md:flex-row gap-10 md:gap-0">
                {plans.map((plan, index) => (
                  <PricingPlanItem
                    key={index}
                    {...plan}
                    isSelected={selectedPlan === index}
                    onSelect={() => setSelectedPlan(index)}
                    isYearly={isYearly}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}