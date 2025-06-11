import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/header/Header'
import ClassroomDetail from '@/features/classroom/components/ClassroomDetail'

export default function TeacherClassroomPage() {
  return (
    <div>
      <Header />
      <main className='bg-light min-h-screen'>
        <ClassroomDetail />
      </main>

      <Footer />
    </div>
  )
}
