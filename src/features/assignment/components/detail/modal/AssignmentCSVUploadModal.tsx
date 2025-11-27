'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import GenericCSVUploadModal from '@/components/shared/csv/GenericCSVUploadModal'
import { useGetAssignmentCSVQuery, useImportAssignmentCSVMutation } from '@/features/assignment/api/assignmentApi'
import { useParams } from 'next/navigation'

export default function AssignmentCSVUploadModal() {
  const ta = useTranslations('assignment')
  const tt = useTranslations('toast')
  const { assignmentId } = useParams()
  const { data } = useGetAssignmentCSVQuery()
  const [importAssignmentCSV, { isLoading }] = useImportAssignmentCSVMutation()
  const assignmentTemplate = data?.data
  const decodeCSV = atob(assignmentTemplate?.csvFile || '')

  const handleSubmit = async (file: File) => {
    const reader = new FileReader()

    return new Promise<void>((resolve, reject) => {
      reader.onload = async (event) => {
        try {
          const csvBase64 = (event.target?.result as string).split(',')[1]

          await importAssignmentCSV({ csvFile: csvBase64, assignmentId: Number(assignmentId) }).unwrap()
          resolve()
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      reader.readAsDataURL(file)
    })
  }

  return (
    <GenericCSVUploadModal
      title={ta('import.title')}
      onSubmit={handleSubmit}
      headerTitle={ta('import.headerTitle')}
      headerDescription={ta('import.headerDescription')}
      isLoading={isLoading}
      successMessage={tt('successMessage.uploadCSV')}
      errorMessage={tt('errorMessage')}
      templateData={decodeCSV}
      templateFileName='assignment_template.csv'
    />
  )
}
