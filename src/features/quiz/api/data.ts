// app/quiz-active/data.ts

export type QuizStatus = 'Completed' | 'In Progress'
export type QuizType = 'LIVE' | 'ASSIGNED'

export interface Learner {
  id: string
  initials?: string
  avatarUrl?: string
}

export interface Quiz {
  id: string
  name: string
  type: QuizType
  subtext?: string
  status: QuizStatus
  learners: Learner[]
  extraLearners: number
  accuracy: number | null
  assignedDate: string
  assignedBy: {
    name: string
    avatarUrl: string
  }
}

export const quizzes: Quiz[] = [
  {
    id: '1',
    name: 'UI Design Fundamentals & Best Practice',
    type: 'LIVE',
    subtext: '⚠️ Need Review (1)',
    status: 'Completed',
    learners: [
      { id: 'r', initials: 'RA' },
      { id: 'p', initials: 'PA' }
    ],
    extraLearners: 20,
    accuracy: 100,
    assignedDate: '24/01/2023',
    assignedBy: { name: 'Ratih', avatarUrl: '/avatars/01.png' }
  },
  {
    id: '2',
    name: 'Figma Skill - Tips for using Frame & Group',
    type: 'ASSIGNED',
    subtext: 'Need Review (16)',
    status: 'Completed',
    learners: [
      { id: 'c', initials: 'CI' },
      { id: 'o', initials: 'OW' }
    ],
    extraLearners: 20,
    accuracy: null,
    assignedDate: '24/01/2023',
    assignedBy: { name: 'Bock', avatarUrl: '/avatars/02.png' }
  },
  {
    id: '3',
    name: 'UX Evaluation: Enhancing User Experience',
    type: 'LIVE',
    status: 'In Progress',
    learners: [{ id: 'u1' }, { id: 'u2' }, { id: 'u3' }],
    extraLearners: 14,
    accuracy: null,
    assignedDate: '24/01/2023',
    assignedBy: { name: 'Tech', avatarUrl: '/avatars/03.png' }
  },
  {
    id: '4',
    name: 'Color and Typography in UI Design',
    type: 'LIVE',
    status: 'Completed',
    learners: [{ id: 'j', initials: 'JK' }, { id: 'u4' }],
    extraLearners: 10,
    accuracy: 80,
    assignedDate: '24/01/2023',
    assignedBy: { name: 'Ratih', avatarUrl: '/avatars/01.png' }
  },
  {
    id: '5',
    name: 'User Testing and Research in UX Design',
    type: 'LIVE',
    status: 'In Progress',
    learners: [{ id: 'u5' }, { id: 'u6' }],
    extraLearners: 11,
    accuracy: null,
    assignedDate: '24/01/2023',
    assignedBy: { name: 'Ratih', avatarUrl: '/avatars/01.png' }
  }
]

export interface QuizOverview {
  id: string
  title: string
  imageUrl: string
  enrolledCount: number
  status?: 'Draft'
  accuracy: number | null
  completionRate: number
  category: string
  priority: 'Urgent' | 'Not Urgent'
  lastEdited: string
  questionCount: number
}

export const quizOverviews: QuizOverview[] = [
  {
    id: '1',
    title: 'Mastering UI Design for Impactful Solutions',
    imageUrl: '/courses/course-1.png',
    enrolledCount: 10,
    accuracy: 40,
    completionRate: 60,
    category: 'UI/UX',
    priority: 'Not Urgent',
    lastEdited: '2h ago',
    questionCount: 10
  },
  {
    id: '2',
    title: 'A Symphony of Colors in UI Design',
    imageUrl: '/courses/course-2.png',
    enrolledCount: 21,
    accuracy: 20,
    completionRate: 80,
    category: 'Instructional Design',
    priority: 'Not Urgent',
    lastEdited: '8h ago',
    questionCount: 15
  },
  {
    id: '3',
    title: 'Bridging Users and UI in Harmony',
    imageUrl: '/courses/course-3.png',
    enrolledCount: 18,
    accuracy: 100,
    completionRate: 100,
    category: 'Experience Design',
    priority: 'Urgent',
    lastEdited: '23h ago',
    questionCount: 25
  },
  {
    id: '4',
    title: 'Creating Engaging Learning Journeys: UI/UX Best Practices',
    imageUrl: '/courses/course-4.png',
    enrolledCount: 9,
    accuracy: 20,
    completionRate: 100,
    category: 'UI/UX',
    priority: 'Urgent',
    lastEdited: '5d ago',
    questionCount: 30
  },
  {
    id: '5',
    title: 'Designing Intuitive User Interfaces',
    imageUrl: '/courses/course-5.png',
    enrolledCount: 12,
    accuracy: 80,
    completionRate: 100,
    category: 'User Interface (UI)',
    priority: 'Not Urgent',
    lastEdited: '2d ago',
    questionCount: 15
  },
  {
    id: '6',
    title: 'Optimizing User Experience on Educational Platforms',
    imageUrl: '/courses/course-6.png',
    enrolledCount: 7,
    status: 'Draft',
    accuracy: null,
    completionRate: 0,
    category: 'User Experience',
    priority: 'Urgent',
    lastEdited: '4d ago',
    questionCount: 25
  }
]
