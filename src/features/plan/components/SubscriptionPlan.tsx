'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SubscriptionHeader } from './header/SubscriptionHeader';
import { BillingToggle } from './toggle/BillingToggle';
import { PricingPlanItem } from './card/PricingPlan';

export default function SubscriptionPlan() {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(2); // Company is selected by default

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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-purple-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side - Header and Toggle */}
          <div className="md:w-1/3">
            <SubscriptionHeader />
            <BillingToggle isYearly={isYearly} onToggle={setIsYearly} />
          </div>

          {/* Right side - Pricing Cards Container */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="md:w-2/3"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
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