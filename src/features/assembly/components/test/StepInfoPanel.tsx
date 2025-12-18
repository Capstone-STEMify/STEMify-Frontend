'use client'

import { useTranslations } from 'next-intl'

interface StepInfoPanelProps {
  stepIndex: number
  currentStep: any
  strawTypeCount: Record<string, { count: number; instances: any[] }>
  connectorTypeCount: Record<string, { count: number; instances: any[] }>
}
export function StepInfoPanel({ currentStep, strawTypeCount, connectorTypeCount }: StepInfoPanelProps) {
  const t3d = useTranslations('creator3D.main_content')

  const hasItems = (obj?: Record<string, any>) => obj && Object.keys(obj).length > 0

  return (
    <div className='absolute top-4 left-4 z-10 w-100 rounded-xl border bg-white/90 px-4 py-3 text-sm shadow'>
      <div className='mb-2 text-lg font-semibold text-sky-600'>{currentStep?.title}</div>
      {currentStep?.description && <div className='mt-1 text-sm text-gray-600'>{currentStep.description}</div>}
      {currentStep?.expectedResult && (
        <div className='mt-2'>
          <div className='mb-1 font-semibold text-gray-600'>{t3d('expected_result')}:</div>
          <div className='text-sm text-gray-700'>{currentStep.expectedResult}</div>
        </div>
      )}
      {hasItems(strawTypeCount) && (
        <div className='mt-4'>
          <div className='mb-1 font-semibold text-gray-600'>{t3d('straws')}:</div>

          <ul className='space-y-1'>
            {Object.entries(strawTypeCount).map(([templateId, { count, instances }]) => {
              const first = instances[0]
              const name = first?.data?.name ?? templateId
              const color = first?.data?.material?.properties?.color ?? '#4ade80'

              return (
                <li key={templateId} className='flex items-center gap-2'>
                  <div className='h-4 w-4 rounded-full border' style={{ backgroundColor: color }} title={name} />
                  <span>
                    {name}: x{count}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {hasItems(connectorTypeCount) && (
        <div className='mt-3'>
          <div className='mb-1 font-semibold text-gray-600'>{t3d('connectors')}:</div>

          <ul className='space-y-1'>
            {Object.entries(connectorTypeCount).map(([templateId, { count, instances }]) => {
              const first = instances[0]
              const name = first?.data?.name ?? templateId
              const color = first?.data?.material?.properties?.color ?? '#9ca3af'

              return (
                <li key={templateId} className='flex items-center gap-2'>
                  <div className='h-4 w-4 rounded-sm border bg-gray-400' title={name} />
                  <span>
                    {name}: x{count}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
