'use client'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/shadcn/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Badge } from '@/components/shadcn/badge'
import { Users, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { useModal } from '@/providers/ModalProvider'

// ===== Mock Data =====
const mockGroups = [
  {
    id: 1,
    name: 'Advanced Mathematics',
    code: 'MATH301',
    students: [
      {
        id: 1,
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      },
      {
        id: 2,
        name: 'Jane Smith',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c647?w=32&h=32&fit=crop&crop=face'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
      }
    ],
    totalStudents: 25
  },
  {
    id: 2,
    name: 'Computer Science Fundamentals',
    code: 'CS101',
    students: [
      {
        id: 4,
        name: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
      },
      {
        id: 5,
        name: 'Tom Brown',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face'
      }
    ],
    totalStudents: 18
  },
  {
    id: 3,
    name: 'Physics Laboratory',
    code: 'PHY201',
    students: [
      {
        id: 6,
        name: 'Emma Davis',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&crop=face'
      },
      {
        id: 7,
        name: 'Chris Lee',
        avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=32&h=32&fit=crop&crop=face'
      },
      {
        id: 8,
        name: 'Alex Kim',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=32&h=32&fit=crop&crop=face'
      }
    ],
    totalStudents: 32
  },
  {
    id: 4,
    name: 'Biology Research Group',
    code: 'BIO301',
    students: [
      {
        id: 9,
        name: 'Lisa Wang',
        avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=32&h=32&fit=crop&crop=face'
      }
    ],
    totalStudents: 12
  },
  {
    id: 5,
    name: 'Engineering Design Team',
    code: 'ENG205',
    students: [
      {
        id: 10,
        name: 'David Chen',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      },
      {
        id: 11,
        name: 'Rachel Green',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c647?w=32&h=32&fit=crop&crop=face'
      },
      {
        id: 12,
        name: 'Mark Taylor',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
      }
    ],
    totalStudents: 45
  }
]

export default function OrganizationGroupList() {
  const to = useTranslations('organization.group')
  const tc = useTranslations('common')
  const { openModal } = useModal()

  const handleCreateGroup = () => {
    openModal('upsertGroup')
  }

  return (
    <div className='px-10 py-5'>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h1 className='text-2xl font-bold'>{to('title')}</h1>
          <p className='text-sm text-gray-600'>{to('subTitle')}</p>
        </div>
        <Button onClick={handleCreateGroup}>{tc('button.createGroup')}</Button>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3'>
        {mockGroups.map((group) => (
          <Card key={group.id} className='min-h-[100px] transition hover:shadow-md'>
            <CardContent className='p-5'>
              <div className='flex min-w-0 items-center justify-between gap-3'>
                {/* LEFT AREA */}
                <div className='flex min-w-0 items-center gap-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-300 to-sky-400'>
                    <Users className='h-6 w-6 text-white' />
                  </div>

                  <div className='min-w-0'>
                    <div className='flex min-w-0 items-center gap-2'>
                      <h3 className='truncate text-base font-medium'>{group.name}</h3>
                      <Badge variant='secondary' className='text-xs'>
                        {group.code}
                      </Badge>
                    </div>

                    {/* AVATAR LIST */}
                    <div className='mt-1 flex -space-x-2'>
                      {group.students.slice(0, 3).map((s, i) => (
                        <Avatar
                          key={s.id}
                          className='h-8 w-8 border-2 border-white ring-1 ring-gray-200'
                          style={{ zIndex: 10 - i }}
                        >
                          <AvatarImage src={s.avatar} />
                          <AvatarFallback className='bg-gray-100 text-xs'>
                            {s.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {group.totalStudents > 3 && (
                        <div className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 ring-1 ring-gray-200'>
                          <span className='text-xs font-medium'>+{group.totalStudents - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* MENU BTN */}
                <button className='rounded-full p-1 hover:bg-gray-100'>
                  <MoreHorizontal className='h-5 w-5 text-gray-400' />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
