import HeroSection from '@/components/shared/hero-section/HeroSection'
import ActivitySection from '@/features/landing-page/resource/activity/ActivitySection'
import LessonSection from '@/features/landing-page/resource/lesson/LessonSection'
import ResourceSection from '@/features/landing-page/resource/course/CourseSection'

export default function ResourcePage() {
  return (
    <main className='bg-light min-h-screen'>
      <HeroSection />

      {/* Main content layout */}
      <div className='mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12'>
        <SectionWrapper id='resources' title='Explore Courses'>
          <ResourceSection />
        </SectionWrapper>

        <SectionWrapper id='lessons' title='Latest Lessons'>
          <LessonSection />
        </SectionWrapper>

        <SectionWrapper id='activities' title='Fun Activities'>
          <ActivitySection />
        </SectionWrapper>
      </div>
    </main>
  )
}

function SectionWrapper({ children, id, title }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className='space-y-8 py-10'>
      <h2 className='text-2xl font-bold text-gray-900'>{title}</h2>
      {children}
    </section>
  )
}
