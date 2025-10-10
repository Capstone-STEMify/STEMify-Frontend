'use client'

import React from 'react'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  useCreateAgeRangeMutation,
  useGetAgeRangeByIdQuery,
  useUpdateAgeRangeMutation
} from '@/features/resource/age-range/api/ageRangeApi'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { SCard } from '@/components/shared/card/SCard'
import { Button } from '@/components/shadcn/button'
import { useTranslations } from 'next-intl'
import { useModal } from '@/providers/ModalProvider'

type NiceSelectProps = {
  label: string
  value?: number
  onChange: (v: number | undefined) => void
  options: number[]
  placeholder?: string
  className?: string
}

function NiceSelect({ label, value, onChange, options, placeholder = 'Select…', className }: NiceSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [highlight, setHighlight] = React.useState<number>(-1)
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  React.useEffect(() => {
    if (!open) return
    const idx = value != null ? options.findIndex((n) => n === value) : -1
    setHighlight(idx >= 0 ? idx : 0)
  }, [open, options, value])

  const commit = (idx: number) => {
    const v = options[idx]
    if (typeof v === 'number') onChange(v)
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') return
    e.preventDefault()
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === ' ' || e.key === 'Enter')) {
      setOpen(true)
      return
    }
    if (open) {
      if (e.key === 'ArrowDown') {
        setHighlight((h) => Math.min((h < 0 ? 0 : h) + 1, options.length - 1))
      } else if (e.key === 'ArrowUp') {
        setHighlight((h) => Math.max((h < 0 ? 0 : h) - 1, 0))
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (highlight >= 0) commit(highlight)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
  }

  return (
    <div className={className} ref={containerRef}>
      <label className='mb-2 block text-lg font-bold'>{label}</label>

      <button
        type='button'
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        aria-haspopup='listbox'
        aria-expanded={open}
        className='flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 py-2 text-left shadow-sm transition outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2'
      >
        <span className={value == null ? 'text-gray-400' : ''}>{value == null ? placeholder : value}</span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z'
            clipRule='evenodd'
          />
        </svg>
      </button>

      {open && (
        <div role='listbox' tabIndex={-1} className='relative z-50 mt-2'>
          <div className='absolute right-0 left-0 max-h-60 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5'>
            {options.map((n, idx) => {
              const selected = value === n
              const active = idx === highlight
              return (
                <div
                  key={n}
                  role='option'
                  aria-selected={selected}
                  onMouseEnter={() => setHighlight(idx)}
                  onClick={() => commit(idx)}
                  className={`flex cursor-pointer items-center justify-between px-3 py-2 ${
                    active ? 'bg-gray-100' : ''
                  } ${selected ? 'font-semibold' : 'font-normal'}`}
                >
                  <span>{n}</span>
                  {selected && (
                    <svg className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor'>
                      <path
                        fillRule='evenodd'
                        d='M16.704 5.29a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.415 0l-3.25-3.25A1 1 0 016.2 9.542l2.543 2.543 6.543-6.542a1 1 0 011.418-.252z'
                        clipRule='evenodd'
                      />
                    </svg>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

const AGES = Array.from({ length: 15 }, (_, i) => i + 4)

interface UpsertAgeRangeProps {
  id?: number
  onSuccess?: () => void
}

export default function UpsertAgeRangePlain({ id, onSuccess }: UpsertAgeRangeProps) {
  const isEditing = !!id
  const { closeModal } = useModal()
  const tv = useTranslations('validation')
  const t = useTranslations('Admin.ageRange')
  const tt = useTranslations('toast')
  const tc = useTranslations('common')

  const ageRangeSchema = z
    .object({
      minAge: z.number().min(4, tv('ageRange.min')),
      maxAge: z.number().min(4, tv('ageRange.max'))
    })
    .refine((d) => d.maxAge > d.minAge, {
      message: tv('ageRange.maxMin'),
      path: ['maxAge']
    })

  const { data: existingData, isLoading: isDataLoading } = useGetAgeRangeByIdQuery(id as number, {
    skip: !isEditing
  })
  const [createAgeRange, { isLoading: isCreating }] = useCreateAgeRangeMutation()
  const [updateAgeRange, { isLoading: isUpdating }] = useUpdateAgeRangeMutation()

  const [minAge, setMinAge] = React.useState<number | undefined>(isEditing ? undefined : 4)
  const [maxAge, setMaxAge] = React.useState<number | undefined>(isEditing ? undefined : 5)
  const [isReady, setIsReady] = React.useState(!isEditing)

  React.useEffect(() => {
    if (isEditing && existingData?.data) {
      setMinAge(existingData.data.minAge ?? undefined)
      setMaxAge(existingData.data.maxAge ?? undefined)
      setIsReady(true)
    }
  }, [isEditing, existingData])

  const minOptions = React.useMemo(() => AGES.filter((n) => (typeof maxAge === 'number' ? n < maxAge : true)), [maxAge])
  const maxOptions = React.useMemo(() => AGES.filter((n) => (typeof minAge === 'number' ? n > minAge : true)), [minAge])

  const errors = React.useMemo(() => {
    const err: Partial<Record<'minAge' | 'maxAge', string>> = {}
    if (typeof minAge === 'number' || typeof maxAge === 'number') {
      const res = ageRangeSchema.safeParse({ minAge: minAge ?? 0, maxAge: maxAge ?? 0 })
      if (!res.success) {
        for (const i of res.error.issues) {
          if (i.path[0] === 'minAge') err.minAge = i.message
          if (i.path[0] === 'maxAge') err.maxAge = i.message
        }
      }
    }
    return err
  }, [minAge, maxAge, ageRangeSchema])

  const isValid = typeof minAge === 'number' && typeof maxAge === 'number' && Object.keys(errors).length === 0

  if (isDataLoading || (isEditing && !isReady)) return <LoadingComponent />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    const body = { minAge: minAge!, maxAge: maxAge!, ageRangeLabel: `${minAge}-${maxAge}` }
    try {
      if (isEditing) {
        await updateAgeRange({ id: id!, body }).unwrap()
        toast.success(tt('successMessage.update', { title: body.ageRangeLabel }))
      } else {
        await createAgeRange(body).unwrap()
        toast.success(tt('successMessage.create', { title: body.ageRangeLabel }))
      }
      onSuccess?.()
    } catch (err) {
      toast.error(tt('errorMessage'))
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <NiceSelect
          label={t('mini_name')}
          value={minAge}
          onChange={(v) => {
            setMinAge(v)
            if (typeof v === 'number' && typeof maxAge === 'number' && maxAge <= v) {
              setMaxAge(undefined)
            }
          }}
          options={minOptions}
          placeholder={t('min_placeholder')}
        />

        <NiceSelect
          label={t('max_name')}
          value={maxAge}
          onChange={setMaxAge}
          options={maxOptions}
          placeholder={t('max_placeholder')}
        />
      </div>

      {isValid ? (
        <SCard
          className='mt-4'
          content={
            <>
              <p className='text-lg font-semibold'>
                {t('label')} <span className='font-mono text-blue-600'>{`${minAge}-${maxAge}`}</span>
              </p>
              <p className='text-sm text-gray-500'>{t('description')}</p>
            </>
          }
        />
      ) : null}

      <div className='mb-3 flex justify-end gap-3'>
        <Button type='button' variant='outline' onClick={closeModal}>
          {tc('button.cancel')}
        </Button>
        <Button type='submit' className='bg-amber-custom-400' disabled={!isValid || isCreating || isUpdating}>
          {isEditing ? `${t('updateButton')}` : `${t('createButton')}`}
        </Button>
      </div>
    </form>
  )
}
