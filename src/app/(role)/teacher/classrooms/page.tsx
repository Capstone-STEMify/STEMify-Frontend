import Header from '@/components/layout/header/Header'
import ClassroomListPage from 'app/(protected)/classroom/list/page'

export default function TeacherClassroomListPage() {
  return (
    <div>
      <Header />
      <main className='bg-light min-h-screen'>
        <ClassroomListPage />
      </main>
    </div>
  )
}
