'use client'
import React, { useMemo } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import { useGetGroupByIdQuery } from '@/features/group/api/groupApi'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { useTranslations } from 'next-intl'
import StudentGroupSubscriptionTable from '@/features/group/components/modal/StudentGroupSubscriptionTable'

type StudentGroupInfoModalProps = {
  groupId: number
  selectedSubscriptionId: number | null
  groupName?: string
}

export default function StudentGroupInfoModal({
  groupId,
  selectedSubscriptionId,
  groupName
}: StudentGroupInfoModalProps) {
  const to = useTranslations('organization.group')
  const { closeModal } = useModal()
  const { data } = useGetGroupByIdQuery(groupId, { skip: !groupId })

  const rows = useMemo(
    () =>
      (data?.data.students ?? []).map((item) => ({
        id: item.userId,
        ...item
      })),
    [data]
  )

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogTitle>{to('studentGroupInfo', { groupName: groupName ?? '' })}</DialogTitle>
        <div className='overflow-y-auto sm:max-h-[300px] xl:max-h-[500px] xl:w-4xl'>
          <StudentGroupSubscriptionTable
            groupId={groupId}
            students={rows}
            selectedSubscriptionId={selectedSubscriptionId}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
