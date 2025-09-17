import QuizBlockComponent from './QuizBlockComponent'
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
export const QuizBlock = Node.create({
  name: 'quizBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      question: { default: '' },
      options: {
        default: [
          { id: 'A', text: '', isCorrect: false },
          { id: 'B', text: '', isCorrect: false }
        ]
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="quiz-block"]',
        getAttrs: (el) => {
          const element = el as HTMLElement
          const optionsAttr = element.getAttribute('data-options')
          let options = []
          try {
            options = optionsAttr ? JSON.parse(optionsAttr) : []
          } catch {
            options = []
          }
          return {
            question: element.getAttribute('data-question') || '',
            options
          }
        }
      }
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      {
        'data-type': 'quiz-block',
        'data-question': HTMLAttributes.question || '',
        'data-options': JSON.stringify(HTMLAttributes.options || [])
      }
    ]
  },
  addNodeView() {
    const mode = this.options.mode

    return ReactNodeViewRenderer((props) => <QuizBlockComponent {...props} mode={mode} />)
  }
})
