import { Button } from '@/components/shadcn/button'
import { setCameraStatus } from '@/features/creator-3d/slice/strawLabSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'

export default function SceneTopRight() {
  const cameraStatus = useAppSelector((state) => state.strawLab.cameraStatus)
  const dispatch = useAppDispatch()

  const handleCameraStatus = () => {
    dispatch(setCameraStatus(!cameraStatus))
  }
  return (
    <Button variant={'outline'} className='absolute top-4 right-4' onClick={handleCameraStatus}>
      <div>{cameraStatus === false ? 'Unlock camera' : 'Lock camera'}</div>
    </Button>
  )
}
