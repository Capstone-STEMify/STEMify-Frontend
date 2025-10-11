import { useTranslations } from 'next-intl'

interface SceneActionsProps {
  onClear: () => void
  onSave: () => void
  hasObjects: boolean
}

export function SceneActions({ onClear, onSave, hasObjects }: SceneActionsProps) {
  const t3d = useTranslations('creator3D.main_content')
  return (
    <div className='absolute right-4 bottom-4 flex gap-2'>
      <button
        onClick={onClear}
        disabled={!hasObjects}
        className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50'
      >
        {t3d('clear_scene')}
      </button>
      <button
        onClick={onSave}
        className='rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100'
      >
        {t3d('save_assembly')}
      </button>
    </div>
  )
}
