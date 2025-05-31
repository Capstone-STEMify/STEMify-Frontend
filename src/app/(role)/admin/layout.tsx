import { metadata } from 'app/layout'

metadata.title = 'Admin'
export default function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div>{children}</div>
}
