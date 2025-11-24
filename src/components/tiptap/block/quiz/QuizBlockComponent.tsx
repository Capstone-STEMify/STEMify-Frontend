import { Button } from '@/components/shadcn/button'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/shadcn/table'
import { Textarea } from '@/components/shadcn/textarea'
import { useAppSelector } from '@/hooks/redux-hooks'
import { LicenseType, UserRole } from '@/types/userRole'
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { Check, GraduationCap, Pencil, Plus, Trash, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function QuizBlockComponent({ node, updateAttributes, editor }: NodeViewProps) {
  const { question, options } = node.attrs as {
    question: string
    options: {
      id: string
      text: string
      isCorrect: boolean
      explanation?: string
    }[]
  }
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const role = useAppSelector((state) => state.selectedOrganization.currentRole)
  const editable = editor?.isEditable

  const optionsArray = Array.isArray(options) ? options : []
  const selectedOption = optionsArray.find((o) => o.id === selectedId)
  const handleQuestionChange = (value: string) => {
    updateAttributes({ question: value })
  }

  const handleOptionChange = (id: string, key: 'text' | 'isCorrect' | 'explanation', value: any) => {
    const newOptions = optionsArray.map((opt) => (opt.id === id ? { ...opt, [key]: value } : opt))
    updateAttributes({ options: newOptions })
  }

  const handleAddOption = () => {
    const newId = String.fromCharCode(65 + optionsArray.length) // A, B, C, D...
    const newOptions = [...optionsArray, { id: newId, text: '', isCorrect: false, explanation: '' }]
    updateAttributes({ options: newOptions })
  }

  const handleDeleteOption = (id: string) => {
    const newOptions = optionsArray.filter((opt) => opt.id !== id)
    updateAttributes({ options: newOptions })
  }
  return (
    <NodeViewWrapper>
      {/* Edit mode */}
      {editable ? (
        <div className='space-y-4 rounded-3xl border px-4 py-6'>
          <h1>Câu hỏi</h1>
          <div className='flex items-center gap-2'>
            <Pencil size={16} />
            <Textarea
              value={question}
              onChange={(e) => handleQuestionChange(e.target.value)}
              placeholder='Enter question...'
              className='flex-1'
            />
          </div>

          <div className='rounded-xl border'>
            <Table className='w-full overflow-hidden rounded-xl shadow-sm'>
              <TableHeader className='rounded-xl'>
                <TableRow className='bg-gray-100'>
                  <TableCell className='px-4 py-2 text-center font-semibold'>Lựa chọn</TableCell>
                  <TableCell className='px-4 py-2 text-center font-semibold'>Nội dung</TableCell>
                  <TableCell className='px-4 py-2 text-center font-semibold'>Giải thích</TableCell>
                  <TableCell className='px-4 py-2 text-center font-semibold'>Đúng</TableCell>
                  <TableCell className='px-4 py-2 text-center font-semibold'>Hành động</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className='divide-y divide-gray-200'>
                {optionsArray.map((opt) => (
                  <TableRow key={opt.id} className='transition-colors odd:bg-white even:bg-gray-50 hover:bg-gray-100'>
                    <TableCell className='px-4 py-3 text-center font-bold'>{opt.id}</TableCell>
                    <TableCell className='px-4 py-3'>
                      <Textarea
                        value={opt.text}
                        onChange={(e) => handleOptionChange(opt.id, 'text', e.target.value)}
                        placeholder={`Option ${opt.id}`}
                        className='h-8 w-full rounded-lg'
                      />
                    </TableCell>
                    <TableCell className='px-4 py-3'>
                      <Textarea
                        value={opt.explanation || ''}
                        onChange={(e) => handleOptionChange(opt.id, 'explanation', e.target.value)}
                        placeholder='Explanation'
                        className='h-8 w-full rounded-lg'
                      />
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center'>
                      <Checkbox
                        checked={opt.isCorrect}
                        onCheckedChange={(checked) => handleOptionChange(opt.id, 'isCorrect', !!checked)}
                        className={`border transition-colors hover:border-green-400 data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500 data-[state=unchecked]:border-gray-300 data-[state=unchecked]:bg-white`}
                      />
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center'>
                      <Button variant='ghost' size='icon' onClick={() => handleDeleteOption(opt.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button variant='outline' size='sm' onClick={handleAddOption} className='mt-2'>
            <Plus size={16} className='mr-1' /> Thêm lựa chọn
          </Button>
        </div>
      ) : role === UserRole.STAFF || role === UserRole.ADMIN || role === LicenseType.TEACHER ? (
        <div>
          <div className='bg-sky-custom-100/50 flex items-center gap-2 rounded-t-3xl p-4'>
            <Pencil size={16} />
            <p className='font-semibold'>{question}</p>
          </div>
          <div className='space-y-2 rounded-b-3xl bg-yellow-100/40 p-4'>
            <div className='flex justify-between'>
              <div className='flex items-center gap-2 text-lg font-semibold'>
                <GraduationCap className='text-blue-600' />
                Câu trả lời
              </div>
              <div className='text-sm text-gray-400 italic'>Học sinh sẽ không thấy câu trả lời này</div>
            </div>
            {optionsArray.map((opt, index) => (
              <div key={opt.id}>
                <div className='flex gap-2 py-2'>
                  {opt.isCorrect ? (
                    <div className='flex text-green-600'>
                      <span className='font-semibold'>{opt.id}.</span>
                      <span className='mt-0.5 ml-2 text-green-600'>
                        <Check size={16} className='mt-2 ml-1' />
                      </span>
                    </div>
                  ) : (
                    <div className='flex space-x-2 text-red-600'>
                      <span className='font-semibold'>{opt.id}.</span>
                      <span className='mt-0.5 ml-2'>✘</span>
                    </div>
                  )}
                  <div>
                    <div>{opt.text}</div>
                    {opt.isCorrect && opt.explanation && (
                      <div className='ml-4 text-sm text-green-600 italic'>💡 {opt.explanation}</div>
                    )}
                    {!opt.isCorrect && opt.explanation && (
                      <div className='ml-4 text-sm text-red-600 italic'> {opt.explanation}</div>
                    )}
                  </div>
                </div>

                {index < optionsArray.length - 1 && <hr className='my-2 h-[1px] border-gray-200' />}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className={`space-y-3 rounded-3xl p-4 pl-10 ${
            !selectedOption ? 'bg-sky-custom-100/50' : selectedOption.isCorrect ? 'bg-green-100' : 'bg-red-100'
          } `}
        >
          <div className='flex items-center gap-2'>
            <Pencil size={16} />
            <p className='font-semibold'>{question}</p>
          </div>
          <div className='space-y-4'>
            {optionsArray.map((opt, index) => {
              const isSelected = selectedId === opt.id

              return (
                <div key={opt.id}>
                  <div className='flex items-center gap-3 py-2'>
                    {!isSelected ? (
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => {
                          setSelectedId(opt.id)
                        }}
                      >
                        {opt.id}
                      </Button>
                    ) : opt.isCorrect ? (
                      <span className='mx-2'>
                        <Check size={20} className='text-green-600' />
                      </span>
                    ) : (
                      <span className='mr-2 ml-3 text-lg text-red-600'>✘</span>
                    )}

                    <div>
                      <div>{opt.text}</div>

                      {isSelected && opt.isCorrect && opt.explanation && (
                        <div className='ml-4 text-sm text-green-600 italic'>💡 {opt.explanation}</div>
                      )}
                    </div>
                  </div>

                  {index < optionsArray.length - 1 && <hr className='my-2 h-[1px] border-gray-200' />}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </NodeViewWrapper>
  )
}
