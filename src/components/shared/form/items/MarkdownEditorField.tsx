import { useFieldContext } from '@/components/shared/form/items'
import { FieldErrors } from '@/components/shared/form/items/field-errors'
import MarkdownEditor from '@/components/shared/MarkdownEditor'
import { useTranslations } from 'next-intl'

export const MarkdownEditorField = () => {
  const t = useTranslations('sectionManagement')
  const field = useFieldContext<string>()

  return (
    <div className='space-y-1'>
      <label htmlFor={field.name} className='block text-sm font-medium text-gray-700'>
        {t('section.contentName')}
      </label>
      <MarkdownEditor value={field.state.value} onChange={(val) => field.handleChange(val || '')} />
      <FieldErrors meta={field.state.meta} />
    </div>
  )
}
