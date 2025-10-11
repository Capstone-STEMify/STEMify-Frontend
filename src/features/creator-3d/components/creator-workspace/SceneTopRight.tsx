import { Button } from '@/components/shadcn/button'
import { setCameraStatus } from '@/features/creator-3d/slice/strawLabSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useTranslations } from 'next-intl'

export default function SceneTopRight() {
  const t3d = useTranslations('creator3D.main_content')
  const dispatch = useAppDispatch()
  const cameraStatus = useAppSelector((state) => state.strawLab.cameraStatus)

  const handleCameraStatus = () => {
    dispatch(setCameraStatus(!cameraStatus))
  }
  return (
    <Button variant={'outline'} className='absolute top-4 right-4' onClick={handleCameraStatus}>
      <div>{cameraStatus === false ? t3d('unlock_camera') : t3d('lock_camera')}</div>
    </Button>
  )
}
