import { Card } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { Label } from '@/components/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Checkbox } from '@/components/shadcn/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group'
import { Copy, Trash2, GripVertical, Plus, X } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Question, QuestionType } from '@/features/resource/question/types/question.type'
import { cn } from '@/utils/shadcn/utils'

type QuestionCardProps = {
  question: Question
  isSelected: boolean
  onSelect: () => void
  onUpdate: (question: Question) => void
  onDelete: (id: number) => void
  onDuplicate: (id: number) => void
}

const SortableAnswer = ({
  answer,
  index,
  question,
  onUpdate,
  onRemove,
  onToggleCorrect
}: {
  answer: any
  index: number
  question: Question
  onUpdate: (answerId: number, content: string) => void
  onRemove: (answerId: number) => void
  onToggleCorrect: (answerId: number) => void
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: answer.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('flex items-center gap-3 rounded-lg p-2 transition-all', isDragging && 'bg-muted shadow-lg')}
    >
      <div {...attributes} {...listeners} className='cursor-grab active:cursor-grabbing'>
        <GripVertical className='text-muted-foreground h-4 w-4' />
      </div>

      {question.questionType === QuestionType.SINGLE_CHOICE ? (
        <RadioGroupItem
          value={answer.id.toString()}
          onClick={(e) => {
            e.stopPropagation()
            onToggleCorrect(answer.id)
          }}
        />
      ) : question.questionType === QuestionType.MULTIPLE_CHOICE ? (
        <Checkbox
          checked={answer.isCorrect}
          onCheckedChange={() => onToggleCorrect(answer.id)}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <RadioGroupItem
          value={answer.id.toString()}
          onClick={(e) => {
            e.stopPropagation()
            onToggleCorrect(answer.id)
          }}
        />
      )}

      {question.questionType === QuestionType.TRUE_FALSE ? (
        <Label className='flex-1 font-normal'>{answer.content}</Label>
      ) : (
        <Input
          value={answer.content}
          onChange={(e) => {
            e.stopPropagation()
            onUpdate(answer.id, e.target.value)
          }}
          placeholder={`Option ${index + 1}`}
          className='flex-1'
          onClick={(e) => e.stopPropagation()}
        />
      )}

      {question.answers.length > 2 && question.questionType !== QuestionType.TRUE_FALSE && (
        <Button
          variant='ghost'
          size='icon'
          onClick={(e) => {
            e.stopPropagation()
            onRemove(answer.id)
          }}
        >
          <X className='h-4 w-4' />
        </Button>
      )}
    </div>
  )
}

export const QuestionCard = ({
  question,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate
}: QuestionCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleAnswerDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = question.answers.findIndex((a) => a.id === active.id)
      const newIndex = question.answers.findIndex((a) => a.id === over.id)

      const reorderedAnswers = arrayMove(question.answers, oldIndex, newIndex)
      onUpdate({ ...question, answers: reorderedAnswers })
    }
  }

  const handleTypeChange = (type: QuestionType) => {
    let newAnswers = question.answers

    if (type === QuestionType.TRUE_FALSE) {
      newAnswers = [
        { id: Date.now(), content: 'True', isCorrect: false },
        { id: Date.now() + 1, content: 'False', isCorrect: false }
      ]
    } else if (question.questionType === QuestionType.TRUE_FALSE) {
      newAnswers = [
        { id: Date.now(), content: '', isCorrect: false },
        { id: Date.now() + 1, content: '', isCorrect: false }
      ]
    }

    onUpdate({ ...question, questionType: type, answers: newAnswers })
  }

  const addAnswer = () => {
    const newAnswer = {
      id: Date.now(),
      content: '',
      isCorrect: false
    }
    onUpdate({ ...question, answers: [...question.answers, newAnswer] })
  }

  const removeAnswer = (answerId: number) => {
    if (question.answers.length <= 2) return
    onUpdate({
      ...question,
      answers: question.answers.filter((a) => a.id !== answerId)
    })
  }

  const updateAnswer = (answerId: number, content: string) => {
    onUpdate({
      ...question,
      answers: question.answers.map((a) => (a.id === answerId ? { ...a, content } : a))
    })
  }

  const toggleAnswerCorrect = (answerId: number) => {
    const isSingleChoice = question.questionType === QuestionType.SINGLE_CHOICE

    onUpdate({
      ...question,
      answers: question.answers.map((a) =>
        a.id === answerId ? { ...a, isCorrect: !a.isCorrect } : isSingleChoice ? { ...a, isCorrect: false } : a
      )
    })
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'cursor-pointer p-6 transition-all',
        isSelected ? 'ring-primary shadow-lg ring-2' : 'hover:shadow-md',
        isDragging && 'opacity-50'
      )}
      onClick={onSelect}
    >
      <div className='flex items-start gap-4'>
        <div {...attributes} {...listeners} className='mt-2 cursor-grab active:cursor-grabbing'>
          <GripVertical className='text-muted-foreground h-5 w-5' />
        </div>

        <div className='flex-1 space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex flex-1 items-center gap-4'>
              <Label className='text-sm font-medium'>Question {question.orderIndex}</Label>
              <Select value={question.questionType} onValueChange={(value) => handleTypeChange(value as QuestionType)}>
                <SelectTrigger className='w-48'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={QuestionType.SINGLE_CHOICE}>Single Choice</SelectItem>
                  <SelectItem value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</SelectItem>
                  <SelectItem value={QuestionType.TRUE_FALSE}>True/False</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type='number'
                value={question.points}
                onChange={(e) => onUpdate({ ...question, points: parseInt(e.target.value) || 1 })}
                className='w-20'
                placeholder='Points'
              />
            </div>

            <div className='flex gap-2'>
              <Button
                variant='ghost'
                size='icon'
                onClick={(e) => {
                  e.stopPropagation()
                  onDuplicate(question.id)
                }}
              >
                <Copy className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(question.id)
                }}
              >
                <Trash2 className='text-destructive h-4 w-4' />
              </Button>
            </div>
          </div>

          <div>
            <Textarea
              value={question.content}
              onChange={(e) => onUpdate({ ...question, content: e.target.value })}
              placeholder='Enter your question here...'
              className='min-h-20'
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className='space-y-2'>
            <Label>Answers (Drag to reorder)</Label>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleAnswerDragEnd}>
              <SortableContext items={question.answers.map((a) => a.id)} strategy={verticalListSortingStrategy}>
                <RadioGroup value={question.answers.find((a) => a.isCorrect)?.id.toString()}>
                  <div className='space-y-2'>
                    {question.answers.map((answer, index) => (
                      <SortableAnswer
                        key={answer.id}
                        answer={answer}
                        index={index}
                        question={question}
                        onUpdate={updateAnswer}
                        onRemove={removeAnswer}
                        onToggleCorrect={toggleAnswerCorrect}
                      />
                    ))}
                  </div>
                </RadioGroup>
              </SortableContext>
            </DndContext>

            {question.questionType !== QuestionType.TRUE_FALSE && (
              <Button
                variant='outline'
                size='sm'
                onClick={(e) => {
                  e.stopPropagation()
                  addAnswer()
                }}
                className='mt-2'
              >
                <Plus className='mr-2 h-4 w-4' />
                Add Option
              </Button>
            )}
          </div>

          <div>
            <Label>Explanation (Optional)</Label>
            <Textarea
              value={question.answerExplanation}
              onChange={(e) => onUpdate({ ...question, answerExplanation: e.target.value })}
              placeholder='Explain the correct answer...'
              rows={2}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
