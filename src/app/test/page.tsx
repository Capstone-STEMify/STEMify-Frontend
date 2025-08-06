// LessonPreview.tsx
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

const dataFake = `
# Làm Cầu Nâng

## Mục tiêu
- Hiểu nguyên lý đòn bẩy
- Thiết kế một cây cầu có thể nâng

## Nguyên liệu
- 10 thanh Strawbees
- 6 connector
- 1 miếng bìa

![Bridge Example](https://classroom.strawbees.com/_next/image?url=%2Fmedia%2Fcou_stem-curriculum-for-teks_cover.jpg&w=1920&q=75)

## Các bước
1. Gắn các thanh lại thành hình khung
2. Gắn trục nâng
3. Thử nghiệm nâng bằng tay
`

const LessonPreview = () => {
  return (
    <div className='prose mx-auto max-w-3xl p-4'>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {dataFake}
      </ReactMarkdown>
    </div>
  )
}

export default LessonPreview
