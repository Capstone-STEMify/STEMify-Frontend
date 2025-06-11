import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/header/Header'
import ClassroomList from '@/features/classroom/components/ClassroomList'

export default function TeacherClassroomListPage() {
  return (
    <div>
      <Header />
      <main className='bg-light min-h-screen'>
        <ClassroomList />
      </main>

      <Footer />
    </div>
  )
}
