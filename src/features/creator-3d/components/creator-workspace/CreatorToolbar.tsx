import { setTransformMode, toggleAxes, toggleGrid, toggleSnap } from '@/features/creator-3d/slice/creatorSceneSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'

export function CreatorToolbar() {
  const transformMode = useAppSelector((state) => state.creatorScene.transformMode)
  const showGrid = useAppSelector((state) => state.creatorScene.showGrid)
  const showAxes = useAppSelector((state) => state.creatorScene.showAxes)
  const snapToGrid = useAppSelector((state) => state.creatorScene.snapToGrid)
  const dispatch = useAppDispatch()
  return (
    <div className='absolute top-4 left-4 rounded-lg border border-gray-200 bg-white p-2 shadow-lg'>
      <div className='flex items-center gap-2'>
        {/* Transform Mode */}
        <div className='flex rounded-md bg-gray-100 p-1'>
          <button
            className={`rounded px-3 py-1 text-xs ${transformMode === 'translate' ? 'bg-white shadow' : ''}`}
            onClick={() => dispatch(setTransformMode('translate'))}
          >
            Move
          </button>
          <button
            className={`rounded px-3 py-1 text-xs ${transformMode === 'rotate' ? 'bg-white shadow' : ''}`}
            onClick={() => dispatch(setTransformMode('rotate'))}
          >
            Rotate
          </button>
          {/* <button
            className={`rounded px-3 py-1 text-xs ${transformMode === 'scale' ? 'bg-white shadow' : ''}`}
            onClick={() => dispatch(setTransformMode('scale'))}
          >
            Scale
          </button> */}
        </div>

        <div className='h-6 w-px bg-gray-300' />

        {/* View Options */}
        <button
          className={`rounded px-2 py-1 text-xs ${showGrid ? 'bg-blue-100 text-blue-800' : 'text-gray-600'}`}
          onClick={() => dispatch(toggleGrid())}
        >
          Grid
        </button>
        <button
          className={`rounded px-2 py-1 text-xs ${showAxes ? 'bg-blue-100 text-blue-800' : 'text-gray-600'}`}
          onClick={() => dispatch(toggleAxes())}
        >
          Axes
        </button>
        <button
          className={`rounded px-2 py-1 text-xs ${snapToGrid ? 'bg-blue-100 text-blue-800' : 'text-gray-600'}`}
          onClick={() => dispatch(toggleSnap())}
        >
          Snap
        </button>
      </div>
    </div>
  )
}
