import { UserRole } from '@/types/userRole'
import {
  Activity,
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Home,
  LifeBuoy,
  Map,
  Megaphone,
  Send,
  Settings2,
  SquareTerminal,
  Users
} from 'lucide-react'

export function getSidebarData(role: UserRole) {
  const classroomId = '1'
  const classroomURL = `/classroom/${classroomId}`
  const base = {
    teams: [
      { name: 'Acme Inc', logo: GalleryVerticalEnd, plan: 'Enterprise' },
      { name: 'Acme Corp.', logo: AudioWaveform, plan: 'Startup' },
      { name: 'Evil Corp.', logo: Command, plan: 'Free' }
    ],
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: 'https://github.com/shadcn.png'
    },
    navGenral: [
      {
        title: 'Home',
        url: `${classroomURL}`,
        icon: Home
      },
      {
        title: 'Members',
        url: `${classroomURL}/members`,
        icon: Users
      },
      {
        title: 'Announcements',
        url: `${classroomURL}/announcements`,
        icon: Megaphone
      }
    ],
    navSecondary: [
      { title: 'Support', url: '#', icon: LifeBuoy },
      { title: 'Feedback', url: '#', icon: Send },
      { title: 'Settings', url: '#', icon: Settings2 }
    ]
  }

  const navMain: Record<UserRole, (typeof base)['navSecondary']> = {
    [UserRole.STUDENT]: [
      { title: 'Course', url: `${classroomURL}/course`, icon: SquareTerminal },
      { title: 'Lesson', url: `${classroomURL}/lesson`, icon: Bot },
      { title: 'Activity', url: `${classroomURL}/activity`, icon: Activity },
      { title: 'Quiz', url: `${classroomURL}/quiz`, icon: BookOpen }
    ],
    [UserRole.TEACHER]: [
      { title: 'Course', url: `${classroomURL}/course`, icon: SquareTerminal },
      { title: 'Lesson', url: `${classroomURL}/lesson`, icon: Bot },
      { title: 'Activity', url: `${classroomURL}/activity`, icon: Activity },
      { title: 'Quiz', url: `${classroomURL}/quiz`, icon: BookOpen }
    ],
    [UserRole.ADMIN]: [],
    [UserRole.STAFF]: [],
    [UserRole.GUEST]: []
  }

  const navProject: Record<UserRole, (typeof base)['navSecondary']> = {
    [UserRole.STUDENT]: [
      { title: 'STEM Program', url: `${classroomURL}/project/stem`, icon: Frame },
      { title: 'Science Fair', url: `${classroomURL}/project/science`, icon: Map }
    ],
    [UserRole.TEACHER]: [
      { title: 'STEM Program', url: `${classroomURL}/project/stem`, icon: Frame },
      { title: 'Science Fair', url: `${classroomURL}/project/science`, icon: Map }
    ],
    [UserRole.ADMIN]: [],
    [UserRole.STAFF]: [],
    [UserRole.GUEST]: []
  }

  return {
    ...base,
    navMain: navMain[role],
    navProject: navProject[role]
  }
}
