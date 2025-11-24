import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { Button } from '@/components/shadcn/button'
import { useAppSelector } from '@/hooks/redux-hooks'
import { UserRole } from '@/types/userRole'
import { Input } from '@/components/shadcn/input'
import { SPopover } from '@/components/shared/SPopover'
import Link from 'next/link'

export default function LinkButtonBlockComponent({ node, updateAttributes, editor }: NodeViewProps) {
  const { label, url } = node.attrs as { label: string; url: string }
  const role = useAppSelector((state) => state.selectedOrganization.currentRole)
  const editable = editor?.isEditable

  return (
    <NodeViewWrapper className='block w-full text-center'>
      {editable && (role === UserRole.STAFF || role === UserRole.ADMIN) ? (
        <div className='flex justify-center'>
          <SPopover
            className='w-96'
            trigger={
              <Button
                className='bg-amber-custom-400 font-semibold text-black shadow-md hover:bg-amber-500'
                onClick={() => url && window.open(url, '_blank')}
              >
                {label}
              </Button>
            }
          >
            <div className='space-y-2'>
              <h3>Nút liên kết</h3>
              <Input
                value={label}
                onChange={(e) => updateAttributes({ label: e.target.value })}
                placeholder='Nhãn nút'
              />
              <Input value={url} onChange={(e) => updateAttributes({ url: e.target.value })} placeholder='Nhập URL' />
            </div>
          </SPopover>
        </div>
      ) : (
        <div className='flex w-full justify-center text-center'>
          <Link
            href={url || '#'}
            target='_blank'
            rel='noopener noreferrer'
            className='bg-amber-custom-400 inline-block rounded-lg px-4 py-2 font-semibold text-black no-underline shadow-md hover:bg-amber-500'
          >
            {label}
          </Link>
        </div>
      )}
    </NodeViewWrapper>
  )
}
