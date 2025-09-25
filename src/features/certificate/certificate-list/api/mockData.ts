export interface Specialization {
  title: string
  university: string
  logoUrl: string
  certificateImageUrl: string
  courses: {
    title: string
    status: string
  }[]
}

export interface Course {
  title: string
  university: string
  grade: number
}

export const accomplishmentsData = {
  likedCourses: [
    'Project Management Project',
    'Project Management Principles and Processes',
    'UX Design: From Concept to Prototype',
    'UX Research at Scale: Surveys, Analytics, Online Testing'
  ],
  specializations: [
    {
      title: 'Software Development Lifecycle',
      university: 'University of Minnesota',
      logoUrl: '/umn-logo.png',
      certificateImageUrl: '/certificate-placeholder.png',
      courses: [
        { title: 'Software Development Processes and Methodologies', status: 'Course 1 of 4 • Complete' },
        { title: 'Agile Software Development', status: 'Course 2 of 4 • Complete' },
        { title: 'Introduction to DevOps', status: 'Course 3 of 4 • Complete' },
        { title: 'Software Development Capstone Project', status: 'Course 4 of 4 • Complete' }
      ]
    },
    {
      title: 'Project Management Principles and Practices',
      university: 'University of California, Irvine',
      logoUrl: '/uci-logo.svg',
      certificateImageUrl: '/certificate-placeholder.png',
      courses: [
        { title: 'Initiating and Planning Projects', status: 'Course 1 of 4 • Complete' },
        { title: 'Budgeting and Scheduling Projects', status: 'Course 2 of 4 • Complete' },
        { title: 'Managing Project Risks and Changes', status: 'Course 3 of 4 • Complete' },
        { title: 'Project Management Project', status: 'Course 4 of 4 • Complete' }
      ]
    }
  ],
  courses: [
    { title: 'Project Management Project', university: 'University of California, Irvine', grade: 100 },
    {
      title: 'Introduction to User Experience Principles and Processes',
      university: 'University of Michigan',
      grade: 98.2
    },
    { title: 'UX Design: From Concept to Prototype', university: 'University of Michigan', grade: 100 }
  ]
}
