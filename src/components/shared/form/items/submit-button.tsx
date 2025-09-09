import { useStore } from '@tanstack/react-form'
import { Button } from '@/components/shadcn/button'
import { useFormContext } from '@/components/shared/form/items'

type SubmitButtonProps = {
  children: React.ReactNode
  className?: string
  loading?: boolean
}

export const SubmitButton = ({ children, className, loading = false }: SubmitButtonProps) => {
  const form = useFormContext()

  const [isSubmitting, canSubmit] = useStore(form.store, (state) => [state.isSubmitting, state.canSubmit])

  return (
    <Button type='submit' disabled={isSubmitting || !canSubmit || loading} className={className}>
      {loading ? 'Submitting...' : children}
    </Button>
  )
}
