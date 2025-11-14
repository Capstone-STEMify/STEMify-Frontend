'use client'

import React from 'react'

type ClassroomBasicInfoProps = {
  form: any
  organizationSubscriptionData: any
  gradeOptions: { label: string; value: string }[]
  minDate: Date | undefined
  maxDate: Date | undefined
  setMinDate: (date: Date | undefined) => void
  setMaxDate: (date: Date | undefined) => void
}

export default function ClassroomBasicInfo({
  form,
  gradeOptions,
  minDate,
  maxDate,
  setMinDate,
  setMaxDate
}: ClassroomBasicInfoProps) {
  return (
    <div className='animate-fadeIn mx-auto max-w-4xl space-y-6'>
      <div className='rounded-lg border bg-white p-6 shadow-sm'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>Basic Information</h3>
        <form.AppField
          name='name'
          children={(field: any) => (
            <field.TextField label='Classroom Name' placeholder='e.g., STEM-1A-2025' required />
          )}
        />
        <div className='space-y-4'>
          {/* Row 1: class code + Grade */}
          <div className='mt-4 grid grid-cols-1 gap-6 md:grid-cols-2'>
            <form.AppField
              name='classCode'
              children={(field: any) => (
                <field.TextField label='Class Code' placeholder='e.g., STEM-1A-2025' required />
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
