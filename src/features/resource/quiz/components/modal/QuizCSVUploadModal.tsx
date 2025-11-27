'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import GenericCSVUploadModal from '@/components/shared/csv/GenericCSVUploadModal'
import { useGetQuizCSVQuery, useImportQuizCSVMutation } from '@/features/resource/quiz/api/quizApi'

export default function QuizCSVUploadModal() {
  const tq = useTranslations('quiz')
  const tt = useTranslations('toast')
  const { quizId } = useParams()
  const { data } = useGetQuizCSVQuery()
  const [importQuizCSV, { isLoading }] = useImportQuizCSVMutation()
  const quizTemplate = data?.data
  const decodeCSV = atob(quizTemplate?.csvFile || '')

  const handleSubmit = async (file: File) => {
    const reader = new FileReader()

    return new Promise<void>((resolve, reject) => {
      reader.onload = async (event) => {
        try {
          const csvBase64 = (event.target?.result as string).split(',')[1]

          await importQuizCSV({ csvFile: csvBase64, quizId: Number(quizId) }).unwrap()
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
      title={tq('import.title')}
      onSubmit={handleSubmit}
      headerTitle={tq('import.headerTitle')}
      headerDescription={tq('import.headerDescription')}
      // isLoading={isLoading}
      successMessage={tt('successMessage.uploadCSV')}
      errorMessage={tt('errorMessage')}
      templateData={decodeCSV}
      templateFileName='quiz_template.csv'
    />
  )
}
