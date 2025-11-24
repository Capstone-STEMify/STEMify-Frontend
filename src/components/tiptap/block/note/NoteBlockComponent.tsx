import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { useAppSelector } from '@/hooks/redux-hooks'
import { LicenseType, UserRole } from '@/types/userRole'
import { ChevronDown, ChevronUp, GraduationCap, GraduationCapIcon, Pencil } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { Textarea } from '@/components/shadcn/textarea'
import { useState } from 'react'
import { Label } from '@/components/shadcn/label'

export default function NoteBlockComponent({ node, updateAttributes, editor }: NodeViewProps) {
  const { title, content } = node.attrs as { title: string; content: string }
  const role = useAppSelector((state) => state.selectedOrganization.currentRole)
  const editable = editor?.isEditable
  const [expanded, setExpanded] = useState(true)

  if (role === LicenseType.STUDENT) {
    return null // student không được thấy note
  }

  return (
    <NodeViewWrapper as='div' className='my-4'>
      {editable && (role === UserRole.STAFF || role === UserRole.ADMIN) ? (
        <div className='rounded-md border'>
          <div className='flex items-center justify-between rounded-t-md bg-sky-100 px-4 py-2'>
            <div className='flex items-center gap-2 font-semibold text-blue-700'>
              <GraduationCap size={16} />
              Ghi chú giáo viên
            </div>
            <Button
              className='flex items-center gap-3 text-gray-500 italic hover:text-gray-700'
              onClick={() => setExpanded(!expanded)}
              variant={'ghost'}
            >
              <span className='text-xs text-gray-500 italic'>Học sinh sẽ không thấy ghi chú này</span>
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className='space-y-5 px-6 py-4 text-sm text-gray-700'>
              <div className='space-y-2'>
                <Label className='text-sm font-semibold'>Tiêu đề:</Label>
                <Textarea
                  value={title}
                  onChange={(e) => updateAttributes({ title: e.target.value })}
                  placeholder='Tiêu đề ghi chú...'
                  className='flex-1'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-sm font-semibold'>Nội dung:</Label>
                <Textarea
                  value={content}
                  onChange={(e) => updateAttributes({ content: e.target.value })}
                  placeholder='Viết ghi chú cho giáo viên...'
                  className='min-h-[120px] w-full'
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='rounded-md border bg-yellow-50'>
          {/* Header */}
          <div className='flex items-center justify-between rounded-t-md bg-sky-100 px-4 py-2'>
            <div className='flex items-center gap-2 font-semibold text-blue-700'>
              <GraduationCap size={16} />
              Ghi chú giáo viên
            </div>

            <Button
              className='flex items-center gap-3 text-gray-500 italic hover:text-gray-700'
              onClick={() => setExpanded(!expanded)}
              variant={'ghost'}
            >
              <span className='text-xs text-gray-500 italic'>Học sinh sẽ không thấy ghi chú này</span>
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>

          {/* Animated content */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className='space-y-2 px-6 py-4 text-sm text-gray-700'>
              {title && <h3 className='font-bold'>{title}</h3>}
              <div className='whitespace-pre-line'>{content}</div>
            </div>
          </div>
        </div>
      )}
    </NodeViewWrapper>
  )
}
