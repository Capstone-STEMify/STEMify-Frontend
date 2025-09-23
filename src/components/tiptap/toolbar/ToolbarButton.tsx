import SToolTip from '@/components/shared/SToolTip'

export const ToolbarButton = ({
  onClick,
  isActive,
  children,
  disabled,
  tooltip
}: {
  onClick: () => void
  isActive?: boolean
  children: React.ReactNode
  disabled?: boolean
  tooltip: string
}) => (
  <SToolTip content={tooltip} side='bottom'>
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md p-2 transition-colors duration-200 ${isActive ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      {children}
    </button>
  </SToolTip>
)
