import { UserRole } from '@/types/userRole'
import {
  Activity,
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
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
  const baseURL = `/classroom/${classroomId}`
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
        title: 'Members',
        url: `${baseURL}/members`,
        icon: Users
      },
      {
        title: 'Announcements',
        url: `${baseURL}/announcements`,
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
      { title: 'Course', url: `${baseURL}/course`, icon: SquareTerminal },
      { title: 'Lesson', url: `${baseURL}/lesson`, icon: Bot },
      { title: 'Activity', url: `${baseURL}/activity`, icon: Activity },
      { title: 'Quiz', url: `${baseURL}/quiz`, icon: BookOpen }
    ],
    [UserRole.TEACHER]: [
      { title: 'Course', url: `${baseURL}/course`, icon: SquareTerminal },
      { title: 'Lesson', url: `${baseURL}/lesson`, icon: Bot },
      { title: 'Activity', url: `${baseURL}/activity`, icon: Activity },
      { title: 'Quiz', url: `${baseURL}/quiz`, icon: BookOpen }
    ],
    [UserRole.ADMIN]: [],
    [UserRole.STAFF]: [],
    [UserRole.GUEST]: []
  }

  const navProject: Record<UserRole, (typeof base)['navSecondary']> = {
    [UserRole.STUDENT]: [
      { title: 'STEM Program', url: `${baseURL}/project/stem`, icon: Frame },
      { title: 'Science Fair', url: `${baseURL}/project/science`, icon: Map }
    ],
    [UserRole.TEACHER]: [
      { title: 'STEM Program', url: `${baseURL}/project/stem`, icon: Frame },
      { title: 'Science Fair', url: `${baseURL}/project/science`, icon: Map }
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
