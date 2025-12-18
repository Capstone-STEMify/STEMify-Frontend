import { useTranslations } from 'next-intl'

interface StepControllerProps {
  stepIndex: number
  maxStep: number
  onPrev: () => void
  onNext: () => void
}

export function StepController({ stepIndex, maxStep, onPrev, onNext }: StepControllerProps) {
  const t3d = useTranslations('common.button')
  return (
    <div className='absolute top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-white/80 px-3 py-2 shadow'>
      <button onClick={onPrev} disabled={stepIndex === 0} className='rounded-lg border px-3 py-1 disabled:opacity-50'>
        {t3d('previous')}
      </button>
      <div className='px-2 text-sm tabular-nums'>
        {Math.min(stepIndex + 1, maxStep)} / {maxStep}
      </div>
      <button
        onClick={onNext}
        disabled={stepIndex >= maxStep - 1}
        className='rounded-lg border px-3 py-1 disabled:opacity-50'
      >
        {t3d('next')}
      </button>
    </div>
  )
}
