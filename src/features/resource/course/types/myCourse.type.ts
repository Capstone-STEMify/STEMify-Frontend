// types/course.ts
export interface IInstructor {
  id: string
  fullname: string
  profilePictureUrl: string
}

export interface ITag {
  id: number
  name: string
}

export interface IProgress {
  progressPercentage: number
  lastAccessed: string
  remainingDurationInMins: number
}

export interface IReview {
  averageRating: number
}

export interface IECourse {
  id: string
  title: string
  imageURL: string
  instructors: IInstructor[]
  tags: ITag[]
  progress?: IProgress
  review: IReview
  isFavorite?: boolean
  description?: string
  duration?: string
  totalLessons?: number
  completedLessons?: number
}

// data/mockData.ts
export const mockTags: ITag[] = [
  { id: 1, name: 'Web Development' },
  { id: 2, name: 'Mobile Development' },
  { id: 3, name: 'Data Science' },
  { id: 4, name: 'Machine Learning' },
  { id: 5, name: 'Design' },
  { id: 6, name: 'Marketing' },
  { id: 7, name: 'Business' },
  { id: 8, name: 'Photography' }
]

export const mockCourses: IECourse[] = [
  {
    id: '1',
    title: 'Complete React.js Developer Course',
    imageURL: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    instructors: [
      {
        id: '1',
        fullname: 'John Doe',
        profilePictureUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      }
    ],
    tags: [{ id: 1, name: 'Web Development' }],
    progress: {
      progressPercentage: 75,
      lastAccessed: '2024-01-15T10:30:00Z',
      remainingDurationInMins: 120
    },
    review: { averageRating: 4.8 },
    isFavorite: true,
    duration: '12 hours',
    totalLessons: 45,
    completedLessons: 34
  },
  {
    id: '2',
    title: 'Python for Data Science Masterclass',
    imageURL: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop',
    instructors: [
      {
        id: '2',
        fullname: 'Sarah Johnson',
        profilePictureUrl: 'https://images.unsplash.com/photo-1494790108755-2616b2e0d4a2?w=100&h=100&fit=crop&crop=face'
      }
    ],
    tags: [{ id: 3, name: 'Data Science' }],
    progress: {
      progressPercentage: 45,
      lastAccessed: '2024-01-14T14:20:00Z',
      remainingDurationInMins: 180
    },
    review: { averageRating: 4.6 },
    isFavorite: false,
    duration: '8 hours',
    totalLessons: 32,
    completedLessons: 14
  },
  {
    id: '3',
    title: 'Mobile App Development with React Native',
    imageURL: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    instructors: [
      {
        id: '3',
        fullname: 'Mike Chen',
        profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      }
    ],
    tags: [{ id: 2, name: 'Mobile Development' }],
    progress: {
      progressPercentage: 20,
      lastAccessed: '2024-01-13T09:15:00Z',
      remainingDurationInMins: 240
    },
    review: { averageRating: 4.7 },
    isFavorite: true,
    duration: '15 hours',
    totalLessons: 60,
    completedLessons: 12
  },
  {
    id: '4',
    title: 'UI/UX Design Fundamentals',
    imageURL: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
    instructors: [
      {
        id: '4',
        fullname: 'Emily Davis',
        profilePictureUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      }
    ],
    tags: [{ id: 5, name: 'Design' }],
    progress: {
      progressPercentage: 100,
      lastAccessed: '2024-01-12T16:45:00Z',
      remainingDurationInMins: 0
    },
    review: { averageRating: 4.9 },
    isFavorite: false,
    duration: '10 hours',
    totalLessons: 40,
    completedLessons: 40
  },
  {
    id: '5',
    title: 'Digital Marketing Strategy',
    imageURL: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    instructors: [
      {
        id: '5',
        fullname: 'David Wilson',
        profilePictureUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
      }
    ],
    tags: [{ id: 6, name: 'Marketing' }],
    progress: {
      progressPercentage: 60,
      lastAccessed: '2024-01-11T11:30:00Z',
      remainingDurationInMins: 90
    },
    review: { averageRating: 4.4 },
    isFavorite: true,
    duration: '6 hours',
    totalLessons: 25,
    completedLessons: 15
  },
  {
    id: '6',
    title: 'Machine Learning with TensorFlow',
    imageURL: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
    instructors: [
      {
        id: '6',
        fullname: 'Dr. Alex Kumar',
        profilePictureUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      }
    ],
    tags: [{ id: 4, name: 'Machine Learning' }],
    progress: {
      progressPercentage: 30,
      lastAccessed: '2024-01-10T13:20:00Z',
      remainingDurationInMins: 210
    },
    review: { averageRating: 4.5 },
    isFavorite: false,
    duration: '20 hours',
    totalLessons: 80,
    completedLessons: 24
  }
]