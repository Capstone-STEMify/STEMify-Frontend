'use client'

import { useState } from 'react'
import { Card } from '@/components/shadcn/card'
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { Plus, Minus } from 'lucide-react'

export default function QuizAIModal() {
  const { closeModal } = useModal()

  const [difficulty, setDifficulty] = useState('Beginner')
  const [quizType, setQuizType] = useState('')
  const [questionCount, setQuestionCount] = useState(1)

  const handleGenerate = () => {
    console.log({ difficulty, quizType, questionCount })
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='h-fit w-full max-w-4xl'>
        <DialogTitle className='text-lg font-semibold'>Create with AI</DialogTitle>
        <Card className='p-4'>
          <div className='flex gap-4'>
            {/* Left Section */}
            <div className='w-1/3 space-y-2 border-r pr-3'>
              <div className='space-y-2 text-xs'>
                <div className='hover:bg-muted cursor-pointer rounded-md border p-2'>
                  <p className='font-medium text-gray-800'>Generate from text</p>
                  <p className='text-[11px] text-gray-500'>Use AI to generate quiz questions from your input</p>
                </div>
                <div className='hover:bg-muted cursor-pointer rounded-md border p-2'>
                  <p className='font-medium text-gray-800'>Convert URL to quiz</p>
                  <p className='text-[11px] text-gray-500'>Convert a web page into quiz questions</p>
                </div>
                <div className='hover:bg-muted cursor-pointer rounded-md border p-2'>
                  <p className='font-medium text-gray-800'>Upload a document</p>
                  <p className='text-[11px] text-gray-500'>Upload PDF or Word document to extract questions</p>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <ScrollArea className='h-[400px] w-2/3'>
              <div className='space-y-4 pl-3'>
                {/* Topic */}
                <div className='space-y-1'>
                  <Label className='text-xs font-semibold'>Topic</Label>
                  <Input className='h-8 text-sm' placeholder='Elements related to style direction in UI/UX design' />
                </div>

                {/* Difficulty */}
                <div className='space-y-1'>
                  <Label className='text-xs font-semibold'>Difficulty Level</Label>
                  <RadioGroup value={difficulty} onValueChange={setDifficulty} className='flex gap-4'>
                    {['Beginner', 'Intermediate', 'Expert'].map((lvl) => (
                      <div key={lvl} className='flex items-center gap-1'>
                        <RadioGroupItem value={lvl} id={lvl} />
                        <Label className='text-xs font-normal' htmlFor={lvl}>
                          {lvl}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Quiz Type */}
                <div className='space-y-1'>
                  <Label className='text-xs font-semibold'>Quiz Type and Amount</Label>
                  <div className='flex items-center gap-2'>
                    <Select value={quizType} onValueChange={setQuizType}>
                      <SelectTrigger className='h-8 w-48 text-xs'>
                        <SelectValue placeholder='Select quiz type' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='multiple-choice'>Multiple Choice</SelectItem>
                        <SelectItem value='true-false'>True / False</SelectItem>
                        <SelectItem value='fill-blank'>Fill in the Blank</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className='flex items-center gap-1'>
                      <Button
                        variant='outline'
                        size='icon'
                        className='h-7 w-7'
                        onClick={() => setQuestionCount(Math.max(1, questionCount - 1))}
                      >
                        <Minus className='h-3 w-3' />
                      </Button>
                      <span className='w-5 text-center text-xs'>{questionCount}</span>
                      <Button
                        variant='outline'
                        size='icon'
                        className='h-7 w-7'
                        onClick={() => setQuestionCount(questionCount + 1)}
                      >
                        <Plus className='h-3 w-3' />
                      </Button>
                    </div>
                  </div>

                  <Button variant='link' className='pl-0 text-[12px] text-blue-600'>
                    + Add Quiz
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        </Card>

        {/* Footer */}
        <DialogFooter className='mt-2 flex justify-end gap-2'>
          <Button variant='outline' size='sm' onClick={closeModal}>
            Cancel
          </Button>
          <Button size='sm' onClick={handleGenerate}>
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
