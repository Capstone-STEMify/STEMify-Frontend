export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className='px-8 py-5'>{children}</div>
}
