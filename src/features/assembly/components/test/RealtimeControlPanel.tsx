interface RealtimeControlPanelProps {
  currentStep: any
  assembly: any
  runtimeComponentOverrides: Record<
    string,
    { rotation: { x: number; y: number; z: number }; translation: { x: number; y: number; z: number } }
  >
  setRuntimeComponentOverrides: React.Dispatch<
    React.SetStateAction<
      Record<
        string,
        { rotation: { x: number; y: number; z: number }; translation: { x: number; y: number; z: number } }
      >
    >
  >
  transformMode: 'translate' | 'rotate'
}

export function RealtimeControlPanel({
  currentStep,
  assembly,
  runtimeComponentOverrides,
  setRuntimeComponentOverrides,
  transformMode
}: RealtimeControlPanelProps) {
  const action = assembly?.actions?.find((a: any) => a.id === currentStep?.actionId)
  if (!(action?.type === 'component_assembly' && action?.showRealtimeControls)) return null

  const componentTransforms = action?.componentTransforms || {}
  const firstComponentId = Object.keys(componentTransforms)[0]
  const firstTransform = componentTransforms[firstComponentId]?.matrix
  if (!firstComponentId || !firstTransform) return null

  return (
    <div className='absolute right-4 bottom-4 z-10 w-[360px] rounded-xl border bg-white/95 p-3 shadow'>
      <div className='mb-2 font-semibold text-gray-700'>Realtime Controls — {action?.name || 'Component Assembly'}</div>
      <div className='mb-1 text-xs text-gray-500'>
        Component Assembly: TransformAsUnit = true - All elements move together
      </div>
      <div className='grid grid-cols-3 gap-2 text-xs'>
        <div className='col-span-3 font-medium text-gray-600'>Rotation (rad)</div>
        {(['x', 'y', 'z'] as const).map((axis) => (
          <div key={`rot-${axis}`} className='flex flex-col gap-1'>
            <label className='text-[11px] text-gray-500'>R{axis.toUpperCase()}</label>
            <input
              type='number'
              step='0.01745'
              className='w-full rounded border px-2 py-1'
              value={
                runtimeComponentOverrides[firstComponentId]?.rotation?.[axis] ?? (firstTransform.rotation?.[axis] || 0)
              }
              onChange={(e) => {
                const v = parseFloat(e.target.value || '0')
                setRuntimeComponentOverrides((prev) => ({
                  ...prev,
                  [firstComponentId]: {
                    rotation: {
                      x:
                        axis === 'x'
                          ? isNaN(v)
                            ? firstTransform.rotation?.x || 0
                            : v
                          : (prev[firstComponentId]?.rotation?.x ?? firstTransform.rotation?.x ?? 0),
                      y:
                        axis === 'y'
                          ? isNaN(v)
                            ? firstTransform.rotation?.y || 0
                            : v
                          : (prev[firstComponentId]?.rotation?.y ?? firstTransform.rotation?.y ?? 0),
                      z:
                        axis === 'z'
                          ? isNaN(v)
                            ? firstTransform.rotation?.z || 0
                            : v
                          : (prev[firstComponentId]?.rotation?.z ?? firstTransform.rotation?.z ?? 0)
                    },
                    translation: prev[firstComponentId]?.translation ?? firstTransform.position
                  }
                }))
              }}
            />
          </div>
        ))}
      </div>

      <div className='col-span-3 mt-2 font-medium text-gray-600'>Translation</div>
      {(['x', 'y', 'z'] as const).map((axis) => (
        <div key={`trs-${axis}`} className='flex flex-col gap-1'>
          <label className='text-[11px] text-gray-500'>T{axis.toUpperCase()}</label>
          <input
            type='number'
            step='0.5'
            className='w-full rounded border px-2 py-1'
            value={
              runtimeComponentOverrides[firstComponentId]?.translation?.[axis] ?? (firstTransform.position?.[axis] || 0)
            }
            onChange={(e) => {
              const v = parseFloat(e.target.value || '0')
              setRuntimeComponentOverrides((prev) => ({
                ...prev,
                [firstComponentId]: {
                  rotation: prev[firstComponentId]?.rotation ?? firstTransform.rotation,
                  translation: {
                    x: prev[firstComponentId]?.translation?.x ?? firstTransform.position?.x ?? 0,
                    y: prev[firstComponentId]?.translation?.y ?? firstTransform.position?.y ?? 0,
                    z: prev[firstComponentId]?.translation?.z ?? firstTransform.position?.z ?? 0,
                    [axis]: isNaN(v) ? firstTransform.position?.[axis] || 0 : v
                  }
                }
              }))
            }}
          />
        </div>
      ))}

      <div className='col-span-3 mt-3 flex items-center gap-2 rounded bg-gray-50 p-2'>
        <div className={`h-2 w-2 rounded-full ${transformMode === 'translate' ? 'bg-blue-500' : 'bg-purple-500'}`} />
        <span className='text-xs text-gray-600'>
          Active Mode:{' '}
          <span className='font-medium'>{transformMode === 'translate' ? '📍 Translation' : ' Rotation'}</span>
        </span>
      </div>

      <div className='mt-3 flex gap-2'>
        <button
          className='rounded border px-2 py-1 text-xs'
          onClick={() =>
            setRuntimeComponentOverrides((prev) => ({
              ...prev,
              [firstComponentId]: {
                rotation: firstTransform.rotation || { x: 0, y: 0, z: 0 },
                translation: firstTransform.position || { x: 0, y: 0, z: 0 }
              }
            }))
          }
        >
          Reset
        </button>
        <button className='rounded border px-2 py-1 text-xs' onClick={() => setRuntimeComponentOverrides({})}>
          Clear
        </button>
      </div>
    </div>
  )
}
