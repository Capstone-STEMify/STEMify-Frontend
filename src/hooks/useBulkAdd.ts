import { useState, KeyboardEvent } from 'react'

type UseBulkAddOptions = {
  validateItem?: (value: string) => boolean
  unique?: boolean
}

export function useBulkAdd({ validateItem, unique = true }: UseBulkAddOptions = {}) {
  const [items, setItems] = useState<string[]>([])
  const [input, setInput] = useState('')

  const isValid = (value: string) => (validateItem ? validateItem(value) : !!value.trim())

  const parseInput = (text: string) => {
    let list = text
      .split(/[\s,;]+/)
      .map((v) => v.trim())
      .filter(isValid)
    if (unique) list = [...new Set(list)]
    return list
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', ' ', ',', ';'].includes(e.key)) {
      e.preventDefault()
      const newItems = parseInput(input)
      if (newItems.length) {
        setItems((prev) => (unique ? [...new Set([...prev, ...newItems])] : [...prev, ...newItems]))
        setInput('')
      }
    } else if (e.key === 'Backspace' && !input && items.length > 0) {
      setItems((prev) => prev.slice(0, -1))
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text')
    const newItems = parseInput(pasted)
    if (newItems.length) {
      setItems((prev) => (unique ? [...new Set([...prev, ...newItems])] : [...prev, ...newItems]))
    }
  }

  const removeItem = (value: string) => setItems((prev) => prev.filter((v) => v !== value))
  const clearAll = () => {
    setItems([])
    setInput('')
  }

  return {
    // state
    items,
    input,
    setInput,

    // actions
    handleKeyDown,
    handlePaste,
    removeItem,
    clearAll,

    // derived
    count: items.length
  }
}
