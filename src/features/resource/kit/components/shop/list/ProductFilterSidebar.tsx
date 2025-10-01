'use client'

import { Button } from '@/components/shadcn/button'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Slider } from '@/components/shadcn/slider'
import { resetParams, setMultipleParams, setParam, setSearchTerm } from '@/features/resource/kit/slice/kitProductSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import useDebounce from '@/hooks/useDebounce'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'

export default function ProductFilterSidebar() {
  const t = useTranslations('kits.list')
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.kit)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000])
  const debouncedPrice = useDebounce(priceRange, 500)

  useEffect(() => {
    dispatch(setSearchTerm(debouncedSearch))
  }, [debouncedSearch, dispatch])

  useEffect(() => {
    dispatch(setMultipleParams({ minPrice: debouncedPrice[0], maxPrice: debouncedPrice[1] }))
  }, [debouncedPrice, dispatch])

  const handleClear = () => {
    dispatch(resetParams())
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
  }

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range)
  }

  return (
    <aside className='border-grey-300 w-full space-y-6 rounded-xl border bg-white px-6 py-8 shadow-md'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold tracking-tight text-gray-800'>{t('Filters')}</h2>
        <Button
          size='sm'
          onClick={handleClear}
          className='rounded-xl border border-red-500 bg-white text-xs text-red-500 hover:bg-red-50 hover:text-red-600'
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
          value={filters.search}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
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
          <span>{(filters.minPrice ?? 0).toLocaleString('vi-VN')} VND</span>
          <span>{(filters.maxPrice ?? 5000000).toLocaleString('vi-VN')} VND</span>
        </div>
      </div>
      <hr className='mb-4' />

      {/* Sort */}
      <div className='flex items-center gap-1 space-y-2'>
        <Label className='text-sm font-medium text-gray-600'>{t('sort')}</Label>
        <Select
          value={filters.orderBy ?? 'newest'}
          onValueChange={(value) => dispatch(setParam({ key: 'orderBy', value }))}
        >
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

      {/* Sort */}

      <hr className='mb-4' />

      {/* Status */}
      <div className='space-y-2'>
        <Label className='text-sm font-medium text-gray-600'>{t('status')}</Label>
        <RadioGroup
          value={
            filters.isPreorder === true ? 'isPreorder' : filters.isPreorder === false ? 'isAvailable' : 'allStatus'
          }
          onValueChange={(val) => {
            if (val === 'allStatus') {
              // xoá param => không filter
              dispatch(setParam({ key: 'isPreorder', value: undefined }))
            } else if (val === 'isPreorder') {
              dispatch(setParam({ key: 'isPreorder', value: true }))
            } else if (val === 'isAvailable') {
              dispatch(setParam({ key: 'isPreorder', value: false }))
            }
          }}
          className='mt-1 space-y-2 pl-1'
        >
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='available'
              checked={filters.isPreOrder}
              onCheckedChange={() =>
                dispatch(setParam({ key: 'isPreOrder', value: filters.isPreOrder ? undefined : true }))
              }
            />
            <Label htmlFor='available'>{t('statusOptions.available')}</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='preorder'
              checked={filters.isPreOrder === true}
              onCheckedChange={() =>
                dispatch(setParam({ key: 'isPreOrder', value: filters.isPreOrder ? undefined : true }))
              }
            />
            <Label htmlFor='preorder'>{t('statusOptions.preOrder')}</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='isAvailable' id='isAvailable' />
            <Label htmlFor='isAvailable'>{t('statusOptions.available')}</Label>
          </div>
        </RadioGroup>
      </div>

      <hr className='mb-4' />

      {/* Age (Radio) */}
      {/* <div className='space-y-2'>
        <Label className='text-sm font-medium text-gray-600'>Age</Label>
        <RadioGroup
          value={filters.age ?? 'all'}
          onValueChange={(value) => dispatch(setParam({ key: 'age', value }))}
          className='mt-1 space-y-2 pl-1'
        >
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='age-all' id='age-all' />
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
      </div> */}
    </aside>
  )
}
