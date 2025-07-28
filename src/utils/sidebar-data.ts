import { AuthState } from '@/features/auth/authSlice'
import { useAppSelector } from '@/hooks/redux-hooks'
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

export function getSidebarData(role: UserRole, auth: AuthState) {
  const baseURL = `/resource/course/create`
  const base = {
    teams: [
      { name: 'Acme Inc', logo: GalleryVerticalEnd, plan: 'Enterprise' },
      { name: 'Acme Corp.', logo: AudioWaveform, plan: 'Startup' },
      { name: 'Evil Corp.', logo: Command, plan: 'Free' }
    ],
    user: {
      name: auth.user?.name,
      email: auth.user?.email,
      avatar: auth.user?.image || 'https://ui-avatars.com/api/?name=User&background=random'
    },
    navSecondary: [
      { title: 'Support', url: '#', icon: LifeBuoy },
      { title: 'Feedback', url: '#', icon: Send },
      { title: 'Settings', url: '#', icon: Settings2 }
    ]
  }

  const navGenral: Record<UserRole, (typeof base)['navSecondary']> = {
    [UserRole.STUDENT]: [
      {
        title: 'Home',
        url: `${baseURL}`,
        icon: Home
      }
      // {
      //   title: 'Announcements',
      //   url: `${baseURL}/announcements`,
      //   icon: Megaphone
      // }
    ],
    [UserRole.TEACHER]: [
      {
        title: 'Home',
        url: `${baseURL}`,
        icon: Home
      },
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
    [UserRole.ADMIN]: [],
    [UserRole.STAFF]: [
      {
        title: 'Home',
        url: `${baseURL}`,
        icon: Home
      }
      // {
      //   title: 'Announcements',
      //   url: `${baseURL}/announcements`,
      //   icon: Megaphone
      // }
    ],
    [UserRole.GUEST]: []
  }

  const navCourse: Record<UserRole, (typeof base)['navSecondary']> = {
    [UserRole.STUDENT]: [
      { title: 'Create', url: `/resource/course/create`, icon: SquareTerminal },
      { title: 'List', url: `/resource/course/list`, icon: Bot },
      { title: 'Update', url: `/resource/course/update/1`, icon: Bot }
    ],
    [UserRole.TEACHER]: [
      { title: 'Create', url: `/resource/course/create`, icon: SquareTerminal },
      { title: 'List', url: `/resource/course/list`, icon: Bot },
      { title: 'Update', url: `/resource/course/update/1`, icon: Bot }
    ],
    [UserRole.ADMIN]: [],
    [UserRole.STAFF]: [
      { title: 'Create', url: `/resource/course/create`, icon: SquareTerminal },
      { title: 'List', url: `/resource/courses`, icon: Bot },
      { title: 'Update', url: `/resource/course/update/1`, icon: Bot }
    ],
    [UserRole.GUEST]: []
  }

  const navLesson: Record<UserRole, (typeof base)['navSecondary']> = {
    [UserRole.STUDENT]: [
      { title: 'Create', url: `/resource/lesson/create`, icon: SquareTerminal },
      { title: 'List', url: `/resource/lesson/list`, icon: Bot },
      { title: 'Update', url: `/resource/lesson/update/1`, icon: Bot }
    ],
    [UserRole.TEACHER]: [
      { title: 'Create', url: `/resource/lesson/create`, icon: SquareTerminal },
      { title: 'List', url: `/resource/lesson/list`, icon: Bot },
      { title: 'Update', url: `/resource/lesson/update/1`, icon: Bot }
    ],
    [UserRole.ADMIN]: [],
    [UserRole.STAFF]: [
      { title: 'Create', url: `/resource/lesson/create`, icon: SquareTerminal },
      { title: 'List', url: `/resource/lesson/list`, icon: Bot },
      { title: 'Update', url: `/resource/lesson/update/1`, icon: Bot }
    ],
    [UserRole.GUEST]: []
  }

  const navSectionContent: Record<UserRole, (typeof base)['navSecondary']> = {
    [UserRole.STUDENT]: [
      { title: 'Create', url: `/resource/lesson/create`, icon: SquareTerminal },
      { title: 'List', url: `/resource/lesson/list`, icon: Bot },
      { title: 'Update', url: `/resource/lesson/update/1`, icon: Bot }
    ],
    [UserRole.TEACHER]: [
      { title: 'Create', url: `/resource/lesson/create`, icon: SquareTerminal },
      { title: 'List', url: `/resource/lesson/list`, icon: Bot },
      { title: 'Update', url: `/resource/lesson/update/1`, icon: Bot }
    ],
    [UserRole.ADMIN]: [],
    [UserRole.STAFF]: [
      { title: 'List', url: `/resource/section/list`, icon: Bot },
      { title: 'Create', url: `/resource/section/create`, icon: SquareTerminal }
    ],
    [UserRole.GUEST]: []
  }

  const navMain: Record<UserRole, (typeof base)['navSecondary']> = {
    [UserRole.STUDENT]: [
      { title: 'Course', url: `/resource/course/create`, icon: SquareTerminal },
      { title: 'Lesson', url: `/resource/lesson/create`, icon: Bot },
      { title: 'Activity', url: `/resource/activity/create`, icon: Activity }
    ],
    [UserRole.TEACHER]: [
      { title: 'Course', url: `/resource/course/create`, icon: SquareTerminal },
      { title: 'Lesson', url: `/resource/lesson/create`, icon: Bot },
      { title: 'Activity', url: `/resource/activity/create`, icon: Activity }
    ],
    [UserRole.ADMIN]: [],
    [UserRole.STAFF]: [
      { title: 'Course', url: `/resource/course/create`, icon: SquareTerminal },
      { title: 'Lesson', url: `/resource/lesson/create`, icon: Bot },
      { title: 'Activity', url: `/resource/activity/create`, icon: Activity }
    ],
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
    [UserRole.STAFF]: [
      { title: 'STEM Program', url: `${baseURL}/project/stem`, icon: Frame }
      // { title: 'Science Fair', url: `${baseURL}/project/science`, icon: Map }
    ],
    [UserRole.GUEST]: []
  }

  return {
    ...base,
    navGenral: navGenral[role],
    navMain: navMain[role],
    navProject: navProject[role],
    navCourse: navCourse[role],
    navLesson: navLesson[role],
    navSectionContent: navSectionContent[role]
  }
}
