import { IconCloudCheck, IconCloudOff, IconLoader2, IconRefresh } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'

interface SceneActionsProps {
  cloudState: 'saved' | 'saving'
  onSave: () => void
  onImportJSON?: () => void
  onExportGLB?: () => void
}

export function SceneActions({ cloudState, onSave, onImportJSON, onExportGLB }: SceneActionsProps) {
  const t3d = useTranslations('creator3D.main_content')
  const tc = useTranslations('common')
  return (
    <div className='absolute right-4 bottom-4 flex gap-2'>
      <button
        onClick={onSave}
        className='rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100'
        disabled={cloudState === 'saving'}
      >
        {cloudState === 'saving' && <IconLoader2 className='animate-spin' />}
        {cloudState === 'saved' && <IconCloudCheck className='text-green-600' />}
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
        {tc('button.exportGLB')}
      </button>
    </div>
  )
}
