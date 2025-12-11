import { Button } from '@/components/shadcn/button'
import { clearScene } from '@/features/creator-3d/slice/creatorSceneSlice'
import { setCameraStatus } from '@/features/creator-3d/slice/strawLabSlice'
import { resetActions, resetWorkspace } from '@/features/creator-3d/slice/workspaceTreeSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

export default function SceneTopRight() {
  const t3d = useTranslations('creator3D.main_content')
  const dispatch = useAppDispatch()
  const cameraStatus = useAppSelector((state) => state.strawLab.cameraStatus)
  const instances = useAppSelector((s) => s.creatorScene.instances)

  const handleClearScene = useCallback(() => {
    if (confirm('Are you sure you want to clear the entire scene? This action cannot be undone.')) {
      dispatch(clearScene())
      dispatch(resetWorkspace())
    }
  }, [dispatch])

  const handleCameraStatus = () => {
    dispatch(setCameraStatus(!cameraStatus))
  }

  return (
    <div className='absolute top-4 right-4 flex gap-2'>
      <Button variant={'outline'} onClick={handleCameraStatus}>
        <div>{cameraStatus === false ? t3d('unlock_camera') : t3d('lock_camera')}</div>
      </Button>
      <Button variant={'destructive'} onClick={handleClearScene} disabled={instances.length === 0}>
        <div>{t3d('clear_scene')}</div>
      </Button>
    </div>
  )
}
