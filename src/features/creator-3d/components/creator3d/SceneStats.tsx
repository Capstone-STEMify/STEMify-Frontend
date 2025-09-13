interface SceneStatsProps {
  objectCount: number
  strawCount: number
  connectorCount: number
  selectedObject: any
}

export function SceneStats({ objectCount, strawCount, connectorCount, selectedObject }: SceneStatsProps) {
  return (
    <div className='absolute bottom-4 left-4 rounded-lg border border-gray-200 bg-white p-3 shadow-lg'>
      <div className='space-y-1 text-xs text-gray-600'>
        <div className='font-medium'>Scene Stats</div>
        <div>Objects: {objectCount}</div>
        <div className='flex gap-4'>
          <span> Straws: {strawCount}</span>
          <span> Connectors: {connectorCount}</span>
        </div>
        {selectedObject && (
          <div className='border-t border-gray-200 pt-1'>
            <div className='font-medium'>Selected: {selectedObject.name}</div>
          </div>
        )}
      </div>
    </div>
  )
}
