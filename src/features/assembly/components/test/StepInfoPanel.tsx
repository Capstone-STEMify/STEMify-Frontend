interface StepInfoPanelProps {
  stepIndex: number
  stepTitle: string
  stepDescription?: string
  strawTypeCount: Record<string, number>
  connectorTypeCount: Record<string, number>
}
export function StepInfoPanel({
  stepIndex,
  stepTitle,
  stepDescription,
  strawTypeCount,
  connectorTypeCount
}: StepInfoPanelProps) {
  return (
    <div className='absolute top-4 left-4 z-10 w-100 rounded-xl border bg-white/90 px-4 py-3 text-sm shadow'>
      <div className='mb-2 text-lg font-semibold text-sky-600'>Step {stepIndex + 1}</div>
      <div className='text-lg text-gray-700'>{stepTitle}</div>
      {stepDescription && <div className='mt-1 text-sm text-gray-600'>{stepDescription}</div>}

      <div className='mt-4'>
        <div className='mb-1 font-semibold text-gray-600'>Straws:</div>
        <ul className='space-y-1'>
          {Object.entries(strawTypeCount).map(([templateId, count]) => (
            <li key={templateId} className='flex items-center gap-2'>
              <div className='h-4 w-4 rounded-full bg-green-400' title={templateId} />
              <span>
                {templateId}: x{count}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className='mt-3'>
        <div className='mb-1 font-semibold text-gray-600'>Connectors:</div>
        <ul className='space-y-1'>
          {Object.entries(connectorTypeCount).map(([templateId, count]) => (
            <li key={templateId} className='flex items-center gap-2'>
              <div className='h-4 w-4 rounded-sm bg-red-400' title={templateId} />
              <span>
                {templateId}: x{count}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
