import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Textarea } from '@/components/shadcn/textarea'
import ImageUploader from '@/components/shared/file/FileUploader'
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

export default function StepBlockComponent({ node, updateAttributes, editor }: NodeViewProps) {
  const { steps, currentStep } = node.attrs
  const stepsArray = Array.isArray(steps) ? steps : []
  const [active, setActive] = useState(currentStep ?? 0)
  const editable = editor?.isEditable
  const step = stepsArray[active] || { title: '', content: '', images: [] }
  const [localImages, setLocalImages] = useState<string[]>(step.images || [])

  const initialFiles = useMemo(
    () =>
      (step.images || []).map((url: string, idx: number) => ({
        name: `image-${idx}`,
        size: 1000,
        type: 'image/jpeg',
        url,
        id: `init-${idx}`
      })),
    [step.images]
  )

  useEffect(() => {
    setLocalImages(step.images || [])
  }, [step.images])

  useEffect(() => {
    if (editable) {
      queueMicrotask(() => {
        updateStep('images', localImages)
      })
    }
  }, [localImages, editable])

  useEffect(() => {
    setActive(0)
    queueMicrotask(() => {
      updateAttributes({ currentStep: 0 })
    })
  }, [])

  const updateStep = (field: string, value: any) => {
    const newSteps = [...stepsArray]
    newSteps[active] = { ...newSteps[active], [field]: value }
    updateAttributes({ steps: newSteps })
  }

  const addStep = () => {
    const newSteps = [...stepsArray, { title: `Step ${stepsArray.length + 1}`, content: '', images: [] }]
    updateAttributes({ steps: newSteps })
    setActive(newSteps.length - 1)
  }

  const goPrev = () => {
    const newStep = active > 0 ? active - 1 : stepsArray.length - 1
    setActive(newStep)
    if (editable) updateAttributes({ currentStep: newStep })
  }

  const goNext = () => {
    const newStep = active < stepsArray.length - 1 ? active + 1 : 0
    setActive(newStep)
    if (editable) updateAttributes({ currentStep: newStep })
  }

  const renderStepNav = () => (
    <div className='my-4 flex items-center justify-between gap-4'>
      <Button onClick={goPrev} variant='secondary'>
        <ChevronLeft className='text-gray-600 hover:text-black' />
      </Button>
      <div className='flex justify-center gap-2'>
        {stepsArray.map((_, i) => (
          <Button
            key={i}
            onClick={() => {
              setActive(i)
              if (editable) updateAttributes({ currentStep: i })
            }}
            size='icon'
            className={`h-6 w-6 rounded-full text-sm font-bold ${
              i === active ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            {i + 1}
          </Button>
        ))}
        {editable && (
          <Button
            onClick={addStep}
            size='icon'
            className='h-6 w-6 bg-blue-500 text-sm font-bold text-white hover:bg-blue-600'
          >
            <Plus size={3} />
          </Button>
        )}
      </div>
      <Button onClick={goNext} variant='secondary'>
        <ChevronRight className='text-gray-600 hover:text-black' />
      </Button>
    </div>
  )

  return (
    <NodeViewWrapper className='bg-sky-custom-100 my-6 w-full rounded-xl p-4 shadow-lg'>
      {renderStepNav()}

      <div className='flex items-center rounded-3xl bg-white'>
        <div className='flex-1 px-6 text-center'>
          {editable ? (
            <div className='my-2 space-y-4'>
              {/* Step title */}
              <div className='space-y-2'>
                <Label htmlFor={`step-${active}-title`} className='text-base'>
                  Step Title
                </Label>
                <Input
                  value={step.title}
                  onChange={(e) => updateStep('title', e.target.value)}
                  placeholder='Step title...'
                />
              </div>

              {/* Step content */}
              <div className='space-y-2'>
                <Label htmlFor={`step-${active}-content`} className='text-base'>
                  Step Content
                </Label>
                <Textarea
                  value={step.content}
                  onChange={(e) => updateStep('content', e.target.value)}
                  placeholder='Step content...'
                />
              </div>

              {/* Step images */}
              <div className='space-y-2'>
                <Label htmlFor={`step-${active}-images`} className='text-left text-base'>
                  Step Images
                </Label>
                <ImageUploader
                  initialFiles={initialFiles}
                  maxFiles={6}
                  maxSizeMB={5}
                  onChange={(files) => {
                    const urls = files.map((f) => f.preview || (f.file as any).url)
                    setLocalImages(urls)
                  }}
                />
              </div>
            </div>
          ) : (
            <div className='my-3 space-y-2'>
              <h3 className='text-lg font-bold'>
                {active + 1}. {step.title}
              </h3>
              <div className='flex justify-center gap-5'>
                {(step.images || []).map((img: string, idx: number) => (
                  <Image
                    key={idx}
                    src={img}
                    alt={`${step.title}-${idx}`}
                    width={200}
                    height={200}
                    className='aspect-square rounded-2xl border'
                  />
                ))}
              </div>
              {step.content && <p className='mt-3 text-gray-700'>{step.content}</p>}
            </div>
          )}
        </div>
      </div>

      {renderStepNav()}
    </NodeViewWrapper>
  )
}
