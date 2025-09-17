// components/tiptap/block/quiz/QuizBlockComponent.tsx
import { Button } from '@/components/shadcn/button'
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { Check, GraduationCap, Pencil } from 'lucide-react'

interface QuizBlockComponentProps extends NodeViewProps {
  mode?: 'teacher' | 'student'
}

export default function QuizBlockComponent({ node, updateAttributes, mode = 'student' }: QuizBlockComponentProps) {
  const { question, options } = node.attrs as {
    question: string
    options: {
      id: string
      text: string
      isCorrect: boolean
      explanation?: string
    }[]
  }

  const handleSelect = (id: string) => {
    if (mode === 'student') {
      const opt = options.find((o) => o.id === id)
      if (opt) {
        alert(opt.isCorrect ? '✅ Correct!' : '❌ Wrong!')
      }
    }
  }

  const optionsArray: { id: string; text: string; isCorrect: boolean; explanation?: string }[] = Array.isArray(options)
    ? options
    : []

  return (
    <NodeViewWrapper>
      {mode === 'teacher' ? (
        <div>
          <div className='bg-sky-custom-100/50 flex items-center gap-2 rounded-t-3xl p-4'>
            <Pencil size={16} />
            <p className='font-semibold'>{question}</p>
          </div>
          <div className='space-y-2 rounded-b-3xl bg-yellow-100/40 p-4'>
            <div className='flex justify-between'>
              <div className='flex items-center gap-2 text-lg font-semibold'>
                <GraduationCap className='text-blue-600' />
                Answer
              </div>
              <div className='text-sm text-gray-400 italic'>Students won't see this answer</div>
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
                  </div>
                </div>

                {index < optionsArray.length - 1 && <hr className='my-2 h-[1px] border-gray-200' />}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className='bg-sky-custom-100 mb-2 flex items-center gap-2 p-2'>
            <Pencil size={16} />
            <p className='font-semibold'>{question}</p>
          </div>
          <div className='space-y-2'>
            {optionsArray.map((opt) => (
              <Button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className='flex w-full items-center gap-2 rounded border px-3 py-2 text-left hover:bg-gray-100'
              >
                <span className='font-semibold'>{opt.id}.</span>
                <span>{opt.text}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </NodeViewWrapper>
  )
}
