import { useTranslations } from 'next-intl'

interface SceneActionsProps {
  onSave: () => void
  onImportJSON?: () => void
  hasObjects: boolean
  onExportGLB?: () => void
}

export function SceneActions({ onSave, onImportJSON, onExportGLB }: SceneActionsProps) {
  const t3d = useTranslations('creator3D.main_content')
  return (
    <div className='absolute right-4 bottom-4 flex gap-2'>
      <button
        onClick={onSave}
        className='rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100'
      >
        {t3d('save_assembly')}
      </button>

      <button
        className='rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50'
        onClick={onImportJSON}
      >
        {t3d('import_assembly')}
      </button>

      <button
        className='rounded-md border border-purple-200 bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-50'
        onClick={onExportGLB}
      >
        {t3d('export_glb')}
      </button>
    </div>
  )
}
