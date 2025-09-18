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
    const { steps, currentStep } = HTMLAttributes
    return [
      'div',
      {
        'data-type': 'step-block',
        'data-steps': JSON.stringify(steps || []),
        'data-current-step': currentStep ?? 0
      }
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(StepBlockComponent)
  }
})
