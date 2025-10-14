'use client'

import * as React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/shadcn/tabs'
import WorkspaceTree from '@/features/creator-3d/components/right-sidebar/WorkspaceTree'
import { ObjectInspector } from '@/features/creator-3d/components/right-sidebar/ObjectInspector'
import { useTranslations } from 'next-intl'

export default function CreatorRightPanel() {
  const t3d = useTranslations('creator3D.right_panel')
  return (
    <div className='flex h-full border-l bg-white shadow'>
      {/* Tabs Header */}
      <Tabs defaultValue='tree' className='flex flex-1 flex-col'>
        <TabsList className='mx-auto mt-2 grid w-[90%] grid-cols-2'>
          <TabsTrigger value='tree'>{t3d('workspace_tree')}</TabsTrigger>
          <TabsTrigger value='properties'>{t3d('properties')}</TabsTrigger>
        </TabsList>

        {/* Tree Panel */}
        <TabsContent value='tree' className='flex-1 overflow-y-auto border-t p-3'>
          <WorkspaceTree />
        </TabsContent>

        {/* Properties Panel */}
        <TabsContent value='properties' className='overflow-y-auto border-t p-3'>
          <ObjectInspector />
        </TabsContent>
      </Tabs>
    </div>
  )
}
