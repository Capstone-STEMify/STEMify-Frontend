import { useGetListLessonAssetsQuery } from '@/features/resource/lesson-asset/api/lessonAssetApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import React from 'react'

export default function LessonAssets() {
  const queryParams = useAppSelector((state) => state.lessonAssetSlice)
  const { data, isLoading } = useGetListLessonAssetsQuery({ lessonId: 1, params: queryParams })
  return <div>UploadImageContent</div>
}
