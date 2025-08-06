import { metadata } from "app/[locale]/layout" 

metadata.title = 'Course'
export default async function PublicCourseLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <main>{children}</main>
}
