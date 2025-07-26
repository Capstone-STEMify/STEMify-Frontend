import { SCard } from '@/components/shared/card/SCard'
import { Category } from '@/features/resource/category/types/category.type'
import { Skill } from '@/features/resource/skill/types/skill.type'
import { Standard } from '@/features/resource/standard/types/standard.type'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'
import React from 'react'

type CourseAttributesSectionProps = {
  form: any
  skills: ApiSuccessResponse<PaginatedResult<Skill>>
  categories: ApiSuccessResponse<PaginatedResult<Category>>
  standards: ApiSuccessResponse<PaginatedResult<Standard>>
}

export default function CourseAttributesSection({ form, skills, categories, standards }: CourseAttributesSectionProps) {
  return (
    <>
      <SCard
        className='gap-2'
        title='Skills'
        description='Select the skills this course will help develop'
        content={
          <form.AppField
            name='skills'
            children={(field: any) => (
              <field.MultipleCheckboxField
                options={skills?.data.items.map((s) => ({
                  value: s.id.toString(),
                  label: s.skillName
                }))}
                className='flex flex-wrap gap-x-8 gap-y-4'
              />
            )}
          />
        }
      />

      <SCard
        className='gap-2'
        title='Categories'
        description='Select the categories this course belongs to'
        content={
          <form.AppField
            name='categories'
            children={(field: any) => (
              <field.MultipleCheckboxField
                options={categories?.data.items.map((c) => ({
                  value: c.id.toString(),
                  label: c.categoryName
                }))}
                className='flex flex-wrap gap-x-8 gap-y-4'
              />
            )}
          />
        }
      />

      <SCard
        className='gap-3'
        title='Standards'
        description='Select the education standards this course aligns with'
        content={
          <form.AppField
            name='standards'
            children={(field: any) => (
              <field.MultipleCheckboxField
                options={standards?.data.items.map((s) => ({
                  value: s.id.toString(),
                  label: s.standardName
                }))}
                className='flex flex-wrap gap-x-8 gap-y-4'
              />
            )}
          />
        }
      />
    </>
  )
}
