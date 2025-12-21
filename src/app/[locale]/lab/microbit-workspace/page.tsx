'use client'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useEffect } from 'react'

export default function Page() {
  const { token, user } = useAppSelector((state) => state.auth)
  const userId = user?.userId
  const redirectUrl = process.env.NEXT_PUBLIC_MICROBIT_URL ?? '/'
  useEffect(() => {
    if (!token || !userId) return

    const win = window.open('about:blank')
    if (!win) return

    win.document.open()
    win.document.write(`
    <script>
      window.addEventListener("message", function(event) {
        window.name = JSON.stringify(event.data);
        window.location.href = "${redirectUrl}";
      });
    </script>
  `)
    win.document.close()

    setTimeout(() => {
      win.postMessage({ source: 'stemify-sso', token, userId }, '*')
    }, 500)
  }, [token, userId, redirectUrl])

  return <LoadingComponent />
}
