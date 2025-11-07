'use client'

import CreateAssignmentPage from '@/features/assignment/components/upsert/UpsertAssignmentContent'

// TODO REMOVE LATER
export function CreateAssignmentPageDemo() {
  const handleSubmit = (data: any) => {
    console.log('Assignment data:', JSON.stringify(data, null, 2))
  }

  const handleCancel = () => {
    console.log('Cancelled')
  }

  const handleSaveDraft = (data: any) => {
    console.log('Saved as draft:', JSON.stringify(data, null, 2))
  }

  const handlePreview = (data: any) => {
    console.log('Preview:', JSON.stringify(data, null, 2))
  }

  return (
    <CreateAssignmentPage
      sectionId={1}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      onSaveDraft={handleSaveDraft}
      onPreview={handlePreview}
    />
  )
}
