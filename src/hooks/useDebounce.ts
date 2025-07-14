import { useState, useEffect } from 'react'

const useDebounce = (text: string, delay = 500) => {
  const [debounced, setDebounced] = useState(text)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(text)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [text, delay])

  return debounced
}

export default useDebounce
