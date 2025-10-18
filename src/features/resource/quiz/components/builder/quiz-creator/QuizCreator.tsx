'use client'

import { useState } from 'react'
import { Card, CardFooter } from '@/components/shadcn/card'
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
    // Logic generate quiz bằng AI ở đây
    console.log({
      difficulty,
      quizType,
      questionCount
    })
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='h-fit w-full max-w-4xl'>
        <DialogTitle>Create with AI</DialogTitle>
        <Card className='mt-2 p-6'>
          <div className='flex gap-6'>
            {/* Left Section */}
            <div className='w-1/3 space-y-3 border-r pr-4'>
              <div className='space-y-3 text-sm'>
                <div className='hover:bg-muted cursor-pointer rounded-md border p-3'>
                  <p className='font-medium text-gray-900'>Generate from text</p>
                  <p className='text-xs text-gray-500'>Use AI to generate quiz questions from your input</p>
                </div>
                <div className='hover:bg-muted cursor-pointer rounded-md border p-3'>
                  <p className='font-medium text-gray-900'>Convert URL to quiz</p>
                  <p className='text-xs text-gray-500'>Convert a web page into quiz questions</p>
                </div>
                <div className='hover:bg-muted cursor-pointer rounded-md border p-3'>
                  <p className='font-medium text-gray-900'>Upload a document</p>
                  <p className='text-xs text-gray-500'>Upload PDF or Word document to extract questions</p>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <ScrollArea className='h-[450px] w-2/3'>
              <div className='space-y-5 pl-4'>
                {/* Topic */}
                <div className='space-y-2'>
                  <Label>Topic</Label>
                  <Input placeholder='Elements related to style direction in UI/UX design' />
                </div>

                {/* Difficulty */}
                <div className='space-y-2'>
                  <Label>Difficulty Level</Label>
                  <RadioGroup value={difficulty} onValueChange={setDifficulty} className='flex gap-4'>
                    {['Beginner', 'Intermediate', 'Expert'].map((lvl) => (
                      <div key={lvl} className='flex items-center space-x-2'>
                        <RadioGroupItem value={lvl} id={lvl} />
                        <Label htmlFor={lvl}>{lvl}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Quiz Type */}
                <div className='space-y-2'>
                  <Label>Quiz Type and Amount</Label>
                  <div className='flex items-center gap-3'>
                    <Select value={quizType} onValueChange={setQuizType}>
                      <SelectTrigger className='w-52'>
                        <SelectValue placeholder='Select quiz type' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='multiple-choice'>Multiple Choice</SelectItem>
                        <SelectItem value='true-false'>True / False</SelectItem>
                        <SelectItem value='fill-blank'>Fill in the Blank</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className='flex items-center gap-2'>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => setQuestionCount(Math.max(1, questionCount - 1))}
                      >
                        <Minus className='h-4 w-4' />
                      </Button>
                      <span className='w-6 text-center'>{questionCount}</span>
                      <Button variant='outline' size='icon' onClick={() => setQuestionCount(questionCount + 1)}>
                        <Plus className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>

                  <Button variant='link' className='pl-0 text-sm'>
                    + Add Quiz
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Footer */}
        </Card>
        <DialogFooter className='flex justify-end gap-3'>
          <Button variant='outline' onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={handleGenerate}>Generate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
