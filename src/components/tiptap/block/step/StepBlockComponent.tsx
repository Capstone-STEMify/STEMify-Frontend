import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Textarea } from '@/components/shadcn/textarea'
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function StepBlockComponent({ node, updateAttributes, editor }: NodeViewProps) {
  const { steps, currentStep } = node.attrs
  const stepsArray = Array.isArray(steps) ? steps : []
  const [active, setActive] = useState(currentStep ?? 0)
  const editable = editor?.isEditable
  const step = stepsArray[active] || { title: '', content: '', images: [] }
  const fileInputRef = useRef<HTMLInputElement | null>(null)

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      const newImages = [...(step.images || []), reader.result as string]
      updateStep('images', newImages)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const removeImage = (index: number) => {
    const newImages: string[] = (step.images || []).filter((_: string, i: number) => i !== index)
    updateStep('images', newImages)
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

  useEffect(() => {
    setActive(0)
    updateAttributes({ currentStep: 0 })
  }, [])

  const renderStepNav = () => (
    <div className='my-4 flex items-center justify-between gap-4'>
      <Button onClick={goPrev} variant='secondary'>
        <ChevronLeft className='link text-gray-600 hover:text-black' />
      </Button>
      <div className='flex justify-center gap-2'>
        {stepsArray.map((_, i) => (
          <Button
            key={i}
            onClick={() => {
              setActive(i)
              if (editable) updateAttributes({ currentStep: i })
            }}
            size={'icon'}
            className={`h-6 w-6 rounded-full text-sm font-bold ${i === active ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            {i + 1}
          </Button>
        ))}
        {editable ? (
          <div>
            <Button
              onClick={addStep}
              size={'icon'}
              className='h-6 w-6 bg-blue-500 text-sm font-bold text-white hover:bg-blue-600'
            >
              <Plus size={3} />
            </Button>
          </div>
        ) : null}
      </div>
      <Button onClick={goNext} variant='secondary' className='cursor-pointer'>
        <ChevronRight className='link text-gray-600 hover:text-black' />
      </Button>
    </div>
  )

  return (
    <NodeViewWrapper className='bg-sky-custom-100 my-6 w-full rounded-xl p-4 shadow-lg'>
      {renderStepNav()}

      <div className='flex items-center rounded-3xl bg-white'>
        {/* Content */}
        <div className='flex-1 px-6 text-center'>
          {editable ? (
            <div className='my-2 space-y-4'>
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
              <div className='space-y-2'>
                <Label htmlFor={`step-${active}-images`} className='text-left text-base'>
                  Step Images
                </Label>
                <div className='rounded-lg border p-4'>
                  <div className='mb-3 flex items-center justify-between'>
                    <p className='text-sm font-medium'>Uploaded Files ({step.images?.length || 0})</p>
                    <button
                      type='button'
                      onClick={() => fileInputRef.current?.click()}
                      className='flex items-center gap-1 rounded-md border border-neutral-600 px-2 py-1 text-xs hover:bg-neutral-700'
                    >
                      ⬆ Add more
                    </button>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    {(step.images || []).map((img: string, idx: number) => (
                      <div key={idx} className='relative'>
                        <Image
                          src={img}
                          alt={`${step.title}-${idx}`}
                          width={200}
                          height={200}
                          className='aspect-square rounded-xl object-cover'
                        />
                        <button
                          onClick={() => removeImage(idx)}
                          className='absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 text-white shadow hover:bg-red-600'
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <input type='file' accept='image/*' ref={fileInputRef} onChange={handleImageUpload} className='hidden' />
            </div>
          ) : (
            <div className='my-3 space-y-2'>
              <h3 className='text-lg font-bold'>
                {active + 1}. {step.title}
              </h3>
              <div className='flex justify-center gap-4'>
                {(step.images || []).map((img: string, idx: number) => {
                  return (
                    <Image
                      key={idx}
                      src={img}
                      alt={`${step.title}-${idx}`}
                      width={400}
                      height={400}
                      className='rounded shadow'
                    />
                  )
                })}
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
