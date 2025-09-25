export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className='p-4'>{children}</div>
}
