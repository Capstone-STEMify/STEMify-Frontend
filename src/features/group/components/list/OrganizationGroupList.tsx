'use client'
import { useLocale, useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { Users, MoreHorizontal, Copy, Trash2, Pencil } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { useModal } from '@/providers/ModalProvider'
import { useDeleteGroupMutation, useSearchGroupByOrganizationIdQuery } from '@/features/group/api/groupApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import { toast } from 'sonner'
import { Group } from '@/features/group/types/group.type'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { useRouter } from 'next/navigation'

export default function OrganizationGroupList() {
  const { openModal } = useModal()
  const router = useRouter()
  const locale = useLocale()
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const to = useTranslations('organization.group')

  const { selectedOrganizationId } = useAppSelector((state) => state.selectedOrganization)

  const { data } = useSearchGroupByOrganizationIdQuery(
    { organizationId: selectedOrganizationId!, params: {} },
    { skip: !selectedOrganizationId }
  )
  const [deleteGroup] = useDeleteGroupMutation()

  const handleCopyGroupCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success(tt('successMessage.copiedToClipboard'))
  }

  const handleDeleteGroup = async (group: Group) => {
    openModal('confirm', {
      message: tt('confirmMessage.delete', { title: group.name }),
      onConfirm: async () => {
        await deleteGroup(group.id).unwrap()
        toast.success(tt('successMessage.delete'))
      }
    })
  }

  const handleNavigate = (groupId: number) => {
    // Navigate to group detail page
    router.push(`/${locale}/organization/group/${groupId}`)
  }

  return (
    <div className='px-10 py-5'>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h1 className='text-2xl font-bold'>{to('title')}</h1>
          <p className='text-sm text-gray-600'>{to('subTitle')}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3'>
        {data?.data.items.map((group) => (
          <Card
            key={group.id}
            className='min-h-[100px] transition hover:shadow-md'
            onClick={() => handleNavigate(group.id)}
          >
            <CardContent className='p-5'>
              <div className='flex min-w-0 items-center justify-between gap-3'>
                {/* LEFT AREA */}
                <div className='flex min-w-0 items-center gap-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-300 to-sky-400'>
                    <Users className='h-6 w-6 text-white' />
                  </div>

                  <div>
                    <div className='flex items-center gap-2'>
                      <h3 className='truncate text-base font-medium'>{group.name}</h3>
                      <div className='mt-1 flex -space-x-2'>
                        {group.students.slice(0, 3).map((s, i) => {
                          const initials = s.fullName
                            .split(' ')
                            .filter(Boolean)
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()

                          return (
                            <Avatar
                              key={s.organizationUserId}
                              className='h-8 w-8 border-2 border-white ring-1 ring-gray-200'
                              style={{ zIndex: 10 - i }}
                            >
                              {/* Không dùng AvatarImage vì không có URL ảnh */}
                              <AvatarFallback className='bg-gray-100 text-xs font-medium'>{initials}</AvatarFallback>
                            </Avatar>
                          )
                        })}

                        {group.students.length > 3 && (
                          <div className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 ring-1 ring-gray-200'>
                            <span className='text-xs font-medium'>+{group.students.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button className='mt-0.5' onClick={() => handleCopyGroupCode(group.code)}>
                      <Badge variant='secondary' className='text-xs'>
                        {group.code}
                        <Copy className='ml-1 inline-block h-3 w-3' />
                      </Badge>
                    </button>
                    {/* AVATAR LIST */}
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
