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
import { useAppDispatch } from '@/hooks/redux-hooks'
import {
  deleteQuestion,
  duplicateQuestion,
  selectQuestion,
  updateQuestion
} from '@/features/resource/question/slice/quizEditorSlice'
import { useTranslations } from 'next-intl'

type QuestionCardProps = {
  question: Question
  isSelected: boolean
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
  const tq = useTranslations('quiz')
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
          value={answer.id ? answer.id.toString() : answer.key.toString()}
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
          value={answer.id ? answer.id.toString() : answer.key.toString()}
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
          placeholder={`${tq('upsert.form.question.answer')} ${index + 1}`}
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

export const QuestionCard = ({ question, isSelected }: QuestionCardProps) => {
  const tq = useTranslations('quiz')
  const dispatch = useAppDispatch()
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

  const handleSelect = () => {
    dispatch(selectQuestion(question.id))
  }

  const handleUpdate = (updatedQuestion: Question) => {
    dispatch(updateQuestion(updatedQuestion))
  }

  const handleDelete = () => {
    dispatch(deleteQuestion(question.id))
  }

  const handleDuplicate = () => {
    dispatch(duplicateQuestion(question.id))
  }

  const handleAnswerDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = question.answers.findIndex((a) => a.id === active.id)
      const newIndex = question.answers.findIndex((a) => a.id === over.id)

      const reorderedAnswers = arrayMove(question.answers, oldIndex, newIndex)
      handleUpdate({ ...question, answers: reorderedAnswers })
    }
  }

  const handleTypeChange = (type: QuestionType) => {
    let newAnswers = question.answers

    if (type === QuestionType.TRUE_FALSE) {
      newAnswers = [
        { id: Date.now() + 1, content: 'True', isCorrect: false },
        { id: Date.now() + 2, content: 'False', isCorrect: false }
      ]
    } else if (question.questionType === QuestionType.TRUE_FALSE) {
      newAnswers = [
        { id: Date.now() + 3, content: '', isCorrect: false },
        { id: Date.now() + 4, content: '', isCorrect: false }
      ]
    }

    handleUpdate({ ...question, questionType: type, answers: newAnswers })
  }

  const addAnswer = () => {
    const newAnswer = {
      id: Date.now(),
      content: '',
      isCorrect: false
    }
    handleUpdate({ ...question, answers: [...question.answers, newAnswer] })
  }

  const removeAnswer = (answerId: number) => {
    if (question.answers.length <= 2) return
    handleUpdate({
      ...question,
      answers: question.answers.filter((a) => a.id !== answerId)
    })
  }

  const updateAnswer = (answerId: number, content: string) => {
    handleUpdate({
      ...question,
      answers: question.answers.map((a) => (a.id === answerId ? { ...a, content } : a))
    })
  }

  const toggleAnswerCorrect = (answerId: number) => {
    const isSingleChoice = question.questionType === QuestionType.SINGLE_CHOICE

    handleUpdate({
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
        isSelected ? 'shadow-lg' : 'hover:shadow-md',
        isDragging && 'opacity-50'
      )}
      onClick={handleSelect}
    >
      <div className='flex items-start gap-4'>
        <div {...attributes} {...listeners} className='mt-2 cursor-grab active:cursor-grabbing'>
          <GripVertical className='text-muted-foreground h-5 w-5' />
        </div>

        <div className='flex-1 space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex flex-1 items-center gap-4'>
              <Label className='text-sm font-medium'>
                {tq('upsert.form.question.question')} {question.orderIndex}
              </Label>
              <Select value={question.questionType} onValueChange={(value) => handleTypeChange(value as QuestionType)}>
                <SelectTrigger className='w-64'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={QuestionType.SINGLE_CHOICE}>{tq('upsert.form.question.singleChoice')}</SelectItem>
                  <SelectItem value={QuestionType.MULTIPLE_CHOICE}>
                    {tq('upsert.form.question.multipleChoice')}
                  </SelectItem>
                  <SelectItem value={QuestionType.TRUE_FALSE}>{tq('upsert.form.question.trueFalse')}</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type='number'
                value={question.points}
                onChange={(e) => handleUpdate({ ...question, points: parseInt(e.target.value) || 1 })}
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
                  handleDuplicate()
                }}
              >
                <Copy className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete()
                }}
              >
                <Trash2 className='text-destructive h-4 w-4' />
              </Button>
            </div>
          </div>

          <div>
            <Textarea
              value={question.content}
              onChange={(e) => handleUpdate({ ...question, content: e.target.value })}
              placeholder={tq('upsert.form.question.enterQuestion')}
              className='min-h-20'
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className='space-y-2'>
            <Label>
              {tq('upsert.form.question.answer')} ({tq('upsert.form.question.dragToReorder')})
            </Label>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleAnswerDragEnd}>
              <SortableContext items={question.answers.map((a) => a.id)} strategy={verticalListSortingStrategy}>
                <RadioGroup value={question.answers.find((a) => a.isCorrect)?.id?.toString()}>
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
                {tq('upsert.form.question.addOption')}
              </Button>
            )}
          </div>

          <div>
            <Label className='mb-2'>
              {tq('upsert.form.question.explanation')} ({tq('upsert.form.question.optional')})
            </Label>
            <Textarea
              value={question.answerExplanation}
              onChange={(e) => handleUpdate({ ...question, answerExplanation: e.target.value })}
              placeholder={tq('upsert.form.question.explanation')}
              rows={2}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
