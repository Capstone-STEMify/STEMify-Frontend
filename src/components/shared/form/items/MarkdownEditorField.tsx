import { useFieldContext } from '@/components/shared/form/items'
import { FieldErrors } from '@/components/shared/form/items/field-errors'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
const TiptapEditor = dynamic(() => import('@/components/tiptap/TiptapEditor'), { ssr: false })
type MarkdownEditorFieldProps = {
  onSave: () => void
}

export const MarkdownEditorField = ({ onSave }: MarkdownEditorFieldProps) => {
  const t = useTranslations('sectionManagement')
  const field = useFieldContext<string>()

  return (
    <div className='space-y-1'>
      <TiptapEditor content={field.state.value} onChange={(val) => field.handleChange(val || '')} onSave={onSave} />
      <FieldErrors meta={field.state.meta} />
    </div>
  )
}
