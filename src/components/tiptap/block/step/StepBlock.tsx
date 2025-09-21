import StepBlockComponent from '@/components/tiptap/block/step/StepBlockComponent'
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

export const StepBlock = Node.create({
  name: 'stepBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      steps: {
        default: [
          { title: 'Step 1: Do something', content: 'Mô tả chi tiết...', images: [] },
          { title: 'Step 2: Next step', content: 'Mô tả chi tiết...', images: [] }
        ]
      },
      currentStep: { default: 0, parseHTML: () => 0 }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="step-block"]',
        getAttrs: (el) => {
          const element = el as HTMLElement
          const stepsAttr = element.getAttribute('data-steps')
          let steps = []
          try {
            steps = stepsAttr ? JSON.parse(stepsAttr) : []
          } catch {
            steps = []
          }
          return {
            steps,
            currentStep: Number(element.getAttribute('data-current-step') || 0)
          }
        }
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const steps = Array.isArray(HTMLAttributes.steps) ? HTMLAttributes.steps : []
    const currentStep = HTMLAttributes.currentStep ?? 0

    return [
      'div',
      {
        'data-type': 'step-block',
        'data-steps': JSON.stringify(steps),
        'data-current-step': currentStep,
        class: 'bg-sky-custom-100 my-6 w-full rounded-xl p-4 shadow-lg'
      },
      ...steps.map((step, idx) => [
        'div',
        { class: 'my-3 space-y-2' },
        ['h3', { class: 'text-lg font-bold' }, `${idx + 1}. ${step.title || ''}`],
        step.images && step.images.length
          ? [
              'div',
              { class: 'flex flex-wrap items-center justify-center gap-5' },
              ...step.images.map((img: string) => [
                'img',
                {
                  src: img,
                  alt: `${step.title || 'step'}-${idx}`,
                  class: 'aspect-square w-[200px] h-[200px] rounded-2xl border object-cover'
                }
              ])
            ]
          : '',
        step.content ? ['p', { class: 'mt-3 text-gray-700' }, step.content] : ''
      ])
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(StepBlockComponent)
  }
})
