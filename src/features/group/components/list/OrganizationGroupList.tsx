'use client'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { Users, MoreHorizontal, Copy, Trash2, Pencil } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { useModal } from '@/providers/ModalProvider'
import { useDeleteGroupMutation, useSearchGroupByOrganizationIdQuery } from '@/features/group/api/groupApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import { toast } from 'sonner'
import { Group } from '@/features/group/types/group.type'

export default function OrganizationGroupList() {
  const { openModal } = useModal()
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
          <Card key={group.id} className='min-h-[100px] transition hover:shadow-md'>
            <CardContent className='p-5'>
              <div className='flex min-w-0 items-center justify-between gap-3'>
                {/* LEFT AREA */}
                <div className='flex min-w-0 items-center gap-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-300 to-sky-400'>
                    <Users className='h-6 w-6 text-white' />
                  </div>

                  <div>
                    <div className='flex min-w-0 items-center gap-2'>
                      <h3 className='truncate text-base font-medium'>
                        {to('groupName')} {group.name}
                      </h3>
                      <div className='ml-2 flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600'>
                        <Users className='h-4 w-4' />
                        {group.studentCount}
                      </div>
                    </div>
                    <button onClick={() => handleCopyGroupCode(group.code)}>
                      <Badge variant='secondary' className='mt-2 gap-2 text-xs'>
                        {group.code}
                        <Copy className='h-4 w-4' />
                      </Badge>
                    </button>
                  </div>
                </div>

                {/* MENU BTN */}
                <div className='flex gap-2'>
                  <button className='rounded-full p-1 hover:bg-gray-100' onClick={() => openModal('updateGroup')}>
                    <Pencil className='h-5 w-5 text-sky-500' />
                  </button>

                  <button className='rounded-full p-1 hover:bg-gray-100' onClick={() => handleDeleteGroup(group)}>
                    <Trash2 className='h-5 w-5 text-red-500' />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
