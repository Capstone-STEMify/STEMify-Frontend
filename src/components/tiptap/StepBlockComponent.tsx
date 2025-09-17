// extensions/StepBlockComponent.tsx
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { useState } from 'react'

export default function StepBlockComponent({ node, updateAttributes, editor }: NodeViewProps) {
  const { steps, currentStep } = node.attrs
  const stepsArray = Array.isArray(steps) ? steps : []
  const [active, setActive] = useState(currentStep || 0)

  const editable = editor?.isEditable
  const step = stepsArray[active] || { title: '', content: '', images: [] }

  const updateStep = (field: string, value: any) => {
    const newSteps = [...stepsArray]
    newSteps[active] = { ...newSteps[active], [field]: value }
    updateAttributes({ steps: newSteps })
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
    <div className='mb-2 flex justify-center gap-2'>
      {stepsArray.map((_, i) => (
        <button
          key={i}
          onClick={() => {
            setActive(i)
            if (editable) updateAttributes({ currentStep: i })
          }}
          className={`h-6 w-6 rounded-full text-sm font-bold ${
            i === active ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )

  return (
    <NodeViewWrapper className='my-6 w-full rounded-xl border bg-white p-4 shadow-lg'>
      {/* Thanh step trên */}
      {renderStepNav()}

      <div className='flex items-center'>
        {/* Prev */}
        <button
          onClick={goPrev}
          className='rounded-full bg-gray-200 px-3 py-2 font-bold text-gray-700 hover:bg-gray-300'
        >
          ◀
        </button>

        {/* Content */}
        <div className='flex-1 px-6 text-center'>
          {editable ? (
            <>
              <input
                className='mb-2 w-full rounded border px-2 py-1'
                value={step.title}
                onChange={(e) => updateStep('title', e.target.value)}
                placeholder='Step title...'
              />
              <textarea
                className='w-full rounded border px-2 py-1'
                value={step.content}
                onChange={(e) => updateStep('content', e.target.value)}
                placeholder='Step content...'
              />
              <div className='mt-3 flex flex-wrap justify-center gap-4'>
                {(step.images || []).map((img: string, idx: number) => (
                  <div key={idx} className='relative'>
                    <img src={img} alt={`${step.title}-${idx}`} className='max-h-40 rounded shadow' />
                    <button
                      onClick={() => removeImage(idx)}
                      className='absolute top-1 right-1 rounded bg-red-600 px-1 text-xs text-white'
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <input type='file' accept='image/*' onChange={handleImageUpload} className='mt-2' />
            </>
          ) : (
            <>
              <h3 className='mb-3 text-lg font-bold'>
                {active + 1}. {step.title}
              </h3>
              <div className='flex justify-center gap-4'>
                {(step.images || []).map((img: string, idx: number) => (
                  <img key={idx} src={img} alt={`${step.title}-${idx}`} className='max-h-60 rounded shadow' />
                ))}
              </div>
              {step.content && <p className='mt-3 text-gray-700'>{step.content}</p>}
            </>
          )}
        </div>

        {/* Next */}
        <button
          onClick={goNext}
          className='rounded-full bg-gray-200 px-3 py-2 font-bold text-gray-700 hover:bg-gray-300'
        >
          ▶
        </button>
      </div>

      {/* Thanh step dưới */}
      {renderStepNav()}
    </NodeViewWrapper>
  )
}
