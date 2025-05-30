import { metadata } from 'app/layout'

metadata.title = 'Test Layout'
export default function TestLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div>{children}</div>
}
