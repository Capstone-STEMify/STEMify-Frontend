import StepBlockComponent from '@/components/tiptap/block/step/StepBlockComponent'
import { Node } from '@tiptap/core'
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
            steps = stepsAttr ? JSON.parse(decodeURIComponent(stepsAttr)) : []
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
    const step = steps[currentStep] || { title: '', content: '', images: [] }

    const renderStepNav = (steps: any[], currentStep: number) => [
      'div',
      { class: 'my-4 flex items-center justify-between gap-4 step-nav-container' },
      ['button', { 'data-action': 'prev', class: 'rounded-full bg-gray-200 px-2 py-1 text-sm' }, '<'],
      [
        'div',
        { class: 'flex justify-center gap-2 step-nav' },
        ...steps.map((_, i) => [
          'button',
          {
            class: `step-index-btn h-6 w-6 rounded-full text-sm font-bold ${
              i === currentStep ? 'bg-black text-white' : 'bg-white text-black'
            }`,
            'data-index': i
          },
          String(i + 1)
        ])
      ],
      ['button', { 'data-action': 'next', class: 'rounded-full bg-gray-200 px-2 py-1 text-sm' }, '>']
    ]

    return [
      'div',
      {
        'data-type': 'step-block',
        'data-steps': encodeURIComponent(JSON.stringify(steps)),
        'data-current-step': currentStep,
        class: 'bg-sky-custom-100 my-6 w-full rounded-xl p-4 shadow-lg'
      },
      renderStepNav(steps, currentStep),
      [
        'div',
        { class: 'step-container my-3 space-y-2' },
        ['h3', { class: 'text-lg font-bold' }, `${currentStep + 1}. ${step.title || ''}`],

        step.images?.length
          ? [
              'div',
              { class: 'flex flex-wrap items-center justify-center gap-5' },
              ...step.images.map((img: string, idx: number) => [
                'div',
                {
                  class:
                    'relative p-2 border rounded-xl bg-white max-h-[200px] max-w-[200px] flex items-center justify-center overflow-hidden'
                },
                [
                  'img',
                  {
                    src: img,
                    alt: `${step.title || 'step'}-${idx}`,
                    class: 'h-auto w-auto max-h-full max-w-full object-contain'
                  }
                ]
              ])
            ]
          : '',

        step.content ? ['p', { class: 'mt-3 text-gray-700 whitespace-pre-line' }, step.content] : ''
      ],
      renderStepNav(steps, currentStep)
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(StepBlockComponent)
  }
})
