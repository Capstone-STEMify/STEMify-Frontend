interface TransformInstructionPanelProps {
  isShiftPressed: boolean
  isTransforming: boolean
  transformMode: 'translate' | 'rotate'
  onModeChange: (mode: 'translate' | 'rotate') => void
}

export function TransformInstructionPanel({
  isShiftPressed,
  isTransforming,
  transformMode,
  onModeChange
}: TransformInstructionPanelProps) {
  return (
    <div className='absolute top-4 right-4 z-10 w-80 rounded-xl border bg-blue-50/95 p-3 shadow'>
      <div className='mb-2 font-semibold text-blue-800'>Third Square Transform Controls</div>

      {/* Transform Mode Selection */}
      <div className='mb-3 flex gap-2'>
        <button
          onClick={() => onModeChange('translate')}
          className={`flex-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
            transformMode === 'translate' ? 'bg-blue-500 text-white' : 'bg-white text-blue-700 hover:bg-blue-100'
          }`}
        >
          Translate
        </button>
        <button
          onClick={() => onModeChange('rotate')}
          className={`flex-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
            transformMode === 'rotate' ? 'bg-purple-500 text-white' : 'bg-white text-purple-700 hover:bg-purple-100'
          }`}
        >
          Rotate
        </button>
      </div>

      <div className='space-y-2 text-sm text-blue-700'>
        <div className='flex items-center gap-2'>
          <div className={`h-3 w-3 rounded-full ${isShiftPressed ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className={isShiftPressed ? 'font-medium' : ''}>
            Hold <kbd className='rounded bg-white px-1 font-mono text-xs'>Shift</kbd> to enable {transformMode}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <div className={`h-3 w-3 rounded-full ${isTransforming ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
          <span className={isTransforming ? 'font-medium' : ''}>
            {isTransforming ? `Currently ${transformMode}ing Third Square` : `Third Square ready to ${transformMode}`}
          </span>
        </div>
        <div className='mt-2 text-xs text-blue-600'>
          • Mode: <span className='font-medium'>{transformMode === 'translate' ? '📍 Position' : ' Rotation'}</span>
          <br />• Workspace rotation is {isTransforming ? 'disabled' : 'enabled'}
          <br />•{' '}
          {transformMode === 'translate'
            ? 'Green sphere indicates draggable position'
            : 'Purple cube can be rotated on X/Y/Z axes'}
          <br />• Shortcuts: <kbd className='rounded bg-white px-1 font-mono text-[10px]'>T</kbd> translate,{' '}
          <kbd className='rounded bg-white px-1 font-mono text-[10px]'>R</kbd> rotate
        </div>
      </div>
    </div>
  )
}
