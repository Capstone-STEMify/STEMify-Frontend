export default function ClassroomDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='space-y-2'>
      <main>{children}</main>
    </div>
  )
}
