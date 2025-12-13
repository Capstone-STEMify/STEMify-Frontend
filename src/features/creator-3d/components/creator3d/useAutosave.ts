// useAutosave.ts
import { useEffect, useRef, useState } from 'react'
import { get, set, del } from 'idb-keyval'

type UseAutosaveOptions = {
  key: string
  data: any
  onLoad: (data: any) => void
  onSyncToServer: (data: any) => Promise<void>
  interval?: number
  debounce?: number
}

export function useAutosave({
  key,
  data,
  onLoad,
  onSyncToServer,
  interval = 2000,
  debounce = 5000
}: UseAutosaveOptions) {
  // snapshot cuối cùng đã autosave (ghi vào IndexedDB)
  const lastSerializedRef = useRef<string>('')

  // timer dùng cho debounce gọi API
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Promise load autosave (chỉ tạo 1 lần)
  const loadPromiseRef = useRef<Promise<any> | null>(null)

  const [status, setStatus] = useState<'saving' | 'saved'>('saved')

  if (!loadPromiseRef.current) {
    loadPromiseRef.current = (async () => {
      const saved = await get(key)
      if (saved) onLoad(saved)

      return saved
    })()
  }

  useEffect(() => {
    const id = setInterval(async () => {
      const serialized = JSON.stringify(data)

      if (serialized === lastSerializedRef.current) return

      lastSerializedRef.current = serialized
      await set(key, data)
      setStatus('saving')

      if (debounceTimer.current) clearTimeout(debounceTimer.current)

      debounceTimer.current = setTimeout(async () => {
        setStatus('saving')
        await onSyncToServer(data)
        await del(key)
        setStatus('saved')
      }, debounce)
    }, interval)

    return () => {
      clearInterval(id)
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [data])

  return { status, loadPromise: loadPromiseRef.current! }
}
