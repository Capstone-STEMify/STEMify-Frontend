import type React from 'react'

import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Check } from 'lucide-react'

export default function Step2SubscriptionConfiguration({ formData, setFormData }: { formData: any; setFormData: any }) {
  const packages = [
    { value: 'basic', label: 'Basic', description: 'Essential features for small teams' },
    { value: 'professional', label: 'Professional', description: 'Advanced features for growing organizations' },
    { value: 'enterprise', label: 'Enterprise', description: 'Full sshadcnte for large organizations' }
  ]

  const billingCycles = [
    { value: 'monthly', label: 'Monthly', discount: null },
    { value: 'quarterly', label: 'Quarterly', discount: '5% off' },
    { value: 'annually', label: 'Annually', discount: '15% off' }
  ]

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='mb-4 text-2xl font-bold text-slate-900'>Configure Subscription</h2>
        <p className='text-slate-600'>Select your subscription plan and options</p>
      </div>

      {/* Package Selection */}
      <div className='space-y-2'>
        <Label className='text-sm font-medium text-slate-700'>
          Package <span className='text-red-500'>*</span>
        </Label>
        <div className='grid gap-3 md:grid-cols-3'>
          {packages.map((pkg) => (
            <button
              key={pkg.value}
              type='button'
              onClick={() => setFormData({ ...formData, package: pkg.value })}
              className={`flex flex-col items-start rounded-lg border-2 p-4 text-left transition-all ${
                formData.package === pkg.value
                  ? 'border-slate-900 bg-slate-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className='mb-2 flex w-full items-center justify-between'>
                <span className='font-semibold text-slate-900'>{pkg.label}</span>
                {formData.package === pkg.value && <Check className='h-5 w-5 text-slate-900' />}
              </div>
              <span className='text-sm text-slate-600'>{pkg.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Billing Cycle */}
      <div className='space-y-2'>
        <Label className='text-sm font-medium text-slate-700'>
          Billing Cycle <span className='text-red-500'>*</span>
        </Label>
        <div className='grid gap-3 md:grid-cols-3'>
          {billingCycles.map((cycle) => (
            <button
              key={cycle.value}
              type='button'
              onClick={() => setFormData({ ...formData, billingCycle: cycle.value })}
              className={`flex flex-col items-start rounded-lg border-2 p-4 text-left transition-all ${
                formData.billingCycle === cycle.value
                  ? 'border-slate-900 bg-slate-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className='mb-1 flex w-full items-center justify-between'>
                <span className='font-semibold text-slate-900'>{cycle.label}</span>
                {formData.billingCycle === cycle.value && <Check className='h-5 w-5 text-slate-900' />}
              </div>
              {cycle.discount && <span className='text-sm font-medium text-green-600'>{cycle.discount}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Tier Selection */}
      <div className='space-y-2'>
        <Label htmlFor='tier' className='text-sm font-medium text-slate-700'>
          Tier <span className='text-red-500'>*</span>
        </Label>
        <Select value={formData.tier} onValueChange={(value) => setFormData({ ...formData, tier: value })}>
          <SelectTrigger id='tier' className='border-slate-300'>
            <SelectValue placeholder='Select tier' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='starter'>Starter - Up to 50 users</SelectItem>
            <SelectItem value='growth'>Growth - Up to 200 users</SelectItem>
            <SelectItem value='scale'>Scale - Up to 500 users</SelectItem>
            <SelectItem value='unlimited'>Unlimited - Unlimited users</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Number of Seats */}
      <div className='space-y-2'>
        <Label htmlFor='seats' className='text-sm font-medium text-slate-700'>
          Number of Seats <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='seats'
          type='number'
          min='1'
          placeholder='Enter number of seats'
          value={formData.seats}
          onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
          className='border-slate-300'
        />
        <p className='text-xs text-slate-500'>Specify how many user seats you need</p>
      </div>

      {/* Curriculum Selection */}
      <div className='space-y-2'>
        <Label htmlFor='curriculum' className='text-sm font-medium text-slate-700'>
          Curriculum
        </Label>
        <Select value={formData.curriculum} onValueChange={(value) => setFormData({ ...formData, curriculum: value })}>
          <SelectTrigger id='curriculum' className='border-slate-300'>
            <SelectValue placeholder='Select curriculum (optional)' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='standard'>Standard Curriculum</SelectItem>
            <SelectItem value='advanced'>Advanced Curriculum</SelectItem>
            <SelectItem value='custom'>Custom Curriculum</SelectItem>
            <SelectItem value='stem'>STEM Focus</SelectItem>
            <SelectItem value='business'>Business & Management</SelectItem>
            <SelectItem value='creative'>Creative Arts</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
