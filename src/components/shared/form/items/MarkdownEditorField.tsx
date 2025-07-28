import { useFieldContext } from '@/components/shared/form/items'
import { FieldErrors } from '@/components/shared/form/items/field-errors'
import MarkdownEditor from '@/components/shared/MarkdownEditor'

export const MarkdownEditorField = () => {
  const field = useFieldContext<string>()

  return (
    <div className='space-y-1'>
      <label htmlFor={field.name} className='block text-sm font-medium text-gray-700'>
        Content Name
      </label>
      <MarkdownEditor value={field.state.value} onChange={(val) => field.handleChange(val || '')} />
      <FieldErrors meta={field.state.meta} />
    </div>
  )
}
