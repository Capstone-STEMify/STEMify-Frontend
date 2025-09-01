import { useFieldContext } from '@/components/shared/form/items'
import { FieldErrors } from '@/components/shared/form/items/field-errors'
import TiptapEditor from '@/components/tiptap/TiptapEditor'
import { useTranslations } from 'next-intl'

export const MarkdownEditorField = () => {
  const t = useTranslations('sectionManagement')
  const field = useFieldContext<string>()

  return (
    <div className='space-y-1'>
      <TiptapEditor content={field.state.value} onChange={(val) => field.handleChange(val || '')} />
      <FieldErrors meta={field.state.meta} />
    </div>
  )
}
