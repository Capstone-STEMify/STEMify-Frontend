import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Textarea } from '@/components/shadcn/textarea'
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { ChevronLeft, ChevronRight, Plus, Trash2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'

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

  const removeStep = (index: number) => {
    if (stepsArray.length <= 1) return
    const newSteps = stepsArray.filter((_, i) => i !== index)
    const newActive = Math.max(0, active - (index <= active ? 1 : 0))
    updateAttributes({ steps: newSteps, currentStep: newActive })
    setActive(newActive)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    const files = Array.from(e.target.files) // Lấy toàn bộ file
    const readers = files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
    )

    Promise.all(readers).then((results) => {
      const newImages = [...(step.images || []), ...results]
      updateStep('images', newImages)
    })
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
          <>
            <Button
              onClick={addStep}
              size='icon'
              className='h-6 w-6 bg-blue-500 text-sm font-bold text-white hover:bg-blue-600'
            >
              <Plus size={3} />
            </Button>
            <Button
              onClick={() => removeStep(active)}
              size='icon'
              className='h-6 w-6 bg-red-500 text-sm font-bold text-white hover:bg-red-600'
            >
              <Trash2 size={14} />
            </Button>
          </>
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
              <div className='space-y-2'>
                <Label htmlFor={`step-${active}-title`} className='text-base'>
                  Tiêu đề
                </Label>
                <Input
                  value={step.title}
                  onChange={(e) => updateStep('title', e.target.value)}
                  placeholder='Tiêu đề...'
                />
              </div>

              {/* Step content */}
              <div className='space-y-2'>
                <Label htmlFor={`step-${active}-content`} className='text-base'>
                  Nội dung
                </Label>
                <Textarea
                  value={step.content}
                  onChange={(e) => updateStep('content', e.target.value)}
                  placeholder='Nội dung...'
                />
              </div>

              {/* Step images */}
              <div className='space-y-2'>
                <Label htmlFor={`step-${active}-images`} className='text-left text-base'>
                  Hình ảnh
                </Label>
                <div className='rounded-lg border p-4'>
                  <div className='mb-3 flex items-center justify-between'>
                    <p className='text-sm font-medium'>Hình ảnh đã tải lên ({step.images?.length || 0})</p>
                    <Button onClick={() => fileInputRef.current?.click()} variant={'outline'} className=''>
                      <Upload size={8} /> Thêm nữa
                    </Button>
                  </div>
                  <div className='flex flex-wrap items-center justify-center gap-7'>
                    {(step.images || []).map((img: string, idx: number) => (
                      <div key={idx} className='group relative h-[200px] w-[200px] overflow-hidden rounded-xl border'>
                        {/* Ảnh */}
                        <Image
                          src={img}
                          alt={`${step.title}-${idx}`}
                          width={200}
                          height={200}
                          className='h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-60'
                        />

                        <div className='absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                          <Button
                            onClick={() => removeImage(idx)}
                            variant='destructive'
                            size='icon'
                            className='w-fit px-2 text-white shadow-lg'
                          >
                            <Trash2 size={24} /> Xóa ảnh
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <input
                type='file'
                multiple
                accept='image/*'
                ref={fileInputRef}
                onChange={handleImageUpload}
                className='hidden'
              />
            </div>
          ) : (
            <div className='my-3 space-y-2'>
              <h3 className='text-lg font-bold'>
                {active + 1}. {step.title}
              </h3>
              <div className='flex flex-wrap items-center justify-center gap-5'>
                {(step.images || []).map((img: string, idx: number) => (
                  <Image
                    key={idx}
                    src={img}
                    alt={`${step.title}-${idx}`}
                    width={200}
                    height={200}
                    className='aspect-square rounded-2xl border object-cover'
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
