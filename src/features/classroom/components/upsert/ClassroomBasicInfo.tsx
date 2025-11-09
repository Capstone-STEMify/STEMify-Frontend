'use client'

import React from 'react'

type ClassroomBasicInfoProps = {
  form: any
  organizationSubscriptionOptions: any[]
  organizationSubscriptionData: any
  gradeOptions: { label: string; value: string }[]
  minDate: Date | undefined
  maxDate: Date | undefined
  setSelectedSubscriptionId: (id: number) => void
  setMinDate: (date: Date | undefined) => void
  setMaxDate: (date: Date | undefined) => void
}

export default function ClassroomBasicInfo({
  form,
  organizationSubscriptionOptions,
  organizationSubscriptionData,
  gradeOptions,
  minDate,
  maxDate,
  setSelectedSubscriptionId,
  setMinDate,
  setMaxDate
}: ClassroomBasicInfoProps) {
  return (
    <div className='animate-fadeIn mx-auto max-w-4xl space-y-6'>
      <div className='rounded-lg border bg-white p-6 shadow-sm'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>Basic Information</h3>

        <div className='space-y-6'>
          {/* Row 1: Name + Grade */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <form.AppField
              name='name'
              children={(field: any) => (
                <field.TextField label='Classroom Name' placeholder='e.g., Math Class 2024' required />
              )}
            />

            <form.AppField
              name='grade'
              children={(field: any) => (
                <field.SelectField label='Grade Level' placeholder='Select grade' options={gradeOptions} />
              )}
            />
          </div>

          {/* Description */}
          <form.AppField
            name='description'
            children={(field: any) => (
              <field.TextAreaField
                label='Description'
                placeholder='Brief description of this classroom...'
                rows={4}
                className='resize-none'
              />
            )}
          />
          {/* Subscription */}
          <form.AppField
            name='organizationSubscriptionOrderId'
            children={(field: any) => (
              <field.SingleSelectWithSearch
                value={form.getFieldValue('organizationSubscriptionOrderId')?.toString()}
                options={organizationSubscriptionOptions}
                label='Subscription Plan'
                placeholder='Choose subscription plan'
                onChange={(val: string | number) => {
                  form.setFieldValue('organizationSubscriptionOrderId', Number(val))
                  setSelectedSubscriptionId(Number(val))
                  const selected = organizationSubscriptionData?.data.items.find((s: { id: number; startDate: string; endDate: string }) => s.id === Number(val))

                  setMinDate(selected ? new Date(selected.startDate) : undefined)
                  setMaxDate(selected ? new Date(selected.endDate) : undefined)
                }}
              />
            )}
          />
          {/* Row 2: Dates */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <form.AppField
              name='startDate'
              children={(field: any) => {
                const today = new Date()
                const effectiveMinStartDate = minDate && minDate > today ? minDate : today

                return (
                  <field.DatePickerField
                    label='Start Date'
                    placeholder='Select start date'
                    minDate={effectiveMinStartDate}
                    maxDate={maxDate}
                  />
                )
              }}
            />
            <form.AppField
              name='endDate'
              children={(field: any) => (
                <field.DatePickerField
                  label='End Date'
                  placeholder='Select end date'
                  minDate={minDate}
                  maxDate={maxDate}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
