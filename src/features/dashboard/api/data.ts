export const quickStatsData = [
  { name: 'Jan', value: 10 },
  { name: 'Feb', value: 20 },
  { name: 'Mar', value: 15 },
  { name: 'Apr', value: 30 },
  { name: 'May', value: 25 }
]

export const retentionData = [
  { name: 'Retained', value: 63, color: '#4F46E5' }, // indigo-600
  { name: 'Not Retained', value: 37, color: '#E0E7FF' } // indigo-100
]

export const progressData = [
  { name: 'Jan', retention: 60, dropped: 20 },
  { name: 'Feb', retention: 78, dropped: 10 },
  { name: 'Mar', retention: 50, dropped: 30 },
  { name: 'Apr', retention: 65, dropped: 15 }
]

export const studentData = [
  {
    id: '#0001',
    name: 'Emily Carter',
    avatar: '/avatars/01.png',
    position: 'Cardiologist',
    department: 'Cardiology',
    email: 'emily@gmail.com',
    phone: '(555) 111-2345'
  },
  {
    id: '#0002',
    name: 'Alex Johnson',
    avatar: '/avatars/02.png',
    position: 'Pediatrician',
    department: 'Pediatrics',
    email: 'alexjane@gmail.com',
    phone: '(555) 222-3456'
  },
  {
    id: '#0003',
    name: 'Sophia Martinez',
    avatar: '/avatars/03.png',
    position: 'Nurse',
    department: 'Emergency',
    email: 'sophiamart@gmail.com',
    phone: '(555) 333-4567'
  }
]

export type Student = (typeof studentData)[0]
