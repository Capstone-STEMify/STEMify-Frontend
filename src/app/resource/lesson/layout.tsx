import { metadata } from 'app/layout'

metadata.title = 'Lesson'
export default async function LessonLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <main>{children}</main>
    </div>
  )
}
