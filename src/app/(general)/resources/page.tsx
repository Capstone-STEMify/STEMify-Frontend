import { Button } from '@/components/shadcn/button'
import HeroSection from '@/components/shared/hero-section/HeroSection'
import LinkButton from '@/components/shared/LinkButton'
import ActivitySection from '@/features/activity/components/activity-list/ActivitySection'
import CourseSection from '@/features/course/components/course-list/CourseSection'
import LessonSection from '@/features/lesson/components/lesson-list/LessonSection'

export default function ResourcePage() {
  return (
    <main className='bg-light min-h-screen'>
      <HeroSection />

      {/* Main content layout */}
      <div className='mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12'>
        <SectionWrapper id='resources' title='Explore Courses'>
          <CourseSection />
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
      <div className='mx-auto w-fit'>
        <LinkButton className='bg-amber-custom-400' href='/resources/courses'>
          Explore More
        </LinkButton>
      </div>
    </section>
  )
}
