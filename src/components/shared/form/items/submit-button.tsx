import { useStore } from '@tanstack/react-form'
import { Button } from '@/components/shadcn/button'
import { useFormContext } from '@/components/shared/form/items'
import { useTranslations } from 'next-intl'

type SubmitButtonProps = {
  children: React.ReactNode
  className?: string
  loading?: boolean
  size?: 'sm' | 'lg' | 'default' | 'icon' | null | undefined
}

export const SubmitButton = ({ children, className, loading = false, size = 'default' }: SubmitButtonProps) => {
  const form = useFormContext()
  const t = useTranslations('common')

  const [isSubmitting, canSubmit] = useStore(form.store, (state) => [state.isSubmitting, state.canSubmit])

  return (
    <Button type='submit' disabled={isSubmitting || !canSubmit || loading} className={className} size={size}>
      {loading ? t('button.submitting') : children}
    </Button>
  )
}
