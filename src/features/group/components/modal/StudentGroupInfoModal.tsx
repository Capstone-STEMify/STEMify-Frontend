'use client'
import React, { useMemo } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import { useGetGroupByIdQuery } from '@/features/group/api/groupApi'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useGetGroupColumn } from '@/features/group/components/detail/GroupColumn'
import { useTranslations } from 'next-intl'

type StudentGroupInfoModalProps = {
  groupId: number
}

export default function StudentGroupInfoModal({ groupId }: StudentGroupInfoModalProps) {
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
  const columns = useGetGroupColumn({ isModal: true })

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogTitle>{to('studentGroupInfo')}</DialogTitle>
        <ScrollArea className='xl:h-[500px] xl:w-4xl'>
          <div>
            <DataTable data={rows} columns={columns as any} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
