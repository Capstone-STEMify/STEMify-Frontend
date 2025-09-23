import { useFieldContext } from '@/components/shared/form/items'
import { FieldErrors } from '@/components/shared/form/items/field-errors'
import dynamic from 'next/dynamic'
const TiptapEditor = dynamic(() => import('@/components/tiptap/TiptapEditor'), { ssr: false })

export const MarkdownEditorField = () => {
  const field = useFieldContext<string>()

  return (
    <div>
      <TiptapEditor content={field.state.value} onChange={(val) => field.handleChange(val || '')} />
      <FieldErrors meta={field.state.meta} />
    </div>
  )
}
