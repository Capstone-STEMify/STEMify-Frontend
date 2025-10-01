'use client'

import { Button } from '@/components/shadcn/button'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Slider } from '@/components/shadcn/slider'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

export default function ProductFilterSidebar() {
  const t = useTranslations('kits.list')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string[]>([])
  const [age, setAge] = useState<string>('all')

  const handleClear = () => {
    setPriceRange([0, 2000])
    setSearch('')
    setStatus([])
    setAge('all')
  }

  const toggleStatus = (value: string) => {
    setStatus((prev) => (prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]))
  }

  return (
    <aside className='border-grey-300 w-full space-y-6 rounded-xl border-1 bg-white px-6 py-8 shadow-md'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold tracking-tight text-gray-800'>{t('Filters')}</h2>
        <Button
          size='sm'
          onClick={handleClear}
          className='rounded-xl border-1 border-red-500 bg-white text-xs text-red-500 hover:bg-red-50 hover:text-red-600'
        >
          {t('clear')}
        </Button>
      </div>

      {/* Search */}
      <div className='space-y-2'>
        <Label htmlFor='search' className='text-sm font-medium text-gray-600'>
          {t('search')}
        </Label>
        <Input
          id='search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className='h-10 rounded-2xl'
        />
      </div>
      <hr className='mb-4' />

      {/* Price Slider */}
      <div className='space-y-3'>
        <Label className='text-sm font-medium text-gray-600'>{t('priceRange')}</Label>
        <Slider
          value={priceRange}
          min={0}
          max={5000000}
          step={50000}
          onValueChange={(v) => setPriceRange(v as [number, number])}
        />
        <div className='text-muted-foreground flex justify-between text-sm'>
          <span>{priceRange[0].toLocaleString('vi-VN')} VND</span>
          <span>{priceRange[1].toLocaleString('vi-VN')} VND</span>
        </div>
      </div>
      <hr className='mb-4' />

      {/* Sort */}
      <div className='flex items-center gap-3 space-y-2'>
        <Label className='text-sm font-medium text-gray-600'>{t('sort')}</Label>
        <Select defaultValue='newest'>
          <SelectTrigger className='h-10 rounded-lg'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='newest'>{t('sortOptions.newest')}</SelectItem>
            <SelectItem value='price-asc'>{t('sortOptions.priceLowToHigh')}</SelectItem>
            <SelectItem value='price-desc'>{t('sortOptions.priceHighToLow')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <hr className='mb-4' />

      {/* Status */}
      <div className='space-y-2'>
        <Label className='text-sm font-medium text-gray-600'>{t('status')}</Label>
        <div className='space-y-2 pl-1'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='available'
              checked={status.includes('available')}
              onCheckedChange={() => toggleStatus('available')}
            />
            <Label htmlFor='available'>{t('statusOptions.available')}</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='preorder'
              checked={status.includes('preorder')}
              onCheckedChange={() => toggleStatus('preorder')}
            />
            <Label htmlFor='preorder'>{t('statusOptions.preOrder')}</Label>
          </div>
        </div>
      </div>
      <hr className='mb-4' />

      {/* Age (Radio) */}
      <div className='space-y-2'>
        <Label className='text-sm font-medium text-gray-600'>Age</Label>
        <RadioGroup value={age} onValueChange={setAge} className='mt-1 space-y-2 pl-1'>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='all' id='age-all' />
            <Label htmlFor='age-all'>{t('ageOptions.all')}</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='4+' id='age-4' />
            <Label htmlFor='age-4'>4+</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='6+' id='age-6' />
            <Label htmlFor='age-6'>6+</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='8+' id='age-8' />
            <Label htmlFor='age-8'>8+</Label>
          </div>
        </RadioGroup>
      </div>
    </aside>
  )
}
