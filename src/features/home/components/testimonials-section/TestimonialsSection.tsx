'use client'
import FeedbackCard from '@/components/shared/card/FeedbackCard'
import { useTranslations } from 'next-intl'
import React from 'react'

// src/data/mockData.js
import { LicenseType, UserRole } from '@/types/userRole'

export const feedbackData = [
  {
    src: 'https://images.unsplash.com/photo-1549068106-b024baf5062d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    name: 'Le Nhan',
    date: 'July 15, 2024',
    role: LicenseType.STUDENT,
    title: 'Hấp dẫn và toàn diện',
    rating: 5,
    description:
      'Khóa học "Xây dựng Thành phố" thật tuyệt vời! Các giảng viên rất am hiểu, và các dự án thực hành đã giúp những khái niệm phức tạp trở nên dễ hiểu. Tôi thực sự khuyên dùng nền tảng này cho bất kỳ ai quan tâm đến STEM.'
  },
  {
    src: 'https://images.unsplash.com/photo-1599566150163-29194d2c88b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    name: 'My Lam',
    date: 'August 2, 2024',
    role: UserRole.GUEST,
    title: 'Giá trị tuyệt vời!',
    rating: 4,
    description:
      'Con gái tôi rất thích khóa học "Xây dựng Thành phố". Tài liệu được thiết kế tốt, và các buổi học trực tiếp là cách tuyệt vời để con bé đặt câu hỏi. Đội ngũ hỗ trợ cũng rất nhiệt tình. Một khoản đầu tư tuyệt vời cho tương lai của con bé.'
  },
  {
    src: 'https://github.com/evilrabbit.png',
    name: 'Dat Tran',
    date: 'August 20, 2024',
    role: LicenseType.TEACHER,
    title: 'Khuyến khích cho lớp học',
    rating: 5,
    description:
      'Là một giáo viên, tôi thấy chương trình giảng dạy "Xây dựng Thành phố" được thiết kế rất tốt. Nó hoàn toàn phù hợp với các tiêu chuẩn giáo dục và cung cấp nguồn tài liệu tuyệt vời. Tôi dự định sử dụng các khóa học này như một khóa học bổ sung cho các lớp học của mình.'
  }
]

export default function TestimonialsSection() {
  const t = useTranslations('TestimonialsSection')
  return (
    <section className='relative overflow-hidden bg-yellow-50 px-6 py-10'>
      {/* <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-orange-300 to-yellow-300 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-blue-300 to-purple-300 rounded-full opacity-15 animate-float-delayed"></div> */}
      <div className='absolute top-1/4 left-1/4 h-4 w-4 animate-bounce rounded-full bg-yellow-400 opacity-50'></div>
      <div className='absolute right-1/3 bottom-1/4 h-5 w-5 animate-ping rounded-full bg-orange-400 opacity-40'></div>

      <div className='relative z-10'>
        <h2 className='relative text-center text-3xl font-bold'>
          {t('title')}
          <span className='relative text-yellow-500'>
            STEMify
            <div className='absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 opacity-60'></div>
          </span>
          ?
        </h2>

        <div className='mx-auto grid max-w-6xl gap-8 md:grid-cols-3'>
          {feedbackData.map((feedback, index) => (
            <FeedbackCard
              key={index}
              src={feedback.src}
              name={feedback.name}
              date={feedback.date}
              role={feedback.role}
              title={feedback.title}
              rating={feedback.rating}
              description={feedback.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
