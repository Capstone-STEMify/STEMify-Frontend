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
}

export default function StudentGroupInfoModal({ groupId, selectedSubscriptionId }: StudentGroupInfoModalProps) {
  const to = useTranslations('organization.group')
  const { closeModal } = useModal()
  const { data } = useGetGroupByIdQuery(Number(groupId), { skip: !groupId })

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
        <DialogTitle>{to('studentGroupInfo')}</DialogTitle>
        <ScrollArea className='xl:h-[500px] xl:w-4xl'>
          <div>
            <StudentGroupSubscriptionTable students={rows} selectedSubscriptionId={selectedSubscriptionId} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
