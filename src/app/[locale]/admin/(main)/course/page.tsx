import CourseListAction from '@/features/resource/course/components/list/CourseListAction'
import CourseTable from '@/features/resource/course/components/list/AdminCourseList'

export default function AdminCourse() {
  return (
    <div>
      <CourseListAction />
      <CourseTable />
    </div>
  )
}
