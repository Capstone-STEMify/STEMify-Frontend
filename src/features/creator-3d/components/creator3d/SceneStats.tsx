import { AssemblyInstance } from '@/features/assembly/hooks/useAssemblyOptimized'
import { useTranslations } from 'next-intl'

interface SceneStatsProps {
  objectCount: number
  strawCount: number
  connectorCount: number
  selectedObject: AssemblyInstance | null
}

export function SceneStats({ objectCount, strawCount, connectorCount, selectedObject }: SceneStatsProps) {
  const t3d = useTranslations('creator3D.main_content')
  return (
    <div className='absolute bottom-4 left-4 rounded-lg border border-gray-200 bg-white p-3 shadow-lg'>
      <div className='space-y-1 text-xs text-gray-600'>
        <div className='font-medium'>{t3d('scene_stats')}</div>
        <div>
          {t3d('objects')}: {objectCount}
        </div>
        <div className='flex gap-4'>
          <span>
            {t3d('straws')}: {strawCount}
          </span>
          <span>
            {t3d('connectors')}: {connectorCount}
          </span>
        </div>
        {selectedObject && (
          <div className='border-t border-gray-200 pt-1'>
            <div className='font-medium'>{t3d('selected')}: {selectedObject.data.name}</div>
          </div>
        )}
      </div>
    </div>
  )
}
