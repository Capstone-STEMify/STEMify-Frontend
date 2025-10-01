'use client'

import { Button } from '@/components/shadcn/button'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Slider } from '@/components/shadcn/slider'
import SSelect from '@/components/shared/SSelect'
import { resetParams, setPageSize, setParam, setSearchTerm } from '@/features/resource/kit/slice/kitSlice'
import { KitProductStatus } from '@/features/resource/kit/types/kit.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import useDebounce from '@/hooks/useDebounce'
import { getLabel } from '@/utils/index'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

export default function ProductFilterSidebar() {
  const t = useTranslations('kits.list')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])

  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.kit)
  const debouncedSearchQuery = useDebounce(filters.search || '', 500)

  // Clear all filters and reset page size
  const clearAll = () => {
    dispatch(resetParams())
    dispatch(setPageSize(6))
  }

  const hasFilters = Boolean(debouncedSearchQuery || filters.ageRangeId || filters.status)

  // Function to render filter tags
  const renderFilterTag = (
    key: keyof typeof filters,
    label: string,
    color: string,
    options?: { value: string; label: string }[]
  ) =>
    filters[key] && (
      <span className={`inline-flex items-center gap-1 rounded-full ${color} px-3 py-1 text-sm`}>
        {label}: {getLabel(filters[key], options ?? [])}
        <X className='h-3 w-3 cursor-pointer' onClick={() => dispatch(setParam({ key, value: '' }))} />
      </span>
    )

  // Options for selects
  //   const ageRangeOptions = getOptions(ageRanges?.data.items, 'ageRangeLabel')
  const statusOptions = Object.entries(KitProductStatus)
    .filter(([key]) => key.toLowerCase() !== 'deleted')
    .map(([key, value]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
      value: value
    }))

  const sortOptions = [
    {
      label: t('sortOptions.newest'),
      value: JSON.stringify({ orderBy: 'createdDate', sortOrder: 'DESC' })
    },
    {
      label: t('sortOptions.priceLowToHigh'),
      value: JSON.stringify({ orderBy: 'price', sortOrder: 'ASC' })
    },
    {
      label: t('sortOptions.priceHighToLow'),
      value: JSON.stringify({ orderBy: 'price', sortOrder: 'DESC' })
    },
    {
      label: t('sortOptions.nameAToZ'),
      value: JSON.stringify({ orderBy: 'name', sortOrder: 'ASC' })
    },
    {
      label: t('sortOptions.nameZToA'),
      value: JSON.stringify({ orderBy: 'name', sortOrder: 'DESC' })
    }
  ]
  return (
    <aside className='border-grey-300 w-full space-y-6 rounded-xl border-1 bg-white px-6 py-8 shadow-md'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold tracking-tight text-gray-800'>{t('Filters')}</h2>
        <Button
          size='sm'
          onClick={clearAll}
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
          <span>{priceRange[0].toLocaleString('vi-VN')} VND</span>
          <span>{priceRange[1].toLocaleString('vi-VN')} VND</span>
        </div>
      </div>
      <hr className='mb-4' />

      {/* Sort */}
      <div className='flex items-center gap-1 space-y-2'>
        <Label className='text-sm font-medium text-gray-600'>{t('sort')}</Label>
        <SSelect
          placeholder={t('list.placeholder.sort')}
          value={
            filters.orderBy && filters.sortOrder
              ? JSON.stringify({ orderBy: filters.orderBy, sortOrder: filters.sortOrder })
              : JSON.stringify({ orderBy: 'createdDate', sortOrder: 'DESC' })
          }
          onChange={(val) => {
            const option = JSON.parse(val)
            dispatch(setParam({ key: 'orderBy', value: option.orderBy }))
            dispatch(setParam({ key: 'sortOrder', value: option.sortOrder }))
          }}
          options={sortOptions}
        />
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
            <RadioGroupItem value='allStatus' id='allStatus' />
            <Label htmlFor='allStatus'>{t('statusOptions.all')}</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='isPreorder' id='isPreorder' />
            <Label htmlFor='isPreorder'>{t('statusOptions.preOrder')}</Label>
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
          value={filters.ageRangeId ? filters.ageRangeId.toString() : ''}
          onValueChange={() => dispatch(setParam({ key: 'ageRangeId', value: age }))}
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
