import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { Button } from '@/components/shadcn/button'
import { useAppSelector } from '@/hooks/redux-hooks'
import { UserRole } from '@/types/userRole'
import { Input } from '@/components/shadcn/input'
import { SPopover } from '@/components/shared/SPopover'

export default function LinkButtonBlockComponent({ node, updateAttributes, editor }: NodeViewProps) {
  const { label, url } = node.attrs as { label: string; url: string }
  const role = useAppSelector((state) => state.auth.user?.role)
  const editable = editor?.isEditable

  return (
    <NodeViewWrapper>
      {editable && (role === UserRole.STAFF || role === UserRole.ADMIN) ? (
        <div className='mx-auto'>
          <SPopover
            className='w-96'
            trigger={
              <div className='flex justify-center'>
                <Button
                  className='bg-amber-custom-400 font-semibold text-black shadow-md hover:bg-amber-500'
                  onClick={() => url && window.open(url, '_blank')}
                >
                  {label}
                </Button>
              </div>
            }
            children={
              <div className='space-y-2'>
                <h3>Button link</h3>
                <Input
                  value={label}
                  onChange={(e) => updateAttributes({ label: e.target.value })}
                  placeholder='Button label'
                />
                <Input
                  value={url}
                  onChange={(e) => updateAttributes({ url: e.target.value })}
                  placeholder='Target URL'
                />
              </div>
            }
          />
        </div>
      ) : (
        <div className='flex justify-center'>
          <Button
            className='bg-amber-custom-400 font-semibold text-black shadow-md hover:bg-amber-500'
            onClick={() => url && window.open(url, '_blank')}
          >
            {label}
          </Button>
        </div>
      )}
    </NodeViewWrapper>
  )
}
