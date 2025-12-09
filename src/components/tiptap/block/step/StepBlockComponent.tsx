import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Textarea } from '@/components/shadcn/textarea'
import { usePostLessonAssetsMutation } from '@/features/resource/lesson-asset/api/lessonAssetApi'
import { PostLessonResponseBody } from '@/features/resource/lesson-asset/types/lessonAsest.type'
import { fileToBase64 } from '@/utils/index'
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { ChevronLeft, ChevronRight, Loader2, Plus, Trash2, Upload, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

export default function StepBlockComponent({ node, updateAttributes, editor }: NodeViewProps) {
  const tc = useTranslations('toast')
  const { lessonId } = useParams()
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

  const [uploadFiles, { isLoading }] = usePostLessonAssetsMutation()
  // 1. Tách riêng hàm xử lý upload
  const uploadLessonFiles = async (files: File[]) => {
    if (!files.length) return []

    const lessonAssets = await Promise.all(
      files.map(async (file) => {
        const base64 = await fileToBase64(file)
        return { name: file.name, assetBytes: base64 }
      })
    )

    const res = await uploadFiles({
      lessonId: Number(lessonId),
      body: { lessonAssets }
    }).unwrap()

    return res.data.assets.map((a: PostLessonResponseBody) => a.assetUrl)
  }

  // 2. Sử dụng trong handleUploadFiles
  const handleUploadFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return

    const files = Array.from(event.target.files)
    const uploaded = await uploadLessonFiles(files)

    updateStep('images', [...(step.images || []), ...uploaded])

    toast.success(tc('successMessage.uploadFile'))

    event.target.value = ''
  }

  // 3. Sử dụng trong onDrop
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation() // Ngăn editor xử lý drop mặc định

    // Nếu kéo từ sidebar (URL text/plain)
    const url = e.dataTransfer.getData('text/plain')
    if (url) {
      updateStep('images', [...(step.images || []), url])
      return
    }

    // Nếu kéo từ máy tính (File)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)
      const uploaded = await uploadLessonFiles(files)

      updateStep('images', [...(step.images || []), ...uploaded])
      toast.success(tc('successMessage.uploadFile'))
    }
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

  function getVisibleSteps(current: number, total: number): (number | 'ellipsis')[] {
    const steps: (number | 'ellipsis')[] = []

    if (total <= 5) {
      for (let i = 0; i < total; i++) steps.push(i)
    } else {
      if (current <= 2) {
        steps.push(0, 1, 2, 3, 'ellipsis', total - 1)
      } else if (current >= total - 3) {
        steps.push(0, 'ellipsis', total - 4, total - 3, total - 2, total - 1)
      } else {
        steps.push(0, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total - 1)
      }
    }

    return steps
  }

  const renderStepNav = () => (
    <div className='my-4 flex items-center justify-between gap-4'>
      <Button onClick={goPrev} variant='secondary'>
        <ChevronLeft className='text-gray-600 hover:text-black' />
      </Button>
      <div className='flex justify-center gap-2'>
        {getVisibleSteps(active, stepsArray.length).map((item, idx) =>
          item === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className='px-2'>
              …
            </span>
          ) : (
            <Button
              key={item}
              onClick={() => {
                setActive(item as number)
                if (editable) updateAttributes({ currentStep: item })
              }}
              size='icon'
              className={`h-6 w-6 rounded-full text-sm font-bold ${
                item === active ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              {(item as number) + 1}
            </Button>
          )
        )}

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

              <div className='mb-5 space-y-2'>
                <Label htmlFor={`step-${active}-images`} className='text-left text-base'>
                  Hình ảnh
                </Label>
                <div className='flex flex-wrap items-center justify-center gap-7'>
                  {(step.images || []).map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className='group relative flex items-center justify-center rounded-xl border bg-white p-2'
                    >
                      <Image
                        src={img}
                        alt={`${step.title}-${idx}`}
                        width={0}
                        height={0}
                        sizes='100vw'
                        className='h-auto max-h-[200px] w-auto max-w-full object-contain transition-opacity duration-300 group-hover:opacity-60'
                      />

                      {editable && (
                        <div className='absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                          <Button
                            onClick={() => removeImage(idx)}
                            variant='destructive'
                            size='icon'
                            className='w-fit px-2 text-white shadow-lg'
                          >
                            <Trash2 size={20} /> Xóa ảnh
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onDrop={handleDrop}
                    className='flex h-[200px] w-[200px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-400 text-gray-500 hover:border-purple-500 hover:text-purple-500'
                  >
                    {isLoading ? (
                      <div className='flex flex-col items-center'>
                        <Loader2 className='h-8 w-8 animate-spin text-purple-500' />
                        <span className='mt-2 text-sm text-gray-600'>Đang tải...</span>
                      </div>
                    ) : (
                      <>
                        <Upload size={32} />
                        <span className='ml-2 text-sm'>Tải ảnh lên</span>
                      </>
                    )}
                  </div>
                </div>

                <input
                  type='file'
                  multiple
                  accept='image/*'
                  ref={fileInputRef}
                  onChange={handleUploadFiles}
                  className='hidden'
                />
              </div>
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
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='h-auto max-h-[200px] w-auto max-w-full object-contain transition-opacity duration-300 group-hover:opacity-60'
                  />
                ))}
              </div>
              {step.content && <p className='mt-3 whitespace-pre-line text-gray-700'>{step.content}</p>}
            </div>
          )}
        </div>
      </div>

      {renderStepNav()}
    </NodeViewWrapper>
  )
}
