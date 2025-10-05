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
