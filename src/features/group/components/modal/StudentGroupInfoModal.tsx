'use client'
import React, { useMemo } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import { useGetGroupByIdQuery } from '@/features/group/api/groupApi'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useGetGroupColumn } from '@/features/group/components/detail/GroupColumn'

type StudentGroupInfoModalProps = {
  groupId: number
}

export default function StudentGroupInfoModal({ groupId }: StudentGroupInfoModalProps) {
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
  const columns = useGetGroupColumn()

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogTitle>Student Group Info</DialogTitle>
        <ScrollArea className='h-[500px] w-4xl'>
          <div>
            <DataTable data={rows} columns={columns as any} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
