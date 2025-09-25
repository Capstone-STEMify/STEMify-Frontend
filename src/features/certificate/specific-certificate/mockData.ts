export interface Course {
  title: string
  instructor: string
  completionDate: string
  studyDuration: string
  grade: number
}

export const certificateData = {
  studentName: 'Nhân Thành Lê',
  completionDate: 'January 11, 2025',
  studyDuration: 'Approximately 1 month at 10 hours a week',
  specialization: {
    name: 'Project Management Principles and Practices',
    url: '#'
  },
  university: 'University of California, Irvine',
  rating: 4.8,
  ratingCount: '119,664',
  enrollmentCount: '1,341,119',
  learningOutcomes: [
    'Define a project’s scope and write a scope statement',
    'Build a work breakdown schedule',
    'Create a project budget',
    'Identify and manage risks'
  ],
  skills: [
    'Risk Management',
    'Project Management',
    'Project Schedules',
    'Budgeting',
    'Milestones (Project Management)',
    'Cost Estimation',
    'Project Risk Management',
    'Change Control',
    'Estimation',
    'Conflict Management',
    'Project Performance'
  ],
  courses: [
    {
      title: 'Initiating and Planning Projects',
      instructor: 'Margaret Meloni, MBA, PMP',
      completionDate: 'January 11, 2025',
      studyDuration: '4 weeks of study, 2-3 hours/week',
      grade: 97
    },
    {
      title: 'Budgeting and Scheduling Projects',
      instructor: 'Margaret Meloni, MBA, PMP',
      completionDate: 'January 23, 2025',
      studyDuration: '4 weeks of study, 2-3 hours/week',
      grade: 86
    },
    {
      title: 'Managing Project Risks and Changes',
      instructor: 'Margaret Meloni, MBA, PMP',
      completionDate: 'February 5, 2025',
      studyDuration: '4 weeks of study, 2-3 hours/week',
      grade: 91.2
    },
    {
      title: 'Project Management Project',
      instructor: 'Margaret Meloni, MBA, PMP',
      completionDate: 'February 16, 2025',
      studyDuration: '4 weeks of study, 2-3 hours/week',
      grade: 100
    }
  ]
}
