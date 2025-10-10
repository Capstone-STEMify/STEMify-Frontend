interface SceneActionsProps {
  onClear: () => void
  onExport: () => void
  onImport: () => void
  hasObjects: boolean
}

export function SceneActions({ onClear, onExport, onImport, hasObjects }: SceneActionsProps) {
  return (
    <div className='absolute right-4 bottom-4 flex gap-2'>
      <button
        onClick={onClear}
        disabled={!hasObjects}
        className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50'
      >
        Clear Scene
      </button>
      <button
        onClick={onExport}
        disabled={!hasObjects}
        className='rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50'
      >
        Export Assembly
      </button>
      <button
        onClick={onImport}
        className='rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100'
      >
        Import Assembly
      </button>
    </div>
  )
}
