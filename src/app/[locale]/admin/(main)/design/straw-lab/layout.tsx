import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Code Lab'
}

export default async function CodeLab({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div className='bg-light -m-4'>{children}</div>
    </>
  )
}
