'use client'

import { Button } from '@/components/shadcn/button'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Slider } from '@/components/shadcn/slider'
import { useGetAllAgeRangeQuery } from '@/features/resource/age-range/api/ageRangeApi'
import { resetParams, setMultipleParams, setParam, setSearchTerm } from '@/features/resource/kit/slice/kitProductSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import useDebounce from '@/hooks/useDebounce'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'

export interface ProductFilterSidebarProps {
  className?: string
}

export default function ProductFilterSidebar({ className }: ProductFilterSidebarProps) {
  const t = useTranslations('kits.list')
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.kit)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const { data: ageRanges } = useGetAllAgeRangeQuery()

  useEffect(() => {
    dispatch(setSearchTerm(debouncedSearch))
  }, [debouncedSearch, dispatch])

  const sortOptions = [
    { value: 'createdDateDesc', orderBy: 'createdDate', sortDirection: 'Desc', label: t('sortOptions.newest') },
    { value: 'priceAsc', orderBy: 'price', sortDirection: 'Asc', label: t('sortOptions.priceLowToHigh') },
    { value: 'priceDesc', orderBy: 'price', sortDirection: 'Desc', label: t('sortOptions.priceHighToLow') }
  ]

  const handleClear = () => {
    dispatch(resetParams())
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
  }

  return (
    <aside className={`w-full space-y-6 bg-white px-6 py-8 ${className}`}>
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className='h-10 rounded-2xl'
        />
      </div>
      <hr className='mb-4' />

      {/* Price Slider */}
      {/* <div className='space-y-3'>
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
      <hr className='mb-4' /> */}

      {/* Sort */}
      {/* <div className='flex items-center gap-3 space-y-2'>
        <Label className='text-sm font-medium text-gray-600'>{t('sort')}</Label>
        <Select
          value={
            sortOptions.find((opt) => opt.orderBy === filters.orderBy && opt.sortDirection === filters.sortDirection)
              ?.value ?? 'createdDateDesc'
          }
          onValueChange={(value) => {
            const selected = sortOptions.find((opt) => opt.value === value)
            if (selected) {
              dispatch(setParam({ key: 'orderBy', value: selected.orderBy }))
              dispatch(setParam({ key: 'sortDirection', value: selected.sortDirection }))
            }
          }}
        >
          <SelectTrigger className='h-10 rounded-lg'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <hr className='mb-4' /> */}

      {/* Status */}
      {/* <div className='space-y-2'>
        <Label className='text-sm font-medium text-gray-600'>{t('status')}</Label>
        <div className='space-y-2 pl-1'>
          <RadioGroup
            value={filters.isPreOrder === true ? 'preorder' : filters.isPreOrder === false ? 'available' : 'all'}
            onValueChange={(value) => {
              let newValue: boolean | undefined
              if (value === 'preorder') newValue = true
              else if (value === 'available') newValue = false
              else newValue = undefined // all
              dispatch(setParam({ key: 'isPreOrder', value: newValue }))
            }}
            className='space-y-2 pl-1'
          >
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='all' id='allStatus' />
              <Label htmlFor='allStatus'>{t('statusOptions.all')}</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='available' id='available' />
              <Label htmlFor='available'>{t('statusOptions.available')}</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='preorder' id='preorder' />
              <Label htmlFor='preorder'>{t('statusOptions.preOrder')}</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      <hr className='mb-4' /> */}

      {/* Age (Radio) */}
      <div className='space-y-2'>
        <Label className='text-sm font-medium text-gray-600'>{t('age')}</Label>
        <RadioGroup
          value={filters.age ?? 'all'}
          onValueChange={(value) => dispatch(setParam({ key: 'age', value }))}
          className='mt-1 space-y-2 pl-1'
        >
          <div className='space-y-2 pl-1'>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='all' id='age-all' />
              <Label htmlFor='age-all'>{t('ageOptions.all')}</Label>
            </div>
            {ageRanges?.data.items.map((ageRange) => (
              <div className='flex items-center space-x-2' key={ageRange.id}>
                <RadioGroupItem value={ageRange.ageRangeLabel} id={`age-${ageRange.ageRangeLabel}`} />
                <Label htmlFor={`age-${ageRange.ageRangeLabel}`}>{ageRange.ageRangeLabel}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>
    </aside>
  )
}
