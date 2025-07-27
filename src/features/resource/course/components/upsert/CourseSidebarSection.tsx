'use client'

import React from 'react'
import { SCard } from '@/components/shared/card/SCard'
import { Button } from '@/components/shadcn/button'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'
import { AgeRange } from '@/features/resource/age-range/types/ageRange.type'

interface CourseSidebarSectionProps {
  form: any
  ageRanges: ApiSuccessResponse<PaginatedResult<AgeRange>>
  imageFieldRef: React.MutableRefObject<any>
  handleEditImage: () => void
  isSubmitting: boolean
}

export const CourseSidebarSection = ({
  form,
  ageRanges,
  imageFieldRef,
  handleEditImage,
  isSubmitting
}: CourseSidebarSectionProps) => {
  return (
    <>
      <SCard
        className='gap-2'
        title='Age Range'
        description='Select the age range this course is suitable for'
        content={
          <form.AppField
            name='ageRangeId'
            children={(field: any) => (
              <field.RadioField
                options={ageRanges?.data.items
                  .slice()
                  .sort((a, b) => a.id - b.id)
                  .map((a) => ({
                    value: a.id.toString(),
                    label: a.ageRangeLabel
                  }))}
                className='grid grid-cols-4 gap-y-4'
              />
            )}
          />
        }
      />

      <form.AppField
        name='imageUrl'
        children={(field: any) => {
          imageFieldRef.current = field
          return <field.ImageField previewUrlFromServer={form.state.values.imagePreviewUrl} />
        }}
      />

      {/* <div className='flex flex-col gap-3 sm:flex-row'>
        <Button type='button' onClick={handleEditImage} className='flex-1 rounded-full py-5'>
          Edit Image
        </Button>
      </div> */}

      <form.AppForm>
        <form.SubmitButton loading={isSubmitting} className='w-full rounded-full'>
          Submit
        </form.SubmitButton>
      </form.AppForm>
    </>
  )
}
